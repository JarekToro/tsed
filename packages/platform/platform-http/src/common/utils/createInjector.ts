import {attachLogger, injector} from "@tsed/di";
import {$log} from "@tsed/logger";

import {adapter as $adapter} from "../fn/adapter.js";
import {PlatformAdapter} from "../services/PlatformAdapter.js";

$log.name = "TSED";

export function createInjector(settings: Partial<TsED.Configuration>) {
  const inj = injector();
  inj.settings.set(settings);

  attachLogger($log);

  $adapter(settings.adapter);

  inj.invoke(PlatformAdapter);

  return inj;
}
