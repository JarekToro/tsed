import {injector} from "../index.js";

/**
 * @ignore
 */
export function setLoggerLevel() {
  const {level} = injector().settings.logger;

  if (level) {
    injector().logger.level = level;
  }
}
