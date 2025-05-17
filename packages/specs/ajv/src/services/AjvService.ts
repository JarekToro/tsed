import "./Ajv.js";

import {deepClone, getValue, nameOf, prototypeOf, setValue, Type} from "@tsed/core";
import {constant, inject, injectable} from "@tsed/di";
import {getJsonSchema, JsonEntityStore, JsonSchema, JsonSchemaObject} from "@tsed/schema";
import {Ajv, ErrorObject} from "ajv";

import {AjvValidationError} from "../errors/AjvValidationError.js";
import {AjvErrorObject, ErrorFormatter} from "../interfaces/IAjvSettings.js";
import {defaultErrorFormatter} from "../utils/defaultErrorFormatter.js";
import {getPath} from "../utils/getPath.js";

export interface AjvValidateOptions extends Record<string, any> {
  schema?: JsonSchema | Partial<JsonSchemaObject>;
  type?: Type<any> | any;
  collectionType?: Type<any> | any;
  returnsCoercedValues?: boolean;
}

export class AjvService {
  readonly name = "ajv";
  protected errorFormatter = constant<ErrorFormatter>("ajv.errorFormatter", defaultErrorFormatter);
  protected returnsCoercedValues = constant<boolean>("ajv.returnsCoercedValues");
  protected ajv = inject(Ajv);

  async validate(value: any, options: AjvValidateOptions | JsonSchema): Promise<any> {
    let {
      schema: defaultSchema,
      type,
      collectionType,
      returnsCoercedValues = this.returnsCoercedValues,
      ...additionalOptions
    } = this.mapOptions(options);

    const schema = defaultSchema || getJsonSchema(type, {...additionalOptions, customKeys: true});

    if (schema) {
      const localValue = this.returnsCoercedValues ? value : deepClone(value);
      const validate = this.ajv.compile(schema);

      const valid = await validate(localValue);
      const {errors} = validate;

      if (!valid && errors) {
        throw this.mapErrors(errors, {
          type,
          collectionType,
          async: true,
          value: localValue
        });
      }

      if (returnsCoercedValues) {
        return localValue;
      }
    }

    return value;
  }

  protected mapOptions(options: AjvValidateOptions | JsonSchema): AjvValidateOptions {
    if (options instanceof JsonSchema) {
      return {
        schema: options.toJSON({customKeys: true})
      };
    }

    return options;
  }

  protected mapErrors(errors: ErrorObject[], options: any) {
    const {type, collectionType, value} = options;

    const message = errors
      .map((error: AjvErrorObject) => {
        if (collectionType) {
          error.collectionName = nameOf(collectionType);
        }

        const dataPath = getPath(error);

        if (!error.data) {
          if (dataPath) {
            error.data = getValue(value, dataPath.replace(/^\./, ""));
          } else if (error.schemaPath !== "#/required") {
            error.data = value;
          }
        }

        if (dataPath && dataPath.match(/pwd|password|mdp|secret/)) {
          error.data = "[REDACTED]";
        }

        if (type) {
          error.modelName = nameOf(type);
          error.message = this.mapClassError(error, type);
        }

        return this.errorFormatter.call(this, error, {});
      })
      .join("\n");

    return new AjvValidationError(message, errors);
  }

  protected mapClassError(error: AjvErrorObject, targetType: Type<any>) {
    const propertyKey = getValue(error, "params.missingProperty");

    if (propertyKey) {
      const store = JsonEntityStore.from<JsonEntityStore>(prototypeOf(targetType), propertyKey);

      if (store) {
        setValue(error, "params.missingProperty", store.name || propertyKey);

        return error.message?.replace(`'${propertyKey}'`, `'${store.name || propertyKey}'`);
      }
    }

    return error.message;
  }
}

injectable(AjvService).type("validator:service");
