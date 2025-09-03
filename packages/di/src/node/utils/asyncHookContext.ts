import {AsyncLocalStorage, AsyncResource} from "node:async_hooks";

import type {DIContext} from "../../common/domain/DIContext.js";
import {InjectorService} from "../../common/index.js";

const storage: AsyncLocalStorage<{current: DIContext | undefined}> = new AsyncLocalStorage();

export function getAsyncStore() {
  return storage;
}

export function useContextRef() {
  return getAsyncStore().getStore();
}

export function getContext<Context = DIContext>(initialValue?: DIContext): Context | undefined {
  return initialValue || (useContextRef()?.current as any);
}

export async function runInContext<Result = unknown>(
  ctx: DIContext | undefined,
  cb: (...args: unknown[]) => Result,
  injector?: InjectorService
): Promise<Result> {
  const ref = useContextRef();

  if (ref) {
    ctx && setContext(ctx);
    return cb();
  } else {
    injector = ctx?.injector || injector;
    cb = (await injector?.alterAsync("$alterRunInContext", cb)) || cb;

    return storage.run({current: ctx}, cb);
  }
}

export function setContext(ctx: DIContext) {
  const ref = useContextRef();

  if (ref && !ref.current) {
    ref.current = ctx;
  }
}

/**
 * @deprecated
 */
export function bindContext(cb: any) {
  return AsyncResource.bind(cb);
}
