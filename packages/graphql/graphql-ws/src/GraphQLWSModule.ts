import Http from "node:http";
import Https from "node:https";

import {constant, inject, logger, Module} from "@tsed/di";
import {useServer} from "graphql-ws/use/ws";
import {WebSocketServer} from "ws";

import {GraphQLWSOptions} from "./GraphQLWSOptions.js";

@Module()
export class GraphQLWSModule {
  private settings = constant<GraphQLWSOptions>("graphqlWs", {} as GraphQLWSOptions);
  private httpServer = inject<Http.Server | null>(Http.Server);
  private httpsServer = inject<Https.Server | null>(Https.Server);

  async createWSServer(settings: GraphQLWSOptions) {
    const opts = {
      ...(this.settings.wsServerOptions || {}),
      ...settings.wsServerOptions,
      server: this.httpsServer || this.httpServer!,
      path: settings.path
    };

    const wsServer = new WebSocketServer(opts);

    return useServer(
      {
        ...(this.settings.wsUseServerOptions || {}),
        ...settings.wsUseServerOptions,
        schema: settings.schema
      },
      wsServer
    );
  }

  async $alterApolloServerPlugins(plugins: any[], settings: GraphQLWSOptions) {
    const wsServer = await this.createWSServer(settings);

    logger().info(`Create GraphQL WS server on: ${settings.path}`);

    return plugins.concat({
      serverWillStart() {
        return {
          async drainServer() {
            await wsServer.dispose();
          }
        };
      }
    } as any);
  }
}
