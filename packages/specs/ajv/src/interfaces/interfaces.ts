import {AjvSettings} from "./AjvSettings.js";

declare global {
  namespace TsED {
    interface Configuration {
      ajv?: AjvSettings;
    }
  }
}
