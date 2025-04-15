import type {ServerOptions as UseServerOptions} from "graphql-ws";
import type {ServerOptions as WSServerOptions} from "ws";

export interface GraphQLWSOptions {
  path: string;
  schema: UseServerOptions["schema"];
  wsUseServerOptions?: UseServerOptions;
  wsServerOptions?: WSServerOptions;
}

declare global {
  namespace TsED {
    interface ApolloSettings {
      wsUseServerOptions?: UseServerOptions;
      wsServerOptions?: WSServerOptions;
    }
  }
}
