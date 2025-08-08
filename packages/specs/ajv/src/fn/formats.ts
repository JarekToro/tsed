import {injectable, type TokenProvider} from "@tsed/di";
import {AsyncFormatDefinition, FormatDefinition} from "ajv";

export type FormatsOptions = Omit<FormatDefinition<any>, "validate" | "compare"> | Omit<AsyncFormatDefinition<any>, "validate" | "compare">;

/**
 * Create a new custom formats validator
 * @param token
 * @param name
 * @param options
 * @ajv
 */
export function formats(token: TokenProvider, name: string, options: FormatsOptions = {}): ReturnType<typeof injectable> {
  return injectable(token, {type: "ajv:formats"}).set("ajv:formats", {
    name,
    options
  });
}
