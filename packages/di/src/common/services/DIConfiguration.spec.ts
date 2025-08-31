import {Env} from "@tsed/core";

import {DIConfiguration} from "./DIConfiguration.js";

describe("DIConfiguration", () => {
  describe("version()", () => {
    it("should get version", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.version = "1.0.0";
      expect(configuration.version).toEqual("1.0.0");
    });
  });
  describe("env()", () => {
    it("should get env", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.env = Env.DEV;
      expect(configuration.env).toEqual(Env.DEV);
    });
  });
  describe("debug()", () => {
    it("should return debug", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.debug = true;
      expect(configuration.debug).toEqual(true);

      configuration.debug = false;
      expect(configuration.debug).toEqual(false);
    });
  });
  describe("forEach()", () => {
    it("should return all key, value", () => {
      // GIVEN
      const configuration = new DIConfiguration();
      const obj: any = {};
      configuration.forEach((value, key) => {
        obj[key] = value;
      });
      expect(obj).toEqual({
        imports: [],
        logger: {},
        mount: {},
        routes: []
      });
    });
  });
  describe("imports()", () => {
    it("should get imports", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.imports = [];
      expect(configuration.imports).toEqual([]);
    });
  });
  describe("mount()", () => {
    it("should get mount", () => {
      // GIVEN
      const configuration = new DIConfiguration();

      configuration.mount = {};
      expect(configuration.mount).toEqual({});
    });
  });
  describe("decorate()", () => {
    it("should decorate configuration with new method", () => {
      // GIVEN
      const configuration = new DIConfiguration();
      const method = () => "test";

      // WHEN
      configuration.decorate("testMethod", method);

      // THEN
      expect((configuration as any)["testMethod"]).toEqual(method);
    });

    it("should allow accessing decorated method", () => {
      // GIVEN
      const configuration = new DIConfiguration();
      const expected = "result";
      const method = () => expected;

      // WHEN
      configuration.decorate("customMethod", method);
      const result = (configuration as any)["customMethod"]();

      // THEN
      expect(result).toEqual(expected);
    });
  });
});
