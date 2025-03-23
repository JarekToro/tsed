import {Controller} from "@tsed/di";
import {ObjectID} from "@tsed/mongoose";
import {Docs} from "@tsed/openapi-utils";
import {PlatformExpress} from "@tsed/platform-express";
import {PlatformTest} from "@tsed/platform-http/testing";
import {BodyParams, PathParams} from "@tsed/platform-params";
import {Consumes, Description, Get, Hidden, Post, Returns} from "@tsed/schema";
import SuperTest from "supertest";

import {Calendar} from "./app/models/Calendar.js";
import {Server} from "./app/Server.js";

@Controller("/admin")
@Hidden()
class AdminCtrl {
  @Get("/")
  get() {}
}

@Controller("/events")
class EventCtrl {
  @Get("/")
  @Description("Events")
  get() {}
}

@Controller("/admin")
@Docs("admin")
class BackAdminCtrl {
  @Get("/")
  @Description("Admins")
  get() {}
}

@Controller({
  path: "/calendars",
  children: [AdminCtrl, EventCtrl]
})
class CalendarsController {
  @Get("/:id")
  @Returns(200, Calendar)
  get(@PathParams("id") @ObjectID() id: string): Promise<Calendar> {
    return Promise.resolve(new Calendar({id, name: "test"}));
  }

  @Get("/")
  @(Returns(200, Array).Of(Calendar))
  getAll(): Promise<Calendar[]> {
    return Promise.resolve([new Calendar({id: 1, name: "name"}), new Calendar({id: 2, name: "name"})]);
  }

  @Post("/csv")
  @Consumes("text/plain")
  @(Returns(200, String).ContentType("text/plain"))
  csv(@BodyParams() csvLines: string): Promise<string> {
    return Promise.resolve("");
  }
}

describe("Swagger integration", () => {
  describe("OpenSpec", () => {
    let request: SuperTest.Agent;
    beforeEach(
      PlatformTest.bootstrap(Server, {
        adapter: PlatformExpress as any,
        swagger: [
          {
            path: "/v2/doc",
            specVersion: "2.0",
            showExplorer: true,
            operationIdPattern: "%c_%m",
            spec: {
              info: {
                title: "Swagger title",
                version: "1.2.0"
              }
            }
          },
          {
            path: "/v3/doc",
            specVersion: "3.0.1",
            operationIdFormatter(name: string, propertyKey, path: string) {
              return name + "__" + propertyKey;
            },
            showExplorer: true
          }
        ],
        mount: {
          "/rest": [CalendarsController]
        }
      })
    );
    beforeEach(() => {
      request = SuperTest(PlatformTest.callback());
    });
    afterEach(PlatformTest.reset);

    it("should swagger spec 2", async () => {
      const response = await request.get("/v2/doc/swagger.json").expect(200);

      expect(response.body).toMatchSnapshot();
    });
    it("should swagger spec 3", async () => {
      const response = await request.get("/v3/doc/swagger.json").expect(200);

      expect(response.body).toMatchSnapshot();
    });
  });
});
