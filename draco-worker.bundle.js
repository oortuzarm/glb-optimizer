(() => {
  var __create = Object.create;
  var __defProp = Object.defineProperty;
  var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
  var __getOwnPropNames = Object.getOwnPropertyNames;
  var __getProtoOf = Object.getPrototypeOf;
  var __hasOwnProp = Object.prototype.hasOwnProperty;
  var __esm = (fn, res) => function __init() {
    return fn && (res = (0, fn[__getOwnPropNames(fn)[0]])(fn = 0)), res;
  };
  var __commonJS = (cb, mod) => function __require() {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  };
  var __copyProps = (to, from, except, desc) => {
    if (from && typeof from === "object" || typeof from === "function") {
      for (let key of __getOwnPropNames(from))
        if (!__hasOwnProp.call(to, key) && key !== except)
          __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
    }
    return to;
  };
  var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
    // If the importer is in node compatibility mode or this is not an ESM
    // file that has been converted to a CommonJS file using a Babel-
    // compatible transform (i.e. "__esModule" has not been set), then set
    // "default" to the CommonJS "module.exports" for node compatibility.
    isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
    mod
  ));

  // <define:process.versions>
  var define_process_versions_default;
  var init_define_process_versions = __esm({
    "<define:process.versions>"() {
      define_process_versions_default = {};
    }
  });

  // node_modules/iota-array/iota.js
  var require_iota = __commonJS({
    "node_modules/iota-array/iota.js"(exports, module) {
      "use strict";
      init_define_process_versions();
      function iota(n) {
        var result = new Array(n);
        for (var i = 0; i < n; ++i) {
          result[i] = i;
        }
        return result;
      }
      module.exports = iota;
    }
  });

  // node_modules/is-buffer/index.js
  var require_is_buffer = __commonJS({
    "node_modules/is-buffer/index.js"(exports, module) {
      init_define_process_versions();
      module.exports = function(obj) {
        return obj != null && (isBuffer(obj) || isSlowBuffer(obj) || !!obj._isBuffer);
      };
      function isBuffer(obj) {
        return !!obj.constructor && typeof obj.constructor.isBuffer === "function" && obj.constructor.isBuffer(obj);
      }
      function isSlowBuffer(obj) {
        return typeof obj.readFloatLE === "function" && typeof obj.slice === "function" && isBuffer(obj.slice(0, 0));
      }
    }
  });

  // node_modules/ndarray/ndarray.js
  var require_ndarray = __commonJS({
    "node_modules/ndarray/ndarray.js"(exports, module) {
      init_define_process_versions();
      var iota = require_iota();
      var isBuffer = require_is_buffer();
      var hasTypedArrays = typeof Float64Array !== "undefined";
      function compare1st(a, b) {
        return a[0] - b[0];
      }
      function order() {
        var stride = this.stride;
        var terms = new Array(stride.length);
        var i;
        for (i = 0; i < terms.length; ++i) {
          terms[i] = [Math.abs(stride[i]), i];
        }
        terms.sort(compare1st);
        var result = new Array(terms.length);
        for (i = 0; i < result.length; ++i) {
          result[i] = terms[i][1];
        }
        return result;
      }
      function compileConstructor(dtype, dimension) {
        var className = ["View", dimension, "d", dtype].join("");
        if (dimension < 0) {
          className = "View_Nil" + dtype;
        }
        var useGetters = dtype === "generic";
        if (dimension === -1) {
          var code = "function " + className + "(a){this.data=a;};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return -1};proto.size=0;proto.dimension=-1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function(){return new " + className + "(this.data);};proto.get=proto.set=function(){};proto.pick=function(){return null};return function construct_" + className + "(a){return new " + className + "(a);}";
          var procedure = new Function(code);
          return procedure();
        } else if (dimension === 0) {
          var code = "function " + className + "(a,d) {this.data = a;this.offset = d};var proto=" + className + ".prototype;proto.dtype='" + dtype + "';proto.index=function(){return this.offset};proto.dimension=0;proto.size=1;proto.shape=proto.stride=proto.order=[];proto.lo=proto.hi=proto.transpose=proto.step=function " + className + "_copy() {return new " + className + "(this.data,this.offset)};proto.pick=function " + className + "_pick(){return TrivialArray(this.data);};proto.valueOf=proto.get=function " + className + "_get(){return " + (useGetters ? "this.data.get(this.offset)" : "this.data[this.offset]") + "};proto.set=function " + className + "_set(v){return " + (useGetters ? "this.data.set(this.offset,v)" : "this.data[this.offset]=v") + "};return function construct_" + className + "(a,b,c,d){return new " + className + "(a,d)}";
          var procedure = new Function("TrivialArray", code);
          return procedure(CACHED_CONSTRUCTORS[dtype][0]);
        }
        var code = ["'use strict'"];
        var indices = iota(dimension);
        var args = indices.map(function(i2) {
          return "i" + i2;
        });
        var index_str = "this.offset+" + indices.map(function(i2) {
          return "this.stride[" + i2 + "]*i" + i2;
        }).join("+");
        var shapeArg = indices.map(function(i2) {
          return "b" + i2;
        }).join(",");
        var strideArg = indices.map(function(i2) {
          return "c" + i2;
        }).join(",");
        code.push(
          "function " + className + "(a," + shapeArg + "," + strideArg + ",d){this.data=a",
          "this.shape=[" + shapeArg + "]",
          "this.stride=[" + strideArg + "]",
          "this.offset=d|0}",
          "var proto=" + className + ".prototype",
          "proto.dtype='" + dtype + "'",
          "proto.dimension=" + dimension
        );
        code.push(
          "Object.defineProperty(proto,'size',{get:function " + className + "_size(){return " + indices.map(function(i2) {
            return "this.shape[" + i2 + "]";
          }).join("*"),
          "}})"
        );
        if (dimension === 1) {
          code.push("proto.order=[0]");
        } else {
          code.push("Object.defineProperty(proto,'order',{get:");
          if (dimension < 4) {
            code.push("function " + className + "_order(){");
            if (dimension === 2) {
              code.push("return (Math.abs(this.stride[0])>Math.abs(this.stride[1]))?[1,0]:[0,1]}})");
            } else if (dimension === 3) {
              code.push(
                "var s0=Math.abs(this.stride[0]),s1=Math.abs(this.stride[1]),s2=Math.abs(this.stride[2]);if(s0>s1){if(s1>s2){return [2,1,0];}else if(s0>s2){return [1,2,0];}else{return [1,0,2];}}else if(s0>s2){return [2,0,1];}else if(s2>s1){return [0,1,2];}else{return [0,2,1];}}})"
              );
            }
          } else {
            code.push("ORDER})");
          }
        }
        code.push(
          "proto.set=function " + className + "_set(" + args.join(",") + ",v){"
        );
        if (useGetters) {
          code.push("return this.data.set(" + index_str + ",v)}");
        } else {
          code.push("return this.data[" + index_str + "]=v}");
        }
        code.push("proto.get=function " + className + "_get(" + args.join(",") + "){");
        if (useGetters) {
          code.push("return this.data.get(" + index_str + ")}");
        } else {
          code.push("return this.data[" + index_str + "]}");
        }
        code.push(
          "proto.index=function " + className + "_index(",
          args.join(),
          "){return " + index_str + "}"
        );
        code.push("proto.hi=function " + className + "_hi(" + args.join(",") + "){return new " + className + "(this.data," + indices.map(function(i2) {
          return ["(typeof i", i2, "!=='number'||i", i2, "<0)?this.shape[", i2, "]:i", i2, "|0"].join("");
        }).join(",") + "," + indices.map(function(i2) {
          return "this.stride[" + i2 + "]";
        }).join(",") + ",this.offset)}");
        var a_vars = indices.map(function(i2) {
          return "a" + i2 + "=this.shape[" + i2 + "]";
        });
        var c_vars = indices.map(function(i2) {
          return "c" + i2 + "=this.stride[" + i2 + "]";
        });
        code.push("proto.lo=function " + className + "_lo(" + args.join(",") + "){var b=this.offset,d=0," + a_vars.join(",") + "," + c_vars.join(","));
        for (var i = 0; i < dimension; ++i) {
          code.push(
            "if(typeof i" + i + "==='number'&&i" + i + ">=0){d=i" + i + "|0;b+=c" + i + "*d;a" + i + "-=d}"
          );
        }
        code.push("return new " + className + "(this.data," + indices.map(function(i2) {
          return "a" + i2;
        }).join(",") + "," + indices.map(function(i2) {
          return "c" + i2;
        }).join(",") + ",b)}");
        code.push("proto.step=function " + className + "_step(" + args.join(",") + "){var " + indices.map(function(i2) {
          return "a" + i2 + "=this.shape[" + i2 + "]";
        }).join(",") + "," + indices.map(function(i2) {
          return "b" + i2 + "=this.stride[" + i2 + "]";
        }).join(",") + ",c=this.offset,d=0,ceil=Math.ceil");
        for (var i = 0; i < dimension; ++i) {
          code.push(
            "if(typeof i" + i + "==='number'){d=i" + i + "|0;if(d<0){c+=b" + i + "*(a" + i + "-1);a" + i + "=ceil(-a" + i + "/d)}else{a" + i + "=ceil(a" + i + "/d)}b" + i + "*=d}"
          );
        }
        code.push("return new " + className + "(this.data," + indices.map(function(i2) {
          return "a" + i2;
        }).join(",") + "," + indices.map(function(i2) {
          return "b" + i2;
        }).join(",") + ",c)}");
        var tShape = new Array(dimension);
        var tStride = new Array(dimension);
        for (var i = 0; i < dimension; ++i) {
          tShape[i] = "a[i" + i + "]";
          tStride[i] = "b[i" + i + "]";
        }
        code.push(
          "proto.transpose=function " + className + "_transpose(" + args + "){" + args.map(function(n, idx) {
            return n + "=(" + n + "===undefined?" + idx + ":" + n + "|0)";
          }).join(";"),
          "var a=this.shape,b=this.stride;return new " + className + "(this.data," + tShape.join(",") + "," + tStride.join(",") + ",this.offset)}"
        );
        code.push("proto.pick=function " + className + "_pick(" + args + "){var a=[],b=[],c=this.offset");
        for (var i = 0; i < dimension; ++i) {
          code.push("if(typeof i" + i + "==='number'&&i" + i + ">=0){c=(c+this.stride[" + i + "]*i" + i + ")|0}else{a.push(this.shape[" + i + "]);b.push(this.stride[" + i + "])}");
        }
        code.push("var ctor=CTOR_LIST[a.length+1];return ctor(this.data,a,b,c)}");
        code.push("return function construct_" + className + "(data,shape,stride,offset){return new " + className + "(data," + indices.map(function(i2) {
          return "shape[" + i2 + "]";
        }).join(",") + "," + indices.map(function(i2) {
          return "stride[" + i2 + "]";
        }).join(",") + ",offset)}");
        var procedure = new Function("CTOR_LIST", "ORDER", code.join("\n"));
        return procedure(CACHED_CONSTRUCTORS[dtype], order);
      }
      function arrayDType(data) {
        if (isBuffer(data)) {
          return "buffer";
        }
        if (hasTypedArrays) {
          switch (Object.prototype.toString.call(data)) {
            case "[object Float64Array]":
              return "float64";
            case "[object Float32Array]":
              return "float32";
            case "[object Int8Array]":
              return "int8";
            case "[object Int16Array]":
              return "int16";
            case "[object Int32Array]":
              return "int32";
            case "[object Uint8Array]":
              return "uint8";
            case "[object Uint16Array]":
              return "uint16";
            case "[object Uint32Array]":
              return "uint32";
            case "[object Uint8ClampedArray]":
              return "uint8_clamped";
            case "[object BigInt64Array]":
              return "bigint64";
            case "[object BigUint64Array]":
              return "biguint64";
          }
        }
        if (Array.isArray(data)) {
          return "array";
        }
        return "generic";
      }
      var CACHED_CONSTRUCTORS = {
        "float32": [],
        "float64": [],
        "int8": [],
        "int16": [],
        "int32": [],
        "uint8": [],
        "uint16": [],
        "uint32": [],
        "array": [],
        "uint8_clamped": [],
        "bigint64": [],
        "biguint64": [],
        "buffer": [],
        "generic": []
      };
      function wrappedNDArrayCtor(data, shape, stride, offset) {
        if (data === void 0) {
          var ctor = CACHED_CONSTRUCTORS.array[0];
          return ctor([]);
        } else if (typeof data === "number") {
          data = [data];
        }
        if (shape === void 0) {
          shape = [data.length];
        }
        var d = shape.length;
        if (stride === void 0) {
          stride = new Array(d);
          for (var i = d - 1, sz = 1; i >= 0; --i) {
            stride[i] = sz;
            sz *= shape[i];
          }
        }
        if (offset === void 0) {
          offset = 0;
          for (var i = 0; i < d; ++i) {
            if (stride[i] < 0) {
              offset -= (shape[i] - 1) * stride[i];
            }
          }
        }
        var dtype = arrayDType(data);
        var ctor_list = CACHED_CONSTRUCTORS[dtype];
        while (ctor_list.length <= d + 1) {
          ctor_list.push(compileConstructor(dtype, ctor_list.length - 1));
        }
        var ctor = ctor_list[d + 1];
        return ctor(data, shape, stride, offset);
      }
      module.exports = wrappedNDArrayCtor;
    }
  });

  // node-browser-compat:fs
  var require_fs = __commonJS({
    "node-browser-compat:fs"(exports, module) {
      init_define_process_versions();
      module.exports = {
        readFileSync: function() {
          return new Uint8Array(0);
        },
        readFile: function(_, cb) {
          cb(new Error("fs not available"));
        },
        existsSync: function() {
          return false;
        },
        writeFileSync: function() {
        }
      };
    }
  });

  // node-browser-compat:path
  var require_path = __commonJS({
    "node-browser-compat:path"(exports, module) {
      init_define_process_versions();
      module.exports = {
        join: function() {
          return Array.prototype.slice.call(arguments).filter(Boolean).join("/");
        },
        dirname: function(p) {
          return (p || "").split("/").slice(0, -1).join("/") || ".";
        },
        normalize: function(p) {
          return p;
        },
        resolve: function() {
          return Array.prototype.slice.call(arguments).pop() || "";
        }
      };
    }
  });

  // node_modules/draco3dgltf/draco_encoder_gltf_nodejs.js
  var require_draco_encoder_gltf_nodejs = __commonJS({
    "node_modules/draco3dgltf/draco_encoder_gltf_nodejs.js"(exports, module) {
      init_define_process_versions();
      var $jscomp = $jscomp || {};
      $jscomp.scope = {};
      $jscomp.arrayIteratorImpl = function(l) {
        var p = 0;
        return function() {
          return p < l.length ? { done: false, value: l[p++] } : { done: true };
        };
      };
      $jscomp.arrayIterator = function(l) {
        return { next: $jscomp.arrayIteratorImpl(l) };
      };
      $jscomp.makeIterator = function(l) {
        var p = "undefined" != typeof Symbol && Symbol.iterator && l[Symbol.iterator];
        return p ? p.call(l) : $jscomp.arrayIterator(l);
      };
      $jscomp.ASSUME_ES5 = false;
      $jscomp.ASSUME_NO_NATIVE_MAP = false;
      $jscomp.ASSUME_NO_NATIVE_SET = false;
      $jscomp.SIMPLE_FROUND_POLYFILL = false;
      $jscomp.ISOLATE_POLYFILLS = false;
      $jscomp.FORCE_POLYFILL_PROMISE = false;
      $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = false;
      $jscomp.getGlobal = function(l) {
        l = ["object" == typeof globalThis && globalThis, l, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var p = 0; p < l.length; ++p) {
          var m = l[p];
          if (m && m.Math == Math) return m;
        }
        throw Error("Cannot find global object");
      };
      $jscomp.global = $jscomp.getGlobal(exports);
      $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(l, p, m) {
        if (l == Array.prototype || l == Object.prototype) return l;
        l[p] = m.value;
        return l;
      };
      $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
      $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
      $jscomp.polyfills = {};
      $jscomp.propertyToPolyfillSymbol = {};
      $jscomp.POLYFILL_PREFIX = "$jscp$";
      $jscomp.polyfill = function(l, p, m, r) {
        p && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(l, p, m, r) : $jscomp.polyfillUnisolated(l, p, m, r));
      };
      $jscomp.polyfillUnisolated = function(l, p, m, r) {
        m = $jscomp.global;
        l = l.split(".");
        for (r = 0; r < l.length - 1; r++) {
          var k = l[r];
          if (!(k in m)) return;
          m = m[k];
        }
        l = l[l.length - 1];
        r = m[l];
        p = p(r);
        p != r && null != p && $jscomp.defineProperty(m, l, { configurable: true, writable: true, value: p });
      };
      $jscomp.polyfillIsolated = function(l, p, m, r) {
        var k = l.split(".");
        l = 1 === k.length;
        r = k[0];
        r = !l && r in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
        for (var C = 0; C < k.length - 1; C++) {
          var h = k[C];
          if (!(h in r)) return;
          r = r[h];
        }
        k = k[k.length - 1];
        m = $jscomp.IS_SYMBOL_NATIVE && "es6" === m ? r[k] : null;
        p = p(m);
        null != p && (l ? $jscomp.defineProperty($jscomp.polyfills, k, { configurable: true, writable: true, value: p }) : p !== m && (void 0 === $jscomp.propertyToPolyfillSymbol[k] && (m = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[k] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(k) : $jscomp.POLYFILL_PREFIX + m + "$" + k), $jscomp.defineProperty(r, $jscomp.propertyToPolyfillSymbol[k], { configurable: true, writable: true, value: p })));
      };
      $jscomp.polyfill("Promise", function(l) {
        function p() {
          this.batch_ = null;
        }
        function m(h) {
          return h instanceof k ? h : new k(function(q, w) {
            q(h);
          });
        }
        if (l && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return l;
        p.prototype.asyncExecute = function(h) {
          if (null == this.batch_) {
            this.batch_ = [];
            var q = this;
            this.asyncExecuteFunction(function() {
              q.executeBatch_();
            });
          }
          this.batch_.push(h);
        };
        var r = $jscomp.global.setTimeout;
        p.prototype.asyncExecuteFunction = function(h) {
          r(h, 0);
        };
        p.prototype.executeBatch_ = function() {
          for (; this.batch_ && this.batch_.length; ) {
            var h = this.batch_;
            this.batch_ = [];
            for (var q = 0; q < h.length; ++q) {
              var w = h[q];
              h[q] = null;
              try {
                w();
              } catch (B3) {
                this.asyncThrow_(B3);
              }
            }
          }
          this.batch_ = null;
        };
        p.prototype.asyncThrow_ = function(h) {
          this.asyncExecuteFunction(function() {
            throw h;
          });
        };
        var k = function(h) {
          this.state_ = 0;
          this.result_ = void 0;
          this.onSettledCallbacks_ = [];
          this.isRejectionHandled_ = false;
          var q = this.createResolveAndReject_();
          try {
            h(q.resolve, q.reject);
          } catch (w) {
            q.reject(w);
          }
        };
        k.prototype.createResolveAndReject_ = function() {
          function h(B3) {
            return function(v) {
              w || (w = true, B3.call(q, v));
            };
          }
          var q = this, w = false;
          return { resolve: h(this.resolveTo_), reject: h(this.reject_) };
        };
        k.prototype.resolveTo_ = function(h) {
          if (h === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
          else if (h instanceof k) this.settleSameAsPromise_(h);
          else {
            a: switch (typeof h) {
              case "object":
                var q = null != h;
                break a;
              case "function":
                q = true;
                break a;
              default:
                q = false;
            }
            q ? this.resolveToNonPromiseObj_(h) : this.fulfill_(h);
          }
        };
        k.prototype.resolveToNonPromiseObj_ = function(h) {
          var q = void 0;
          try {
            q = h.then;
          } catch (w) {
            this.reject_(w);
            return;
          }
          "function" == typeof q ? this.settleSameAsThenable_(q, h) : this.fulfill_(h);
        };
        k.prototype.reject_ = function(h) {
          this.settle_(2, h);
        };
        k.prototype.fulfill_ = function(h) {
          this.settle_(1, h);
        };
        k.prototype.settle_ = function(h, q) {
          if (0 != this.state_) throw Error("Cannot settle(" + h + ", " + q + "): Promise already settled in state" + this.state_);
          this.state_ = h;
          this.result_ = q;
          2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
          this.executeOnSettledCallbacks_();
        };
        k.prototype.scheduleUnhandledRejectionCheck_ = function() {
          var h = this;
          r(function() {
            if (h.notifyUnhandledRejection_()) {
              var q = $jscomp.global.console;
              "undefined" !== typeof q && q.error(h.result_);
            }
          }, 1);
        };
        k.prototype.notifyUnhandledRejection_ = function() {
          if (this.isRejectionHandled_) return false;
          var h = $jscomp.global.CustomEvent, q = $jscomp.global.Event, w = $jscomp.global.dispatchEvent;
          if ("undefined" === typeof w) return true;
          "function" === typeof h ? h = new h("unhandledrejection", { cancelable: true }) : "function" === typeof q ? h = new q("unhandledrejection", { cancelable: true }) : (h = $jscomp.global.document.createEvent("CustomEvent"), h.initCustomEvent("unhandledrejection", false, true, h));
          h.promise = this;
          h.reason = this.result_;
          return w(h);
        };
        k.prototype.executeOnSettledCallbacks_ = function() {
          if (null != this.onSettledCallbacks_) {
            for (var h = 0; h < this.onSettledCallbacks_.length; ++h) C.asyncExecute(this.onSettledCallbacks_[h]);
            this.onSettledCallbacks_ = null;
          }
        };
        var C = new p();
        k.prototype.settleSameAsPromise_ = function(h) {
          var q = this.createResolveAndReject_();
          h.callWhenSettled_(q.resolve, q.reject);
        };
        k.prototype.settleSameAsThenable_ = function(h, q) {
          var w = this.createResolveAndReject_();
          try {
            h.call(q, w.resolve, w.reject);
          } catch (B3) {
            w.reject(B3);
          }
        };
        k.prototype.then = function(h, q) {
          function w(I, J) {
            return "function" == typeof I ? function(Q) {
              try {
                B3(I(Q));
              } catch (R3) {
                v(R3);
              }
            } : J;
          }
          var B3, v, D = new k(function(I, J) {
            B3 = I;
            v = J;
          });
          this.callWhenSettled_(w(h, B3), w(q, v));
          return D;
        };
        k.prototype.catch = function(h) {
          return this.then(void 0, h);
        };
        k.prototype.callWhenSettled_ = function(h, q) {
          function w() {
            switch (B3.state_) {
              case 1:
                h(B3.result_);
                break;
              case 2:
                q(B3.result_);
                break;
              default:
                throw Error("Unexpected state: " + B3.state_);
            }
          }
          var B3 = this;
          null == this.onSettledCallbacks_ ? C.asyncExecute(w) : this.onSettledCallbacks_.push(w);
          this.isRejectionHandled_ = true;
        };
        k.resolve = m;
        k.reject = function(h) {
          return new k(function(q, w) {
            w(h);
          });
        };
        k.race = function(h) {
          return new k(function(q, w) {
            for (var B3 = $jscomp.makeIterator(h), v = B3.next(); !v.done; v = B3.next()) m(v.value).callWhenSettled_(q, w);
          });
        };
        k.all = function(h) {
          var q = $jscomp.makeIterator(h), w = q.next();
          return w.done ? m([]) : new k(function(B3, v) {
            function D(Q) {
              return function(R3) {
                I[Q] = R3;
                J--;
                0 == J && B3(I);
              };
            }
            var I = [], J = 0;
            do
              I.push(void 0), J++, m(w.value).callWhenSettled_(D(I.length - 1), v), w = q.next();
            while (!w.done);
          });
        };
        return k;
      }, "es6", "es3");
      $jscomp.owns = function(l, p) {
        return Object.prototype.hasOwnProperty.call(l, p);
      };
      $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(l, p) {
        for (var m = 1; m < arguments.length; m++) {
          var r = arguments[m];
          if (r) for (var k in r) $jscomp.owns(r, k) && (l[k] = r[k]);
        }
        return l;
      };
      $jscomp.polyfill("Object.assign", function(l) {
        return l || $jscomp.assign;
      }, "es6", "es3");
      $jscomp.checkStringArgs = function(l, p, m) {
        if (null == l) throw new TypeError("The 'this' value for String.prototype." + m + " must not be null or undefined");
        if (p instanceof RegExp) throw new TypeError("First argument to String.prototype." + m + " must not be a regular expression");
        return l + "";
      };
      $jscomp.polyfill("String.prototype.startsWith", function(l) {
        return l ? l : function(p, m) {
          var r = $jscomp.checkStringArgs(this, p, "startsWith");
          p += "";
          var k = r.length, C = p.length;
          m = Math.max(0, Math.min(m | 0, r.length));
          for (var h = 0; h < C && m < k; ) if (r[m++] != p[h++]) return false;
          return h >= C;
        };
      }, "es6", "es3");
      $jscomp.polyfill("Array.prototype.copyWithin", function(l) {
        function p(m) {
          m = Number(m);
          return Infinity === m || -Infinity === m ? m : m | 0;
        }
        return l ? l : function(m, r, k) {
          var C = this.length;
          m = p(m);
          r = p(r);
          k = void 0 === k ? C : p(k);
          m = 0 > m ? Math.max(C + m, 0) : Math.min(m, C);
          r = 0 > r ? Math.max(C + r, 0) : Math.min(r, C);
          k = 0 > k ? Math.max(C + k, 0) : Math.min(k, C);
          if (m < r) for (; r < k; ) r in this ? this[m++] = this[r++] : (delete this[m++], r++);
          else for (k = Math.min(k, C + r - m), m += k - r; k > r; ) --k in this ? this[--m] = this[k] : delete this[--m];
          return this;
        };
      }, "es6", "es3");
      $jscomp.typedArrayCopyWithin = function(l) {
        return l ? l : Array.prototype.copyWithin;
      };
      $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      var DracoEncoderModule = function() {
        var l = "undefined" !== typeof document && document.currentScript ? document.currentScript.src : void 0;
        "undefined" !== typeof __filename && (l = l || __filename);
        return function(p) {
          function m(f) {
            return a.locateFile ? a.locateFile(f, L) : L + f;
          }
          function r() {
            var f = ba.buffer;
            a.HEAP8 = O = new Int8Array(f);
            a.HEAP16 = ea = new Int16Array(f);
            a.HEAP32 = S = new Int32Array(f);
            a.HEAPU8 = fa = new Uint8Array(f);
            a.HEAPU16 = new Uint16Array(f);
            a.HEAPU32 = T = new Uint32Array(f);
            a.HEAPF32 = ha = new Float32Array(f);
            a.HEAPF64 = new Float64Array(f);
          }
          function k(f) {
            if (a.onAbort) a.onAbort(f);
            f = "Aborted(" + f + ")";
            W(f);
            na = true;
            f = new WebAssembly.RuntimeError(f + ". Build with -sASSERTIONS for more info.");
            ca(f);
            throw f;
          }
          function C(f) {
            try {
              if (f == K && X) return new Uint8Array(X);
              if (ia) return ia(f);
              throw "both async and sync fetching of the wasm failed";
            } catch (b) {
              k(b);
            }
          }
          function h() {
            if (!X && (oa || Y)) {
              if ("function" == typeof fetch && !K.startsWith("file://")) return fetch(K, { credentials: "same-origin" }).then(function(f) {
                if (!f.ok) throw "failed to load wasm binary file at '" + K + "'";
                return f.arrayBuffer();
              }).catch(function() {
                return C(K);
              });
              if (ja) return new Promise(function(f, b) {
                ja(K, function(c) {
                  f(new Uint8Array(c));
                }, b);
              });
            }
            return Promise.resolve().then(function() {
              return C(K);
            });
          }
          function q(f) {
            for (; 0 < f.length; ) f.shift()(a);
          }
          function w(f) {
            this.excPtr = f;
            this.ptr = f - 24;
            this.set_type = function(b) {
              T[this.ptr + 4 >> 2] = b;
            };
            this.get_type = function() {
              return T[this.ptr + 4 >> 2];
            };
            this.set_destructor = function(b) {
              T[this.ptr + 8 >> 2] = b;
            };
            this.get_destructor = function() {
              return T[this.ptr + 8 >> 2];
            };
            this.set_refcount = function(b) {
              S[this.ptr >> 2] = b;
            };
            this.set_caught = function(b) {
              O[this.ptr + 12 >> 0] = b ? 1 : 0;
            };
            this.get_caught = function() {
              return 0 != O[this.ptr + 12 >> 0];
            };
            this.set_rethrown = function(b) {
              O[this.ptr + 13 >> 0] = b ? 1 : 0;
            };
            this.get_rethrown = function() {
              return 0 != O[this.ptr + 13 >> 0];
            };
            this.init = function(b, c) {
              this.set_adjusted_ptr(0);
              this.set_type(b);
              this.set_destructor(c);
              this.set_refcount(0);
              this.set_caught(false);
              this.set_rethrown(false);
            };
            this.add_ref = function() {
              S[this.ptr >> 2] += 1;
            };
            this.release_ref = function() {
              var b = S[this.ptr >> 2];
              S[this.ptr >> 2] = b - 1;
              return 1 === b;
            };
            this.set_adjusted_ptr = function(b) {
              T[this.ptr + 16 >> 2] = b;
            };
            this.get_adjusted_ptr = function() {
              return T[this.ptr + 16 >> 2];
            };
            this.get_exception_ptr = function() {
              if (pa(this.get_type())) return T[this.excPtr >> 2];
              var b = this.get_adjusted_ptr();
              return 0 !== b ? b : this.excPtr;
            };
          }
          function B3() {
            function f() {
              if (!da && (da = true, a.calledRun = true, !na)) {
                qa = true;
                q(ka);
                ra(a);
                if (a.onRuntimeInitialized) a.onRuntimeInitialized();
                if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) sa.unshift(a.postRun.shift());
                q(sa);
              }
            }
            if (!(0 < U)) {
              if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) ta.unshift(a.preRun.shift());
              q(ta);
              0 < U || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  a.setStatus("");
                }, 1);
                f();
              }, 1)) : f());
            }
          }
          function v() {
          }
          function D(f) {
            return (f || v).__cache__;
          }
          function I(f, b) {
            var c = D(b), d = c[f];
            if (d) return d;
            d = Object.create((b || v).prototype);
            d.ptr = f;
            return c[f] = d;
          }
          function J(f) {
            if ("string" === typeof f) {
              for (var b = 0, c = 0; c < f.length; ++c) {
                var d = f.charCodeAt(c);
                127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
              }
              b = Array(b + 1);
              c = 0;
              d = b.length;
              if (0 < d) {
                d = c + d - 1;
                for (var e = 0; e < f.length; ++e) {
                  var g = f.charCodeAt(e);
                  if (55296 <= g && 57343 >= g) {
                    var t = f.charCodeAt(++e);
                    g = 65536 + ((g & 1023) << 10) | t & 1023;
                  }
                  if (127 >= g) {
                    if (c >= d) break;
                    b[c++] = g;
                  } else {
                    if (2047 >= g) {
                      if (c + 1 >= d) break;
                      b[c++] = 192 | g >> 6;
                    } else {
                      if (65535 >= g) {
                        if (c + 2 >= d) break;
                        b[c++] = 224 | g >> 12;
                      } else {
                        if (c + 3 >= d) break;
                        b[c++] = 240 | g >> 18;
                        b[c++] = 128 | g >> 12 & 63;
                      }
                      b[c++] = 128 | g >> 6 & 63;
                    }
                    b[c++] = 128 | g & 63;
                  }
                }
                b[c] = 0;
              }
              f = n.alloc(b, O);
              n.copy(b, O, f);
              return f;
            }
            return f;
          }
          function Q(f) {
            if ("object" === typeof f) {
              var b = n.alloc(f, O);
              n.copy(f, O, b);
              return b;
            }
            return f;
          }
          function R3(f) {
            if ("object" === typeof f) {
              var b = n.alloc(f, ea);
              n.copy(f, ea, b);
              return b;
            }
            return f;
          }
          function V(f) {
            if ("object" === typeof f) {
              var b = n.alloc(f, S);
              n.copy(f, S, b);
              return b;
            }
            return f;
          }
          function Z(f) {
            if ("object" === typeof f) {
              var b = n.alloc(f, ha);
              n.copy(f, ha, b);
              return b;
            }
            return f;
          }
          function P() {
            throw "cannot construct a VoidPtr, no constructor in IDL";
          }
          function M() {
            this.ptr = ua();
            D(M)[this.ptr] = this;
          }
          function z() {
            this.ptr = va();
            D(z)[this.ptr] = this;
          }
          function G3() {
            this.ptr = wa();
            D(G3)[this.ptr] = this;
          }
          function E() {
            this.ptr = xa();
            D(E)[this.ptr] = this;
          }
          function N() {
            this.ptr = ya();
            D(N)[this.ptr] = this;
          }
          function H() {
            this.ptr = za();
            D(H)[this.ptr] = this;
          }
          function F() {
            this.ptr = Aa();
            D(F)[this.ptr] = this;
          }
          function x() {
            this.ptr = Ba();
            D(x)[this.ptr] = this;
          }
          function u() {
            this.ptr = Ca();
            D(u)[this.ptr] = this;
          }
          function y() {
            this.ptr = Da();
            D(y)[this.ptr] = this;
          }
          function A3(f) {
            f && "object" === typeof f && (f = f.ptr);
            this.ptr = Ea(f);
            D(A3)[this.ptr] = this;
          }
          p = void 0 === p ? {} : p;
          var a = "undefined" != typeof p ? p : {}, ra, ca;
          a.ready = new Promise(function(f, b) {
            ra = f;
            ca = b;
          });
          var Fa = false, Ga = false;
          a.onRuntimeInitialized = function() {
            Fa = true;
            if (Ga && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
          };
          a.onModuleParsed = function() {
            Ga = true;
            if (Fa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
          };
          a.isVersionSupported = function(f) {
            if ("string" !== typeof f) return false;
            f = f.split(".");
            return 2 > f.length || 3 < f.length ? false : 1 == f[0] && 0 <= f[1] && 5 >= f[1] ? true : 0 != f[0] || 10 < f[1] ? false : true;
          };
          var Ha = Object.assign({}, a), oa = "object" == typeof window, Y = "function" == typeof importScripts, Ia = "object" == typeof process && "object" == typeof define_process_versions_default && false, L = "";
          if (Ia) {
            var Ja = require_fs(), la = require_path();
            L = Y ? la.dirname(L) + "/" : __dirname + "/";
            var Ka = function(f, b) {
              f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
              return Ja.readFileSync(f, b ? void 0 : "utf8");
            };
            var ia = function(f) {
              f = Ka(f, true);
              f.buffer || (f = new Uint8Array(f));
              return f;
            };
            var ja = function(f, b, c) {
              f = f.startsWith("file://") ? new URL(f) : la.normalize(f);
              Ja.readFile(f, function(d, e) {
                d ? c(d) : b(e.buffer);
              });
            };
            1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
            process.argv.slice(2);
            a.inspect = function() {
              return "[Emscripten Module object]";
            };
          } else if (oa || Y) Y ? L = self.location.href : "undefined" != typeof document && document.currentScript && (L = document.currentScript.src), l && (L = l), L = 0 !== L.indexOf("blob:") ? L.substr(0, L.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Ka = function(f) {
            var b = new XMLHttpRequest();
            b.open("GET", f, false);
            b.send(null);
            return b.responseText;
          }, Y && (ia = function(f) {
            var b = new XMLHttpRequest();
            b.open("GET", f, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }), ja = function(f, b, c) {
            var d = new XMLHttpRequest();
            d.open("GET", f, true);
            d.responseType = "arraybuffer";
            d.onload = function() {
              200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
            };
            d.onerror = c;
            d.send(null);
          };
          a.print || console.log.bind(console);
          var W = a.printErr || console.warn.bind(console);
          Object.assign(a, Ha);
          Ha = null;
          var X;
          a.wasmBinary && (X = a.wasmBinary);
          "object" != typeof WebAssembly && k("no native wasm support detected");
          var ba, na = false, O, fa, ea, S, T, ha, ta = [], ka = [], sa = [], qa = false, U = 0, ma = null, aa = null;
          var K = "draco_encoder.wasm";
          K.startsWith("data:application/octet-stream;base64,") || (K = m(K));
          var pc = 0, qc = { b: function(f, b, c) {
            new w(f).init(b, c);
            pc++;
            throw f;
          }, a: function() {
            k("");
          }, d: function(f, b, c) {
            fa.copyWithin(f, b, b + c);
          }, c: function(f) {
            var b = fa.length;
            f >>>= 0;
            if (2147483648 < f) return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, f + 100663296);
              var e = Math;
              d = Math.max(f, d);
              e = e.min.call(
                e,
                2147483648,
                d + (65536 - d % 65536) % 65536
              );
              a: {
                d = ba.buffer;
                try {
                  ba.grow(e - d.byteLength + 65535 >>> 16);
                  r();
                  var g = 1;
                  break a;
                } catch (t) {
                }
                g = void 0;
              }
              if (g) return true;
            }
            return false;
          } };
          (function() {
            function f(e, g) {
              a.asm = e.exports;
              ba = a.asm.e;
              r();
              ka.unshift(a.asm.f);
              U--;
              a.monitorRunDependencies && a.monitorRunDependencies(U);
              0 == U && (null !== ma && (clearInterval(ma), ma = null), aa && (e = aa, aa = null, e()));
            }
            function b(e) {
              f(e.instance);
            }
            function c(e) {
              return h().then(function(g) {
                return WebAssembly.instantiate(g, d);
              }).then(function(g) {
                return g;
              }).then(e, function(g) {
                W("failed to asynchronously prepare wasm: " + g);
                k(g);
              });
            }
            var d = { a: qc };
            U++;
            a.monitorRunDependencies && a.monitorRunDependencies(U);
            if (a.instantiateWasm) try {
              return a.instantiateWasm(d, f);
            } catch (e) {
              W("Module.instantiateWasm callback failed with error: " + e), ca(e);
            }
            (function() {
              return X || "function" != typeof WebAssembly.instantiateStreaming || K.startsWith("data:application/octet-stream;base64,") || K.startsWith("file://") || Ia || "function" != typeof fetch ? c(b) : fetch(K, { credentials: "same-origin" }).then(function(e) {
                return WebAssembly.instantiateStreaming(e, d).then(
                  b,
                  function(g) {
                    W("wasm streaming compile failed: " + g);
                    W("falling back to ArrayBuffer instantiation");
                    return c(b);
                  }
                );
              });
            })().catch(ca);
            return {};
          })();
          var La = a._emscripten_bind_VoidPtr___destroy___0 = function() {
            return (La = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.h).apply(null, arguments);
          }, ua = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
            return (ua = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = a.asm.i).apply(null, arguments);
          }, Ma = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
            return (Ma = a._emscripten_bind_GeometryAttribute___destroy___0 = a.asm.j).apply(null, arguments);
          }, va = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
            return (va = a._emscripten_bind_PointAttribute_PointAttribute_0 = a.asm.k).apply(null, arguments);
          }, Na = a._emscripten_bind_PointAttribute_size_0 = function() {
            return (Na = a._emscripten_bind_PointAttribute_size_0 = a.asm.l).apply(null, arguments);
          }, Oa = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
            return (Oa = a._emscripten_bind_PointAttribute_attribute_type_0 = a.asm.m).apply(null, arguments);
          }, Pa = a._emscripten_bind_PointAttribute_data_type_0 = function() {
            return (Pa = a._emscripten_bind_PointAttribute_data_type_0 = a.asm.n).apply(null, arguments);
          }, Qa = a._emscripten_bind_PointAttribute_num_components_0 = function() {
            return (Qa = a._emscripten_bind_PointAttribute_num_components_0 = a.asm.o).apply(null, arguments);
          }, Ra = a._emscripten_bind_PointAttribute_normalized_0 = function() {
            return (Ra = a._emscripten_bind_PointAttribute_normalized_0 = a.asm.p).apply(null, arguments);
          }, Sa = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
            return (Sa = a._emscripten_bind_PointAttribute_byte_stride_0 = a.asm.q).apply(null, arguments);
          }, Ta = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
            return (Ta = a._emscripten_bind_PointAttribute_byte_offset_0 = a.asm.r).apply(null, arguments);
          }, Ua = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
            return (Ua = a._emscripten_bind_PointAttribute_unique_id_0 = a.asm.s).apply(null, arguments);
          }, Va = a._emscripten_bind_PointAttribute___destroy___0 = function() {
            return (Va = a._emscripten_bind_PointAttribute___destroy___0 = a.asm.t).apply(null, arguments);
          }, wa = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
            return (wa = a._emscripten_bind_PointCloud_PointCloud_0 = a.asm.u).apply(null, arguments);
          }, Wa = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
            return (Wa = a._emscripten_bind_PointCloud_num_attributes_0 = a.asm.v).apply(null, arguments);
          }, Xa = a._emscripten_bind_PointCloud_num_points_0 = function() {
            return (Xa = a._emscripten_bind_PointCloud_num_points_0 = a.asm.w).apply(null, arguments);
          }, Ya = a._emscripten_bind_PointCloud___destroy___0 = function() {
            return (Ya = a._emscripten_bind_PointCloud___destroy___0 = a.asm.x).apply(null, arguments);
          }, xa = a._emscripten_bind_Mesh_Mesh_0 = function() {
            return (xa = a._emscripten_bind_Mesh_Mesh_0 = a.asm.y).apply(null, arguments);
          }, Za = a._emscripten_bind_Mesh_num_faces_0 = function() {
            return (Za = a._emscripten_bind_Mesh_num_faces_0 = a.asm.z).apply(null, arguments);
          }, $a = a._emscripten_bind_Mesh_num_attributes_0 = function() {
            return ($a = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.A).apply(null, arguments);
          }, ab = a._emscripten_bind_Mesh_num_points_0 = function() {
            return (ab = a._emscripten_bind_Mesh_num_points_0 = a.asm.B).apply(null, arguments);
          }, bb = a._emscripten_bind_Mesh_set_num_points_1 = function() {
            return (bb = a._emscripten_bind_Mesh_set_num_points_1 = a.asm.C).apply(null, arguments);
          }, cb = a._emscripten_bind_Mesh___destroy___0 = function() {
            return (cb = a._emscripten_bind_Mesh___destroy___0 = a.asm.D).apply(null, arguments);
          }, ya = a._emscripten_bind_Metadata_Metadata_0 = function() {
            return (ya = a._emscripten_bind_Metadata_Metadata_0 = a.asm.E).apply(null, arguments);
          }, db = a._emscripten_bind_Metadata___destroy___0 = function() {
            return (db = a._emscripten_bind_Metadata___destroy___0 = a.asm.F).apply(null, arguments);
          }, za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
            return (za = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = a.asm.G).apply(null, arguments);
          }, eb = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
            return (eb = a._emscripten_bind_DracoInt8Array_GetValue_1 = a.asm.H).apply(null, arguments);
          }, fb = a._emscripten_bind_DracoInt8Array_size_0 = function() {
            return (fb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.I).apply(null, arguments);
          }, gb = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
            return (gb = a._emscripten_bind_DracoInt8Array___destroy___0 = a.asm.J).apply(null, arguments);
          }, Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = function() {
            return (Aa = a._emscripten_bind_MetadataBuilder_MetadataBuilder_0 = a.asm.K).apply(null, arguments);
          }, hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = function() {
            return (hb = a._emscripten_bind_MetadataBuilder_AddStringEntry_3 = a.asm.L).apply(null, arguments);
          }, ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = function() {
            return (ib = a._emscripten_bind_MetadataBuilder_AddIntEntry_3 = a.asm.M).apply(null, arguments);
          }, jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 = function() {
            return (jb = a._emscripten_bind_MetadataBuilder_AddIntEntryArray_4 = a.asm.N).apply(null, arguments);
          }, kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = function() {
            return (kb = a._emscripten_bind_MetadataBuilder_AddDoubleEntry_3 = a.asm.O).apply(null, arguments);
          }, lb = a._emscripten_bind_MetadataBuilder___destroy___0 = function() {
            return (lb = a._emscripten_bind_MetadataBuilder___destroy___0 = a.asm.P).apply(null, arguments);
          }, Ba = a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 = function() {
            return (Ba = a._emscripten_bind_PointCloudBuilder_PointCloudBuilder_0 = a.asm.Q).apply(null, arguments);
          }, mb = a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 = function() {
            return (mb = a._emscripten_bind_PointCloudBuilder_AddFloatAttribute_5 = a.asm.R).apply(null, arguments);
          }, nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 = function() {
            return (nb = a._emscripten_bind_PointCloudBuilder_AddInt8Attribute_5 = a.asm.S).apply(null, arguments);
          }, ob = a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 = function() {
            return (ob = a._emscripten_bind_PointCloudBuilder_AddUInt8Attribute_5 = a.asm.T).apply(null, arguments);
          }, pb = a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 = function() {
            return (pb = a._emscripten_bind_PointCloudBuilder_AddInt16Attribute_5 = a.asm.U).apply(null, arguments);
          }, qb = a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 = function() {
            return (qb = a._emscripten_bind_PointCloudBuilder_AddUInt16Attribute_5 = a.asm.V).apply(null, arguments);
          }, rb = a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 = function() {
            return (rb = a._emscripten_bind_PointCloudBuilder_AddInt32Attribute_5 = a.asm.W).apply(null, arguments);
          }, sb = a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 = function() {
            return (sb = a._emscripten_bind_PointCloudBuilder_AddUInt32Attribute_5 = a.asm.X).apply(null, arguments);
          }, tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = function() {
            return (tb = a._emscripten_bind_PointCloudBuilder_AddMetadata_2 = a.asm.Y).apply(null, arguments);
          }, ub = a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 = function() {
            return (ub = a._emscripten_bind_PointCloudBuilder_SetMetadataForAttribute_3 = a.asm.Z).apply(null, arguments);
          }, vb = a._emscripten_bind_PointCloudBuilder_SetNormalizedFlagForAttribute_3 = function() {
            return (vb = a._emscripten_bind_PointCloudBuilder_SetNormalizedFlagForAttribute_3 = a.asm._).apply(null, arguments);
          }, wb = a._emscripten_bind_PointCloudBuilder___destroy___0 = function() {
            return (wb = a._emscripten_bind_PointCloudBuilder___destroy___0 = a.asm.$).apply(null, arguments);
          }, Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 = function() {
            return (Ca = a._emscripten_bind_MeshBuilder_MeshBuilder_0 = a.asm.aa).apply(null, arguments);
          }, xb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = function() {
            return (xb = a._emscripten_bind_MeshBuilder_AddFacesToMesh_3 = a.asm.ba).apply(null, arguments);
          }, yb = a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 = function() {
            return (yb = a._emscripten_bind_MeshBuilder_AddFloatAttributeToMesh_5 = a.asm.ca).apply(null, arguments);
          }, zb = a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 = function() {
            return (zb = a._emscripten_bind_MeshBuilder_AddInt32AttributeToMesh_5 = a.asm.da).apply(null, arguments);
          }, Ab = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = function() {
            return (Ab = a._emscripten_bind_MeshBuilder_AddMetadataToMesh_2 = a.asm.ea).apply(null, arguments);
          }, Bb = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = function() {
            return (Bb = a._emscripten_bind_MeshBuilder_AddFloatAttribute_5 = a.asm.fa).apply(
              null,
              arguments
            );
          }, Cb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = function() {
            return (Cb = a._emscripten_bind_MeshBuilder_AddInt8Attribute_5 = a.asm.ga).apply(null, arguments);
          }, Db = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = function() {
            return (Db = a._emscripten_bind_MeshBuilder_AddUInt8Attribute_5 = a.asm.ha).apply(null, arguments);
          }, Eb = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = function() {
            return (Eb = a._emscripten_bind_MeshBuilder_AddInt16Attribute_5 = a.asm.ia).apply(null, arguments);
          }, Fb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = function() {
            return (Fb = a._emscripten_bind_MeshBuilder_AddUInt16Attribute_5 = a.asm.ja).apply(null, arguments);
          }, Gb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = function() {
            return (Gb = a._emscripten_bind_MeshBuilder_AddInt32Attribute_5 = a.asm.ka).apply(null, arguments);
          }, Hb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = function() {
            return (Hb = a._emscripten_bind_MeshBuilder_AddUInt32Attribute_5 = a.asm.la).apply(null, arguments);
          }, Ib = a._emscripten_bind_MeshBuilder_AddMetadata_2 = function() {
            return (Ib = a._emscripten_bind_MeshBuilder_AddMetadata_2 = a.asm.ma).apply(null, arguments);
          }, Jb = a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 = function() {
            return (Jb = a._emscripten_bind_MeshBuilder_SetMetadataForAttribute_3 = a.asm.na).apply(null, arguments);
          }, Kb = a._emscripten_bind_MeshBuilder_SetNormalizedFlagForAttribute_3 = function() {
            return (Kb = a._emscripten_bind_MeshBuilder_SetNormalizedFlagForAttribute_3 = a.asm.oa).apply(null, arguments);
          }, Lb = a._emscripten_bind_MeshBuilder___destroy___0 = function() {
            return (Lb = a._emscripten_bind_MeshBuilder___destroy___0 = a.asm.pa).apply(null, arguments);
          }, Da = a._emscripten_bind_Encoder_Encoder_0 = function() {
            return (Da = a._emscripten_bind_Encoder_Encoder_0 = a.asm.qa).apply(null, arguments);
          }, Mb = a._emscripten_bind_Encoder_SetEncodingMethod_1 = function() {
            return (Mb = a._emscripten_bind_Encoder_SetEncodingMethod_1 = a.asm.ra).apply(null, arguments);
          }, Nb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 = function() {
            return (Nb = a._emscripten_bind_Encoder_SetAttributeQuantization_2 = a.asm.sa).apply(null, arguments);
          }, Ob = a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 = function() {
            return (Ob = a._emscripten_bind_Encoder_SetAttributeExplicitQuantization_5 = a.asm.ta).apply(null, arguments);
          }, Pb = a._emscripten_bind_Encoder_SetSpeedOptions_2 = function() {
            return (Pb = a._emscripten_bind_Encoder_SetSpeedOptions_2 = a.asm.ua).apply(null, arguments);
          }, Qb = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 = function() {
            return (Qb = a._emscripten_bind_Encoder_SetTrackEncodedProperties_1 = a.asm.va).apply(null, arguments);
          }, Rb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = function() {
            return (Rb = a._emscripten_bind_Encoder_EncodeMeshToDracoBuffer_2 = a.asm.wa).apply(null, arguments);
          }, Sb = a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 = function() {
            return (Sb = a._emscripten_bind_Encoder_EncodePointCloudToDracoBuffer_3 = a.asm.xa).apply(null, arguments);
          }, Tb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 = function() {
            return (Tb = a._emscripten_bind_Encoder_GetNumberOfEncodedPoints_0 = a.asm.ya).apply(null, arguments);
          }, Ub = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = function() {
            return (Ub = a._emscripten_bind_Encoder_GetNumberOfEncodedFaces_0 = a.asm.za).apply(null, arguments);
          }, Vb = a._emscripten_bind_Encoder___destroy___0 = function() {
            return (Vb = a._emscripten_bind_Encoder___destroy___0 = a.asm.Aa).apply(null, arguments);
          }, Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = function() {
            return (Ea = a._emscripten_bind_ExpertEncoder_ExpertEncoder_1 = a.asm.Ba).apply(null, arguments);
          }, Wb = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = function() {
            return (Wb = a._emscripten_bind_ExpertEncoder_SetEncodingMethod_1 = a.asm.Ca).apply(null, arguments);
          }, Xb = a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 = function() {
            return (Xb = a._emscripten_bind_ExpertEncoder_SetAttributeQuantization_2 = a.asm.Da).apply(null, arguments);
          }, Yb = a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 = function() {
            return (Yb = a._emscripten_bind_ExpertEncoder_SetAttributeExplicitQuantization_5 = a.asm.Ea).apply(null, arguments);
          }, Zb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = function() {
            return (Zb = a._emscripten_bind_ExpertEncoder_SetSpeedOptions_2 = a.asm.Fa).apply(null, arguments);
          }, $b = a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 = function() {
            return ($b = a._emscripten_bind_ExpertEncoder_SetTrackEncodedProperties_1 = a.asm.Ga).apply(null, arguments);
          }, ac = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 = function() {
            return (ac = a._emscripten_bind_ExpertEncoder_EncodeToDracoBuffer_2 = a.asm.Ha).apply(null, arguments);
          }, bc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 = function() {
            return (bc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedPoints_0 = a.asm.Ia).apply(null, arguments);
          }, cc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 = function() {
            return (cc = a._emscripten_bind_ExpertEncoder_GetNumberOfEncodedFaces_0 = a.asm.Ja).apply(null, arguments);
          }, dc = a._emscripten_bind_ExpertEncoder___destroy___0 = function() {
            return (dc = a._emscripten_bind_ExpertEncoder___destroy___0 = a.asm.Ka).apply(null, arguments);
          }, ec = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
            return (ec = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = a.asm.La).apply(
              null,
              arguments
            );
          }, fc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
            return (fc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = a.asm.Ma).apply(null, arguments);
          }, gc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
            return (gc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = a.asm.Na).apply(null, arguments);
          }, hc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
            return (hc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = a.asm.Oa).apply(
              null,
              arguments
            );
          }, ic = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
            return (ic = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = a.asm.Pa).apply(null, arguments);
          }, jc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
            return (jc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = a.asm.Qa).apply(null, arguments);
          }, kc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
            return (kc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = a.asm.Ra).apply(null, arguments);
          }, lc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
            return (lc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = a.asm.Sa).apply(null, arguments);
          }, mc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
            return (mc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = a.asm.Ta).apply(null, arguments);
          }, nc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING = function() {
            return (nc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_SEQUENTIAL_ENCODING = a.asm.Ua).apply(null, arguments);
          }, oc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING = function() {
            return (oc = a._emscripten_enum_draco_MeshEncoderMethod_MESH_EDGEBREAKER_ENCODING = a.asm.Va).apply(null, arguments);
          };
          a._malloc = function() {
            return (a._malloc = a.asm.Wa).apply(null, arguments);
          };
          a._free = function() {
            return (a._free = a.asm.Xa).apply(null, arguments);
          };
          var pa = function() {
            return (pa = a.asm.Ya).apply(null, arguments);
          };
          a.___start_em_js = 19116;
          a.___stop_em_js = 19214;
          var da;
          aa = function b() {
            da || B3();
            da || (aa = b);
          };
          if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
          B3();
          v.prototype = Object.create(v.prototype);
          v.prototype.constructor = v;
          v.prototype.__class__ = v;
          v.__cache__ = {};
          a.WrapperObject = v;
          a.getCache = D;
          a.wrapPointer = I;
          a.castObject = function(b, c) {
            return I(b.ptr, c);
          };
          a.NULL = I(0);
          a.destroy = function(b) {
            if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
            b.__destroy__();
            delete D(b.__class__)[b.ptr];
          };
          a.compare = function(b, c) {
            return b.ptr === c.ptr;
          };
          a.getPointer = function(b) {
            return b.ptr;
          };
          a.getClass = function(b) {
            return b.__class__;
          };
          var n = { buffer: 0, size: 0, pos: 0, temps: [], needed: 0, prepare: function() {
            if (n.needed) {
              for (var b = 0; b < n.temps.length; b++) a._free(n.temps[b]);
              n.temps.length = 0;
              a._free(n.buffer);
              n.buffer = 0;
              n.size += n.needed;
              n.needed = 0;
            }
            n.buffer || (n.size += 128, n.buffer = a._malloc(n.size), n.buffer || k(void 0));
            n.pos = 0;
          }, alloc: function(b, c) {
            n.buffer || k(void 0);
            b = b.length * c.BYTES_PER_ELEMENT;
            b = b + 7 & -8;
            n.pos + b >= n.size ? (0 < b || k(void 0), n.needed += b, c = a._malloc(b), n.temps.push(c)) : (c = n.buffer + n.pos, n.pos += b);
            return c;
          }, copy: function(b, c, d) {
            d >>>= 0;
            switch (c.BYTES_PER_ELEMENT) {
              case 2:
                d >>>= 1;
                break;
              case 4:
                d >>>= 2;
                break;
              case 8:
                d >>>= 3;
            }
            for (var e = 0; e < b.length; e++) c[d + e] = b[e];
          } };
          P.prototype = Object.create(v.prototype);
          P.prototype.constructor = P;
          P.prototype.__class__ = P;
          P.__cache__ = {};
          a.VoidPtr = P;
          P.prototype.__destroy__ = P.prototype.__destroy__ = function() {
            La(this.ptr);
          };
          M.prototype = Object.create(v.prototype);
          M.prototype.constructor = M;
          M.prototype.__class__ = M;
          M.__cache__ = {};
          a.GeometryAttribute = M;
          M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
            Ma(this.ptr);
          };
          z.prototype = Object.create(v.prototype);
          z.prototype.constructor = z;
          z.prototype.__class__ = z;
          z.__cache__ = {};
          a.PointAttribute = z;
          z.prototype.size = z.prototype.size = function() {
            return Na(this.ptr);
          };
          z.prototype.attribute_type = z.prototype.attribute_type = function() {
            return Oa(this.ptr);
          };
          z.prototype.data_type = z.prototype.data_type = function() {
            return Pa(this.ptr);
          };
          z.prototype.num_components = z.prototype.num_components = function() {
            return Qa(this.ptr);
          };
          z.prototype.normalized = z.prototype.normalized = function() {
            return !!Ra(this.ptr);
          };
          z.prototype.byte_stride = z.prototype.byte_stride = function() {
            return Sa(this.ptr);
          };
          z.prototype.byte_offset = z.prototype.byte_offset = function() {
            return Ta(this.ptr);
          };
          z.prototype.unique_id = z.prototype.unique_id = function() {
            return Ua(this.ptr);
          };
          z.prototype.__destroy__ = z.prototype.__destroy__ = function() {
            Va(this.ptr);
          };
          G3.prototype = Object.create(v.prototype);
          G3.prototype.constructor = G3;
          G3.prototype.__class__ = G3;
          G3.__cache__ = {};
          a.PointCloud = G3;
          G3.prototype.num_attributes = G3.prototype.num_attributes = function() {
            return Wa(this.ptr);
          };
          G3.prototype.num_points = G3.prototype.num_points = function() {
            return Xa(this.ptr);
          };
          G3.prototype.__destroy__ = G3.prototype.__destroy__ = function() {
            Ya(this.ptr);
          };
          E.prototype = Object.create(v.prototype);
          E.prototype.constructor = E;
          E.prototype.__class__ = E;
          E.__cache__ = {};
          a.Mesh = E;
          E.prototype.num_faces = E.prototype.num_faces = function() {
            return Za(this.ptr);
          };
          E.prototype.num_attributes = E.prototype.num_attributes = function() {
            return $a(this.ptr);
          };
          E.prototype.num_points = E.prototype.num_points = function() {
            return ab(this.ptr);
          };
          E.prototype.set_num_points = E.prototype.set_num_points = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            bb(c, b);
          };
          E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
            cb(this.ptr);
          };
          N.prototype = Object.create(v.prototype);
          N.prototype.constructor = N;
          N.prototype.__class__ = N;
          N.__cache__ = {};
          a.Metadata = N;
          N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
            db(this.ptr);
          };
          H.prototype = Object.create(v.prototype);
          H.prototype.constructor = H;
          H.prototype.__class__ = H;
          H.__cache__ = {};
          a.DracoInt8Array = H;
          H.prototype.GetValue = H.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return eb(c, b);
          };
          H.prototype.size = H.prototype.size = function() {
            return fb(this.ptr);
          };
          H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
            gb(this.ptr);
          };
          F.prototype = Object.create(v.prototype);
          F.prototype.constructor = F;
          F.prototype.__class__ = F;
          F.__cache__ = {};
          a.MetadataBuilder = F;
          F.prototype.AddStringEntry = F.prototype.AddStringEntry = function(b, c, d) {
            var e = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : J(c);
            d = d && "object" === typeof d ? d.ptr : J(d);
            return !!hb(e, b, c, d);
          };
          F.prototype.AddIntEntry = F.prototype.AddIntEntry = function(b, c, d) {
            var e = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : J(c);
            d && "object" === typeof d && (d = d.ptr);
            return !!ib(e, b, c, d);
          };
          F.prototype.AddIntEntryArray = F.prototype.AddIntEntryArray = function(b, c, d, e) {
            var g = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : J(c);
            "object" == typeof d && (d = V(d));
            e && "object" === typeof e && (e = e.ptr);
            return !!jb(g, b, c, d, e);
          };
          F.prototype.AddDoubleEntry = F.prototype.AddDoubleEntry = function(b, c, d) {
            var e = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : J(c);
            d && "object" === typeof d && (d = d.ptr);
            return !!kb(e, b, c, d);
          };
          F.prototype.__destroy__ = F.prototype.__destroy__ = function() {
            lb(this.ptr);
          };
          x.prototype = Object.create(v.prototype);
          x.prototype.constructor = x;
          x.prototype.__class__ = x;
          x.__cache__ = {};
          a.PointCloudBuilder = x;
          x.prototype.AddFloatAttribute = x.prototype.AddFloatAttribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Z(g));
            return mb(t, b, c, d, e, g);
          };
          x.prototype.AddInt8Attribute = x.prototype.AddInt8Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Q(g));
            return nb(t, b, c, d, e, g);
          };
          x.prototype.AddUInt8Attribute = x.prototype.AddUInt8Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Q(g));
            return ob(t, b, c, d, e, g);
          };
          x.prototype.AddInt16Attribute = x.prototype.AddInt16Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = R3(g));
            return pb(t, b, c, d, e, g);
          };
          x.prototype.AddUInt16Attribute = x.prototype.AddUInt16Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = R3(g));
            return qb(t, b, c, d, e, g);
          };
          x.prototype.AddInt32Attribute = x.prototype.AddInt32Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = V(g));
            return rb(t, b, c, d, e, g);
          };
          x.prototype.AddUInt32Attribute = x.prototype.AddUInt32Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = V(g));
            return sb(t, b, c, d, e, g);
          };
          x.prototype.AddMetadata = x.prototype.AddMetadata = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return !!tb(d, b, c);
          };
          x.prototype.SetMetadataForAttribute = x.prototype.SetMetadataForAttribute = function(b, c, d) {
            var e = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!ub(e, b, c, d);
          };
          x.prototype.SetNormalizedFlagForAttribute = x.prototype.SetNormalizedFlagForAttribute = function(b, c, d) {
            var e = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!vb(e, b, c, d);
          };
          x.prototype.__destroy__ = x.prototype.__destroy__ = function() {
            wb(this.ptr);
          };
          u.prototype = Object.create(v.prototype);
          u.prototype.constructor = u;
          u.prototype.__class__ = u;
          u.__cache__ = {};
          a.MeshBuilder = u;
          u.prototype.AddFacesToMesh = u.prototype.AddFacesToMesh = function(b, c, d) {
            var e = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            "object" == typeof d && (d = V(d));
            return !!xb(e, b, c, d);
          };
          u.prototype.AddFloatAttributeToMesh = u.prototype.AddFloatAttributeToMesh = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Z(g));
            return yb(t, b, c, d, e, g);
          };
          u.prototype.AddInt32AttributeToMesh = u.prototype.AddInt32AttributeToMesh = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = V(g));
            return zb(t, b, c, d, e, g);
          };
          u.prototype.AddMetadataToMesh = u.prototype.AddMetadataToMesh = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return !!Ab(d, b, c);
          };
          u.prototype.AddFloatAttribute = u.prototype.AddFloatAttribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Z(g));
            return Bb(t, b, c, d, e, g);
          };
          u.prototype.AddInt8Attribute = u.prototype.AddInt8Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Q(g));
            return Cb(t, b, c, d, e, g);
          };
          u.prototype.AddUInt8Attribute = u.prototype.AddUInt8Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = Q(g));
            return Db(t, b, c, d, e, g);
          };
          u.prototype.AddInt16Attribute = u.prototype.AddInt16Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = R3(g));
            return Eb(t, b, c, d, e, g);
          };
          u.prototype.AddUInt16Attribute = u.prototype.AddUInt16Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = R3(g));
            return Fb(t, b, c, d, e, g);
          };
          u.prototype.AddInt32Attribute = u.prototype.AddInt32Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = V(g));
            return Gb(t, b, c, d, e, g);
          };
          u.prototype.AddUInt32Attribute = u.prototype.AddUInt32Attribute = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            e && "object" === typeof e && (e = e.ptr);
            "object" == typeof g && (g = V(g));
            return Hb(t, b, c, d, e, g);
          };
          u.prototype.AddMetadata = u.prototype.AddMetadata = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return !!Ib(d, b, c);
          };
          u.prototype.SetMetadataForAttribute = u.prototype.SetMetadataForAttribute = function(b, c, d) {
            var e = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!Jb(e, b, c, d);
          };
          u.prototype.SetNormalizedFlagForAttribute = u.prototype.SetNormalizedFlagForAttribute = function(b, c, d) {
            var e = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!Kb(e, b, c, d);
          };
          u.prototype.__destroy__ = u.prototype.__destroy__ = function() {
            Lb(this.ptr);
          };
          y.prototype = Object.create(v.prototype);
          y.prototype.constructor = y;
          y.prototype.__class__ = y;
          y.__cache__ = {};
          a.Encoder = y;
          y.prototype.SetEncodingMethod = y.prototype.SetEncodingMethod = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            Mb(c, b);
          };
          y.prototype.SetAttributeQuantization = y.prototype.SetAttributeQuantization = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            Nb(d, b, c);
          };
          y.prototype.SetAttributeExplicitQuantization = y.prototype.SetAttributeExplicitQuantization = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            "object" == typeof e && (e = Z(e));
            g && "object" === typeof g && (g = g.ptr);
            Ob(t, b, c, d, e, g);
          };
          y.prototype.SetSpeedOptions = y.prototype.SetSpeedOptions = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            Pb(d, b, c);
          };
          y.prototype.SetTrackEncodedProperties = y.prototype.SetTrackEncodedProperties = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            Qb(c, b);
          };
          y.prototype.EncodeMeshToDracoBuffer = y.prototype.EncodeMeshToDracoBuffer = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return Rb(d, b, c);
          };
          y.prototype.EncodePointCloudToDracoBuffer = y.prototype.EncodePointCloudToDracoBuffer = function(b, c, d) {
            var e = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return Sb(e, b, c, d);
          };
          y.prototype.GetNumberOfEncodedPoints = y.prototype.GetNumberOfEncodedPoints = function() {
            return Tb(this.ptr);
          };
          y.prototype.GetNumberOfEncodedFaces = y.prototype.GetNumberOfEncodedFaces = function() {
            return Ub(this.ptr);
          };
          y.prototype.__destroy__ = y.prototype.__destroy__ = function() {
            Vb(this.ptr);
          };
          A3.prototype = Object.create(v.prototype);
          A3.prototype.constructor = A3;
          A3.prototype.__class__ = A3;
          A3.__cache__ = {};
          a.ExpertEncoder = A3;
          A3.prototype.SetEncodingMethod = A3.prototype.SetEncodingMethod = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            Wb(c, b);
          };
          A3.prototype.SetAttributeQuantization = A3.prototype.SetAttributeQuantization = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            Xb(d, b, c);
          };
          A3.prototype.SetAttributeExplicitQuantization = A3.prototype.SetAttributeExplicitQuantization = function(b, c, d, e, g) {
            var t = this.ptr;
            n.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            "object" == typeof e && (e = Z(e));
            g && "object" === typeof g && (g = g.ptr);
            Yb(t, b, c, d, e, g);
          };
          A3.prototype.SetSpeedOptions = A3.prototype.SetSpeedOptions = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            Zb(d, b, c);
          };
          A3.prototype.SetTrackEncodedProperties = A3.prototype.SetTrackEncodedProperties = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            $b(c, b);
          };
          A3.prototype.EncodeToDracoBuffer = A3.prototype.EncodeToDracoBuffer = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return ac(d, b, c);
          };
          A3.prototype.GetNumberOfEncodedPoints = A3.prototype.GetNumberOfEncodedPoints = function() {
            return bc(this.ptr);
          };
          A3.prototype.GetNumberOfEncodedFaces = A3.prototype.GetNumberOfEncodedFaces = function() {
            return cc(this.ptr);
          };
          A3.prototype.__destroy__ = A3.prototype.__destroy__ = function() {
            dc(this.ptr);
          };
          (function() {
            function b() {
              a.INVALID = ec();
              a.POSITION = fc();
              a.NORMAL = gc();
              a.COLOR = hc();
              a.TEX_COORD = ic();
              a.GENERIC = jc();
              a.INVALID_GEOMETRY_TYPE = kc();
              a.POINT_CLOUD = lc();
              a.TRIANGULAR_MESH = mc();
              a.MESH_SEQUENTIAL_ENCODING = nc();
              a.MESH_EDGEBREAKER_ENCODING = oc();
            }
            qa ? b() : ka.unshift(b);
          })();
          if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
          return p.ready;
        };
      }();
      "object" === typeof exports && "object" === typeof module ? module.exports = DracoEncoderModule : "function" === typeof define && define.amd ? define([], function() {
        return DracoEncoderModule;
      }) : "object" === typeof exports && (exports.DracoEncoderModule = DracoEncoderModule);
    }
  });

  // node_modules/draco3dgltf/draco_decoder_gltf_nodejs.js
  var require_draco_decoder_gltf_nodejs = __commonJS({
    "node_modules/draco3dgltf/draco_decoder_gltf_nodejs.js"(exports, module) {
      init_define_process_versions();
      var $jscomp = $jscomp || {};
      $jscomp.scope = {};
      $jscomp.arrayIteratorImpl = function(h) {
        var n = 0;
        return function() {
          return n < h.length ? { done: false, value: h[n++] } : { done: true };
        };
      };
      $jscomp.arrayIterator = function(h) {
        return { next: $jscomp.arrayIteratorImpl(h) };
      };
      $jscomp.makeIterator = function(h) {
        var n = "undefined" != typeof Symbol && Symbol.iterator && h[Symbol.iterator];
        return n ? n.call(h) : $jscomp.arrayIterator(h);
      };
      $jscomp.ASSUME_ES5 = false;
      $jscomp.ASSUME_NO_NATIVE_MAP = false;
      $jscomp.ASSUME_NO_NATIVE_SET = false;
      $jscomp.SIMPLE_FROUND_POLYFILL = false;
      $jscomp.ISOLATE_POLYFILLS = false;
      $jscomp.FORCE_POLYFILL_PROMISE = false;
      $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION = false;
      $jscomp.getGlobal = function(h) {
        h = ["object" == typeof globalThis && globalThis, h, "object" == typeof window && window, "object" == typeof self && self, "object" == typeof global && global];
        for (var n = 0; n < h.length; ++n) {
          var k = h[n];
          if (k && k.Math == Math) return k;
        }
        throw Error("Cannot find global object");
      };
      $jscomp.global = $jscomp.getGlobal(exports);
      $jscomp.defineProperty = $jscomp.ASSUME_ES5 || "function" == typeof Object.defineProperties ? Object.defineProperty : function(h, n, k) {
        if (h == Array.prototype || h == Object.prototype) return h;
        h[n] = k.value;
        return h;
      };
      $jscomp.IS_SYMBOL_NATIVE = "function" === typeof Symbol && "symbol" === typeof Symbol("x");
      $jscomp.TRUST_ES6_POLYFILLS = !$jscomp.ISOLATE_POLYFILLS || $jscomp.IS_SYMBOL_NATIVE;
      $jscomp.polyfills = {};
      $jscomp.propertyToPolyfillSymbol = {};
      $jscomp.POLYFILL_PREFIX = "$jscp$";
      $jscomp.polyfill = function(h, n, k, p) {
        n && ($jscomp.ISOLATE_POLYFILLS ? $jscomp.polyfillIsolated(h, n, k, p) : $jscomp.polyfillUnisolated(h, n, k, p));
      };
      $jscomp.polyfillUnisolated = function(h, n, k, p) {
        k = $jscomp.global;
        h = h.split(".");
        for (p = 0; p < h.length - 1; p++) {
          var l = h[p];
          if (!(l in k)) return;
          k = k[l];
        }
        h = h[h.length - 1];
        p = k[h];
        n = n(p);
        n != p && null != n && $jscomp.defineProperty(k, h, { configurable: true, writable: true, value: n });
      };
      $jscomp.polyfillIsolated = function(h, n, k, p) {
        var l = h.split(".");
        h = 1 === l.length;
        p = l[0];
        p = !h && p in $jscomp.polyfills ? $jscomp.polyfills : $jscomp.global;
        for (var y = 0; y < l.length - 1; y++) {
          var f = l[y];
          if (!(f in p)) return;
          p = p[f];
        }
        l = l[l.length - 1];
        k = $jscomp.IS_SYMBOL_NATIVE && "es6" === k ? p[l] : null;
        n = n(k);
        null != n && (h ? $jscomp.defineProperty($jscomp.polyfills, l, { configurable: true, writable: true, value: n }) : n !== k && (void 0 === $jscomp.propertyToPolyfillSymbol[l] && (k = 1e9 * Math.random() >>> 0, $jscomp.propertyToPolyfillSymbol[l] = $jscomp.IS_SYMBOL_NATIVE ? $jscomp.global.Symbol(l) : $jscomp.POLYFILL_PREFIX + k + "$" + l), $jscomp.defineProperty(p, $jscomp.propertyToPolyfillSymbol[l], { configurable: true, writable: true, value: n })));
      };
      $jscomp.polyfill("Promise", function(h) {
        function n() {
          this.batch_ = null;
        }
        function k(f) {
          return f instanceof l ? f : new l(function(q, u) {
            q(f);
          });
        }
        if (h && (!($jscomp.FORCE_POLYFILL_PROMISE || $jscomp.FORCE_POLYFILL_PROMISE_WHEN_NO_UNHANDLED_REJECTION && "undefined" === typeof $jscomp.global.PromiseRejectionEvent) || !$jscomp.global.Promise || -1 === $jscomp.global.Promise.toString().indexOf("[native code]"))) return h;
        n.prototype.asyncExecute = function(f) {
          if (null == this.batch_) {
            this.batch_ = [];
            var q = this;
            this.asyncExecuteFunction(function() {
              q.executeBatch_();
            });
          }
          this.batch_.push(f);
        };
        var p = $jscomp.global.setTimeout;
        n.prototype.asyncExecuteFunction = function(f) {
          p(f, 0);
        };
        n.prototype.executeBatch_ = function() {
          for (; this.batch_ && this.batch_.length; ) {
            var f = this.batch_;
            this.batch_ = [];
            for (var q = 0; q < f.length; ++q) {
              var u = f[q];
              f[q] = null;
              try {
                u();
              } catch (A3) {
                this.asyncThrow_(A3);
              }
            }
          }
          this.batch_ = null;
        };
        n.prototype.asyncThrow_ = function(f) {
          this.asyncExecuteFunction(function() {
            throw f;
          });
        };
        var l = function(f) {
          this.state_ = 0;
          this.result_ = void 0;
          this.onSettledCallbacks_ = [];
          this.isRejectionHandled_ = false;
          var q = this.createResolveAndReject_();
          try {
            f(q.resolve, q.reject);
          } catch (u) {
            q.reject(u);
          }
        };
        l.prototype.createResolveAndReject_ = function() {
          function f(A3) {
            return function(F) {
              u || (u = true, A3.call(q, F));
            };
          }
          var q = this, u = false;
          return { resolve: f(this.resolveTo_), reject: f(this.reject_) };
        };
        l.prototype.resolveTo_ = function(f) {
          if (f === this) this.reject_(new TypeError("A Promise cannot resolve to itself"));
          else if (f instanceof l) this.settleSameAsPromise_(f);
          else {
            a: switch (typeof f) {
              case "object":
                var q = null != f;
                break a;
              case "function":
                q = true;
                break a;
              default:
                q = false;
            }
            q ? this.resolveToNonPromiseObj_(f) : this.fulfill_(f);
          }
        };
        l.prototype.resolveToNonPromiseObj_ = function(f) {
          var q = void 0;
          try {
            q = f.then;
          } catch (u) {
            this.reject_(u);
            return;
          }
          "function" == typeof q ? this.settleSameAsThenable_(q, f) : this.fulfill_(f);
        };
        l.prototype.reject_ = function(f) {
          this.settle_(2, f);
        };
        l.prototype.fulfill_ = function(f) {
          this.settle_(1, f);
        };
        l.prototype.settle_ = function(f, q) {
          if (0 != this.state_) throw Error("Cannot settle(" + f + ", " + q + "): Promise already settled in state" + this.state_);
          this.state_ = f;
          this.result_ = q;
          2 === this.state_ && this.scheduleUnhandledRejectionCheck_();
          this.executeOnSettledCallbacks_();
        };
        l.prototype.scheduleUnhandledRejectionCheck_ = function() {
          var f = this;
          p(function() {
            if (f.notifyUnhandledRejection_()) {
              var q = $jscomp.global.console;
              "undefined" !== typeof q && q.error(f.result_);
            }
          }, 1);
        };
        l.prototype.notifyUnhandledRejection_ = function() {
          if (this.isRejectionHandled_) return false;
          var f = $jscomp.global.CustomEvent, q = $jscomp.global.Event, u = $jscomp.global.dispatchEvent;
          if ("undefined" === typeof u) return true;
          "function" === typeof f ? f = new f("unhandledrejection", { cancelable: true }) : "function" === typeof q ? f = new q("unhandledrejection", { cancelable: true }) : (f = $jscomp.global.document.createEvent("CustomEvent"), f.initCustomEvent("unhandledrejection", false, true, f));
          f.promise = this;
          f.reason = this.result_;
          return u(f);
        };
        l.prototype.executeOnSettledCallbacks_ = function() {
          if (null != this.onSettledCallbacks_) {
            for (var f = 0; f < this.onSettledCallbacks_.length; ++f) y.asyncExecute(this.onSettledCallbacks_[f]);
            this.onSettledCallbacks_ = null;
          }
        };
        var y = new n();
        l.prototype.settleSameAsPromise_ = function(f) {
          var q = this.createResolveAndReject_();
          f.callWhenSettled_(q.resolve, q.reject);
        };
        l.prototype.settleSameAsThenable_ = function(f, q) {
          var u = this.createResolveAndReject_();
          try {
            f.call(q, u.resolve, u.reject);
          } catch (A3) {
            u.reject(A3);
          }
        };
        l.prototype.then = function(f, q) {
          function u(w, B3) {
            return "function" == typeof w ? function(R3) {
              try {
                A3(w(R3));
              } catch (Z) {
                F(Z);
              }
            } : B3;
          }
          var A3, F, v = new l(function(w, B3) {
            A3 = w;
            F = B3;
          });
          this.callWhenSettled_(u(f, A3), u(q, F));
          return v;
        };
        l.prototype.catch = function(f) {
          return this.then(void 0, f);
        };
        l.prototype.callWhenSettled_ = function(f, q) {
          function u() {
            switch (A3.state_) {
              case 1:
                f(A3.result_);
                break;
              case 2:
                q(A3.result_);
                break;
              default:
                throw Error("Unexpected state: " + A3.state_);
            }
          }
          var A3 = this;
          null == this.onSettledCallbacks_ ? y.asyncExecute(u) : this.onSettledCallbacks_.push(u);
          this.isRejectionHandled_ = true;
        };
        l.resolve = k;
        l.reject = function(f) {
          return new l(function(q, u) {
            u(f);
          });
        };
        l.race = function(f) {
          return new l(function(q, u) {
            for (var A3 = $jscomp.makeIterator(f), F = A3.next(); !F.done; F = A3.next()) k(F.value).callWhenSettled_(q, u);
          });
        };
        l.all = function(f) {
          var q = $jscomp.makeIterator(f), u = q.next();
          return u.done ? k([]) : new l(function(A3, F) {
            function v(R3) {
              return function(Z) {
                w[R3] = Z;
                B3--;
                0 == B3 && A3(w);
              };
            }
            var w = [], B3 = 0;
            do
              w.push(void 0), B3++, k(u.value).callWhenSettled_(v(w.length - 1), F), u = q.next();
            while (!u.done);
          });
        };
        return l;
      }, "es6", "es3");
      $jscomp.owns = function(h, n) {
        return Object.prototype.hasOwnProperty.call(h, n);
      };
      $jscomp.assign = $jscomp.TRUST_ES6_POLYFILLS && "function" == typeof Object.assign ? Object.assign : function(h, n) {
        for (var k = 1; k < arguments.length; k++) {
          var p = arguments[k];
          if (p) for (var l in p) $jscomp.owns(p, l) && (h[l] = p[l]);
        }
        return h;
      };
      $jscomp.polyfill("Object.assign", function(h) {
        return h || $jscomp.assign;
      }, "es6", "es3");
      $jscomp.checkStringArgs = function(h, n, k) {
        if (null == h) throw new TypeError("The 'this' value for String.prototype." + k + " must not be null or undefined");
        if (n instanceof RegExp) throw new TypeError("First argument to String.prototype." + k + " must not be a regular expression");
        return h + "";
      };
      $jscomp.polyfill("String.prototype.startsWith", function(h) {
        return h ? h : function(n, k) {
          var p = $jscomp.checkStringArgs(this, n, "startsWith");
          n += "";
          var l = p.length, y = n.length;
          k = Math.max(0, Math.min(k | 0, p.length));
          for (var f = 0; f < y && k < l; ) if (p[k++] != n[f++]) return false;
          return f >= y;
        };
      }, "es6", "es3");
      $jscomp.polyfill("Array.prototype.copyWithin", function(h) {
        function n(k) {
          k = Number(k);
          return Infinity === k || -Infinity === k ? k : k | 0;
        }
        return h ? h : function(k, p, l) {
          var y = this.length;
          k = n(k);
          p = n(p);
          l = void 0 === l ? y : n(l);
          k = 0 > k ? Math.max(y + k, 0) : Math.min(k, y);
          p = 0 > p ? Math.max(y + p, 0) : Math.min(p, y);
          l = 0 > l ? Math.max(y + l, 0) : Math.min(l, y);
          if (k < p) for (; p < l; ) p in this ? this[k++] = this[p++] : (delete this[k++], p++);
          else for (l = Math.min(l, y + p - k), k += l - p; l > p; ) --l in this ? this[--k] = this[l] : delete this[--k];
          return this;
        };
      }, "es6", "es3");
      $jscomp.typedArrayCopyWithin = function(h) {
        return h ? h : Array.prototype.copyWithin;
      };
      $jscomp.polyfill("Int8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint8Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint8ClampedArray.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Int16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint16Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Int32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Uint32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Float32Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      $jscomp.polyfill("Float64Array.prototype.copyWithin", $jscomp.typedArrayCopyWithin, "es6", "es5");
      var DracoDecoderModule = function() {
        var h = "undefined" !== typeof document && document.currentScript ? document.currentScript.src : void 0;
        "undefined" !== typeof __filename && (h = h || __filename);
        return function(n) {
          function k(e) {
            return a.locateFile ? a.locateFile(e, U) : U + e;
          }
          function p(e, b) {
            if (e) {
              var c = ia;
              var d = e + b;
              for (b = e; c[b] && !(b >= d); ) ++b;
              if (16 < b - e && c.buffer && ra) c = ra.decode(c.subarray(e, b));
              else {
                for (d = ""; e < b; ) {
                  var g = c[e++];
                  if (g & 128) {
                    var t = c[e++] & 63;
                    if (192 == (g & 224)) d += String.fromCharCode((g & 31) << 6 | t);
                    else {
                      var aa = c[e++] & 63;
                      g = 224 == (g & 240) ? (g & 15) << 12 | t << 6 | aa : (g & 7) << 18 | t << 12 | aa << 6 | c[e++] & 63;
                      65536 > g ? d += String.fromCharCode(g) : (g -= 65536, d += String.fromCharCode(55296 | g >> 10, 56320 | g & 1023));
                    }
                  } else d += String.fromCharCode(g);
                }
                c = d;
              }
            } else c = "";
            return c;
          }
          function l() {
            var e = ja.buffer;
            a.HEAP8 = W = new Int8Array(e);
            a.HEAP16 = new Int16Array(e);
            a.HEAP32 = ca = new Int32Array(e);
            a.HEAPU8 = ia = new Uint8Array(e);
            a.HEAPU16 = new Uint16Array(e);
            a.HEAPU32 = Y = new Uint32Array(e);
            a.HEAPF32 = new Float32Array(e);
            a.HEAPF64 = new Float64Array(e);
          }
          function y(e) {
            if (a.onAbort) a.onAbort(e);
            e = "Aborted(" + e + ")";
            da(e);
            sa = true;
            e = new WebAssembly.RuntimeError(e + ". Build with -sASSERTIONS for more info.");
            ka(e);
            throw e;
          }
          function f(e) {
            try {
              if (e == P && ea) return new Uint8Array(ea);
              if (ma) return ma(e);
              throw "both async and sync fetching of the wasm failed";
            } catch (b) {
              y(b);
            }
          }
          function q() {
            if (!ea && (ta || fa)) {
              if ("function" == typeof fetch && !P.startsWith("file://")) return fetch(P, { credentials: "same-origin" }).then(function(e) {
                if (!e.ok) throw "failed to load wasm binary file at '" + P + "'";
                return e.arrayBuffer();
              }).catch(function() {
                return f(P);
              });
              if (na) return new Promise(function(e, b) {
                na(P, function(c) {
                  e(new Uint8Array(c));
                }, b);
              });
            }
            return Promise.resolve().then(function() {
              return f(P);
            });
          }
          function u(e) {
            for (; 0 < e.length; ) e.shift()(a);
          }
          function A3(e) {
            this.excPtr = e;
            this.ptr = e - 24;
            this.set_type = function(b) {
              Y[this.ptr + 4 >> 2] = b;
            };
            this.get_type = function() {
              return Y[this.ptr + 4 >> 2];
            };
            this.set_destructor = function(b) {
              Y[this.ptr + 8 >> 2] = b;
            };
            this.get_destructor = function() {
              return Y[this.ptr + 8 >> 2];
            };
            this.set_refcount = function(b) {
              ca[this.ptr >> 2] = b;
            };
            this.set_caught = function(b) {
              W[this.ptr + 12 >> 0] = b ? 1 : 0;
            };
            this.get_caught = function() {
              return 0 != W[this.ptr + 12 >> 0];
            };
            this.set_rethrown = function(b) {
              W[this.ptr + 13 >> 0] = b ? 1 : 0;
            };
            this.get_rethrown = function() {
              return 0 != W[this.ptr + 13 >> 0];
            };
            this.init = function(b, c) {
              this.set_adjusted_ptr(0);
              this.set_type(b);
              this.set_destructor(c);
              this.set_refcount(0);
              this.set_caught(false);
              this.set_rethrown(false);
            };
            this.add_ref = function() {
              ca[this.ptr >> 2] += 1;
            };
            this.release_ref = function() {
              var b = ca[this.ptr >> 2];
              ca[this.ptr >> 2] = b - 1;
              return 1 === b;
            };
            this.set_adjusted_ptr = function(b) {
              Y[this.ptr + 16 >> 2] = b;
            };
            this.get_adjusted_ptr = function() {
              return Y[this.ptr + 16 >> 2];
            };
            this.get_exception_ptr = function() {
              if (ua(this.get_type())) return Y[this.excPtr >> 2];
              var b = this.get_adjusted_ptr();
              return 0 !== b ? b : this.excPtr;
            };
          }
          function F() {
            function e() {
              if (!la && (la = true, a.calledRun = true, !sa)) {
                va = true;
                u(oa);
                wa(a);
                if (a.onRuntimeInitialized) a.onRuntimeInitialized();
                if (a.postRun) for ("function" == typeof a.postRun && (a.postRun = [a.postRun]); a.postRun.length; ) xa.unshift(a.postRun.shift());
                u(xa);
              }
            }
            if (!(0 < ba)) {
              if (a.preRun) for ("function" == typeof a.preRun && (a.preRun = [a.preRun]); a.preRun.length; ) ya.unshift(a.preRun.shift());
              u(ya);
              0 < ba || (a.setStatus ? (a.setStatus("Running..."), setTimeout(function() {
                setTimeout(function() {
                  a.setStatus("");
                }, 1);
                e();
              }, 1)) : e());
            }
          }
          function v() {
          }
          function w(e) {
            return (e || v).__cache__;
          }
          function B3(e, b) {
            var c = w(b), d = c[e];
            if (d) return d;
            d = Object.create((b || v).prototype);
            d.ptr = e;
            return c[e] = d;
          }
          function R3(e) {
            if ("string" === typeof e) {
              for (var b = 0, c = 0; c < e.length; ++c) {
                var d = e.charCodeAt(c);
                127 >= d ? b++ : 2047 >= d ? b += 2 : 55296 <= d && 57343 >= d ? (b += 4, ++c) : b += 3;
              }
              b = Array(b + 1);
              c = 0;
              d = b.length;
              if (0 < d) {
                d = c + d - 1;
                for (var g = 0; g < e.length; ++g) {
                  var t = e.charCodeAt(g);
                  if (55296 <= t && 57343 >= t) {
                    var aa = e.charCodeAt(++g);
                    t = 65536 + ((t & 1023) << 10) | aa & 1023;
                  }
                  if (127 >= t) {
                    if (c >= d) break;
                    b[c++] = t;
                  } else {
                    if (2047 >= t) {
                      if (c + 1 >= d) break;
                      b[c++] = 192 | t >> 6;
                    } else {
                      if (65535 >= t) {
                        if (c + 2 >= d) break;
                        b[c++] = 224 | t >> 12;
                      } else {
                        if (c + 3 >= d) break;
                        b[c++] = 240 | t >> 18;
                        b[c++] = 128 | t >> 12 & 63;
                      }
                      b[c++] = 128 | t >> 6 & 63;
                    }
                    b[c++] = 128 | t & 63;
                  }
                }
                b[c] = 0;
              }
              e = r.alloc(b, W);
              r.copy(b, W, e);
              return e;
            }
            return e;
          }
          function Z(e) {
            if ("object" === typeof e) {
              var b = r.alloc(e, W);
              r.copy(e, W, b);
              return b;
            }
            return e;
          }
          function X() {
            throw "cannot construct a VoidPtr, no constructor in IDL";
          }
          function S() {
            this.ptr = za();
            w(S)[this.ptr] = this;
          }
          function Q() {
            this.ptr = Aa();
            w(Q)[this.ptr] = this;
          }
          function V() {
            this.ptr = Ba();
            w(V)[this.ptr] = this;
          }
          function x() {
            this.ptr = Ca();
            w(x)[this.ptr] = this;
          }
          function D() {
            this.ptr = Da();
            w(D)[this.ptr] = this;
          }
          function G3() {
            this.ptr = Ea();
            w(G3)[this.ptr] = this;
          }
          function H() {
            this.ptr = Fa();
            w(H)[this.ptr] = this;
          }
          function E() {
            this.ptr = Ga();
            w(E)[this.ptr] = this;
          }
          function T() {
            this.ptr = Ha();
            w(T)[this.ptr] = this;
          }
          function C() {
            throw "cannot construct a Status, no constructor in IDL";
          }
          function I() {
            this.ptr = Ia();
            w(I)[this.ptr] = this;
          }
          function J() {
            this.ptr = Ja();
            w(J)[this.ptr] = this;
          }
          function K() {
            this.ptr = Ka();
            w(K)[this.ptr] = this;
          }
          function L() {
            this.ptr = La();
            w(L)[this.ptr] = this;
          }
          function M() {
            this.ptr = Ma();
            w(M)[this.ptr] = this;
          }
          function N() {
            this.ptr = Na();
            w(N)[this.ptr] = this;
          }
          function O() {
            this.ptr = Oa();
            w(O)[this.ptr] = this;
          }
          function z() {
            this.ptr = Pa();
            w(z)[this.ptr] = this;
          }
          function m() {
            this.ptr = Qa();
            w(m)[this.ptr] = this;
          }
          n = void 0 === n ? {} : n;
          var a = "undefined" != typeof n ? n : {}, wa, ka;
          a.ready = new Promise(function(e, b) {
            wa = e;
            ka = b;
          });
          var Ra = false, Sa = false;
          a.onRuntimeInitialized = function() {
            Ra = true;
            if (Sa && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
          };
          a.onModuleParsed = function() {
            Sa = true;
            if (Ra && "function" === typeof a.onModuleLoaded) a.onModuleLoaded(a);
          };
          a.isVersionSupported = function(e) {
            if ("string" !== typeof e) return false;
            e = e.split(".");
            return 2 > e.length || 3 < e.length ? false : 1 == e[0] && 0 <= e[1] && 5 >= e[1] ? true : 0 != e[0] || 10 < e[1] ? false : true;
          };
          var Ta = Object.assign({}, a), ta = "object" == typeof window, fa = "function" == typeof importScripts, Ua = "object" == typeof process && "object" == typeof define_process_versions_default && false, U = "";
          if (Ua) {
            var Va = require_fs(), pa = require_path();
            U = fa ? pa.dirname(U) + "/" : __dirname + "/";
            var Wa = function(e, b) {
              e = e.startsWith("file://") ? new URL(e) : pa.normalize(e);
              return Va.readFileSync(e, b ? void 0 : "utf8");
            };
            var ma = function(e) {
              e = Wa(e, true);
              e.buffer || (e = new Uint8Array(e));
              return e;
            };
            var na = function(e, b, c) {
              e = e.startsWith("file://") ? new URL(e) : pa.normalize(e);
              Va.readFile(e, function(d, g) {
                d ? c(d) : b(g.buffer);
              });
            };
            1 < process.argv.length && process.argv[1].replace(/\\/g, "/");
            process.argv.slice(2);
            a.inspect = function() {
              return "[Emscripten Module object]";
            };
          } else if (ta || fa) fa ? U = self.location.href : "undefined" != typeof document && document.currentScript && (U = document.currentScript.src), h && (U = h), U = 0 !== U.indexOf("blob:") ? U.substr(0, U.replace(/[?#].*/, "").lastIndexOf("/") + 1) : "", Wa = function(e) {
            var b = new XMLHttpRequest();
            b.open(
              "GET",
              e,
              false
            );
            b.send(null);
            return b.responseText;
          }, fa && (ma = function(e) {
            var b = new XMLHttpRequest();
            b.open("GET", e, false);
            b.responseType = "arraybuffer";
            b.send(null);
            return new Uint8Array(b.response);
          }), na = function(e, b, c) {
            var d = new XMLHttpRequest();
            d.open("GET", e, true);
            d.responseType = "arraybuffer";
            d.onload = function() {
              200 == d.status || 0 == d.status && d.response ? b(d.response) : c();
            };
            d.onerror = c;
            d.send(null);
          };
          a.print || console.log.bind(console);
          var da = a.printErr || console.warn.bind(console);
          Object.assign(a, Ta);
          Ta = null;
          var ea;
          a.wasmBinary && (ea = a.wasmBinary);
          "object" != typeof WebAssembly && y("no native wasm support detected");
          var ja, sa = false, ra = "undefined" != typeof TextDecoder ? new TextDecoder("utf8") : void 0, W, ia, ca, Y, ya = [], oa = [], xa = [], va = false, ba = 0, qa = null, ha = null;
          var P = "draco_decoder_gltf.wasm";
          P.startsWith("data:application/octet-stream;base64,") || (P = k(P));
          var pd = 0, qd = { b: function(e, b, c) {
            new A3(e).init(b, c);
            pd++;
            throw e;
          }, a: function() {
            y("");
          }, d: function(e, b, c) {
            ia.copyWithin(e, b, b + c);
          }, c: function(e) {
            var b = ia.length;
            e >>>= 0;
            if (2147483648 < e) return false;
            for (var c = 1; 4 >= c; c *= 2) {
              var d = b * (1 + 0.2 / c);
              d = Math.min(d, e + 100663296);
              var g = Math;
              d = Math.max(e, d);
              g = g.min.call(g, 2147483648, d + (65536 - d % 65536) % 65536);
              a: {
                d = ja.buffer;
                try {
                  ja.grow(g - d.byteLength + 65535 >>> 16);
                  l();
                  var t = 1;
                  break a;
                } catch (aa) {
                }
                t = void 0;
              }
              if (t) return true;
            }
            return false;
          } };
          (function() {
            function e(g, t) {
              a.asm = g.exports;
              ja = a.asm.e;
              l();
              oa.unshift(a.asm.f);
              ba--;
              a.monitorRunDependencies && a.monitorRunDependencies(ba);
              0 == ba && (null !== qa && (clearInterval(qa), qa = null), ha && (g = ha, ha = null, g()));
            }
            function b(g) {
              e(g.instance);
            }
            function c(g) {
              return q().then(function(t) {
                return WebAssembly.instantiate(t, d);
              }).then(function(t) {
                return t;
              }).then(g, function(t) {
                da("failed to asynchronously prepare wasm: " + t);
                y(t);
              });
            }
            var d = { a: qd };
            ba++;
            a.monitorRunDependencies && a.monitorRunDependencies(ba);
            if (a.instantiateWasm) try {
              return a.instantiateWasm(d, e);
            } catch (g) {
              da("Module.instantiateWasm callback failed with error: " + g), ka(g);
            }
            (function() {
              return ea || "function" != typeof WebAssembly.instantiateStreaming || P.startsWith("data:application/octet-stream;base64,") || P.startsWith("file://") || Ua || "function" != typeof fetch ? c(b) : fetch(P, { credentials: "same-origin" }).then(function(g) {
                return WebAssembly.instantiateStreaming(g, d).then(b, function(t) {
                  da("wasm streaming compile failed: " + t);
                  da("falling back to ArrayBuffer instantiation");
                  return c(b);
                });
              });
            })().catch(ka);
            return {};
          })();
          var Xa = a._emscripten_bind_VoidPtr___destroy___0 = function() {
            return (Xa = a._emscripten_bind_VoidPtr___destroy___0 = a.asm.h).apply(null, arguments);
          }, za = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = function() {
            return (za = a._emscripten_bind_DecoderBuffer_DecoderBuffer_0 = a.asm.i).apply(null, arguments);
          }, Ya = a._emscripten_bind_DecoderBuffer_Init_2 = function() {
            return (Ya = a._emscripten_bind_DecoderBuffer_Init_2 = a.asm.j).apply(null, arguments);
          }, Za = a._emscripten_bind_DecoderBuffer___destroy___0 = function() {
            return (Za = a._emscripten_bind_DecoderBuffer___destroy___0 = a.asm.k).apply(null, arguments);
          }, Aa = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = function() {
            return (Aa = a._emscripten_bind_AttributeTransformData_AttributeTransformData_0 = a.asm.l).apply(null, arguments);
          }, $a = a._emscripten_bind_AttributeTransformData_transform_type_0 = function() {
            return ($a = a._emscripten_bind_AttributeTransformData_transform_type_0 = a.asm.m).apply(null, arguments);
          }, ab = a._emscripten_bind_AttributeTransformData___destroy___0 = function() {
            return (ab = a._emscripten_bind_AttributeTransformData___destroy___0 = a.asm.n).apply(null, arguments);
          }, Ba = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = function() {
            return (Ba = a._emscripten_bind_GeometryAttribute_GeometryAttribute_0 = a.asm.o).apply(null, arguments);
          }, bb = a._emscripten_bind_GeometryAttribute___destroy___0 = function() {
            return (bb = a._emscripten_bind_GeometryAttribute___destroy___0 = a.asm.p).apply(null, arguments);
          }, Ca = a._emscripten_bind_PointAttribute_PointAttribute_0 = function() {
            return (Ca = a._emscripten_bind_PointAttribute_PointAttribute_0 = a.asm.q).apply(null, arguments);
          }, cb = a._emscripten_bind_PointAttribute_size_0 = function() {
            return (cb = a._emscripten_bind_PointAttribute_size_0 = a.asm.r).apply(null, arguments);
          }, db = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = function() {
            return (db = a._emscripten_bind_PointAttribute_GetAttributeTransformData_0 = a.asm.s).apply(null, arguments);
          }, eb = a._emscripten_bind_PointAttribute_attribute_type_0 = function() {
            return (eb = a._emscripten_bind_PointAttribute_attribute_type_0 = a.asm.t).apply(null, arguments);
          }, fb = a._emscripten_bind_PointAttribute_data_type_0 = function() {
            return (fb = a._emscripten_bind_PointAttribute_data_type_0 = a.asm.u).apply(null, arguments);
          }, gb = a._emscripten_bind_PointAttribute_num_components_0 = function() {
            return (gb = a._emscripten_bind_PointAttribute_num_components_0 = a.asm.v).apply(null, arguments);
          }, hb = a._emscripten_bind_PointAttribute_normalized_0 = function() {
            return (hb = a._emscripten_bind_PointAttribute_normalized_0 = a.asm.w).apply(null, arguments);
          }, ib = a._emscripten_bind_PointAttribute_byte_stride_0 = function() {
            return (ib = a._emscripten_bind_PointAttribute_byte_stride_0 = a.asm.x).apply(null, arguments);
          }, jb = a._emscripten_bind_PointAttribute_byte_offset_0 = function() {
            return (jb = a._emscripten_bind_PointAttribute_byte_offset_0 = a.asm.y).apply(null, arguments);
          }, kb = a._emscripten_bind_PointAttribute_unique_id_0 = function() {
            return (kb = a._emscripten_bind_PointAttribute_unique_id_0 = a.asm.z).apply(null, arguments);
          }, lb = a._emscripten_bind_PointAttribute___destroy___0 = function() {
            return (lb = a._emscripten_bind_PointAttribute___destroy___0 = a.asm.A).apply(null, arguments);
          }, Da = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = function() {
            return (Da = a._emscripten_bind_AttributeQuantizationTransform_AttributeQuantizationTransform_0 = a.asm.B).apply(null, arguments);
          }, mb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = function() {
            return (mb = a._emscripten_bind_AttributeQuantizationTransform_InitFromAttribute_1 = a.asm.C).apply(null, arguments);
          }, nb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = function() {
            return (nb = a._emscripten_bind_AttributeQuantizationTransform_quantization_bits_0 = a.asm.D).apply(null, arguments);
          }, ob = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = function() {
            return (ob = a._emscripten_bind_AttributeQuantizationTransform_min_value_1 = a.asm.E).apply(null, arguments);
          }, pb = a._emscripten_bind_AttributeQuantizationTransform_range_0 = function() {
            return (pb = a._emscripten_bind_AttributeQuantizationTransform_range_0 = a.asm.F).apply(null, arguments);
          }, qb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = function() {
            return (qb = a._emscripten_bind_AttributeQuantizationTransform___destroy___0 = a.asm.G).apply(null, arguments);
          }, Ea = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = function() {
            return (Ea = a._emscripten_bind_AttributeOctahedronTransform_AttributeOctahedronTransform_0 = a.asm.H).apply(null, arguments);
          }, rb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = function() {
            return (rb = a._emscripten_bind_AttributeOctahedronTransform_InitFromAttribute_1 = a.asm.I).apply(null, arguments);
          }, sb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = function() {
            return (sb = a._emscripten_bind_AttributeOctahedronTransform_quantization_bits_0 = a.asm.J).apply(null, arguments);
          }, tb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = function() {
            return (tb = a._emscripten_bind_AttributeOctahedronTransform___destroy___0 = a.asm.K).apply(null, arguments);
          }, Fa = a._emscripten_bind_PointCloud_PointCloud_0 = function() {
            return (Fa = a._emscripten_bind_PointCloud_PointCloud_0 = a.asm.L).apply(null, arguments);
          }, ub = a._emscripten_bind_PointCloud_num_attributes_0 = function() {
            return (ub = a._emscripten_bind_PointCloud_num_attributes_0 = a.asm.M).apply(null, arguments);
          }, vb = a._emscripten_bind_PointCloud_num_points_0 = function() {
            return (vb = a._emscripten_bind_PointCloud_num_points_0 = a.asm.N).apply(
              null,
              arguments
            );
          }, wb = a._emscripten_bind_PointCloud___destroy___0 = function() {
            return (wb = a._emscripten_bind_PointCloud___destroy___0 = a.asm.O).apply(null, arguments);
          }, Ga = a._emscripten_bind_Mesh_Mesh_0 = function() {
            return (Ga = a._emscripten_bind_Mesh_Mesh_0 = a.asm.P).apply(null, arguments);
          }, xb = a._emscripten_bind_Mesh_num_faces_0 = function() {
            return (xb = a._emscripten_bind_Mesh_num_faces_0 = a.asm.Q).apply(null, arguments);
          }, yb = a._emscripten_bind_Mesh_num_attributes_0 = function() {
            return (yb = a._emscripten_bind_Mesh_num_attributes_0 = a.asm.R).apply(null, arguments);
          }, zb = a._emscripten_bind_Mesh_num_points_0 = function() {
            return (zb = a._emscripten_bind_Mesh_num_points_0 = a.asm.S).apply(null, arguments);
          }, Ab = a._emscripten_bind_Mesh___destroy___0 = function() {
            return (Ab = a._emscripten_bind_Mesh___destroy___0 = a.asm.T).apply(null, arguments);
          }, Ha = a._emscripten_bind_Metadata_Metadata_0 = function() {
            return (Ha = a._emscripten_bind_Metadata_Metadata_0 = a.asm.U).apply(null, arguments);
          }, Bb = a._emscripten_bind_Metadata___destroy___0 = function() {
            return (Bb = a._emscripten_bind_Metadata___destroy___0 = a.asm.V).apply(null, arguments);
          }, Cb = a._emscripten_bind_Status_code_0 = function() {
            return (Cb = a._emscripten_bind_Status_code_0 = a.asm.W).apply(null, arguments);
          }, Db = a._emscripten_bind_Status_ok_0 = function() {
            return (Db = a._emscripten_bind_Status_ok_0 = a.asm.X).apply(null, arguments);
          }, Eb = a._emscripten_bind_Status_error_msg_0 = function() {
            return (Eb = a._emscripten_bind_Status_error_msg_0 = a.asm.Y).apply(null, arguments);
          }, Fb = a._emscripten_bind_Status___destroy___0 = function() {
            return (Fb = a._emscripten_bind_Status___destroy___0 = a.asm.Z).apply(null, arguments);
          }, Ia = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = function() {
            return (Ia = a._emscripten_bind_DracoFloat32Array_DracoFloat32Array_0 = a.asm._).apply(null, arguments);
          }, Gb = a._emscripten_bind_DracoFloat32Array_GetValue_1 = function() {
            return (Gb = a._emscripten_bind_DracoFloat32Array_GetValue_1 = a.asm.$).apply(null, arguments);
          }, Hb = a._emscripten_bind_DracoFloat32Array_size_0 = function() {
            return (Hb = a._emscripten_bind_DracoFloat32Array_size_0 = a.asm.aa).apply(null, arguments);
          }, Ib = a._emscripten_bind_DracoFloat32Array___destroy___0 = function() {
            return (Ib = a._emscripten_bind_DracoFloat32Array___destroy___0 = a.asm.ba).apply(null, arguments);
          }, Ja = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = function() {
            return (Ja = a._emscripten_bind_DracoInt8Array_DracoInt8Array_0 = a.asm.ca).apply(null, arguments);
          }, Jb = a._emscripten_bind_DracoInt8Array_GetValue_1 = function() {
            return (Jb = a._emscripten_bind_DracoInt8Array_GetValue_1 = a.asm.da).apply(null, arguments);
          }, Kb = a._emscripten_bind_DracoInt8Array_size_0 = function() {
            return (Kb = a._emscripten_bind_DracoInt8Array_size_0 = a.asm.ea).apply(null, arguments);
          }, Lb = a._emscripten_bind_DracoInt8Array___destroy___0 = function() {
            return (Lb = a._emscripten_bind_DracoInt8Array___destroy___0 = a.asm.fa).apply(null, arguments);
          }, Ka = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = function() {
            return (Ka = a._emscripten_bind_DracoUInt8Array_DracoUInt8Array_0 = a.asm.ga).apply(null, arguments);
          }, Mb = a._emscripten_bind_DracoUInt8Array_GetValue_1 = function() {
            return (Mb = a._emscripten_bind_DracoUInt8Array_GetValue_1 = a.asm.ha).apply(null, arguments);
          }, Nb = a._emscripten_bind_DracoUInt8Array_size_0 = function() {
            return (Nb = a._emscripten_bind_DracoUInt8Array_size_0 = a.asm.ia).apply(null, arguments);
          }, Ob = a._emscripten_bind_DracoUInt8Array___destroy___0 = function() {
            return (Ob = a._emscripten_bind_DracoUInt8Array___destroy___0 = a.asm.ja).apply(null, arguments);
          }, La = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = function() {
            return (La = a._emscripten_bind_DracoInt16Array_DracoInt16Array_0 = a.asm.ka).apply(null, arguments);
          }, Pb = a._emscripten_bind_DracoInt16Array_GetValue_1 = function() {
            return (Pb = a._emscripten_bind_DracoInt16Array_GetValue_1 = a.asm.la).apply(null, arguments);
          }, Qb = a._emscripten_bind_DracoInt16Array_size_0 = function() {
            return (Qb = a._emscripten_bind_DracoInt16Array_size_0 = a.asm.ma).apply(null, arguments);
          }, Rb = a._emscripten_bind_DracoInt16Array___destroy___0 = function() {
            return (Rb = a._emscripten_bind_DracoInt16Array___destroy___0 = a.asm.na).apply(null, arguments);
          }, Ma = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = function() {
            return (Ma = a._emscripten_bind_DracoUInt16Array_DracoUInt16Array_0 = a.asm.oa).apply(null, arguments);
          }, Sb = a._emscripten_bind_DracoUInt16Array_GetValue_1 = function() {
            return (Sb = a._emscripten_bind_DracoUInt16Array_GetValue_1 = a.asm.pa).apply(null, arguments);
          }, Tb = a._emscripten_bind_DracoUInt16Array_size_0 = function() {
            return (Tb = a._emscripten_bind_DracoUInt16Array_size_0 = a.asm.qa).apply(null, arguments);
          }, Ub = a._emscripten_bind_DracoUInt16Array___destroy___0 = function() {
            return (Ub = a._emscripten_bind_DracoUInt16Array___destroy___0 = a.asm.ra).apply(null, arguments);
          }, Na = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = function() {
            return (Na = a._emscripten_bind_DracoInt32Array_DracoInt32Array_0 = a.asm.sa).apply(null, arguments);
          }, Vb = a._emscripten_bind_DracoInt32Array_GetValue_1 = function() {
            return (Vb = a._emscripten_bind_DracoInt32Array_GetValue_1 = a.asm.ta).apply(null, arguments);
          }, Wb = a._emscripten_bind_DracoInt32Array_size_0 = function() {
            return (Wb = a._emscripten_bind_DracoInt32Array_size_0 = a.asm.ua).apply(null, arguments);
          }, Xb = a._emscripten_bind_DracoInt32Array___destroy___0 = function() {
            return (Xb = a._emscripten_bind_DracoInt32Array___destroy___0 = a.asm.va).apply(null, arguments);
          }, Oa = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = function() {
            return (Oa = a._emscripten_bind_DracoUInt32Array_DracoUInt32Array_0 = a.asm.wa).apply(null, arguments);
          }, Yb = a._emscripten_bind_DracoUInt32Array_GetValue_1 = function() {
            return (Yb = a._emscripten_bind_DracoUInt32Array_GetValue_1 = a.asm.xa).apply(null, arguments);
          }, Zb = a._emscripten_bind_DracoUInt32Array_size_0 = function() {
            return (Zb = a._emscripten_bind_DracoUInt32Array_size_0 = a.asm.ya).apply(null, arguments);
          }, $b = a._emscripten_bind_DracoUInt32Array___destroy___0 = function() {
            return ($b = a._emscripten_bind_DracoUInt32Array___destroy___0 = a.asm.za).apply(null, arguments);
          }, Pa = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = function() {
            return (Pa = a._emscripten_bind_MetadataQuerier_MetadataQuerier_0 = a.asm.Aa).apply(null, arguments);
          }, ac = a._emscripten_bind_MetadataQuerier_HasEntry_2 = function() {
            return (ac = a._emscripten_bind_MetadataQuerier_HasEntry_2 = a.asm.Ba).apply(null, arguments);
          }, bc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = function() {
            return (bc = a._emscripten_bind_MetadataQuerier_GetIntEntry_2 = a.asm.Ca).apply(null, arguments);
          }, cc = a._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = function() {
            return (cc = a._emscripten_bind_MetadataQuerier_GetIntEntryArray_3 = a.asm.Da).apply(null, arguments);
          }, dc = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = function() {
            return (dc = a._emscripten_bind_MetadataQuerier_GetDoubleEntry_2 = a.asm.Ea).apply(null, arguments);
          }, ec = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = function() {
            return (ec = a._emscripten_bind_MetadataQuerier_GetStringEntry_2 = a.asm.Fa).apply(
              null,
              arguments
            );
          }, fc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = function() {
            return (fc = a._emscripten_bind_MetadataQuerier_NumEntries_1 = a.asm.Ga).apply(null, arguments);
          }, gc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = function() {
            return (gc = a._emscripten_bind_MetadataQuerier_GetEntryName_2 = a.asm.Ha).apply(null, arguments);
          }, hc = a._emscripten_bind_MetadataQuerier___destroy___0 = function() {
            return (hc = a._emscripten_bind_MetadataQuerier___destroy___0 = a.asm.Ia).apply(null, arguments);
          }, Qa = a._emscripten_bind_Decoder_Decoder_0 = function() {
            return (Qa = a._emscripten_bind_Decoder_Decoder_0 = a.asm.Ja).apply(null, arguments);
          }, ic = a._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = function() {
            return (ic = a._emscripten_bind_Decoder_DecodeArrayToPointCloud_3 = a.asm.Ka).apply(null, arguments);
          }, jc = a._emscripten_bind_Decoder_DecodeArrayToMesh_3 = function() {
            return (jc = a._emscripten_bind_Decoder_DecodeArrayToMesh_3 = a.asm.La).apply(null, arguments);
          }, kc = a._emscripten_bind_Decoder_GetAttributeId_2 = function() {
            return (kc = a._emscripten_bind_Decoder_GetAttributeId_2 = a.asm.Ma).apply(null, arguments);
          }, lc = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = function() {
            return (lc = a._emscripten_bind_Decoder_GetAttributeIdByName_2 = a.asm.Na).apply(null, arguments);
          }, mc = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = function() {
            return (mc = a._emscripten_bind_Decoder_GetAttributeIdByMetadataEntry_3 = a.asm.Oa).apply(null, arguments);
          }, nc = a._emscripten_bind_Decoder_GetAttribute_2 = function() {
            return (nc = a._emscripten_bind_Decoder_GetAttribute_2 = a.asm.Pa).apply(null, arguments);
          }, oc = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = function() {
            return (oc = a._emscripten_bind_Decoder_GetAttributeByUniqueId_2 = a.asm.Qa).apply(null, arguments);
          }, pc = a._emscripten_bind_Decoder_GetMetadata_1 = function() {
            return (pc = a._emscripten_bind_Decoder_GetMetadata_1 = a.asm.Ra).apply(null, arguments);
          }, qc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = function() {
            return (qc = a._emscripten_bind_Decoder_GetAttributeMetadata_2 = a.asm.Sa).apply(null, arguments);
          }, rc = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = function() {
            return (rc = a._emscripten_bind_Decoder_GetFaceFromMesh_3 = a.asm.Ta).apply(null, arguments);
          }, sc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = function() {
            return (sc = a._emscripten_bind_Decoder_GetTriangleStripsFromMesh_2 = a.asm.Ua).apply(null, arguments);
          }, tc = a._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = function() {
            return (tc = a._emscripten_bind_Decoder_GetTrianglesUInt16Array_3 = a.asm.Va).apply(null, arguments);
          }, uc = a._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = function() {
            return (uc = a._emscripten_bind_Decoder_GetTrianglesUInt32Array_3 = a.asm.Wa).apply(null, arguments);
          }, vc = a._emscripten_bind_Decoder_GetAttributeFloat_3 = function() {
            return (vc = a._emscripten_bind_Decoder_GetAttributeFloat_3 = a.asm.Xa).apply(null, arguments);
          }, wc = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = function() {
            return (wc = a._emscripten_bind_Decoder_GetAttributeFloatForAllPoints_3 = a.asm.Ya).apply(null, arguments);
          }, xc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = function() {
            return (xc = a._emscripten_bind_Decoder_GetAttributeIntForAllPoints_3 = a.asm.Za).apply(null, arguments);
          }, yc = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = function() {
            return (yc = a._emscripten_bind_Decoder_GetAttributeInt8ForAllPoints_3 = a.asm._a).apply(null, arguments);
          }, zc = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = function() {
            return (zc = a._emscripten_bind_Decoder_GetAttributeUInt8ForAllPoints_3 = a.asm.$a).apply(null, arguments);
          }, Ac = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = function() {
            return (Ac = a._emscripten_bind_Decoder_GetAttributeInt16ForAllPoints_3 = a.asm.ab).apply(null, arguments);
          }, Bc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = function() {
            return (Bc = a._emscripten_bind_Decoder_GetAttributeUInt16ForAllPoints_3 = a.asm.bb).apply(null, arguments);
          }, Cc = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = function() {
            return (Cc = a._emscripten_bind_Decoder_GetAttributeInt32ForAllPoints_3 = a.asm.cb).apply(null, arguments);
          }, Dc = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = function() {
            return (Dc = a._emscripten_bind_Decoder_GetAttributeUInt32ForAllPoints_3 = a.asm.db).apply(null, arguments);
          }, Ec = a._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = function() {
            return (Ec = a._emscripten_bind_Decoder_GetAttributeDataArrayForAllPoints_5 = a.asm.eb).apply(null, arguments);
          }, Fc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = function() {
            return (Fc = a._emscripten_bind_Decoder_SkipAttributeTransform_1 = a.asm.fb).apply(null, arguments);
          }, Gc = a._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = function() {
            return (Gc = a._emscripten_bind_Decoder_GetEncodedGeometryType_Deprecated_1 = a.asm.gb).apply(null, arguments);
          }, Hc = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = function() {
            return (Hc = a._emscripten_bind_Decoder_DecodeBufferToPointCloud_2 = a.asm.hb).apply(null, arguments);
          }, Ic = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = function() {
            return (Ic = a._emscripten_bind_Decoder_DecodeBufferToMesh_2 = a.asm.ib).apply(null, arguments);
          }, Jc = a._emscripten_bind_Decoder___destroy___0 = function() {
            return (Jc = a._emscripten_bind_Decoder___destroy___0 = a.asm.jb).apply(null, arguments);
          }, Kc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = function() {
            return (Kc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_INVALID_TRANSFORM = a.asm.kb).apply(null, arguments);
          }, Lc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = function() {
            return (Lc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_NO_TRANSFORM = a.asm.lb).apply(null, arguments);
          }, Mc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = function() {
            return (Mc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_QUANTIZATION_TRANSFORM = a.asm.mb).apply(null, arguments);
          }, Nc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = function() {
            return (Nc = a._emscripten_enum_draco_AttributeTransformType_ATTRIBUTE_OCTAHEDRON_TRANSFORM = a.asm.nb).apply(null, arguments);
          }, Oc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = function() {
            return (Oc = a._emscripten_enum_draco_GeometryAttribute_Type_INVALID = a.asm.ob).apply(null, arguments);
          }, Pc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = function() {
            return (Pc = a._emscripten_enum_draco_GeometryAttribute_Type_POSITION = a.asm.pb).apply(null, arguments);
          }, Qc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = function() {
            return (Qc = a._emscripten_enum_draco_GeometryAttribute_Type_NORMAL = a.asm.qb).apply(null, arguments);
          }, Rc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = function() {
            return (Rc = a._emscripten_enum_draco_GeometryAttribute_Type_COLOR = a.asm.rb).apply(null, arguments);
          }, Sc = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = function() {
            return (Sc = a._emscripten_enum_draco_GeometryAttribute_Type_TEX_COORD = a.asm.sb).apply(null, arguments);
          }, Tc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = function() {
            return (Tc = a._emscripten_enum_draco_GeometryAttribute_Type_GENERIC = a.asm.tb).apply(null, arguments);
          }, Uc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = function() {
            return (Uc = a._emscripten_enum_draco_EncodedGeometryType_INVALID_GEOMETRY_TYPE = a.asm.ub).apply(null, arguments);
          }, Vc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = function() {
            return (Vc = a._emscripten_enum_draco_EncodedGeometryType_POINT_CLOUD = a.asm.vb).apply(null, arguments);
          }, Wc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = function() {
            return (Wc = a._emscripten_enum_draco_EncodedGeometryType_TRIANGULAR_MESH = a.asm.wb).apply(null, arguments);
          }, Xc = a._emscripten_enum_draco_DataType_DT_INVALID = function() {
            return (Xc = a._emscripten_enum_draco_DataType_DT_INVALID = a.asm.xb).apply(null, arguments);
          }, Yc = a._emscripten_enum_draco_DataType_DT_INT8 = function() {
            return (Yc = a._emscripten_enum_draco_DataType_DT_INT8 = a.asm.yb).apply(null, arguments);
          }, Zc = a._emscripten_enum_draco_DataType_DT_UINT8 = function() {
            return (Zc = a._emscripten_enum_draco_DataType_DT_UINT8 = a.asm.zb).apply(null, arguments);
          }, $c = a._emscripten_enum_draco_DataType_DT_INT16 = function() {
            return ($c = a._emscripten_enum_draco_DataType_DT_INT16 = a.asm.Ab).apply(null, arguments);
          }, ad = a._emscripten_enum_draco_DataType_DT_UINT16 = function() {
            return (ad = a._emscripten_enum_draco_DataType_DT_UINT16 = a.asm.Bb).apply(null, arguments);
          }, bd = a._emscripten_enum_draco_DataType_DT_INT32 = function() {
            return (bd = a._emscripten_enum_draco_DataType_DT_INT32 = a.asm.Cb).apply(null, arguments);
          }, cd = a._emscripten_enum_draco_DataType_DT_UINT32 = function() {
            return (cd = a._emscripten_enum_draco_DataType_DT_UINT32 = a.asm.Db).apply(null, arguments);
          }, dd = a._emscripten_enum_draco_DataType_DT_INT64 = function() {
            return (dd = a._emscripten_enum_draco_DataType_DT_INT64 = a.asm.Eb).apply(null, arguments);
          }, ed = a._emscripten_enum_draco_DataType_DT_UINT64 = function() {
            return (ed = a._emscripten_enum_draco_DataType_DT_UINT64 = a.asm.Fb).apply(null, arguments);
          }, fd = a._emscripten_enum_draco_DataType_DT_FLOAT32 = function() {
            return (fd = a._emscripten_enum_draco_DataType_DT_FLOAT32 = a.asm.Gb).apply(null, arguments);
          }, gd = a._emscripten_enum_draco_DataType_DT_FLOAT64 = function() {
            return (gd = a._emscripten_enum_draco_DataType_DT_FLOAT64 = a.asm.Hb).apply(null, arguments);
          }, hd = a._emscripten_enum_draco_DataType_DT_BOOL = function() {
            return (hd = a._emscripten_enum_draco_DataType_DT_BOOL = a.asm.Ib).apply(null, arguments);
          }, id = a._emscripten_enum_draco_DataType_DT_TYPES_COUNT = function() {
            return (id = a._emscripten_enum_draco_DataType_DT_TYPES_COUNT = a.asm.Jb).apply(null, arguments);
          }, jd = a._emscripten_enum_draco_StatusCode_OK = function() {
            return (jd = a._emscripten_enum_draco_StatusCode_OK = a.asm.Kb).apply(null, arguments);
          }, kd = a._emscripten_enum_draco_StatusCode_DRACO_ERROR = function() {
            return (kd = a._emscripten_enum_draco_StatusCode_DRACO_ERROR = a.asm.Lb).apply(null, arguments);
          }, ld = a._emscripten_enum_draco_StatusCode_IO_ERROR = function() {
            return (ld = a._emscripten_enum_draco_StatusCode_IO_ERROR = a.asm.Mb).apply(null, arguments);
          }, md = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = function() {
            return (md = a._emscripten_enum_draco_StatusCode_INVALID_PARAMETER = a.asm.Nb).apply(null, arguments);
          }, nd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = function() {
            return (nd = a._emscripten_enum_draco_StatusCode_UNSUPPORTED_VERSION = a.asm.Ob).apply(null, arguments);
          }, od = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = function() {
            return (od = a._emscripten_enum_draco_StatusCode_UNKNOWN_VERSION = a.asm.Pb).apply(null, arguments);
          };
          a._malloc = function() {
            return (a._malloc = a.asm.Qb).apply(null, arguments);
          };
          a._free = function() {
            return (a._free = a.asm.Rb).apply(null, arguments);
          };
          var ua = function() {
            return (ua = a.asm.Sb).apply(null, arguments);
          };
          a.___start_em_js = 11660;
          a.___stop_em_js = 11758;
          var la;
          ha = function b() {
            la || F();
            la || (ha = b);
          };
          if (a.preInit) for ("function" == typeof a.preInit && (a.preInit = [a.preInit]); 0 < a.preInit.length; ) a.preInit.pop()();
          F();
          v.prototype = Object.create(v.prototype);
          v.prototype.constructor = v;
          v.prototype.__class__ = v;
          v.__cache__ = {};
          a.WrapperObject = v;
          a.getCache = w;
          a.wrapPointer = B3;
          a.castObject = function(b, c) {
            return B3(b.ptr, c);
          };
          a.NULL = B3(0);
          a.destroy = function(b) {
            if (!b.__destroy__) throw "Error: Cannot destroy object. (Did you create it yourself?)";
            b.__destroy__();
            delete w(b.__class__)[b.ptr];
          };
          a.compare = function(b, c) {
            return b.ptr === c.ptr;
          };
          a.getPointer = function(b) {
            return b.ptr;
          };
          a.getClass = function(b) {
            return b.__class__;
          };
          var r = { buffer: 0, size: 0, pos: 0, temps: [], needed: 0, prepare: function() {
            if (r.needed) {
              for (var b = 0; b < r.temps.length; b++) a._free(r.temps[b]);
              r.temps.length = 0;
              a._free(r.buffer);
              r.buffer = 0;
              r.size += r.needed;
              r.needed = 0;
            }
            r.buffer || (r.size += 128, r.buffer = a._malloc(r.size), r.buffer || y(void 0));
            r.pos = 0;
          }, alloc: function(b, c) {
            r.buffer || y(void 0);
            b = b.length * c.BYTES_PER_ELEMENT;
            b = b + 7 & -8;
            r.pos + b >= r.size ? (0 < b || y(void 0), r.needed += b, c = a._malloc(b), r.temps.push(c)) : (c = r.buffer + r.pos, r.pos += b);
            return c;
          }, copy: function(b, c, d) {
            d >>>= 0;
            switch (c.BYTES_PER_ELEMENT) {
              case 2:
                d >>>= 1;
                break;
              case 4:
                d >>>= 2;
                break;
              case 8:
                d >>>= 3;
            }
            for (var g = 0; g < b.length; g++) c[d + g] = b[g];
          } };
          X.prototype = Object.create(v.prototype);
          X.prototype.constructor = X;
          X.prototype.__class__ = X;
          X.__cache__ = {};
          a.VoidPtr = X;
          X.prototype.__destroy__ = X.prototype.__destroy__ = function() {
            Xa(this.ptr);
          };
          S.prototype = Object.create(v.prototype);
          S.prototype.constructor = S;
          S.prototype.__class__ = S;
          S.__cache__ = {};
          a.DecoderBuffer = S;
          S.prototype.Init = S.prototype.Init = function(b, c) {
            var d = this.ptr;
            r.prepare();
            "object" == typeof b && (b = Z(b));
            c && "object" === typeof c && (c = c.ptr);
            Ya(d, b, c);
          };
          S.prototype.__destroy__ = S.prototype.__destroy__ = function() {
            Za(this.ptr);
          };
          Q.prototype = Object.create(v.prototype);
          Q.prototype.constructor = Q;
          Q.prototype.__class__ = Q;
          Q.__cache__ = {};
          a.AttributeTransformData = Q;
          Q.prototype.transform_type = Q.prototype.transform_type = function() {
            return $a(this.ptr);
          };
          Q.prototype.__destroy__ = Q.prototype.__destroy__ = function() {
            ab(this.ptr);
          };
          V.prototype = Object.create(v.prototype);
          V.prototype.constructor = V;
          V.prototype.__class__ = V;
          V.__cache__ = {};
          a.GeometryAttribute = V;
          V.prototype.__destroy__ = V.prototype.__destroy__ = function() {
            bb(this.ptr);
          };
          x.prototype = Object.create(v.prototype);
          x.prototype.constructor = x;
          x.prototype.__class__ = x;
          x.__cache__ = {};
          a.PointAttribute = x;
          x.prototype.size = x.prototype.size = function() {
            return cb(this.ptr);
          };
          x.prototype.GetAttributeTransformData = x.prototype.GetAttributeTransformData = function() {
            return B3(db(this.ptr), Q);
          };
          x.prototype.attribute_type = x.prototype.attribute_type = function() {
            return eb(this.ptr);
          };
          x.prototype.data_type = x.prototype.data_type = function() {
            return fb(this.ptr);
          };
          x.prototype.num_components = x.prototype.num_components = function() {
            return gb(this.ptr);
          };
          x.prototype.normalized = x.prototype.normalized = function() {
            return !!hb(this.ptr);
          };
          x.prototype.byte_stride = x.prototype.byte_stride = function() {
            return ib(this.ptr);
          };
          x.prototype.byte_offset = x.prototype.byte_offset = function() {
            return jb(this.ptr);
          };
          x.prototype.unique_id = x.prototype.unique_id = function() {
            return kb(this.ptr);
          };
          x.prototype.__destroy__ = x.prototype.__destroy__ = function() {
            lb(this.ptr);
          };
          D.prototype = Object.create(v.prototype);
          D.prototype.constructor = D;
          D.prototype.__class__ = D;
          D.__cache__ = {};
          a.AttributeQuantizationTransform = D;
          D.prototype.InitFromAttribute = D.prototype.InitFromAttribute = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return !!mb(c, b);
          };
          D.prototype.quantization_bits = D.prototype.quantization_bits = function() {
            return nb(this.ptr);
          };
          D.prototype.min_value = D.prototype.min_value = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return ob(c, b);
          };
          D.prototype.range = D.prototype.range = function() {
            return pb(this.ptr);
          };
          D.prototype.__destroy__ = D.prototype.__destroy__ = function() {
            qb(this.ptr);
          };
          G3.prototype = Object.create(v.prototype);
          G3.prototype.constructor = G3;
          G3.prototype.__class__ = G3;
          G3.__cache__ = {};
          a.AttributeOctahedronTransform = G3;
          G3.prototype.InitFromAttribute = G3.prototype.InitFromAttribute = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return !!rb(c, b);
          };
          G3.prototype.quantization_bits = G3.prototype.quantization_bits = function() {
            return sb(this.ptr);
          };
          G3.prototype.__destroy__ = G3.prototype.__destroy__ = function() {
            tb(this.ptr);
          };
          H.prototype = Object.create(v.prototype);
          H.prototype.constructor = H;
          H.prototype.__class__ = H;
          H.__cache__ = {};
          a.PointCloud = H;
          H.prototype.num_attributes = H.prototype.num_attributes = function() {
            return ub(this.ptr);
          };
          H.prototype.num_points = H.prototype.num_points = function() {
            return vb(this.ptr);
          };
          H.prototype.__destroy__ = H.prototype.__destroy__ = function() {
            wb(this.ptr);
          };
          E.prototype = Object.create(v.prototype);
          E.prototype.constructor = E;
          E.prototype.__class__ = E;
          E.__cache__ = {};
          a.Mesh = E;
          E.prototype.num_faces = E.prototype.num_faces = function() {
            return xb(this.ptr);
          };
          E.prototype.num_attributes = E.prototype.num_attributes = function() {
            return yb(this.ptr);
          };
          E.prototype.num_points = E.prototype.num_points = function() {
            return zb(this.ptr);
          };
          E.prototype.__destroy__ = E.prototype.__destroy__ = function() {
            Ab(this.ptr);
          };
          T.prototype = Object.create(v.prototype);
          T.prototype.constructor = T;
          T.prototype.__class__ = T;
          T.__cache__ = {};
          a.Metadata = T;
          T.prototype.__destroy__ = T.prototype.__destroy__ = function() {
            Bb(this.ptr);
          };
          C.prototype = Object.create(v.prototype);
          C.prototype.constructor = C;
          C.prototype.__class__ = C;
          C.__cache__ = {};
          a.Status = C;
          C.prototype.code = C.prototype.code = function() {
            return Cb(this.ptr);
          };
          C.prototype.ok = C.prototype.ok = function() {
            return !!Db(this.ptr);
          };
          C.prototype.error_msg = C.prototype.error_msg = function() {
            return p(Eb(this.ptr));
          };
          C.prototype.__destroy__ = C.prototype.__destroy__ = function() {
            Fb(this.ptr);
          };
          I.prototype = Object.create(v.prototype);
          I.prototype.constructor = I;
          I.prototype.__class__ = I;
          I.__cache__ = {};
          a.DracoFloat32Array = I;
          I.prototype.GetValue = I.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Gb(
              c,
              b
            );
          };
          I.prototype.size = I.prototype.size = function() {
            return Hb(this.ptr);
          };
          I.prototype.__destroy__ = I.prototype.__destroy__ = function() {
            Ib(this.ptr);
          };
          J.prototype = Object.create(v.prototype);
          J.prototype.constructor = J;
          J.prototype.__class__ = J;
          J.__cache__ = {};
          a.DracoInt8Array = J;
          J.prototype.GetValue = J.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Jb(c, b);
          };
          J.prototype.size = J.prototype.size = function() {
            return Kb(this.ptr);
          };
          J.prototype.__destroy__ = J.prototype.__destroy__ = function() {
            Lb(this.ptr);
          };
          K.prototype = Object.create(v.prototype);
          K.prototype.constructor = K;
          K.prototype.__class__ = K;
          K.__cache__ = {};
          a.DracoUInt8Array = K;
          K.prototype.GetValue = K.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Mb(c, b);
          };
          K.prototype.size = K.prototype.size = function() {
            return Nb(this.ptr);
          };
          K.prototype.__destroy__ = K.prototype.__destroy__ = function() {
            Ob(this.ptr);
          };
          L.prototype = Object.create(v.prototype);
          L.prototype.constructor = L;
          L.prototype.__class__ = L;
          L.__cache__ = {};
          a.DracoInt16Array = L;
          L.prototype.GetValue = L.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Pb(c, b);
          };
          L.prototype.size = L.prototype.size = function() {
            return Qb(this.ptr);
          };
          L.prototype.__destroy__ = L.prototype.__destroy__ = function() {
            Rb(this.ptr);
          };
          M.prototype = Object.create(v.prototype);
          M.prototype.constructor = M;
          M.prototype.__class__ = M;
          M.__cache__ = {};
          a.DracoUInt16Array = M;
          M.prototype.GetValue = M.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Sb(c, b);
          };
          M.prototype.size = M.prototype.size = function() {
            return Tb(this.ptr);
          };
          M.prototype.__destroy__ = M.prototype.__destroy__ = function() {
            Ub(this.ptr);
          };
          N.prototype = Object.create(v.prototype);
          N.prototype.constructor = N;
          N.prototype.__class__ = N;
          N.__cache__ = {};
          a.DracoInt32Array = N;
          N.prototype.GetValue = N.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Vb(c, b);
          };
          N.prototype.size = N.prototype.size = function() {
            return Wb(this.ptr);
          };
          N.prototype.__destroy__ = N.prototype.__destroy__ = function() {
            Xb(this.ptr);
          };
          O.prototype = Object.create(v.prototype);
          O.prototype.constructor = O;
          O.prototype.__class__ = O;
          O.__cache__ = {};
          a.DracoUInt32Array = O;
          O.prototype.GetValue = O.prototype.GetValue = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Yb(c, b);
          };
          O.prototype.size = O.prototype.size = function() {
            return Zb(this.ptr);
          };
          O.prototype.__destroy__ = O.prototype.__destroy__ = function() {
            $b(this.ptr);
          };
          z.prototype = Object.create(v.prototype);
          z.prototype.constructor = z;
          z.prototype.__class__ = z;
          z.__cache__ = {};
          a.MetadataQuerier = z;
          z.prototype.HasEntry = z.prototype.HasEntry = function(b, c) {
            var d = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            return !!ac(d, b, c);
          };
          z.prototype.GetIntEntry = z.prototype.GetIntEntry = function(b, c) {
            var d = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            return bc(d, b, c);
          };
          z.prototype.GetIntEntryArray = z.prototype.GetIntEntryArray = function(b, c, d) {
            var g = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            d && "object" === typeof d && (d = d.ptr);
            cc(g, b, c, d);
          };
          z.prototype.GetDoubleEntry = z.prototype.GetDoubleEntry = function(b, c) {
            var d = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            return dc(d, b, c);
          };
          z.prototype.GetStringEntry = z.prototype.GetStringEntry = function(b, c) {
            var d = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            return p(ec(d, b, c));
          };
          z.prototype.NumEntries = z.prototype.NumEntries = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return fc(c, b);
          };
          z.prototype.GetEntryName = z.prototype.GetEntryName = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return p(gc(d, b, c));
          };
          z.prototype.__destroy__ = z.prototype.__destroy__ = function() {
            hc(this.ptr);
          };
          m.prototype = Object.create(v.prototype);
          m.prototype.constructor = m;
          m.prototype.__class__ = m;
          m.__cache__ = {};
          a.Decoder = m;
          m.prototype.DecodeArrayToPointCloud = m.prototype.DecodeArrayToPointCloud = function(b, c, d) {
            var g = this.ptr;
            r.prepare();
            "object" == typeof b && (b = Z(b));
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return B3(ic(g, b, c, d), C);
          };
          m.prototype.DecodeArrayToMesh = m.prototype.DecodeArrayToMesh = function(b, c, d) {
            var g = this.ptr;
            r.prepare();
            "object" == typeof b && (b = Z(b));
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return B3(jc(g, b, c, d), C);
          };
          m.prototype.GetAttributeId = m.prototype.GetAttributeId = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return kc(d, b, c);
          };
          m.prototype.GetAttributeIdByName = m.prototype.GetAttributeIdByName = function(b, c) {
            var d = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            return lc(d, b, c);
          };
          m.prototype.GetAttributeIdByMetadataEntry = m.prototype.GetAttributeIdByMetadataEntry = function(b, c, d) {
            var g = this.ptr;
            r.prepare();
            b && "object" === typeof b && (b = b.ptr);
            c = c && "object" === typeof c ? c.ptr : R3(c);
            d = d && "object" === typeof d ? d.ptr : R3(d);
            return mc(g, b, c, d);
          };
          m.prototype.GetAttribute = m.prototype.GetAttribute = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return B3(nc(d, b, c), x);
          };
          m.prototype.GetAttributeByUniqueId = m.prototype.GetAttributeByUniqueId = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return B3(oc(d, b, c), x);
          };
          m.prototype.GetMetadata = m.prototype.GetMetadata = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return B3(pc(c, b), T);
          };
          m.prototype.GetAttributeMetadata = m.prototype.GetAttributeMetadata = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return B3(qc(d, b, c), T);
          };
          m.prototype.GetFaceFromMesh = m.prototype.GetFaceFromMesh = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!rc(g, b, c, d);
          };
          m.prototype.GetTriangleStripsFromMesh = m.prototype.GetTriangleStripsFromMesh = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return sc(d, b, c);
          };
          m.prototype.GetTrianglesUInt16Array = m.prototype.GetTrianglesUInt16Array = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!tc(g, b, c, d);
          };
          m.prototype.GetTrianglesUInt32Array = m.prototype.GetTrianglesUInt32Array = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!uc(g, b, c, d);
          };
          m.prototype.GetAttributeFloat = m.prototype.GetAttributeFloat = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!vc(g, b, c, d);
          };
          m.prototype.GetAttributeFloatForAllPoints = m.prototype.GetAttributeFloatForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!wc(g, b, c, d);
          };
          m.prototype.GetAttributeIntForAllPoints = m.prototype.GetAttributeIntForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!xc(g, b, c, d);
          };
          m.prototype.GetAttributeInt8ForAllPoints = m.prototype.GetAttributeInt8ForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!yc(g, b, c, d);
          };
          m.prototype.GetAttributeUInt8ForAllPoints = m.prototype.GetAttributeUInt8ForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!zc(g, b, c, d);
          };
          m.prototype.GetAttributeInt16ForAllPoints = m.prototype.GetAttributeInt16ForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!Ac(g, b, c, d);
          };
          m.prototype.GetAttributeUInt16ForAllPoints = m.prototype.GetAttributeUInt16ForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!Bc(g, b, c, d);
          };
          m.prototype.GetAttributeInt32ForAllPoints = m.prototype.GetAttributeInt32ForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!Cc(g, b, c, d);
          };
          m.prototype.GetAttributeUInt32ForAllPoints = m.prototype.GetAttributeUInt32ForAllPoints = function(b, c, d) {
            var g = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            return !!Dc(g, b, c, d);
          };
          m.prototype.GetAttributeDataArrayForAllPoints = m.prototype.GetAttributeDataArrayForAllPoints = function(b, c, d, g, t) {
            var aa = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            d && "object" === typeof d && (d = d.ptr);
            g && "object" === typeof g && (g = g.ptr);
            t && "object" === typeof t && (t = t.ptr);
            return !!Ec(aa, b, c, d, g, t);
          };
          m.prototype.SkipAttributeTransform = m.prototype.SkipAttributeTransform = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            Fc(
              c,
              b
            );
          };
          m.prototype.GetEncodedGeometryType_Deprecated = m.prototype.GetEncodedGeometryType_Deprecated = function(b) {
            var c = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            return Gc(c, b);
          };
          m.prototype.DecodeBufferToPointCloud = m.prototype.DecodeBufferToPointCloud = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return B3(Hc(d, b, c), C);
          };
          m.prototype.DecodeBufferToMesh = m.prototype.DecodeBufferToMesh = function(b, c) {
            var d = this.ptr;
            b && "object" === typeof b && (b = b.ptr);
            c && "object" === typeof c && (c = c.ptr);
            return B3(Ic(d, b, c), C);
          };
          m.prototype.__destroy__ = m.prototype.__destroy__ = function() {
            Jc(this.ptr);
          };
          (function() {
            function b() {
              a.ATTRIBUTE_INVALID_TRANSFORM = Kc();
              a.ATTRIBUTE_NO_TRANSFORM = Lc();
              a.ATTRIBUTE_QUANTIZATION_TRANSFORM = Mc();
              a.ATTRIBUTE_OCTAHEDRON_TRANSFORM = Nc();
              a.INVALID = Oc();
              a.POSITION = Pc();
              a.NORMAL = Qc();
              a.COLOR = Rc();
              a.TEX_COORD = Sc();
              a.GENERIC = Tc();
              a.INVALID_GEOMETRY_TYPE = Uc();
              a.POINT_CLOUD = Vc();
              a.TRIANGULAR_MESH = Wc();
              a.DT_INVALID = Xc();
              a.DT_INT8 = Yc();
              a.DT_UINT8 = Zc();
              a.DT_INT16 = $c();
              a.DT_UINT16 = ad();
              a.DT_INT32 = bd();
              a.DT_UINT32 = cd();
              a.DT_INT64 = dd();
              a.DT_UINT64 = ed();
              a.DT_FLOAT32 = fd();
              a.DT_FLOAT64 = gd();
              a.DT_BOOL = hd();
              a.DT_TYPES_COUNT = id();
              a.OK = jd();
              a.DRACO_ERROR = kd();
              a.IO_ERROR = ld();
              a.INVALID_PARAMETER = md();
              a.UNSUPPORTED_VERSION = nd();
              a.UNKNOWN_VERSION = od();
            }
            va ? b() : oa.unshift(b);
          })();
          if ("function" === typeof a.onModuleParsed) a.onModuleParsed();
          a.Decoder.prototype.GetEncodedGeometryType = function(b) {
            if (b.__class__ && b.__class__ === a.DecoderBuffer) return a.Decoder.prototype.GetEncodedGeometryType_Deprecated(b);
            if (8 > b.byteLength) return a.INVALID_GEOMETRY_TYPE;
            switch (b[7]) {
              case 0:
                return a.POINT_CLOUD;
              case 1:
                return a.TRIANGULAR_MESH;
              default:
                return a.INVALID_GEOMETRY_TYPE;
            }
          };
          return n.ready;
        };
      }();
      "object" === typeof exports && "object" === typeof module ? module.exports = DracoDecoderModule : "function" === typeof define && define.amd ? define([], function() {
        return DracoDecoderModule;
      }) : "object" === typeof exports && (exports.DracoDecoderModule = DracoDecoderModule);
    }
  });

  // node_modules/draco3dgltf/draco3dgltf.js
  var require_draco3dgltf = __commonJS({
    "node_modules/draco3dgltf/draco3dgltf.js"(exports, module) {
      init_define_process_versions();
      var createEncoderModule = require_draco_encoder_gltf_nodejs();
      var createDecoderModule = require_draco_decoder_gltf_nodejs();
      module.exports = {
        createEncoderModule,
        createDecoderModule
      };
    }
  });

  // draco-worker-src.js
  init_define_process_versions();

  // node_modules/@gltf-transform/core/dist/index.modern.js
  init_define_process_versions();

  // node_modules/property-graph/dist/index.mjs
  init_define_process_versions();
  var EventDispatcher = class {
    _listeners = {};
    addEventListener(type, listener) {
      const listeners = this._listeners;
      if (listeners[type] === void 0) listeners[type] = [];
      if (listeners[type].indexOf(listener) === -1) listeners[type].push(listener);
      return this;
    }
    removeEventListener(type, listener) {
      const listenerArray = this._listeners[type];
      if (listenerArray !== void 0) {
        const index = listenerArray.indexOf(listener);
        if (index !== -1) listenerArray.splice(index, 1);
      }
      return this;
    }
    dispatchEvent(event) {
      const listenerArray = this._listeners[event.type];
      if (listenerArray !== void 0) {
        const array = listenerArray.slice(0);
        for (let i = 0, l = array.length; i < l; i++) array[i].call(this, event);
      }
      return this;
    }
    dispose() {
      for (const key in this._listeners) delete this._listeners[key];
    }
  };
  var GraphEdge = class {
    _disposed = false;
    _name;
    _parent;
    _child;
    _attributes;
    constructor(_name, _parent, _child, _attributes = {}) {
      this._name = _name;
      this._parent = _parent;
      this._child = _child;
      this._attributes = _attributes;
      if (!_parent.isOnGraph(_child)) throw new Error("Cannot connect disconnected graphs.");
    }
    /** Name (attribute name from parent {@link GraphNode}). */
    getName() {
      return this._name;
    }
    /** Owner node. */
    getParent() {
      return this._parent;
    }
    /** Resource node. */
    getChild() {
      return this._child;
    }
    /**
    * Sets the child node.
    *
    * @internal Only {@link Graph} implementations may safely call this method directly. Use
    * 	{@link Property.swap} or {@link Graph.swapChild} instead.
    */
    setChild(child) {
      this._child = child;
      return this;
    }
    /** Attributes of the graph node relationship. */
    getAttributes() {
      return this._attributes;
    }
    /** Destroys a (currently intact) edge, updating both the graph and the owner. */
    dispose() {
      if (this._disposed) return;
      this._parent._destroyRef(this);
      this._disposed = true;
    }
    /** Whether this link has been destroyed. */
    isDisposed() {
      return this._disposed;
    }
  };
  var Graph = class extends EventDispatcher {
    _emptySet = /* @__PURE__ */ new Set();
    _edges = /* @__PURE__ */ new Set();
    _parentEdges = /* @__PURE__ */ new Map();
    _childEdges = /* @__PURE__ */ new Map();
    /** Returns a list of all parent->child edges on this graph. */
    listEdges() {
      return Array.from(this._edges);
    }
    /** Returns a list of all edges on the graph having the given node as their child. */
    listParentEdges(node) {
      return Array.from(this._childEdges.get(node) || this._emptySet);
    }
    /** Returns a list of parent nodes for the given child node. */
    listParents(node) {
      const parentSet = /* @__PURE__ */ new Set();
      for (const edge of this.listParentEdges(node)) parentSet.add(edge.getParent());
      return Array.from(parentSet);
    }
    /** Returns a list of all edges on the graph having the given node as their parent. */
    listChildEdges(node) {
      return Array.from(this._parentEdges.get(node) || this._emptySet);
    }
    /** Returns a list of child nodes for the given parent node. */
    listChildren(node) {
      const childSet = /* @__PURE__ */ new Set();
      for (const edge of this.listChildEdges(node)) childSet.add(edge.getChild());
      return Array.from(childSet);
    }
    disconnectParents(node, filter) {
      for (const edge of this.listParentEdges(node)) if (!filter || filter(edge.getParent())) edge.dispose();
      return this;
    }
    /**********************************************************************************************
    * Internal.
    */
    /**
    * Creates a {@link GraphEdge} connecting two {@link GraphNode} instances. Edge is returned
    * for the caller to store.
    * @param a Owner
    * @param b Resource
    * @hidden
    * @internal
    */
    _createEdge(name, a, b, attributes) {
      const edge = new GraphEdge(name, a, b, attributes);
      this._edges.add(edge);
      const parent = edge.getParent();
      if (!this._parentEdges.has(parent)) this._parentEdges.set(parent, /* @__PURE__ */ new Set());
      this._parentEdges.get(parent).add(edge);
      const child = edge.getChild();
      if (!this._childEdges.has(child)) this._childEdges.set(child, /* @__PURE__ */ new Set());
      this._childEdges.get(child).add(edge);
      return edge;
    }
    /**
    * Detaches a {@link GraphEdge} from the {@link Graph}. Before calling this
    * method, ensure that the GraphEdge has first been detached from any
    * associated {@link GraphNode} attributes.
    * @hidden
    * @internal
    */
    _destroyEdge(edge) {
      this._edges.delete(edge);
      this._parentEdges.get(edge.getParent()).delete(edge);
      this._childEdges.get(edge.getChild()).delete(edge);
      return this;
    }
  };
  var RefList = class {
    list = [];
    constructor(refs) {
      if (refs) for (const ref of refs) this.list.push(ref);
    }
    add(ref) {
      this.list.push(ref);
    }
    remove(ref) {
      const index = this.list.indexOf(ref);
      if (index >= 0) this.list.splice(index, 1);
    }
    removeChild(child) {
      const refs = [];
      for (const ref of this.list) if (ref.getChild() === child) refs.push(ref);
      for (const ref of refs) this.remove(ref);
      return refs;
    }
    listRefsByChild(child) {
      const refs = [];
      for (const ref of this.list) if (ref.getChild() === child) refs.push(ref);
      return refs;
    }
    values() {
      return this.list;
    }
  };
  var RefSet = class {
    set = /* @__PURE__ */ new Set();
    map = /* @__PURE__ */ new Map();
    constructor(refs) {
      if (refs) for (const ref of refs) this.add(ref);
    }
    add(ref) {
      const child = ref.getChild();
      this.removeChild(child);
      this.set.add(ref);
      this.map.set(child, ref);
    }
    remove(ref) {
      this.set.delete(ref);
      this.map.delete(ref.getChild());
    }
    removeChild(child) {
      const ref = this.map.get(child) || null;
      if (ref) this.remove(ref);
      return ref;
    }
    getRefByChild(child) {
      return this.map.get(child) || null;
    }
    values() {
      return Array.from(this.set);
    }
  };
  var RefMap = class {
    map = {};
    constructor(map) {
      if (map) Object.assign(this.map, map);
    }
    set(key, child) {
      this.map[key] = child;
    }
    delete(key) {
      delete this.map[key];
    }
    get(key) {
      return this.map[key] || null;
    }
    keys() {
      return Object.keys(this.map);
    }
    values() {
      return Object.values(this.map);
    }
  };
  var $attributes = Symbol("attributes");
  var $immutableKeys = Symbol("immutableKeys");
  var GraphNode = class GraphNode2 extends EventDispatcher {
    _disposed = false;
    /**
    * Internal graph used to search and maintain references.
    * @hidden
    */
    graph;
    /**
    * Attributes (literal values and GraphNode references) associated with this instance. For each
    * GraphNode reference, the attributes stores a {@link GraphEdge}. List and Map references are
    * stored as arrays and dictionaries of edges.
    * @internal
    */
    [$attributes];
    /**
    * Attributes included with `getDefaultAttributes` are considered immutable, and cannot be
    * modifed by `.setRef()`, `.copy()`, or other GraphNode methods. Both the edges and the
    * properties will be disposed with the parent GraphNode.
    *
    * Currently, only single-edge references (getRef/setRef) are supported as immutables.
    *
    * @internal
    */
    [$immutableKeys];
    constructor(graph) {
      super();
      this.graph = graph;
      this[$immutableKeys] = /* @__PURE__ */ new Set();
      this[$attributes] = this._createAttributes();
    }
    /**
    * Returns default attributes for the graph node. Subclasses having any attributes (either
    * literal values or references to other graph nodes) must override this method. Literal
    * attributes should be given their default values, if any. References should generally be
    * initialized as empty (Ref → null, RefList → [], RefMap → {}) and then modified by setters.
    *
    * Any single-edge references (setRef) returned by this method will be considered immutable,
    * to be owned by and disposed with the parent node. Multi-edge references (addRef, removeRef,
    * setRefMap) cannot be returned as default attributes.
    */
    getDefaults() {
      return {};
    }
    /**
    * Constructs and returns an object used to store a graph nodes attributes. Compared to the
    * default Attributes interface, this has two distinctions:
    *
    * 1. Slots for GraphNode<T> objects are replaced with slots for GraphEdge<this, GraphNode<T>>
    * 2. GraphNode<T> objects provided as defaults are considered immutable
    *
    * @internal
    */
    _createAttributes() {
      const defaultAttributes = this.getDefaults();
      const attributes = {};
      for (const key in defaultAttributes) {
        const value = defaultAttributes[key];
        if (value instanceof GraphNode2) {
          const ref = this.graph._createEdge(key, this, value);
          this[$immutableKeys].add(key);
          attributes[key] = ref;
        } else attributes[key] = value;
      }
      return attributes;
    }
    /** @internal Returns true if two nodes are on the same {@link Graph}. */
    isOnGraph(other) {
      return this.graph === other.graph;
    }
    /** Returns true if the node has been permanently removed from the graph. */
    isDisposed() {
      return this._disposed;
    }
    /**
    * Removes both inbound references to and outbound references from this object. At the end
    * of the process the object holds no references, and nothing holds references to it. A
    * disposed object is not reusable.
    */
    dispose() {
      if (this._disposed) return;
      this.graph.listChildEdges(this).forEach((edge) => edge.dispose());
      this.graph.disconnectParents(this);
      this._disposed = true;
      this.dispatchEvent({ type: "dispose" });
    }
    /**
    * Removes all inbound references to this object. At the end of the process the object is
    * considered 'detached': it may hold references to child resources, but nothing holds
    * references to it. A detached object may be re-attached.
    */
    detach() {
      this.graph.disconnectParents(this);
      return this;
    }
    /**
    * Transfers this object's references from the old node to the new one. The old node is fully
    * detached from this parent at the end of the process.
    *
    * @hidden
    */
    swap(prevValue, nextValue) {
      for (const attribute in this[$attributes]) {
        const value = this[$attributes][attribute];
        if (value instanceof GraphEdge) {
          const ref = value;
          if (ref.getChild() === prevValue) this.setRef(attribute, nextValue, ref.getAttributes());
        } else if (value instanceof RefList) for (const ref of value.listRefsByChild(prevValue)) {
          const refAttributes = ref.getAttributes();
          this.removeRef(attribute, prevValue);
          this.addRef(attribute, nextValue, refAttributes);
        }
        else if (value instanceof RefSet) {
          const ref = value.getRefByChild(prevValue);
          if (ref) {
            const refAttributes = ref.getAttributes();
            this.removeRef(attribute, prevValue);
            this.addRef(attribute, nextValue, refAttributes);
          }
        } else if (value instanceof RefMap) for (const key of value.keys()) {
          const ref = value.get(key);
          if (ref.getChild() === prevValue) this.setRefMap(attribute, key, nextValue, ref.getAttributes());
        }
      }
      return this;
    }
    /**********************************************************************************************
    * Literal attributes.
    */
    /** @hidden */
    get(attribute) {
      return this[$attributes][attribute];
    }
    /** @hidden */
    set(attribute, value) {
      this[$attributes][attribute] = value;
      return this.dispatchEvent({
        type: "change",
        attribute
      });
    }
    /**********************************************************************************************
    * Ref: 1:1 graph node references.
    */
    /** @hidden */
    getRef(attribute) {
      const ref = this[$attributes][attribute];
      return ref ? ref.getChild() : null;
    }
    /** @hidden */
    setRef(attribute, value, attributes) {
      if (this[$immutableKeys].has(attribute)) throw new Error(`Cannot overwrite immutable attribute, "${attribute}".`);
      const prevRef = this[$attributes][attribute];
      if (prevRef) prevRef.dispose();
      if (!value) return this;
      const ref = this.graph._createEdge(attribute, this, value, attributes);
      this[$attributes][attribute] = ref;
      return this.dispatchEvent({
        type: "change",
        attribute
      });
    }
    /**********************************************************************************************
    * RefList: 1:many graph node references.
    */
    /** @hidden */
    listRefs(attribute) {
      return this.assertRefList(attribute).values().map((ref) => ref.getChild());
    }
    /** @hidden */
    addRef(attribute, value, attributes) {
      const ref = this.graph._createEdge(attribute, this, value, attributes);
      this.assertRefList(attribute).add(ref);
      return this.dispatchEvent({
        type: "change",
        attribute
      });
    }
    /** @hidden */
    removeRef(attribute, value) {
      const refs = this.assertRefList(attribute);
      if (refs instanceof RefList) for (const ref of refs.listRefsByChild(value)) ref.dispose();
      else {
        const ref = refs.getRefByChild(value);
        if (ref) ref.dispose();
      }
      return this;
    }
    /** @hidden */
    assertRefList(attribute) {
      const refs = this[$attributes][attribute];
      if (refs instanceof RefList || refs instanceof RefSet) return refs;
      throw new Error(`Expected RefList or RefSet for attribute "${attribute}"`);
    }
    /**********************************************************************************************
    * RefMap: Named 1:many (map) graph node references.
    */
    /** @hidden */
    listRefMapKeys(attribute) {
      return this.assertRefMap(attribute).keys();
    }
    /** @hidden */
    listRefMapValues(attribute) {
      return this.assertRefMap(attribute).values().map((ref) => ref.getChild());
    }
    /** @hidden */
    getRefMap(attribute, key) {
      const ref = this.assertRefMap(attribute).get(key);
      return ref ? ref.getChild() : null;
    }
    /** @hidden */
    setRefMap(attribute, key, value, metadata) {
      const refMap = this.assertRefMap(attribute);
      const prevRef = refMap.get(key);
      if (prevRef) prevRef.dispose();
      if (!value) return this;
      metadata = Object.assign(metadata || {}, { key });
      const ref = this.graph._createEdge(attribute, this, value, {
        ...metadata,
        key
      });
      refMap.set(key, ref);
      return this.dispatchEvent({
        type: "change",
        attribute,
        key
      });
    }
    /** @hidden */
    assertRefMap(attribute) {
      const map = this[$attributes][attribute];
      if (map instanceof RefMap) return map;
      throw new Error(`Expected RefMap for attribute "${attribute}"`);
    }
    /**********************************************************************************************
    * Events.
    */
    /**
    * Dispatches an event on the GraphNode, and on the associated
    * Graph. Event types on the graph are prefixed, `"node:[type]"`.
    */
    dispatchEvent(event) {
      super.dispatchEvent({
        ...event,
        target: this
      });
      this.graph.dispatchEvent({
        ...event,
        target: this,
        type: `node:${event.type}`
      });
      return this;
    }
    /**********************************************************************************************
    * Internal.
    */
    /** @hidden */
    _destroyRef(ref) {
      const attribute = ref.getName();
      if (this[$attributes][attribute] === ref) {
        this[$attributes][attribute] = null;
        if (this[$immutableKeys].has(attribute)) ref.getChild().dispose();
      } else if (this[$attributes][attribute] instanceof RefList) this[$attributes][attribute].remove(ref);
      else if (this[$attributes][attribute] instanceof RefSet) this[$attributes][attribute].remove(ref);
      else if (this[$attributes][attribute] instanceof RefMap) {
        const refMap = this[$attributes][attribute];
        for (const key of refMap.keys()) if (refMap.get(key) === ref) refMap.delete(key);
      } else return;
      this.graph._destroyEdge(ref);
      this.dispatchEvent({
        type: "change",
        attribute
      });
    }
  };

  // node_modules/@gltf-transform/core/dist/index.modern.js
  var VERSION = `v${"4.3.0"}`;
  var GLB_BUFFER = "@glb.bin";
  var PropertyType;
  (function(PropertyType2) {
    PropertyType2["ACCESSOR"] = "Accessor";
    PropertyType2["ANIMATION"] = "Animation";
    PropertyType2["ANIMATION_CHANNEL"] = "AnimationChannel";
    PropertyType2["ANIMATION_SAMPLER"] = "AnimationSampler";
    PropertyType2["BUFFER"] = "Buffer";
    PropertyType2["CAMERA"] = "Camera";
    PropertyType2["MATERIAL"] = "Material";
    PropertyType2["MESH"] = "Mesh";
    PropertyType2["PRIMITIVE"] = "Primitive";
    PropertyType2["PRIMITIVE_TARGET"] = "PrimitiveTarget";
    PropertyType2["NODE"] = "Node";
    PropertyType2["ROOT"] = "Root";
    PropertyType2["SCENE"] = "Scene";
    PropertyType2["SKIN"] = "Skin";
    PropertyType2["TEXTURE"] = "Texture";
    PropertyType2["TEXTURE_INFO"] = "TextureInfo";
  })(PropertyType || (PropertyType = {}));
  var VertexLayout;
  (function(VertexLayout2) {
    VertexLayout2["INTERLEAVED"] = "interleaved";
    VertexLayout2["SEPARATE"] = "separate";
  })(VertexLayout || (VertexLayout = {}));
  var BufferViewUsage$1;
  (function(BufferViewUsage2) {
    BufferViewUsage2["ARRAY_BUFFER"] = "ARRAY_BUFFER";
    BufferViewUsage2["ELEMENT_ARRAY_BUFFER"] = "ELEMENT_ARRAY_BUFFER";
    BufferViewUsage2["INVERSE_BIND_MATRICES"] = "INVERSE_BIND_MATRICES";
    BufferViewUsage2["OTHER"] = "OTHER";
    BufferViewUsage2["SPARSE"] = "SPARSE";
  })(BufferViewUsage$1 || (BufferViewUsage$1 = {}));
  var TextureChannel;
  (function(TextureChannel2) {
    TextureChannel2[TextureChannel2["R"] = 4096] = "R";
    TextureChannel2[TextureChannel2["G"] = 256] = "G";
    TextureChannel2[TextureChannel2["B"] = 16] = "B";
    TextureChannel2[TextureChannel2["A"] = 1] = "A";
  })(TextureChannel || (TextureChannel = {}));
  var Format;
  (function(Format2) {
    Format2["GLTF"] = "GLTF";
    Format2["GLB"] = "GLB";
  })(Format || (Format = {}));
  var ComponentTypeToTypedArray = {
    "5120": Int8Array,
    "5121": Uint8Array,
    "5122": Int16Array,
    "5123": Uint16Array,
    "5125": Uint32Array,
    "5126": Float32Array
  };
  var BufferUtils = class {
    /** Creates a byte array from a Data URI. */
    static createBufferFromDataURI(dataURI) {
      if (typeof Buffer === "undefined") {
        const byteString = atob(dataURI.split(",")[1]);
        const ia = new Uint8Array(byteString.length);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        return ia;
      } else {
        const data = dataURI.split(",")[1];
        const isBase64 = dataURI.indexOf("base64") >= 0;
        return Buffer.from(data, isBase64 ? "base64" : "utf8");
      }
    }
    /** Encodes text to a byte array. */
    static encodeText(text) {
      return new TextEncoder().encode(text);
    }
    /** Decodes a byte array to text. */
    static decodeText(array) {
      return new TextDecoder().decode(array);
    }
    /**
     * Concatenates N byte arrays.
     */
    static concat(arrays) {
      let totalByteLength = 0;
      for (const array of arrays) {
        totalByteLength += array.byteLength;
      }
      const result = new Uint8Array(totalByteLength);
      let byteOffset = 0;
      for (const array of arrays) {
        result.set(array, byteOffset);
        byteOffset += array.byteLength;
      }
      return result;
    }
    /**
     * Pads a Uint8Array to the next 4-byte boundary.
     *
     * Reference: [glTF → Data Alignment](https://github.com/KhronosGroup/glTF/tree/master/specification/2.0#data-alignment)
     */
    static pad(srcArray, paddingByte = 0) {
      const paddedLength = this.padNumber(srcArray.byteLength);
      if (paddedLength === srcArray.byteLength) return srcArray;
      const dstArray = new Uint8Array(paddedLength);
      dstArray.set(srcArray);
      if (paddingByte !== 0) {
        for (let i = srcArray.byteLength; i < paddedLength; i++) {
          dstArray[i] = paddingByte;
        }
      }
      return dstArray;
    }
    /** Pads a number to 4-byte boundaries. */
    static padNumber(v) {
      return Math.ceil(v / 4) * 4;
    }
    /** Returns true if given byte array instances are equal. */
    static equals(a, b) {
      if (a === b) return true;
      if (a.byteLength !== b.byteLength) return false;
      let i = a.byteLength;
      while (i--) {
        if (a[i] !== b[i]) return false;
      }
      return true;
    }
    /**
     * Returns a Uint8Array view of a typed array, with the same underlying ArrayBuffer.
     *
     * A shorthand for:
     *
     * ```js
     * const buffer = new Uint8Array(
     * 	array.buffer,
     * 	array.byteOffset + byteOffset,
     * 	Math.min(array.byteLength, byteLength)
     * );
     * ```
     *
     */
    static toView(a, byteOffset = 0, byteLength = Infinity) {
      return new Uint8Array(a.buffer, a.byteOffset + byteOffset, Math.min(a.byteLength, byteLength));
    }
    static assertView(view) {
      if (view && !ArrayBuffer.isView(view)) {
        throw new Error(`Method requires Uint8Array parameter; received "${typeof view}".`);
      }
      return view;
    }
  };
  var JPEGImageUtils = class {
    match(array) {
      return array.length >= 3 && array[0] === 255 && array[1] === 216 && array[2] === 255;
    }
    getSize(array) {
      let view = new DataView(array.buffer, array.byteOffset + 4);
      let i, next;
      while (view.byteLength) {
        i = view.getUint16(0, false);
        validateJPEGBuffer(view, i);
        next = view.getUint8(i + 1);
        if (next === 192 || next === 193 || next === 194) {
          return [view.getUint16(i + 7, false), view.getUint16(i + 5, false)];
        }
        view = new DataView(array.buffer, view.byteOffset + i + 2);
      }
      throw new TypeError("Invalid JPG, no size found");
    }
    getChannels(_buffer) {
      return 3;
    }
  };
  var PNGImageUtils = class _PNGImageUtils {
    match(array) {
      return array.length >= 8 && array[0] === 137 && array[1] === 80 && array[2] === 78 && array[3] === 71 && array[4] === 13 && array[5] === 10 && array[6] === 26 && array[7] === 10;
    }
    getSize(array) {
      const view = new DataView(array.buffer, array.byteOffset);
      const magic = BufferUtils.decodeText(array.slice(12, 16));
      if (magic === _PNGImageUtils.PNG_FRIED_CHUNK_NAME) {
        return [view.getUint32(32, false), view.getUint32(36, false)];
      }
      return [view.getUint32(16, false), view.getUint32(20, false)];
    }
    getChannels(_buffer) {
      return 4;
    }
  };
  PNGImageUtils.PNG_FRIED_CHUNK_NAME = "CgBI";
  var ImageUtils = class {
    /** Registers support for a new image format; useful for certain extensions. */
    static registerFormat(mimeType, impl) {
      this.impls[mimeType] = impl;
    }
    /**
     * Returns detected MIME type of the given image buffer. Note that for image
     * formats with support provided by extensions, the extension must be
     * registered with an I/O class before it can be detected by ImageUtils.
     */
    static getMimeType(buffer) {
      for (const mimeType in this.impls) {
        if (this.impls[mimeType].match(buffer)) {
          return mimeType;
        }
      }
      return null;
    }
    /** Returns the dimensions of the image. */
    static getSize(buffer, mimeType) {
      if (!this.impls[mimeType]) return null;
      return this.impls[mimeType].getSize(buffer);
    }
    /**
     * Returns a conservative estimate of the number of channels in the image. For some image
     * formats, the method may return 4 indicating the possibility of an alpha channel, without
     * the ability to guarantee that an alpha channel is present.
     */
    static getChannels(buffer, mimeType) {
      if (!this.impls[mimeType]) return null;
      return this.impls[mimeType].getChannels(buffer);
    }
    /** Returns a conservative estimate of the GPU memory required by this image. */
    static getVRAMByteLength(buffer, mimeType) {
      if (!this.impls[mimeType]) return null;
      if (this.impls[mimeType].getVRAMByteLength) {
        return this.impls[mimeType].getVRAMByteLength(buffer);
      }
      let uncompressedBytes = 0;
      const channels = 4;
      const resolution = this.getSize(buffer, mimeType);
      if (!resolution) return null;
      while (resolution[0] > 1 || resolution[1] > 1) {
        uncompressedBytes += resolution[0] * resolution[1] * channels;
        resolution[0] = Math.max(Math.floor(resolution[0] / 2), 1);
        resolution[1] = Math.max(Math.floor(resolution[1] / 2), 1);
      }
      uncompressedBytes += 1 * 1 * channels;
      return uncompressedBytes;
    }
    /** Returns the preferred file extension for the given MIME type. */
    static mimeTypeToExtension(mimeType) {
      if (mimeType === "image/jpeg") return "jpg";
      return mimeType.split("/").pop();
    }
    /** Returns the MIME type for the given file extension. */
    static extensionToMimeType(extension) {
      if (extension === "jpg") return "image/jpeg";
      if (!extension) return "";
      return `image/${extension}`;
    }
  };
  ImageUtils.impls = {
    "image/jpeg": new JPEGImageUtils(),
    "image/png": new PNGImageUtils()
  };
  function validateJPEGBuffer(view, i) {
    if (i > view.byteLength) {
      throw new TypeError("Corrupt JPG, exceeded buffer limits");
    }
    if (view.getUint8(i) !== 255) {
      throw new TypeError("Invalid JPG, marker table corrupted");
    }
    return view;
  }
  var FileUtils = class {
    /**
     * Extracts the basename from a file path, e.g. "folder/model.glb" -> "model".
     * See: {@link HTTPUtils.basename}
     */
    static basename(uri) {
      const fileName = uri.split(/[\\/]/).pop();
      return fileName.substring(0, fileName.lastIndexOf("."));
    }
    /**
     * Extracts the extension from a file path, e.g. "folder/model.glb" -> "glb".
     * See: {@link HTTPUtils.extension}
     */
    static extension(uri) {
      if (uri.startsWith("data:image/")) {
        const mimeType = uri.match(/data:(image\/\w+)/)[1];
        return ImageUtils.mimeTypeToExtension(mimeType);
      } else if (uri.startsWith("data:model/gltf+json")) {
        return "gltf";
      } else if (uri.startsWith("data:model/gltf-binary")) {
        return "glb";
      } else if (uri.startsWith("data:application/")) {
        return "bin";
      }
      return uri.split(/[\\/]/).pop().split(/[.]/).pop();
    }
  };
  var ARRAY_TYPE = typeof Float32Array !== "undefined" ? Float32Array : Array;
  function create() {
    var out = new ARRAY_TYPE(3);
    if (ARRAY_TYPE != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  function length(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    return Math.sqrt(x * x + y * y + z * z);
  }
  function transformMat4(out, a, m) {
    var x = a[0], y = a[1], z = a[2];
    var w = m[3] * x + m[7] * y + m[11] * z + m[15];
    w = w || 1;
    out[0] = (m[0] * x + m[4] * y + m[8] * z + m[12]) / w;
    out[1] = (m[1] * x + m[5] * y + m[9] * z + m[13]) / w;
    out[2] = (m[2] * x + m[6] * y + m[10] * z + m[14]) / w;
    return out;
  }
  (function() {
    var vec = create();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  })();
  function getBounds(node) {
    const resultBounds = createBounds();
    const parents = node.propertyType === PropertyType.NODE ? [node] : node.listChildren();
    for (const parent of parents) {
      parent.traverse((node2) => {
        const mesh = node2.getMesh();
        if (!mesh) return;
        const meshBounds = getMeshBounds(mesh, node2.getWorldMatrix());
        if (meshBounds.min.every(isFinite) && meshBounds.max.every(isFinite)) {
          expandBounds(meshBounds.min, resultBounds);
          expandBounds(meshBounds.max, resultBounds);
        }
      });
    }
    return resultBounds;
  }
  function getMeshBounds(mesh, worldMatrix) {
    const meshBounds = createBounds();
    for (const prim of mesh.listPrimitives()) {
      const position = prim.getAttribute("POSITION");
      const indices = prim.getIndices();
      if (!position) continue;
      let localPos = [0, 0, 0];
      let worldPos = [0, 0, 0];
      for (let i = 0, il = indices ? indices.getCount() : position.getCount(); i < il; i++) {
        const index = indices ? indices.getScalar(i) : i;
        localPos = position.getElement(index, localPos);
        worldPos = transformMat4(worldPos, localPos, worldMatrix);
        expandBounds(worldPos, meshBounds);
      }
    }
    return meshBounds;
  }
  function expandBounds(point, target) {
    for (let i = 0; i < 3; i++) {
      target.min[i] = Math.min(point[i], target.min[i]);
      target.max[i] = Math.max(point[i], target.max[i]);
    }
  }
  function createBounds() {
    return {
      min: [Infinity, Infinity, Infinity],
      max: [-Infinity, -Infinity, -Infinity]
    };
  }
  var NULL_DOMAIN = "https://null.example";
  var HTTPUtils = class {
    static dirname(path) {
      const index = path.lastIndexOf("/");
      if (index === -1) return "./";
      return path.substring(0, index + 1);
    }
    /**
     * Extracts the basename from a URL, e.g. "folder/model.glb" -> "model".
     * See: {@link FileUtils.basename}
     */
    static basename(uri) {
      return FileUtils.basename(new URL(uri, NULL_DOMAIN).pathname);
    }
    /**
     * Extracts the extension from a URL, e.g. "folder/model.glb" -> "glb".
     * See: {@link FileUtils.extension}
     */
    static extension(uri) {
      return FileUtils.extension(new URL(uri, NULL_DOMAIN).pathname);
    }
    static resolve(base, path) {
      if (!this.isRelativePath(path)) return path;
      const stack = base.split("/");
      const parts = path.split("/");
      stack.pop();
      for (let i = 0; i < parts.length; i++) {
        if (parts[i] === ".") continue;
        if (parts[i] === "..") {
          stack.pop();
        } else {
          stack.push(parts[i]);
        }
      }
      return stack.join("/");
    }
    /**
     * Returns true for URLs containing a protocol, and false for both
     * absolute and relative paths.
     */
    static isAbsoluteURL(path) {
      return this.PROTOCOL_REGEXP.test(path);
    }
    /**
     * Returns true for paths that are declared relative to some unknown base
     * path. For example, "foo/bar/" is relative both "/foo/bar/" is not.
     */
    static isRelativePath(path) {
      return !/^(?:[a-zA-Z]+:)?\//.test(path);
    }
  };
  HTTPUtils.DEFAULT_INIT = {};
  HTTPUtils.PROTOCOL_REGEXP = /^[a-zA-Z]+:\/\//;
  function isObject(o) {
    return Object.prototype.toString.call(o) === "[object Object]";
  }
  function isPlainObject(o) {
    if (isObject(o) === false) return false;
    const ctor = o.constructor;
    if (ctor === void 0) return true;
    const prot = ctor.prototype;
    if (isObject(prot) === false) return false;
    if (Object.hasOwn(prot, "isPrototypeOf") === false) {
      return false;
    }
    return true;
  }
  var _Logger;
  var Verbosity;
  (function(Verbosity2) {
    Verbosity2[Verbosity2["SILENT"] = 4] = "SILENT";
    Verbosity2[Verbosity2["ERROR"] = 3] = "ERROR";
    Verbosity2[Verbosity2["WARN"] = 2] = "WARN";
    Verbosity2[Verbosity2["INFO"] = 1] = "INFO";
    Verbosity2[Verbosity2["DEBUG"] = 0] = "DEBUG";
  })(Verbosity || (Verbosity = {}));
  var Logger = class _Logger2 {
    /** Constructs a new Logger instance. */
    constructor(verbosity) {
      this.verbosity = void 0;
      this.verbosity = verbosity;
    }
    /** Logs an event at level {@link Logger.Verbosity.DEBUG}. */
    debug(text) {
      if (this.verbosity <= _Logger2.Verbosity.DEBUG) {
        console.debug(text);
      }
    }
    /** Logs an event at level {@link Logger.Verbosity.INFO}. */
    info(text) {
      if (this.verbosity <= _Logger2.Verbosity.INFO) {
        console.info(text);
      }
    }
    /** Logs an event at level {@link Logger.Verbosity.WARN}. */
    warn(text) {
      if (this.verbosity <= _Logger2.Verbosity.WARN) {
        console.warn(text);
      }
    }
    /** Logs an event at level {@link Logger.Verbosity.ERROR}. */
    error(text) {
      if (this.verbosity <= _Logger2.Verbosity.ERROR) {
        console.error(text);
      }
    }
  };
  _Logger = Logger;
  Logger.Verbosity = Verbosity;
  Logger.DEFAULT_INSTANCE = new _Logger(_Logger.Verbosity.INFO);
  function determinant(a) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = a00 * a11 - a01 * a10;
    var b1 = a00 * a12 - a02 * a10;
    var b2 = a01 * a12 - a02 * a11;
    var b3 = a20 * a31 - a21 * a30;
    var b4 = a20 * a32 - a22 * a30;
    var b5 = a21 * a32 - a22 * a31;
    var b6 = a00 * b5 - a01 * b4 + a02 * b3;
    var b7 = a10 * b5 - a11 * b4 + a12 * b3;
    var b8 = a20 * b2 - a21 * b1 + a22 * b0;
    var b9 = a30 * b2 - a31 * b1 + a32 * b0;
    return a13 * b6 - a03 * b7 + a33 * b8 - a23 * b9;
  }
  function multiply(out, a, b) {
    var a00 = a[0], a01 = a[1], a02 = a[2], a03 = a[3];
    var a10 = a[4], a11 = a[5], a12 = a[6], a13 = a[7];
    var a20 = a[8], a21 = a[9], a22 = a[10], a23 = a[11];
    var a30 = a[12], a31 = a[13], a32 = a[14], a33 = a[15];
    var b0 = b[0], b1 = b[1], b2 = b[2], b3 = b[3];
    out[0] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[1] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[2] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[3] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[4];
    b1 = b[5];
    b2 = b[6];
    b3 = b[7];
    out[4] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[5] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[6] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[7] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[8];
    b1 = b[9];
    b2 = b[10];
    b3 = b[11];
    out[8] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[9] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[10] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[11] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    b0 = b[12];
    b1 = b[13];
    b2 = b[14];
    b3 = b[15];
    out[12] = b0 * a00 + b1 * a10 + b2 * a20 + b3 * a30;
    out[13] = b0 * a01 + b1 * a11 + b2 * a21 + b3 * a31;
    out[14] = b0 * a02 + b1 * a12 + b2 * a22 + b3 * a32;
    out[15] = b0 * a03 + b1 * a13 + b2 * a23 + b3 * a33;
    return out;
  }
  function getScaling(out, mat) {
    var m11 = mat[0];
    var m12 = mat[1];
    var m13 = mat[2];
    var m21 = mat[4];
    var m22 = mat[5];
    var m23 = mat[6];
    var m31 = mat[8];
    var m32 = mat[9];
    var m33 = mat[10];
    out[0] = Math.sqrt(m11 * m11 + m12 * m12 + m13 * m13);
    out[1] = Math.sqrt(m21 * m21 + m22 * m22 + m23 * m23);
    out[2] = Math.sqrt(m31 * m31 + m32 * m32 + m33 * m33);
    return out;
  }
  function getRotation(out, mat) {
    var scaling = new ARRAY_TYPE(3);
    getScaling(scaling, mat);
    var is1 = 1 / scaling[0];
    var is2 = 1 / scaling[1];
    var is3 = 1 / scaling[2];
    var sm11 = mat[0] * is1;
    var sm12 = mat[1] * is2;
    var sm13 = mat[2] * is3;
    var sm21 = mat[4] * is1;
    var sm22 = mat[5] * is2;
    var sm23 = mat[6] * is3;
    var sm31 = mat[8] * is1;
    var sm32 = mat[9] * is2;
    var sm33 = mat[10] * is3;
    var trace = sm11 + sm22 + sm33;
    var S = 0;
    if (trace > 0) {
      S = Math.sqrt(trace + 1) * 2;
      out[3] = 0.25 * S;
      out[0] = (sm23 - sm32) / S;
      out[1] = (sm31 - sm13) / S;
      out[2] = (sm12 - sm21) / S;
    } else if (sm11 > sm22 && sm11 > sm33) {
      S = Math.sqrt(1 + sm11 - sm22 - sm33) * 2;
      out[3] = (sm23 - sm32) / S;
      out[0] = 0.25 * S;
      out[1] = (sm12 + sm21) / S;
      out[2] = (sm31 + sm13) / S;
    } else if (sm22 > sm33) {
      S = Math.sqrt(1 + sm22 - sm11 - sm33) * 2;
      out[3] = (sm31 - sm13) / S;
      out[0] = (sm12 + sm21) / S;
      out[1] = 0.25 * S;
      out[2] = (sm23 + sm32) / S;
    } else {
      S = Math.sqrt(1 + sm33 - sm11 - sm22) * 2;
      out[3] = (sm12 - sm21) / S;
      out[0] = (sm31 + sm13) / S;
      out[1] = (sm23 + sm32) / S;
      out[2] = 0.25 * S;
    }
    return out;
  }
  var MathUtils = class _MathUtils {
    static identity(v) {
      return v;
    }
    static eq(a, b, tolerance = 1e-5) {
      if (a.length !== b.length) return false;
      for (let i = 0; i < a.length; i++) {
        if (Math.abs(a[i] - b[i]) > tolerance) return false;
      }
      return true;
    }
    static clamp(value, min, max) {
      if (value < min) return min;
      if (value > max) return max;
      return value;
    }
    // TODO(perf): Compare performance if we replace the switch with individual functions.
    static decodeNormalizedInt(i, componentType) {
      switch (componentType) {
        case 5126:
          return i;
        case 5123:
          return i / 65535;
        case 5121:
          return i / 255;
        case 5122:
          return Math.max(i / 32767, -1);
        case 5120:
          return Math.max(i / 127, -1);
        default:
          throw new Error("Invalid component type.");
      }
    }
    // TODO(perf): Compare performance if we replace the switch with individual functions.
    static encodeNormalizedInt(f, componentType) {
      switch (componentType) {
        case 5126:
          return f;
        case 5123:
          return Math.round(_MathUtils.clamp(f, 0, 1) * 65535);
        case 5121:
          return Math.round(_MathUtils.clamp(f, 0, 1) * 255);
        case 5122:
          return Math.round(_MathUtils.clamp(f, -1, 1) * 32767);
        case 5120:
          return Math.round(_MathUtils.clamp(f, -1, 1) * 127);
        default:
          throw new Error("Invalid component type.");
      }
    }
    /**
     * Decompose a mat4 to TRS properties.
     *
     * Equivalent to the Matrix4 decompose() method in three.js, and intentionally not using the
     * gl-matrix version. See: https://github.com/toji/gl-matrix/issues/408
     *
     * @param srcMat Matrix element, to be decomposed to TRS properties.
     * @param dstTranslation Translation element, to be overwritten.
     * @param dstRotation Rotation element, to be overwritten.
     * @param dstScale Scale element, to be overwritten.
     */
    static decompose(srcMat, dstTranslation, dstRotation, dstScale) {
      let sx = length([srcMat[0], srcMat[1], srcMat[2]]);
      const sy = length([srcMat[4], srcMat[5], srcMat[6]]);
      const sz = length([srcMat[8], srcMat[9], srcMat[10]]);
      const det = determinant(srcMat);
      if (det < 0) sx = -sx;
      dstTranslation[0] = srcMat[12];
      dstTranslation[1] = srcMat[13];
      dstTranslation[2] = srcMat[14];
      const _m1 = srcMat.slice();
      const invSX = 1 / sx;
      const invSY = 1 / sy;
      const invSZ = 1 / sz;
      _m1[0] *= invSX;
      _m1[1] *= invSX;
      _m1[2] *= invSX;
      _m1[4] *= invSY;
      _m1[5] *= invSY;
      _m1[6] *= invSY;
      _m1[8] *= invSZ;
      _m1[9] *= invSZ;
      _m1[10] *= invSZ;
      getRotation(dstRotation, _m1);
      dstScale[0] = sx;
      dstScale[1] = sy;
      dstScale[2] = sz;
    }
    /**
     * Compose TRS properties to a mat4.
     *
     * Equivalent to the Matrix4 compose() method in three.js, and intentionally not using the
     * gl-matrix version. See: https://github.com/toji/gl-matrix/issues/408
     *
     * @param srcTranslation Translation element of matrix.
     * @param srcRotation Rotation element of matrix.
     * @param srcScale Scale element of matrix.
     * @param dstMat Matrix element, to be modified and returned.
     * @returns dstMat, overwritten to mat4 equivalent of given TRS properties.
     */
    static compose(srcTranslation, srcRotation, srcScale, dstMat) {
      const te = dstMat;
      const x = srcRotation[0], y = srcRotation[1], z = srcRotation[2], w = srcRotation[3];
      const x2 = x + x, y2 = y + y, z2 = z + z;
      const xx = x * x2, xy = x * y2, xz = x * z2;
      const yy = y * y2, yz = y * z2, zz = z * z2;
      const wx = w * x2, wy = w * y2, wz = w * z2;
      const sx = srcScale[0], sy = srcScale[1], sz = srcScale[2];
      te[0] = (1 - (yy + zz)) * sx;
      te[1] = (xy + wz) * sx;
      te[2] = (xz - wy) * sx;
      te[3] = 0;
      te[4] = (xy - wz) * sy;
      te[5] = (1 - (xx + zz)) * sy;
      te[6] = (yz + wx) * sy;
      te[7] = 0;
      te[8] = (xz + wy) * sz;
      te[9] = (yz - wx) * sz;
      te[10] = (1 - (xx + yy)) * sz;
      te[11] = 0;
      te[12] = srcTranslation[0];
      te[13] = srcTranslation[1];
      te[14] = srcTranslation[2];
      te[15] = 1;
      return te;
    }
  };
  function equalsRef(refA, refB) {
    if (!!refA !== !!refB) return false;
    const a = refA.getChild();
    const b = refB.getChild();
    return a === b || a.equals(b);
  }
  function equalsRefSet(refSetA, refSetB) {
    if (!!refSetA !== !!refSetB) return false;
    const refValuesA = refSetA.values();
    const refValuesB = refSetB.values();
    if (refValuesA.length !== refValuesB.length) return false;
    for (let i = 0; i < refValuesA.length; i++) {
      const a = refValuesA[i];
      const b = refValuesB[i];
      if (a.getChild() === b.getChild()) continue;
      if (!a.getChild().equals(b.getChild())) return false;
    }
    return true;
  }
  function equalsRefMap(refMapA, refMapB) {
    if (!!refMapA !== !!refMapB) return false;
    const keysA = refMapA.keys();
    const keysB = refMapB.keys();
    if (keysA.length !== keysB.length) return false;
    for (const key of keysA) {
      const refA = refMapA.get(key);
      const refB = refMapB.get(key);
      if (!!refA !== !!refB) return false;
      const a = refA.getChild();
      const b = refB.getChild();
      if (a === b) continue;
      if (!a.equals(b)) return false;
    }
    return true;
  }
  function equalsArray(a, b) {
    if (a === b) return true;
    if (!!a !== !!b || !a || !b) return false;
    if (a.length !== b.length) return false;
    for (let i = 0; i < a.length; i++) {
      if (a[i] !== b[i]) return false;
    }
    return true;
  }
  function equalsObject(_a, _b) {
    if (_a === _b) return true;
    if (!!_a !== !!_b) return false;
    if (!isPlainObject(_a) || !isPlainObject(_b)) {
      return _a === _b;
    }
    const a = _a;
    const b = _b;
    let numKeysA = 0;
    let numKeysB = 0;
    let key;
    for (key in a) numKeysA++;
    for (key in b) numKeysB++;
    if (numKeysA !== numKeysB) return false;
    for (key in a) {
      const valueA = a[key];
      const valueB = b[key];
      if (isArray(valueA) && isArray(valueB)) {
        if (!equalsArray(valueA, valueB)) return false;
      } else if (isPlainObject(valueA) && isPlainObject(valueB)) {
        if (!equalsObject(valueA, valueB)) return false;
      } else {
        if (valueA !== valueB) return false;
      }
    }
    return true;
  }
  function isArray(value) {
    return Array.isArray(value) || ArrayBuffer.isView(value);
  }
  var ALPHABET = "23456789abdegjkmnpqrvwxyzABDEGJKMNPQRVWXYZ";
  var UNIQUE_RETRIES = 999;
  var ID_LENGTH = 6;
  var previousIDs = /* @__PURE__ */ new Set();
  var generateOne = function generateOne2() {
    let rtn = "";
    for (let i = 0; i < ID_LENGTH; i++) {
      rtn += ALPHABET.charAt(Math.floor(Math.random() * ALPHABET.length));
    }
    return rtn;
  };
  var uuid = function uuid2() {
    for (let retries = 0; retries < UNIQUE_RETRIES; retries++) {
      const id = generateOne();
      if (!previousIDs.has(id)) {
        previousIDs.add(id);
        return id;
      }
    }
    return "";
  };
  var COPY_IDENTITY = (t) => t;
  var EMPTY_SET = /* @__PURE__ */ new Set();
  var Property = class extends GraphNode {
    /** @hidden */
    constructor(graph, name = "") {
      super(graph);
      this[$attributes]["name"] = name;
      this.init();
      this.dispatchEvent({
        type: "create"
      });
    }
    /**
     * Returns the Graph associated with this Property. For internal use.
     * @hidden
     * @experimental
     */
    getGraph() {
      return this.graph;
    }
    /**
     * Returns default attributes for the property. Empty lists and maps should be initialized
     * to empty arrays and objects. Always invoke `super.getDefaults()` and extend the result.
     */
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        name: "",
        extras: {}
      });
    }
    /** @hidden */
    set(attribute, value) {
      if (Array.isArray(value)) value = value.slice();
      return super.set(attribute, value);
    }
    /**********************************************************************************************
     * Name.
     */
    /**
     * Returns the name of this property. While names are not required to be unique, this is
     * encouraged, and non-unique names will be overwritten in some tools. For custom data about
     * a property, prefer to use Extras.
     */
    getName() {
      return this.get("name");
    }
    /**
     * Sets the name of this property. While names are not required to be unique, this is
     * encouraged, and non-unique names will be overwritten in some tools. For custom data about
     * a property, prefer to use Extras.
     */
    setName(name) {
      return this.set("name", name);
    }
    /**********************************************************************************************
     * Extras.
     */
    /**
     * Returns a reference to the Extras object, containing application-specific data for this
     * Property. Extras should be an Object, not a primitive value, for best portability.
     */
    getExtras() {
      return this.get("extras");
    }
    /**
     * Updates the Extras object, containing application-specific data for this Property. Extras
     * should be an Object, not a primitive value, for best portability.
     */
    setExtras(extras) {
      return this.set("extras", extras);
    }
    /**********************************************************************************************
     * Graph state.
     */
    /**
     * Makes a copy of this property, with the same resources (by reference) as the original.
     */
    clone() {
      const PropertyClass = this.constructor;
      return new PropertyClass(this.graph).copy(this, COPY_IDENTITY);
    }
    /**
     * Copies all data from another property to this one. Child properties are copied by reference,
     * unless a 'resolve' function is given to override that.
     * @param other Property to copy references from.
     * @param resolve Function to resolve each Property being transferred. Default is identity.
     */
    copy(other, resolve = COPY_IDENTITY) {
      for (const key in this[$attributes]) {
        const value = this[$attributes][key];
        if (value instanceof GraphEdge) {
          if (!this[$immutableKeys].has(key)) {
            value.dispose();
          }
        } else if (value instanceof RefList || value instanceof RefSet) {
          for (const ref of value.values()) {
            ref.dispose();
          }
        } else if (value instanceof RefMap) {
          for (const ref of value.values()) {
            ref.dispose();
          }
        }
      }
      for (const key in other[$attributes]) {
        const thisValue = this[$attributes][key];
        const otherValue = other[$attributes][key];
        if (otherValue instanceof GraphEdge) {
          if (this[$immutableKeys].has(key)) {
            const ref = thisValue;
            ref.getChild().copy(resolve(otherValue.getChild()), resolve);
          } else {
            this.setRef(key, resolve(otherValue.getChild()), otherValue.getAttributes());
          }
        } else if (otherValue instanceof RefSet || otherValue instanceof RefList) {
          for (const ref of otherValue.values()) {
            this.addRef(key, resolve(ref.getChild()), ref.getAttributes());
          }
        } else if (otherValue instanceof RefMap) {
          for (const subkey of otherValue.keys()) {
            const ref = otherValue.get(subkey);
            this.setRefMap(key, subkey, resolve(ref.getChild()), ref.getAttributes());
          }
        } else if (isPlainObject(otherValue)) {
          this[$attributes][key] = JSON.parse(JSON.stringify(otherValue));
        } else if (Array.isArray(otherValue) || otherValue instanceof ArrayBuffer || ArrayBuffer.isView(otherValue)) {
          this[$attributes][key] = otherValue.slice();
        } else {
          this[$attributes][key] = otherValue;
        }
      }
      return this;
    }
    /**
     * Returns true if two properties are deeply equivalent, recursively comparing the attributes
     * of the properties. Optionally, a 'skip' set may be included, specifying attributes whose
     * values should not be considered in the comparison.
     *
     * Example: Two {@link Primitive Primitives} are equivalent if they have accessors and
     * materials with equivalent content — but not necessarily the same specific accessors
     * and materials.
     */
    equals(other, skip = EMPTY_SET) {
      if (this === other) return true;
      if (this.propertyType !== other.propertyType) return false;
      for (const key in this[$attributes]) {
        if (skip.has(key)) continue;
        const a = this[$attributes][key];
        const b = other[$attributes][key];
        if (a instanceof GraphEdge || b instanceof GraphEdge) {
          if (!equalsRef(a, b)) {
            return false;
          }
        } else if (a instanceof RefSet || b instanceof RefSet || a instanceof RefList || b instanceof RefList) {
          if (!equalsRefSet(a, b)) {
            return false;
          }
        } else if (a instanceof RefMap || b instanceof RefMap) {
          if (!equalsRefMap(a, b)) {
            return false;
          }
        } else if (isPlainObject(a) || isPlainObject(b)) {
          if (!equalsObject(a, b)) return false;
        } else if (isArray(a) || isArray(b)) {
          if (!equalsArray(a, b)) return false;
        } else {
          if (a !== b) return false;
        }
      }
      return true;
    }
    detach() {
      this.graph.disconnectParents(this, (n) => n.propertyType !== "Root");
      return this;
    }
    /**
     * Returns a list of all properties that hold a reference to this property. For example, a
     * material may hold references to various textures, but a texture does not hold references
     * to the materials that use it.
     *
     * It is often necessary to filter the results for a particular type: some resources, like
     * {@link Accessor}s, may be referenced by different types of properties. Most properties
     * include the {@link Root} as a parent, which is usually not of interest.
     *
     * Usage:
     *
     * ```ts
     * const materials = texture
     * 	.listParents()
     * 	.filter((p) => p instanceof Material)
     * ```
     */
    listParents() {
      return this.graph.listParents(this);
    }
  };
  var ExtensibleProperty = class extends Property {
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        extensions: new RefMap()
      });
    }
    /** Returns an {@link ExtensionProperty} attached to this Property, if any. */
    getExtension(name) {
      return this.getRefMap("extensions", name);
    }
    /**
     * Attaches the given {@link ExtensionProperty} to this Property. For a given extension, only
     * one ExtensionProperty may be attached to any one Property at a time.
     */
    setExtension(name, extensionProperty) {
      if (extensionProperty) extensionProperty._validateParent(this);
      return this.setRefMap("extensions", name, extensionProperty);
    }
    /** Lists all {@link ExtensionProperty} instances attached to this Property. */
    listExtensions() {
      return this.listRefMapValues("extensions");
    }
  };
  var Accessor = class _Accessor extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.ACCESSOR;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        array: null,
        type: _Accessor.Type.SCALAR,
        componentType: _Accessor.ComponentType.FLOAT,
        normalized: false,
        sparse: false,
        buffer: null
      });
    }
    /**********************************************************************************************
     * Static.
     */
    /** Returns size of a given element type, in components. */
    static getElementSize(type) {
      switch (type) {
        case _Accessor.Type.SCALAR:
          return 1;
        case _Accessor.Type.VEC2:
          return 2;
        case _Accessor.Type.VEC3:
          return 3;
        case _Accessor.Type.VEC4:
          return 4;
        case _Accessor.Type.MAT2:
          return 4;
        case _Accessor.Type.MAT3:
          return 9;
        case _Accessor.Type.MAT4:
          return 16;
        default:
          throw new Error("Unexpected type: " + type);
      }
    }
    /** Returns size of a given component type, in bytes. */
    static getComponentSize(componentType) {
      switch (componentType) {
        case _Accessor.ComponentType.BYTE:
          return 1;
        case _Accessor.ComponentType.UNSIGNED_BYTE:
          return 1;
        case _Accessor.ComponentType.SHORT:
          return 2;
        case _Accessor.ComponentType.UNSIGNED_SHORT:
          return 2;
        case _Accessor.ComponentType.UNSIGNED_INT:
          return 4;
        case _Accessor.ComponentType.FLOAT:
          return 4;
        default:
          throw new Error("Unexpected component type: " + componentType);
      }
    }
    /**********************************************************************************************
     * Min/max bounds.
     */
    /**
     * Minimum value of each component in this attribute. Unlike in a final glTF file, values
     * returned by this method will reflect the minimum accounting for {@link .normalized}
     * state.
     */
    getMinNormalized(target) {
      const normalized = this.getNormalized();
      const elementSize = this.getElementSize();
      const componentType = this.getComponentType();
      this.getMin(target);
      if (normalized) {
        for (let j = 0; j < elementSize; j++) {
          target[j] = MathUtils.decodeNormalizedInt(target[j], componentType);
        }
      }
      return target;
    }
    /**
     * Minimum value of each component in this attribute. Values returned by this method do not
     * reflect normalization: use {@link .getMinNormalized} in that case.
     */
    getMin(target) {
      const array = this.getArray();
      const count = this.getCount();
      const elementSize = this.getElementSize();
      for (let j = 0; j < elementSize; j++) target[j] = Infinity;
      for (let i = 0; i < count * elementSize; i += elementSize) {
        for (let j = 0; j < elementSize; j++) {
          const value = array[i + j];
          if (Number.isFinite(value)) {
            target[j] = Math.min(target[j], value);
          }
        }
      }
      return target;
    }
    /**
     * Maximum value of each component in this attribute. Unlike in a final glTF file, values
     * returned by this method will reflect the minimum accounting for {@link .normalized}
     * state.
     */
    getMaxNormalized(target) {
      const normalized = this.getNormalized();
      const elementSize = this.getElementSize();
      const componentType = this.getComponentType();
      this.getMax(target);
      if (normalized) {
        for (let j = 0; j < elementSize; j++) {
          target[j] = MathUtils.decodeNormalizedInt(target[j], componentType);
        }
      }
      return target;
    }
    /**
     * Maximum value of each component in this attribute. Values returned by this method do not
     * reflect normalization: use {@link .getMinNormalized} in that case.
     */
    getMax(target) {
      const array = this.get("array");
      const count = this.getCount();
      const elementSize = this.getElementSize();
      for (let j = 0; j < elementSize; j++) target[j] = -Infinity;
      for (let i = 0; i < count * elementSize; i += elementSize) {
        for (let j = 0; j < elementSize; j++) {
          const value = array[i + j];
          if (Number.isFinite(value)) {
            target[j] = Math.max(target[j], value);
          }
        }
      }
      return target;
    }
    /**********************************************************************************************
     * Layout.
     */
    /**
     * Number of elements in the accessor. An array of length 30, containing 10 `VEC3` elements,
     * will have a count of 10.
     */
    getCount() {
      const array = this.get("array");
      return array ? array.length / this.getElementSize() : 0;
    }
    /** Type of element stored in the accessor. `VEC2`, `VEC3`, etc. */
    getType() {
      return this.get("type");
    }
    /**
     * Sets type of element stored in the accessor. `VEC2`, `VEC3`, etc. Array length must be a
     * multiple of the component size (`VEC2` = 2, `VEC3` = 3, ...) for the selected type.
     */
    setType(type) {
      return this.set("type", type);
    }
    /**
     * Number of components in each element of the accessor. For example, the element size of a
     * `VEC2` accessor is 2. This value is determined automatically based on array length and
     * accessor type, specified with {@link Accessor.setType setType()}.
     */
    // biome-ignore lint/suspicious/useAdjacentOverloadSignatures: Static vs. non-static.
    getElementSize() {
      return _Accessor.getElementSize(this.get("type"));
    }
    /**
     * Size of each component (a value in the raw array), in bytes. For example, the
     * `componentSize` of data backed by a `float32` array is 4 bytes.
     */
    getComponentSize() {
      return this.get("array").BYTES_PER_ELEMENT;
    }
    /**
     * Component type (float32, uint16, etc.). This value is determined automatically, and can only
     * be modified by replacing the underlying array.
     */
    getComponentType() {
      return this.get("componentType");
    }
    /**********************************************************************************************
     * Normalization.
     */
    /**
     * Specifies whether integer data values should be normalized (true) to [0, 1] (for unsigned
     * types) or [-1, 1] (for signed types), or converted directly (false) when they are accessed.
     * This property is defined only for accessors that contain vertex attributes or animation
     * output data.
     */
    getNormalized() {
      return this.get("normalized");
    }
    /**
     * Specifies whether integer data values should be normalized (true) to [0, 1] (for unsigned
     * types) or [-1, 1] (for signed types), or converted directly (false) when they are accessed.
     * This property is defined only for accessors that contain vertex attributes or animation
     * output data.
     */
    setNormalized(normalized) {
      return this.set("normalized", normalized);
    }
    /**********************************************************************************************
     * Data access.
     */
    /**
     * Returns the scalar element value at the given index. For
     * {@link Accessor.getNormalized normalized} integer accessors, values are
     * decoded and returned in floating-point form.
     */
    getScalar(index) {
      const elementSize = this.getElementSize();
      const componentType = this.getComponentType();
      const array = this.getArray();
      if (this.getNormalized()) {
        return MathUtils.decodeNormalizedInt(array[index * elementSize], componentType);
      }
      return array[index * elementSize];
    }
    /**
     * Assigns the scalar element value at the given index. For
     * {@link Accessor.getNormalized normalized} integer accessors, "value" should be
     * given in floating-point form — it will be integer-encoded before writing
     * to the underlying array.
     */
    setScalar(index, x) {
      const elementSize = this.getElementSize();
      const componentType = this.getComponentType();
      const array = this.getArray();
      if (this.getNormalized()) {
        array[index * elementSize] = MathUtils.encodeNormalizedInt(x, componentType);
      } else {
        array[index * elementSize] = x;
      }
      return this;
    }
    /**
     * Returns the vector or matrix element value at the given index. For
     * {@link Accessor.getNormalized normalized} integer accessors, values are
     * decoded and returned in floating-point form.
     *
     * Example:
     *
     * ```javascript
     * import { add } from 'gl-matrix/add';
     *
     * const element = [];
     * const offset = [1, 1, 1];
     *
     * for (let i = 0; i < accessor.getCount(); i++) {
     * 	accessor.getElement(i, element);
     * 	add(element, element, offset);
     * 	accessor.setElement(i, element);
     * }
     * ```
     */
    getElement(index, target) {
      const normalized = this.getNormalized();
      const elementSize = this.getElementSize();
      const componentType = this.getComponentType();
      const array = this.getArray();
      for (let i = 0; i < elementSize; i++) {
        if (normalized) {
          target[i] = MathUtils.decodeNormalizedInt(array[index * elementSize + i], componentType);
        } else {
          target[i] = array[index * elementSize + i];
        }
      }
      return target;
    }
    /**
     * Assigns the vector or matrix element value at the given index. For
     * {@link Accessor.getNormalized normalized} integer accessors, "value" should be
     * given in floating-point form — it will be integer-encoded before writing
     * to the underlying array.
     *
     * Example:
     *
     * ```javascript
     * import { add } from 'gl-matrix/add';
     *
     * const element = [];
     * const offset = [1, 1, 1];
     *
     * for (let i = 0; i < accessor.getCount(); i++) {
     * 	accessor.getElement(i, element);
     * 	add(element, element, offset);
     * 	accessor.setElement(i, element);
     * }
     * ```
     */
    setElement(index, value) {
      const normalized = this.getNormalized();
      const elementSize = this.getElementSize();
      const componentType = this.getComponentType();
      const array = this.getArray();
      for (let i = 0; i < elementSize; i++) {
        if (normalized) {
          array[index * elementSize + i] = MathUtils.encodeNormalizedInt(value[i], componentType);
        } else {
          array[index * elementSize + i] = value[i];
        }
      }
      return this;
    }
    /**********************************************************************************************
     * Raw data storage.
     */
    /**
     * Specifies whether the accessor should be stored sparsely. When written to a glTF file, sparse
     * accessors store only values that differ from base values. When loaded in glTF Transform (or most
     * runtimes) a sparse accessor can be treated like any other accessor. Currently, glTF Transform always
     * uses zeroes for the base values when writing files.
     * @experimental
     */
    getSparse() {
      return this.get("sparse");
    }
    /**
     * Specifies whether the accessor should be stored sparsely. When written to a glTF file, sparse
     * accessors store only values that differ from base values. When loaded in glTF Transform (or most
     * runtimes) a sparse accessor can be treated like any other accessor. Currently, glTF Transform always
     * uses zeroes for the base values when writing files.
     * @experimental
     */
    setSparse(sparse) {
      return this.set("sparse", sparse);
    }
    /** Returns the {@link Buffer} into which this accessor will be organized. */
    getBuffer() {
      return this.getRef("buffer");
    }
    /** Assigns the {@link Buffer} into which this accessor will be organized. */
    setBuffer(buffer) {
      return this.setRef("buffer", buffer);
    }
    /** Returns the raw typed array underlying this accessor. */
    getArray() {
      return this.get("array");
    }
    /** Assigns the raw typed array underlying this accessor. */
    setArray(array) {
      this.set("componentType", array ? arrayToComponentType(array) : _Accessor.ComponentType.FLOAT);
      this.set("array", array);
      return this;
    }
    /** Returns the total bytelength of this accessor, exclusive of padding. */
    getByteLength() {
      const array = this.get("array");
      return array ? array.byteLength : 0;
    }
  };
  Accessor.Type = {
    /** Scalar, having 1 value per element. */
    SCALAR: "SCALAR",
    /** 2-component vector, having 2 components per element. */
    VEC2: "VEC2",
    /** 3-component vector, having 3 components per element. */
    VEC3: "VEC3",
    /** 4-component vector, having 4 components per element. */
    VEC4: "VEC4",
    /** 2x2 matrix, having 4 components per element. */
    MAT2: "MAT2",
    /** 3x3 matrix, having 9 components per element. */
    MAT3: "MAT3",
    /** 4x3 matrix, having 16 components per element. */
    MAT4: "MAT4"
  };
  Accessor.ComponentType = {
    /**
     * 1-byte signed integer, stored as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int8Array Int8Array}.
     */
    BYTE: 5120,
    /**
     * 1-byte unsigned integer, stored as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint8Array Uint8Array}.
     */
    UNSIGNED_BYTE: 5121,
    /**
     * 2-byte signed integer, stored as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Int16Array Int16Array}.
     */
    SHORT: 5122,
    /**
     * 2-byte unsigned integer, stored as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint16Array Uint16Array}.
     */
    UNSIGNED_SHORT: 5123,
    /**
     * 4-byte unsigned integer, stored as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Uint32Array Uint32Array}.
     */
    UNSIGNED_INT: 5125,
    /**
     * 4-byte floating point number, stored as
     * {@link https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Float32Array Float32Array}.
     */
    FLOAT: 5126
  };
  function arrayToComponentType(array) {
    switch (array.constructor) {
      case Float32Array:
        return Accessor.ComponentType.FLOAT;
      case Uint32Array:
        return Accessor.ComponentType.UNSIGNED_INT;
      case Uint16Array:
        return Accessor.ComponentType.UNSIGNED_SHORT;
      case Uint8Array:
        return Accessor.ComponentType.UNSIGNED_BYTE;
      case Int16Array:
        return Accessor.ComponentType.SHORT;
      case Int8Array:
        return Accessor.ComponentType.BYTE;
      default:
        throw new Error("Unknown accessor componentType.");
    }
  }
  var Animation = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.ANIMATION;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        channels: new RefSet(),
        samplers: new RefSet()
      });
    }
    /** Adds an {@link AnimationChannel} to this Animation. */
    addChannel(channel) {
      return this.addRef("channels", channel);
    }
    /** Removes an {@link AnimationChannel} from this Animation. */
    removeChannel(channel) {
      return this.removeRef("channels", channel);
    }
    /** Lists {@link AnimationChannel}s in this Animation. */
    listChannels() {
      return this.listRefs("channels");
    }
    /** Adds an {@link AnimationSampler} to this Animation. */
    addSampler(sampler) {
      return this.addRef("samplers", sampler);
    }
    /** Removes an {@link AnimationSampler} from this Animation. */
    removeSampler(sampler) {
      return this.removeRef("samplers", sampler);
    }
    /** Lists {@link AnimationSampler}s in this Animation. */
    listSamplers() {
      return this.listRefs("samplers");
    }
  };
  var AnimationChannel = class extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.ANIMATION_CHANNEL;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        targetPath: null,
        targetNode: null,
        sampler: null
      });
    }
    /**********************************************************************************************
     * Properties.
     */
    /**
     * Path (property) animated on the target {@link Node}. Supported values include:
     * `translation`, `rotation`, `scale`, or `weights`.
     */
    getTargetPath() {
      return this.get("targetPath");
    }
    /**
     * Path (property) animated on the target {@link Node}. Supported values include:
     * `translation`, `rotation`, `scale`, or `weights`.
     */
    setTargetPath(targetPath) {
      return this.set("targetPath", targetPath);
    }
    /** Target {@link Node} animated by the channel. */
    getTargetNode() {
      return this.getRef("targetNode");
    }
    /** Target {@link Node} animated by the channel. */
    setTargetNode(targetNode) {
      return this.setRef("targetNode", targetNode);
    }
    /**
     * Keyframe data input/output values for the channel. Must be attached to the same
     * {@link Animation}.
     */
    getSampler() {
      return this.getRef("sampler");
    }
    /**
     * Keyframe data input/output values for the channel. Must be attached to the same
     * {@link Animation}.
     */
    setSampler(sampler) {
      return this.setRef("sampler", sampler);
    }
  };
  AnimationChannel.TargetPath = {
    /** Channel targets {@link Node.setTranslation}. */
    TRANSLATION: "translation",
    /** Channel targets {@link Node.setRotation}. */
    ROTATION: "rotation",
    /** Channel targets {@link Node.setScale}. */
    SCALE: "scale",
    /** Channel targets {@link Node.setWeights}, affecting {@link PrimitiveTarget} weights. */
    WEIGHTS: "weights"
  };
  var AnimationSampler = class _AnimationSampler extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.ANIMATION_SAMPLER;
    }
    getDefaultAttributes() {
      return Object.assign(super.getDefaults(), {
        interpolation: _AnimationSampler.Interpolation.LINEAR,
        input: null,
        output: null
      });
    }
    /**********************************************************************************************
     * Static.
     */
    /** Interpolation mode: `STEP`, `LINEAR`, or `CUBICSPLINE`. */
    getInterpolation() {
      return this.get("interpolation");
    }
    /** Interpolation mode: `STEP`, `LINEAR`, or `CUBICSPLINE`. */
    setInterpolation(interpolation) {
      return this.set("interpolation", interpolation);
    }
    /** Times for each keyframe, in seconds. */
    getInput() {
      return this.getRef("input");
    }
    /** Times for each keyframe, in seconds. */
    setInput(input) {
      return this.setRef("input", input, {
        usage: BufferViewUsage$1.OTHER
      });
    }
    /**
     * Values for each keyframe. For `CUBICSPLINE` interpolation, output also contains in/out
     * tangents.
     */
    getOutput() {
      return this.getRef("output");
    }
    /**
     * Values for each keyframe. For `CUBICSPLINE` interpolation, output also contains in/out
     * tangents.
     */
    setOutput(output) {
      return this.setRef("output", output, {
        usage: BufferViewUsage$1.OTHER
      });
    }
  };
  AnimationSampler.Interpolation = {
    /** Animated values are linearly interpolated between keyframes. */
    LINEAR: "LINEAR",
    /** Animated values remain constant from one keyframe until the next keyframe. */
    STEP: "STEP",
    /** Animated values are interpolated according to given cubic spline tangents. */
    CUBICSPLINE: "CUBICSPLINE"
  };
  var Buffer$1 = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.BUFFER;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        uri: ""
      });
    }
    /**
     * Returns the URI (or filename) of this buffer (e.g. 'myBuffer.bin'). URIs are strongly
     * encouraged to be relative paths, rather than absolute. Use of a protocol (like `file://`)
     * is possible for custom applications, but will limit the compatibility of the asset with most
     * tools.
     *
     * Buffers commonly use the extension `.bin`, though this is not required.
     */
    getURI() {
      return this.get("uri");
    }
    /**
     * Sets the URI (or filename) of this buffer (e.g. 'myBuffer.bin'). URIs are strongly
     * encouraged to be relative paths, rather than absolute. Use of a protocol (like `file://`)
     * is possible for custom applications, but will limit the compatibility of the asset with most
     * tools.
     *
     * Buffers commonly use the extension `.bin`, though this is not required.
     */
    setURI(uri) {
      return this.set("uri", uri);
    }
  };
  var Camera = class _Camera extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.CAMERA;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        // Common.
        type: _Camera.Type.PERSPECTIVE,
        znear: 0.1,
        zfar: 100,
        // Perspective.
        aspectRatio: null,
        yfov: Math.PI * 2 * 50 / 360,
        // 50º
        // Orthographic.
        xmag: 1,
        ymag: 1
      });
    }
    /**********************************************************************************************
     * Common.
     */
    /** Specifies if the camera uses a perspective or orthographic projection. */
    getType() {
      return this.get("type");
    }
    /** Specifies if the camera uses a perspective or orthographic projection. */
    setType(type) {
      return this.set("type", type);
    }
    /** Floating-point distance to the near clipping plane. */
    getZNear() {
      return this.get("znear");
    }
    /** Floating-point distance to the near clipping plane. */
    setZNear(znear) {
      return this.set("znear", znear);
    }
    /**
     * Floating-point distance to the far clipping plane. When defined, zfar must be greater than
     * znear. If zfar is undefined, runtime must use infinite projection matrix.
     */
    getZFar() {
      return this.get("zfar");
    }
    /**
     * Floating-point distance to the far clipping plane. When defined, zfar must be greater than
     * znear. If zfar is undefined, runtime must use infinite projection matrix.
     */
    setZFar(zfar) {
      return this.set("zfar", zfar);
    }
    /**********************************************************************************************
     * Perspective.
     */
    /**
     * Floating-point aspect ratio of the field of view. When undefined, the aspect ratio of the
     * canvas is used.
     */
    getAspectRatio() {
      return this.get("aspectRatio");
    }
    /**
     * Floating-point aspect ratio of the field of view. When undefined, the aspect ratio of the
     * canvas is used.
     */
    setAspectRatio(aspectRatio) {
      return this.set("aspectRatio", aspectRatio);
    }
    /** Floating-point vertical field of view in radians. */
    getYFov() {
      return this.get("yfov");
    }
    /** Floating-point vertical field of view in radians. */
    setYFov(yfov) {
      return this.set("yfov", yfov);
    }
    /**********************************************************************************************
     * Orthographic.
     */
    /**
     * Floating-point horizontal magnification of the view, and half the view's width
     * in world units.
     */
    getXMag() {
      return this.get("xmag");
    }
    /**
     * Floating-point horizontal magnification of the view, and half the view's width
     * in world units.
     */
    setXMag(xmag) {
      return this.set("xmag", xmag);
    }
    /**
     * Floating-point vertical magnification of the view, and half the view's height
     * in world units.
     */
    getYMag() {
      return this.get("ymag");
    }
    /**
     * Floating-point vertical magnification of the view, and half the view's height
     * in world units.
     */
    setYMag(ymag) {
      return this.set("ymag", ymag);
    }
  };
  Camera.Type = {
    /** A perspective camera representing a perspective projection matrix. */
    PERSPECTIVE: "perspective",
    /** An orthographic camera representing an orthographic projection matrix. */
    ORTHOGRAPHIC: "orthographic"
  };
  var ExtensionProperty = class extends Property {
    /** @hidden */
    _validateParent(parent) {
      if (!this.parentTypes.includes(parent.propertyType)) {
        throw new Error(`Parent "${parent.propertyType}" invalid for child "${this.propertyType}".`);
      }
    }
  };
  ExtensionProperty.EXTENSION_NAME = void 0;
  var TextureInfo = class _TextureInfo extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.TEXTURE_INFO;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        texCoord: 0,
        magFilter: null,
        minFilter: null,
        wrapS: _TextureInfo.WrapMode.REPEAT,
        wrapT: _TextureInfo.WrapMode.REPEAT
      });
    }
    /**********************************************************************************************
     * Texture coordinates.
     */
    /** Returns the texture coordinate (UV set) index for the texture. */
    getTexCoord() {
      return this.get("texCoord");
    }
    /** Sets the texture coordinate (UV set) index for the texture. */
    setTexCoord(texCoord) {
      return this.set("texCoord", texCoord);
    }
    /**********************************************************************************************
     * Min/mag filter.
     */
    /** Returns the magnification filter applied to the texture. */
    getMagFilter() {
      return this.get("magFilter");
    }
    /** Sets the magnification filter applied to the texture. */
    setMagFilter(magFilter) {
      return this.set("magFilter", magFilter);
    }
    /** Sets the minification filter applied to the texture. */
    getMinFilter() {
      return this.get("minFilter");
    }
    /** Returns the minification filter applied to the texture. */
    setMinFilter(minFilter) {
      return this.set("minFilter", minFilter);
    }
    /**********************************************************************************************
     * UV wrapping.
     */
    /** Returns the S (U) wrapping mode for UVs used by the texture. */
    getWrapS() {
      return this.get("wrapS");
    }
    /** Sets the S (U) wrapping mode for UVs used by the texture. */
    setWrapS(wrapS) {
      return this.set("wrapS", wrapS);
    }
    /** Returns the T (V) wrapping mode for UVs used by the texture. */
    getWrapT() {
      return this.get("wrapT");
    }
    /** Sets the T (V) wrapping mode for UVs used by the texture. */
    setWrapT(wrapT) {
      return this.set("wrapT", wrapT);
    }
  };
  TextureInfo.WrapMode = {
    /** */
    CLAMP_TO_EDGE: 33071,
    /** */
    MIRRORED_REPEAT: 33648,
    /** */
    REPEAT: 10497
  };
  TextureInfo.MagFilter = {
    /** */
    NEAREST: 9728,
    /** */
    LINEAR: 9729
  };
  TextureInfo.MinFilter = {
    /** */
    NEAREST: 9728,
    /** */
    LINEAR: 9729,
    /** */
    NEAREST_MIPMAP_NEAREST: 9984,
    /** */
    LINEAR_MIPMAP_NEAREST: 9985,
    /** */
    NEAREST_MIPMAP_LINEAR: 9986,
    /** */
    LINEAR_MIPMAP_LINEAR: 9987
  };
  var {
    R,
    G,
    B,
    A
  } = TextureChannel;
  var Material = class _Material extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.MATERIAL;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        alphaMode: _Material.AlphaMode.OPAQUE,
        alphaCutoff: 0.5,
        doubleSided: false,
        baseColorFactor: [1, 1, 1, 1],
        baseColorTexture: null,
        baseColorTextureInfo: new TextureInfo(this.graph, "baseColorTextureInfo"),
        emissiveFactor: [0, 0, 0],
        emissiveTexture: null,
        emissiveTextureInfo: new TextureInfo(this.graph, "emissiveTextureInfo"),
        normalScale: 1,
        normalTexture: null,
        normalTextureInfo: new TextureInfo(this.graph, "normalTextureInfo"),
        occlusionStrength: 1,
        occlusionTexture: null,
        occlusionTextureInfo: new TextureInfo(this.graph, "occlusionTextureInfo"),
        roughnessFactor: 1,
        metallicFactor: 1,
        metallicRoughnessTexture: null,
        metallicRoughnessTextureInfo: new TextureInfo(this.graph, "metallicRoughnessTextureInfo")
      });
    }
    /**********************************************************************************************
     * Double-sided / culling.
     */
    /** Returns true when both sides of triangles should be rendered. May impact performance. */
    getDoubleSided() {
      return this.get("doubleSided");
    }
    /** Sets whether to render both sides of triangles. May impact performance. */
    setDoubleSided(doubleSided) {
      return this.set("doubleSided", doubleSided);
    }
    /**********************************************************************************************
     * Alpha.
     */
    /** Returns material alpha, equivalent to baseColorFactor[3]. */
    getAlpha() {
      return this.get("baseColorFactor")[3];
    }
    /** Sets material alpha, equivalent to baseColorFactor[3]. */
    setAlpha(alpha) {
      const baseColorFactor = this.get("baseColorFactor").slice();
      baseColorFactor[3] = alpha;
      return this.set("baseColorFactor", baseColorFactor);
    }
    /**
     * Returns the mode of the material's alpha channels, which are provided by `baseColorFactor`
     * and `baseColorTexture`.
     *
     * - `OPAQUE`: Alpha value is ignored and the rendered output is fully opaque.
     * - `BLEND`: Alpha value is used to determine the transparency each pixel on a surface, and
     * 	the fraction of surface vs. background color in the final result. Alpha blending creates
     *	significant edge cases in realtime renderers, and some care when structuring the model is
     * 	necessary for good results. In particular, transparent geometry should be kept in separate
     * 	meshes or primitives from opaque geometry. The `depthWrite` or `zWrite` settings in engines
     * 	should usually be disabled on transparent materials.
     * - `MASK`: Alpha value is compared against `alphaCutoff` threshold for each pixel on a
     * 	surface, and the pixel is either fully visible or fully discarded based on that cutoff.
     * 	This technique is useful for things like leafs/foliage, grass, fabric meshes, and other
     * 	surfaces where no semitransparency is needed. With a good choice of `alphaCutoff`, surfaces
     * 	that don't require semitransparency can avoid the performance penalties and visual issues
     * 	involved with `BLEND` transparency.
     *
     * Reference:
     * - [glTF → material.alphaMode](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#materialalphamode)
     */
    getAlphaMode() {
      return this.get("alphaMode");
    }
    /** Sets the mode of the material's alpha channels. See {@link Material.getAlphaMode getAlphaMode} for details. */
    setAlphaMode(alphaMode) {
      return this.set("alphaMode", alphaMode);
    }
    /** Returns the visibility threshold; applied only when `.alphaMode='MASK'`. */
    getAlphaCutoff() {
      return this.get("alphaCutoff");
    }
    /** Sets the visibility threshold; applied only when `.alphaMode='MASK'`. */
    setAlphaCutoff(alphaCutoff) {
      return this.set("alphaCutoff", alphaCutoff);
    }
    /**********************************************************************************************
     * Base color.
     */
    /**
     * Base color / albedo factor; Linear-sRGB components.
     * See {@link Material.getBaseColorTexture getBaseColorTexture}.
     */
    getBaseColorFactor() {
      return this.get("baseColorFactor");
    }
    /**
     * Base color / albedo factor; Linear-sRGB components.
     * See {@link Material.getBaseColorTexture getBaseColorTexture}.
     */
    setBaseColorFactor(baseColorFactor) {
      return this.set("baseColorFactor", baseColorFactor);
    }
    /**
     * Base color / albedo. The visible color of a non-metallic surface under constant ambient
     * light would be a linear combination (multiplication) of its vertex colors, base color
     * factor, and base color texture. Lighting, and reflections in metallic or smooth surfaces,
     * also effect the final color. The alpha (`.a`) channel of base color factors and textures
     * will have varying effects, based on the setting of {@link Material.getAlphaMode getAlphaMode}.
     *
     * Reference:
     * - [glTF → material.pbrMetallicRoughness.baseColorFactor](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#pbrmetallicroughnessbasecolorfactor)
     */
    getBaseColorTexture() {
      return this.getRef("baseColorTexture");
    }
    /**
     * Settings affecting the material's use of its base color texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getBaseColorTextureInfo() {
      return this.getRef("baseColorTexture") ? this.getRef("baseColorTextureInfo") : null;
    }
    /** Sets base color / albedo texture. See {@link Material.getBaseColorTexture getBaseColorTexture}. */
    setBaseColorTexture(texture) {
      return this.setRef("baseColorTexture", texture, {
        channels: R | G | B | A,
        isColor: true
      });
    }
    /**********************************************************************************************
     * Emissive.
     */
    /** Emissive color; Linear-sRGB components. See {@link Material.getEmissiveTexture getEmissiveTexture}. */
    getEmissiveFactor() {
      return this.get("emissiveFactor");
    }
    /** Emissive color; Linear-sRGB components. See {@link Material.getEmissiveTexture getEmissiveTexture}. */
    setEmissiveFactor(emissiveFactor) {
      return this.set("emissiveFactor", emissiveFactor);
    }
    /**
     * Emissive texture. Emissive color is added to any base color of the material, after any
     * lighting/shadowing are applied. An emissive color does not inherently "glow", or affect
     * objects around it at all. To create that effect, most viewers must also enable a
     * post-processing effect called "bloom".
     *
     * Reference:
     * - [glTF → material.emissiveTexture](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#materialemissivetexture)
     */
    getEmissiveTexture() {
      return this.getRef("emissiveTexture");
    }
    /**
     * Settings affecting the material's use of its emissive texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getEmissiveTextureInfo() {
      return this.getRef("emissiveTexture") ? this.getRef("emissiveTextureInfo") : null;
    }
    /** Sets emissive texture. See {@link Material.getEmissiveTexture getEmissiveTexture}. */
    setEmissiveTexture(texture) {
      return this.setRef("emissiveTexture", texture, {
        channels: R | G | B,
        isColor: true
      });
    }
    /**********************************************************************************************
     * Normal.
     */
    /** Normal (surface detail) factor; linear multiplier. Affects `.normalTexture`. */
    getNormalScale() {
      return this.get("normalScale");
    }
    /** Normal (surface detail) factor; linear multiplier. Affects `.normalTexture`. */
    setNormalScale(scale) {
      return this.set("normalScale", scale);
    }
    /**
     * Normal (surface detail) texture.
     *
     * A tangent space normal map. The texture contains RGB components. Each texel represents the
     * XYZ components of a normal vector in tangent space. Red [0 to 255] maps to X [-1 to 1].
     * Green [0 to 255] maps to Y [-1 to 1]. Blue [128 to 255] maps to Z [1/255 to 1]. The normal
     * vectors use OpenGL conventions where +X is right and +Y is up. +Z points toward the viewer.
     *
     * Reference:
     * - [glTF → material.normalTexture](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#materialnormaltexture)
     */
    getNormalTexture() {
      return this.getRef("normalTexture");
    }
    /**
     * Settings affecting the material's use of its normal texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getNormalTextureInfo() {
      return this.getRef("normalTexture") ? this.getRef("normalTextureInfo") : null;
    }
    /** Sets normal (surface detail) texture. See {@link Material.getNormalTexture getNormalTexture}. */
    setNormalTexture(texture) {
      return this.setRef("normalTexture", texture, {
        channels: R | G | B
      });
    }
    /**********************************************************************************************
     * Occlusion.
     */
    /** (Ambient) Occlusion factor; linear multiplier. Affects `.occlusionTexture`. */
    getOcclusionStrength() {
      return this.get("occlusionStrength");
    }
    /** Sets (ambient) occlusion factor; linear multiplier. Affects `.occlusionTexture`. */
    setOcclusionStrength(strength) {
      return this.set("occlusionStrength", strength);
    }
    /**
     * (Ambient) Occlusion texture, generally used for subtle 'baked' shadowing effects that are
     * independent of an object's position, such as shading in inset areas and corners. Direct
     * lighting is not affected by occlusion, so at least one indirect light source must be present
     * in the scene for occlusion effects to be visible.
     *
     * The occlusion values are sampled from the R channel. Higher values indicate areas that
     * should receive full indirect lighting and lower values indicate no indirect lighting.
     *
     * Reference:
     * - [glTF → material.occlusionTexture](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#materialocclusiontexture)
     */
    getOcclusionTexture() {
      return this.getRef("occlusionTexture");
    }
    /**
     * Settings affecting the material's use of its occlusion texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getOcclusionTextureInfo() {
      return this.getRef("occlusionTexture") ? this.getRef("occlusionTextureInfo") : null;
    }
    /** Sets (ambient) occlusion texture. See {@link Material.getOcclusionTexture getOcclusionTexture}. */
    setOcclusionTexture(texture) {
      return this.setRef("occlusionTexture", texture, {
        channels: R
      });
    }
    /**********************************************************************************************
     * Metallic / roughness.
     */
    /**
     * Roughness factor; linear multiplier. Affects roughness channel of
     * `metallicRoughnessTexture`. See {@link Material.getMetallicRoughnessTexture getMetallicRoughnessTexture}.
     */
    getRoughnessFactor() {
      return this.get("roughnessFactor");
    }
    /**
     * Sets roughness factor; linear multiplier. Affects roughness channel of
     * `metallicRoughnessTexture`. See {@link Material.getMetallicRoughnessTexture getMetallicRoughnessTexture}.
     */
    setRoughnessFactor(factor) {
      return this.set("roughnessFactor", factor);
    }
    /**
     * Metallic factor; linear multiplier. Affects roughness channel of
     * `metallicRoughnessTexture`. See {@link Material.getMetallicRoughnessTexture getMetallicRoughnessTexture}.
     */
    getMetallicFactor() {
      return this.get("metallicFactor");
    }
    /**
     * Sets metallic factor; linear multiplier. Affects roughness channel of
     * `metallicRoughnessTexture`. See {@link Material.getMetallicRoughnessTexture getMetallicRoughnessTexture}.
     */
    setMetallicFactor(factor) {
      return this.set("metallicFactor", factor);
    }
    /**
     * Metallic roughness texture. The metalness values are sampled from the B channel. The
     * roughness values are sampled from the G channel. When a material is fully metallic,
     * or nearly so, it may require image-based lighting (i.e. an environment map) or global
     * illumination to appear well-lit.
     *
     * Reference:
     * - [glTF → material.pbrMetallicRoughness.metallicRoughnessTexture](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#pbrmetallicroughnessmetallicroughnesstexture)
     */
    getMetallicRoughnessTexture() {
      return this.getRef("metallicRoughnessTexture");
    }
    /**
     * Settings affecting the material's use of its metallic/roughness texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getMetallicRoughnessTextureInfo() {
      return this.getRef("metallicRoughnessTexture") ? this.getRef("metallicRoughnessTextureInfo") : null;
    }
    /**
     * Sets metallic/roughness texture.
     * See {@link Material.getMetallicRoughnessTexture getMetallicRoughnessTexture}.
     */
    setMetallicRoughnessTexture(texture) {
      return this.setRef("metallicRoughnessTexture", texture, {
        channels: G | B
      });
    }
  };
  Material.AlphaMode = {
    /**
     * The alpha value is ignored and the rendered output is fully opaque
     */
    OPAQUE: "OPAQUE",
    /**
     * The rendered output is either fully opaque or fully transparent depending on the alpha
     * value and the specified alpha cutoff value
     */
    MASK: "MASK",
    /**
     * The alpha value is used to composite the source and destination areas. The rendered
     * output is combined with the background using the normal painting operation (i.e. the
     * Porter and Duff over operator)
     */
    BLEND: "BLEND"
  };
  var Mesh = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.MESH;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        weights: [],
        primitives: new RefSet()
      });
    }
    /** Adds a {@link Primitive} to the mesh's draw call list. */
    addPrimitive(primitive) {
      return this.addRef("primitives", primitive);
    }
    /** Removes a {@link Primitive} from the mesh's draw call list. */
    removePrimitive(primitive) {
      return this.removeRef("primitives", primitive);
    }
    /** Lists {@link Primitive} draw calls of the mesh. */
    listPrimitives() {
      return this.listRefs("primitives");
    }
    /**
     * Initial weights of each {@link PrimitiveTarget} on this mesh. Each {@link Primitive} must
     * have the same number of targets. Most engines only support 4-8 active morph targets at a
     * time.
     */
    getWeights() {
      return this.get("weights");
    }
    /**
     * Initial weights of each {@link PrimitiveTarget} on this mesh. Each {@link Primitive} must
     * have the same number of targets. Most engines only support 4-8 active morph targets at a
     * time.
     */
    setWeights(weights) {
      return this.set("weights", weights);
    }
  };
  var Node = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.NODE;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        translation: [0, 0, 0],
        rotation: [0, 0, 0, 1],
        scale: [1, 1, 1],
        weights: [],
        camera: null,
        mesh: null,
        skin: null,
        children: new RefSet()
      });
    }
    copy(other, resolve = COPY_IDENTITY) {
      if (resolve === COPY_IDENTITY) throw new Error("Node cannot be copied.");
      return super.copy(other, resolve);
    }
    /**********************************************************************************************
     * Local transform.
     */
    /** Returns the translation (position) of this Node in local space. */
    getTranslation() {
      return this.get("translation");
    }
    /** Returns the rotation (quaternion) of this Node in local space. */
    getRotation() {
      return this.get("rotation");
    }
    /** Returns the scale of this Node in local space. */
    getScale() {
      return this.get("scale");
    }
    /** Sets the translation (position) of this Node in local space. */
    setTranslation(translation) {
      return this.set("translation", translation);
    }
    /** Sets the rotation (quaternion) of this Node in local space. */
    setRotation(rotation) {
      return this.set("rotation", rotation);
    }
    /** Sets the scale of this Node in local space. */
    setScale(scale) {
      return this.set("scale", scale);
    }
    /** Returns the local matrix of this Node. */
    getMatrix() {
      return MathUtils.compose(this.get("translation"), this.get("rotation"), this.get("scale"), []);
    }
    /** Sets the local matrix of this Node. Matrix will be decomposed to TRS properties. */
    setMatrix(matrix) {
      const translation = this.get("translation").slice();
      const rotation = this.get("rotation").slice();
      const scale = this.get("scale").slice();
      MathUtils.decompose(matrix, translation, rotation, scale);
      return this.set("translation", translation).set("rotation", rotation).set("scale", scale);
    }
    /**********************************************************************************************
     * World transform.
     */
    /** Returns the translation (position) of this Node in world space. */
    getWorldTranslation() {
      const t = [0, 0, 0];
      MathUtils.decompose(this.getWorldMatrix(), t, [0, 0, 0, 1], [1, 1, 1]);
      return t;
    }
    /** Returns the rotation (quaternion) of this Node in world space. */
    getWorldRotation() {
      const r = [0, 0, 0, 1];
      MathUtils.decompose(this.getWorldMatrix(), [0, 0, 0], r, [1, 1, 1]);
      return r;
    }
    /** Returns the scale of this Node in world space. */
    getWorldScale() {
      const s = [1, 1, 1];
      MathUtils.decompose(this.getWorldMatrix(), [0, 0, 0], [0, 0, 0, 1], s);
      return s;
    }
    /** Returns the world matrix of this Node. */
    getWorldMatrix() {
      const ancestors = [];
      for (let node = this; node != null; node = node.getParentNode()) {
        ancestors.push(node);
      }
      let ancestor;
      const worldMatrix = ancestors.pop().getMatrix();
      while (ancestor = ancestors.pop()) {
        multiply(worldMatrix, worldMatrix, ancestor.getMatrix());
      }
      return worldMatrix;
    }
    /**********************************************************************************************
     * Scene hierarchy.
     */
    /**
     * Adds the given Node as a child of this Node.
     *
     * Requirements:
     *
     * 1. Nodes MAY be root children of multiple {@link Scene Scenes}
     * 2. Nodes MUST NOT be children of >1 Node
     * 3. Nodes MUST NOT be children of both Nodes and {@link Scene Scenes}
     *
     * The `addChild` method enforces these restrictions automatically, and will
     * remove the new child from previous parents where needed. This behavior
     * may change in future major releases of the library.
     */
    addChild(child) {
      const parentNode = child.getParentNode();
      if (parentNode) parentNode.removeChild(child);
      for (const parent of child.listParents()) {
        if (parent.propertyType === PropertyType.SCENE) {
          parent.removeChild(child);
        }
      }
      return this.addRef("children", child);
    }
    /** Removes a Node from this Node's child Node list. */
    removeChild(child) {
      return this.removeRef("children", child);
    }
    /** Lists all child Nodes of this Node. */
    listChildren() {
      return this.listRefs("children");
    }
    /**
     * Returns the Node's unique parent Node within the scene graph. If the
     * Node has no parents, or is a direct child of the {@link Scene}
     * ("root node"), this method returns null.
     *
     * Unrelated to {@link Property.listParents}, which lists all resource
     * references from properties of any type ({@link Skin}, {@link Root}, ...).
     */
    getParentNode() {
      for (const parent of this.listParents()) {
        if (parent.propertyType === PropertyType.NODE) {
          return parent;
        }
      }
      return null;
    }
    /**********************************************************************************************
     * Attachments.
     */
    /** Returns the {@link Mesh}, if any, instantiated at this Node. */
    getMesh() {
      return this.getRef("mesh");
    }
    /**
     * Sets a {@link Mesh} to be instantiated at this Node. A single mesh may be instantiated by
     * multiple Nodes; reuse of this sort is strongly encouraged.
     */
    setMesh(mesh) {
      return this.setRef("mesh", mesh);
    }
    /** Returns the {@link Camera}, if any, instantiated at this Node. */
    getCamera() {
      return this.getRef("camera");
    }
    /** Sets a {@link Camera} to be instantiated at this Node. */
    setCamera(camera) {
      return this.setRef("camera", camera);
    }
    /** Returns the {@link Skin}, if any, instantiated at this Node. */
    getSkin() {
      return this.getRef("skin");
    }
    /** Sets a {@link Skin} to be instantiated at this Node. */
    setSkin(skin) {
      return this.setRef("skin", skin);
    }
    /**
     * Initial weights of each {@link PrimitiveTarget} for the mesh instance at this Node.
     * Most engines only support 4-8 active morph targets at a time.
     */
    getWeights() {
      return this.get("weights");
    }
    /**
     * Initial weights of each {@link PrimitiveTarget} for the mesh instance at this Node.
     * Most engines only support 4-8 active morph targets at a time.
     */
    setWeights(weights) {
      return this.set("weights", weights);
    }
    /**********************************************************************************************
     * Helpers.
     */
    /** Visits this {@link Node} and its descendants, top-down. */
    traverse(fn) {
      fn(this);
      for (const child of this.listChildren()) child.traverse(fn);
      return this;
    }
  };
  var Primitive = class _Primitive extends ExtensibleProperty {
    /**********************************************************************************************
     * Instance.
     */
    init() {
      this.propertyType = PropertyType.PRIMITIVE;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        mode: _Primitive.Mode.TRIANGLES,
        material: null,
        indices: null,
        attributes: new RefMap(),
        targets: new RefSet()
      });
    }
    /**********************************************************************************************
     * Primitive data.
     */
    /** Returns an {@link Accessor} with indices of vertices to be drawn. */
    getIndices() {
      return this.getRef("indices");
    }
    /**
     * Sets an {@link Accessor} with indices of vertices to be drawn. In `TRIANGLES` draw mode,
     * each set of three indices define a triangle. The front face has a counter-clockwise (CCW)
     * winding order.
     */
    setIndices(indices) {
      return this.setRef("indices", indices, {
        usage: BufferViewUsage$1.ELEMENT_ARRAY_BUFFER
      });
    }
    /** Returns a vertex attribute as an {@link Accessor}. */
    getAttribute(semantic) {
      return this.getRefMap("attributes", semantic);
    }
    /**
     * Sets a vertex attribute to an {@link Accessor}. All attributes must have the same vertex
     * count.
     */
    setAttribute(semantic, accessor) {
      return this.setRefMap("attributes", semantic, accessor, {
        usage: BufferViewUsage$1.ARRAY_BUFFER
      });
    }
    /**
     * Lists all vertex attribute {@link Accessor}s associated with the primitive, excluding any
     * attributes used for morph targets. For example, `[positionAccessor, normalAccessor,
     * uvAccessor]`. Order will be consistent with the order returned by {@link .listSemantics}().
     */
    listAttributes() {
      return this.listRefMapValues("attributes");
    }
    /**
     * Lists all vertex attribute semantics associated with the primitive, excluding any semantics
     * used for morph targets. For example, `['POSITION', 'NORMAL', 'TEXCOORD_0']`. Order will be
     * consistent with the order returned by {@link .listAttributes}().
     */
    listSemantics() {
      return this.listRefMapKeys("attributes");
    }
    /** Returns the material used to render the primitive. */
    getMaterial() {
      return this.getRef("material");
    }
    /** Sets the material used to render the primitive. */
    setMaterial(material) {
      return this.setRef("material", material);
    }
    /**********************************************************************************************
     * Mode.
     */
    /**
     * Returns the GPU draw mode (`TRIANGLES`, `LINES`, `POINTS`...) as a WebGL enum value.
     *
     * Reference:
     * - [glTF → `primitive.mode`](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#primitivemode)
     */
    getMode() {
      return this.get("mode");
    }
    /**
     * Sets the GPU draw mode (`TRIANGLES`, `LINES`, `POINTS`...) as a WebGL enum value.
     *
     * Reference:
     * - [glTF → `primitive.mode`](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#primitivemode)
     */
    setMode(mode) {
      return this.set("mode", mode);
    }
    /**********************************************************************************************
     * Morph targets.
     */
    /** Lists all morph targets associated with the primitive. */
    listTargets() {
      return this.listRefs("targets");
    }
    /**
     * Adds a morph target to the primitive. All primitives in the same mesh must have the same
     * number of targets.
     */
    addTarget(target) {
      return this.addRef("targets", target);
    }
    /**
     * Removes a morph target from the primitive. All primitives in the same mesh must have the same
     * number of targets.
     */
    removeTarget(target) {
      return this.removeRef("targets", target);
    }
  };
  Primitive.Mode = {
    /**
     * Each vertex defines a single point primitive.
     * Sequence: {0}, {1}, {2}, ... {i}
     */
    POINTS: 0,
    /**
     * Each consecutive pair of vertices defines a single line primitive.
     * Sequence: {0,1}, {2,3}, {4,5}, ... {i, i+1}
     */
    LINES: 1,
    /**
     * Each vertex is connected to the next, and the last vertex is connected to the first,
     * forming a closed loop of line primitives.
     * Sequence: {0,1}, {1,2}, {2,3}, ... {i, i+1}, {n–1, 0}
     *
     * @deprecated See {@link https://github.com/KhronosGroup/glTF/issues/1883 KhronosGroup/glTF#1883}.
     */
    LINE_LOOP: 2,
    /**
     * Each vertex is connected to the next, forming a contiguous series of line primitives.
     * Sequence: {0,1}, {1,2}, {2,3}, ... {i, i+1}
     */
    LINE_STRIP: 3,
    /**
     * Each consecutive set of three vertices defines a single triangle primitive.
     * Sequence: {0,1,2}, {3,4,5}, {6,7,8}, ... {i, i+1, i+2}
     */
    TRIANGLES: 4,
    /**
     * Each vertex defines one triangle primitive, using the two vertices that follow it.
     * Sequence: {0,1,2}, {1,3,2}, {2,3,4}, ... {i, i+(1+i%2), i+(2–i%2)}
     */
    TRIANGLE_STRIP: 5,
    /**
     * Each consecutive pair of vertices defines a triangle primitive sharing a common vertex at index 0.
     * Sequence: {1,2,0}, {2,3,0}, {3,4,0}, ... {i, i+1, 0}
     *
     * @deprecated See {@link https://github.com/KhronosGroup/glTF/issues/1883 KhronosGroup/glTF#1883}.
     */
    TRIANGLE_FAN: 6
  };
  var PrimitiveTarget = class extends Property {
    init() {
      this.propertyType = PropertyType.PRIMITIVE_TARGET;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        attributes: new RefMap()
      });
    }
    /** Returns a morph target vertex attribute as an {@link Accessor}. */
    getAttribute(semantic) {
      return this.getRefMap("attributes", semantic);
    }
    /**
     * Sets a morph target vertex attribute to an {@link Accessor}.
     */
    setAttribute(semantic, accessor) {
      return this.setRefMap("attributes", semantic, accessor, {
        usage: BufferViewUsage$1.ARRAY_BUFFER
      });
    }
    /**
     * Lists all morph target vertex attribute {@link Accessor}s associated. Order will be
     * consistent with the order returned by {@link .listSemantics}().
     */
    listAttributes() {
      return this.listRefMapValues("attributes");
    }
    /**
     * Lists all morph target vertex attribute semantics associated. Order will be
     * consistent with the order returned by {@link .listAttributes}().
     */
    listSemantics() {
      return this.listRefMapKeys("attributes");
    }
  };
  function _extends() {
    return _extends = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends.apply(null, arguments);
  }
  var Scene = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.SCENE;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        children: new RefSet()
      });
    }
    copy(other, resolve = COPY_IDENTITY) {
      if (resolve === COPY_IDENTITY) throw new Error("Scene cannot be copied.");
      return super.copy(other, resolve);
    }
    /**
     * Adds a {@link Node} to the Scene.
     *
     * Requirements:
     *
     * 1. Nodes MAY be root children of multiple {@link Scene Scenes}
     * 2. Nodes MUST NOT be children of >1 Node
     * 3. Nodes MUST NOT be children of both Nodes and {@link Scene Scenes}
     *
     * The `addChild` method enforces these restrictions automatically, and will
     * remove the new child from previous parents where needed. This behavior
     * may change in future major releases of the library.
     */
    addChild(node) {
      const parentNode = node.getParentNode();
      if (parentNode) parentNode.removeChild(node);
      return this.addRef("children", node);
    }
    /** Removes a {@link Node} from the Scene. */
    removeChild(node) {
      return this.removeRef("children", node);
    }
    /**
     * Lists all direct child {@link Node Nodes} in the Scene. Indirect
     * descendants (children of children) are not returned, but may be
     * reached recursively or with {@link Scene.traverse} instead.
     */
    listChildren() {
      return this.listRefs("children");
    }
    /** Visits each {@link Node} in the Scene, including descendants, top-down. */
    traverse(fn) {
      for (const node of this.listChildren()) node.traverse(fn);
      return this;
    }
  };
  var Skin = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.SKIN;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        skeleton: null,
        inverseBindMatrices: null,
        joints: new RefSet()
      });
    }
    /**
     * {@link Node} used as a skeleton root. The node must be the closest common root of the joints
     * hierarchy or a direct or indirect parent node of the closest common root.
     */
    getSkeleton() {
      return this.getRef("skeleton");
    }
    /**
     * {@link Node} used as a skeleton root. The node must be the closest common root of the joints
     * hierarchy or a direct or indirect parent node of the closest common root.
     */
    setSkeleton(skeleton) {
      return this.setRef("skeleton", skeleton);
    }
    /**
     * {@link Accessor} containing the floating-point 4x4 inverse-bind matrices. The default is
     * that each matrix is a 4x4 identity matrix, which implies that inverse-bind matrices were
     * pre-applied.
     */
    getInverseBindMatrices() {
      return this.getRef("inverseBindMatrices");
    }
    /**
     * {@link Accessor} containing the floating-point 4x4 inverse-bind matrices. The default is
     * that each matrix is a 4x4 identity matrix, which implies that inverse-bind matrices were
     * pre-applied.
     */
    setInverseBindMatrices(inverseBindMatrices) {
      return this.setRef("inverseBindMatrices", inverseBindMatrices, {
        usage: BufferViewUsage$1.INVERSE_BIND_MATRICES
      });
    }
    /** Adds a joint {@link Node} to this {@link Skin}. */
    addJoint(joint) {
      return this.addRef("joints", joint);
    }
    /** Removes a joint {@link Node} from this {@link Skin}. */
    removeJoint(joint) {
      return this.removeRef("joints", joint);
    }
    /** Lists joints ({@link Node}s used as joints or bones) in this {@link Skin}. */
    listJoints() {
      return this.listRefs("joints");
    }
  };
  var Texture = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.TEXTURE;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        image: null,
        mimeType: "",
        uri: ""
      });
    }
    /**********************************************************************************************
     * MIME type / format.
     */
    /** Returns the MIME type for this texture ('image/jpeg' or 'image/png'). */
    getMimeType() {
      return this.get("mimeType") || ImageUtils.extensionToMimeType(FileUtils.extension(this.get("uri")));
    }
    /**
     * Sets the MIME type for this texture ('image/jpeg' or 'image/png'). If the texture does not
     * have a URI, a MIME type is required for correct export.
     */
    setMimeType(mimeType) {
      return this.set("mimeType", mimeType);
    }
    /**********************************************************************************************
     * URI / filename.
     */
    /** Returns the URI (e.g. 'path/to/file.png') for this texture. */
    getURI() {
      return this.get("uri");
    }
    /**
     * Sets the URI (e.g. 'path/to/file.png') for this texture. If the texture does not have a MIME
     * type, a URI is required for correct export.
     */
    setURI(uri) {
      this.set("uri", uri);
      const mimeType = ImageUtils.extensionToMimeType(FileUtils.extension(uri));
      if (mimeType) this.set("mimeType", mimeType);
      return this;
    }
    /**********************************************************************************************
     * Image data.
     */
    /** Returns the raw image data for this texture. */
    getImage() {
      return this.get("image");
    }
    /** Sets the raw image data for this texture. */
    setImage(image) {
      return this.set("image", BufferUtils.assertView(image));
    }
    /** Returns the size, in pixels, of this texture. */
    getSize() {
      const image = this.get("image");
      if (!image) return null;
      return ImageUtils.getSize(image, this.getMimeType());
    }
  };
  var Root = class extends ExtensibleProperty {
    init() {
      this.propertyType = PropertyType.ROOT;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        asset: {
          generator: `glTF-Transform ${VERSION}`,
          version: "2.0"
        },
        defaultScene: null,
        accessors: new RefSet(),
        animations: new RefSet(),
        buffers: new RefSet(),
        cameras: new RefSet(),
        materials: new RefSet(),
        meshes: new RefSet(),
        nodes: new RefSet(),
        scenes: new RefSet(),
        skins: new RefSet(),
        textures: new RefSet()
      });
    }
    /** @internal */
    constructor(graph) {
      super(graph);
      this._extensions = /* @__PURE__ */ new Set();
      graph.addEventListener("node:create", (event) => {
        this._addChildOfRoot(event.target);
      });
    }
    clone() {
      throw new Error("Root cannot be cloned.");
    }
    copy(other, resolve = COPY_IDENTITY) {
      if (resolve === COPY_IDENTITY) throw new Error("Root cannot be copied.");
      this.set("asset", _extends({}, other.get("asset")));
      this.setName(other.getName());
      this.setExtras(_extends({}, other.getExtras()));
      this.setDefaultScene(other.getDefaultScene() ? resolve(other.getDefaultScene()) : null);
      for (const extensionName of other.listRefMapKeys("extensions")) {
        const otherExtension = other.getExtension(extensionName);
        this.setExtension(extensionName, resolve(otherExtension));
      }
      return this;
    }
    _addChildOfRoot(child) {
      if (child instanceof Scene) {
        this.addRef("scenes", child);
      } else if (child instanceof Node) {
        this.addRef("nodes", child);
      } else if (child instanceof Camera) {
        this.addRef("cameras", child);
      } else if (child instanceof Skin) {
        this.addRef("skins", child);
      } else if (child instanceof Mesh) {
        this.addRef("meshes", child);
      } else if (child instanceof Material) {
        this.addRef("materials", child);
      } else if (child instanceof Texture) {
        this.addRef("textures", child);
      } else if (child instanceof Animation) {
        this.addRef("animations", child);
      } else if (child instanceof Accessor) {
        this.addRef("accessors", child);
      } else if (child instanceof Buffer$1) {
        this.addRef("buffers", child);
      }
      return this;
    }
    /**
     * Returns the `asset` object, which specifies the target glTF version of the asset. Additional
     * metadata can be stored in optional properties such as `generator` or `copyright`.
     *
     * Reference: [glTF → Asset](https://github.com/KhronosGroup/gltf/blob/main/specification/2.0/README.md#asset)
     */
    getAsset() {
      return this.get("asset");
    }
    /**********************************************************************************************
     * Extensions.
     */
    /** Lists all {@link Extension Extensions} enabled for this root. */
    listExtensionsUsed() {
      return Array.from(this._extensions);
    }
    /** Lists all {@link Extension Extensions} enabled and required for this root. */
    listExtensionsRequired() {
      return this.listExtensionsUsed().filter((extension) => extension.isRequired());
    }
    /** @internal */
    _enableExtension(extension) {
      this._extensions.add(extension);
      return this;
    }
    /** @internal */
    _disableExtension(extension) {
      this._extensions.delete(extension);
      return this;
    }
    /**********************************************************************************************
     * Properties.
     */
    /** Lists all {@link Scene} properties associated with this root. */
    listScenes() {
      return this.listRefs("scenes");
    }
    /** Default {@link Scene} associated with this root. */
    setDefaultScene(defaultScene) {
      return this.setRef("defaultScene", defaultScene);
    }
    /** Default {@link Scene} associated with this root. */
    getDefaultScene() {
      return this.getRef("defaultScene");
    }
    /** Lists all {@link Node} properties associated with this root. */
    listNodes() {
      return this.listRefs("nodes");
    }
    /** Lists all {@link Camera} properties associated with this root. */
    listCameras() {
      return this.listRefs("cameras");
    }
    /** Lists all {@link Skin} properties associated with this root. */
    listSkins() {
      return this.listRefs("skins");
    }
    /** Lists all {@link Mesh} properties associated with this root. */
    listMeshes() {
      return this.listRefs("meshes");
    }
    /** Lists all {@link Material} properties associated with this root. */
    listMaterials() {
      return this.listRefs("materials");
    }
    /** Lists all {@link Texture} properties associated with this root. */
    listTextures() {
      return this.listRefs("textures");
    }
    /** Lists all {@link Animation} properties associated with this root. */
    listAnimations() {
      return this.listRefs("animations");
    }
    /** Lists all {@link Accessor} properties associated with this root. */
    listAccessors() {
      return this.listRefs("accessors");
    }
    /** Lists all {@link Buffer} properties associated with this root. */
    listBuffers() {
      return this.listRefs("buffers");
    }
  };
  var Document = class _Document {
    /**
     * Returns the Document associated with a given Graph, if any.
     * @hidden
     * @experimental
     */
    static fromGraph(graph) {
      return _Document._GRAPH_DOCUMENTS.get(graph) || null;
    }
    /** Creates a new Document, representing an empty glTF asset. */
    constructor() {
      this._graph = new Graph();
      this._root = new Root(this._graph);
      this._logger = Logger.DEFAULT_INSTANCE;
      _Document._GRAPH_DOCUMENTS.set(this._graph, this);
    }
    /** Returns the glTF {@link Root} property. */
    getRoot() {
      return this._root;
    }
    /**
     * Returns the {@link Graph} representing connectivity of resources within this document.
     * @hidden
     */
    getGraph() {
      return this._graph;
    }
    /** Returns the {@link Logger} instance used for any operations performed on this document. */
    getLogger() {
      return this._logger;
    }
    /**
     * Overrides the {@link Logger} instance used for any operations performed on this document.
     *
     * Usage:
     *
     * ```ts
     * doc
     * 	.setLogger(new Logger(Logger.Verbosity.SILENT))
     * 	.transform(dedup(), weld());
     * ```
     */
    setLogger(logger) {
      this._logger = logger;
      return this;
    }
    /**
     * Clones this Document, copying all resources within it.
     * @deprecated Use 'cloneDocument(document)' from '@gltf-transform/functions'.
     * @hidden
     * @internal
     */
    clone() {
      throw new Error(`Use 'cloneDocument(source)' from '@gltf-transform/functions'.`);
    }
    /**
     * Merges the content of another Document into this one, without affecting the original.
     * @deprecated Use 'mergeDocuments(target, source)' from '@gltf-transform/functions'.
     * @hidden
     * @internal
     */
    merge(_other) {
      throw new Error(`Use 'mergeDocuments(target, source)' from '@gltf-transform/functions'.`);
    }
    /**
     * Applies a series of modifications to this document. Each transformation is asynchronous,
     * takes the {@link Document} as input, and returns nothing. Transforms are applied in the
     * order given, which may affect the final result.
     *
     * Usage:
     *
     * ```ts
     * await doc.transform(
     * 	dedup(),
     * 	prune()
     * );
     * ```
     *
     * @param transforms List of synchronous transformation functions to apply.
     */
    async transform(...transforms) {
      const stack = transforms.map((fn) => fn.name);
      for (const transform of transforms) {
        await transform(this, {
          stack
        });
      }
      return this;
    }
    /**********************************************************************************************
     * Extension factory methods.
     */
    /**
     * Creates a new {@link Extension}, for the extension type of the given constructor. If the
     * extension is already enabled for this Document, the previous Extension reference is reused.
     */
    createExtension(ctor) {
      const extensionName = ctor.EXTENSION_NAME;
      const prevExtension = this.getRoot().listExtensionsUsed().find((ext) => ext.extensionName === extensionName);
      return prevExtension || new ctor(this);
    }
    /**
     * Disables and removes an {@link Extension} from the Document. If no Extension exists with
     * the given name, this method has no effect.
     */
    disposeExtension(extensionName) {
      const extension = this.getRoot().listExtensionsUsed().find((ext) => ext.extensionName === extensionName);
      if (extension) extension.dispose();
    }
    /**********************************************************************************************
     * Property factory methods.
     */
    /** Creates a new {@link Scene} attached to this document's {@link Root}. */
    createScene(name = "") {
      return new Scene(this._graph, name);
    }
    /** Creates a new {@link Node} attached to this document's {@link Root}. */
    createNode(name = "") {
      return new Node(this._graph, name);
    }
    /** Creates a new {@link Camera} attached to this document's {@link Root}. */
    createCamera(name = "") {
      return new Camera(this._graph, name);
    }
    /** Creates a new {@link Skin} attached to this document's {@link Root}. */
    createSkin(name = "") {
      return new Skin(this._graph, name);
    }
    /** Creates a new {@link Mesh} attached to this document's {@link Root}. */
    createMesh(name = "") {
      return new Mesh(this._graph, name);
    }
    /**
     * Creates a new {@link Primitive}. Primitives must be attached to a {@link Mesh}
     * for use and export; they are not otherwise associated with a {@link Root}.
     */
    createPrimitive() {
      return new Primitive(this._graph);
    }
    /**
     * Creates a new {@link PrimitiveTarget}, or morph target. Targets must be attached to a
     * {@link Primitive} for use and export; they are not otherwise associated with a {@link Root}.
     */
    createPrimitiveTarget(name = "") {
      return new PrimitiveTarget(this._graph, name);
    }
    /** Creates a new {@link Material} attached to this document's {@link Root}. */
    createMaterial(name = "") {
      return new Material(this._graph, name);
    }
    /** Creates a new {@link Texture} attached to this document's {@link Root}. */
    createTexture(name = "") {
      return new Texture(this._graph, name);
    }
    /** Creates a new {@link Animation} attached to this document's {@link Root}. */
    createAnimation(name = "") {
      return new Animation(this._graph, name);
    }
    /**
     * Creates a new {@link AnimationChannel}. Channels must be attached to an {@link Animation}
     * for use and export; they are not otherwise associated with a {@link Root}.
     */
    createAnimationChannel(name = "") {
      return new AnimationChannel(this._graph, name);
    }
    /**
     * Creates a new {@link AnimationSampler}. Samplers must be attached to an {@link Animation}
     * for use and export; they are not otherwise associated with a {@link Root}.
     */
    createAnimationSampler(name = "") {
      return new AnimationSampler(this._graph, name);
    }
    /** Creates a new {@link Accessor} attached to this document's {@link Root}. */
    createAccessor(name = "", buffer = null) {
      if (!buffer) {
        buffer = this.getRoot().listBuffers()[0];
      }
      return new Accessor(this._graph, name).setBuffer(buffer);
    }
    /** Creates a new {@link Buffer} attached to this document's {@link Root}. */
    createBuffer(name = "") {
      return new Buffer$1(this._graph, name);
    }
  };
  Document._GRAPH_DOCUMENTS = /* @__PURE__ */ new WeakMap();
  var Extension = class {
    /** @hidden */
    constructor(document2) {
      this.extensionName = "";
      this.prereadTypes = [];
      this.prewriteTypes = [];
      this.readDependencies = [];
      this.writeDependencies = [];
      this.document = void 0;
      this.required = false;
      this.properties = /* @__PURE__ */ new Set();
      this._listener = void 0;
      this.document = document2;
      document2.getRoot()._enableExtension(this);
      this._listener = (_event) => {
        const event = _event;
        const target = event.target;
        if (target instanceof ExtensionProperty && target.extensionName === this.extensionName) {
          if (event.type === "node:create") this._addExtensionProperty(target);
          if (event.type === "node:dispose") this._removeExtensionProperty(target);
        }
      };
      const graph = document2.getGraph();
      graph.addEventListener("node:create", this._listener);
      graph.addEventListener("node:dispose", this._listener);
    }
    /** Disables and removes the extension from the Document. */
    dispose() {
      this.document.getRoot()._disableExtension(this);
      const graph = this.document.getGraph();
      graph.removeEventListener("node:create", this._listener);
      graph.removeEventListener("node:dispose", this._listener);
      for (const property of this.properties) {
        property.dispose();
      }
    }
    /** @hidden Performs first-time setup for the extension. Must be idempotent. */
    static register() {
    }
    /**
     * Indicates to the client whether it is OK to load the asset when this extension is not
     * recognized. Optional extensions are generally preferred, if there is not a good reason
     * to require a client to completely fail when an extension isn't known.
     */
    isRequired() {
      return this.required;
    }
    /**
     * Indicates to the client whether it is OK to load the asset when this extension is not
     * recognized. Optional extensions are generally preferred, if there is not a good reason
     * to require a client to completely fail when an extension isn't known.
     */
    setRequired(required) {
      this.required = required;
      return this;
    }
    /**
     * Lists all {@link ExtensionProperty} instances associated with, or created by, this
     * extension. Includes only instances that are attached to the Document's graph; detached
     * instances will be excluded.
     */
    listProperties() {
      return Array.from(this.properties);
    }
    /**********************************************************************************************
     * ExtensionProperty management.
     */
    /** @internal */
    _addExtensionProperty(property) {
      this.properties.add(property);
      return this;
    }
    /** @internal */
    _removeExtensionProperty(property) {
      this.properties.delete(property);
      return this;
    }
    /**********************************************************************************************
     * I/O implementation.
     */
    /** @hidden Installs dependencies required by the extension. */
    install(_key, _dependency) {
      return this;
    }
    /**
     * Used by the {@link PlatformIO} utilities when reading a glTF asset. This method may
     * optionally be implemented by an extension, and should then support any property type
     * declared by the Extension's {@link Extension.prereadTypes} list. The Extension will
     * be given a ReaderContext instance, and is expected to update either the context or its
     * {@link JSONDocument} with resources known to the Extension. *Most extensions don't need to
     * implement this.*
     * @hidden
     */
    preread(_readerContext, _propertyType) {
      return this;
    }
    /**
     * Used by the {@link PlatformIO} utilities when writing a glTF asset. This method may
     * optionally be implemented by an extension, and should then support any property type
     * declared by the Extension's {@link Extension.prewriteTypes} list. The Extension will
     * be given a WriterContext instance, and is expected to update either the context or its
     * {@link JSONDocument} with resources known to the Extension. *Most extensions don't need to
     * implement this.*
     * @hidden
     */
    prewrite(_writerContext, _propertyType) {
      return this;
    }
  };
  Extension.EXTENSION_NAME = void 0;
  var ReaderContext = class {
    constructor(jsonDoc) {
      this.jsonDoc = void 0;
      this.buffers = [];
      this.bufferViews = [];
      this.bufferViewBuffers = [];
      this.accessors = [];
      this.textures = [];
      this.textureInfos = /* @__PURE__ */ new Map();
      this.materials = [];
      this.meshes = [];
      this.cameras = [];
      this.nodes = [];
      this.skins = [];
      this.animations = [];
      this.scenes = [];
      this.jsonDoc = jsonDoc;
    }
    setTextureInfo(textureInfo, textureInfoDef) {
      this.textureInfos.set(textureInfo, textureInfoDef);
      if (textureInfoDef.texCoord !== void 0) {
        textureInfo.setTexCoord(textureInfoDef.texCoord);
      }
      if (textureInfoDef.extras !== void 0) {
        textureInfo.setExtras(textureInfoDef.extras);
      }
      const textureDef = this.jsonDoc.json.textures[textureInfoDef.index];
      if (textureDef.sampler === void 0) return;
      const samplerDef = this.jsonDoc.json.samplers[textureDef.sampler];
      if (samplerDef.magFilter !== void 0) {
        textureInfo.setMagFilter(samplerDef.magFilter);
      }
      if (samplerDef.minFilter !== void 0) {
        textureInfo.setMinFilter(samplerDef.minFilter);
      }
      if (samplerDef.wrapS !== void 0) {
        textureInfo.setWrapS(samplerDef.wrapS);
      }
      if (samplerDef.wrapT !== void 0) {
        textureInfo.setWrapT(samplerDef.wrapT);
      }
    }
  };
  var DEFAULT_OPTIONS = {
    logger: Logger.DEFAULT_INSTANCE,
    extensions: [],
    dependencies: {}
  };
  var SUPPORTED_PREREAD_TYPES = /* @__PURE__ */ new Set([PropertyType.BUFFER, PropertyType.TEXTURE, PropertyType.MATERIAL, PropertyType.MESH, PropertyType.PRIMITIVE, PropertyType.NODE, PropertyType.SCENE]);
  var GLTFReader = class {
    static read(jsonDoc, _options = DEFAULT_OPTIONS) {
      const options = _extends({}, DEFAULT_OPTIONS, _options);
      const {
        json
      } = jsonDoc;
      const document2 = new Document().setLogger(options.logger);
      this.validate(jsonDoc, options);
      const context = new ReaderContext(jsonDoc);
      const assetDef = json.asset;
      const asset = document2.getRoot().getAsset();
      if (assetDef.copyright) asset.copyright = assetDef.copyright;
      if (assetDef.extras) asset.extras = assetDef.extras;
      if (json.extras !== void 0) {
        document2.getRoot().setExtras(_extends({}, json.extras));
      }
      const extensionsUsed = json.extensionsUsed || [];
      const extensionsRequired = json.extensionsRequired || [];
      options.extensions.sort((a, b) => a.EXTENSION_NAME > b.EXTENSION_NAME ? 1 : -1);
      for (const Extension2 of options.extensions) {
        if (extensionsUsed.includes(Extension2.EXTENSION_NAME)) {
          const extension = document2.createExtension(Extension2).setRequired(extensionsRequired.includes(Extension2.EXTENSION_NAME));
          const unsupportedHooks = extension.prereadTypes.filter((type) => !SUPPORTED_PREREAD_TYPES.has(type));
          if (unsupportedHooks.length) {
            options.logger.warn(`Preread hooks for some types (${unsupportedHooks.join()}), requested by extension ${extension.extensionName}, are unsupported. Please file an issue or a PR.`);
          }
          for (const key of extension.readDependencies) {
            extension.install(key, options.dependencies[key]);
          }
        }
      }
      const bufferDefs = json.buffers || [];
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.BUFFER)).forEach((extension) => extension.preread(context, PropertyType.BUFFER));
      context.buffers = bufferDefs.map((bufferDef) => {
        const buffer = document2.createBuffer(bufferDef.name);
        if (bufferDef.extras) buffer.setExtras(bufferDef.extras);
        if (bufferDef.uri && bufferDef.uri.indexOf("__") !== 0) {
          buffer.setURI(bufferDef.uri);
        }
        return buffer;
      });
      const bufferViewDefs = json.bufferViews || [];
      context.bufferViewBuffers = bufferViewDefs.map((bufferViewDef, index) => {
        if (!context.bufferViews[index]) {
          const bufferDef = jsonDoc.json.buffers[bufferViewDef.buffer];
          const bufferData = bufferDef.uri ? jsonDoc.resources[bufferDef.uri] : jsonDoc.resources[GLB_BUFFER];
          const byteOffset = bufferViewDef.byteOffset || 0;
          context.bufferViews[index] = BufferUtils.toView(bufferData, byteOffset, bufferViewDef.byteLength);
        }
        return context.buffers[bufferViewDef.buffer];
      });
      const accessorDefs = json.accessors || [];
      context.accessors = accessorDefs.map((accessorDef) => {
        const buffer = context.bufferViewBuffers[accessorDef.bufferView];
        const accessor = document2.createAccessor(accessorDef.name, buffer).setType(accessorDef.type);
        if (accessorDef.extras) accessor.setExtras(accessorDef.extras);
        if (accessorDef.normalized !== void 0) {
          accessor.setNormalized(accessorDef.normalized);
        }
        if (accessorDef.bufferView === void 0) return accessor;
        accessor.setArray(getAccessorArray(accessorDef, context));
        return accessor;
      });
      const imageDefs = json.images || [];
      const textureDefs = json.textures || [];
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.TEXTURE)).forEach((extension) => extension.preread(context, PropertyType.TEXTURE));
      context.textures = imageDefs.map((imageDef) => {
        const texture = document2.createTexture(imageDef.name);
        if (imageDef.extras) texture.setExtras(imageDef.extras);
        if (imageDef.bufferView !== void 0) {
          const bufferViewDef = json.bufferViews[imageDef.bufferView];
          const bufferDef = jsonDoc.json.buffers[bufferViewDef.buffer];
          const bufferData = bufferDef.uri ? jsonDoc.resources[bufferDef.uri] : jsonDoc.resources[GLB_BUFFER];
          const byteOffset = bufferViewDef.byteOffset || 0;
          const byteLength = bufferViewDef.byteLength;
          const imageData = bufferData.slice(byteOffset, byteOffset + byteLength);
          texture.setImage(imageData);
        } else if (imageDef.uri !== void 0) {
          texture.setImage(jsonDoc.resources[imageDef.uri]);
          if (imageDef.uri.indexOf("__") !== 0) {
            texture.setURI(imageDef.uri);
          }
        }
        if (imageDef.mimeType !== void 0) {
          texture.setMimeType(imageDef.mimeType);
        } else if (imageDef.uri) {
          const extension = FileUtils.extension(imageDef.uri);
          texture.setMimeType(ImageUtils.extensionToMimeType(extension));
        }
        return texture;
      });
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.MATERIAL)).forEach((extension) => extension.preread(context, PropertyType.MATERIAL));
      const materialDefs = json.materials || [];
      context.materials = materialDefs.map((materialDef) => {
        const material = document2.createMaterial(materialDef.name);
        if (materialDef.extras) material.setExtras(materialDef.extras);
        if (materialDef.alphaMode !== void 0) {
          material.setAlphaMode(materialDef.alphaMode);
        }
        if (materialDef.alphaCutoff !== void 0) {
          material.setAlphaCutoff(materialDef.alphaCutoff);
        }
        if (materialDef.doubleSided !== void 0) {
          material.setDoubleSided(materialDef.doubleSided);
        }
        const pbrDef = materialDef.pbrMetallicRoughness || {};
        if (pbrDef.baseColorFactor !== void 0) {
          material.setBaseColorFactor(pbrDef.baseColorFactor);
        }
        if (materialDef.emissiveFactor !== void 0) {
          material.setEmissiveFactor(materialDef.emissiveFactor);
        }
        if (pbrDef.metallicFactor !== void 0) {
          material.setMetallicFactor(pbrDef.metallicFactor);
        }
        if (pbrDef.roughnessFactor !== void 0) {
          material.setRoughnessFactor(pbrDef.roughnessFactor);
        }
        if (pbrDef.baseColorTexture !== void 0) {
          const textureInfoDef = pbrDef.baseColorTexture;
          const texture = context.textures[textureDefs[textureInfoDef.index].source];
          material.setBaseColorTexture(texture);
          context.setTextureInfo(material.getBaseColorTextureInfo(), textureInfoDef);
        }
        if (materialDef.emissiveTexture !== void 0) {
          const textureInfoDef = materialDef.emissiveTexture;
          const texture = context.textures[textureDefs[textureInfoDef.index].source];
          material.setEmissiveTexture(texture);
          context.setTextureInfo(material.getEmissiveTextureInfo(), textureInfoDef);
        }
        if (materialDef.normalTexture !== void 0) {
          const textureInfoDef = materialDef.normalTexture;
          const texture = context.textures[textureDefs[textureInfoDef.index].source];
          material.setNormalTexture(texture);
          context.setTextureInfo(material.getNormalTextureInfo(), textureInfoDef);
          if (materialDef.normalTexture.scale !== void 0) {
            material.setNormalScale(materialDef.normalTexture.scale);
          }
        }
        if (materialDef.occlusionTexture !== void 0) {
          const textureInfoDef = materialDef.occlusionTexture;
          const texture = context.textures[textureDefs[textureInfoDef.index].source];
          material.setOcclusionTexture(texture);
          context.setTextureInfo(material.getOcclusionTextureInfo(), textureInfoDef);
          if (materialDef.occlusionTexture.strength !== void 0) {
            material.setOcclusionStrength(materialDef.occlusionTexture.strength);
          }
        }
        if (pbrDef.metallicRoughnessTexture !== void 0) {
          const textureInfoDef = pbrDef.metallicRoughnessTexture;
          const texture = context.textures[textureDefs[textureInfoDef.index].source];
          material.setMetallicRoughnessTexture(texture);
          context.setTextureInfo(material.getMetallicRoughnessTextureInfo(), textureInfoDef);
        }
        return material;
      });
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.MESH)).forEach((extension) => extension.preread(context, PropertyType.MESH));
      const meshDefs = json.meshes || [];
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.PRIMITIVE)).forEach((extension) => extension.preread(context, PropertyType.PRIMITIVE));
      context.meshes = meshDefs.map((meshDef) => {
        const mesh = document2.createMesh(meshDef.name);
        if (meshDef.extras) mesh.setExtras(meshDef.extras);
        if (meshDef.weights !== void 0) {
          mesh.setWeights(meshDef.weights);
        }
        const primitiveDefs = meshDef.primitives || [];
        primitiveDefs.forEach((primitiveDef) => {
          const primitive = document2.createPrimitive();
          if (primitiveDef.extras) primitive.setExtras(primitiveDef.extras);
          if (primitiveDef.material !== void 0) {
            primitive.setMaterial(context.materials[primitiveDef.material]);
          }
          if (primitiveDef.mode !== void 0) {
            primitive.setMode(primitiveDef.mode);
          }
          for (const [semantic, index] of Object.entries(primitiveDef.attributes || {})) {
            primitive.setAttribute(semantic, context.accessors[index]);
          }
          if (primitiveDef.indices !== void 0) {
            primitive.setIndices(context.accessors[primitiveDef.indices]);
          }
          const targetNames = meshDef.extras && meshDef.extras.targetNames || [];
          const targetDefs = primitiveDef.targets || [];
          targetDefs.forEach((targetDef, targetIndex) => {
            const targetName = targetNames[targetIndex] || targetIndex.toString();
            const target = document2.createPrimitiveTarget(targetName);
            for (const [semantic, accessorIndex] of Object.entries(targetDef)) {
              target.setAttribute(semantic, context.accessors[accessorIndex]);
            }
            primitive.addTarget(target);
          });
          mesh.addPrimitive(primitive);
        });
        return mesh;
      });
      const cameraDefs = json.cameras || [];
      context.cameras = cameraDefs.map((cameraDef) => {
        const camera = document2.createCamera(cameraDef.name).setType(cameraDef.type);
        if (cameraDef.extras) camera.setExtras(cameraDef.extras);
        if (cameraDef.type === Camera.Type.PERSPECTIVE) {
          const perspectiveDef = cameraDef.perspective;
          camera.setYFov(perspectiveDef.yfov);
          camera.setZNear(perspectiveDef.znear);
          if (perspectiveDef.zfar !== void 0) {
            camera.setZFar(perspectiveDef.zfar);
          }
          if (perspectiveDef.aspectRatio !== void 0) {
            camera.setAspectRatio(perspectiveDef.aspectRatio);
          }
        } else {
          const orthoDef = cameraDef.orthographic;
          camera.setZNear(orthoDef.znear).setZFar(orthoDef.zfar).setXMag(orthoDef.xmag).setYMag(orthoDef.ymag);
        }
        return camera;
      });
      const nodeDefs = json.nodes || [];
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.NODE)).forEach((extension) => extension.preread(context, PropertyType.NODE));
      context.nodes = nodeDefs.map((nodeDef) => {
        const node = document2.createNode(nodeDef.name);
        if (nodeDef.extras) node.setExtras(nodeDef.extras);
        if (nodeDef.translation !== void 0) {
          node.setTranslation(nodeDef.translation);
        }
        if (nodeDef.rotation !== void 0) {
          node.setRotation(nodeDef.rotation);
        }
        if (nodeDef.scale !== void 0) {
          node.setScale(nodeDef.scale);
        }
        if (nodeDef.matrix !== void 0) {
          const translation = [0, 0, 0];
          const rotation = [0, 0, 0, 1];
          const scale = [1, 1, 1];
          MathUtils.decompose(nodeDef.matrix, translation, rotation, scale);
          node.setTranslation(translation);
          node.setRotation(rotation);
          node.setScale(scale);
        }
        if (nodeDef.weights !== void 0) {
          node.setWeights(nodeDef.weights);
        }
        return node;
      });
      const skinDefs = json.skins || [];
      context.skins = skinDefs.map((skinDef) => {
        const skin = document2.createSkin(skinDef.name);
        if (skinDef.extras) skin.setExtras(skinDef.extras);
        if (skinDef.inverseBindMatrices !== void 0) {
          skin.setInverseBindMatrices(context.accessors[skinDef.inverseBindMatrices]);
        }
        if (skinDef.skeleton !== void 0) {
          skin.setSkeleton(context.nodes[skinDef.skeleton]);
        }
        for (const nodeIndex of skinDef.joints) {
          skin.addJoint(context.nodes[nodeIndex]);
        }
        return skin;
      });
      nodeDefs.map((nodeDef, nodeIndex) => {
        const node = context.nodes[nodeIndex];
        const children = nodeDef.children || [];
        children.forEach((childIndex) => node.addChild(context.nodes[childIndex]));
        if (nodeDef.mesh !== void 0) node.setMesh(context.meshes[nodeDef.mesh]);
        if (nodeDef.camera !== void 0) node.setCamera(context.cameras[nodeDef.camera]);
        if (nodeDef.skin !== void 0) node.setSkin(context.skins[nodeDef.skin]);
      });
      const animationDefs = json.animations || [];
      context.animations = animationDefs.map((animationDef) => {
        const animation = document2.createAnimation(animationDef.name);
        if (animationDef.extras) animation.setExtras(animationDef.extras);
        const samplerDefs = animationDef.samplers || [];
        const samplers = samplerDefs.map((samplerDef) => {
          const sampler = document2.createAnimationSampler().setInput(context.accessors[samplerDef.input]).setOutput(context.accessors[samplerDef.output]).setInterpolation(samplerDef.interpolation || AnimationSampler.Interpolation.LINEAR);
          if (samplerDef.extras) sampler.setExtras(samplerDef.extras);
          animation.addSampler(sampler);
          return sampler;
        });
        const channels = animationDef.channels || [];
        channels.forEach((channelDef) => {
          const channel = document2.createAnimationChannel().setSampler(samplers[channelDef.sampler]).setTargetPath(channelDef.target.path);
          if (channelDef.target.node !== void 0) channel.setTargetNode(context.nodes[channelDef.target.node]);
          if (channelDef.extras) channel.setExtras(channelDef.extras);
          animation.addChannel(channel);
        });
        return animation;
      });
      const sceneDefs = json.scenes || [];
      document2.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.SCENE)).forEach((extension) => extension.preread(context, PropertyType.SCENE));
      context.scenes = sceneDefs.map((sceneDef) => {
        const scene = document2.createScene(sceneDef.name);
        if (sceneDef.extras) scene.setExtras(sceneDef.extras);
        const children = sceneDef.nodes || [];
        children.map((nodeIndex) => context.nodes[nodeIndex]).forEach((node) => scene.addChild(node));
        return scene;
      });
      if (json.scene !== void 0) {
        document2.getRoot().setDefaultScene(context.scenes[json.scene]);
      }
      document2.getRoot().listExtensionsUsed().forEach((extension) => extension.read(context));
      accessorDefs.forEach((accessorDef, index) => {
        const accessor = context.accessors[index];
        const hasSparseValues = !!accessorDef.sparse;
        const isZeroFilled = !accessorDef.bufferView && !accessor.getArray();
        if (hasSparseValues || isZeroFilled) {
          accessor.setSparse(true).setArray(getSparseArray(accessorDef, context));
        }
      });
      return document2;
    }
    static validate(jsonDoc, options) {
      const json = jsonDoc.json;
      if (json.asset.version !== "2.0") {
        throw new Error(`Unsupported glTF version, "${json.asset.version}".`);
      }
      if (json.extensionsRequired) {
        for (const extensionName of json.extensionsRequired) {
          if (!options.extensions.find((extension) => extension.EXTENSION_NAME === extensionName)) {
            throw new Error(`Missing required extension, "${extensionName}".`);
          }
        }
      }
      if (json.extensionsUsed) {
        for (const extensionName of json.extensionsUsed) {
          if (!options.extensions.find((extension) => extension.EXTENSION_NAME === extensionName)) {
            options.logger.warn(`Missing optional extension, "${extensionName}".`);
          }
        }
      }
    }
  };
  function getInterleavedArray(accessorDef, context) {
    const jsonDoc = context.jsonDoc;
    const bufferView = context.bufferViews[accessorDef.bufferView];
    const bufferViewDef = jsonDoc.json.bufferViews[accessorDef.bufferView];
    const TypedArray = ComponentTypeToTypedArray[accessorDef.componentType];
    const elementSize = Accessor.getElementSize(accessorDef.type);
    const componentSize = TypedArray.BYTES_PER_ELEMENT;
    const accessorByteOffset = accessorDef.byteOffset || 0;
    const array = new TypedArray(accessorDef.count * elementSize);
    const view = new DataView(bufferView.buffer, bufferView.byteOffset, bufferView.byteLength);
    const byteStride = bufferViewDef.byteStride;
    for (let i = 0; i < accessorDef.count; i++) {
      for (let j = 0; j < elementSize; j++) {
        const byteOffset = accessorByteOffset + i * byteStride + j * componentSize;
        let value;
        switch (accessorDef.componentType) {
          case Accessor.ComponentType.FLOAT:
            value = view.getFloat32(byteOffset, true);
            break;
          case Accessor.ComponentType.UNSIGNED_INT:
            value = view.getUint32(byteOffset, true);
            break;
          case Accessor.ComponentType.UNSIGNED_SHORT:
            value = view.getUint16(byteOffset, true);
            break;
          case Accessor.ComponentType.UNSIGNED_BYTE:
            value = view.getUint8(byteOffset);
            break;
          case Accessor.ComponentType.SHORT:
            value = view.getInt16(byteOffset, true);
            break;
          case Accessor.ComponentType.BYTE:
            value = view.getInt8(byteOffset);
            break;
          default:
            throw new Error(`Unexpected componentType "${accessorDef.componentType}".`);
        }
        array[i * elementSize + j] = value;
      }
    }
    return array;
  }
  function getAccessorArray(accessorDef, context) {
    const jsonDoc = context.jsonDoc;
    const bufferView = context.bufferViews[accessorDef.bufferView];
    const bufferViewDef = jsonDoc.json.bufferViews[accessorDef.bufferView];
    const TypedArray = ComponentTypeToTypedArray[accessorDef.componentType];
    const elementSize = Accessor.getElementSize(accessorDef.type);
    const componentSize = TypedArray.BYTES_PER_ELEMENT;
    const elementStride = elementSize * componentSize;
    if (bufferViewDef.byteStride !== void 0 && bufferViewDef.byteStride !== elementStride) {
      return getInterleavedArray(accessorDef, context);
    }
    const byteOffset = bufferView.byteOffset + (accessorDef.byteOffset || 0);
    const byteLength = accessorDef.count * elementSize * componentSize;
    return new TypedArray(bufferView.buffer.slice(byteOffset, byteOffset + byteLength));
  }
  function getSparseArray(accessorDef, context) {
    const TypedArray = ComponentTypeToTypedArray[accessorDef.componentType];
    const elementSize = Accessor.getElementSize(accessorDef.type);
    let array;
    if (accessorDef.bufferView !== void 0) {
      array = getAccessorArray(accessorDef, context);
    } else {
      array = new TypedArray(accessorDef.count * elementSize);
    }
    const sparseDef = accessorDef.sparse;
    if (!sparseDef) return array;
    const count = sparseDef.count;
    const indicesDef = _extends({}, accessorDef, sparseDef.indices, {
      count,
      type: "SCALAR"
    });
    const valuesDef = _extends({}, accessorDef, sparseDef.values, {
      count
    });
    const indices = getAccessorArray(indicesDef, context);
    const values = getAccessorArray(valuesDef, context);
    for (let i = 0; i < indicesDef.count; i++) {
      for (let j = 0; j < elementSize; j++) {
        array[indices[i] * elementSize + j] = values[i * elementSize + j];
      }
    }
    return array;
  }
  var BufferViewTarget;
  (function(BufferViewTarget2) {
    BufferViewTarget2[BufferViewTarget2["ARRAY_BUFFER"] = 34962] = "ARRAY_BUFFER";
    BufferViewTarget2[BufferViewTarget2["ELEMENT_ARRAY_BUFFER"] = 34963] = "ELEMENT_ARRAY_BUFFER";
  })(BufferViewTarget || (BufferViewTarget = {}));
  var WriterContext = class {
    constructor(_doc, jsonDoc, options) {
      this._doc = void 0;
      this.jsonDoc = void 0;
      this.options = void 0;
      this.accessorIndexMap = /* @__PURE__ */ new Map();
      this.animationIndexMap = /* @__PURE__ */ new Map();
      this.bufferIndexMap = /* @__PURE__ */ new Map();
      this.cameraIndexMap = /* @__PURE__ */ new Map();
      this.skinIndexMap = /* @__PURE__ */ new Map();
      this.materialIndexMap = /* @__PURE__ */ new Map();
      this.meshIndexMap = /* @__PURE__ */ new Map();
      this.nodeIndexMap = /* @__PURE__ */ new Map();
      this.imageIndexMap = /* @__PURE__ */ new Map();
      this.textureDefIndexMap = /* @__PURE__ */ new Map();
      this.textureInfoDefMap = /* @__PURE__ */ new Map();
      this.samplerDefIndexMap = /* @__PURE__ */ new Map();
      this.sceneIndexMap = /* @__PURE__ */ new Map();
      this.imageBufferViews = [];
      this.otherBufferViews = /* @__PURE__ */ new Map();
      this.otherBufferViewsIndexMap = /* @__PURE__ */ new Map();
      this.extensionData = {};
      this.bufferURIGenerator = void 0;
      this.imageURIGenerator = void 0;
      this.logger = void 0;
      this._accessorUsageMap = /* @__PURE__ */ new Map();
      this.accessorUsageGroupedByParent = /* @__PURE__ */ new Set(["ARRAY_BUFFER"]);
      this.accessorParents = /* @__PURE__ */ new Map();
      this._doc = _doc;
      this.jsonDoc = jsonDoc;
      this.options = options;
      const root = _doc.getRoot();
      const numBuffers = root.listBuffers().length;
      const numImages = root.listTextures().length;
      this.bufferURIGenerator = new UniqueURIGenerator(numBuffers > 1, () => options.basename || "buffer");
      this.imageURIGenerator = new UniqueURIGenerator(numImages > 1, (texture) => getSlot(_doc, texture) || options.basename || "texture");
      this.logger = _doc.getLogger();
    }
    /**
     * Creates a TextureInfo definition, and any Texture or Sampler definitions it requires. If
     * possible, Texture and Sampler definitions are shared.
     */
    createTextureInfoDef(texture, textureInfo) {
      const samplerDef = {
        magFilter: textureInfo.getMagFilter() || void 0,
        minFilter: textureInfo.getMinFilter() || void 0,
        wrapS: textureInfo.getWrapS(),
        wrapT: textureInfo.getWrapT()
      };
      const samplerKey = JSON.stringify(samplerDef);
      if (!this.samplerDefIndexMap.has(samplerKey)) {
        this.samplerDefIndexMap.set(samplerKey, this.jsonDoc.json.samplers.length);
        this.jsonDoc.json.samplers.push(samplerDef);
      }
      const textureDef = {
        source: this.imageIndexMap.get(texture),
        sampler: this.samplerDefIndexMap.get(samplerKey)
      };
      const textureKey = JSON.stringify(textureDef);
      if (!this.textureDefIndexMap.has(textureKey)) {
        this.textureDefIndexMap.set(textureKey, this.jsonDoc.json.textures.length);
        this.jsonDoc.json.textures.push(textureDef);
      }
      const textureInfoDef = {
        index: this.textureDefIndexMap.get(textureKey)
      };
      if (textureInfo.getTexCoord() !== 0) {
        textureInfoDef.texCoord = textureInfo.getTexCoord();
      }
      if (Object.keys(textureInfo.getExtras()).length > 0) {
        textureInfoDef.extras = textureInfo.getExtras();
      }
      this.textureInfoDefMap.set(textureInfo, textureInfoDef);
      return textureInfoDef;
    }
    createPropertyDef(property) {
      const def = {};
      if (property.getName()) {
        def.name = property.getName();
      }
      if (Object.keys(property.getExtras()).length > 0) {
        def.extras = property.getExtras();
      }
      return def;
    }
    createAccessorDef(accessor) {
      const accessorDef = this.createPropertyDef(accessor);
      accessorDef.type = accessor.getType();
      accessorDef.componentType = accessor.getComponentType();
      accessorDef.count = accessor.getCount();
      const needsBounds = this._doc.getGraph().listParentEdges(accessor).some((edge) => edge.getName() === "attributes" && edge.getAttributes().key === "POSITION" || edge.getName() === "input");
      if (needsBounds) {
        accessorDef.max = accessor.getMax([]).map(Math.fround);
        accessorDef.min = accessor.getMin([]).map(Math.fround);
      }
      if (accessor.getNormalized()) {
        accessorDef.normalized = accessor.getNormalized();
      }
      return accessorDef;
    }
    createImageData(imageDef, data, texture) {
      if (this.options.format === Format.GLB) {
        this.imageBufferViews.push(data);
        imageDef.bufferView = this.jsonDoc.json.bufferViews.length;
        this.jsonDoc.json.bufferViews.push({
          buffer: 0,
          byteOffset: -1,
          // determined while iterating buffers, in Writer.ts.
          byteLength: data.byteLength
        });
      } else {
        const extension = ImageUtils.mimeTypeToExtension(texture.getMimeType());
        imageDef.uri = this.imageURIGenerator.createURI(texture, extension);
        this.assignResourceURI(imageDef.uri, data, false);
      }
    }
    assignResourceURI(uri, data, throwOnConflict) {
      const resources = this.jsonDoc.resources;
      if (!(uri in resources)) {
        resources[uri] = data;
        return;
      }
      if (data === resources[uri]) {
        this.logger.warn(`Duplicate resource URI, "${uri}".`);
        return;
      }
      const conflictMessage = `Resource URI "${uri}" already assigned to different data.`;
      if (!throwOnConflict) {
        this.logger.warn(conflictMessage);
        return;
      }
      throw new Error(conflictMessage);
    }
    /**
     * Returns implicit usage type of the given accessor, related to grouping accessors into
     * buffer views. Usage is a superset of buffer view target, including ARRAY_BUFFER and
     * ELEMENT_ARRAY_BUFFER, but also usages that do not match GPU buffer view targets such as
     * IBMs. Additional usages are defined by extensions, like `EXT_mesh_gpu_instancing`.
     */
    getAccessorUsage(accessor) {
      const cachedUsage = this._accessorUsageMap.get(accessor);
      if (cachedUsage) return cachedUsage;
      if (accessor.getSparse()) return BufferViewUsage$1.SPARSE;
      for (const edge of this._doc.getGraph().listParentEdges(accessor)) {
        const {
          usage
        } = edge.getAttributes();
        if (usage) return usage;
        if (edge.getParent().propertyType !== PropertyType.ROOT) {
          this.logger.warn(`Missing attribute ".usage" on edge, "${edge.getName()}".`);
        }
      }
      return BufferViewUsage$1.OTHER;
    }
    /**
     * Sets usage for the given accessor. Some accessor types must be grouped into
     * buffer views with like accessors. This includes the specified buffer view "targets", but
     * also implicit usage like IBMs or instanced mesh attributes. If unspecified, an accessor
     * will be grouped with other accessors of unspecified usage.
     */
    addAccessorToUsageGroup(accessor, usage) {
      const prevUsage = this._accessorUsageMap.get(accessor);
      if (prevUsage && prevUsage !== usage) {
        throw new Error(`Accessor with usage "${prevUsage}" cannot be reused as "${usage}".`);
      }
      this._accessorUsageMap.set(accessor, usage);
      return this;
    }
  };
  WriterContext.BufferViewTarget = BufferViewTarget;
  WriterContext.BufferViewUsage = BufferViewUsage$1;
  WriterContext.USAGE_TO_TARGET = {
    [BufferViewUsage$1.ARRAY_BUFFER]: BufferViewTarget.ARRAY_BUFFER,
    [BufferViewUsage$1.ELEMENT_ARRAY_BUFFER]: BufferViewTarget.ELEMENT_ARRAY_BUFFER
  };
  var UniqueURIGenerator = class {
    constructor(multiple, basename) {
      this.multiple = void 0;
      this.basename = void 0;
      this.counter = {};
      this.multiple = multiple;
      this.basename = basename;
    }
    createURI(object, extension) {
      if (object.getURI()) {
        return object.getURI();
      } else if (!this.multiple) {
        return `${this.basename(object)}.${extension}`;
      } else {
        const basename = this.basename(object);
        this.counter[basename] = this.counter[basename] || 1;
        return `${basename}_${this.counter[basename]++}.${extension}`;
      }
    }
  };
  function getSlot(document2, texture) {
    const edge = document2.getGraph().listParentEdges(texture).find((edge2) => edge2.getParent() !== document2.getRoot());
    return edge ? edge.getName().replace(/texture$/i, "") : "";
  }
  var {
    BufferViewUsage
  } = WriterContext;
  var {
    UNSIGNED_INT,
    UNSIGNED_SHORT,
    UNSIGNED_BYTE
  } = Accessor.ComponentType;
  var SUPPORTED_PREWRITE_TYPES = /* @__PURE__ */ new Set([PropertyType.ACCESSOR, PropertyType.BUFFER, PropertyType.MATERIAL, PropertyType.MESH]);
  var GLTFWriter = class {
    static write(doc, options) {
      const graph = doc.getGraph();
      const root = doc.getRoot();
      const json = {
        asset: _extends({
          generator: `glTF-Transform ${VERSION}`
        }, root.getAsset()),
        extras: _extends({}, root.getExtras())
      };
      const jsonDoc = {
        json,
        resources: {}
      };
      const context = new WriterContext(doc, jsonDoc, options);
      const logger = options.logger || Logger.DEFAULT_INSTANCE;
      const extensionsRegistered = new Set(options.extensions.map((ext) => ext.EXTENSION_NAME));
      const extensionsUsed = doc.getRoot().listExtensionsUsed().filter((ext) => extensionsRegistered.has(ext.extensionName)).sort((a, b) => a.extensionName > b.extensionName ? 1 : -1);
      const extensionsRequired = doc.getRoot().listExtensionsRequired().filter((ext) => extensionsRegistered.has(ext.extensionName)).sort((a, b) => a.extensionName > b.extensionName ? 1 : -1);
      if (extensionsUsed.length < doc.getRoot().listExtensionsUsed().length) {
        logger.warn("Some extensions were not registered for I/O, and will not be written.");
      }
      for (const extension of extensionsUsed) {
        const unsupportedHooks = extension.prewriteTypes.filter((type) => !SUPPORTED_PREWRITE_TYPES.has(type));
        if (unsupportedHooks.length) {
          logger.warn(`Prewrite hooks for some types (${unsupportedHooks.join()}), requested by extension ${extension.extensionName}, are unsupported. Please file an issue or a PR.`);
        }
        for (const key of extension.writeDependencies) {
          extension.install(key, options.dependencies[key]);
        }
      }
      function concatAccessors(accessors, bufferIndex, bufferByteOffset, bufferViewTarget) {
        const buffers = [];
        let byteLength = 0;
        for (const accessor of accessors) {
          const accessorDef = context.createAccessorDef(accessor);
          accessorDef.bufferView = json.bufferViews.length;
          const accessorArray = accessor.getArray();
          const data = BufferUtils.pad(BufferUtils.toView(accessorArray));
          accessorDef.byteOffset = byteLength;
          byteLength += data.byteLength;
          buffers.push(data);
          context.accessorIndexMap.set(accessor, json.accessors.length);
          json.accessors.push(accessorDef);
        }
        const bufferViewData = BufferUtils.concat(buffers);
        const bufferViewDef = {
          buffer: bufferIndex,
          byteOffset: bufferByteOffset,
          byteLength: bufferViewData.byteLength
        };
        if (bufferViewTarget) bufferViewDef.target = bufferViewTarget;
        json.bufferViews.push(bufferViewDef);
        return {
          buffers,
          byteLength
        };
      }
      function interleaveAccessors(accessors, bufferIndex, bufferByteOffset) {
        const vertexCount = accessors[0].getCount();
        let byteStride = 0;
        for (const accessor of accessors) {
          const accessorDef = context.createAccessorDef(accessor);
          accessorDef.bufferView = json.bufferViews.length;
          accessorDef.byteOffset = byteStride;
          const elementSize = accessor.getElementSize();
          const componentSize = accessor.getComponentSize();
          byteStride += BufferUtils.padNumber(elementSize * componentSize);
          context.accessorIndexMap.set(accessor, json.accessors.length);
          json.accessors.push(accessorDef);
        }
        const byteLength = vertexCount * byteStride;
        const buffer = new ArrayBuffer(byteLength);
        const view = new DataView(buffer);
        for (let i = 0; i < vertexCount; i++) {
          let vertexByteOffset = 0;
          for (const accessor of accessors) {
            const elementSize = accessor.getElementSize();
            const componentSize = accessor.getComponentSize();
            const componentType = accessor.getComponentType();
            const array = accessor.getArray();
            for (let j = 0; j < elementSize; j++) {
              const viewByteOffset = i * byteStride + vertexByteOffset + j * componentSize;
              const value = array[i * elementSize + j];
              switch (componentType) {
                case Accessor.ComponentType.FLOAT:
                  view.setFloat32(viewByteOffset, value, true);
                  break;
                case Accessor.ComponentType.BYTE:
                  view.setInt8(viewByteOffset, value);
                  break;
                case Accessor.ComponentType.SHORT:
                  view.setInt16(viewByteOffset, value, true);
                  break;
                case Accessor.ComponentType.UNSIGNED_BYTE:
                  view.setUint8(viewByteOffset, value);
                  break;
                case Accessor.ComponentType.UNSIGNED_SHORT:
                  view.setUint16(viewByteOffset, value, true);
                  break;
                case Accessor.ComponentType.UNSIGNED_INT:
                  view.setUint32(viewByteOffset, value, true);
                  break;
                default:
                  throw new Error("Unexpected component type: " + componentType);
              }
            }
            vertexByteOffset += BufferUtils.padNumber(elementSize * componentSize);
          }
        }
        const bufferViewDef = {
          buffer: bufferIndex,
          byteOffset: bufferByteOffset,
          byteLength,
          byteStride,
          target: WriterContext.BufferViewTarget.ARRAY_BUFFER
        };
        json.bufferViews.push(bufferViewDef);
        return {
          byteLength,
          buffers: [new Uint8Array(buffer)]
        };
      }
      function concatSparseAccessors(accessors, bufferIndex, bufferByteOffset) {
        const buffers = [];
        let byteLength = 0;
        const sparseData = /* @__PURE__ */ new Map();
        let maxIndex = -Infinity;
        let needSparseWarning = false;
        for (const accessor of accessors) {
          const accessorDef = context.createAccessorDef(accessor);
          json.accessors.push(accessorDef);
          context.accessorIndexMap.set(accessor, json.accessors.length - 1);
          const indices = [];
          const values = [];
          const el = [];
          const base = new Array(accessor.getElementSize()).fill(0);
          for (let i = 0, il = accessor.getCount(); i < il; i++) {
            accessor.getElement(i, el);
            if (MathUtils.eq(el, base, 0)) continue;
            maxIndex = Math.max(i, maxIndex);
            indices.push(i);
            for (let j = 0; j < el.length; j++) values.push(el[j]);
          }
          const count = indices.length;
          const data = {
            accessorDef,
            count
          };
          sparseData.set(accessor, data);
          if (count === 0) continue;
          if (count > accessor.getCount() / 2) {
            needSparseWarning = true;
          }
          const ValueArray = ComponentTypeToTypedArray[accessor.getComponentType()];
          data.indices = indices;
          data.values = new ValueArray(values);
        }
        if (!Number.isFinite(maxIndex)) {
          return {
            buffers,
            byteLength
          };
        }
        if (needSparseWarning) {
          logger.warn(`Some sparse accessors have >50% non-zero elements, which may increase file size.`);
        }
        const IndexArray = maxIndex < 255 ? Uint8Array : maxIndex < 65535 ? Uint16Array : Uint32Array;
        const IndexComponentType = maxIndex < 255 ? UNSIGNED_BYTE : maxIndex < 65535 ? UNSIGNED_SHORT : UNSIGNED_INT;
        const indicesBufferViewDef = {
          buffer: bufferIndex,
          byteOffset: bufferByteOffset + byteLength,
          byteLength: 0
        };
        for (const accessor of accessors) {
          const data = sparseData.get(accessor);
          if (data.count === 0) continue;
          data.indicesByteOffset = indicesBufferViewDef.byteLength;
          const buffer = BufferUtils.pad(BufferUtils.toView(new IndexArray(data.indices)));
          buffers.push(buffer);
          byteLength += buffer.byteLength;
          indicesBufferViewDef.byteLength += buffer.byteLength;
        }
        json.bufferViews.push(indicesBufferViewDef);
        const indicesBufferViewIndex = json.bufferViews.length - 1;
        const valuesBufferViewDef = {
          buffer: bufferIndex,
          byteOffset: bufferByteOffset + byteLength,
          byteLength: 0
        };
        for (const accessor of accessors) {
          const data = sparseData.get(accessor);
          if (data.count === 0) continue;
          data.valuesByteOffset = valuesBufferViewDef.byteLength;
          const buffer = BufferUtils.pad(BufferUtils.toView(data.values));
          buffers.push(buffer);
          byteLength += buffer.byteLength;
          valuesBufferViewDef.byteLength += buffer.byteLength;
        }
        json.bufferViews.push(valuesBufferViewDef);
        const valuesBufferViewIndex = json.bufferViews.length - 1;
        for (const accessor of accessors) {
          const data = sparseData.get(accessor);
          if (data.count === 0) continue;
          data.accessorDef.sparse = {
            count: data.count,
            indices: {
              bufferView: indicesBufferViewIndex,
              byteOffset: data.indicesByteOffset,
              componentType: IndexComponentType
            },
            values: {
              bufferView: valuesBufferViewIndex,
              byteOffset: data.valuesByteOffset
            }
          };
        }
        return {
          buffers,
          byteLength
        };
      }
      json.accessors = [];
      json.bufferViews = [];
      json.samplers = [];
      json.textures = [];
      json.images = root.listTextures().map((texture, textureIndex) => {
        const imageDef = context.createPropertyDef(texture);
        if (texture.getMimeType()) {
          imageDef.mimeType = texture.getMimeType();
        }
        const image = texture.getImage();
        if (image) {
          context.createImageData(imageDef, image, texture);
        }
        context.imageIndexMap.set(texture, textureIndex);
        return imageDef;
      });
      extensionsUsed.filter((extension) => extension.prewriteTypes.includes(PropertyType.ACCESSOR)).forEach((extension) => extension.prewrite(context, PropertyType.ACCESSOR));
      root.listAccessors().forEach((accessor) => {
        const groupByParent = context.accessorUsageGroupedByParent;
        const accessorParents = context.accessorParents;
        if (context.accessorIndexMap.has(accessor)) return;
        const usage = context.getAccessorUsage(accessor);
        context.addAccessorToUsageGroup(accessor, usage);
        if (groupByParent.has(usage)) {
          const parent = graph.listParents(accessor).find((parent2) => parent2.propertyType !== PropertyType.ROOT);
          accessorParents.set(accessor, parent);
        }
      });
      extensionsUsed.filter((extension) => extension.prewriteTypes.includes(PropertyType.BUFFER)).forEach((extension) => extension.prewrite(context, PropertyType.BUFFER));
      const needsBuffer = root.listAccessors().length > 0 || context.otherBufferViews.size > 0 || root.listTextures().length > 0 && options.format === Format.GLB;
      if (needsBuffer && root.listBuffers().length === 0) {
        throw new Error("Buffer required for Document resources, but none was found.");
      }
      json.buffers = [];
      root.listBuffers().forEach((buffer, index) => {
        const bufferDef = context.createPropertyDef(buffer);
        const groupByParent = context.accessorUsageGroupedByParent;
        const accessors = buffer.listParents().filter((property) => property instanceof Accessor);
        const uniqueParents = new Set(accessors.map((accessor) => context.accessorParents.get(accessor)));
        const parentToIndex = new Map(Array.from(uniqueParents).map((parent, index2) => [parent, index2]));
        const accessorGroups = {};
        for (const accessor of accessors) {
          var _key;
          if (context.accessorIndexMap.has(accessor)) continue;
          const usage = context.getAccessorUsage(accessor);
          let key = usage;
          if (groupByParent.has(usage)) {
            const parent = context.accessorParents.get(accessor);
            key += `:${parentToIndex.get(parent)}`;
          }
          accessorGroups[_key = key] || (accessorGroups[_key] = {
            usage,
            accessors: []
          });
          accessorGroups[key].accessors.push(accessor);
        }
        const buffers = [];
        const bufferIndex = json.buffers.length;
        let bufferByteLength = 0;
        for (const {
          usage,
          accessors: groupAccessors
        } of Object.values(accessorGroups)) {
          if (usage === BufferViewUsage.ARRAY_BUFFER && options.vertexLayout === VertexLayout.INTERLEAVED) {
            const result = interleaveAccessors(groupAccessors, bufferIndex, bufferByteLength);
            bufferByteLength += result.byteLength;
            for (const _buffer of result.buffers) {
              buffers.push(_buffer);
            }
          } else if (usage === BufferViewUsage.ARRAY_BUFFER) {
            for (const accessor of groupAccessors) {
              const result = interleaveAccessors([accessor], bufferIndex, bufferByteLength);
              bufferByteLength += result.byteLength;
              for (const _buffer2 of result.buffers) {
                buffers.push(_buffer2);
              }
            }
          } else if (usage === BufferViewUsage.SPARSE) {
            const result = concatSparseAccessors(groupAccessors, bufferIndex, bufferByteLength);
            bufferByteLength += result.byteLength;
            for (const _buffer3 of result.buffers) {
              buffers.push(_buffer3);
            }
          } else if (usage === BufferViewUsage.ELEMENT_ARRAY_BUFFER) {
            const target = WriterContext.BufferViewTarget.ELEMENT_ARRAY_BUFFER;
            const result = concatAccessors(groupAccessors, bufferIndex, bufferByteLength, target);
            bufferByteLength += result.byteLength;
            for (const _buffer4 of result.buffers) {
              buffers.push(_buffer4);
            }
          } else {
            const result = concatAccessors(groupAccessors, bufferIndex, bufferByteLength);
            bufferByteLength += result.byteLength;
            for (const _buffer5 of result.buffers) {
              buffers.push(_buffer5);
            }
          }
        }
        if (context.imageBufferViews.length && index === 0) {
          for (let i = 0; i < context.imageBufferViews.length; i++) {
            json.bufferViews[json.images[i].bufferView].byteOffset = bufferByteLength;
            bufferByteLength += context.imageBufferViews[i].byteLength;
            buffers.push(context.imageBufferViews[i]);
            if (bufferByteLength % 8) {
              const imagePadding = 8 - bufferByteLength % 8;
              bufferByteLength += imagePadding;
              buffers.push(new Uint8Array(imagePadding));
            }
          }
        }
        if (context.otherBufferViews.has(buffer)) {
          for (const data of context.otherBufferViews.get(buffer)) {
            json.bufferViews.push({
              buffer: bufferIndex,
              byteOffset: bufferByteLength,
              byteLength: data.byteLength
            });
            context.otherBufferViewsIndexMap.set(data, json.bufferViews.length - 1);
            bufferByteLength += data.byteLength;
            buffers.push(data);
          }
        }
        if (bufferByteLength) {
          let uri;
          if (options.format === Format.GLB) {
            uri = GLB_BUFFER;
          } else {
            uri = context.bufferURIGenerator.createURI(buffer, "bin");
            bufferDef.uri = uri;
          }
          bufferDef.byteLength = bufferByteLength;
          context.assignResourceURI(uri, BufferUtils.concat(buffers), true);
        }
        json.buffers.push(bufferDef);
        context.bufferIndexMap.set(buffer, index);
      });
      if (root.listAccessors().find((a) => !a.getBuffer())) {
        logger.warn("Skipped writing one or more Accessors: no Buffer assigned.");
      }
      extensionsUsed.filter((extension) => extension.prewriteTypes.includes(PropertyType.MATERIAL)).forEach((extension) => extension.prewrite(context, PropertyType.MATERIAL));
      json.materials = root.listMaterials().map((material, index) => {
        const materialDef = context.createPropertyDef(material);
        if (material.getAlphaMode() !== Material.AlphaMode.OPAQUE) {
          materialDef.alphaMode = material.getAlphaMode();
        }
        if (material.getAlphaMode() === Material.AlphaMode.MASK) {
          materialDef.alphaCutoff = material.getAlphaCutoff();
        }
        if (material.getDoubleSided()) materialDef.doubleSided = true;
        materialDef.pbrMetallicRoughness = {};
        if (!MathUtils.eq(material.getBaseColorFactor(), [1, 1, 1, 1])) {
          materialDef.pbrMetallicRoughness.baseColorFactor = material.getBaseColorFactor();
        }
        if (!MathUtils.eq(material.getEmissiveFactor(), [0, 0, 0])) {
          materialDef.emissiveFactor = material.getEmissiveFactor();
        }
        if (material.getRoughnessFactor() !== 1) {
          materialDef.pbrMetallicRoughness.roughnessFactor = material.getRoughnessFactor();
        }
        if (material.getMetallicFactor() !== 1) {
          materialDef.pbrMetallicRoughness.metallicFactor = material.getMetallicFactor();
        }
        if (material.getBaseColorTexture()) {
          const texture = material.getBaseColorTexture();
          const textureInfo = material.getBaseColorTextureInfo();
          materialDef.pbrMetallicRoughness.baseColorTexture = context.createTextureInfoDef(texture, textureInfo);
        }
        if (material.getEmissiveTexture()) {
          const texture = material.getEmissiveTexture();
          const textureInfo = material.getEmissiveTextureInfo();
          materialDef.emissiveTexture = context.createTextureInfoDef(texture, textureInfo);
        }
        if (material.getNormalTexture()) {
          const texture = material.getNormalTexture();
          const textureInfo = material.getNormalTextureInfo();
          const textureInfoDef = context.createTextureInfoDef(texture, textureInfo);
          if (material.getNormalScale() !== 1) {
            textureInfoDef.scale = material.getNormalScale();
          }
          materialDef.normalTexture = textureInfoDef;
        }
        if (material.getOcclusionTexture()) {
          const texture = material.getOcclusionTexture();
          const textureInfo = material.getOcclusionTextureInfo();
          const textureInfoDef = context.createTextureInfoDef(texture, textureInfo);
          if (material.getOcclusionStrength() !== 1) {
            textureInfoDef.strength = material.getOcclusionStrength();
          }
          materialDef.occlusionTexture = textureInfoDef;
        }
        if (material.getMetallicRoughnessTexture()) {
          const texture = material.getMetallicRoughnessTexture();
          const textureInfo = material.getMetallicRoughnessTextureInfo();
          materialDef.pbrMetallicRoughness.metallicRoughnessTexture = context.createTextureInfoDef(texture, textureInfo);
        }
        context.materialIndexMap.set(material, index);
        return materialDef;
      });
      extensionsUsed.filter((extension) => extension.prewriteTypes.includes(PropertyType.MESH)).forEach((extension) => extension.prewrite(context, PropertyType.MESH));
      json.meshes = root.listMeshes().map((mesh, index) => {
        const meshDef = context.createPropertyDef(mesh);
        let targetNames = null;
        meshDef.primitives = mesh.listPrimitives().map((primitive) => {
          const primitiveDef = {
            attributes: {}
          };
          primitiveDef.mode = primitive.getMode();
          const material = primitive.getMaterial();
          if (material) {
            primitiveDef.material = context.materialIndexMap.get(material);
          }
          if (Object.keys(primitive.getExtras()).length) {
            primitiveDef.extras = primitive.getExtras();
          }
          const indices = primitive.getIndices();
          if (indices) {
            primitiveDef.indices = context.accessorIndexMap.get(indices);
          }
          for (const semantic of primitive.listSemantics()) {
            primitiveDef.attributes[semantic] = context.accessorIndexMap.get(primitive.getAttribute(semantic));
          }
          for (const target of primitive.listTargets()) {
            const targetDef = {};
            for (const semantic of target.listSemantics()) {
              targetDef[semantic] = context.accessorIndexMap.get(target.getAttribute(semantic));
            }
            primitiveDef.targets = primitiveDef.targets || [];
            primitiveDef.targets.push(targetDef);
          }
          if (primitive.listTargets().length && !targetNames) {
            targetNames = primitive.listTargets().map((target) => target.getName());
          }
          return primitiveDef;
        });
        if (mesh.getWeights().length) {
          meshDef.weights = mesh.getWeights();
        }
        if (targetNames) {
          meshDef.extras = meshDef.extras || {};
          meshDef.extras["targetNames"] = targetNames;
        }
        context.meshIndexMap.set(mesh, index);
        return meshDef;
      });
      json.cameras = root.listCameras().map((camera, index) => {
        const cameraDef = context.createPropertyDef(camera);
        cameraDef.type = camera.getType();
        if (cameraDef.type === Camera.Type.PERSPECTIVE) {
          cameraDef.perspective = {
            znear: camera.getZNear(),
            zfar: camera.getZFar(),
            yfov: camera.getYFov()
          };
          const aspectRatio = camera.getAspectRatio();
          if (aspectRatio !== null) {
            cameraDef.perspective.aspectRatio = aspectRatio;
          }
        } else {
          cameraDef.orthographic = {
            znear: camera.getZNear(),
            zfar: camera.getZFar(),
            xmag: camera.getXMag(),
            ymag: camera.getYMag()
          };
        }
        context.cameraIndexMap.set(camera, index);
        return cameraDef;
      });
      json.nodes = root.listNodes().map((node, index) => {
        const nodeDef = context.createPropertyDef(node);
        if (!MathUtils.eq(node.getTranslation(), [0, 0, 0])) {
          nodeDef.translation = node.getTranslation();
        }
        if (!MathUtils.eq(node.getRotation(), [0, 0, 0, 1])) {
          nodeDef.rotation = node.getRotation();
        }
        if (!MathUtils.eq(node.getScale(), [1, 1, 1])) {
          nodeDef.scale = node.getScale();
        }
        if (node.getWeights().length) {
          nodeDef.weights = node.getWeights();
        }
        context.nodeIndexMap.set(node, index);
        return nodeDef;
      });
      json.skins = root.listSkins().map((skin, index) => {
        const skinDef = context.createPropertyDef(skin);
        const inverseBindMatrices = skin.getInverseBindMatrices();
        if (inverseBindMatrices) {
          skinDef.inverseBindMatrices = context.accessorIndexMap.get(inverseBindMatrices);
        }
        const skeleton = skin.getSkeleton();
        if (skeleton) {
          skinDef.skeleton = context.nodeIndexMap.get(skeleton);
        }
        skinDef.joints = skin.listJoints().map((joint) => context.nodeIndexMap.get(joint));
        context.skinIndexMap.set(skin, index);
        return skinDef;
      });
      root.listNodes().forEach((node, index) => {
        const nodeDef = json.nodes[index];
        const mesh = node.getMesh();
        if (mesh) {
          nodeDef.mesh = context.meshIndexMap.get(mesh);
        }
        const camera = node.getCamera();
        if (camera) {
          nodeDef.camera = context.cameraIndexMap.get(camera);
        }
        const skin = node.getSkin();
        if (skin) {
          nodeDef.skin = context.skinIndexMap.get(skin);
        }
        if (node.listChildren().length > 0) {
          nodeDef.children = node.listChildren().map((node2) => context.nodeIndexMap.get(node2));
        }
      });
      json.animations = root.listAnimations().map((animation, index) => {
        const animationDef = context.createPropertyDef(animation);
        const samplerIndexMap = /* @__PURE__ */ new Map();
        animationDef.samplers = animation.listSamplers().map((sampler, samplerIndex) => {
          const samplerDef = context.createPropertyDef(sampler);
          samplerDef.input = context.accessorIndexMap.get(sampler.getInput());
          samplerDef.output = context.accessorIndexMap.get(sampler.getOutput());
          samplerDef.interpolation = sampler.getInterpolation();
          samplerIndexMap.set(sampler, samplerIndex);
          return samplerDef;
        });
        animationDef.channels = animation.listChannels().map((channel) => {
          const channelDef = context.createPropertyDef(channel);
          channelDef.sampler = samplerIndexMap.get(channel.getSampler());
          channelDef.target = {
            node: context.nodeIndexMap.get(channel.getTargetNode()),
            path: channel.getTargetPath()
          };
          return channelDef;
        });
        context.animationIndexMap.set(animation, index);
        return animationDef;
      });
      json.scenes = root.listScenes().map((scene, index) => {
        const sceneDef = context.createPropertyDef(scene);
        sceneDef.nodes = scene.listChildren().map((node) => context.nodeIndexMap.get(node));
        context.sceneIndexMap.set(scene, index);
        return sceneDef;
      });
      const defaultScene = root.getDefaultScene();
      if (defaultScene) {
        json.scene = root.listScenes().indexOf(defaultScene);
      }
      json.extensionsUsed = extensionsUsed.map((ext) => ext.extensionName);
      json.extensionsRequired = extensionsRequired.map((ext) => ext.extensionName);
      extensionsUsed.forEach((extension) => extension.write(context));
      clean(json);
      return jsonDoc;
    }
  };
  function clean(object) {
    const unused = [];
    for (const key in object) {
      const value = object[key];
      if (Array.isArray(value) && value.length === 0) {
        unused.push(key);
      } else if (value === null || value === "") {
        unused.push(key);
      } else if (value && typeof value === "object" && Object.keys(value).length === 0) {
        unused.push(key);
      }
    }
    for (const key of unused) {
      delete object[key];
    }
  }
  var ChunkType;
  (function(ChunkType2) {
    ChunkType2[ChunkType2["JSON"] = 1313821514] = "JSON";
    ChunkType2[ChunkType2["BIN"] = 5130562] = "BIN";
  })(ChunkType || (ChunkType = {}));
  var PlatformIO = class {
    constructor() {
      this._logger = Logger.DEFAULT_INSTANCE;
      this._extensions = /* @__PURE__ */ new Set();
      this._dependencies = {};
      this._vertexLayout = VertexLayout.INTERLEAVED;
      this._strictResources = true;
      this.lastReadBytes = 0;
      this.lastWriteBytes = 0;
    }
    /** Sets the {@link Logger} used by this I/O instance. Defaults to Logger.DEFAULT_INSTANCE. */
    setLogger(logger) {
      this._logger = logger;
      return this;
    }
    /** Registers extensions, enabling I/O class to read and write glTF assets requiring them. */
    registerExtensions(extensions) {
      for (const extension of extensions) {
        this._extensions.add(extension);
        extension.register();
      }
      return this;
    }
    /** Registers dependencies used (e.g. by extensions) in the I/O process. */
    registerDependencies(dependencies) {
      Object.assign(this._dependencies, dependencies);
      return this;
    }
    /**
     * Sets the vertex layout method used by this I/O instance. Defaults to
     * VertexLayout.INTERLEAVED.
     */
    setVertexLayout(layout) {
      this._vertexLayout = layout;
      return this;
    }
    /**
     * Sets whether missing external resources should throw errors (strict mode) or
     * be ignored with warnings. Missing images can be ignored, but missing buffers
     * will currently always result in an error. When strict mode is disabled and
     * missing resources are encountered, the resulting {@link Document} will be
     * created in an invalid state. Manual fixes to the Document may be necessary,
     * resolving null images in {@link Texture Textures} or removing the affected
     * Textures, before the Document can be written to output or used in transforms.
     *
     * Defaults to true (strict mode).
     */
    setStrictResources(strict) {
      this._strictResources = strict;
      return this;
    }
    /**********************************************************************************************
     * Public Read API.
     */
    /** Reads a {@link Document} from the given URI. */
    async read(uri) {
      return await this.readJSON(await this.readAsJSON(uri));
    }
    /** Loads a URI and returns a {@link JSONDocument} struct, without parsing. */
    async readAsJSON(uri) {
      const view = await this.readURI(uri, "view");
      this.lastReadBytes = view.byteLength;
      const jsonDoc = isGLB(view) ? this._binaryToJSON(view) : {
        json: JSON.parse(BufferUtils.decodeText(view)),
        resources: {}
      };
      await this._readResourcesExternal(jsonDoc, this.dirname(uri));
      this._readResourcesInternal(jsonDoc);
      return jsonDoc;
    }
    /** Converts glTF-formatted JSON and a resource map to a {@link Document}. */
    async readJSON(jsonDoc) {
      jsonDoc = this._copyJSON(jsonDoc);
      this._readResourcesInternal(jsonDoc);
      return GLTFReader.read(jsonDoc, {
        extensions: Array.from(this._extensions),
        dependencies: this._dependencies,
        logger: this._logger
      });
    }
    /** Converts a GLB-formatted Uint8Array to a {@link JSONDocument}. */
    async binaryToJSON(glb) {
      const jsonDoc = this._binaryToJSON(BufferUtils.assertView(glb));
      this._readResourcesInternal(jsonDoc);
      const json = jsonDoc.json;
      if (json.buffers && json.buffers.some((bufferDef) => isExternalBuffer(jsonDoc, bufferDef))) {
        throw new Error("Cannot resolve external buffers with binaryToJSON().");
      } else if (json.images && json.images.some((imageDef) => isExternalImage(jsonDoc, imageDef))) {
        throw new Error("Cannot resolve external images with binaryToJSON().");
      }
      return jsonDoc;
    }
    /** Converts a GLB-formatted Uint8Array to a {@link Document}. */
    async readBinary(glb) {
      return this.readJSON(await this.binaryToJSON(BufferUtils.assertView(glb)));
    }
    /**********************************************************************************************
     * Public Write API.
     */
    /** Converts a {@link Document} to glTF-formatted JSON and a resource map. */
    async writeJSON(doc, _options = {}) {
      if (_options.format === Format.GLB && doc.getRoot().listBuffers().length > 1) {
        throw new Error("GLB must have 0\u20131 buffers.");
      }
      return GLTFWriter.write(doc, {
        format: _options.format || Format.GLTF,
        basename: _options.basename || "",
        logger: this._logger,
        vertexLayout: this._vertexLayout,
        dependencies: _extends({}, this._dependencies),
        extensions: Array.from(this._extensions)
      });
    }
    /** Converts a {@link Document} to a GLB-formatted Uint8Array. */
    async writeBinary(doc) {
      const {
        json,
        resources
      } = await this.writeJSON(doc, {
        format: Format.GLB
      });
      const header = new Uint32Array([1179937895, 2, 12]);
      const jsonText = JSON.stringify(json);
      const jsonChunkData = BufferUtils.pad(BufferUtils.encodeText(jsonText), 32);
      const jsonChunkHeader = BufferUtils.toView(new Uint32Array([jsonChunkData.byteLength, 1313821514]));
      const jsonChunk = BufferUtils.concat([jsonChunkHeader, jsonChunkData]);
      header[header.length - 1] += jsonChunk.byteLength;
      const binBuffer = Object.values(resources)[0];
      if (!binBuffer || !binBuffer.byteLength) {
        return BufferUtils.concat([BufferUtils.toView(header), jsonChunk]);
      }
      const binChunkData = BufferUtils.pad(binBuffer, 0);
      const binChunkHeader = BufferUtils.toView(new Uint32Array([binChunkData.byteLength, 5130562]));
      const binChunk = BufferUtils.concat([binChunkHeader, binChunkData]);
      header[header.length - 1] += binChunk.byteLength;
      return BufferUtils.concat([BufferUtils.toView(header), jsonChunk, binChunk]);
    }
    /**********************************************************************************************
     * Internal.
     */
    async _readResourcesExternal(jsonDoc, base) {
      var _this = this;
      const images = jsonDoc.json.images || [];
      const buffers = jsonDoc.json.buffers || [];
      const pendingResources = [...images, ...buffers].map(async function(resource) {
        const uri = resource.uri;
        if (!uri || uri.match(/data:/)) return Promise.resolve();
        try {
          jsonDoc.resources[uri] = await _this.readURI(_this.resolve(base, uri), "view");
          _this.lastReadBytes += jsonDoc.resources[uri].byteLength;
        } catch (error) {
          if (!_this._strictResources && images.includes(resource)) {
            _this._logger.warn(`Failed to load image URI, "${uri}". ${error}`);
            jsonDoc.resources[uri] = null;
          } else {
            throw error;
          }
        }
      });
      await Promise.all(pendingResources);
    }
    _readResourcesInternal(jsonDoc) {
      function resolveResource(resource) {
        if (!resource.uri) return;
        if (resource.uri in jsonDoc.resources) {
          BufferUtils.assertView(jsonDoc.resources[resource.uri]);
          return;
        }
        if (resource.uri.match(/data:/)) {
          const resourceUUID = `__${uuid()}.${FileUtils.extension(resource.uri)}`;
          jsonDoc.resources[resourceUUID] = BufferUtils.createBufferFromDataURI(resource.uri);
          resource.uri = resourceUUID;
        }
      }
      const images = jsonDoc.json.images || [];
      images.forEach((image) => {
        if (image.bufferView === void 0 && image.uri === void 0) {
          throw new Error("Missing resource URI or buffer view.");
        }
        resolveResource(image);
      });
      const buffers = jsonDoc.json.buffers || [];
      buffers.forEach(resolveResource);
    }
    /**
     * Creates a shallow copy of glTF-formatted {@link JSONDocument}.
     *
     * Images, Buffers, and Resources objects are deep copies so that PlatformIO can safely
     * modify them during the parsing process. Other properties are shallow copies, and buffers
     * are passed by reference.
     */
    _copyJSON(jsonDoc) {
      const {
        images,
        buffers
      } = jsonDoc.json;
      jsonDoc = {
        json: _extends({}, jsonDoc.json),
        resources: _extends({}, jsonDoc.resources)
      };
      if (images) {
        jsonDoc.json.images = images.map((image) => _extends({}, image));
      }
      if (buffers) {
        jsonDoc.json.buffers = buffers.map((buffer) => _extends({}, buffer));
      }
      return jsonDoc;
    }
    /** Internal version of binaryToJSON; does not warn about external resources. */
    _binaryToJSON(glb) {
      if (!isGLB(glb)) {
        throw new Error("Invalid glTF 2.0 binary.");
      }
      const jsonChunkHeader = new Uint32Array(glb.buffer, glb.byteOffset + 12, 2);
      if (jsonChunkHeader[1] !== ChunkType.JSON) {
        throw new Error("Missing required GLB JSON chunk.");
      }
      const jsonByteOffset = 20;
      const jsonByteLength = jsonChunkHeader[0];
      const jsonText = BufferUtils.decodeText(BufferUtils.toView(glb, jsonByteOffset, jsonByteLength));
      const json = JSON.parse(jsonText);
      const binByteOffset = jsonByteOffset + jsonByteLength;
      if (glb.byteLength <= binByteOffset) {
        return {
          json,
          resources: {}
        };
      }
      const binChunkHeader = new Uint32Array(glb.buffer, glb.byteOffset + binByteOffset, 2);
      if (binChunkHeader[1] !== ChunkType.BIN) {
        return {
          json,
          resources: {}
        };
      }
      const binByteLength = binChunkHeader[0];
      const binBuffer = BufferUtils.toView(glb, binByteOffset + 8, binByteLength);
      return {
        json,
        resources: {
          [GLB_BUFFER]: binBuffer
        }
      };
    }
  };
  function isExternalBuffer(jsonDocument, bufferDef) {
    return bufferDef.uri !== void 0 && !(bufferDef.uri in jsonDocument.resources);
  }
  function isExternalImage(jsonDocument, imageDef) {
    return imageDef.uri !== void 0 && !(imageDef.uri in jsonDocument.resources) && imageDef.bufferView === void 0;
  }
  function isGLB(view) {
    if (view.byteLength < 3 * Uint32Array.BYTES_PER_ELEMENT) return false;
    const header = new Uint32Array(view.buffer, view.byteOffset, 3);
    return header[0] === 1179937895 && header[1] === 2;
  }
  var WebIO = class extends PlatformIO {
    /**
     * Constructs a new WebIO service. Instances are reusable.
     * @param fetchConfig Configuration object for Fetch API.
     */
    constructor(fetchConfig = HTTPUtils.DEFAULT_INIT) {
      super();
      this._fetchConfig = void 0;
      this._fetchConfig = fetchConfig;
    }
    async readURI(uri, type) {
      const response = await fetch(uri, this._fetchConfig);
      switch (type) {
        case "view":
          return new Uint8Array(await response.arrayBuffer());
        case "text":
          return response.text();
      }
    }
    resolve(base, path) {
      return HTTPUtils.resolve(base, path);
    }
    dirname(uri) {
      return HTTPUtils.dirname(uri);
    }
  };

  // node_modules/@gltf-transform/extensions/dist/index.modern.js
  init_define_process_versions();

  // node_modules/ktx-parse/dist/ktx-parse.modern.js
  init_define_process_versions();
  var KHR_SUPERCOMPRESSION_NONE = 0;
  var KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT = 0;
  var KHR_DF_VENDORID_KHRONOS = 0;
  var KHR_DF_VERSION = 2;
  var KHR_DF_MODEL_UNSPECIFIED = 0;
  var KHR_DF_MODEL_ETC1S = 163;
  var KHR_DF_MODEL_UASTC = 166;
  var KHR_DF_FLAG_ALPHA_STRAIGHT = 0;
  var KHR_DF_TRANSFER_SRGB = 2;
  var KHR_DF_PRIMARIES_BT709 = 1;
  var KHR_DF_SAMPLE_DATATYPE_SIGNED = 64;
  var VK_FORMAT_UNDEFINED = 0;
  function createDefaultContainer() {
    return {
      vkFormat: VK_FORMAT_UNDEFINED,
      typeSize: 1,
      pixelWidth: 0,
      pixelHeight: 0,
      pixelDepth: 0,
      layerCount: 0,
      faceCount: 1,
      levelCount: 0,
      supercompressionScheme: KHR_SUPERCOMPRESSION_NONE,
      levels: [],
      dataFormatDescriptor: [{
        vendorId: KHR_DF_VENDORID_KHRONOS,
        descriptorType: KHR_DF_KHR_DESCRIPTORTYPE_BASICFORMAT,
        versionNumber: KHR_DF_VERSION,
        colorModel: KHR_DF_MODEL_UNSPECIFIED,
        colorPrimaries: KHR_DF_PRIMARIES_BT709,
        transferFunction: KHR_DF_TRANSFER_SRGB,
        flags: KHR_DF_FLAG_ALPHA_STRAIGHT,
        texelBlockDimension: [0, 0, 0, 0],
        bytesPlane: [0, 0, 0, 0, 0, 0, 0, 0],
        samples: []
      }],
      keyValue: {},
      globalData: null
    };
  }
  var BufferReader = class {
    constructor(data, byteOffset, byteLength, littleEndian) {
      this._dataView = void 0;
      this._littleEndian = void 0;
      this._offset = void 0;
      this._dataView = new DataView(data.buffer, data.byteOffset + byteOffset, byteLength);
      this._littleEndian = littleEndian;
      this._offset = 0;
    }
    _nextUint8() {
      const value = this._dataView.getUint8(this._offset);
      this._offset += 1;
      return value;
    }
    _nextUint16() {
      const value = this._dataView.getUint16(this._offset, this._littleEndian);
      this._offset += 2;
      return value;
    }
    _nextUint32() {
      const value = this._dataView.getUint32(this._offset, this._littleEndian);
      this._offset += 4;
      return value;
    }
    _nextUint64() {
      const left = this._dataView.getUint32(this._offset, this._littleEndian);
      const right = this._dataView.getUint32(this._offset + 4, this._littleEndian);
      const value = left + 2 ** 32 * right;
      this._offset += 8;
      return value;
    }
    _nextInt32() {
      const value = this._dataView.getInt32(this._offset, this._littleEndian);
      this._offset += 4;
      return value;
    }
    _nextUint8Array(len) {
      const value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, len);
      this._offset += len;
      return value;
    }
    _skip(bytes) {
      this._offset += bytes;
      return this;
    }
    _scan(maxByteLength, term = 0) {
      const byteOffset = this._offset;
      let byteLength = 0;
      while (this._dataView.getUint8(this._offset) !== term && byteLength < maxByteLength) {
        byteLength++;
        this._offset++;
      }
      if (byteLength < maxByteLength) this._offset++;
      return new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + byteOffset, byteLength);
    }
  };
  var NUL = new Uint8Array([0]);
  var KTX2_ID = [
    // '´', 'K', 'T', 'X', '2', '0', 'ª', '\r', '\n', '\x1A', '\n'
    171,
    75,
    84,
    88,
    32,
    50,
    48,
    187,
    13,
    10,
    26,
    10
  ];
  function decodeText(buffer) {
    return new TextDecoder().decode(buffer);
  }
  function read(data) {
    const id = new Uint8Array(data.buffer, data.byteOffset, KTX2_ID.length);
    if (id[0] !== KTX2_ID[0] || // '´'
    id[1] !== KTX2_ID[1] || // 'K'
    id[2] !== KTX2_ID[2] || // 'T'
    id[3] !== KTX2_ID[3] || // 'X'
    id[4] !== KTX2_ID[4] || // ' '
    id[5] !== KTX2_ID[5] || // '2'
    id[6] !== KTX2_ID[6] || // '0'
    id[7] !== KTX2_ID[7] || // 'ª'
    id[8] !== KTX2_ID[8] || // '\r'
    id[9] !== KTX2_ID[9] || // '\n'
    id[10] !== KTX2_ID[10] || // '\x1A'
    id[11] !== KTX2_ID[11]) {
      throw new Error("Missing KTX 2.0 identifier.");
    }
    const container = createDefaultContainer();
    const headerByteLength = 17 * Uint32Array.BYTES_PER_ELEMENT;
    const headerReader = new BufferReader(data, KTX2_ID.length, headerByteLength, true);
    container.vkFormat = headerReader._nextUint32();
    container.typeSize = headerReader._nextUint32();
    container.pixelWidth = headerReader._nextUint32();
    container.pixelHeight = headerReader._nextUint32();
    container.pixelDepth = headerReader._nextUint32();
    container.layerCount = headerReader._nextUint32();
    container.faceCount = headerReader._nextUint32();
    container.levelCount = headerReader._nextUint32();
    container.supercompressionScheme = headerReader._nextUint32();
    const dfdByteOffset = headerReader._nextUint32();
    const dfdByteLength = headerReader._nextUint32();
    const kvdByteOffset = headerReader._nextUint32();
    const kvdByteLength = headerReader._nextUint32();
    const sgdByteOffset = headerReader._nextUint64();
    const sgdByteLength = headerReader._nextUint64();
    const levelByteLength = Math.max(container.levelCount, 1) * 3 * 8;
    const levelReader = new BufferReader(data, KTX2_ID.length + headerByteLength, levelByteLength, true);
    for (let i = 0, il = Math.max(container.levelCount, 1); i < il; i++) {
      container.levels.push({
        levelData: new Uint8Array(data.buffer, data.byteOffset + levelReader._nextUint64(), levelReader._nextUint64()),
        uncompressedByteLength: levelReader._nextUint64()
      });
    }
    const dfdReader = new BufferReader(data, dfdByteOffset, dfdByteLength, true);
    dfdReader._skip(4);
    const vendorId = dfdReader._nextUint16();
    const descriptorType = dfdReader._nextUint16();
    const versionNumber = dfdReader._nextUint16();
    const descriptorBlockSize = dfdReader._nextUint16();
    const colorModel = dfdReader._nextUint8();
    const colorPrimaries = dfdReader._nextUint8();
    const transferFunction = dfdReader._nextUint8();
    const flags = dfdReader._nextUint8();
    const texelBlockDimension = [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()];
    const bytesPlane = [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()];
    const samples = [];
    const dfd = {
      vendorId,
      descriptorType,
      versionNumber,
      colorModel,
      colorPrimaries,
      transferFunction,
      flags,
      texelBlockDimension,
      bytesPlane,
      samples
    };
    const sampleStart = 6;
    const sampleWords = 4;
    const numSamples = (descriptorBlockSize / 4 - sampleStart) / sampleWords;
    for (let i = 0; i < numSamples; i++) {
      const sample = {
        bitOffset: dfdReader._nextUint16(),
        bitLength: dfdReader._nextUint8(),
        channelType: dfdReader._nextUint8(),
        samplePosition: [dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8(), dfdReader._nextUint8()],
        sampleLower: Number.NEGATIVE_INFINITY,
        sampleUpper: Number.POSITIVE_INFINITY
      };
      if (sample.channelType & KHR_DF_SAMPLE_DATATYPE_SIGNED) {
        sample.sampleLower = dfdReader._nextInt32();
        sample.sampleUpper = dfdReader._nextInt32();
      } else {
        sample.sampleLower = dfdReader._nextUint32();
        sample.sampleUpper = dfdReader._nextUint32();
      }
      dfd.samples[i] = sample;
    }
    container.dataFormatDescriptor.length = 0;
    container.dataFormatDescriptor.push(dfd);
    const kvdReader = new BufferReader(data, kvdByteOffset, kvdByteLength, true);
    while (kvdReader._offset < kvdByteLength) {
      const keyValueByteLength = kvdReader._nextUint32();
      const keyData = kvdReader._scan(keyValueByteLength);
      const key = decodeText(keyData);
      container.keyValue[key] = kvdReader._nextUint8Array(keyValueByteLength - keyData.byteLength - 1);
      if (key.match(/^ktx/i)) {
        const text = decodeText(container.keyValue[key]);
        container.keyValue[key] = text.substring(0, text.lastIndexOf("\0"));
      }
      const kvPadding = keyValueByteLength % 4 ? 4 - keyValueByteLength % 4 : 0;
      kvdReader._skip(kvPadding);
    }
    if (sgdByteLength <= 0) return container;
    const sgdReader = new BufferReader(data, sgdByteOffset, sgdByteLength, true);
    const endpointCount = sgdReader._nextUint16();
    const selectorCount = sgdReader._nextUint16();
    const endpointsByteLength = sgdReader._nextUint32();
    const selectorsByteLength = sgdReader._nextUint32();
    const tablesByteLength = sgdReader._nextUint32();
    const extendedByteLength = sgdReader._nextUint32();
    const imageDescs = [];
    for (let i = 0, il = Math.max(container.levelCount, 1); i < il; i++) {
      imageDescs.push({
        imageFlags: sgdReader._nextUint32(),
        rgbSliceByteOffset: sgdReader._nextUint32(),
        rgbSliceByteLength: sgdReader._nextUint32(),
        alphaSliceByteOffset: sgdReader._nextUint32(),
        alphaSliceByteLength: sgdReader._nextUint32()
      });
    }
    const endpointsByteOffset = sgdByteOffset + sgdReader._offset;
    const selectorsByteOffset = endpointsByteOffset + endpointsByteLength;
    const tablesByteOffset = selectorsByteOffset + selectorsByteLength;
    const extendedByteOffset = tablesByteOffset + tablesByteLength;
    const endpointsData = new Uint8Array(data.buffer, data.byteOffset + endpointsByteOffset, endpointsByteLength);
    const selectorsData = new Uint8Array(data.buffer, data.byteOffset + selectorsByteOffset, selectorsByteLength);
    const tablesData = new Uint8Array(data.buffer, data.byteOffset + tablesByteOffset, tablesByteLength);
    const extendedData = new Uint8Array(data.buffer, data.byteOffset + extendedByteOffset, extendedByteLength);
    container.globalData = {
      endpointCount,
      selectorCount,
      imageDescs,
      endpointsData,
      selectorsData,
      tablesData,
      extendedData
    };
    return container;
  }

  // node_modules/@gltf-transform/extensions/dist/index.modern.js
  var EXT_MESH_GPU_INSTANCING = "EXT_mesh_gpu_instancing";
  var EXT_MESHOPT_COMPRESSION = "EXT_meshopt_compression";
  var EXT_TEXTURE_WEBP = "EXT_texture_webp";
  var EXT_TEXTURE_AVIF = "EXT_texture_avif";
  var KHR_DRACO_MESH_COMPRESSION = "KHR_draco_mesh_compression";
  var KHR_LIGHTS_PUNCTUAL = "KHR_lights_punctual";
  var KHR_MATERIALS_ANISOTROPY = "KHR_materials_anisotropy";
  var KHR_MATERIALS_CLEARCOAT = "KHR_materials_clearcoat";
  var KHR_MATERIALS_DIFFUSE_TRANSMISSION = "KHR_materials_diffuse_transmission";
  var KHR_MATERIALS_DISPERSION = "KHR_materials_dispersion";
  var KHR_MATERIALS_EMISSIVE_STRENGTH = "KHR_materials_emissive_strength";
  var KHR_MATERIALS_IOR = "KHR_materials_ior";
  var KHR_MATERIALS_IRIDESCENCE = "KHR_materials_iridescence";
  var KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS = "KHR_materials_pbrSpecularGlossiness";
  var KHR_MATERIALS_SHEEN = "KHR_materials_sheen";
  var KHR_MATERIALS_SPECULAR = "KHR_materials_specular";
  var KHR_MATERIALS_TRANSMISSION = "KHR_materials_transmission";
  var KHR_MATERIALS_UNLIT = "KHR_materials_unlit";
  var KHR_MATERIALS_VOLUME = "KHR_materials_volume";
  var KHR_MATERIALS_VARIANTS = "KHR_materials_variants";
  var KHR_MESH_QUANTIZATION = "KHR_mesh_quantization";
  var KHR_NODE_VISIBILITY = "KHR_node_visibility";
  var KHR_TEXTURE_BASISU = "KHR_texture_basisu";
  var KHR_TEXTURE_TRANSFORM = "KHR_texture_transform";
  var KHR_XMP_JSON_LD = "KHR_xmp_json_ld";
  var INSTANCE_ATTRIBUTE = "INSTANCE_ATTRIBUTE";
  var InstancedMesh = class extends ExtensionProperty {
    init() {
      this.extensionName = EXT_MESH_GPU_INSTANCING;
      this.propertyType = "InstancedMesh";
      this.parentTypes = [PropertyType.NODE];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        attributes: new RefMap()
      });
    }
    /** Returns an instance attribute as an {@link Accessor}. */
    getAttribute(semantic) {
      return this.getRefMap("attributes", semantic);
    }
    /**
     * Sets an instance attribute to an {@link Accessor}. All attributes must have the same
     * instance count.
     */
    setAttribute(semantic, accessor) {
      return this.setRefMap("attributes", semantic, accessor, {
        usage: INSTANCE_ATTRIBUTE
      });
    }
    /**
     * Lists all instance attributes {@link Accessor}s associated with the InstancedMesh. Order
     * will be consistent with the order returned by {@link .listSemantics}().
     */
    listAttributes() {
      return this.listRefMapValues("attributes");
    }
    /**
     * Lists all instance attribute semantics associated with the primitive. Order will be
     * consistent with the order returned by {@link .listAttributes}().
     */
    listSemantics() {
      return this.listRefMapKeys("attributes");
    }
  };
  InstancedMesh.EXTENSION_NAME = EXT_MESH_GPU_INSTANCING;
  var EXTMeshGPUInstancing = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = EXT_MESH_GPU_INSTANCING;
      this.provideTypes = [PropertyType.NODE];
      this.prewriteTypes = [PropertyType.ACCESSOR];
    }
    /** Creates a new InstancedMesh property for use on a {@link Node}. */
    createInstancedMesh() {
      return new InstancedMesh(this.document.getGraph());
    }
    /** @hidden */
    read(context) {
      const jsonDoc = context.jsonDoc;
      const nodeDefs = jsonDoc.json.nodes || [];
      nodeDefs.forEach((nodeDef, nodeIndex) => {
        if (!nodeDef.extensions || !nodeDef.extensions[EXT_MESH_GPU_INSTANCING]) return;
        const instancedMeshDef = nodeDef.extensions[EXT_MESH_GPU_INSTANCING];
        const instancedMesh = this.createInstancedMesh();
        for (const semantic in instancedMeshDef.attributes) {
          instancedMesh.setAttribute(semantic, context.accessors[instancedMeshDef.attributes[semantic]]);
        }
        context.nodes[nodeIndex].setExtension(EXT_MESH_GPU_INSTANCING, instancedMesh);
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      context.accessorUsageGroupedByParent.add(INSTANCE_ATTRIBUTE);
      for (const prop of this.properties) {
        for (const attribute of prop.listAttributes()) {
          context.addAccessorToUsageGroup(attribute, INSTANCE_ATTRIBUTE);
        }
      }
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listNodes().forEach((node) => {
        const instancedMesh = node.getExtension(EXT_MESH_GPU_INSTANCING);
        if (instancedMesh) {
          const nodeIndex = context.nodeIndexMap.get(node);
          const nodeDef = jsonDoc.json.nodes[nodeIndex];
          const instancedMeshDef = {
            attributes: {}
          };
          instancedMesh.listSemantics().forEach((semantic) => {
            const attribute = instancedMesh.getAttribute(semantic);
            instancedMeshDef.attributes[semantic] = context.accessorIndexMap.get(attribute);
          });
          nodeDef.extensions = nodeDef.extensions || {};
          nodeDef.extensions[EXT_MESH_GPU_INSTANCING] = instancedMeshDef;
        }
      });
      return this;
    }
  };
  EXTMeshGPUInstancing.EXTENSION_NAME = EXT_MESH_GPU_INSTANCING;
  function _extends2() {
    return _extends2 = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends2.apply(null, arguments);
  }
  var EncoderMethod$1;
  (function(EncoderMethod2) {
    EncoderMethod2["QUANTIZE"] = "quantize";
    EncoderMethod2["FILTER"] = "filter";
  })(EncoderMethod$1 || (EncoderMethod$1 = {}));
  var MeshoptMode;
  (function(MeshoptMode2) {
    MeshoptMode2["ATTRIBUTES"] = "ATTRIBUTES";
    MeshoptMode2["TRIANGLES"] = "TRIANGLES";
    MeshoptMode2["INDICES"] = "INDICES";
  })(MeshoptMode || (MeshoptMode = {}));
  var MeshoptFilter;
  (function(MeshoptFilter2) {
    MeshoptFilter2["NONE"] = "NONE";
    MeshoptFilter2["OCTAHEDRAL"] = "OCTAHEDRAL";
    MeshoptFilter2["QUATERNION"] = "QUATERNION";
    MeshoptFilter2["EXPONENTIAL"] = "EXPONENTIAL";
  })(MeshoptFilter || (MeshoptFilter = {}));
  function isFallbackBuffer(bufferDef) {
    if (!bufferDef.extensions || !bufferDef.extensions[EXT_MESHOPT_COMPRESSION]) return false;
    const fallbackDef = bufferDef.extensions[EXT_MESHOPT_COMPRESSION];
    return !!fallbackDef.fallback;
  }
  var {
    BYTE,
    SHORT,
    FLOAT
  } = Accessor.ComponentType;
  var {
    encodeNormalizedInt,
    decodeNormalizedInt
  } = MathUtils;
  function prepareAccessor(accessor, encoder, mode, filterOptions) {
    const {
      filter,
      bits
    } = filterOptions;
    const result = {
      array: accessor.getArray(),
      byteStride: accessor.getElementSize() * accessor.getComponentSize(),
      componentType: accessor.getComponentType(),
      normalized: accessor.getNormalized()
    };
    if (mode !== MeshoptMode.ATTRIBUTES) return result;
    if (filter !== MeshoptFilter.NONE) {
      let array = accessor.getNormalized() ? decodeNormalizedIntArray(accessor) : new Float32Array(result.array);
      switch (filter) {
        case MeshoptFilter.EXPONENTIAL:
          result.byteStride = accessor.getElementSize() * 4;
          result.componentType = FLOAT;
          result.normalized = false;
          result.array = encoder.encodeFilterExp(array, accessor.getCount(), result.byteStride, bits);
          break;
        case MeshoptFilter.OCTAHEDRAL:
          result.byteStride = bits > 8 ? 8 : 4;
          result.componentType = bits > 8 ? SHORT : BYTE;
          result.normalized = true;
          array = accessor.getElementSize() === 3 ? padNormals(array) : array;
          result.array = encoder.encodeFilterOct(array, accessor.getCount(), result.byteStride, bits);
          break;
        case MeshoptFilter.QUATERNION:
          result.byteStride = 8;
          result.componentType = SHORT;
          result.normalized = true;
          result.array = encoder.encodeFilterQuat(array, accessor.getCount(), result.byteStride, bits);
          break;
        default:
          throw new Error("Invalid filter.");
      }
      result.min = accessor.getMin([]);
      result.max = accessor.getMax([]);
      if (accessor.getNormalized()) {
        result.min = result.min.map((v) => decodeNormalizedInt(v, accessor.getComponentType()));
        result.max = result.max.map((v) => decodeNormalizedInt(v, accessor.getComponentType()));
      }
      if (result.normalized) {
        result.min = result.min.map((v) => encodeNormalizedInt(v, result.componentType));
        result.max = result.max.map((v) => encodeNormalizedInt(v, result.componentType));
      }
    } else if (result.byteStride % 4) {
      result.array = padArrayElements(result.array, accessor.getElementSize());
      result.byteStride = result.array.byteLength / accessor.getCount();
    }
    return result;
  }
  function decodeNormalizedIntArray(attribute) {
    const componentType = attribute.getComponentType();
    const srcArray = attribute.getArray();
    const dstArray = new Float32Array(srcArray.length);
    for (let i = 0; i < srcArray.length; i++) {
      dstArray[i] = decodeNormalizedInt(srcArray[i], componentType);
    }
    return dstArray;
  }
  function padArrayElements(srcArray, elementSize) {
    const byteStride = BufferUtils.padNumber(srcArray.BYTES_PER_ELEMENT * elementSize);
    const elementStride = byteStride / srcArray.BYTES_PER_ELEMENT;
    const elementCount = srcArray.length / elementSize;
    const dstArray = new srcArray.constructor(elementCount * elementStride);
    for (let i = 0; i * elementSize < srcArray.length; i++) {
      for (let j = 0; j < elementSize; j++) {
        dstArray[i * elementStride + j] = srcArray[i * elementSize + j];
      }
    }
    return dstArray;
  }
  function padNormals(srcArray) {
    const dstArray = new Float32Array(srcArray.length * 4 / 3);
    for (let i = 0, il = srcArray.length / 3; i < il; i++) {
      dstArray[i * 4] = srcArray[i * 3];
      dstArray[i * 4 + 1] = srcArray[i * 3 + 1];
      dstArray[i * 4 + 2] = srcArray[i * 3 + 2];
    }
    return dstArray;
  }
  function getMeshoptMode(accessor, usage) {
    if (usage === WriterContext.BufferViewUsage.ELEMENT_ARRAY_BUFFER) {
      const isTriangles = accessor.listParents().some((parent) => {
        return parent instanceof Primitive && parent.getMode() === Primitive.Mode.TRIANGLES;
      });
      return isTriangles ? MeshoptMode.TRIANGLES : MeshoptMode.INDICES;
    }
    return MeshoptMode.ATTRIBUTES;
  }
  function getMeshoptFilter(accessor, doc) {
    const refs = doc.getGraph().listParentEdges(accessor).filter((edge) => !(edge.getParent() instanceof Root));
    for (const ref of refs) {
      const refName = ref.getName();
      const refKey = ref.getAttributes().key || "";
      const isDelta = ref.getParent().propertyType === PropertyType.PRIMITIVE_TARGET;
      if (refName === "indices") return {
        filter: MeshoptFilter.NONE
      };
      if (refName === "attributes") {
        if (refKey === "POSITION") return {
          filter: MeshoptFilter.NONE
        };
        if (refKey === "TEXCOORD_0") return {
          filter: MeshoptFilter.NONE
        };
        if (refKey.startsWith("JOINTS_")) return {
          filter: MeshoptFilter.NONE
        };
        if (refKey.startsWith("WEIGHTS_")) return {
          filter: MeshoptFilter.NONE
        };
        if (refKey === "NORMAL" || refKey === "TANGENT") {
          return isDelta ? {
            filter: MeshoptFilter.NONE
          } : {
            filter: MeshoptFilter.OCTAHEDRAL,
            bits: 8
          };
        }
      }
      if (refName === "output") {
        const targetPath = getTargetPath(accessor);
        if (targetPath === "rotation") return {
          filter: MeshoptFilter.QUATERNION,
          bits: 16
        };
        if (targetPath === "translation") return {
          filter: MeshoptFilter.EXPONENTIAL,
          bits: 12
        };
        if (targetPath === "scale") return {
          filter: MeshoptFilter.EXPONENTIAL,
          bits: 12
        };
        return {
          filter: MeshoptFilter.NONE
        };
      }
      if (refName === "input") return {
        filter: MeshoptFilter.NONE
      };
      if (refName === "inverseBindMatrices") return {
        filter: MeshoptFilter.NONE
      };
    }
    return {
      filter: MeshoptFilter.NONE
    };
  }
  function getTargetPath(accessor) {
    for (const sampler of accessor.listParents()) {
      if (!(sampler instanceof AnimationSampler)) continue;
      for (const channel of sampler.listParents()) {
        if (!(channel instanceof AnimationChannel)) continue;
        return channel.getTargetPath();
      }
    }
    return null;
  }
  var DEFAULT_ENCODER_OPTIONS$1 = {
    method: EncoderMethod$1.QUANTIZE
  };
  var EXTMeshoptCompression = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = EXT_MESHOPT_COMPRESSION;
      this.prereadTypes = [PropertyType.BUFFER, PropertyType.PRIMITIVE];
      this.prewriteTypes = [PropertyType.BUFFER, PropertyType.ACCESSOR];
      this.readDependencies = ["meshopt.decoder"];
      this.writeDependencies = ["meshopt.encoder"];
      this._decoder = null;
      this._decoderFallbackBufferMap = /* @__PURE__ */ new Map();
      this._encoder = null;
      this._encoderOptions = DEFAULT_ENCODER_OPTIONS$1;
      this._encoderFallbackBuffer = null;
      this._encoderBufferViews = {};
      this._encoderBufferViewData = {};
      this._encoderBufferViewAccessors = {};
    }
    /** @hidden */
    install(key, dependency) {
      if (key === "meshopt.decoder") {
        this._decoder = dependency;
      }
      if (key === "meshopt.encoder") {
        this._encoder = dependency;
      }
      return this;
    }
    /**
     * Configures Meshopt options for quality/compression tuning. The two methods rely on different
     * pre-processing before compression, and should be compared on the basis of (a) quality/loss
     * and (b) final asset size after _also_ applying a lossless compression such as gzip or brotli.
     *
     * - QUANTIZE: Default. Pre-process with {@link quantize quantize()} (lossy to specified
     * 	precision) before applying lossless Meshopt compression. Offers a considerable compression
     * 	ratio with or without further supercompression. Equivalent to `gltfpack -c`.
     * - FILTER: Pre-process with lossy filters to improve compression, before applying lossless
     *	Meshopt compression. While output may initially be larger than with the QUANTIZE method,
     *	this method will benefit more from supercompression (e.g. gzip or brotli). Equivalent to
     * 	`gltfpack -cc`.
     *
     * Output with the FILTER method will generally be smaller after supercompression (e.g. gzip or
     * brotli) is applied, but may be larger than QUANTIZE output without it. Decoding is very fast
     * with both methods.
     *
     * Example:
     *
     * ```ts
     * import { EXTMeshoptCompression } from '@gltf-transform/extensions';
     *
     * doc.createExtension(EXTMeshoptCompression)
     * 	.setRequired(true)
     * 	.setEncoderOptions({
     * 		method: EXTMeshoptCompression.EncoderMethod.QUANTIZE
     * 	});
     * ```
     */
    setEncoderOptions(options) {
      this._encoderOptions = _extends2({}, DEFAULT_ENCODER_OPTIONS$1, options);
      return this;
    }
    /**********************************************************************************************
     * Decoding.
     */
    /** @internal Checks preconditions, decodes buffer views, and creates decoded primitives. */
    preread(context, propertyType) {
      if (!this._decoder) {
        if (!this.isRequired()) return this;
        throw new Error(`[${EXT_MESHOPT_COMPRESSION}] Please install extension dependency, "meshopt.decoder".`);
      }
      if (!this._decoder.supported) {
        if (!this.isRequired()) return this;
        throw new Error(`[${EXT_MESHOPT_COMPRESSION}]: Missing WASM support.`);
      }
      if (propertyType === PropertyType.BUFFER) {
        this._prereadBuffers(context);
      } else if (propertyType === PropertyType.PRIMITIVE) {
        this._prereadPrimitives(context);
      }
      return this;
    }
    /** @internal Decode buffer views. */
    _prereadBuffers(context) {
      const jsonDoc = context.jsonDoc;
      const viewDefs = jsonDoc.json.bufferViews || [];
      viewDefs.forEach((viewDef, index) => {
        if (!viewDef.extensions || !viewDef.extensions[EXT_MESHOPT_COMPRESSION]) return;
        const meshoptDef = viewDef.extensions[EXT_MESHOPT_COMPRESSION];
        const byteOffset = meshoptDef.byteOffset || 0;
        const byteLength = meshoptDef.byteLength || 0;
        const count = meshoptDef.count;
        const stride = meshoptDef.byteStride;
        const result = new Uint8Array(count * stride);
        const bufferDef = jsonDoc.json.buffers[meshoptDef.buffer];
        const resource = bufferDef.uri ? jsonDoc.resources[bufferDef.uri] : jsonDoc.resources[GLB_BUFFER];
        const source = BufferUtils.toView(resource, byteOffset, byteLength);
        this._decoder.decodeGltfBuffer(result, count, stride, source, meshoptDef.mode, meshoptDef.filter);
        context.bufferViews[index] = result;
      });
    }
    /**
     * Mark fallback buffers and replacements.
     *
     * Note: Alignment with primitives is arbitrary; this just needs to happen
     * after Buffers have been parsed.
     * @internal
     */
    _prereadPrimitives(context) {
      const jsonDoc = context.jsonDoc;
      const viewDefs = jsonDoc.json.bufferViews || [];
      viewDefs.forEach((viewDef) => {
        if (!viewDef.extensions || !viewDef.extensions[EXT_MESHOPT_COMPRESSION]) return;
        const meshoptDef = viewDef.extensions[EXT_MESHOPT_COMPRESSION];
        const buffer = context.buffers[meshoptDef.buffer];
        const fallbackBuffer = context.buffers[viewDef.buffer];
        const fallbackBufferDef = jsonDoc.json.buffers[viewDef.buffer];
        if (isFallbackBuffer(fallbackBufferDef)) {
          this._decoderFallbackBufferMap.set(fallbackBuffer, buffer);
        }
      });
    }
    /** @hidden Removes Fallback buffers, if extension is required. */
    read(_context) {
      if (!this.isRequired()) return this;
      for (const [fallbackBuffer, buffer] of this._decoderFallbackBufferMap) {
        for (const parent of fallbackBuffer.listParents()) {
          if (parent instanceof Accessor) {
            parent.swap(fallbackBuffer, buffer);
          }
        }
        fallbackBuffer.dispose();
      }
      return this;
    }
    /**********************************************************************************************
     * Encoding.
     */
    /** @internal Claims accessors that can be compressed and writes compressed buffer views. */
    prewrite(context, propertyType) {
      if (propertyType === PropertyType.ACCESSOR) {
        this._prewriteAccessors(context);
      } else if (propertyType === PropertyType.BUFFER) {
        this._prewriteBuffers(context);
      }
      return this;
    }
    /** @internal Claims accessors that can be compressed. */
    _prewriteAccessors(context) {
      const json = context.jsonDoc.json;
      const encoder = this._encoder;
      const options = this._encoderOptions;
      const graph = this.document.getGraph();
      const fallbackBuffer = this.document.createBuffer();
      const fallbackBufferIndex = this.document.getRoot().listBuffers().indexOf(fallbackBuffer);
      let nextID = 1;
      const parentToID = /* @__PURE__ */ new Map();
      const getParentID = (property) => {
        for (const parent of graph.listParents(property)) {
          if (parent.propertyType === PropertyType.ROOT) continue;
          let id = parentToID.get(property);
          if (id === void 0) parentToID.set(property, id = nextID++);
          return id;
        }
        return -1;
      };
      this._encoderFallbackBuffer = fallbackBuffer;
      this._encoderBufferViews = {};
      this._encoderBufferViewData = {};
      this._encoderBufferViewAccessors = {};
      for (const accessor of this.document.getRoot().listAccessors()) {
        if (getTargetPath(accessor) === "weights") continue;
        if (accessor.getSparse()) continue;
        const usage = context.getAccessorUsage(accessor);
        const parentID = context.accessorUsageGroupedByParent.has(usage) ? getParentID(accessor) : null;
        const mode = getMeshoptMode(accessor, usage);
        const filter = options.method === EncoderMethod$1.FILTER ? getMeshoptFilter(accessor, this.document) : {
          filter: MeshoptFilter.NONE
        };
        const preparedAccessor = prepareAccessor(accessor, encoder, mode, filter);
        const {
          array,
          byteStride
        } = preparedAccessor;
        const buffer = accessor.getBuffer();
        if (!buffer) throw new Error(`${EXT_MESHOPT_COMPRESSION}: Missing buffer for accessor.`);
        const bufferIndex = this.document.getRoot().listBuffers().indexOf(buffer);
        const key = [usage, parentID, mode, filter.filter, byteStride, bufferIndex].join(":");
        let bufferView = this._encoderBufferViews[key];
        let bufferViewData = this._encoderBufferViewData[key];
        let bufferViewAccessors = this._encoderBufferViewAccessors[key];
        if (!bufferView || !bufferViewData) {
          bufferViewAccessors = this._encoderBufferViewAccessors[key] = [];
          bufferViewData = this._encoderBufferViewData[key] = [];
          bufferView = this._encoderBufferViews[key] = {
            buffer: fallbackBufferIndex,
            target: WriterContext.USAGE_TO_TARGET[usage],
            byteOffset: 0,
            byteLength: 0,
            byteStride: usage === WriterContext.BufferViewUsage.ARRAY_BUFFER ? byteStride : void 0,
            extensions: {
              [EXT_MESHOPT_COMPRESSION]: {
                buffer: bufferIndex,
                byteOffset: 0,
                byteLength: 0,
                mode,
                filter: filter.filter !== MeshoptFilter.NONE ? filter.filter : void 0,
                byteStride,
                count: 0
              }
            }
          };
        }
        const accessorDef = context.createAccessorDef(accessor);
        accessorDef.componentType = preparedAccessor.componentType;
        accessorDef.normalized = preparedAccessor.normalized;
        accessorDef.byteOffset = bufferView.byteLength;
        if (accessorDef.min && preparedAccessor.min) accessorDef.min = preparedAccessor.min;
        if (accessorDef.max && preparedAccessor.max) accessorDef.max = preparedAccessor.max;
        context.accessorIndexMap.set(accessor, json.accessors.length);
        json.accessors.push(accessorDef);
        bufferViewAccessors.push(accessorDef);
        bufferViewData.push(new Uint8Array(array.buffer, array.byteOffset, array.byteLength));
        bufferView.byteLength += array.byteLength;
        bufferView.extensions.EXT_meshopt_compression.count += accessor.getCount();
      }
    }
    /** @internal Writes compressed buffer views. */
    _prewriteBuffers(context) {
      const encoder = this._encoder;
      for (const key in this._encoderBufferViews) {
        const bufferView = this._encoderBufferViews[key];
        const bufferViewData = this._encoderBufferViewData[key];
        const buffer = this.document.getRoot().listBuffers()[bufferView.extensions[EXT_MESHOPT_COMPRESSION].buffer];
        const otherBufferViews = context.otherBufferViews.get(buffer) || [];
        const {
          count,
          byteStride,
          mode
        } = bufferView.extensions[EXT_MESHOPT_COMPRESSION];
        const srcArray = BufferUtils.concat(bufferViewData);
        const dstArray = encoder.encodeGltfBuffer(srcArray, count, byteStride, mode);
        const compressedData = BufferUtils.pad(dstArray);
        bufferView.extensions[EXT_MESHOPT_COMPRESSION].byteLength = dstArray.byteLength;
        bufferViewData.length = 0;
        bufferViewData.push(compressedData);
        otherBufferViews.push(compressedData);
        context.otherBufferViews.set(buffer, otherBufferViews);
      }
    }
    /** @hidden Puts encoded data into glTF output. */
    write(context) {
      let fallbackBufferByteOffset = 0;
      for (const key in this._encoderBufferViews) {
        const bufferView = this._encoderBufferViews[key];
        const bufferViewData = this._encoderBufferViewData[key][0];
        const bufferViewIndex = context.otherBufferViewsIndexMap.get(bufferViewData);
        const bufferViewAccessors = this._encoderBufferViewAccessors[key];
        for (const accessorDef of bufferViewAccessors) {
          accessorDef.bufferView = bufferViewIndex;
        }
        const finalBufferViewDef = context.jsonDoc.json.bufferViews[bufferViewIndex];
        const compressedByteOffset = finalBufferViewDef.byteOffset || 0;
        Object.assign(finalBufferViewDef, bufferView);
        finalBufferViewDef.byteOffset = fallbackBufferByteOffset;
        const bufferViewExtensionDef = finalBufferViewDef.extensions[EXT_MESHOPT_COMPRESSION];
        bufferViewExtensionDef.byteOffset = compressedByteOffset;
        fallbackBufferByteOffset += BufferUtils.padNumber(bufferView.byteLength);
      }
      const fallbackBuffer = this._encoderFallbackBuffer;
      const fallbackBufferIndex = context.bufferIndexMap.get(fallbackBuffer);
      const fallbackBufferDef = context.jsonDoc.json.buffers[fallbackBufferIndex];
      fallbackBufferDef.byteLength = fallbackBufferByteOffset;
      fallbackBufferDef.extensions = {
        [EXT_MESHOPT_COMPRESSION]: {
          fallback: true
        }
      };
      fallbackBuffer.dispose();
      return this;
    }
  };
  EXTMeshoptCompression.EXTENSION_NAME = EXT_MESHOPT_COMPRESSION;
  EXTMeshoptCompression.EncoderMethod = EncoderMethod$1;
  var AVIFImageUtils = class {
    match(array) {
      return array.length >= 12 && BufferUtils.decodeText(array.slice(4, 12)) === "ftypavif";
    }
    /**
     * Probes size of AVIF or HEIC image. Assumes a single static image, without
     * orientation or other metadata that would affect dimensions.
     */
    getSize(array) {
      if (!this.match(array)) return null;
      const view = new DataView(array.buffer, array.byteOffset, array.byteLength);
      let box = unbox(view, 0);
      if (!box) return null;
      let offset = box.end;
      while (box = unbox(view, offset)) {
        if (box.type === "meta") {
          offset = box.start + 4;
        } else if (box.type === "iprp" || box.type === "ipco") {
          offset = box.start;
        } else if (box.type === "ispe") {
          return [view.getUint32(box.start + 4), view.getUint32(box.start + 8)];
        } else if (box.type === "mdat") {
          break;
        } else {
          offset = box.end;
        }
      }
      return null;
    }
    getChannels(_buffer) {
      return 4;
    }
  };
  var EXTTextureAVIF = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = EXT_TEXTURE_AVIF;
      this.prereadTypes = [PropertyType.TEXTURE];
    }
    /** @hidden */
    static register() {
      ImageUtils.registerFormat("image/avif", new AVIFImageUtils());
    }
    /** @hidden */
    preread(context) {
      const textureDefs = context.jsonDoc.json.textures || [];
      textureDefs.forEach((textureDef) => {
        if (textureDef.extensions && textureDef.extensions[EXT_TEXTURE_AVIF]) {
          textureDef.source = textureDef.extensions[EXT_TEXTURE_AVIF].source;
        }
      });
      return this;
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listTextures().forEach((texture) => {
        if (texture.getMimeType() === "image/avif") {
          const imageIndex = context.imageIndexMap.get(texture);
          const textureDefs = jsonDoc.json.textures || [];
          textureDefs.forEach((textureDef) => {
            if (textureDef.source === imageIndex) {
              textureDef.extensions = textureDef.extensions || {};
              textureDef.extensions[EXT_TEXTURE_AVIF] = {
                source: textureDef.source
              };
              delete textureDef.source;
            }
          });
        }
      });
      return this;
    }
  };
  EXTTextureAVIF.EXTENSION_NAME = EXT_TEXTURE_AVIF;
  function unbox(data, offset) {
    if (data.byteLength < 4 + offset) return null;
    const size = data.getUint32(offset);
    if (data.byteLength < size + offset || size < 8) return null;
    return {
      type: BufferUtils.decodeText(new Uint8Array(data.buffer, data.byteOffset + offset + 4, 4)),
      start: offset + 8,
      end: offset + size
    };
  }
  var WEBPImageUtils = class {
    match(array) {
      return array.length >= 12 && array[8] === 87 && array[9] === 69 && array[10] === 66 && array[11] === 80;
    }
    getSize(array) {
      const RIFF = BufferUtils.decodeText(array.slice(0, 4));
      const WEBP = BufferUtils.decodeText(array.slice(8, 12));
      if (RIFF !== "RIFF" || WEBP !== "WEBP") return null;
      const view = new DataView(array.buffer, array.byteOffset);
      let offset = 12;
      while (offset < view.byteLength) {
        const chunkId = BufferUtils.decodeText(new Uint8Array([view.getUint8(offset), view.getUint8(offset + 1), view.getUint8(offset + 2), view.getUint8(offset + 3)]));
        const chunkByteLength = view.getUint32(offset + 4, true);
        if (chunkId === "VP8 ") {
          const width = view.getInt16(offset + 14, true) & 16383;
          const height = view.getInt16(offset + 16, true) & 16383;
          return [width, height];
        } else if (chunkId === "VP8L") {
          const b0 = view.getUint8(offset + 9);
          const b1 = view.getUint8(offset + 10);
          const b2 = view.getUint8(offset + 11);
          const b3 = view.getUint8(offset + 12);
          const width = 1 + ((b1 & 63) << 8 | b0);
          const height = 1 + ((b3 & 15) << 10 | b2 << 2 | (b1 & 192) >> 6);
          return [width, height];
        }
        offset += 8 + chunkByteLength + chunkByteLength % 2;
      }
      return null;
    }
    getChannels(_buffer) {
      return 4;
    }
  };
  var EXTTextureWebP = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = EXT_TEXTURE_WEBP;
      this.prereadTypes = [PropertyType.TEXTURE];
    }
    /** @hidden */
    static register() {
      ImageUtils.registerFormat("image/webp", new WEBPImageUtils());
    }
    /** @hidden */
    preread(context) {
      const textureDefs = context.jsonDoc.json.textures || [];
      textureDefs.forEach((textureDef) => {
        if (textureDef.extensions && textureDef.extensions[EXT_TEXTURE_WEBP]) {
          textureDef.source = textureDef.extensions[EXT_TEXTURE_WEBP].source;
        }
      });
      return this;
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listTextures().forEach((texture) => {
        if (texture.getMimeType() === "image/webp") {
          const imageIndex = context.imageIndexMap.get(texture);
          const textureDefs = jsonDoc.json.textures || [];
          textureDefs.forEach((textureDef) => {
            if (textureDef.source === imageIndex) {
              textureDef.extensions = textureDef.extensions || {};
              textureDef.extensions[EXT_TEXTURE_WEBP] = {
                source: textureDef.source
              };
              delete textureDef.source;
            }
          });
        }
      });
      return this;
    }
  };
  EXTTextureWebP.EXTENSION_NAME = EXT_TEXTURE_WEBP;
  var decoderModule;
  var COMPONENT_ARRAY;
  var DATA_TYPE;
  function decodeGeometry(decoder, data) {
    const buffer = new decoderModule.DecoderBuffer();
    try {
      buffer.Init(data, data.length);
      const geometryType = decoder.GetEncodedGeometryType(buffer);
      if (geometryType !== decoderModule.TRIANGULAR_MESH) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Unknown geometry type.`);
      }
      const dracoMesh = new decoderModule.Mesh();
      const status = decoder.DecodeBufferToMesh(buffer, dracoMesh);
      if (!status.ok() || dracoMesh.ptr === 0) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Decoding failure.`);
      }
      return dracoMesh;
    } finally {
      decoderModule.destroy(buffer);
    }
  }
  function decodeIndex(decoder, mesh) {
    const numFaces = mesh.num_faces();
    const numIndices = numFaces * 3;
    let ptr;
    let indices;
    if (mesh.num_points() <= 65534) {
      const byteLength = numIndices * Uint16Array.BYTES_PER_ELEMENT;
      ptr = decoderModule._malloc(byteLength);
      decoder.GetTrianglesUInt16Array(mesh, byteLength, ptr);
      indices = new Uint16Array(decoderModule.HEAPU16.buffer, ptr, numIndices).slice();
    } else {
      const byteLength = numIndices * Uint32Array.BYTES_PER_ELEMENT;
      ptr = decoderModule._malloc(byteLength);
      decoder.GetTrianglesUInt32Array(mesh, byteLength, ptr);
      indices = new Uint32Array(decoderModule.HEAPU32.buffer, ptr, numIndices).slice();
    }
    decoderModule._free(ptr);
    return indices;
  }
  function decodeAttribute(decoder, mesh, attribute, accessorDef) {
    const dataType = DATA_TYPE[accessorDef.componentType];
    const ArrayCtor = COMPONENT_ARRAY[accessorDef.componentType];
    const numComponents = attribute.num_components();
    const numPoints = mesh.num_points();
    const numValues = numPoints * numComponents;
    const byteLength = numValues * ArrayCtor.BYTES_PER_ELEMENT;
    const ptr = decoderModule._malloc(byteLength);
    decoder.GetAttributeDataArrayForAllPoints(mesh, attribute, dataType, byteLength, ptr);
    const array = new ArrayCtor(decoderModule.HEAPF32.buffer, ptr, numValues).slice();
    decoderModule._free(ptr);
    return array;
  }
  function initDecoderModule(_decoderModule) {
    decoderModule = _decoderModule;
    COMPONENT_ARRAY = {
      [Accessor.ComponentType.FLOAT]: Float32Array,
      [Accessor.ComponentType.UNSIGNED_INT]: Uint32Array,
      [Accessor.ComponentType.UNSIGNED_SHORT]: Uint16Array,
      [Accessor.ComponentType.UNSIGNED_BYTE]: Uint8Array,
      [Accessor.ComponentType.SHORT]: Int16Array,
      [Accessor.ComponentType.BYTE]: Int8Array
    };
    DATA_TYPE = {
      [Accessor.ComponentType.FLOAT]: decoderModule.DT_FLOAT32,
      [Accessor.ComponentType.UNSIGNED_INT]: decoderModule.DT_UINT32,
      [Accessor.ComponentType.UNSIGNED_SHORT]: decoderModule.DT_UINT16,
      [Accessor.ComponentType.UNSIGNED_BYTE]: decoderModule.DT_UINT8,
      [Accessor.ComponentType.SHORT]: decoderModule.DT_INT16,
      [Accessor.ComponentType.BYTE]: decoderModule.DT_INT8
    };
  }
  var encoderModule;
  var EncoderMethod;
  (function(EncoderMethod2) {
    EncoderMethod2[EncoderMethod2["EDGEBREAKER"] = 1] = "EDGEBREAKER";
    EncoderMethod2[EncoderMethod2["SEQUENTIAL"] = 0] = "SEQUENTIAL";
  })(EncoderMethod || (EncoderMethod = {}));
  var AttributeEnum;
  (function(AttributeEnum2) {
    AttributeEnum2["POSITION"] = "POSITION";
    AttributeEnum2["NORMAL"] = "NORMAL";
    AttributeEnum2["COLOR"] = "COLOR";
    AttributeEnum2["TEX_COORD"] = "TEX_COORD";
    AttributeEnum2["GENERIC"] = "GENERIC";
  })(AttributeEnum || (AttributeEnum = {}));
  var DEFAULT_QUANTIZATION_BITS = {
    [AttributeEnum.POSITION]: 14,
    [AttributeEnum.NORMAL]: 10,
    [AttributeEnum.COLOR]: 8,
    [AttributeEnum.TEX_COORD]: 12,
    [AttributeEnum.GENERIC]: 12
  };
  var DEFAULT_ENCODER_OPTIONS = {
    decodeSpeed: 5,
    encodeSpeed: 5,
    method: EncoderMethod.EDGEBREAKER,
    quantizationBits: DEFAULT_QUANTIZATION_BITS,
    quantizationVolume: "mesh"
  };
  function initEncoderModule(_encoderModule) {
    encoderModule = _encoderModule;
  }
  function encodeGeometry(prim, _options = DEFAULT_ENCODER_OPTIONS) {
    const options = _extends2({}, DEFAULT_ENCODER_OPTIONS, _options);
    options.quantizationBits = _extends2({}, DEFAULT_QUANTIZATION_BITS, _options.quantizationBits);
    const builder = new encoderModule.MeshBuilder();
    const mesh = new encoderModule.Mesh();
    const encoder = new encoderModule.ExpertEncoder(mesh);
    const attributeIDs = {};
    const dracoBuffer = new encoderModule.DracoInt8Array();
    const hasMorphTargets = prim.listTargets().length > 0;
    let hasSparseAttributes = false;
    for (const semantic of prim.listSemantics()) {
      const attribute = prim.getAttribute(semantic);
      if (attribute.getSparse()) {
        hasSparseAttributes = true;
        continue;
      }
      const attributeEnum = getAttributeEnum(semantic);
      const attributeID = addAttribute(builder, attribute.getComponentType(), mesh, encoderModule[attributeEnum], attribute.getCount(), attribute.getElementSize(), attribute.getArray());
      if (attributeID === -1) throw new Error(`Error compressing "${semantic}" attribute.`);
      attributeIDs[semantic] = attributeID;
      if (options.quantizationVolume === "mesh" || semantic !== "POSITION") {
        encoder.SetAttributeQuantization(attributeID, options.quantizationBits[attributeEnum]);
      } else if (typeof options.quantizationVolume === "object") {
        const {
          quantizationVolume
        } = options;
        const range = Math.max(quantizationVolume.max[0] - quantizationVolume.min[0], quantizationVolume.max[1] - quantizationVolume.min[1], quantizationVolume.max[2] - quantizationVolume.min[2]);
        encoder.SetAttributeExplicitQuantization(attributeID, options.quantizationBits[attributeEnum], attribute.getElementSize(), quantizationVolume.min, range);
      } else {
        throw new Error("Invalid quantization volume state.");
      }
    }
    const indices = prim.getIndices();
    if (!indices) throw new EncodingError("Primitive must have indices.");
    builder.AddFacesToMesh(mesh, indices.getCount() / 3, indices.getArray());
    encoder.SetSpeedOptions(options.encodeSpeed, options.decodeSpeed);
    encoder.SetTrackEncodedProperties(true);
    if (options.method === EncoderMethod.SEQUENTIAL || hasMorphTargets || hasSparseAttributes) {
      encoder.SetEncodingMethod(encoderModule.MESH_SEQUENTIAL_ENCODING);
    } else {
      encoder.SetEncodingMethod(encoderModule.MESH_EDGEBREAKER_ENCODING);
    }
    const byteLength = encoder.EncodeToDracoBuffer(!(hasMorphTargets || hasSparseAttributes), dracoBuffer);
    if (byteLength <= 0) throw new EncodingError("Error applying Draco compression.");
    const data = new Uint8Array(byteLength);
    for (let i = 0; i < byteLength; ++i) {
      data[i] = dracoBuffer.GetValue(i);
    }
    const numVertices = encoder.GetNumberOfEncodedPoints();
    const numIndices = encoder.GetNumberOfEncodedFaces() * 3;
    encoderModule.destroy(dracoBuffer);
    encoderModule.destroy(mesh);
    encoderModule.destroy(builder);
    encoderModule.destroy(encoder);
    return {
      numVertices,
      numIndices,
      data,
      attributeIDs
    };
  }
  function getAttributeEnum(semantic) {
    if (semantic === "POSITION") {
      return AttributeEnum.POSITION;
    } else if (semantic === "NORMAL") {
      return AttributeEnum.NORMAL;
    } else if (semantic.startsWith("COLOR_")) {
      return AttributeEnum.COLOR;
    } else if (semantic.startsWith("TEXCOORD_")) {
      return AttributeEnum.TEX_COORD;
    }
    return AttributeEnum.GENERIC;
  }
  function addAttribute(builder, componentType, mesh, attribute, count, itemSize, array) {
    switch (componentType) {
      case Accessor.ComponentType.UNSIGNED_BYTE:
        return builder.AddUInt8Attribute(mesh, attribute, count, itemSize, array);
      case Accessor.ComponentType.BYTE:
        return builder.AddInt8Attribute(mesh, attribute, count, itemSize, array);
      case Accessor.ComponentType.UNSIGNED_SHORT:
        return builder.AddUInt16Attribute(mesh, attribute, count, itemSize, array);
      case Accessor.ComponentType.SHORT:
        return builder.AddInt16Attribute(mesh, attribute, count, itemSize, array);
      case Accessor.ComponentType.UNSIGNED_INT:
        return builder.AddUInt32Attribute(mesh, attribute, count, itemSize, array);
      case Accessor.ComponentType.FLOAT:
        return builder.AddFloatAttribute(mesh, attribute, count, itemSize, array);
      default:
        throw new Error(`Unexpected component type, "${componentType}".`);
    }
  }
  var EncodingError = class extends Error {
  };
  var KHRDracoMeshCompression = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_DRACO_MESH_COMPRESSION;
      this.prereadTypes = [PropertyType.PRIMITIVE];
      this.prewriteTypes = [PropertyType.ACCESSOR];
      this.readDependencies = ["draco3d.decoder"];
      this.writeDependencies = ["draco3d.encoder"];
      this._decoderModule = null;
      this._encoderModule = null;
      this._encoderOptions = {};
    }
    /** @hidden */
    install(key, dependency) {
      if (key === "draco3d.decoder") {
        this._decoderModule = dependency;
        initDecoderModule(this._decoderModule);
      }
      if (key === "draco3d.encoder") {
        this._encoderModule = dependency;
        initEncoderModule(this._encoderModule);
      }
      return this;
    }
    /**
     * Sets Draco compression options. Compression does not take effect until the Document is
     * written with an I/O class.
     *
     * Defaults:
     * ```
     * decodeSpeed?: number = 5;
     * encodeSpeed?: number = 5;
     * method?: EncoderMethod = EncoderMethod.EDGEBREAKER;
     * quantizationBits?: {[ATTRIBUTE_NAME]: bits};
     * quantizationVolume?: 'mesh' | 'scene' | bbox = 'mesh';
     * ```
     */
    setEncoderOptions(options) {
      this._encoderOptions = options;
      return this;
    }
    /** @hidden */
    preread(context) {
      if (!this._decoderModule) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Please install extension dependency, "draco3d.decoder".`);
      }
      const logger = this.document.getLogger();
      const jsonDoc = context.jsonDoc;
      const dracoMeshes = /* @__PURE__ */ new Map();
      try {
        const meshDefs = jsonDoc.json.meshes || [];
        for (const meshDef of meshDefs) {
          for (const primDef of meshDef.primitives) {
            if (!primDef.extensions || !primDef.extensions[KHR_DRACO_MESH_COMPRESSION]) continue;
            const dracoDef = primDef.extensions[KHR_DRACO_MESH_COMPRESSION];
            let [decoder, dracoMesh] = dracoMeshes.get(dracoDef.bufferView) || [];
            if (!dracoMesh || !decoder) {
              const bufferViewDef = jsonDoc.json.bufferViews[dracoDef.bufferView];
              const bufferDef = jsonDoc.json.buffers[bufferViewDef.buffer];
              const resource = bufferDef.uri ? jsonDoc.resources[bufferDef.uri] : jsonDoc.resources[GLB_BUFFER];
              const byteOffset = bufferViewDef.byteOffset || 0;
              const byteLength = bufferViewDef.byteLength;
              const compressedData = BufferUtils.toView(resource, byteOffset, byteLength);
              decoder = new this._decoderModule.Decoder();
              dracoMesh = decodeGeometry(decoder, compressedData);
              dracoMeshes.set(dracoDef.bufferView, [decoder, dracoMesh]);
              logger.debug(`[${KHR_DRACO_MESH_COMPRESSION}] Decompressed ${compressedData.byteLength} bytes.`);
            }
            for (const semantic in dracoDef.attributes) {
              const accessorDef = context.jsonDoc.json.accessors[primDef.attributes[semantic]];
              const dracoAttribute = decoder.GetAttributeByUniqueId(dracoMesh, dracoDef.attributes[semantic]);
              const attributeArray = decodeAttribute(decoder, dracoMesh, dracoAttribute, accessorDef);
              context.accessors[primDef.attributes[semantic]].setArray(attributeArray);
            }
            if (primDef.indices !== void 0) {
              context.accessors[primDef.indices].setArray(decodeIndex(decoder, dracoMesh));
            }
          }
        }
      } finally {
        for (const [decoder, dracoMesh] of Array.from(dracoMeshes.values())) {
          this._decoderModule.destroy(decoder);
          this._decoderModule.destroy(dracoMesh);
        }
      }
      return this;
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    prewrite(context, _propertyType) {
      if (!this._encoderModule) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Please install extension dependency, "draco3d.encoder".`);
      }
      const logger = this.document.getLogger();
      logger.debug(`[${KHR_DRACO_MESH_COMPRESSION}] Compression options: ${JSON.stringify(this._encoderOptions)}`);
      const primitiveHashMap = listDracoPrimitives(this.document);
      const primitiveEncodingMap = /* @__PURE__ */ new Map();
      let quantizationVolume = "mesh";
      if (this._encoderOptions.quantizationVolume === "scene") {
        if (this.document.getRoot().listScenes().length !== 1) {
          logger.warn(`[${KHR_DRACO_MESH_COMPRESSION}]: quantizationVolume=scene requires exactly 1 scene.`);
        } else {
          quantizationVolume = getBounds(this.document.getRoot().listScenes().pop());
        }
      }
      for (const prim of Array.from(primitiveHashMap.keys())) {
        const primHash = primitiveHashMap.get(prim);
        if (!primHash) throw new Error("Unexpected primitive.");
        if (primitiveEncodingMap.has(primHash)) {
          primitiveEncodingMap.set(primHash, primitiveEncodingMap.get(primHash));
          continue;
        }
        const indices = prim.getIndices();
        const accessorDefs = context.jsonDoc.json.accessors;
        let encodedPrim;
        try {
          encodedPrim = encodeGeometry(prim, _extends2({}, this._encoderOptions, {
            quantizationVolume
          }));
        } catch (e) {
          if (e instanceof EncodingError) {
            logger.warn(`[${KHR_DRACO_MESH_COMPRESSION}]: ${e.message} Skipping primitive compression.`);
            continue;
          }
          throw e;
        }
        primitiveEncodingMap.set(primHash, encodedPrim);
        const indicesDef = context.createAccessorDef(indices);
        indicesDef.count = encodedPrim.numIndices;
        context.accessorIndexMap.set(indices, accessorDefs.length);
        accessorDefs.push(indicesDef);
        if (encodedPrim.numVertices > 65534 && Accessor.getComponentSize(indicesDef.componentType) <= 2) {
          indicesDef.componentType = Accessor.ComponentType.UNSIGNED_INT;
        } else if (encodedPrim.numVertices > 254 && Accessor.getComponentSize(indicesDef.componentType) <= 1) {
          indicesDef.componentType = Accessor.ComponentType.UNSIGNED_SHORT;
        }
        for (const semantic of prim.listSemantics()) {
          const attribute = prim.getAttribute(semantic);
          if (encodedPrim.attributeIDs[semantic] === void 0) continue;
          const attributeDef = context.createAccessorDef(attribute);
          attributeDef.count = encodedPrim.numVertices;
          context.accessorIndexMap.set(attribute, accessorDefs.length);
          accessorDefs.push(attributeDef);
        }
        const buffer = prim.getAttribute("POSITION").getBuffer() || this.document.getRoot().listBuffers()[0];
        if (!context.otherBufferViews.has(buffer)) context.otherBufferViews.set(buffer, []);
        context.otherBufferViews.get(buffer).push(encodedPrim.data);
      }
      logger.debug(`[${KHR_DRACO_MESH_COMPRESSION}] Compressed ${primitiveHashMap.size} primitives.`);
      context.extensionData[KHR_DRACO_MESH_COMPRESSION] = {
        primitiveHashMap,
        primitiveEncodingMap
      };
      return this;
    }
    /** @hidden */
    write(context) {
      const dracoContext = context.extensionData[KHR_DRACO_MESH_COMPRESSION];
      for (const mesh of this.document.getRoot().listMeshes()) {
        const meshDef = context.jsonDoc.json.meshes[context.meshIndexMap.get(mesh)];
        for (let i = 0; i < mesh.listPrimitives().length; i++) {
          const prim = mesh.listPrimitives()[i];
          const primDef = meshDef.primitives[i];
          const primHash = dracoContext.primitiveHashMap.get(prim);
          if (!primHash) continue;
          const encodedPrim = dracoContext.primitiveEncodingMap.get(primHash);
          if (!encodedPrim) continue;
          primDef.extensions = primDef.extensions || {};
          primDef.extensions[KHR_DRACO_MESH_COMPRESSION] = {
            bufferView: context.otherBufferViewsIndexMap.get(encodedPrim.data),
            attributes: encodedPrim.attributeIDs
          };
        }
      }
      if (!dracoContext.primitiveHashMap.size) {
        const json = context.jsonDoc.json;
        json.extensionsUsed = (json.extensionsUsed || []).filter((name) => name !== KHR_DRACO_MESH_COMPRESSION);
        json.extensionsRequired = (json.extensionsRequired || []).filter((name) => name !== KHR_DRACO_MESH_COMPRESSION);
      }
      return this;
    }
  };
  KHRDracoMeshCompression.EXTENSION_NAME = KHR_DRACO_MESH_COMPRESSION;
  KHRDracoMeshCompression.EncoderMethod = EncoderMethod;
  function listDracoPrimitives(doc) {
    const logger = doc.getLogger();
    const included = /* @__PURE__ */ new Set();
    const excluded = /* @__PURE__ */ new Set();
    let nonIndexed = 0;
    let nonTriangles = 0;
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const prim of mesh.listPrimitives()) {
        if (!prim.getIndices()) {
          excluded.add(prim);
          nonIndexed++;
        } else if (prim.getMode() !== Primitive.Mode.TRIANGLES) {
          excluded.add(prim);
          nonTriangles++;
        } else {
          included.add(prim);
        }
      }
    }
    if (nonIndexed > 0) {
      logger.warn(`[${KHR_DRACO_MESH_COMPRESSION}] Skipping Draco compression of ${nonIndexed} non-indexed primitives.`);
    }
    if (nonTriangles > 0) {
      logger.warn(`[${KHR_DRACO_MESH_COMPRESSION}] Skipping Draco compression of ${nonTriangles} non-TRIANGLES primitives.`);
    }
    const accessors = doc.getRoot().listAccessors();
    const accessorIndices = /* @__PURE__ */ new Map();
    for (let i = 0; i < accessors.length; i++) accessorIndices.set(accessors[i], i);
    const includedAccessors = /* @__PURE__ */ new Map();
    const includedHashKeys = /* @__PURE__ */ new Set();
    const primToHashKey = /* @__PURE__ */ new Map();
    for (const prim of Array.from(included)) {
      let hashKey = createHashKey(prim, accessorIndices);
      if (includedHashKeys.has(hashKey)) {
        primToHashKey.set(prim, hashKey);
        continue;
      }
      if (includedAccessors.has(prim.getIndices())) {
        const indices = prim.getIndices();
        const dstIndices = indices.clone();
        accessorIndices.set(dstIndices, doc.getRoot().listAccessors().length - 1);
        prim.swap(indices, dstIndices);
      }
      for (const attribute of prim.listAttributes()) {
        if (includedAccessors.has(attribute)) {
          const dstAttribute = attribute.clone();
          accessorIndices.set(dstAttribute, doc.getRoot().listAccessors().length - 1);
          prim.swap(attribute, dstAttribute);
        }
      }
      hashKey = createHashKey(prim, accessorIndices);
      includedHashKeys.add(hashKey);
      primToHashKey.set(prim, hashKey);
      includedAccessors.set(prim.getIndices(), hashKey);
      for (const attribute of prim.listAttributes()) {
        includedAccessors.set(attribute, hashKey);
      }
    }
    for (const accessor of Array.from(includedAccessors.keys())) {
      const parentTypes = new Set(accessor.listParents().map((prop) => prop.propertyType));
      if (parentTypes.size !== 2 || !parentTypes.has(PropertyType.PRIMITIVE) || !parentTypes.has(PropertyType.ROOT)) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Compressed accessors must only be used as indices or vertex attributes.`);
      }
    }
    for (const prim of Array.from(included)) {
      const hashKey = primToHashKey.get(prim);
      const indices = prim.getIndices();
      if (includedAccessors.get(indices) !== hashKey || prim.listAttributes().some((attr) => includedAccessors.get(attr) !== hashKey)) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Draco primitives must share all, or no, accessors.`);
      }
    }
    for (const prim of Array.from(excluded)) {
      const indices = prim.getIndices();
      if (includedAccessors.has(indices) || prim.listAttributes().some((attr) => includedAccessors.has(attr))) {
        throw new Error(`[${KHR_DRACO_MESH_COMPRESSION}] Accessor cannot be shared by compressed and uncompressed primitives.`);
      }
    }
    return primToHashKey;
  }
  function createHashKey(prim, indexMap) {
    const hashElements = [];
    const indices = prim.getIndices();
    hashElements.push(indexMap.get(indices));
    for (const attribute of prim.listAttributes()) {
      hashElements.push(indexMap.get(attribute));
    }
    return hashElements.sort().join("|");
  }
  var Light = class _Light extends ExtensionProperty {
    /**********************************************************************************************
     * INSTANCE.
     */
    init() {
      this.extensionName = KHR_LIGHTS_PUNCTUAL;
      this.propertyType = "Light";
      this.parentTypes = [PropertyType.NODE];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        color: [1, 1, 1],
        intensity: 1,
        type: _Light.Type.POINT,
        range: null,
        innerConeAngle: 0,
        outerConeAngle: Math.PI / 4
      });
    }
    /**********************************************************************************************
     * COLOR.
     */
    /** Light color; Linear-sRGB components. */
    getColor() {
      return this.get("color");
    }
    /** Light color; Linear-sRGB components. */
    setColor(color) {
      return this.set("color", color);
    }
    /**********************************************************************************************
     * INTENSITY.
     */
    /**
     * Brightness of light. Units depend on the type of light: point and spot lights use luminous
     * intensity in candela (lm/sr) while directional lights use illuminance in lux (lm/m2).
     */
    getIntensity() {
      return this.get("intensity");
    }
    /**
     * Brightness of light. Units depend on the type of light: point and spot lights use luminous
     * intensity in candela (lm/sr) while directional lights use illuminance in lux (lm/m2).
     */
    setIntensity(intensity) {
      return this.set("intensity", intensity);
    }
    /**********************************************************************************************
     * TYPE.
     */
    /** Type. */
    getType() {
      return this.get("type");
    }
    /** Type. */
    setType(type) {
      return this.set("type", type);
    }
    /**********************************************************************************************
     * RANGE.
     */
    /**
     * Hint defining a distance cutoff at which the light's intensity may be considered to have
     * reached zero. Supported only for point and spot lights. Must be > 0. When undefined, range
     * is assumed to be infinite.
     */
    getRange() {
      return this.get("range");
    }
    /**
     * Hint defining a distance cutoff at which the light's intensity may be considered to have
     * reached zero. Supported only for point and spot lights. Must be > 0. When undefined, range
     * is assumed to be infinite.
     */
    setRange(range) {
      return this.set("range", range);
    }
    /**********************************************************************************************
     * SPOT LIGHT PROPERTIES
     */
    /**
     * Angle, in radians, from centre of spotlight where falloff begins. Must be >= 0 and
     * < outerConeAngle.
     */
    getInnerConeAngle() {
      return this.get("innerConeAngle");
    }
    /**
     * Angle, in radians, from centre of spotlight where falloff begins. Must be >= 0 and
     * < outerConeAngle.
     */
    setInnerConeAngle(angle) {
      return this.set("innerConeAngle", angle);
    }
    /**
     * Angle, in radians, from centre of spotlight where falloff ends. Must be > innerConeAngle and
     * <= PI / 2.0.
     */
    getOuterConeAngle() {
      return this.get("outerConeAngle");
    }
    /**
     * Angle, in radians, from centre of spotlight where falloff ends. Must be > innerConeAngle and
     * <= PI / 2.0.
     */
    setOuterConeAngle(angle) {
      return this.set("outerConeAngle", angle);
    }
  };
  Light.EXTENSION_NAME = KHR_LIGHTS_PUNCTUAL;
  Light.Type = {
    POINT: "point",
    SPOT: "spot",
    DIRECTIONAL: "directional"
  };
  var KHRLightsPunctual = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_LIGHTS_PUNCTUAL;
    }
    /** Creates a new punctual Light property for use on a {@link Node}. */
    createLight(name = "") {
      return new Light(this.document.getGraph(), name);
    }
    /** @hidden */
    read(context) {
      const jsonDoc = context.jsonDoc;
      if (!jsonDoc.json.extensions || !jsonDoc.json.extensions[KHR_LIGHTS_PUNCTUAL]) return this;
      const rootDef = jsonDoc.json.extensions[KHR_LIGHTS_PUNCTUAL];
      const lightDefs = rootDef.lights || [];
      const lights = lightDefs.map((lightDef) => {
        var _lightDef$spot, _lightDef$spot2;
        const light = this.createLight().setName(lightDef.name || "").setType(lightDef.type);
        if (lightDef.color !== void 0) light.setColor(lightDef.color);
        if (lightDef.intensity !== void 0) light.setIntensity(lightDef.intensity);
        if (lightDef.range !== void 0) light.setRange(lightDef.range);
        if (((_lightDef$spot = lightDef.spot) == null ? void 0 : _lightDef$spot.innerConeAngle) !== void 0) {
          light.setInnerConeAngle(lightDef.spot.innerConeAngle);
        }
        if (((_lightDef$spot2 = lightDef.spot) == null ? void 0 : _lightDef$spot2.outerConeAngle) !== void 0) {
          light.setOuterConeAngle(lightDef.spot.outerConeAngle);
        }
        return light;
      });
      jsonDoc.json.nodes.forEach((nodeDef, nodeIndex) => {
        if (!nodeDef.extensions || !nodeDef.extensions[KHR_LIGHTS_PUNCTUAL]) return;
        const lightNodeDef = nodeDef.extensions[KHR_LIGHTS_PUNCTUAL];
        context.nodes[nodeIndex].setExtension(KHR_LIGHTS_PUNCTUAL, lights[lightNodeDef.light]);
      });
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      if (this.properties.size === 0) return this;
      const lightDefs = [];
      const lightIndexMap = /* @__PURE__ */ new Map();
      for (const property of this.properties) {
        const light = property;
        const lightDef = {
          type: light.getType()
        };
        if (!MathUtils.eq(light.getColor(), [1, 1, 1])) lightDef.color = light.getColor();
        if (light.getIntensity() !== 1) lightDef.intensity = light.getIntensity();
        if (light.getRange() != null) lightDef.range = light.getRange();
        if (light.getName()) lightDef.name = light.getName();
        if (light.getType() === Light.Type.SPOT) {
          lightDef.spot = {
            innerConeAngle: light.getInnerConeAngle(),
            outerConeAngle: light.getOuterConeAngle()
          };
        }
        lightDefs.push(lightDef);
        lightIndexMap.set(light, lightDefs.length - 1);
      }
      this.document.getRoot().listNodes().forEach((node) => {
        const light = node.getExtension(KHR_LIGHTS_PUNCTUAL);
        if (light) {
          const nodeIndex = context.nodeIndexMap.get(node);
          const nodeDef = jsonDoc.json.nodes[nodeIndex];
          nodeDef.extensions = nodeDef.extensions || {};
          nodeDef.extensions[KHR_LIGHTS_PUNCTUAL] = {
            light: lightIndexMap.get(light)
          };
        }
      });
      jsonDoc.json.extensions = jsonDoc.json.extensions || {};
      jsonDoc.json.extensions[KHR_LIGHTS_PUNCTUAL] = {
        lights: lightDefs
      };
      return this;
    }
  };
  KHRLightsPunctual.EXTENSION_NAME = KHR_LIGHTS_PUNCTUAL;
  var {
    R: R$7,
    G: G$7,
    B: B$5
  } = TextureChannel;
  var Anisotropy = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_ANISOTROPY;
      this.propertyType = "Anisotropy";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        anisotropyStrength: 0,
        anisotropyRotation: 0,
        anisotropyTexture: null,
        anisotropyTextureInfo: new TextureInfo(this.graph, "anisotropyTextureInfo")
      });
    }
    /**********************************************************************************************
     * Anisotropy strength.
     */
    /** Anisotropy strength. */
    getAnisotropyStrength() {
      return this.get("anisotropyStrength");
    }
    /** Anisotropy strength. */
    setAnisotropyStrength(strength) {
      return this.set("anisotropyStrength", strength);
    }
    /**********************************************************************************************
     * Anisotropy rotation.
     */
    /** Anisotropy rotation; linear multiplier. */
    getAnisotropyRotation() {
      return this.get("anisotropyRotation");
    }
    /** Anisotropy rotation; linear multiplier. */
    setAnisotropyRotation(rotation) {
      return this.set("anisotropyRotation", rotation);
    }
    /**********************************************************************************************
     * Anisotropy texture.
     */
    /**
     * Anisotropy texture. Red and green channels represent the anisotropy
     * direction in [-1, 1] tangent, bitangent space, to be rotated by
     * anisotropyRotation. The blue channel contains strength as [0, 1] to be
     * multiplied by anisotropyStrength.
     */
    getAnisotropyTexture() {
      return this.getRef("anisotropyTexture");
    }
    /**
     * Settings affecting the material's use of its anisotropy texture. If no
     * texture is attached, {@link TextureInfo} is `null`.
     */
    getAnisotropyTextureInfo() {
      return this.getRef("anisotropyTexture") ? this.getRef("anisotropyTextureInfo") : null;
    }
    /** Anisotropy texture. See {@link Anisotropy.getAnisotropyTexture getAnisotropyTexture}. */
    setAnisotropyTexture(texture) {
      return this.setRef("anisotropyTexture", texture, {
        channels: R$7 | G$7 | B$5
      });
    }
  };
  Anisotropy.EXTENSION_NAME = KHR_MATERIALS_ANISOTROPY;
  var KHRMaterialsAnisotropy = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_ANISOTROPY;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Anisotropy property for use on a {@link Material}. */
    createAnisotropy() {
      return new Anisotropy(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_ANISOTROPY]) {
          const anisotropy = this.createAnisotropy();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_ANISOTROPY, anisotropy);
          const anisotropyDef = materialDef.extensions[KHR_MATERIALS_ANISOTROPY];
          if (anisotropyDef.anisotropyStrength !== void 0) {
            anisotropy.setAnisotropyStrength(anisotropyDef.anisotropyStrength);
          }
          if (anisotropyDef.anisotropyRotation !== void 0) {
            anisotropy.setAnisotropyRotation(anisotropyDef.anisotropyRotation);
          }
          if (anisotropyDef.anisotropyTexture !== void 0) {
            const textureInfoDef = anisotropyDef.anisotropyTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            anisotropy.setAnisotropyTexture(texture);
            context.setTextureInfo(anisotropy.getAnisotropyTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const anisotropy = material.getExtension(KHR_MATERIALS_ANISOTROPY);
        if (anisotropy) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const anisotropyDef = materialDef.extensions[KHR_MATERIALS_ANISOTROPY] = {};
          if (anisotropy.getAnisotropyStrength() > 0) {
            anisotropyDef.anisotropyStrength = anisotropy.getAnisotropyStrength();
          }
          if (anisotropy.getAnisotropyRotation() !== 0) {
            anisotropyDef.anisotropyRotation = anisotropy.getAnisotropyRotation();
          }
          if (anisotropy.getAnisotropyTexture()) {
            const texture = anisotropy.getAnisotropyTexture();
            const textureInfo = anisotropy.getAnisotropyTextureInfo();
            anisotropyDef.anisotropyTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsAnisotropy.EXTENSION_NAME = KHR_MATERIALS_ANISOTROPY;
  var {
    R: R$6,
    G: G$6,
    B: B$4
  } = TextureChannel;
  var Clearcoat = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_CLEARCOAT;
      this.propertyType = "Clearcoat";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        clearcoatFactor: 0,
        clearcoatTexture: null,
        clearcoatTextureInfo: new TextureInfo(this.graph, "clearcoatTextureInfo"),
        clearcoatRoughnessFactor: 0,
        clearcoatRoughnessTexture: null,
        clearcoatRoughnessTextureInfo: new TextureInfo(this.graph, "clearcoatRoughnessTextureInfo"),
        clearcoatNormalScale: 1,
        clearcoatNormalTexture: null,
        clearcoatNormalTextureInfo: new TextureInfo(this.graph, "clearcoatNormalTextureInfo")
      });
    }
    /**********************************************************************************************
     * Clearcoat.
     */
    /** Clearcoat; linear multiplier. See {@link Clearcoat.getClearcoatTexture getClearcoatTexture}. */
    getClearcoatFactor() {
      return this.get("clearcoatFactor");
    }
    /** Clearcoat; linear multiplier. See {@link Clearcoat.getClearcoatTexture getClearcoatTexture}. */
    setClearcoatFactor(factor) {
      return this.set("clearcoatFactor", factor);
    }
    /**
     * Clearcoat texture; linear multiplier. The `r` channel of this texture specifies an amount
     * [0-1] of coating over the surface of the material, which may have its own roughness and
     * normal map properties.
     */
    getClearcoatTexture() {
      return this.getRef("clearcoatTexture");
    }
    /**
     * Settings affecting the material's use of its clearcoat texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getClearcoatTextureInfo() {
      return this.getRef("clearcoatTexture") ? this.getRef("clearcoatTextureInfo") : null;
    }
    /** Sets clearcoat texture. See {@link Clearcoat.getClearcoatTexture getClearcoatTexture}. */
    setClearcoatTexture(texture) {
      return this.setRef("clearcoatTexture", texture, {
        channels: R$6
      });
    }
    /**********************************************************************************************
     * Clearcoat roughness.
     */
    /**
     * Clearcoat roughness; linear multiplier.
     * See {@link Clearcoat.getClearcoatRoughnessTexture getClearcoatRoughnessTexture}.
     */
    getClearcoatRoughnessFactor() {
      return this.get("clearcoatRoughnessFactor");
    }
    /**
     * Clearcoat roughness; linear multiplier.
     * See {@link Clearcoat.getClearcoatRoughnessTexture getClearcoatRoughnessTexture}.
     */
    setClearcoatRoughnessFactor(factor) {
      return this.set("clearcoatRoughnessFactor", factor);
    }
    /**
     * Clearcoat roughness texture; linear multiplier. The `g` channel of this texture specifies
     * roughness, independent of the base layer's roughness.
     */
    getClearcoatRoughnessTexture() {
      return this.getRef("clearcoatRoughnessTexture");
    }
    /**
     * Settings affecting the material's use of its clearcoat roughness texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getClearcoatRoughnessTextureInfo() {
      return this.getRef("clearcoatRoughnessTexture") ? this.getRef("clearcoatRoughnessTextureInfo") : null;
    }
    /**
     * Sets clearcoat roughness texture.
     * See {@link Clearcoat.getClearcoatRoughnessTexture getClearcoatRoughnessTexture}.
     */
    setClearcoatRoughnessTexture(texture) {
      return this.setRef("clearcoatRoughnessTexture", texture, {
        channels: G$6
      });
    }
    /**********************************************************************************************
     * Clearcoat normals.
     */
    /** Clearcoat normal scale. See {@link Clearcoat.getClearcoatNormalTexture getClearcoatNormalTexture}. */
    getClearcoatNormalScale() {
      return this.get("clearcoatNormalScale");
    }
    /** Clearcoat normal scale. See {@link Clearcoat.getClearcoatNormalTexture getClearcoatNormalTexture}. */
    setClearcoatNormalScale(scale) {
      return this.set("clearcoatNormalScale", scale);
    }
    /**
     * Clearcoat normal map. Independent of the material base layer normal map.
     */
    getClearcoatNormalTexture() {
      return this.getRef("clearcoatNormalTexture");
    }
    /**
     * Settings affecting the material's use of its clearcoat normal texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getClearcoatNormalTextureInfo() {
      return this.getRef("clearcoatNormalTexture") ? this.getRef("clearcoatNormalTextureInfo") : null;
    }
    /** Sets clearcoat normal texture. See {@link Clearcoat.getClearcoatNormalTexture getClearcoatNormalTexture}. */
    setClearcoatNormalTexture(texture) {
      return this.setRef("clearcoatNormalTexture", texture, {
        channels: R$6 | G$6 | B$4
      });
    }
  };
  Clearcoat.EXTENSION_NAME = KHR_MATERIALS_CLEARCOAT;
  var KHRMaterialsClearcoat = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_CLEARCOAT;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Clearcoat property for use on a {@link Material}. */
    createClearcoat() {
      return new Clearcoat(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_CLEARCOAT]) {
          const clearcoat = this.createClearcoat();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_CLEARCOAT, clearcoat);
          const clearcoatDef = materialDef.extensions[KHR_MATERIALS_CLEARCOAT];
          if (clearcoatDef.clearcoatFactor !== void 0) {
            clearcoat.setClearcoatFactor(clearcoatDef.clearcoatFactor);
          }
          if (clearcoatDef.clearcoatRoughnessFactor !== void 0) {
            clearcoat.setClearcoatRoughnessFactor(clearcoatDef.clearcoatRoughnessFactor);
          }
          if (clearcoatDef.clearcoatTexture !== void 0) {
            const textureInfoDef = clearcoatDef.clearcoatTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            clearcoat.setClearcoatTexture(texture);
            context.setTextureInfo(clearcoat.getClearcoatTextureInfo(), textureInfoDef);
          }
          if (clearcoatDef.clearcoatRoughnessTexture !== void 0) {
            const textureInfoDef = clearcoatDef.clearcoatRoughnessTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            clearcoat.setClearcoatRoughnessTexture(texture);
            context.setTextureInfo(clearcoat.getClearcoatRoughnessTextureInfo(), textureInfoDef);
          }
          if (clearcoatDef.clearcoatNormalTexture !== void 0) {
            const textureInfoDef = clearcoatDef.clearcoatNormalTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            clearcoat.setClearcoatNormalTexture(texture);
            context.setTextureInfo(clearcoat.getClearcoatNormalTextureInfo(), textureInfoDef);
            if (textureInfoDef.scale !== void 0) {
              clearcoat.setClearcoatNormalScale(textureInfoDef.scale);
            }
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const clearcoat = material.getExtension(KHR_MATERIALS_CLEARCOAT);
        if (clearcoat) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const clearcoatDef = materialDef.extensions[KHR_MATERIALS_CLEARCOAT] = {
            clearcoatFactor: clearcoat.getClearcoatFactor(),
            clearcoatRoughnessFactor: clearcoat.getClearcoatRoughnessFactor()
          };
          if (clearcoat.getClearcoatTexture()) {
            const texture = clearcoat.getClearcoatTexture();
            const textureInfo = clearcoat.getClearcoatTextureInfo();
            clearcoatDef.clearcoatTexture = context.createTextureInfoDef(texture, textureInfo);
          }
          if (clearcoat.getClearcoatRoughnessTexture()) {
            const texture = clearcoat.getClearcoatRoughnessTexture();
            const textureInfo = clearcoat.getClearcoatRoughnessTextureInfo();
            clearcoatDef.clearcoatRoughnessTexture = context.createTextureInfoDef(texture, textureInfo);
          }
          if (clearcoat.getClearcoatNormalTexture()) {
            const texture = clearcoat.getClearcoatNormalTexture();
            const textureInfo = clearcoat.getClearcoatNormalTextureInfo();
            clearcoatDef.clearcoatNormalTexture = context.createTextureInfoDef(texture, textureInfo);
            if (clearcoat.getClearcoatNormalScale() !== 1) {
              clearcoatDef.clearcoatNormalTexture.scale = clearcoat.getClearcoatNormalScale();
            }
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsClearcoat.EXTENSION_NAME = KHR_MATERIALS_CLEARCOAT;
  var {
    R: R$5,
    G: G$5,
    B: B$3,
    A: A$3
  } = TextureChannel;
  var DiffuseTransmission = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_DIFFUSE_TRANSMISSION;
      this.propertyType = "DiffuseTransmission";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        diffuseTransmissionFactor: 0,
        diffuseTransmissionTexture: null,
        diffuseTransmissionTextureInfo: new TextureInfo(this.graph, "diffuseTransmissionTextureInfo"),
        diffuseTransmissionColorFactor: [1, 1, 1],
        diffuseTransmissionColorTexture: null,
        diffuseTransmissionColorTextureInfo: new TextureInfo(this.graph, "diffuseTransmissionColorTextureInfo")
      });
    }
    /**********************************************************************************************
     * Diffuse transmission.
     */
    /**
     * Percentage of reflected, non-specularly reflected light that is transmitted through the
     * surface via the Lambertian diffuse transmission, i.e., the strength of the diffuse
     * transmission effect.
     */
    getDiffuseTransmissionFactor() {
      return this.get("diffuseTransmissionFactor");
    }
    /**
     * Percentage of reflected, non-specularly reflected light that is transmitted through the
     * surface via the Lambertian diffuse transmission, i.e., the strength of the diffuse
     * transmission effect.
     */
    setDiffuseTransmissionFactor(factor) {
      return this.set("diffuseTransmissionFactor", factor);
    }
    /**
     * Texture that defines the strength of the diffuse transmission effect, stored in the alpha (A)
     * channel. Will be multiplied by the diffuseTransmissionFactor.
     */
    getDiffuseTransmissionTexture() {
      return this.getRef("diffuseTransmissionTexture");
    }
    /**
     * Settings affecting the material's use of its diffuse transmission texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getDiffuseTransmissionTextureInfo() {
      return this.getRef("diffuseTransmissionTexture") ? this.getRef("diffuseTransmissionTextureInfo") : null;
    }
    /**
     * Texture that defines the strength of the diffuse transmission effect, stored in the alpha (A)
     * channel. Will be multiplied by the diffuseTransmissionFactor.
     */
    setDiffuseTransmissionTexture(texture) {
      return this.setRef("diffuseTransmissionTexture", texture, {
        channels: A$3
      });
    }
    /**********************************************************************************************
     * Diffuse transmission color.
     */
    /** Color of the transmitted light; Linear-sRGB components. */
    getDiffuseTransmissionColorFactor() {
      return this.get("diffuseTransmissionColorFactor");
    }
    /** Color of the transmitted light; Linear-sRGB components. */
    setDiffuseTransmissionColorFactor(factor) {
      return this.set("diffuseTransmissionColorFactor", factor);
    }
    /**
     * Texture that defines the color of the transmitted light, stored in the RGB channels and
     * encoded in sRGB. This texture will be multiplied by diffuseTransmissionColorFactor.
     */
    getDiffuseTransmissionColorTexture() {
      return this.getRef("diffuseTransmissionColorTexture");
    }
    /**
     * Settings affecting the material's use of its diffuse transmission color texture. If no
     * texture is attached, {@link TextureInfo} is `null`.
     */
    getDiffuseTransmissionColorTextureInfo() {
      return this.getRef("diffuseTransmissionColorTexture") ? this.getRef("diffuseTransmissionColorTextureInfo") : null;
    }
    /**
     * Texture that defines the color of the transmitted light, stored in the RGB channels and
     * encoded in sRGB. This texture will be multiplied by diffuseTransmissionColorFactor.
     */
    setDiffuseTransmissionColorTexture(texture) {
      return this.setRef("diffuseTransmissionColorTexture", texture, {
        channels: R$5 | G$5 | B$3
      });
    }
  };
  DiffuseTransmission.EXTENSION_NAME = KHR_MATERIALS_DIFFUSE_TRANSMISSION;
  var KHRMaterialsDiffuseTransmission = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_DIFFUSE_TRANSMISSION;
    }
    /** Creates a new DiffuseTransmission property for use on a {@link Material}. */
    createDiffuseTransmission() {
      return new DiffuseTransmission(this.document.getGraph());
    }
    /** @hidden */
    read(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_DIFFUSE_TRANSMISSION]) {
          const transmission = this.createDiffuseTransmission();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_DIFFUSE_TRANSMISSION, transmission);
          const transmissionDef = materialDef.extensions[KHR_MATERIALS_DIFFUSE_TRANSMISSION];
          if (transmissionDef.diffuseTransmissionFactor !== void 0) {
            transmission.setDiffuseTransmissionFactor(transmissionDef.diffuseTransmissionFactor);
          }
          if (transmissionDef.diffuseTransmissionColorFactor !== void 0) {
            transmission.setDiffuseTransmissionColorFactor(transmissionDef.diffuseTransmissionColorFactor);
          }
          if (transmissionDef.diffuseTransmissionTexture !== void 0) {
            const textureInfoDef = transmissionDef.diffuseTransmissionTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            transmission.setDiffuseTransmissionTexture(texture);
            context.setTextureInfo(transmission.getDiffuseTransmissionTextureInfo(), textureInfoDef);
          }
          if (transmissionDef.diffuseTransmissionColorTexture !== void 0) {
            const textureInfoDef = transmissionDef.diffuseTransmissionColorTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            transmission.setDiffuseTransmissionColorTexture(texture);
            context.setTextureInfo(transmission.getDiffuseTransmissionColorTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      for (const material of this.document.getRoot().listMaterials()) {
        const transmission = material.getExtension(KHR_MATERIALS_DIFFUSE_TRANSMISSION);
        if (!transmission) continue;
        const materialIndex = context.materialIndexMap.get(material);
        const materialDef = jsonDoc.json.materials[materialIndex];
        materialDef.extensions = materialDef.extensions || {};
        const transmissionDef = materialDef.extensions[KHR_MATERIALS_DIFFUSE_TRANSMISSION] = {
          diffuseTransmissionFactor: transmission.getDiffuseTransmissionFactor(),
          diffuseTransmissionColorFactor: transmission.getDiffuseTransmissionColorFactor()
        };
        if (transmission.getDiffuseTransmissionTexture()) {
          const texture = transmission.getDiffuseTransmissionTexture();
          const textureInfo = transmission.getDiffuseTransmissionTextureInfo();
          transmissionDef.diffuseTransmissionTexture = context.createTextureInfoDef(texture, textureInfo);
        }
        if (transmission.getDiffuseTransmissionColorTexture()) {
          const texture = transmission.getDiffuseTransmissionColorTexture();
          const textureInfo = transmission.getDiffuseTransmissionColorTextureInfo();
          transmissionDef.diffuseTransmissionColorTexture = context.createTextureInfoDef(texture, textureInfo);
        }
      }
      return this;
    }
  };
  KHRMaterialsDiffuseTransmission.EXTENSION_NAME = KHR_MATERIALS_DIFFUSE_TRANSMISSION;
  var Dispersion = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_DISPERSION;
      this.propertyType = "Dispersion";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        dispersion: 0
      });
    }
    /**********************************************************************************************
     * Dispersion.
     */
    /** Dispersion. */
    getDispersion() {
      return this.get("dispersion");
    }
    /** Dispersion. */
    setDispersion(dispersion) {
      return this.set("dispersion", dispersion);
    }
  };
  Dispersion.EXTENSION_NAME = KHR_MATERIALS_DISPERSION;
  var KHRMaterialsDispersion = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_DISPERSION;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Dispersion property for use on a {@link Material}. */
    createDispersion() {
      return new Dispersion(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_DISPERSION]) {
          const dispersion = this.createDispersion();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_DISPERSION, dispersion);
          const dispersionDef = materialDef.extensions[KHR_MATERIALS_DISPERSION];
          if (dispersionDef.dispersion !== void 0) {
            dispersion.setDispersion(dispersionDef.dispersion);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const dispersion = material.getExtension(KHR_MATERIALS_DISPERSION);
        if (dispersion) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          materialDef.extensions[KHR_MATERIALS_DISPERSION] = {
            dispersion: dispersion.getDispersion()
          };
        }
      });
      return this;
    }
  };
  KHRMaterialsDispersion.EXTENSION_NAME = KHR_MATERIALS_DISPERSION;
  var EmissiveStrength = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_EMISSIVE_STRENGTH;
      this.propertyType = "EmissiveStrength";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        emissiveStrength: 1
      });
    }
    /**********************************************************************************************
     * EmissiveStrength.
     */
    /** EmissiveStrength. */
    getEmissiveStrength() {
      return this.get("emissiveStrength");
    }
    /** EmissiveStrength. */
    setEmissiveStrength(strength) {
      return this.set("emissiveStrength", strength);
    }
  };
  EmissiveStrength.EXTENSION_NAME = KHR_MATERIALS_EMISSIVE_STRENGTH;
  var KHRMaterialsEmissiveStrength = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_EMISSIVE_STRENGTH;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new EmissiveStrength property for use on a {@link Material}. */
    createEmissiveStrength() {
      return new EmissiveStrength(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_EMISSIVE_STRENGTH]) {
          const emissiveStrength = this.createEmissiveStrength();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_EMISSIVE_STRENGTH, emissiveStrength);
          const emissiveStrengthDef = materialDef.extensions[KHR_MATERIALS_EMISSIVE_STRENGTH];
          if (emissiveStrengthDef.emissiveStrength !== void 0) {
            emissiveStrength.setEmissiveStrength(emissiveStrengthDef.emissiveStrength);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const emissiveStrength = material.getExtension(KHR_MATERIALS_EMISSIVE_STRENGTH);
        if (emissiveStrength) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          materialDef.extensions[KHR_MATERIALS_EMISSIVE_STRENGTH] = {
            emissiveStrength: emissiveStrength.getEmissiveStrength()
          };
        }
      });
      return this;
    }
  };
  KHRMaterialsEmissiveStrength.EXTENSION_NAME = KHR_MATERIALS_EMISSIVE_STRENGTH;
  var IOR = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_IOR;
      this.propertyType = "IOR";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        ior: 1.5
      });
    }
    /**********************************************************************************************
     * IOR.
     */
    /** IOR. */
    getIOR() {
      return this.get("ior");
    }
    /** IOR. */
    setIOR(ior) {
      return this.set("ior", ior);
    }
  };
  IOR.EXTENSION_NAME = KHR_MATERIALS_IOR;
  var KHRMaterialsIOR = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_IOR;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new IOR property for use on a {@link Material}. */
    createIOR() {
      return new IOR(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_IOR]) {
          const ior = this.createIOR();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_IOR, ior);
          const iorDef = materialDef.extensions[KHR_MATERIALS_IOR];
          if (iorDef.ior !== void 0) {
            ior.setIOR(iorDef.ior);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const ior = material.getExtension(KHR_MATERIALS_IOR);
        if (ior) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          materialDef.extensions[KHR_MATERIALS_IOR] = {
            ior: ior.getIOR()
          };
        }
      });
      return this;
    }
  };
  KHRMaterialsIOR.EXTENSION_NAME = KHR_MATERIALS_IOR;
  var {
    R: R$4,
    G: G$4
  } = TextureChannel;
  var Iridescence = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_IRIDESCENCE;
      this.propertyType = "Iridescence";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        iridescenceFactor: 0,
        iridescenceTexture: null,
        iridescenceTextureInfo: new TextureInfo(this.graph, "iridescenceTextureInfo"),
        iridescenceIOR: 1.3,
        iridescenceThicknessMinimum: 100,
        iridescenceThicknessMaximum: 400,
        iridescenceThicknessTexture: null,
        iridescenceThicknessTextureInfo: new TextureInfo(this.graph, "iridescenceThicknessTextureInfo")
      });
    }
    /**********************************************************************************************
     * Iridescence.
     */
    /** Iridescence; linear multiplier. See {@link Iridescence.getIridescenceTexture getIridescenceTexture}. */
    getIridescenceFactor() {
      return this.get("iridescenceFactor");
    }
    /** Iridescence; linear multiplier. See {@link Iridescence.getIridescenceTexture getIridescenceTexture}. */
    setIridescenceFactor(factor) {
      return this.set("iridescenceFactor", factor);
    }
    /**
     * Iridescence intensity.
     *
     * Only the red (R) channel is used for iridescence intensity, but this texture may optionally
     * be packed with additional data in the other channels.
     */
    getIridescenceTexture() {
      return this.getRef("iridescenceTexture");
    }
    /**
     * Settings affecting the material's use of its iridescence texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getIridescenceTextureInfo() {
      return this.getRef("iridescenceTexture") ? this.getRef("iridescenceTextureInfo") : null;
    }
    /** Iridescence intensity. See {@link Iridescence.getIridescenceTexture getIridescenceTexture}. */
    setIridescenceTexture(texture) {
      return this.setRef("iridescenceTexture", texture, {
        channels: R$4
      });
    }
    /**********************************************************************************************
     * Iridescence IOR.
     */
    /** Index of refraction of the dielectric thin-film layer. */
    getIridescenceIOR() {
      return this.get("iridescenceIOR");
    }
    /** Index of refraction of the dielectric thin-film layer. */
    setIridescenceIOR(ior) {
      return this.set("iridescenceIOR", ior);
    }
    /**********************************************************************************************
     * Iridescence thickness.
     */
    /** Minimum thickness of the thin-film layer, in nanometers (nm). */
    getIridescenceThicknessMinimum() {
      return this.get("iridescenceThicknessMinimum");
    }
    /** Minimum thickness of the thin-film layer, in nanometers (nm). */
    setIridescenceThicknessMinimum(thickness) {
      return this.set("iridescenceThicknessMinimum", thickness);
    }
    /** Maximum thickness of the thin-film layer, in nanometers (nm). */
    getIridescenceThicknessMaximum() {
      return this.get("iridescenceThicknessMaximum");
    }
    /** Maximum thickness of the thin-film layer, in nanometers (nm). */
    setIridescenceThicknessMaximum(thickness) {
      return this.set("iridescenceThicknessMaximum", thickness);
    }
    /**
     * The green channel of this texture defines the thickness of the
     * thin-film layer by blending between the minimum and maximum thickness.
     */
    getIridescenceThicknessTexture() {
      return this.getRef("iridescenceThicknessTexture");
    }
    /**
     * Settings affecting the material's use of its iridescence thickness texture.
     * If no texture is attached, {@link TextureInfo} is `null`.
     */
    getIridescenceThicknessTextureInfo() {
      return this.getRef("iridescenceThicknessTexture") ? this.getRef("iridescenceThicknessTextureInfo") : null;
    }
    /**
     * Sets iridescence thickness texture.
     * See {@link Iridescence.getIridescenceThicknessTexture getIridescenceThicknessTexture}.
     */
    setIridescenceThicknessTexture(texture) {
      return this.setRef("iridescenceThicknessTexture", texture, {
        channels: G$4
      });
    }
  };
  Iridescence.EXTENSION_NAME = KHR_MATERIALS_IRIDESCENCE;
  var KHRMaterialsIridescence = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_IRIDESCENCE;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Iridescence property for use on a {@link Material}. */
    createIridescence() {
      return new Iridescence(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_IRIDESCENCE]) {
          const iridescence = this.createIridescence();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_IRIDESCENCE, iridescence);
          const iridescenceDef = materialDef.extensions[KHR_MATERIALS_IRIDESCENCE];
          if (iridescenceDef.iridescenceFactor !== void 0) {
            iridescence.setIridescenceFactor(iridescenceDef.iridescenceFactor);
          }
          if (iridescenceDef.iridescenceIor !== void 0) {
            iridescence.setIridescenceIOR(iridescenceDef.iridescenceIor);
          }
          if (iridescenceDef.iridescenceThicknessMinimum !== void 0) {
            iridescence.setIridescenceThicknessMinimum(iridescenceDef.iridescenceThicknessMinimum);
          }
          if (iridescenceDef.iridescenceThicknessMaximum !== void 0) {
            iridescence.setIridescenceThicknessMaximum(iridescenceDef.iridescenceThicknessMaximum);
          }
          if (iridescenceDef.iridescenceTexture !== void 0) {
            const textureInfoDef = iridescenceDef.iridescenceTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            iridescence.setIridescenceTexture(texture);
            context.setTextureInfo(iridescence.getIridescenceTextureInfo(), textureInfoDef);
          }
          if (iridescenceDef.iridescenceThicknessTexture !== void 0) {
            const textureInfoDef = iridescenceDef.iridescenceThicknessTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            iridescence.setIridescenceThicknessTexture(texture);
            context.setTextureInfo(iridescence.getIridescenceThicknessTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const iridescence = material.getExtension(KHR_MATERIALS_IRIDESCENCE);
        if (iridescence) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const iridescenceDef = materialDef.extensions[KHR_MATERIALS_IRIDESCENCE] = {};
          if (iridescence.getIridescenceFactor() > 0) {
            iridescenceDef.iridescenceFactor = iridescence.getIridescenceFactor();
          }
          if (iridescence.getIridescenceIOR() !== 1.3) {
            iridescenceDef.iridescenceIor = iridescence.getIridescenceIOR();
          }
          if (iridescence.getIridescenceThicknessMinimum() !== 100) {
            iridescenceDef.iridescenceThicknessMinimum = iridescence.getIridescenceThicknessMinimum();
          }
          if (iridescence.getIridescenceThicknessMaximum() !== 400) {
            iridescenceDef.iridescenceThicknessMaximum = iridescence.getIridescenceThicknessMaximum();
          }
          if (iridescence.getIridescenceTexture()) {
            const texture = iridescence.getIridescenceTexture();
            const textureInfo = iridescence.getIridescenceTextureInfo();
            iridescenceDef.iridescenceTexture = context.createTextureInfoDef(texture, textureInfo);
          }
          if (iridescence.getIridescenceThicknessTexture()) {
            const texture = iridescence.getIridescenceThicknessTexture();
            const textureInfo = iridescence.getIridescenceThicknessTextureInfo();
            iridescenceDef.iridescenceThicknessTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsIridescence.EXTENSION_NAME = KHR_MATERIALS_IRIDESCENCE;
  var {
    R: R$3,
    G: G$3,
    B: B$2,
    A: A$2
  } = TextureChannel;
  var PBRSpecularGlossiness = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;
      this.propertyType = "PBRSpecularGlossiness";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        diffuseFactor: [1, 1, 1, 1],
        diffuseTexture: null,
        diffuseTextureInfo: new TextureInfo(this.graph, "diffuseTextureInfo"),
        specularFactor: [1, 1, 1],
        glossinessFactor: 1,
        specularGlossinessTexture: null,
        specularGlossinessTextureInfo: new TextureInfo(this.graph, "specularGlossinessTextureInfo")
      });
    }
    /**********************************************************************************************
     * Diffuse.
     */
    /** Diffuse; Linear-sRGB components. See {@link PBRSpecularGlossiness.getDiffuseTexture getDiffuseTexture}. */
    getDiffuseFactor() {
      return this.get("diffuseFactor");
    }
    /** Diffuse; Linear-sRGB components. See {@link PBRSpecularGlossiness.getDiffuseTexture getDiffuseTexture}. */
    setDiffuseFactor(factor) {
      return this.set("diffuseFactor", factor);
    }
    /**
     * Diffuse texture; sRGB. Alternative to baseColorTexture, used within the
     * spec/gloss PBR workflow.
     */
    getDiffuseTexture() {
      return this.getRef("diffuseTexture");
    }
    /**
     * Settings affecting the material's use of its diffuse texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getDiffuseTextureInfo() {
      return this.getRef("diffuseTexture") ? this.getRef("diffuseTextureInfo") : null;
    }
    /** Sets diffuse texture. See {@link PBRSpecularGlossiness.getDiffuseTexture getDiffuseTexture}. */
    setDiffuseTexture(texture) {
      return this.setRef("diffuseTexture", texture, {
        channels: R$3 | G$3 | B$2 | A$2,
        isColor: true
      });
    }
    /**********************************************************************************************
     * Specular.
     */
    /** Specular; linear multiplier. */
    getSpecularFactor() {
      return this.get("specularFactor");
    }
    /** Specular; linear multiplier. */
    setSpecularFactor(factor) {
      return this.set("specularFactor", factor);
    }
    /**********************************************************************************************
     * Glossiness.
     */
    /** Glossiness; linear multiplier. */
    getGlossinessFactor() {
      return this.get("glossinessFactor");
    }
    /** Glossiness; linear multiplier. */
    setGlossinessFactor(factor) {
      return this.set("glossinessFactor", factor);
    }
    /**********************************************************************************************
     * Specular/Glossiness.
     */
    /** Spec/gloss texture; linear multiplier. */
    getSpecularGlossinessTexture() {
      return this.getRef("specularGlossinessTexture");
    }
    /**
     * Settings affecting the material's use of its spec/gloss texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getSpecularGlossinessTextureInfo() {
      return this.getRef("specularGlossinessTexture") ? this.getRef("specularGlossinessTextureInfo") : null;
    }
    /** Spec/gloss texture; linear multiplier. */
    setSpecularGlossinessTexture(texture) {
      return this.setRef("specularGlossinessTexture", texture, {
        channels: R$3 | G$3 | B$2 | A$2
      });
    }
  };
  PBRSpecularGlossiness.EXTENSION_NAME = KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;
  var KHRMaterialsPBRSpecularGlossiness = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new PBRSpecularGlossiness property for use on a {@link Material}. */
    createPBRSpecularGlossiness() {
      return new PBRSpecularGlossiness(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS]) {
          const specGloss = this.createPBRSpecularGlossiness();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS, specGloss);
          const specGlossDef = materialDef.extensions[KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS];
          if (specGlossDef.diffuseFactor !== void 0) {
            specGloss.setDiffuseFactor(specGlossDef.diffuseFactor);
          }
          if (specGlossDef.specularFactor !== void 0) {
            specGloss.setSpecularFactor(specGlossDef.specularFactor);
          }
          if (specGlossDef.glossinessFactor !== void 0) {
            specGloss.setGlossinessFactor(specGlossDef.glossinessFactor);
          }
          if (specGlossDef.diffuseTexture !== void 0) {
            const textureInfoDef = specGlossDef.diffuseTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            specGloss.setDiffuseTexture(texture);
            context.setTextureInfo(specGloss.getDiffuseTextureInfo(), textureInfoDef);
          }
          if (specGlossDef.specularGlossinessTexture !== void 0) {
            const textureInfoDef = specGlossDef.specularGlossinessTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            specGloss.setSpecularGlossinessTexture(texture);
            context.setTextureInfo(specGloss.getSpecularGlossinessTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const specGloss = material.getExtension(KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS);
        if (specGloss) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const specGlossDef = materialDef.extensions[KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS] = {
            diffuseFactor: specGloss.getDiffuseFactor(),
            specularFactor: specGloss.getSpecularFactor(),
            glossinessFactor: specGloss.getGlossinessFactor()
          };
          if (specGloss.getDiffuseTexture()) {
            const texture = specGloss.getDiffuseTexture();
            const textureInfo = specGloss.getDiffuseTextureInfo();
            specGlossDef.diffuseTexture = context.createTextureInfoDef(texture, textureInfo);
          }
          if (specGloss.getSpecularGlossinessTexture()) {
            const texture = specGloss.getSpecularGlossinessTexture();
            const textureInfo = specGloss.getSpecularGlossinessTextureInfo();
            specGlossDef.specularGlossinessTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsPBRSpecularGlossiness.EXTENSION_NAME = KHR_MATERIALS_PBR_SPECULAR_GLOSSINESS;
  var {
    R: R$2,
    G: G$2,
    B: B$1,
    A: A$1
  } = TextureChannel;
  var Sheen = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_SHEEN;
      this.propertyType = "Sheen";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        sheenColorFactor: [0, 0, 0],
        sheenColorTexture: null,
        sheenColorTextureInfo: new TextureInfo(this.graph, "sheenColorTextureInfo"),
        sheenRoughnessFactor: 0,
        sheenRoughnessTexture: null,
        sheenRoughnessTextureInfo: new TextureInfo(this.graph, "sheenRoughnessTextureInfo")
      });
    }
    /**********************************************************************************************
     * Sheen color.
     */
    /** Sheen; linear multiplier. */
    getSheenColorFactor() {
      return this.get("sheenColorFactor");
    }
    /** Sheen; linear multiplier. */
    setSheenColorFactor(factor) {
      return this.set("sheenColorFactor", factor);
    }
    /**
     * Sheen color texture, in sRGB colorspace.
     */
    getSheenColorTexture() {
      return this.getRef("sheenColorTexture");
    }
    /**
     * Settings affecting the material's use of its sheen color texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getSheenColorTextureInfo() {
      return this.getRef("sheenColorTexture") ? this.getRef("sheenColorTextureInfo") : null;
    }
    /** Sets sheen color texture. See {@link Sheen.getSheenColorTexture getSheenColorTexture}. */
    setSheenColorTexture(texture) {
      return this.setRef("sheenColorTexture", texture, {
        channels: R$2 | G$2 | B$1,
        isColor: true
      });
    }
    /**********************************************************************************************
     * Sheen roughness.
     */
    /** Sheen roughness; linear multiplier. See {@link Sheen.getSheenRoughnessTexture getSheenRoughnessTexture}. */
    getSheenRoughnessFactor() {
      return this.get("sheenRoughnessFactor");
    }
    /** Sheen roughness; linear multiplier. See {@link Sheen.getSheenRoughnessTexture getSheenRoughnessTexture}. */
    setSheenRoughnessFactor(factor) {
      return this.set("sheenRoughnessFactor", factor);
    }
    /**
     * Sheen roughness texture; linear multiplier. The `a` channel of this texture specifies
     * roughness, independent of the base layer's roughness.
     */
    getSheenRoughnessTexture() {
      return this.getRef("sheenRoughnessTexture");
    }
    /**
     * Settings affecting the material's use of its sheen roughness texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getSheenRoughnessTextureInfo() {
      return this.getRef("sheenRoughnessTexture") ? this.getRef("sheenRoughnessTextureInfo") : null;
    }
    /**
     * Sets sheen roughness texture.  The `a` channel of this texture specifies
     * roughness, independent of the base layer's roughness.
     */
    setSheenRoughnessTexture(texture) {
      return this.setRef("sheenRoughnessTexture", texture, {
        channels: A$1
      });
    }
  };
  Sheen.EXTENSION_NAME = KHR_MATERIALS_SHEEN;
  var KHRMaterialsSheen = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_SHEEN;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Sheen property for use on a {@link Material}. */
    createSheen() {
      return new Sheen(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_SHEEN]) {
          const sheen = this.createSheen();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_SHEEN, sheen);
          const sheenDef = materialDef.extensions[KHR_MATERIALS_SHEEN];
          if (sheenDef.sheenColorFactor !== void 0) {
            sheen.setSheenColorFactor(sheenDef.sheenColorFactor);
          }
          if (sheenDef.sheenRoughnessFactor !== void 0) {
            sheen.setSheenRoughnessFactor(sheenDef.sheenRoughnessFactor);
          }
          if (sheenDef.sheenColorTexture !== void 0) {
            const textureInfoDef = sheenDef.sheenColorTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            sheen.setSheenColorTexture(texture);
            context.setTextureInfo(sheen.getSheenColorTextureInfo(), textureInfoDef);
          }
          if (sheenDef.sheenRoughnessTexture !== void 0) {
            const textureInfoDef = sheenDef.sheenRoughnessTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            sheen.setSheenRoughnessTexture(texture);
            context.setTextureInfo(sheen.getSheenRoughnessTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const sheen = material.getExtension(KHR_MATERIALS_SHEEN);
        if (sheen) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const sheenDef = materialDef.extensions[KHR_MATERIALS_SHEEN] = {
            sheenColorFactor: sheen.getSheenColorFactor(),
            sheenRoughnessFactor: sheen.getSheenRoughnessFactor()
          };
          if (sheen.getSheenColorTexture()) {
            const texture = sheen.getSheenColorTexture();
            const textureInfo = sheen.getSheenColorTextureInfo();
            sheenDef.sheenColorTexture = context.createTextureInfoDef(texture, textureInfo);
          }
          if (sheen.getSheenRoughnessTexture()) {
            const texture = sheen.getSheenRoughnessTexture();
            const textureInfo = sheen.getSheenRoughnessTextureInfo();
            sheenDef.sheenRoughnessTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsSheen.EXTENSION_NAME = KHR_MATERIALS_SHEEN;
  var {
    R: R$1,
    G: G$1,
    B: B2,
    A: A2
  } = TextureChannel;
  var Specular = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_SPECULAR;
      this.propertyType = "Specular";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        specularFactor: 1,
        specularTexture: null,
        specularTextureInfo: new TextureInfo(this.graph, "specularTextureInfo"),
        specularColorFactor: [1, 1, 1],
        specularColorTexture: null,
        specularColorTextureInfo: new TextureInfo(this.graph, "specularColorTextureInfo")
      });
    }
    /**********************************************************************************************
     * Specular.
     */
    /** Specular; linear multiplier. See {@link Specular.getSpecularTexture getSpecularTexture}. */
    getSpecularFactor() {
      return this.get("specularFactor");
    }
    /** Specular; linear multiplier. See {@link Specular.getSpecularTexture getSpecularTexture}. */
    setSpecularFactor(factor) {
      return this.set("specularFactor", factor);
    }
    /** Specular color; Linear-sRGB components. See {@link Specular.getSpecularTexture getSpecularTexture}. */
    getSpecularColorFactor() {
      return this.get("specularColorFactor");
    }
    /** Specular color; Linear-sRGB components. See {@link Specular.getSpecularTexture getSpecularTexture}. */
    setSpecularColorFactor(factor) {
      return this.set("specularColorFactor", factor);
    }
    /**
     * Specular texture; linear multiplier. Configures the strength of the specular reflection in
     * the dielectric BRDF. A value of zero disables the specular reflection, resulting in a pure
     * diffuse material.
     *
     * Only the alpha (A) channel is used for specular strength, but this texture may optionally
     * be packed with specular color (RGB) into a single texture.
     */
    getSpecularTexture() {
      return this.getRef("specularTexture");
    }
    /**
     * Settings affecting the material's use of its specular texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getSpecularTextureInfo() {
      return this.getRef("specularTexture") ? this.getRef("specularTextureInfo") : null;
    }
    /** Sets specular texture. See {@link Specular.getSpecularTexture getSpecularTexture}. */
    setSpecularTexture(texture) {
      return this.setRef("specularTexture", texture, {
        channels: A2
      });
    }
    /**
     * Specular color texture; linear multiplier. Defines the F0 color of the specular reflection
     * (RGB channels, encoded in sRGB) in the the dielectric BRDF.
     *
     * Only RGB channels are used here, but this texture may optionally be packed with a specular
     * factor (A) into a single texture.
     */
    getSpecularColorTexture() {
      return this.getRef("specularColorTexture");
    }
    /**
     * Settings affecting the material's use of its specular color texture. If no texture is
     * attached, {@link TextureInfo} is `null`.
     */
    getSpecularColorTextureInfo() {
      return this.getRef("specularColorTexture") ? this.getRef("specularColorTextureInfo") : null;
    }
    /** Sets specular color texture. See {@link Specular.getSpecularColorTexture getSpecularColorTexture}. */
    setSpecularColorTexture(texture) {
      return this.setRef("specularColorTexture", texture, {
        channels: R$1 | G$1 | B2,
        isColor: true
      });
    }
  };
  Specular.EXTENSION_NAME = KHR_MATERIALS_SPECULAR;
  var KHRMaterialsSpecular = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_SPECULAR;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Specular property for use on a {@link Material}. */
    createSpecular() {
      return new Specular(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_SPECULAR]) {
          const specular = this.createSpecular();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_SPECULAR, specular);
          const specularDef = materialDef.extensions[KHR_MATERIALS_SPECULAR];
          if (specularDef.specularFactor !== void 0) {
            specular.setSpecularFactor(specularDef.specularFactor);
          }
          if (specularDef.specularColorFactor !== void 0) {
            specular.setSpecularColorFactor(specularDef.specularColorFactor);
          }
          if (specularDef.specularTexture !== void 0) {
            const textureInfoDef = specularDef.specularTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            specular.setSpecularTexture(texture);
            context.setTextureInfo(specular.getSpecularTextureInfo(), textureInfoDef);
          }
          if (specularDef.specularColorTexture !== void 0) {
            const textureInfoDef = specularDef.specularColorTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            specular.setSpecularColorTexture(texture);
            context.setTextureInfo(specular.getSpecularColorTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const specular = material.getExtension(KHR_MATERIALS_SPECULAR);
        if (specular) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const specularDef = materialDef.extensions[KHR_MATERIALS_SPECULAR] = {};
          if (specular.getSpecularFactor() !== 1) {
            specularDef.specularFactor = specular.getSpecularFactor();
          }
          if (!MathUtils.eq(specular.getSpecularColorFactor(), [1, 1, 1])) {
            specularDef.specularColorFactor = specular.getSpecularColorFactor();
          }
          if (specular.getSpecularTexture()) {
            const texture = specular.getSpecularTexture();
            const textureInfo = specular.getSpecularTextureInfo();
            specularDef.specularTexture = context.createTextureInfoDef(texture, textureInfo);
          }
          if (specular.getSpecularColorTexture()) {
            const texture = specular.getSpecularColorTexture();
            const textureInfo = specular.getSpecularColorTextureInfo();
            specularDef.specularColorTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsSpecular.EXTENSION_NAME = KHR_MATERIALS_SPECULAR;
  var {
    R: R2
  } = TextureChannel;
  var Transmission = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_TRANSMISSION;
      this.propertyType = "Transmission";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        transmissionFactor: 0,
        transmissionTexture: null,
        transmissionTextureInfo: new TextureInfo(this.graph, "transmissionTextureInfo")
      });
    }
    /**********************************************************************************************
     * Transmission.
     */
    /** Transmission; linear multiplier. See {@link Transmission.getTransmissionTexture getTransmissionTexture}. */
    getTransmissionFactor() {
      return this.get("transmissionFactor");
    }
    /** Transmission; linear multiplier. See {@link Transmission.getTransmissionTexture getTransmissionTexture}. */
    setTransmissionFactor(factor) {
      return this.set("transmissionFactor", factor);
    }
    /**
     * Transmission texture; linear multiplier. The `r` channel of this texture specifies
     * transmission [0-1] of the material's surface. By default this is a thin transparency
     * effect, but volume effects (refraction, subsurface scattering) may be introduced with the
     * addition of the `KHR_materials_volume` extension.
     */
    getTransmissionTexture() {
      return this.getRef("transmissionTexture");
    }
    /**
     * Settings affecting the material's use of its transmission texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getTransmissionTextureInfo() {
      return this.getRef("transmissionTexture") ? this.getRef("transmissionTextureInfo") : null;
    }
    /** Sets transmission texture. See {@link Transmission.getTransmissionTexture getTransmissionTexture}. */
    setTransmissionTexture(texture) {
      return this.setRef("transmissionTexture", texture, {
        channels: R2
      });
    }
  };
  Transmission.EXTENSION_NAME = KHR_MATERIALS_TRANSMISSION;
  var KHRMaterialsTransmission = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_TRANSMISSION;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Transmission property for use on a {@link Material}. */
    createTransmission() {
      return new Transmission(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_TRANSMISSION]) {
          const transmission = this.createTransmission();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_TRANSMISSION, transmission);
          const transmissionDef = materialDef.extensions[KHR_MATERIALS_TRANSMISSION];
          if (transmissionDef.transmissionFactor !== void 0) {
            transmission.setTransmissionFactor(transmissionDef.transmissionFactor);
          }
          if (transmissionDef.transmissionTexture !== void 0) {
            const textureInfoDef = transmissionDef.transmissionTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            transmission.setTransmissionTexture(texture);
            context.setTextureInfo(transmission.getTransmissionTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const transmission = material.getExtension(KHR_MATERIALS_TRANSMISSION);
        if (transmission) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const transmissionDef = materialDef.extensions[KHR_MATERIALS_TRANSMISSION] = {
            transmissionFactor: transmission.getTransmissionFactor()
          };
          if (transmission.getTransmissionTexture()) {
            const texture = transmission.getTransmissionTexture();
            const textureInfo = transmission.getTransmissionTextureInfo();
            transmissionDef.transmissionTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsTransmission.EXTENSION_NAME = KHR_MATERIALS_TRANSMISSION;
  var Unlit = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_UNLIT;
      this.propertyType = "Unlit";
      this.parentTypes = [PropertyType.MATERIAL];
    }
  };
  Unlit.EXTENSION_NAME = KHR_MATERIALS_UNLIT;
  var KHRMaterialsUnlit = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_UNLIT;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Unlit property for use on a {@link Material}. */
    createUnlit() {
      return new Unlit(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const materialDefs = context.jsonDoc.json.materials || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_UNLIT]) {
          context.materials[materialIndex].setExtension(KHR_MATERIALS_UNLIT, this.createUnlit());
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        if (material.getExtension(KHR_MATERIALS_UNLIT)) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          materialDef.extensions[KHR_MATERIALS_UNLIT] = {};
        }
      });
      return this;
    }
  };
  KHRMaterialsUnlit.EXTENSION_NAME = KHR_MATERIALS_UNLIT;
  var Mapping = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_VARIANTS;
      this.propertyType = "Mapping";
      this.parentTypes = ["MappingList"];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        material: null,
        variants: new RefSet()
      });
    }
    /** The {@link Material} designated for this {@link Primitive}, under the given variants. */
    getMaterial() {
      return this.getRef("material");
    }
    /** The {@link Material} designated for this {@link Primitive}, under the given variants. */
    setMaterial(material) {
      return this.setRef("material", material);
    }
    /** Adds a {@link Variant} to this mapping. */
    addVariant(variant) {
      return this.addRef("variants", variant);
    }
    /** Removes a {@link Variant} from this mapping. */
    removeVariant(variant) {
      return this.removeRef("variants", variant);
    }
    /** Lists {@link Variant}s in this mapping. */
    listVariants() {
      return this.listRefs("variants");
    }
  };
  Mapping.EXTENSION_NAME = KHR_MATERIALS_VARIANTS;
  var MappingList = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_VARIANTS;
      this.propertyType = "MappingList";
      this.parentTypes = [PropertyType.PRIMITIVE];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        mappings: new RefSet()
      });
    }
    /** Adds a {@link Mapping} to this mapping. */
    addMapping(mapping) {
      return this.addRef("mappings", mapping);
    }
    /** Removes a {@link Mapping} from the list for this {@link Primitive}. */
    removeMapping(mapping) {
      return this.removeRef("mappings", mapping);
    }
    /** Lists {@link Mapping}s in this {@link Primitive}. */
    listMappings() {
      return this.listRefs("mappings");
    }
  };
  MappingList.EXTENSION_NAME = KHR_MATERIALS_VARIANTS;
  var Variant = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_VARIANTS;
      this.propertyType = "Variant";
      this.parentTypes = ["MappingList"];
    }
  };
  Variant.EXTENSION_NAME = KHR_MATERIALS_VARIANTS;
  var KHRMaterialsVariants = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_VARIANTS;
    }
    /** Creates a new MappingList property. */
    createMappingList() {
      return new MappingList(this.document.getGraph());
    }
    /** Creates a new Variant property. */
    createVariant(name = "") {
      return new Variant(this.document.getGraph(), name);
    }
    /** Creates a new Mapping property. */
    createMapping() {
      return new Mapping(this.document.getGraph());
    }
    /** Lists all Variants on the current Document. */
    listVariants() {
      return Array.from(this.properties).filter((prop) => prop instanceof Variant);
    }
    /** @hidden */
    read(context) {
      const jsonDoc = context.jsonDoc;
      if (!jsonDoc.json.extensions || !jsonDoc.json.extensions[KHR_MATERIALS_VARIANTS]) return this;
      const variantsRootDef = jsonDoc.json.extensions[KHR_MATERIALS_VARIANTS];
      const variantDefs = variantsRootDef.variants || [];
      const variants = variantDefs.map((variantDef) => this.createVariant().setName(variantDef.name || ""));
      const meshDefs = jsonDoc.json.meshes || [];
      meshDefs.forEach((meshDef, meshIndex) => {
        const mesh = context.meshes[meshIndex];
        const primDefs = meshDef.primitives || [];
        primDefs.forEach((primDef, primIndex) => {
          if (!primDef.extensions || !primDef.extensions[KHR_MATERIALS_VARIANTS]) {
            return;
          }
          const mappingList = this.createMappingList();
          const variantPrimDef = primDef.extensions[KHR_MATERIALS_VARIANTS];
          for (const mappingDef of variantPrimDef.mappings) {
            const mapping = this.createMapping();
            if (mappingDef.material !== void 0) {
              mapping.setMaterial(context.materials[mappingDef.material]);
            }
            for (const variantIndex of mappingDef.variants || []) {
              mapping.addVariant(variants[variantIndex]);
            }
            mappingList.addMapping(mapping);
          }
          mesh.listPrimitives()[primIndex].setExtension(KHR_MATERIALS_VARIANTS, mappingList);
        });
      });
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      const variants = this.listVariants();
      if (!variants.length) return this;
      const variantDefs = [];
      const variantIndexMap = /* @__PURE__ */ new Map();
      for (const variant of variants) {
        variantIndexMap.set(variant, variantDefs.length);
        variantDefs.push(context.createPropertyDef(variant));
      }
      for (const mesh of this.document.getRoot().listMeshes()) {
        const meshIndex = context.meshIndexMap.get(mesh);
        mesh.listPrimitives().forEach((prim, primIndex) => {
          const mappingList = prim.getExtension(KHR_MATERIALS_VARIANTS);
          if (!mappingList) return;
          const primDef = context.jsonDoc.json.meshes[meshIndex].primitives[primIndex];
          const mappingDefs = mappingList.listMappings().map((mapping) => {
            const mappingDef = context.createPropertyDef(mapping);
            const material = mapping.getMaterial();
            if (material) {
              mappingDef.material = context.materialIndexMap.get(material);
            }
            mappingDef.variants = mapping.listVariants().map((variant) => variantIndexMap.get(variant));
            return mappingDef;
          });
          primDef.extensions = primDef.extensions || {};
          primDef.extensions[KHR_MATERIALS_VARIANTS] = {
            mappings: mappingDefs
          };
        });
      }
      jsonDoc.json.extensions = jsonDoc.json.extensions || {};
      jsonDoc.json.extensions[KHR_MATERIALS_VARIANTS] = {
        variants: variantDefs
      };
      return this;
    }
  };
  KHRMaterialsVariants.EXTENSION_NAME = KHR_MATERIALS_VARIANTS;
  var {
    G: G2
  } = TextureChannel;
  var Volume = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_MATERIALS_VOLUME;
      this.propertyType = "Volume";
      this.parentTypes = [PropertyType.MATERIAL];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        thicknessFactor: 0,
        thicknessTexture: null,
        thicknessTextureInfo: new TextureInfo(this.graph, "thicknessTexture"),
        attenuationDistance: Infinity,
        attenuationColor: [1, 1, 1]
      });
    }
    /**********************************************************************************************
     * Thickness.
     */
    /**
     * Thickness of the volume beneath the surface in meters in the local coordinate system of the
     * node. If the value is 0 the material is thin-walled. Otherwise the material is a volume
     * boundary. The doubleSided property has no effect on volume boundaries.
     */
    getThicknessFactor() {
      return this.get("thicknessFactor");
    }
    /**
     * Thickness of the volume beneath the surface in meters in the local coordinate system of the
     * node. If the value is 0 the material is thin-walled. Otherwise the material is a volume
     * boundary. The doubleSided property has no effect on volume boundaries.
     */
    setThicknessFactor(factor) {
      return this.set("thicknessFactor", factor);
    }
    /**
     * Texture that defines the thickness, stored in the G channel. This will be multiplied by
     * thicknessFactor.
     */
    getThicknessTexture() {
      return this.getRef("thicknessTexture");
    }
    /**
     * Settings affecting the material's use of its thickness texture. If no texture is attached,
     * {@link TextureInfo} is `null`.
     */
    getThicknessTextureInfo() {
      return this.getRef("thicknessTexture") ? this.getRef("thicknessTextureInfo") : null;
    }
    /**
     * Texture that defines the thickness, stored in the G channel. This will be multiplied by
     * thicknessFactor.
     */
    setThicknessTexture(texture) {
      return this.setRef("thicknessTexture", texture, {
        channels: G2
      });
    }
    /**********************************************************************************************
     * Attenuation.
     */
    /**
     * Density of the medium given as the average distance in meters that light travels in the
     * medium before interacting with a particle.
     */
    getAttenuationDistance() {
      return this.get("attenuationDistance");
    }
    /**
     * Density of the medium given as the average distance in meters that light travels in the
     * medium before interacting with a particle.
     */
    setAttenuationDistance(distance) {
      return this.set("attenuationDistance", distance);
    }
    /**
     * Color (linear) that white light turns into due to absorption when reaching the attenuation
     * distance.
     */
    getAttenuationColor() {
      return this.get("attenuationColor");
    }
    /**
     * Color (linear) that white light turns into due to absorption when reaching the attenuation
     * distance.
     */
    setAttenuationColor(color) {
      return this.set("attenuationColor", color);
    }
  };
  Volume.EXTENSION_NAME = KHR_MATERIALS_VOLUME;
  var KHRMaterialsVolume = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MATERIALS_VOLUME;
      this.prereadTypes = [PropertyType.MESH];
      this.prewriteTypes = [PropertyType.MESH];
    }
    /** Creates a new Volume property for use on a {@link Material}. */
    createVolume() {
      return new Volume(this.document.getGraph());
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(_context) {
      return this;
    }
    /** @hidden */
    preread(context) {
      const jsonDoc = context.jsonDoc;
      const materialDefs = jsonDoc.json.materials || [];
      const textureDefs = jsonDoc.json.textures || [];
      materialDefs.forEach((materialDef, materialIndex) => {
        if (materialDef.extensions && materialDef.extensions[KHR_MATERIALS_VOLUME]) {
          const volume = this.createVolume();
          context.materials[materialIndex].setExtension(KHR_MATERIALS_VOLUME, volume);
          const volumeDef = materialDef.extensions[KHR_MATERIALS_VOLUME];
          if (volumeDef.thicknessFactor !== void 0) {
            volume.setThicknessFactor(volumeDef.thicknessFactor);
          }
          if (volumeDef.attenuationDistance !== void 0) {
            volume.setAttenuationDistance(volumeDef.attenuationDistance);
          }
          if (volumeDef.attenuationColor !== void 0) {
            volume.setAttenuationColor(volumeDef.attenuationColor);
          }
          if (volumeDef.thicknessTexture !== void 0) {
            const textureInfoDef = volumeDef.thicknessTexture;
            const texture = context.textures[textureDefs[textureInfoDef.index].source];
            volume.setThicknessTexture(texture);
            context.setTextureInfo(volume.getThicknessTextureInfo(), textureInfoDef);
          }
        }
      });
      return this;
    }
    /** @hidden */
    prewrite(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listMaterials().forEach((material) => {
        const volume = material.getExtension(KHR_MATERIALS_VOLUME);
        if (volume) {
          const materialIndex = context.materialIndexMap.get(material);
          const materialDef = jsonDoc.json.materials[materialIndex];
          materialDef.extensions = materialDef.extensions || {};
          const volumeDef = materialDef.extensions[KHR_MATERIALS_VOLUME] = {};
          if (volume.getThicknessFactor() > 0) {
            volumeDef.thicknessFactor = volume.getThicknessFactor();
          }
          if (Number.isFinite(volume.getAttenuationDistance())) {
            volumeDef.attenuationDistance = volume.getAttenuationDistance();
          }
          if (!MathUtils.eq(volume.getAttenuationColor(), [1, 1, 1])) {
            volumeDef.attenuationColor = volume.getAttenuationColor();
          }
          if (volume.getThicknessTexture()) {
            const texture = volume.getThicknessTexture();
            const textureInfo = volume.getThicknessTextureInfo();
            volumeDef.thicknessTexture = context.createTextureInfoDef(texture, textureInfo);
          }
        }
      });
      return this;
    }
  };
  KHRMaterialsVolume.EXTENSION_NAME = KHR_MATERIALS_VOLUME;
  var KHRMeshQuantization = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_MESH_QUANTIZATION;
    }
    /** @hidden */
    read(_) {
      return this;
    }
    /** @hidden */
    write(_) {
      return this;
    }
  };
  KHRMeshQuantization.EXTENSION_NAME = KHR_MESH_QUANTIZATION;
  var Visibility = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_NODE_VISIBILITY;
      this.propertyType = "Visibility";
      this.parentTypes = [PropertyType.NODE];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        visible: true
      });
    }
    /** Visibility of node and descendants. */
    getVisible() {
      return this.get("visible");
    }
    /** Visibility of node and descendants. */
    setVisible(visible) {
      return this.set("visible", visible);
    }
  };
  Visibility.EXTENSION_NAME = KHR_NODE_VISIBILITY;
  var KHRNodeVisibility = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_NODE_VISIBILITY;
    }
    /** Creates a new Visibility property for use on a {@link Node}. */
    createVisibility() {
      return new Visibility(this.document.getGraph());
    }
    /** @hidden */
    read(context) {
      const jsonDoc = context.jsonDoc;
      const nodeDefs = jsonDoc.json.nodes || [];
      nodeDefs.forEach((nodeDef, nodeIndex) => {
        if (nodeDef.extensions && nodeDef.extensions[KHR_NODE_VISIBILITY]) {
          const visibility = this.createVisibility();
          context.nodes[nodeIndex].setExtension(KHR_NODE_VISIBILITY, visibility);
          const visibilityDef = nodeDef.extensions[KHR_NODE_VISIBILITY];
          if (visibilityDef.visible !== void 0) {
            visibility.setVisible(visibilityDef.visible);
          }
        }
      });
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      for (const node of this.document.getRoot().listNodes()) {
        const visibility = node.getExtension(KHR_NODE_VISIBILITY);
        if (!visibility) continue;
        const nodeIndex = context.nodeIndexMap.get(node);
        const nodeDef = jsonDoc.json.nodes[nodeIndex];
        nodeDef.extensions = nodeDef.extensions || {};
        nodeDef.extensions[KHR_NODE_VISIBILITY] = {
          visible: visibility.getVisible()
        };
      }
      return this;
    }
  };
  KHRNodeVisibility.EXTENSION_NAME = KHR_NODE_VISIBILITY;
  var KTX2ImageUtils = class {
    match(array) {
      return array[0] === 171 && array[1] === 75 && array[2] === 84 && array[3] === 88 && array[4] === 32 && array[5] === 50 && array[6] === 48 && array[7] === 187 && array[8] === 13 && array[9] === 10 && array[10] === 26 && array[11] === 10;
    }
    getSize(array) {
      const container = read(array);
      return [container.pixelWidth, container.pixelHeight];
    }
    getChannels(array) {
      const container = read(array);
      const dfd = container.dataFormatDescriptor[0];
      if (dfd.colorModel === KHR_DF_MODEL_ETC1S) {
        return dfd.samples.length === 2 && (dfd.samples[1].channelType & 15) === 15 ? 4 : 3;
      } else if (dfd.colorModel === KHR_DF_MODEL_UASTC) {
        return (dfd.samples[0].channelType & 15) === 3 ? 4 : 3;
      }
      throw new Error(`Unexpected KTX2 colorModel, "${dfd.colorModel}".`);
    }
    getVRAMByteLength(array) {
      const container = read(array);
      const hasAlpha = this.getChannels(array) > 3;
      let uncompressedBytes = 0;
      for (let i = 0; i < container.levels.length; i++) {
        const level = container.levels[i];
        if (level.uncompressedByteLength) {
          uncompressedBytes += level.uncompressedByteLength;
        } else {
          const levelWidth = Math.max(1, Math.floor(container.pixelWidth / Math.pow(2, i)));
          const levelHeight = Math.max(1, Math.floor(container.pixelHeight / Math.pow(2, i)));
          const blockSize = hasAlpha ? 16 : 8;
          uncompressedBytes += levelWidth / 4 * (levelHeight / 4) * blockSize;
        }
      }
      return uncompressedBytes;
    }
  };
  var KHRTextureBasisu = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_TEXTURE_BASISU;
      this.prereadTypes = [PropertyType.TEXTURE];
    }
    /** @hidden */
    static register() {
      ImageUtils.registerFormat("image/ktx2", new KTX2ImageUtils());
    }
    /** @hidden */
    preread(context) {
      if (context.jsonDoc.json.textures) {
        context.jsonDoc.json.textures.forEach((textureDef) => {
          if (textureDef.extensions && textureDef.extensions[KHR_TEXTURE_BASISU]) {
            const basisuDef = textureDef.extensions[KHR_TEXTURE_BASISU];
            textureDef.source = basisuDef.source;
          }
        });
      }
      return this;
    }
    /** @hidden */
    read(_context) {
      return this;
    }
    /** @hidden */
    write(context) {
      const jsonDoc = context.jsonDoc;
      this.document.getRoot().listTextures().forEach((texture) => {
        if (texture.getMimeType() === "image/ktx2") {
          const imageIndex = context.imageIndexMap.get(texture);
          jsonDoc.json.textures.forEach((textureDef) => {
            if (textureDef.source === imageIndex) {
              textureDef.extensions = textureDef.extensions || {};
              textureDef.extensions[KHR_TEXTURE_BASISU] = {
                source: textureDef.source
              };
              delete textureDef.source;
            }
          });
        }
      });
      return this;
    }
  };
  KHRTextureBasisu.EXTENSION_NAME = KHR_TEXTURE_BASISU;
  var Transform = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_TEXTURE_TRANSFORM;
      this.propertyType = "Transform";
      this.parentTypes = [PropertyType.TEXTURE_INFO];
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        offset: [0, 0],
        rotation: 0,
        scale: [1, 1],
        texCoord: null
      });
    }
    getOffset() {
      return this.get("offset");
    }
    setOffset(offset) {
      return this.set("offset", offset);
    }
    getRotation() {
      return this.get("rotation");
    }
    setRotation(rotation) {
      return this.set("rotation", rotation);
    }
    getScale() {
      return this.get("scale");
    }
    setScale(scale) {
      return this.set("scale", scale);
    }
    getTexCoord() {
      return this.get("texCoord");
    }
    setTexCoord(texCoord) {
      return this.set("texCoord", texCoord);
    }
  };
  Transform.EXTENSION_NAME = KHR_TEXTURE_TRANSFORM;
  var KHRTextureTransform = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_TEXTURE_TRANSFORM;
    }
    /** Creates a new Transform property for use on a {@link TextureInfo}. */
    createTransform() {
      return new Transform(this.document.getGraph());
    }
    /** @hidden */
    read(context) {
      for (const [textureInfo, textureInfoDef] of Array.from(context.textureInfos.entries())) {
        if (!textureInfoDef.extensions || !textureInfoDef.extensions[KHR_TEXTURE_TRANSFORM]) continue;
        const transform = this.createTransform();
        const transformDef = textureInfoDef.extensions[KHR_TEXTURE_TRANSFORM];
        if (transformDef.offset !== void 0) transform.setOffset(transformDef.offset);
        if (transformDef.rotation !== void 0) transform.setRotation(transformDef.rotation);
        if (transformDef.scale !== void 0) transform.setScale(transformDef.scale);
        if (transformDef.texCoord !== void 0) transform.setTexCoord(transformDef.texCoord);
        textureInfo.setExtension(KHR_TEXTURE_TRANSFORM, transform);
      }
      return this;
    }
    /** @hidden */
    write(context) {
      const textureInfoEntries = Array.from(context.textureInfoDefMap.entries());
      for (const [textureInfo, textureInfoDef] of textureInfoEntries) {
        const transform = textureInfo.getExtension(KHR_TEXTURE_TRANSFORM);
        if (!transform) continue;
        textureInfoDef.extensions = textureInfoDef.extensions || {};
        const transformDef = {};
        const eq2 = MathUtils.eq;
        if (!eq2(transform.getOffset(), [0, 0])) transformDef.offset = transform.getOffset();
        if (transform.getRotation() !== 0) transformDef.rotation = transform.getRotation();
        if (!eq2(transform.getScale(), [1, 1])) transformDef.scale = transform.getScale();
        if (transform.getTexCoord() != null) transformDef.texCoord = transform.getTexCoord();
        textureInfoDef.extensions[KHR_TEXTURE_TRANSFORM] = transformDef;
      }
      return this;
    }
  };
  KHRTextureTransform.EXTENSION_NAME = KHR_TEXTURE_TRANSFORM;
  var PARENT_TYPES = [PropertyType.ROOT, PropertyType.SCENE, PropertyType.NODE, PropertyType.MESH, PropertyType.MATERIAL, PropertyType.TEXTURE, PropertyType.ANIMATION];
  var Packet = class extends ExtensionProperty {
    init() {
      this.extensionName = KHR_XMP_JSON_LD;
      this.propertyType = "Packet";
      this.parentTypes = PARENT_TYPES;
    }
    getDefaults() {
      return Object.assign(super.getDefaults(), {
        context: {},
        properties: {}
      });
    }
    /**********************************************************************************************
     * Context.
     */
    /**
     * Returns the XMP context definition URL for the given term.
     * See: https://json-ld.org/spec/latest/json-ld/#the-context
     * @param term Case-sensitive term. Usually a concise, lowercase, alphanumeric identifier.
     */
    getContext() {
      return this.get("context");
    }
    /**
     * Sets the XMP context definition URL for the given term.
     * See: https://json-ld.org/spec/latest/json-ld/#the-context
     *
     * Example:
     *
     * ```typescript
     * packet.setContext({
     *   dc: 'http://purl.org/dc/elements/1.1/',
     *   model3d: 'https://schema.khronos.org/model3d/xsd/1.0/',
     * });
     * ```
     *
     * @param term Case-sensitive term. Usually a concise, lowercase, alphanumeric identifier.
     * @param definition URI for XMP namespace.
     */
    setContext(context) {
      return this.set("context", _extends2({}, context));
    }
    /**********************************************************************************************
     * Properties.
     */
    /**
     * Lists properties defined in this packet.
     *
     * Example:
     *
     * ```typescript
     * packet.listProperties(); // → ['dc:Language', 'dc:Creator', 'xmp:CreateDate']
     * ```
     */
    listProperties() {
      return Object.keys(this.get("properties"));
    }
    /**
     * Returns the value of a property, as a literal or JSONLD object.
     *
     * Example:
     *
     * ```typescript
     * packet.getProperty('dc:Creator'); // → {"@list": ["Acme, Inc."]}
     * packet.getProperty('dc:Title'); // → {"@type": "rdf:Alt", "rdf:_1": {"@language": "en-US", "@value": "Lamp"}}
     * packet.getProperty('xmp:CreateDate'); // → "2022-01-01"
     * ```
     */
    getProperty(name) {
      const properties = this.get("properties");
      return name in properties ? properties[name] : null;
    }
    /**
     * Sets the value of a property, as a literal or JSONLD object.
     *
     * Example:
     *
     * ```typescript
     * packet.setProperty('dc:Creator', {'@list': ['Acme, Inc.']});
     * packet.setProperty('dc:Title', {
     * 	'@type': 'rdf:Alt',
     * 	'rdf:_1': {'@language': 'en-US', '@value': 'Lamp'}
     * });
     * packet.setProperty('model3d:preferredSurfaces', {'@list': ['vertical']});
     * ```
     */
    setProperty(name, value) {
      this._assertContext(name);
      const properties = _extends2({}, this.get("properties"));
      if (value) {
        properties[name] = value;
      } else {
        delete properties[name];
      }
      return this.set("properties", properties);
    }
    /**********************************************************************************************
     * Serialize / Deserialize.
     */
    /**
     * Serializes the packet context and properties to a JSONLD object.
     */
    toJSONLD() {
      const context = copyJSON(this.get("context"));
      const properties = copyJSON(this.get("properties"));
      return _extends2({
        "@context": context
      }, properties);
    }
    /**
     * Deserializes a JSONLD packet, then overwrites existing context and properties with
     * the new values.
     */
    fromJSONLD(jsonld) {
      jsonld = copyJSON(jsonld);
      const context = jsonld["@context"];
      if (context) this.set("context", context);
      delete jsonld["@context"];
      return this.set("properties", jsonld);
    }
    /**********************************************************************************************
     * Validation.
     */
    /** @hidden */
    _assertContext(name) {
      const prefix = name.split(":")[0];
      if (!(prefix in this.get("context"))) {
        throw new Error(`${KHR_XMP_JSON_LD}: Missing context for term, "${name}".`);
      }
    }
  };
  Packet.EXTENSION_NAME = KHR_XMP_JSON_LD;
  function copyJSON(object) {
    return JSON.parse(JSON.stringify(object));
  }
  var KHRXMP = class extends Extension {
    constructor(...args) {
      super(...args);
      this.extensionName = KHR_XMP_JSON_LD;
    }
    /** Creates a new XMP packet, to be linked with a {@link Document} or {@link Property Properties}. */
    createPacket() {
      return new Packet(this.document.getGraph());
    }
    /** Lists XMP packets currently defined in a {@link Document}. */
    listPackets() {
      return Array.from(this.properties);
    }
    /** @hidden */
    read(context) {
      var _context$jsonDoc$json;
      const extensionDef = (_context$jsonDoc$json = context.jsonDoc.json.extensions) == null ? void 0 : _context$jsonDoc$json[KHR_XMP_JSON_LD];
      if (!extensionDef || !extensionDef.packets) return this;
      const json = context.jsonDoc.json;
      const root = this.document.getRoot();
      const packets = extensionDef.packets.map((packetDef) => this.createPacket().fromJSONLD(packetDef));
      const defLists = [[json.asset], json.scenes, json.nodes, json.meshes, json.materials, json.images, json.animations];
      const propertyLists = [[root], root.listScenes(), root.listNodes(), root.listMeshes(), root.listMaterials(), root.listTextures(), root.listAnimations()];
      for (let i = 0; i < defLists.length; i++) {
        const defs = defLists[i] || [];
        for (let j = 0; j < defs.length; j++) {
          const def = defs[j];
          if (def.extensions && def.extensions[KHR_XMP_JSON_LD]) {
            const xmpDef = def.extensions[KHR_XMP_JSON_LD];
            propertyLists[i][j].setExtension(KHR_XMP_JSON_LD, packets[xmpDef.packet]);
          }
        }
      }
      return this;
    }
    /** @hidden */
    write(context) {
      const {
        json
      } = context.jsonDoc;
      const packetDefs = [];
      for (const packet of this.properties) {
        packetDefs.push(packet.toJSONLD());
        for (const parent of packet.listParents()) {
          let parentDef;
          switch (parent.propertyType) {
            case PropertyType.ROOT:
              parentDef = json.asset;
              break;
            case PropertyType.SCENE:
              parentDef = json.scenes[context.sceneIndexMap.get(parent)];
              break;
            case PropertyType.NODE:
              parentDef = json.nodes[context.nodeIndexMap.get(parent)];
              break;
            case PropertyType.MESH:
              parentDef = json.meshes[context.meshIndexMap.get(parent)];
              break;
            case PropertyType.MATERIAL:
              parentDef = json.materials[context.materialIndexMap.get(parent)];
              break;
            case PropertyType.TEXTURE:
              parentDef = json.images[context.imageIndexMap.get(parent)];
              break;
            case PropertyType.ANIMATION:
              parentDef = json.animations[context.animationIndexMap.get(parent)];
              break;
            default:
              parentDef = null;
              this.document.getLogger().warn(`[${KHR_XMP_JSON_LD}]: Unsupported parent property, "${parent.propertyType}"`);
              break;
          }
          if (!parentDef) continue;
          parentDef.extensions = parentDef.extensions || {};
          parentDef.extensions[KHR_XMP_JSON_LD] = {
            packet: packetDefs.length - 1
          };
        }
      }
      if (packetDefs.length > 0) {
        json.extensions = json.extensions || {};
        json.extensions[KHR_XMP_JSON_LD] = {
          packets: packetDefs
        };
      }
      return this;
    }
  };
  KHRXMP.EXTENSION_NAME = KHR_XMP_JSON_LD;
  var KHRONOS_EXTENSIONS = [KHRDracoMeshCompression, KHRLightsPunctual, KHRMaterialsAnisotropy, KHRMaterialsClearcoat, KHRMaterialsDiffuseTransmission, KHRMaterialsDispersion, KHRMaterialsEmissiveStrength, KHRMaterialsIOR, KHRMaterialsIridescence, KHRMaterialsPBRSpecularGlossiness, KHRMaterialsSpecular, KHRMaterialsSheen, KHRMaterialsTransmission, KHRMaterialsUnlit, KHRMaterialsVariants, KHRMaterialsVolume, KHRMeshQuantization, KHRNodeVisibility, KHRTextureBasisu, KHRTextureTransform, KHRXMP];
  var ALL_EXTENSIONS = [EXTMeshGPUInstancing, EXTMeshoptCompression, EXTTextureAVIF, EXTTextureWebP, ...KHRONOS_EXTENSIONS];

  // node_modules/@gltf-transform/functions/dist/functions.modern.js
  init_define_process_versions();
  var import_ndarray = __toESM(require_ndarray(), 1);
  function _extends3() {
    return _extends3 = Object.assign ? Object.assign.bind() : function(n) {
      for (var e = 1; e < arguments.length; e++) {
        var t = arguments[e];
        for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
      }
      return n;
    }, _extends3.apply(null, arguments);
  }
  var {
    POINTS: POINTS$1,
    LINES: LINES$2,
    LINE_STRIP: LINE_STRIP$3,
    LINE_LOOP: LINE_LOOP$3,
    TRIANGLES: TRIANGLES$2,
    TRIANGLE_STRIP: TRIANGLE_STRIP$3,
    TRIANGLE_FAN: TRIANGLE_FAN$3
  } = Primitive.Mode;
  function createTransform(name, fn) {
    Object.defineProperty(fn, "name", {
      value: name
    });
    return fn;
  }
  function assignDefaults(defaults, options) {
    const result = _extends3({}, defaults);
    for (const key in options) {
      if (options[key] !== void 0) {
        result[key] = options[key];
      }
    }
    return result;
  }
  var _longFormatter = new Intl.NumberFormat(void 0, {
    maximumFractionDigits: 0
  });
  function formatLong(x) {
    return _longFormatter.format(x);
  }
  function formatDelta(a, b, decimals = 2) {
    const prefix = a > b ? "\u2013" : "+";
    const suffix = "%";
    return prefix + (Math.abs(a - b) / a * 100).toFixed(decimals) + suffix;
  }
  function formatDeltaOp(a, b) {
    return `${formatLong(a)} \u2192 ${formatLong(b)} (${formatDelta(a, b)})`;
  }
  function deepListAttributes(prim) {
    const accessors = [];
    for (const attribute of prim.listAttributes()) {
      accessors.push(attribute);
    }
    for (const target of prim.listTargets()) {
      for (const attribute of target.listAttributes()) {
        accessors.push(attribute);
      }
    }
    return Array.from(new Set(accessors));
  }
  function deepDisposePrimitive(prim) {
    const indices = prim.getIndices();
    const attributes = deepListAttributes(prim);
    prim.dispose();
    if (indices && !isUsed(indices)) {
      indices.dispose();
    }
    for (const attribute of attributes) {
      if (!isUsed(attribute)) {
        attribute.dispose();
      }
    }
  }
  function shallowCloneAccessor(document2, accessor) {
    return document2.createAccessor(accessor.getName()).setArray(accessor.getArray()).setType(accessor.getType()).setBuffer(accessor.getBuffer()).setNormalized(accessor.getNormalized()).setSparse(accessor.getSparse());
  }
  function createIndices(count, maxIndex = count) {
    const array = createIndicesEmpty(count, maxIndex);
    for (let i = 0; i < array.length; i++) array[i] = i;
    return array;
  }
  function createIndicesEmpty(count, maxIndex = count) {
    return maxIndex <= 65534 ? new Uint16Array(count) : new Uint32Array(count);
  }
  function isUsed(prop) {
    return prop.listParents().some((parent) => parent.propertyType !== PropertyType.ROOT);
  }
  function ceilPowerOfTwo$1(value) {
    return Math.pow(2, Math.ceil(Math.log(value) / Math.LN2));
  }
  var BASIC_MODE_MAPPING = {
    [POINTS$1]: POINTS$1,
    [LINES$2]: LINES$2,
    [LINE_STRIP$3]: LINES$2,
    [LINE_LOOP$3]: LINES$2,
    [TRIANGLES$2]: TRIANGLES$2,
    [TRIANGLE_STRIP$3]: TRIANGLES$2,
    [TRIANGLE_FAN$3]: TRIANGLES$2
  };
  var ARRAY_TYPE2 = typeof Float32Array !== "undefined" ? Float32Array : Array;
  var VertexCountMethod;
  (function(VertexCountMethod2) {
    VertexCountMethod2["RENDER"] = "render";
    VertexCountMethod2["RENDER_CACHED"] = "render-cached";
    VertexCountMethod2["UPLOAD"] = "upload";
    VertexCountMethod2["UPLOAD_NAIVE"] = "upload-naive";
    VertexCountMethod2["DISTINCT"] = "distinct";
    VertexCountMethod2["DISTINCT_POSITION"] = "distinct-position";
    VertexCountMethod2["UNUSED"] = "unused";
  })(VertexCountMethod || (VertexCountMethod = {}));
  function getPrimitiveVertexCount(prim, method) {
    const position = prim.getAttribute("POSITION");
    const indices = prim.getIndices();
    switch (method) {
      case VertexCountMethod.RENDER:
        return indices ? indices.getCount() : position.getCount();
      case VertexCountMethod.RENDER_CACHED:
        return indices ? new Set(indices.getArray()).size : position.getCount();
      case VertexCountMethod.UPLOAD_NAIVE:
      case VertexCountMethod.UPLOAD:
        return position.getCount();
      case VertexCountMethod.DISTINCT:
      case VertexCountMethod.DISTINCT_POSITION:
        return _assertNotImplemented(method);
      case VertexCountMethod.UNUSED:
        return indices ? position.getCount() - new Set(indices.getArray()).size : 0;
      default:
        return _assertUnreachable(method);
    }
  }
  function _assertNotImplemented(x) {
    throw new Error(`Not implemented: ${x}`);
  }
  function _assertUnreachable(x) {
    throw new Error(`Unexpected value: ${x}`);
  }
  var EMPTY_U32$1 = 2 ** 32 - 1;
  var VertexStream = class {
    constructor(prim) {
      this.attributes = [];
      this.u8 = void 0;
      this.u32 = void 0;
      let byteStride = 0;
      for (const attribute of deepListAttributes(prim)) {
        byteStride += this._initAttribute(attribute);
      }
      this.u8 = new Uint8Array(byteStride);
      this.u32 = new Uint32Array(this.u8.buffer);
    }
    _initAttribute(attribute) {
      const array = attribute.getArray();
      const u8 = new Uint8Array(array.buffer, array.byteOffset, array.byteLength);
      const byteStride = attribute.getElementSize() * attribute.getComponentSize();
      const paddedByteStride = BufferUtils.padNumber(byteStride);
      this.attributes.push({
        u8,
        byteStride,
        paddedByteStride
      });
      return paddedByteStride;
    }
    hash(index) {
      let byteOffset = 0;
      for (const {
        u8,
        byteStride,
        paddedByteStride
      } of this.attributes) {
        for (let i = 0; i < paddedByteStride; i++) {
          if (i < byteStride) {
            this.u8[byteOffset + i] = u8[index * byteStride + i];
          } else {
            this.u8[byteOffset + i] = 0;
          }
        }
        byteOffset += paddedByteStride;
      }
      return murmurHash2(0, this.u32);
    }
    equal(a, b) {
      for (const {
        u8,
        byteStride
      } of this.attributes) {
        for (let j = 0; j < byteStride; j++) {
          if (u8[a * byteStride + j] !== u8[b * byteStride + j]) {
            return false;
          }
        }
      }
      return true;
    }
  };
  function murmurHash2(h, key) {
    const m = 1540483477;
    const r = 24;
    for (let i = 0, il = key.length; i < il; i++) {
      let k = key[i];
      k = Math.imul(k, m) >>> 0;
      k = (k ^ k >> r) >>> 0;
      k = Math.imul(k, m) >>> 0;
      h = Math.imul(h, m) >>> 0;
      h = (h ^ k) >>> 0;
    }
    return h;
  }
  function hashLookup(table, buckets, stream, key, empty = EMPTY_U32$1) {
    const hashmod = buckets - 1;
    const hashval = stream.hash(key);
    let bucket = hashval & hashmod;
    for (let probe = 0; probe <= hashmod; probe++) {
      const item = table[bucket];
      if (item === empty || stream.equal(item, key)) {
        return bucket;
      }
      bucket = bucket + probe + 1 & hashmod;
    }
    throw new Error("Hash table full.");
  }
  function compactPrimitive(prim, remap, dstVertexCount) {
    const document2 = Document.fromGraph(prim.getGraph());
    if (!remap || !dstVertexCount) {
      [remap, dstVertexCount] = createCompactPlan(prim);
    }
    const srcIndices = prim.getIndices();
    const srcIndicesArray = srcIndices ? srcIndices.getArray() : null;
    const srcIndicesCount = getPrimitiveVertexCount(prim, VertexCountMethod.RENDER);
    const dstIndices = document2.createAccessor();
    const dstIndicesCount = srcIndicesCount;
    const dstIndicesArray = createIndicesEmpty(dstIndicesCount, dstVertexCount);
    for (let i = 0; i < dstIndicesCount; i++) {
      dstIndicesArray[i] = remap[srcIndicesArray ? srcIndicesArray[i] : i];
    }
    prim.setIndices(dstIndices.setArray(dstIndicesArray));
    const srcAttributesPrev = deepListAttributes(prim);
    for (const srcAttribute of prim.listAttributes()) {
      const dstAttribute = shallowCloneAccessor(document2, srcAttribute);
      compactAttribute(srcAttribute, srcIndices, remap, dstAttribute, dstVertexCount);
      prim.swap(srcAttribute, dstAttribute);
    }
    for (const target of prim.listTargets()) {
      for (const srcAttribute of target.listAttributes()) {
        const dstAttribute = shallowCloneAccessor(document2, srcAttribute);
        compactAttribute(srcAttribute, srcIndices, remap, dstAttribute, dstVertexCount);
        target.swap(srcAttribute, dstAttribute);
      }
    }
    if (srcIndices && srcIndices.listParents().length === 1) {
      srcIndices.dispose();
    }
    for (const srcAttribute of srcAttributesPrev) {
      if (srcAttribute.listParents().length === 1) {
        srcAttribute.dispose();
      }
    }
    return prim;
  }
  function compactAttribute(srcAttribute, srcIndices, remap, dstAttribute, dstVertexCount) {
    const elementSize = srcAttribute.getElementSize();
    const srcArray = srcAttribute.getArray();
    const srcIndicesArray = srcIndices ? srcIndices.getArray() : null;
    const srcIndicesCount = srcIndices ? srcIndices.getCount() : srcAttribute.getCount();
    const dstArray = new srcArray.constructor(dstVertexCount * elementSize);
    const dstDone = new Uint8Array(dstVertexCount);
    for (let i = 0; i < srcIndicesCount; i++) {
      const srcIndex = srcIndicesArray ? srcIndicesArray[i] : i;
      const dstIndex = remap[srcIndex];
      if (dstDone[dstIndex]) continue;
      for (let j = 0; j < elementSize; j++) {
        dstArray[dstIndex * elementSize + j] = srcArray[srcIndex * elementSize + j];
      }
      dstDone[dstIndex] = 1;
    }
    return dstAttribute.setArray(dstArray);
  }
  function createCompactPlan(prim) {
    const srcVertexCount = getPrimitiveVertexCount(prim, VertexCountMethod.UPLOAD);
    const indices = prim.getIndices();
    const indicesArray = indices ? indices.getArray() : null;
    if (!indices || !indicesArray) {
      return [createIndices(srcVertexCount, 1e6), srcVertexCount];
    }
    const remap = new Uint32Array(srcVertexCount).fill(EMPTY_U32$1);
    let dstVertexCount = 0;
    for (let i = 0; i < indicesArray.length; i++) {
      const srcIndex = indicesArray[i];
      if (remap[srcIndex] === EMPTY_U32$1) {
        remap[srcIndex] = dstVertexCount++;
      }
    }
    return [remap, dstVertexCount];
  }
  function create$1() {
    var out = new ARRAY_TYPE2(3);
    if (ARRAY_TYPE2 != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
    }
    return out;
  }
  (function() {
    var vec = create$1();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 3;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
      }
      return a;
    };
  })();
  var NAME$p = "weld";
  var WELD_DEFAULTS = {
    overwrite: true
  };
  function weld(_options = WELD_DEFAULTS) {
    const options = assignDefaults(WELD_DEFAULTS, _options);
    return createTransform(NAME$p, async (doc) => {
      const logger = doc.getLogger();
      for (const mesh of doc.getRoot().listMeshes()) {
        for (const prim of mesh.listPrimitives()) {
          weldPrimitive(prim, options);
          if (getPrimitiveVertexCount(prim, VertexCountMethod.RENDER) === 0) {
            deepDisposePrimitive(prim);
          }
        }
        if (mesh.listPrimitives().length === 0) mesh.dispose();
      }
      logger.debug(`${NAME$p}: Complete.`);
    });
  }
  function weldPrimitive(prim, _options = WELD_DEFAULTS) {
    const graph = prim.getGraph();
    const document2 = Document.fromGraph(graph);
    const logger = document2.getLogger();
    const options = _extends3({}, WELD_DEFAULTS, _options);
    if (prim.getIndices() && !options.overwrite) return;
    if (prim.getMode() === Primitive.Mode.POINTS) return;
    const srcVertexCount = prim.getAttribute("POSITION").getCount();
    const srcIndices = prim.getIndices();
    const srcIndicesArray = srcIndices == null ? void 0 : srcIndices.getArray();
    const srcIndicesCount = srcIndices ? srcIndices.getCount() : srcVertexCount;
    const stream = new VertexStream(prim);
    const tableSize = ceilPowerOfTwo$1(srcVertexCount + srcVertexCount / 4);
    const table = new Uint32Array(tableSize).fill(EMPTY_U32$1);
    const writeMap = new Uint32Array(srcVertexCount).fill(EMPTY_U32$1);
    let dstVertexCount = 0;
    for (let i = 0; i < srcIndicesCount; i++) {
      const srcIndex = srcIndicesArray ? srcIndicesArray[i] : i;
      if (writeMap[srcIndex] !== EMPTY_U32$1) continue;
      const hashIndex = hashLookup(table, tableSize, stream, srcIndex, EMPTY_U32$1);
      const dstIndex = table[hashIndex];
      if (dstIndex === EMPTY_U32$1) {
        table[hashIndex] = srcIndex;
        writeMap[srcIndex] = dstVertexCount++;
      } else {
        writeMap[srcIndex] = writeMap[dstIndex];
      }
    }
    logger.debug(`${NAME$p}: ${formatDeltaOp(srcVertexCount, dstVertexCount)} vertices.`);
    compactPrimitive(prim, writeMap, dstVertexCount);
  }
  var {
    FLOAT: FLOAT2
  } = Accessor.ComponentType;
  var {
    LINES: LINES$1,
    LINE_STRIP: LINE_STRIP$2,
    LINE_LOOP: LINE_LOOP$2,
    TRIANGLES: TRIANGLES$1,
    TRIANGLE_STRIP: TRIANGLE_STRIP$2,
    TRIANGLE_FAN: TRIANGLE_FAN$2
  } = Primitive.Mode;
  var DEDUP_DEFAULTS = {
    keepUniqueNames: false,
    propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH, PropertyType.TEXTURE, PropertyType.MATERIAL, PropertyType.SKIN]
  };
  var {
    TEXTURE_INFO,
    ROOT: ROOT$1
  } = PropertyType;
  var NAME$m = "draco";
  var DRACO_DEFAULTS = {
    method: "edgebreaker",
    encodeSpeed: 5,
    decodeSpeed: 5,
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeColor: 8,
    quantizeTexcoord: 12,
    quantizeGeneric: 12,
    quantizationVolume: "mesh"
  };
  function draco(_options = DRACO_DEFAULTS) {
    const options = assignDefaults(DRACO_DEFAULTS, _options);
    return createTransform(NAME$m, async (document2) => {
      await document2.transform(weld());
      document2.createExtension(KHRDracoMeshCompression).setRequired(true).setEncoderOptions({
        method: options.method === "edgebreaker" ? KHRDracoMeshCompression.EncoderMethod.EDGEBREAKER : KHRDracoMeshCompression.EncoderMethod.SEQUENTIAL,
        encodeSpeed: options.encodeSpeed,
        decodeSpeed: options.decodeSpeed,
        quantizationBits: {
          POSITION: options.quantizePosition,
          NORMAL: options.quantizeNormal,
          COLOR: options.quantizeColor,
          TEX_COORD: options.quantizeTexcoord,
          GENERIC: options.quantizeGeneric
        },
        quantizationVolume: options.quantizationVolume
      });
    });
  }
  function create2() {
    var out = new ARRAY_TYPE2(4);
    if (ARRAY_TYPE2 != Float32Array) {
      out[0] = 0;
      out[1] = 0;
      out[2] = 0;
      out[3] = 0;
    }
    return out;
  }
  (function() {
    var vec = create2();
    return function(a, stride, offset, count, fn, arg) {
      var i, l;
      if (!stride) {
        stride = 4;
      }
      if (!offset) {
        offset = 0;
      }
      if (count) {
        l = Math.min(count * stride + offset, a.length);
      } else {
        l = a.length;
      }
      for (i = offset; i < l; i += stride) {
        vec[0] = a[i];
        vec[1] = a[i + 1];
        vec[2] = a[i + 2];
        vec[3] = a[i + 3];
        fn(vec, vec, arg);
        a[i] = vec[0];
        a[i + 1] = vec[1];
        a[i + 2] = vec[2];
        a[i + 3] = vec[3];
      }
      return a;
    };
  })();
  var EPS = 3 / 255;
  var PRUNE_DEFAULTS = {
    propertyTypes: [PropertyType.NODE, PropertyType.SKIN, PropertyType.MESH, PropertyType.CAMERA, PropertyType.PRIMITIVE, PropertyType.PRIMITIVE_TARGET, PropertyType.ANIMATION, PropertyType.MATERIAL, PropertyType.TEXTURE, PropertyType.ACCESSOR, PropertyType.BUFFER],
    keepLeaves: false,
    keepAttributes: false,
    keepIndices: false,
    keepSolidTextures: false,
    keepExtras: false
  };
  var EMPTY_U32 = 2 ** 32 - 1;
  var {
    LINE_STRIP: LINE_STRIP$1,
    LINE_LOOP: LINE_LOOP$1,
    TRIANGLE_STRIP: TRIANGLE_STRIP$1,
    TRIANGLE_FAN: TRIANGLE_FAN$1
  } = Primitive.Mode;
  var {
    ROOT,
    NODE,
    MESH,
    PRIMITIVE,
    ACCESSOR
  } = PropertyType;
  var {
    TRANSLATION,
    ROTATION,
    SCALE,
    WEIGHTS
  } = AnimationChannel.TargetPath;
  var QUANTIZE_DEFAULTS = {
    pattern: /.*/,
    quantizationVolume: "mesh",
    quantizePosition: 14,
    quantizeNormal: 10,
    quantizeTexcoord: 12,
    quantizeColor: 8,
    quantizeWeight: 8,
    quantizeGeneric: 12,
    normalizeWeights: true,
    cleanup: true
  };
  var MESHOPT_DEFAULTS = _extends3({
    level: "high"
  }, QUANTIZE_DEFAULTS);
  var InterpolationInternal;
  (function(InterpolationInternal2) {
    InterpolationInternal2[InterpolationInternal2["STEP"] = 0] = "STEP";
    InterpolationInternal2[InterpolationInternal2["LERP"] = 1] = "LERP";
    InterpolationInternal2[InterpolationInternal2["SLERP"] = 2] = "SLERP";
  })(InterpolationInternal || (InterpolationInternal = {}));
  var EPSILON = 1e-6;
  function resampleDebug(input, output, interpolation, tolerance = 1e-4) {
    const elementSize = output.length / input.length;
    const tmp = new Array(elementSize).fill(0);
    const value = new Array(elementSize).fill(0);
    const valueNext = new Array(elementSize).fill(0);
    const valuePrev = new Array(elementSize).fill(0);
    const lastIndex = input.length - 1;
    let writeIndex = 1;
    for (let i = 1; i < lastIndex; ++i) {
      const timePrev = input[writeIndex - 1];
      const time = input[i];
      const timeNext = input[i + 1];
      const t = (time - timePrev) / (timeNext - timePrev);
      let keep = false;
      if (time !== timeNext && (i !== 1 || time !== input[0])) {
        getElement(output, writeIndex - 1, valuePrev);
        getElement(output, i, value);
        getElement(output, i + 1, valueNext);
        if (interpolation === "slerp") {
          const sample = slerp(tmp, valuePrev, valueNext, t);
          const angle = getAngle(valuePrev, value) + getAngle(value, valueNext);
          keep = !eq(value, sample, tolerance) || angle + Number.EPSILON >= Math.PI;
        } else if (interpolation === "lerp") {
          const sample = vlerp(tmp, valuePrev, valueNext, t);
          keep = !eq(value, sample, tolerance);
        } else if (interpolation === "step") {
          keep = !eq(value, valuePrev) || !eq(value, valueNext);
        }
      }
      if (keep) {
        if (i !== writeIndex) {
          input[writeIndex] = input[i];
          setElement(output, writeIndex, getElement(output, i, tmp));
        }
        writeIndex++;
      }
    }
    if (lastIndex > 0) {
      input[writeIndex] = input[lastIndex];
      setElement(output, writeIndex, getElement(output, lastIndex, tmp));
      writeIndex++;
    }
    return writeIndex;
  }
  function getElement(array, index, target) {
    for (let i = 0, elementSize = target.length; i < elementSize; i++) {
      target[i] = array[index * elementSize + i];
    }
    return target;
  }
  function setElement(array, index, value) {
    for (let i = 0, elementSize = value.length; i < elementSize; i++) {
      array[index * elementSize + i] = value[i];
    }
  }
  function eq(a, b, tolerance = 0) {
    if (a.length !== b.length) {
      return false;
    }
    for (let i = 0; i < a.length; i++) {
      if (Math.abs(a[i] - b[i]) > tolerance) {
        return false;
      }
    }
    return true;
  }
  function lerp(v0, v1, t) {
    return v0 * (1 - t) + v1 * t;
  }
  function vlerp(out, a, b, t) {
    for (let i = 0; i < a.length; i++) out[i] = lerp(a[i], b[i], t);
    return out;
  }
  function slerp(out, a, b, t) {
    let ax = a[0], ay = a[1], az = a[2], aw = a[3];
    let bx = b[0], by = b[1], bz = b[2], bw = b[3];
    let omega, cosom, sinom, scale0, scale1;
    cosom = ax * bx + ay * by + az * bz + aw * bw;
    if (cosom < 0) {
      cosom = -cosom;
      bx = -bx;
      by = -by;
      bz = -bz;
      bw = -bw;
    }
    if (1 - cosom > EPSILON) {
      omega = Math.acos(cosom);
      sinom = Math.sin(omega);
      scale0 = Math.sin((1 - t) * omega) / sinom;
      scale1 = Math.sin(t * omega) / sinom;
    } else {
      scale0 = 1 - t;
      scale1 = t;
    }
    out[0] = scale0 * ax + scale1 * bx;
    out[1] = scale0 * ay + scale1 * by;
    out[2] = scale0 * az + scale1 * bz;
    out[3] = scale0 * aw + scale1 * bw;
    return out;
  }
  function getAngle(a, b) {
    const dotproduct = dot(a, b);
    return Math.acos(2 * dotproduct * dotproduct - 1);
  }
  function dot(a, b) {
    return a[0] * b[0] + a[1] * b[1] + a[2] * b[2] + a[3] * b[3];
  }
  var EMPTY_ARRAY = new Float32Array(0);
  var RESAMPLE_DEFAULTS = {
    ready: Promise.resolve(),
    resample: resampleDebug,
    tolerance: 1e-4,
    cleanup: true
  };
  var {
    POINTS,
    LINES,
    LINE_STRIP,
    LINE_LOOP,
    TRIANGLES,
    TRIANGLE_STRIP,
    TRIANGLE_FAN
  } = Primitive.Mode;
  var SPARSE_DEFAULTS = {
    ratio: 1 / 3
  };
  var TextureResizeFilter;
  (function(TextureResizeFilter2) {
    TextureResizeFilter2["LANCZOS3"] = "lanczos3";
    TextureResizeFilter2["LANCZOS2"] = "lanczos2";
  })(TextureResizeFilter || (TextureResizeFilter = {}));
  var TEXTURE_COMPRESS_DEFAULTS = {
    resizeFilter: TextureResizeFilter.LANCZOS3,
    pattern: void 0,
    formats: void 0,
    slots: void 0,
    quality: void 0,
    effort: void 0,
    lossless: false,
    nearLossless: false,
    chromaSubsampling: void 0,
    limitInputPixels: true
  };

  // draco-worker-src.js
  var import_draco3dgltf = __toESM(require_draco3dgltf());
  var cachedIO = null;
  async function getIO() {
    if (cachedIO) return cachedIO;
    const base = new URL("./", self.location.href).href;
    const locateFile = (filename) => base + filename;
    const [encoderModule2, decoderModule2] = await Promise.all([
      import_draco3dgltf.default.createEncoderModule({ locateFile }),
      import_draco3dgltf.default.createDecoderModule({ locateFile })
    ]);
    const io = new WebIO().registerExtensions(ALL_EXTENSIONS);
    io.registerDependencies({
      "draco3d.encoder": encoderModule2,
      "draco3d.decoder": decoderModule2
    });
    cachedIO = io;
    return io;
  }
  self.onmessage = async (e) => {
    const { type, buffer, options = {} } = e.data;
    if (type !== "compress") return;
    const progress = (pct, step, txt) => self.postMessage({ type: "progress", pct, step, txt });
    try {
      progress(5, "Cargando Draco...", "Inicializando compresor WASM");
      const io = await getIO();
      progress(25, "Parseando geometr\xEDa...", "Leyendo mallas del modelo");
      const document2 = await io.readBinary(new Uint8Array(buffer));
      progress(50, "Aplicando Draco...", "Comprimiendo v\xE9rtices y atributos");
      await document2.transform(
        draco({
          method: "edgebreaker",
          encodeSpeed: options.encodeSpeed ?? 5,
          decodeSpeed: options.decodeSpeed ?? 5,
          quantizePosition: options.quantizePosition ?? 14,
          quantizeNormal: options.quantizeNormal ?? 10,
          quantizeTexcoord: options.quantizeTexcoord ?? 12,
          quantizeColor: options.quantizeColor ?? 8,
          quantizeGeneric: options.quantizeGeneric ?? 12
        })
      );
      progress(82, "Serializando GLB...", "Empaquetando con extensi\xF3n Draco");
      const result = await io.writeBinary(document2);
      progress(100, "Completado \u2713", "Compresi\xF3n Draco finalizada");
      self.postMessage({ type: "done", buffer: result.buffer }, [result.buffer]);
    } catch (err) {
      self.postMessage({
        type: "error",
        message: err instanceof Error ? err.message : String(err)
      });
    }
  };
})();
/*! Bundled license information:

is-buffer/index.js:
  (*!
   * Determine if an object is a Buffer
   *
   * @author   Feross Aboukhadijeh <https://feross.org>
   * @license  MIT
   *)
*/
