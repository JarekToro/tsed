import {IncomingMessage, ServerResponse} from "node:http";

import {Type} from "@tsed/core";
import {configuration, constant, inject, injectable} from "@tsed/di";
import {$on} from "@tsed/hooks";
import type {PlatformMulter, PlatformMulterSettings} from "@tsed/platform-multer";
import {PlatformHandlerMetadata, PlatformLayer} from "@tsed/platform-router";

import type {PlatformStaticsOptions} from "../config/PlatformStaticsSettings.js";
import {application} from "../fn/application.js";
import {createHttpServer} from "../utils/createHttpServer.js";
import {createHttpsServer} from "../utils/createHttpsServer.js";
import {CreateServerReturn} from "../utils/createServer.js";
import {Platform} from "./Platform.js";
import {PlatformApplication} from "./PlatformApplication.js";
import {PlatformHandler} from "./PlatformHandler.js";

export abstract class PlatformAdapter<App = TsED.Application> {
  abstract readonly NAME: string;

  readonly app = inject<PlatformApplication<App>>(PlatformApplication);

  constructor() {
    const platformApp = inject(PlatformApplication);

    const {app, callback} = this.createApp();
    platformApp.rawApp = app as any;
    platformApp.rawCallback = callback;

    $on("$afterInvoke", PlatformAdapter, () => {
      configuration().set("PLATFORM_NAME", constant("PLATFORM_NAME") || this.NAME);
    });
  }

  getServers(): CreateServerReturn[] {
    const app = application<App>();
    return [createHttpServer(app.callback()), createHttpsServer(app.callback())].filter(Boolean) as any[];
  }

  onInit(): Promise<void> | void {
    return Promise.resolve();
  }

  beforeLoadRoutes(): Promise<void> | void {
    return Promise.resolve();
  }

  afterLoadRoutes(): Promise<void> | void {
    return Promise.resolve();
  }

  /**
   * create initial context
   */
  abstract useContext(): Promise<void> | void;

  /**
   * Map router layer to the targeted framework
   */
  abstract mapLayers(layer: PlatformLayer[]): void;

  /**
   * Map handler to the targeted framework
   */
  mapHandler(handler: Function, layer: PlatformHandlerMetadata): Function {
    return handler;
  }

  /**
   * Return the app instance
   */
  abstract createApp(): {app: App; callback(): (req: IncomingMessage, res: ServerResponse) => void};

  /**
   * Return the statics middlewares
   * @param endpoint
   * @param options
   */
  abstract statics(endpoint: string, options: PlatformStaticsOptions): any;

  /**
   * Return the multipart middleware
   * @param options
   * @deprecated use inject("MULTER_MODULE")?.get(options) instead
   */
  multipart(options: PlatformMulterSettings): PlatformMulter {
    return inject<any>(Symbol.for("MULTER_MODULE"))?.get(options);
  }

  /**
   * Return the body parser for the given
   * @param type
   * @param opts
   */
  abstract bodyParser(type: string, opts?: Record<string, any>): any;
}

export interface PlatformBuilderSettings<App = TsED.Application> extends Partial<TsED.Configuration> {
  adapter?: Type<PlatformAdapter<App>>;
}

injectable(PlatformAdapter).imports([PlatformApplication, Platform, PlatformHandler]).alias("PlatformAdapter");
