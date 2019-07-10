"use strict";

import { ioc, registrar } from "@adonisjs/fold";
import { Config } from "@adonisjs/sink";
import * as path from "path";
import { Macroable } from "macroable";

class Context extends Macroable {
  public static _macros: {};
  public static _getters: {};

  public static onReady() {}
}

//
// class UnamedController {
//   public name (parent, args, ctx) {
//   }
// }
//
// class MutationUnamedController {
//   public addName (parent, args, ctx) {
//   }
// }

module.exports = async () => {
  ioc.bind("Adonis/Src/HttpContext", () => {
    return Context;
  });

  ioc.bind("Adonis/Src/Config", () => {
    const config = new Config();

    config.set("grafql", {
      kernel: "gqlKernel"
    });

    return config;
  });

  // ioc.bind('App/Controllers/Gql/Queries/UnamedController', () => {
  //   return UnamedController
  // })
  //
  // ioc.bind('App/Controllers/Gql/Mutations/UnamedController', () => {
  //   return MutationUnamedController
  // })

  await registrar
    .providers([path.join(__dirname, "../../../providers/GQLProvider")])
    .registerAndBoot();
};
