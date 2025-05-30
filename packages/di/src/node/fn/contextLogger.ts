import {context} from "./context.js";

/**
 * Get the current logger instance. If the logger() function is invoked in Request context, it will return the logger instance attached to the request context.
 * Otherwise, it will return the logger instance attached to the DI context.
 */
export function contextLogger() {
  return context().logger;
}
