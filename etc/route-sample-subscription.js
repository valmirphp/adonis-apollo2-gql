"use strict";

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URLs and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use("Route");
const { PubSub } = require("apollo-server");

// const { Demo } = require("adonis-apollo2-gql");
// console.log(new Demo().demo());

const { ApolloServer, gql } = require("adonis-apollo2");
const { combineResolvers } = require("graphql-resolvers");

const protectedField = (root, args, context, info) => "Protected field value";
const isAuthenticated = (root, args, context, info) => {
  // if (!context.user) {
  //   return new Error('Not authenticated')
  // }
};

const pubsub = new PubSub();

const EVENTS = {
  BOOK: {
    ADDED: "BOOK_ADDED"
  }
};

// This is a (sample) collection of books we'll be able to query
// the GraphQL server for.  A more complete example might fetch
// from an existing data source like a REST API or database.
const books = [
  {
    title: "Harry Potter and the Chamber of Secrets",
    author: "J.K. Rowling"
  },
  {
    title: "Jurassic Park",
    author: "Michael Crichton"
  }
];
//
// // Construct a schema, using GraphQL schema language
const typeDefs = gql`
  # Comments in GraphQL are defined with the hash (#) symbol.

  # This "Book" type can be used in other type declarations.
  type Book {
    title: String
    author: String
  }

  # The "Query" type is the root of all GraphQL queries.
  # (A "Mutation" type will be covered later on.)
  type Query {
    books: [Book]
  }

  type Mutation {
    addBook(title: String!, author: String): Book
  }

  type Subscription {
    bookAdded: Book
  }
`;

// Provide resolver functions for your schema fields
const resolvers = {
  Query: {
    books: () => books
    //  books: combineResolvers(isAuthenticated, () => Promise.resolve(books))
  },
  Mutation: {
    addBook: async (_, { title, author }) => {
      // const product = await Product.create({ id, description, price });
      const book = { title, author };
      console.log(book);
      books.push(book);
      pubsub.publish(EVENTS.BOOK.ADDED, { book });
      return book;
    }
  },
  Subscription: {
    bookAdded: {
      // Additional event labels can be passed to asyncIterator creation
      resolve: ({ book }) => book,
      subscribe: () => pubsub.asyncIterator([EVENTS.BOOK.ADDED])
    }
  }
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req, connection }) => {
    if (!req || !req.headers) {
      return;
    }

    return { authorized: true };
  },
  tracing: true
});

server.registerRoutes(use("Route"));
server.registerSubscription(use("Adonis/Src/Server"));

Route.get("/", () => {
  return { greeting: "Hello world in JSON" };
});
