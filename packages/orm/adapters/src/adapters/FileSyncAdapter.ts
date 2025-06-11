import {dirname} from "node:path";

import {nameOf} from "@tsed/core";
import {Configuration, Injectable, Opts, ProviderScope, Scope} from "@tsed/di";
import fs from "fs-extra";
import {LowSync} from "lowdb";
import {JSONFileSync} from "lowdb/node";

import {AdapterConstructorOptions} from "../domain/Adapter.js";
import {AdapterModel, LowDbAdapter, type LowModel} from "./LowDbAdapter.js";

export interface FileSyncAdapterConstructorOptions extends AdapterConstructorOptions {
  readOnly: true;
}

@Injectable()
@Scope(ProviderScope.INSTANCE)
export class FileSyncAdapter<T extends AdapterModel> extends LowDbAdapter<T> {
  constructor(@Opts options: FileSyncAdapterConstructorOptions, @Configuration() configuration: Configuration) {
    super(options, configuration);

    fs.ensureDirSync(dirname(this.dbFilePath));

    const file = new JSONFileSync<LowModel<T>>(this.dbFilePath);

    this.db = new LowSync<LowModel<T>>(file, {
      collectionName: this.collectionName,
      modelName: nameOf(this.model),
      collection: []
    });
    this.db.read();

    if (options.readOnly) {
      file.write = (() => {}) as any;
    }
  }
}
