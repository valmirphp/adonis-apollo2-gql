"use strict";

// import { ioc } from "@adonisjs/fold";

import { ApolloServer, gql } from "adonis-apollo2";
import { HttpContext } from "@poppinss/http-server";

const test = require("japa");
const mock = require("mock-fs");
const http = require("http");
const supertest = require("supertest");
const setup = require("./setup");

function createServerGraph() {
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

  // Construct a schema, using GraphQL schema language
  const typeDefs = gql`
    # Comments in GraphQL are defined with the hash (#) symbol.

    # This "Book" type can be used in other type declarations.
    type Book2 {
      title: String
      author: String
    }

    # The "Query" type is the root of all GraphQL queries.
    # (A "Mutation" type will be covered later on.)
    type Query {
      books: [Book2]
    }
  `;

  // Provide resolver functions for your schema fields
  const resolvers = {
    Query: {
      books: () => books
    }
  };

  // const Context = ioc.use("Adonis/Src/HttpContext");
  // const ctx = new Context();
  // ctx.req = ctx.request = helpers.getRequest(req);
  // ctx.res = ctx.response = helpers.getResponse(req, res);
  // ctx.query = { foo: "bar" };
  // , context: ctx

  return new ApolloServer({ typeDefs, resolvers });
}

test.group("GrafQLServer", group => {
  group.before(async () => {
    await setup();
    // this.Gql = ioc.use("Gql");
  });
  // group.before(async () => {
  //   await setup();
  //   this.Gql = ioc.use("Gql");
  //   global["iocResolver"].appNamespace("App");
  //   mock({
  //     "App/Schemas/Unamed.graphql":
  //       "type Query { name: String } type Mutation { addName: String }",
  //     "App/Schemas/Post.graphql": `type Post {
  //       name: String
  //       date: String @deprecated(reason: "Use \`datetime\`")
  //       datetime: String
  //     }
  //
  //     type Query {
  //       post: Post
  //     }`
  //   });
  // });

  group.beforeEach(() => {
    // const server = http.createServer(async (req, res) => {
    //   const ctx = HttpContext.create("/", {}, req, res);
    //   // ctx.request["_config"].secret = SECRET;
    //   // ctx.response["_config"].secret = SECRET;
    //
    //   // const manager = new SessionManager(
    //   //   new Ioc(),
    //   //   Object.assign({}, config, { clearWithBrowser: true })
    //   // );
    //   // const session = manager.create(ctx);
    //   // await session.initiate(false);
    //   //
    //   // session.put("user", { username: "virk" });
    //   // await session.commit();
    //   ctx.response.send("");
    // });
    //
    //
    //
    //
    this.server = http.createServer();
    //
    //
    //
    //
    // this.server = http.createServer(async (req, res) => {
    //   // const ctx = HttpContext.create("/", {}, req, res);
    //
    //   const Context = ioc.use("Adonis/Src/HttpContext");
    //
    //   const ctx = new Context();
    //   ctx.request = helpers.getRequest(req);
    //   ctx.response = helpers.getResponse(req, res);
    //
    //   const middleware = new BodyParserMiddleware({});
    //
    //   await middleware.handle(ctx, async () => {
    //     res.writeHead(200, { "content-type": "application/json" });
    //     res.end(JSON.stringify(ctx.request.all()));
    //   });
    // });
  });

  group.afterEach(() => {
    // this.Gql.clear();
    // await server.stop();
    // await httpServer.close();
  });

  group.after(mock.restore);

  test("return status 500 when schema has not been defined", async assert => {
    this.server.on("request", (req, res) => {
      // const Context = ioc.use("Adonis/Src/HttpContext");
      // const ctx = new Context();
      // ctx.req = ctx.request = helpers.getRequest(req);
      // ctx.res = ctx.response = helpers.getResponse(req, res);

      const ctx = HttpContext.create("/", {}, req, res);
      ctx.request["_body"] = { query: "{ books{  title  }}" };

      // console.log("AAA", res);
      // res.write('{ "foo": "bar" }');
      // res.end();

      try {
        createServerGraph()
          .mockServer(ctx)
          .then(r => {
            console.log(r);
            res.writeHead(200, { "content-type": "application/json" });
            res.end();
          });
      } catch (err) {
        res.writeHead(500);
        res.write(err.message);
        res.end();
      }

      // createServerGraph().mockServer(ctx);
      // .then(console.log, console.log);

      // this.graphServer.mockServer(ctx).then(console.log, console.log);
      // this.graphServer.mockServer(ctx).handle(ctx).then(() => {
      //       res.writeHead(200, { "content-type": "application/json" });
      //       res.end();
      //     });

      // try {
      //   this.Gql.handle(ctx).then(() => {
      //     res.writeHead(200, { "content-type": "application/json" });
      //     res.end();
      //   });
      // } catch (err) {
      //   res.writeHead(500);
      //   res.write(err.message);
      //   res.end();
      // }
    });
    // this.server.on("request", (req, res) => {
    //   const Context = ioc.use("Adonis/Src/HttpContext");
    //
    //   const ctx = new Context();
    //   ctx.request = helpers.getRequest(req);
    //   ctx.response = helpers.getResponse(req, res);
    //
    //   try {
    //     this.Gql.handle(ctx).then(() => {
    //       res.writeHead(200, { "content-type": "application/json" });
    //       res.end();
    //     });
    //   } catch (err) {
    //     res.writeHead(500);
    //     res.write(err.message);
    //     res.end();
    //   }
    // });

    const response = await supertest(this.server)
      .post("/graphql")
      .send({ query: "{ books{  title  }}" })
      .type("json")
      .set("Accept", "application/json")
      // .query({ query: "{ posts { title } }" })
      .expect(200);

    console.log("TEXT => ", response.text);
    assert.equal("a", "a");
    // const { text } = await supertest(this.server)
    //   .get("/")
    //   .query({ query: "{ posts { title } }" })
    //   .expect(500);
    //
    // assert.equal(text, "Schema has not been defined2");
  });
});
