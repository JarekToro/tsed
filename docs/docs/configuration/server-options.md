---
head:
  - - meta
    - name: description
      content: Documentation over the server configuration. Ts.ED is built on top of Express/Koa and use TypeScript language.
  - - meta
    - name: keywords
      content: configuration ts.ed express typescript node.js javascript decorators mvc class models
---

# Server Options

## rootDir

- type: `string`

The root directory where you build run project. By default, it is equal to `process.cwd()`.

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  rootDir: process.cwd()
})
export class Server {}
```

## env

- type: @@Env@@

The environment profiles. By default the environment profile is equal to `NODE_ENV`.

```typescript
import {Env} from "@tsed/core";
import {Configuration, Constant} from "@tsed/di";

@Configuration({
  env: Env.PROD
})
export class Server {
  @Constant("env")
  env: Env;

  $beforeRoutesInit() {
    if (this.env === Env.PROD) {
      // do something
    }
  }
}
```

## httpPort

- type: `string` | `number` | `false`

Port number for the [HTTP.Server](https://nodejs.org/api/http.html#http_class_http_server).
Set `false` to disable the http port.

### httpsPort

- type: `string` | `number` | `false`

Port number for the [HTTPs.Server](https://nodejs.org/api/https.html#https_class_https_server).

## httpsOptions

- type: [Https.ServerOptions](https://nodejs.org/api/tls.html#tls_tls_createserver_options_secureconnectionlistener)
  - `key` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer)
    | &lt;Object[]&gt;: The private key of the server in PEM format. To support multiple keys using different
    algorithms, an array can be provided either as a plain array of key strings or an array of objects in the
    format `{pem: key, passphrase: passphrase}`. This option is required for ciphers making use of private keys.
  - `passphrase` &lt;string&gt; A string containing the passphrase for the private key or pfx.
  - `cert` &lt;string&gt; | &lt;string[]&gt;
    | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer)
    | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings,
    or array of Buffers containing the certificate key of the server in PEM format. (Required)
  - `ca` &lt;string&gt; | &lt;string[]&gt; | [&lt;Buffer&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer)
    | [&lt;Buffer[]&gt;](https://nodejs.org/api/buffer.html#buffer_class_buffer): A string, Buffer, array of strings,
    or array of Buffers of trusted certificates in PEM format. If this is omitted, several well known "root" CAs (like
    VeriSign) will be used. These are used to authorize connections.

See the [HTTPs project example](https://github.com/tsedio/example-ts-express-decorator/tree/2.0.0/example-https)

## mount

- type: @@EndpointDirectoriesSettings@@

Mount all given controllers and map controllers to the corresponding endpoints.

Ts.ED provides the possibility to mount multiple Rest paths instead of the default path `/rest`.
This option will allow you to define a version for an endpoint and select which controllers you want to associate with
the given path.

<<< @/docs/configuration/snippets/server-endpoint-versionning.ts

It is also possible to split the configuration by using the @@Module@@:

<Tabs class="-code">
  <Tab label="Server.ts">

<<< @/docs/configuration/snippets/server-endpoint-versionning-with-module.ts

  </Tab>
  <Tab label="ModuleV1.ts">

<<< @/docs/configuration/snippets/modulev1-endpoint-versionning.ts

  </Tab>  
  <Tab label="ModuleV0.ts">

<<< @/docs/configuration/snippets/modulev0-endpoint-versionning.ts

  </Tab>    
</Tabs>

## ~~componentsScan~~ (deprecated)

- type: `string[]`

List of glob pattern to scan directories which contains [Services](/docs/providers)
or [Middlewares](/docs/middlewares).

## middlewares

- type: `PlatformMiddlewareSettings[]`

A middleware list (Express.js, Ts.ED, Koa, etc...) must be loaded on the `$beforeRoutesInit` hook or on the specified
hook.
In addition, it's also possible to configure the environment for which the middleware should be loaded.

Since v7.4, the middlewares options accepts multiple format to register a native middleware (Express, Koa) and/or a
Ts.ED middleware:

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";

@Configuration({
  middlewares: [
    {use: "helmet", hook: "$afterInit", options: {contentSecurityPolicy: false}},
    {use: EnsureHttpsMiddleware, env: Env.PROD},
    "cors",
    cookieParser(),
    "json-parser", // you can add also the text-parser
    {use: "encodedurl-parser", options: {extended: true}},
    "compression",
    "method-override",
    AuthTokenMiddleware
  ]
})
export class Server {}
```

::: warning Order priority
The middlewares added through `middlewares` options will always be registered after the middlewares registered through
the hook methods!
:::

Here is an equivalent example to load middlewares with the hooks:

```typescript
import {Configuration, ProviderScope, ProviderType} from "@tsed/di";
import {Env} from "@tsed/core";
import bodyParser from "body-parser";

@Configuration({})
export class Server {
  $afterInit() {
    this.app.use(helmet({contentSecurityPolicy: false}));
  }

  $beforeRoutesInit() {
    if (this.env === Env.PROD) {
      this.app.use(EnsureHttpsMiddleware);
    }

    this.app
      .use(cors())
      .use(cookieParser())
      .use(bodyParser.json())
      .use(bodyParser.urlencoded({extended: true}))
      .use(compress({}))
      .use(methodOverride())
      .use(AuthTokenMiddleware);

    return null;
  }
}
```

::: tip

Prefer the 1st example if you use @@RawBodyParams@@ in your application. Ts.ED will automatically configure the json-parser and urlencoded parser with the rawBody parser.

:::

## rawBody <Badge text="v7.4.0+" />

This option forces the rawBody parser if Ts.ED doesn't detect the @@RawBodyParams@@ usage in your code.

```diff
@Configuration({
+  rawBody: true,
+  middlewares: [
+     {use: 'json-parser'},
+     {use: 'urlencoded-parser', options: {extended: true})
+  ]
})
export class Server {
  @Inject()
  protected app: PlatformApplication;

  $beforeRoutesInit() {
-    this.app
-      .use(bodyParser.json())
-      .use(bodyParser.urlencoded({extended: true}));
  }
}
```

## imports

- type: `Type<any>[]`

Add providers or modules here. These modules or provider will be built before the server itself.

<Tabs class="-code">
  <Tab label="Server.ts">

<<< @/docs/configuration/snippets/server-options-imports.ts

  </Tab>
  <Tab label="MyModule.ts">

<<< @/docs/configuration/snippets/module-options-imports.ts

  </Tab>
</Tabs>

## logger

- type: @@PlatformLoggerSettings@@

Logger configuration. See [logger section for more detail](/docs/logger).

## views

Object to configure Views engines with Ts.ED engines or Consolidate (deprecated). See more
on [View engine](/docs/templating).

## acceptMimes

Configure the mimes accepted by default for each request by the server.

## responseFilters

A list of response filters must be called before returning a response to the consumer. See more
on [Response filters](/docs/response-filter).

## multer

Object configure Multer. See more on [Upload file](/docs/upload-files).

## router

```typescript
@Configuration({
  router: {
    appendChildrenRoutesFirst: true
  }
})
```

### router.appendChildrenRoutesFirst

- type: `boolean`

Append children routes before the controller routes itself. Defaults to `false`, but will be deprecated and set to `true` in next major version.

## jsonMapper

```typescript
@Configuration({
  jsonMapper: {
    additionalProperties: false,
    disableUnsecureConstructor: true,
    strictGroups: false
  }
})
```

### jsonMapper.additionalProperties

Enable additional properties on model. By default, `false`. Enable this option is dangerous and may be a potential
security issue.

### jsonMapper.disableUnsecureConstructor

Pass the plain object to the model constructor. By default, `true`.

It may be a potential security issue if you have as constructor with this followings code:

```typescript
class MyModel {
  constructor(obj: any = {}) {
    Object.assign(this, obj); // potential prototype pollution
  }
}
```

### jsonMapper.strictGroups

Enable strict mode for `@Groups` decorator. By default, `false`. See [Groups](/docs/model.md#groups-strict-mode) for more information.

::: warning
The `strictGroups` option is enabled by default in the next major version of Ts.ED.
:::

## Platform Options

See specific platform options for:

- [Express.js](/docs/configuration/express)
- [Koa.js](/docs/configuration/koa)

## HTTP & HTTPs server

### Change address

It's possible to change the HTTP and HTTPS server address as follows:

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  httpPort: "127.0.0.1:8081",
  httpsPort: "127.0.0.2:8082"
})
export class Server {}
```

### Random port

Random port assignment can be enabled with the value `0`. The port assignment will be delegated to the OS.

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  httpPort: "127.0.0.1:0",
  httpsPort: "127.0.0.2:0"
})
export class Server {}
```

Or:

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  httpPort: 0,
  httpsPort: 0
})
export class Server {}
```

### Disable HTTP

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  httpPort: false
})
export class Server {}
```

### Disable HTTPS

```typescript
import {Configuration} from "@tsed/di";

@Configuration({
  httpsPort: false
})
export class Server {}
```
