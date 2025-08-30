import {Ajv, type ErrorObject} from "ajv";

const ajv = new Ajv({
  verbose: false,
  coerceTypes: true,
  strict: false,
  discriminator: true,
  allErrors: true
});

class ValidationError extends Error {
  private errors: ErrorObject[];

  constructor(message: string, errors: ErrorObject[]) {
    super(message);
    this.name = "VALIDATION_ERROR";
    this.errors = errors;
  }
}

export function validate(configName: string, config: Record<string, unknown>, validationSchema: any) {
  const schema = "toJSON" in validationSchema ? validationSchema.toJSON() : validationSchema;

  const validate = ajv.compile(schema);
  const result = validate(config);

  if (!result && validate.errors) {
    const firstError = validate.errors[0];
    const message = `extends[${configName}].${firstError?.instancePath?.substring(1) || ""} ${firstError?.message}.`;

    throw new ValidationError(message, validate.errors);
  }

  return config;
}
