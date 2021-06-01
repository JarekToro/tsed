(window.webpackJsonp=window.webpackJsonp||[]).push([[531],{1256:function(e,t,a){"use strict";a.r(t);var s=a(1),r=Object(s.a)({},(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("ContentSlotsDistributor",{attrs:{"slot-key":e.$parent.slotKey}},[a("h1",{attrs:{id:"interface-os3encoding"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#interface-os3encoding"}},[e._v("#")]),e._v(" Interface OS3Encoding")]),e._v(" "),a("Badge",{attrs:{text:"Interface",type:"interface"}}),e._v(" "),a("section",{staticClass:"table-features"},[a("table",{staticClass:"is-full-width"},[a("tbody",[a("tr",[a("th",[e._v("Module")]),a("td",[a("div",{staticClass:"lang-typescript"},[a("span",{staticClass:"token keyword"},[e._v("import")]),e._v(" { OS3Encoding } "),a("span",{staticClass:"token keyword"},[e._v("from")]),e._v(" "),a("span",{staticClass:"token string"},[e._v('"@tsed/openspec"')])])])]),a("tr",[a("th",[e._v("Source")]),a("td",[a("a",{attrs:{href:"https://github.com/tsedio/tsed/blob/v6.53.0/packages/openspec/src/openspec3/OS3Encoding.ts#L0-L0"}},[e._v("/packages/openspec/src/openspec3/OS3Encoding.ts")])])])])])]),e._v(" "),a("h2",{attrs:{id:"overview"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#overview"}},[e._v("#")]),e._v(" Overview")]),e._v(" "),a("div",{staticClass:"language-typescript"},[a("pre",{pre:!0,attrs:{class:"language-typescript"}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("interface")]),e._v(" OS3Encoding "),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("{")]),e._v("\n"),a("div",{pre:!0,attrs:{class:"language- extra-class"}},[a("pre",[a("code",[e._v('contentType?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>\n\nheaders?<span class="token punctuation">:</span> <a href="/api/openspec/common/OpenSpecHash.html"><span class="token">OpenSpecHash</span></a>&lt;<a href="/api/openspec/openspec3/OS3Header.html"><span class="token">OS3Header</span></a>&gt;<span class="token punctuation">;</span>\n\nstyle?<span class="token punctuation">:</span> <span class="token keyword">string</span><span class="token punctuation">;</span>\n\nexplode?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>\n\nallowReserved?<span class="token punctuation">:</span> <span class="token keyword">boolean</span><span class="token punctuation">;</span>\n')])])]),a("p",[a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v("}")])])])])]),a("p"),e._v(" "),a("h2",{attrs:{id:"members"}},[a("a",{staticClass:"header-anchor",attrs:{href:"#members"}},[e._v("#")]),e._v(" Members")]),e._v(" "),a("div",{pre:!0},[a("div",{pre:!0,attrs:{class:"method-overview"}},[a("div",{pre:!0,attrs:{class:"language-typescript"}},[a("pre",{pre:!0,attrs:{class:"language-typescript","v-pre":""}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[e._v("contentType?"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")])])])])]),e._v(" "),a("p",[e._v("The "),a("code",[e._v("Content-Type")]),e._v(" for encoding a specific property. Default value depends on the property type: for "),a("code",[e._v("string")]),e._v(" with "),a("code",[e._v("format")]),e._v(" being "),a("code",[e._v("binary")]),e._v(" – "),a("code",[e._v("application/octet-stream")]),e._v("; for other primitive types – "),a("code",[e._v("text/plain")]),e._v("; for "),a("code",[e._v("object")]),e._v(" - application/json; for "),a("code",[e._v("array")]),e._v(" – the default is defined based on the inner type. The value can be a specific media type (e.g. "),a("code",[e._v("application/json")]),e._v("), a wildcard media type (e.g. "),a("code",[e._v("image/*")]),e._v("), or a comma-separated list of the two types.")])]),a("hr"),e._v(" "),a("div",{pre:!0},[a("div",{pre:!0,attrs:{class:"method-overview"}},[a("div",{pre:!0,attrs:{class:"language-typescript"}},[a("pre",{pre:!0,attrs:{class:"language-typescript","v-pre":""}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[e._v("headers?"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("a",{pre:!0,attrs:{href:"/api/openspec/common/OpenSpecHash.html"}},[a("span",{pre:!0,attrs:{class:"token"}},[e._v("OpenSpecHash")])]),e._v("<"),a("a",{pre:!0,attrs:{href:"/api/openspec/openspec3/OS3Header.html"}},[a("span",{pre:!0,attrs:{class:"token"}},[e._v("OS3Header")])]),e._v(">"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")])])])])]),e._v(" "),a("p",[e._v("A map allowing additional information to be provided as headers, for example "),a("code",[e._v("Content-Disposition")]),e._v(". "),a("code",[e._v("Content-Type")]),e._v(" is described separately and SHALL be ignored in this section. This property SHALL be ignored if the request body media type is not a multipart.")])]),a("hr"),e._v(" "),a("div",{pre:!0},[a("div",{pre:!0,attrs:{class:"method-overview"}},[a("div",{pre:!0,attrs:{class:"language-typescript"}},[a("pre",{pre:!0,attrs:{class:"language-typescript","v-pre":""}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[e._v("style?"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("string")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")])])])])]),e._v(" "),a("p",[e._v("Describes how a specific property value will be serialized depending on its type. See "),a("a",{pre:!0,attrs:{href:"https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#parameterObject",target:"_blank",rel:"noopener noreferrer"}},[e._v("Parameter Object"),a("OutboundLink",{pre:!0})],1),e._v(" for details on the "),a("code",[e._v("[style](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#parameterStyle)")]),e._v(" property. The behavior follows the same values as "),a("code",[e._v("query")]),e._v(" parameters, including default values. This property SHALL be ignored if the request body media type is not "),a("code",[e._v("application/x-www-form-urlencoded")]),e._v(".")])]),a("hr"),e._v(" "),a("div",{pre:!0},[a("div",{pre:!0,attrs:{class:"method-overview"}},[a("div",{pre:!0,attrs:{class:"language-typescript"}},[a("pre",{pre:!0,attrs:{class:"language-typescript","v-pre":""}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[e._v("explode?"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("boolean")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")])])])])]),e._v(" "),a("p",[e._v("When this is true, property values of type "),a("code",[e._v("array")]),e._v(" or "),a("code",[e._v("object")]),e._v(" generate separate parameters for each value of the array, or key-value-pair of the map. For other types of properties this property has no effect. When "),a("code",[e._v("[style](https://github.com/OAI/OpenAPI-Specification/blob/master/versions/3.0.1.md#parameterStyle)")]),e._v(" is "),a("code",[e._v("form")]),e._v(", the default value is true. For all other styles, the default value is "),a("code",[e._v("false")]),e._v(". This property SHALL be ignored if the request body media type is not "),a("code",[e._v("application/x-www-form-urlencoded")]),e._v(".")])]),a("hr"),e._v(" "),a("div",{pre:!0},[a("div",{pre:!0,attrs:{class:"method-overview"}},[a("div",{pre:!0,attrs:{class:"language-typescript"}},[a("pre",{pre:!0,attrs:{class:"language-typescript","v-pre":""}},[a("code",{pre:!0,attrs:{class:"typescript-lang "}},[e._v("allowReserved?"),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(":")]),e._v(" "),a("span",{pre:!0,attrs:{class:"token keyword"}},[e._v("boolean")]),a("span",{pre:!0,attrs:{class:"token punctuation"}},[e._v(";")])])])])]),e._v(" "),a("p",[e._v("Determines whether the parameter value SHOULD allow reserved characters, as defined by "),a("a",{pre:!0,attrs:{href:"https://tools.ietf.org/html/rfc3986#section-2.2",target:"_blank",rel:"noopener noreferrer"}},[e._v("RFC3986"),a("OutboundLink",{pre:!0})],1),e._v(" "),a("code",[e._v(":/?#[]@!$&'()*+,;=")]),e._v(" to be included without percent-encoding. The default value is "),a("code",[e._v("false")]),e._v(". This property SHALL be ignored if the request body media type is not "),a("code",[e._v("application/x-www-form-urlencoded")]),e._v(".")])])],1)}),[],!1,null,null,null);t.default=r.exports}}]);