import {DILogger, injector} from "../../common/index.js";
import {setLoggerConfiguration} from "./setLoggerConfiguration.js";

export function attachLogger($log: DILogger) {
  injector().logger = $log;
  setLoggerConfiguration();
}
