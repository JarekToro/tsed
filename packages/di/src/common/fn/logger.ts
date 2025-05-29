import {injector} from "./injector.js";

/**
 * Get the current `injector.logger` instance.
 */
export function logger() {
  return injector().logger;
}
