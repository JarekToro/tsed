import Http from "node:http";
import Https from "node:https";

import {ApolloServer, ApolloServerOptions, ApolloServerPlugin} from "@apollo/server";
import {ApolloServerPluginLandingPageDisabled} from "@apollo/server/plugin/disabled";
import {ApolloServerPluginDrainHttpServer} from "@apollo/server/plugin/drainHttpServer";
import {ApolloServerPluginLandingPageLocalDefault} from "@apollo/server/plugin/landingPage/default";
import type {IExecutableSchemaDefinition} from "@graphql-tools/schema";
import {constant, context, inject, injectable, injector, LocalsContainer, logger, Provider} from "@tsed/di";
import {$asyncAlter} from "@tsed/hooks";
import {PlatformApplication, PlatformContext} from "@tsed/platform-http";
import type {GraphQLSchema} from "graphql";

import {APOLLO_CONTEXT, DATASOURCES_PROVIDERS} from "../constants/constants.js";
import {ApolloContext} from "../interfaces/ApolloContext.js";
import type {ApolloCustomServerCB, ApolloSettings} from "../interfaces/ApolloSettings.js";

export class ApolloService {
  platformName = constant<string>("PLATFORM_NAME");

  /**
   *
   * @type {Map<any, any>}
   * @private
   */
  protected servers: Map<
    string,
    {
      instance: ApolloServer<ApolloContext>;
      schema?: GraphQLSchema;
      typeDefs?: IExecutableSchemaDefinition<ApolloContext>["typeDefs"];
      resolvers?: IExecutableSchemaDefinition<ApolloContext>["resolvers"];
    }
  > = new Map();

  protected app = inject(PlatformApplication);
  protected httpServer = inject<Http.Server | null>(Http.Server);
  protected httpsServer = inject<Https.Server | null>(Https.Server);

  async createServer(id: string, settings: ApolloSettings) {
    if (!this.has(id)) {
      try {
        const {dataSources, path, middlewareOptions = {}, server: customServer, ...config} = settings;

        logger().info(`Create server with Apollo for: ${id}`);
        logger().debug(`options: ${JSON.stringify({path})}`);

        const plugins = await this.getPlugins(settings);

        const server = this.createInstance(
          {
            ...config,
            plugins
          } as never,
          customServer
        );

        if (server) {
          this.servers.set(id || "default", {
            instance: server,
            schema: settings.schema,
            typeDefs: settings.typeDefs,
            resolvers: settings.resolvers
          });

          await server.start();

          const contextHandler = this.createContextHandler(server, settings);

          switch (this.platformName) {
            case "express":
              const {expressMiddleware} = await import("@apollo/server/express4");

              this.app.use(
                path,
                expressMiddleware(server as any, {
                  ...middlewareOptions,
                  context: contextHandler
                })
              );
              break;

            case "koa":
              const {koaMiddleware} = await import("@as-integrations/koa");

              this.app.use(
                path,
                koaMiddleware(server as any, {
                  ...middlewareOptions,
                  context: contextHandler
                })
              );
              break;
            default:
              logger().warn({
                event: "APOLLO_UNKNOWN_PLATFORM",
                message: "Platform not supported. Please use Ts.ED platform (express, koa)"
              });
          }
        }
      } catch (er) {
        logger().error({
          event: "APOLLO_BOOTSTRAP_ERROR",
          error_name: er.name,
          message: er.message,
          stack: er.stack
        });
        throw er;
      }
    }

    return this.get(id)!;
  }

  /**
   * Get an instance of ApolloServer from his id
   * @returns ApolloServer
   */
  get(id: string = "default"): ApolloServer<ApolloContext> | undefined {
    return this.servers.get(id)?.instance;
  }

  /**
   * Get schema of the ApolloServer from his id
   * @returns GraphQLSchema
   */
  getSchema(id: string = "default") {
    return this.servers.get(id)?.schema;
  }

  /**
   * Get TypeDefs of the ApolloServer from his id
   */
  getTypeDefs(id: string = "default") {
    return this.servers.get(id)?.typeDefs;
  }

  getResolvers(id: string = "default") {
    return this.servers.get(id)?.resolvers;
  }

  /**
   *
   * @param {string} id
   * @returns {boolean}
   */
  has(id: string = "default"): boolean {
    return this.servers.has(id);
  }

  /**
   * create a new dataSources function to use with apollo server config
   */
  createContextHandler(server: ApolloServer<ApolloContext>, settings: ApolloSettings) {
    const dataSourcesContainer = injector()
      .getProviders(DATASOURCES_PROVIDERS)
      .reduce((map, provider) => {
        let {name} = provider.store.get(DATASOURCES_PROVIDERS);

        name = name || provider.className;

        const sourceName = `${name[0].toLowerCase()}${name.slice(1)}`;
        map.set(sourceName, provider);

        return map;
      }, new Map<string, Provider>());

    return async () => {
      const $ctx = context<PlatformContext>();
      const apolloContext: ApolloContext = {
        dataSources: {
          ...(settings.dataSources?.() || {})
        }
      };

      const alteredContext = await $asyncAlter("$alterApolloContext", apolloContext, [$ctx]);

      $ctx!.set(APOLLO_CONTEXT, alteredContext);

      const locals = new LocalsContainer();
      locals.set(APOLLO_CONTEXT, alteredContext);
      locals.set(ApolloServer, server);

      dataSourcesContainer.forEach((provider, key) => {
        alteredContext.dataSources[key] = inject(provider.token, {locals});
      });

      return alteredContext;
    };
  }

  protected createInstance(options: ApolloServerOptions<ApolloContext>, server?: ApolloCustomServerCB<ApolloContext>) {
    return server ? server(options) : new ApolloServer(options);
  }

  private async getPlugins(serverSettings: ApolloSettings): Promise<ApolloServerPlugin[]> {
    const playground = serverSettings.playground || (serverSettings.playground === undefined && process.env.NODE_ENV !== "production");

    const result: ApolloServerPlugin[] = await $asyncAlter(
      "$alterApolloServerPlugins",
      [
        this.httpServer &&
          ApolloServerPluginDrainHttpServer({
            httpServer: this.httpServer
          }),
        this.httpsServer &&
          ApolloServerPluginDrainHttpServer({
            httpServer: this.httpsServer
          }),
        ...(serverSettings.plugins || [])
      ].filter(Boolean),
      [serverSettings]
    );

    return result
      .concat([playground ? ApolloServerPluginLandingPageLocalDefault({embed: true}) : ApolloServerPluginLandingPageDisabled()])
      .filter(Boolean);
  }
}

injectable(ApolloService);
