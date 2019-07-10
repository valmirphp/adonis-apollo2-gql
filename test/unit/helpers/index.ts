import * as url from "url";
import { makeExecutableSchema } from "graphql-tools";

export function getRequest(req) {
  console.log("**************", req);
  return {
    request: req,
    _body: req.body,
    method() {
      return req.method;
    },
    post() {
      return req.body;
    },
    get() {
      return url.parse(req.url, true).query;
    }
  };
  // return {
  //   request: req,
  //   _body: { query: "{ books{  title  }}" },
  //   method() {
  //     return "POST";
  //     // return this.request.method;
  //   },
  //   post() {
  //     return { query: "{ books{  title  }}" };
  //     // return this.request.body;
  //   },
  //   get() {
  //     return this.post();
  //     // return url.parse(this.request.url, true).query;
  //   }
  // };
}

export function getResponse(req, res) {
  return {
    cache: null,
    request: req,
    response: res,
    status(code) {
      res.statusCode = code;
      return this;
    },
    type(type = "text/plain", code = 200) {
      res.writeHead(code, { "Content-Type": type });
    },
    json(response) {
      try {
        const parsedData = JSON.parse(response);
        this.cache = parsedData;
        this.send(parsedData);
      } catch (e) {}
    },
    on(name, listener) {
      res.on(name, listener);
    },
    send(message) {
      res.write(message);
      res.end();
    },
    header(name, value) {
      this.response.setHeader(name, value);
    }
  };
}

export function getTypeDef() {
  return `
    type User {
      id: Int
      username: String
      email: String
      password: String
      posts: [Post]
    }
  
    type Post {
      id: Int
      title: String
      content: String
      author: User
    }
  
    type Query {
      posts: [Post]
    }
  `;
}

export function getSchema() {
  return makeExecutableSchema({ typeDefs: this.getTypeDef() });
}
