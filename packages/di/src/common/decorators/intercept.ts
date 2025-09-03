import {DecoratorParameters} from "@tsed/core/types/DecoratorParameters.js";
import {DecoratorTypes} from "@tsed/core/types/DecoratorTypes.js";
import {Store} from "@tsed/core/types/Store.js";
import type {Type} from "@tsed/core/types/Type.js";
import {classOf} from "@tsed/core/utils/classOf.js";
import {decorateMethodsOf} from "@tsed/core/utils/decorateMethodsOf.js";
import {decoratorTypeOf} from "@tsed/core/utils/decoratorTypeOf.js";

import {DI_INTERCEPTOR_OPTIONS, DI_INVOKE_OPTIONS} from "../constants/constants.js";
import {inject} from "../fn/inject.js";
import type {InterceptorContext} from "../interfaces/InterceptorContext.js";
import type {InterceptorMethods} from "../interfaces/InterceptorMethods.js";
import type {InvokeOptions} from "../interfaces/InvokeOptions.js";
import type {TokenProvider} from "../interfaces/TokenProvider.js";

export function getInterceptorOptions<T>(target: Type<any>, propertyKey: string | symbol) {
  return Store.fromMethod(target, propertyKey).get(DI_INTERCEPTOR_OPTIONS) as T;
}

export function bindIntercept(target: any, propertyKey: string | symbol, token: TokenProvider, options: Record<string, unknown>) {
  const klass = classOf(target);
  const descriptor = Reflect.getOwnPropertyDescriptor(klass.prototype, propertyKey);
  const originalMethod = descriptor!.value;
  const symbol = Symbol();

  Store.fromMethod(klass, propertyKey).set(DI_INTERCEPTOR_OPTIONS, options);

  function newMethod(...args: any[]) {
    const next = (err?: Error) => {
      if (!err) {
        return originalMethod.apply(this, args);
      }

      throw err;
    };

    const context: InterceptorContext<any> = {
      target: klass,
      propertyKey,
      args,
      options,
      next
    };

    const invokeOpts: Partial<InvokeOptions> = {
      rebuild: !!this[DI_INVOKE_OPTIONS]?.rebuild,
      locals: this[DI_INVOKE_OPTIONS]?.locals
    };

    this[symbol] = this[symbol] || inject(token, invokeOpts)!;

    return this[symbol].intercept!(
      {
        ...context,
        options
      },
      next
    );
  }

  descriptor!.value = newMethod;

  Reflect.deleteProperty(klass.prototype, propertyKey);
  Reflect.defineProperty(klass.prototype, propertyKey, descriptor!);

  return descriptor;
}

/**
 * Attaches interceptor to method call and executes the before and after methods
 *
 * @param interceptor
 * @param options
 * @decorator
 */
export function Intercept<T extends InterceptorMethods>(interceptor: Type<T>, options?: any): any {
  return (...args: DecoratorParameters) => {
    const [target, propertyKey] = args;
    const type = decoratorTypeOf(args);
    switch (type) {
      case DecoratorTypes.CLASS:
        decorateMethodsOf(target, Intercept(interceptor, options));
        break;
      case DecoratorTypes.METHOD:
        return bindIntercept(target, propertyKey, interceptor, options);
    }
  };
}
