import {Env} from "@tsed/core";
import {constant} from "@tsed/di";
import {$on} from "@tsed/hooks";

import {PlatformMiddlewareLoadingOptions} from "../domain/PlatformMiddlewareSettings.js";

export function alterMiddlewaresForHook(middlewares: PlatformMiddlewareLoadingOptions[], hook: string) {
  const env = constant<Env>("env");

  return middlewares.filter((options) => options.use && (!options.env || options.env === env) && options.hook === hook);
}

/**
 * @deprecated will be remove in the next major version
 */
export const getMiddlewaresForHook = alterMiddlewaresForHook;

$on("$alterMiddlewaresForHook", alterMiddlewaresForHook);
