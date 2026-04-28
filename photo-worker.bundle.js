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
  var init_define_process_versions = __esm({
    "<define:process.versions>"() {
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

  // node_modules/uniq/uniq.js
  var require_uniq = __commonJS({
    "node_modules/uniq/uniq.js"(exports, module) {
      "use strict";
      init_define_process_versions();
      function unique_pred(list, compare) {
        var ptr = 1, len2 = list.length, a = list[0], b = list[0];
        for (var i = 1; i < len2; ++i) {
          b = a;
          a = list[i];
          if (compare(a, b)) {
            if (i === ptr) {
              ptr++;
              continue;
            }
            list[ptr++] = a;
          }
        }
        list.length = ptr;
        return list;
      }
      function unique_eq(list) {
        var ptr = 1, len2 = list.length, a = list[0], b = list[0];
        for (var i = 1; i < len2; ++i, b = a) {
          b = a;
          a = list[i];
          if (a !== b) {
            if (i === ptr) {
              ptr++;
              continue;
            }
            list[ptr++] = a;
          }
        }
        list.length = ptr;
        return list;
      }
      function unique(list, compare, sorted) {
        if (list.length === 0) {
          return list;
        }
        if (compare) {
          if (!sorted) {
            list.sort(compare);
          }
          return unique_pred(list, compare);
        }
        if (!sorted) {
          list.sort();
        }
        return unique_eq(list);
      }
      module.exports = unique;
    }
  });

  // node_modules/cwise-compiler/lib/compile.js
  var require_compile = __commonJS({
    "node_modules/cwise-compiler/lib/compile.js"(exports, module) {
      "use strict";
      init_define_process_versions();
      var uniq = require_uniq();
      function innerFill(order, proc, body) {
        var dimension = order.length, nargs = proc.arrayArgs.length, has_index = proc.indexArgs.length > 0, code = [], vars = [], idx = 0, pidx = 0, i, j;
        for (i = 0; i < dimension; ++i) {
          vars.push(["i", i, "=0"].join(""));
        }
        for (j = 0; j < nargs; ++j) {
          for (i = 0; i < dimension; ++i) {
            pidx = idx;
            idx = order[i];
            if (i === 0) {
              vars.push(["d", j, "s", i, "=t", j, "p", idx].join(""));
            } else {
              vars.push(["d", j, "s", i, "=(t", j, "p", idx, "-s", pidx, "*t", j, "p", pidx, ")"].join(""));
            }
          }
        }
        if (vars.length > 0) {
          code.push("var " + vars.join(","));
        }
        for (i = dimension - 1; i >= 0; --i) {
          idx = order[i];
          code.push(["for(i", i, "=0;i", i, "<s", idx, ";++i", i, "){"].join(""));
        }
        code.push(body);
        for (i = 0; i < dimension; ++i) {
          pidx = idx;
          idx = order[i];
          for (j = 0; j < nargs; ++j) {
            code.push(["p", j, "+=d", j, "s", i].join(""));
          }
          if (has_index) {
            if (i > 0) {
              code.push(["index[", pidx, "]-=s", pidx].join(""));
            }
            code.push(["++index[", idx, "]"].join(""));
          }
          code.push("}");
        }
        return code.join("\n");
      }
      function outerFill(matched, order, proc, body) {
        var dimension = order.length, nargs = proc.arrayArgs.length, blockSize = proc.blockSize, has_index = proc.indexArgs.length > 0, code = [];
        for (var i = 0; i < nargs; ++i) {
          code.push(["var offset", i, "=p", i].join(""));
        }
        for (var i = matched; i < dimension; ++i) {
          code.push(["for(var j" + i + "=SS[", order[i], "]|0;j", i, ">0;){"].join(""));
          code.push(["if(j", i, "<", blockSize, "){"].join(""));
          code.push(["s", order[i], "=j", i].join(""));
          code.push(["j", i, "=0"].join(""));
          code.push(["}else{s", order[i], "=", blockSize].join(""));
          code.push(["j", i, "-=", blockSize, "}"].join(""));
          if (has_index) {
            code.push(["index[", order[i], "]=j", i].join(""));
          }
        }
        for (var i = 0; i < nargs; ++i) {
          var indexStr = ["offset" + i];
          for (var j = matched; j < dimension; ++j) {
            indexStr.push(["j", j, "*t", i, "p", order[j]].join(""));
          }
          code.push(["p", i, "=(", indexStr.join("+"), ")"].join(""));
        }
        code.push(innerFill(order, proc, body));
        for (var i = matched; i < dimension; ++i) {
          code.push("}");
        }
        return code.join("\n");
      }
      function countMatches(orders) {
        var matched = 0, dimension = orders[0].length;
        while (matched < dimension) {
          for (var j = 1; j < orders.length; ++j) {
            if (orders[j][matched] !== orders[0][matched]) {
              return matched;
            }
          }
          ++matched;
        }
        return matched;
      }
      function processBlock(block, proc, dtypes) {
        var code = block.body;
        var pre = [];
        var post = [];
        for (var i = 0; i < block.args.length; ++i) {
          var carg = block.args[i];
          if (carg.count <= 0) {
            continue;
          }
          var re = new RegExp(carg.name, "g");
          var ptrStr = "";
          var arrNum = proc.arrayArgs.indexOf(i);
          switch (proc.argTypes[i]) {
            case "offset":
              var offArgIndex = proc.offsetArgIndex.indexOf(i);
              var offArg = proc.offsetArgs[offArgIndex];
              arrNum = offArg.array;
              ptrStr = "+q" + offArgIndex;
            case "array":
              ptrStr = "p" + arrNum + ptrStr;
              var localStr = "l" + i;
              var arrStr = "a" + arrNum;
              if (proc.arrayBlockIndices[arrNum] === 0) {
                if (carg.count === 1) {
                  if (dtypes[arrNum] === "generic") {
                    if (carg.lvalue) {
                      pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join(""));
                      code = code.replace(re, localStr);
                      post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""));
                    } else {
                      code = code.replace(re, [arrStr, ".get(", ptrStr, ")"].join(""));
                    }
                  } else {
                    code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""));
                  }
                } else if (dtypes[arrNum] === "generic") {
                  pre.push(["var ", localStr, "=", arrStr, ".get(", ptrStr, ")"].join(""));
                  code = code.replace(re, localStr);
                  if (carg.lvalue) {
                    post.push([arrStr, ".set(", ptrStr, ",", localStr, ")"].join(""));
                  }
                } else {
                  pre.push(["var ", localStr, "=", arrStr, "[", ptrStr, "]"].join(""));
                  code = code.replace(re, localStr);
                  if (carg.lvalue) {
                    post.push([arrStr, "[", ptrStr, "]=", localStr].join(""));
                  }
                }
              } else {
                var reStrArr = [carg.name], ptrStrArr = [ptrStr];
                for (var j = 0; j < Math.abs(proc.arrayBlockIndices[arrNum]); j++) {
                  reStrArr.push("\\s*\\[([^\\]]+)\\]");
                  ptrStrArr.push("$" + (j + 1) + "*t" + arrNum + "b" + j);
                }
                re = new RegExp(reStrArr.join(""), "g");
                ptrStr = ptrStrArr.join("+");
                if (dtypes[arrNum] === "generic") {
                  throw new Error("cwise: Generic arrays not supported in combination with blocks!");
                } else {
                  code = code.replace(re, [arrStr, "[", ptrStr, "]"].join(""));
                }
              }
              break;
            case "scalar":
              code = code.replace(re, "Y" + proc.scalarArgs.indexOf(i));
              break;
            case "index":
              code = code.replace(re, "index");
              break;
            case "shape":
              code = code.replace(re, "shape");
              break;
          }
        }
        return [pre.join("\n"), code, post.join("\n")].join("\n").trim();
      }
      function typeSummary(dtypes) {
        var summary = new Array(dtypes.length);
        var allEqual = true;
        for (var i = 0; i < dtypes.length; ++i) {
          var t = dtypes[i];
          var digits = t.match(/\d+/);
          if (!digits) {
            digits = "";
          } else {
            digits = digits[0];
          }
          if (t.charAt(0) === 0) {
            summary[i] = "u" + t.charAt(1) + digits;
          } else {
            summary[i] = t.charAt(0) + digits;
          }
          if (i > 0) {
            allEqual = allEqual && summary[i] === summary[i - 1];
          }
        }
        if (allEqual) {
          return summary[0];
        }
        return summary.join("");
      }
      function generateCWiseOp(proc, typesig) {
        var dimension = typesig[1].length - Math.abs(proc.arrayBlockIndices[0]) | 0;
        var orders = new Array(proc.arrayArgs.length);
        var dtypes = new Array(proc.arrayArgs.length);
        for (var i = 0; i < proc.arrayArgs.length; ++i) {
          dtypes[i] = typesig[2 * i];
          orders[i] = typesig[2 * i + 1];
        }
        var blockBegin = [], blockEnd = [];
        var loopBegin = [], loopEnd = [];
        var loopOrders = [];
        for (var i = 0; i < proc.arrayArgs.length; ++i) {
          if (proc.arrayBlockIndices[i] < 0) {
            loopBegin.push(0);
            loopEnd.push(dimension);
            blockBegin.push(dimension);
            blockEnd.push(dimension + proc.arrayBlockIndices[i]);
          } else {
            loopBegin.push(proc.arrayBlockIndices[i]);
            loopEnd.push(proc.arrayBlockIndices[i] + dimension);
            blockBegin.push(0);
            blockEnd.push(proc.arrayBlockIndices[i]);
          }
          var newOrder = [];
          for (var j = 0; j < orders[i].length; j++) {
            if (loopBegin[i] <= orders[i][j] && orders[i][j] < loopEnd[i]) {
              newOrder.push(orders[i][j] - loopBegin[i]);
            }
          }
          loopOrders.push(newOrder);
        }
        var arglist = ["SS"];
        var code = ["'use strict'"];
        var vars = [];
        for (var j = 0; j < dimension; ++j) {
          vars.push(["s", j, "=SS[", j, "]"].join(""));
        }
        for (var i = 0; i < proc.arrayArgs.length; ++i) {
          arglist.push("a" + i);
          arglist.push("t" + i);
          arglist.push("p" + i);
          for (var j = 0; j < dimension; ++j) {
            vars.push(["t", i, "p", j, "=t", i, "[", loopBegin[i] + j, "]"].join(""));
          }
          for (var j = 0; j < Math.abs(proc.arrayBlockIndices[i]); ++j) {
            vars.push(["t", i, "b", j, "=t", i, "[", blockBegin[i] + j, "]"].join(""));
          }
        }
        for (var i = 0; i < proc.scalarArgs.length; ++i) {
          arglist.push("Y" + i);
        }
        if (proc.shapeArgs.length > 0) {
          vars.push("shape=SS.slice(0)");
        }
        if (proc.indexArgs.length > 0) {
          var zeros = new Array(dimension);
          for (var i = 0; i < dimension; ++i) {
            zeros[i] = "0";
          }
          vars.push(["index=[", zeros.join(","), "]"].join(""));
        }
        for (var i = 0; i < proc.offsetArgs.length; ++i) {
          var off_arg = proc.offsetArgs[i];
          var init_string = [];
          for (var j = 0; j < off_arg.offset.length; ++j) {
            if (off_arg.offset[j] === 0) {
              continue;
            } else if (off_arg.offset[j] === 1) {
              init_string.push(["t", off_arg.array, "p", j].join(""));
            } else {
              init_string.push([off_arg.offset[j], "*t", off_arg.array, "p", j].join(""));
            }
          }
          if (init_string.length === 0) {
            vars.push("q" + i + "=0");
          } else {
            vars.push(["q", i, "=", init_string.join("+")].join(""));
          }
        }
        var thisVars = uniq([].concat(proc.pre.thisVars).concat(proc.body.thisVars).concat(proc.post.thisVars));
        vars = vars.concat(thisVars);
        if (vars.length > 0) {
          code.push("var " + vars.join(","));
        }
        for (var i = 0; i < proc.arrayArgs.length; ++i) {
          code.push("p" + i + "|=0");
        }
        if (proc.pre.body.length > 3) {
          code.push(processBlock(proc.pre, proc, dtypes));
        }
        var body = processBlock(proc.body, proc, dtypes);
        var matched = countMatches(loopOrders);
        if (matched < dimension) {
          code.push(outerFill(matched, loopOrders[0], proc, body));
        } else {
          code.push(innerFill(loopOrders[0], proc, body));
        }
        if (proc.post.body.length > 3) {
          code.push(processBlock(proc.post, proc, dtypes));
        }
        if (proc.debug) {
          console.log("-----Generated cwise routine for ", typesig, ":\n" + code.join("\n") + "\n----------");
        }
        var loopName = [proc.funcName || "unnamed", "_cwise_loop_", orders[0].join("s"), "m", matched, typeSummary(dtypes)].join("");
        var f = new Function(["function ", loopName, "(", arglist.join(","), "){", code.join("\n"), "} return ", loopName].join(""));
        return f();
      }
      module.exports = generateCWiseOp;
    }
  });

  // node_modules/cwise-compiler/lib/thunk.js
  var require_thunk = __commonJS({
    "node_modules/cwise-compiler/lib/thunk.js"(exports, module) {
      "use strict";
      init_define_process_versions();
      var compile = require_compile();
      function createThunk(proc) {
        var code = ["'use strict'", "var CACHED={}"];
        var vars = [];
        var thunkName = proc.funcName + "_cwise_thunk";
        code.push(["return function ", thunkName, "(", proc.shimArgs.join(","), "){"].join(""));
        var typesig = [];
        var string_typesig = [];
        var proc_args = [[
          "array",
          proc.arrayArgs[0],
          ".shape.slice(",
          // Slice shape so that we only retain the shape over which we iterate (which gets passed to the cwise operator as SS).
          Math.max(0, proc.arrayBlockIndices[0]),
          proc.arrayBlockIndices[0] < 0 ? "," + proc.arrayBlockIndices[0] + ")" : ")"
        ].join("")];
        var shapeLengthConditions = [], shapeConditions = [];
        for (var i = 0; i < proc.arrayArgs.length; ++i) {
          var j = proc.arrayArgs[i];
          vars.push([
            "t",
            j,
            "=array",
            j,
            ".dtype,",
            "r",
            j,
            "=array",
            j,
            ".order"
          ].join(""));
          typesig.push("t" + j);
          typesig.push("r" + j);
          string_typesig.push("t" + j);
          string_typesig.push("r" + j + ".join()");
          proc_args.push("array" + j + ".data");
          proc_args.push("array" + j + ".stride");
          proc_args.push("array" + j + ".offset|0");
          if (i > 0) {
            shapeLengthConditions.push("array" + proc.arrayArgs[0] + ".shape.length===array" + j + ".shape.length+" + (Math.abs(proc.arrayBlockIndices[0]) - Math.abs(proc.arrayBlockIndices[i])));
            shapeConditions.push("array" + proc.arrayArgs[0] + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[0]) + "]===array" + j + ".shape[shapeIndex+" + Math.max(0, proc.arrayBlockIndices[i]) + "]");
          }
        }
        if (proc.arrayArgs.length > 1) {
          code.push("if (!(" + shapeLengthConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same dimensionality!')");
          code.push("for(var shapeIndex=array" + proc.arrayArgs[0] + ".shape.length-" + Math.abs(proc.arrayBlockIndices[0]) + "; shapeIndex-->0;) {");
          code.push("if (!(" + shapeConditions.join(" && ") + ")) throw new Error('cwise: Arrays do not all have the same shape!')");
          code.push("}");
        }
        for (var i = 0; i < proc.scalarArgs.length; ++i) {
          proc_args.push("scalar" + proc.scalarArgs[i]);
        }
        vars.push(["type=[", string_typesig.join(","), "].join()"].join(""));
        vars.push("proc=CACHED[type]");
        code.push("var " + vars.join(","));
        code.push([
          "if(!proc){",
          "CACHED[type]=proc=compile([",
          typesig.join(","),
          "])}",
          "return proc(",
          proc_args.join(","),
          ")}"
        ].join(""));
        if (proc.debug) {
          console.log("-----Generated thunk:\n" + code.join("\n") + "\n----------");
        }
        var thunk = new Function("compile", code.join("\n"));
        return thunk(compile.bind(void 0, proc));
      }
      module.exports = createThunk;
    }
  });

  // node_modules/cwise-compiler/compiler.js
  var require_compiler = __commonJS({
    "node_modules/cwise-compiler/compiler.js"(exports, module) {
      "use strict";
      init_define_process_versions();
      var createThunk = require_thunk();
      function Procedure() {
        this.argTypes = [];
        this.shimArgs = [];
        this.arrayArgs = [];
        this.arrayBlockIndices = [];
        this.scalarArgs = [];
        this.offsetArgs = [];
        this.offsetArgIndex = [];
        this.indexArgs = [];
        this.shapeArgs = [];
        this.funcName = "";
        this.pre = null;
        this.body = null;
        this.post = null;
        this.debug = false;
      }
      function compileCwise(user_args) {
        var proc = new Procedure();
        proc.pre = user_args.pre;
        proc.body = user_args.body;
        proc.post = user_args.post;
        var proc_args = user_args.args.slice(0);
        proc.argTypes = proc_args;
        for (var i = 0; i < proc_args.length; ++i) {
          var arg_type = proc_args[i];
          if (arg_type === "array" || typeof arg_type === "object" && arg_type.blockIndices) {
            proc.argTypes[i] = "array";
            proc.arrayArgs.push(i);
            proc.arrayBlockIndices.push(arg_type.blockIndices ? arg_type.blockIndices : 0);
            proc.shimArgs.push("array" + i);
            if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
              throw new Error("cwise: pre() block may not reference array args");
            }
            if (i < proc.post.args.length && proc.post.args[i].count > 0) {
              throw new Error("cwise: post() block may not reference array args");
            }
          } else if (arg_type === "scalar") {
            proc.scalarArgs.push(i);
            proc.shimArgs.push("scalar" + i);
          } else if (arg_type === "index") {
            proc.indexArgs.push(i);
            if (i < proc.pre.args.length && proc.pre.args[i].count > 0) {
              throw new Error("cwise: pre() block may not reference array index");
            }
            if (i < proc.body.args.length && proc.body.args[i].lvalue) {
              throw new Error("cwise: body() block may not write to array index");
            }
            if (i < proc.post.args.length && proc.post.args[i].count > 0) {
              throw new Error("cwise: post() block may not reference array index");
            }
          } else if (arg_type === "shape") {
            proc.shapeArgs.push(i);
            if (i < proc.pre.args.length && proc.pre.args[i].lvalue) {
              throw new Error("cwise: pre() block may not write to array shape");
            }
            if (i < proc.body.args.length && proc.body.args[i].lvalue) {
              throw new Error("cwise: body() block may not write to array shape");
            }
            if (i < proc.post.args.length && proc.post.args[i].lvalue) {
              throw new Error("cwise: post() block may not write to array shape");
            }
          } else if (typeof arg_type === "object" && arg_type.offset) {
            proc.argTypes[i] = "offset";
            proc.offsetArgs.push({ array: arg_type.array, offset: arg_type.offset });
            proc.offsetArgIndex.push(i);
          } else {
            throw new Error("cwise: Unknown argument type " + proc_args[i]);
          }
        }
        if (proc.arrayArgs.length <= 0) {
          throw new Error("cwise: No array arguments specified");
        }
        if (proc.pre.args.length > proc_args.length) {
          throw new Error("cwise: Too many arguments in pre() block");
        }
        if (proc.body.args.length > proc_args.length) {
          throw new Error("cwise: Too many arguments in body() block");
        }
        if (proc.post.args.length > proc_args.length) {
          throw new Error("cwise: Too many arguments in post() block");
        }
        proc.debug = !!user_args.printCode || !!user_args.debug;
        proc.funcName = user_args.funcName || "cwise";
        proc.blockSize = user_args.blockSize || 64;
        return createThunk(proc);
      }
      module.exports = compileCwise;
    }
  });

  // node_modules/ndarray-ops/ndarray-ops.js
  var require_ndarray_ops = __commonJS({
    "node_modules/ndarray-ops/ndarray-ops.js"(exports) {
      "use strict";
      init_define_process_versions();
      var compile = require_compiler();
      var EmptyProc = {
        body: "",
        args: [],
        thisVars: [],
        localVars: []
      };
      function fixup(x) {
        if (!x) {
          return EmptyProc;
        }
        for (var i = 0; i < x.args.length; ++i) {
          var a = x.args[i];
          if (i === 0) {
            x.args[i] = { name: a, lvalue: true, rvalue: !!x.rvalue, count: x.count || 1 };
          } else {
            x.args[i] = { name: a, lvalue: false, rvalue: true, count: 1 };
          }
        }
        if (!x.thisVars) {
          x.thisVars = [];
        }
        if (!x.localVars) {
          x.localVars = [];
        }
        return x;
      }
      function pcompile(user_args) {
        return compile({
          args: user_args.args,
          pre: fixup(user_args.pre),
          body: fixup(user_args.body),
          post: fixup(user_args.proc),
          funcName: user_args.funcName
        });
      }
      function makeOp(user_args) {
        var args = [];
        for (var i = 0; i < user_args.args.length; ++i) {
          args.push("a" + i);
        }
        var wrapper = new Function("P", [
          "return function ",
          user_args.funcName,
          "_ndarrayops(",
          args.join(","),
          ") {P(",
          args.join(","),
          ");return a0}"
        ].join(""));
        return wrapper(pcompile(user_args));
      }
      var assign_ops = {
        add: "+",
        sub: "-",
        mul: "*",
        div: "/",
        mod: "%",
        band: "&",
        bor: "|",
        bxor: "^",
        lshift: "<<",
        rshift: ">>",
        rrshift: ">>>"
      };
      (function() {
        for (var id in assign_ops) {
          var op = assign_ops[id];
          exports[id] = makeOp({
            args: ["array", "array", "array"],
            body: {
              args: ["a", "b", "c"],
              body: "a=b" + op + "c"
            },
            funcName: id
          });
          exports[id + "eq"] = makeOp({
            args: ["array", "array"],
            body: {
              args: ["a", "b"],
              body: "a" + op + "=b"
            },
            rvalue: true,
            funcName: id + "eq"
          });
          exports[id + "s"] = makeOp({
            args: ["array", "array", "scalar"],
            body: {
              args: ["a", "b", "s"],
              body: "a=b" + op + "s"
            },
            funcName: id + "s"
          });
          exports[id + "seq"] = makeOp({
            args: ["array", "scalar"],
            body: {
              args: ["a", "s"],
              body: "a" + op + "=s"
            },
            rvalue: true,
            funcName: id + "seq"
          });
        }
      })();
      var unary_ops = {
        not: "!",
        bnot: "~",
        neg: "-",
        recip: "1.0/"
      };
      (function() {
        for (var id in unary_ops) {
          var op = unary_ops[id];
          exports[id] = makeOp({
            args: ["array", "array"],
            body: {
              args: ["a", "b"],
              body: "a=" + op + "b"
            },
            funcName: id
          });
          exports[id + "eq"] = makeOp({
            args: ["array"],
            body: {
              args: ["a"],
              body: "a=" + op + "a"
            },
            rvalue: true,
            count: 2,
            funcName: id + "eq"
          });
        }
      })();
      var binary_ops = {
        and: "&&",
        or: "||",
        eq: "===",
        neq: "!==",
        lt: "<",
        gt: ">",
        leq: "<=",
        geq: ">="
      };
      (function() {
        for (var id in binary_ops) {
          var op = binary_ops[id];
          exports[id] = makeOp({
            args: ["array", "array", "array"],
            body: {
              args: ["a", "b", "c"],
              body: "a=b" + op + "c"
            },
            funcName: id
          });
          exports[id + "s"] = makeOp({
            args: ["array", "array", "scalar"],
            body: {
              args: ["a", "b", "s"],
              body: "a=b" + op + "s"
            },
            funcName: id + "s"
          });
          exports[id + "eq"] = makeOp({
            args: ["array", "array"],
            body: {
              args: ["a", "b"],
              body: "a=a" + op + "b"
            },
            rvalue: true,
            count: 2,
            funcName: id + "eq"
          });
          exports[id + "seq"] = makeOp({
            args: ["array", "scalar"],
            body: {
              args: ["a", "s"],
              body: "a=a" + op + "s"
            },
            rvalue: true,
            count: 2,
            funcName: id + "seq"
          });
        }
      })();
      var math_unary = [
        "abs",
        "acos",
        "asin",
        "atan",
        "ceil",
        "cos",
        "exp",
        "floor",
        "log",
        "round",
        "sin",
        "sqrt",
        "tan"
      ];
      (function() {
        for (var i = 0; i < math_unary.length; ++i) {
          var f = math_unary[i];
          exports[f] = makeOp({
            args: ["array", "array"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b"], body: "a=this_f(b)", thisVars: ["this_f"] },
            funcName: f
          });
          exports[f + "eq"] = makeOp({
            args: ["array"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a"], body: "a=this_f(a)", thisVars: ["this_f"] },
            rvalue: true,
            count: 2,
            funcName: f + "eq"
          });
        }
      })();
      var math_comm = [
        "max",
        "min",
        "atan2",
        "pow"
      ];
      (function() {
        for (var i = 0; i < math_comm.length; ++i) {
          var f = math_comm[i];
          exports[f] = makeOp({
            args: ["array", "array", "array"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b", "c"], body: "a=this_f(b,c)", thisVars: ["this_f"] },
            funcName: f
          });
          exports[f + "s"] = makeOp({
            args: ["array", "array", "scalar"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b", "c"], body: "a=this_f(b,c)", thisVars: ["this_f"] },
            funcName: f + "s"
          });
          exports[f + "eq"] = makeOp({
            args: ["array", "array"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b"], body: "a=this_f(a,b)", thisVars: ["this_f"] },
            rvalue: true,
            count: 2,
            funcName: f + "eq"
          });
          exports[f + "seq"] = makeOp({
            args: ["array", "scalar"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b"], body: "a=this_f(a,b)", thisVars: ["this_f"] },
            rvalue: true,
            count: 2,
            funcName: f + "seq"
          });
        }
      })();
      var math_noncomm = [
        "atan2",
        "pow"
      ];
      (function() {
        for (var i = 0; i < math_noncomm.length; ++i) {
          var f = math_noncomm[i];
          exports[f + "op"] = makeOp({
            args: ["array", "array", "array"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b", "c"], body: "a=this_f(c,b)", thisVars: ["this_f"] },
            funcName: f + "op"
          });
          exports[f + "ops"] = makeOp({
            args: ["array", "array", "scalar"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b", "c"], body: "a=this_f(c,b)", thisVars: ["this_f"] },
            funcName: f + "ops"
          });
          exports[f + "opeq"] = makeOp({
            args: ["array", "array"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b"], body: "a=this_f(b,a)", thisVars: ["this_f"] },
            rvalue: true,
            count: 2,
            funcName: f + "opeq"
          });
          exports[f + "opseq"] = makeOp({
            args: ["array", "scalar"],
            pre: { args: [], body: "this_f=Math." + f, thisVars: ["this_f"] },
            body: { args: ["a", "b"], body: "a=this_f(b,a)", thisVars: ["this_f"] },
            rvalue: true,
            count: 2,
            funcName: f + "opseq"
          });
        }
      })();
      exports.any = compile({
        args: ["array"],
        pre: EmptyProc,
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "if(a){return true}", localVars: [], thisVars: [] },
        post: { args: [], localVars: [], thisVars: [], body: "return false" },
        funcName: "any"
      });
      exports.all = compile({
        args: ["array"],
        pre: EmptyProc,
        body: { args: [{ name: "x", lvalue: false, rvalue: true, count: 1 }], body: "if(!x){return false}", localVars: [], thisVars: [] },
        post: { args: [], localVars: [], thisVars: [], body: "return true" },
        funcName: "all"
      });
      exports.sum = compile({
        args: ["array"],
        pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "this_s+=a", localVars: [], thisVars: ["this_s"] },
        post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
        funcName: "sum"
      });
      exports.prod = compile({
        args: ["array"],
        pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=1" },
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 1 }], body: "this_s*=a", localVars: [], thisVars: ["this_s"] },
        post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
        funcName: "prod"
      });
      exports.norm2squared = compile({
        args: ["array"],
        pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 2 }], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"] },
        post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
        funcName: "norm2squared"
      });
      exports.norm2 = compile({
        args: ["array"],
        pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 2 }], body: "this_s+=a*a", localVars: [], thisVars: ["this_s"] },
        post: { args: [], localVars: [], thisVars: ["this_s"], body: "return Math.sqrt(this_s)" },
        funcName: "norm2"
      });
      exports.norminf = compile({
        args: ["array"],
        pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 4 }], body: "if(-a>this_s){this_s=-a}else if(a>this_s){this_s=a}", localVars: [], thisVars: ["this_s"] },
        post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
        funcName: "norminf"
      });
      exports.norm1 = compile({
        args: ["array"],
        pre: { args: [], localVars: [], thisVars: ["this_s"], body: "this_s=0" },
        body: { args: [{ name: "a", lvalue: false, rvalue: true, count: 3 }], body: "this_s+=a<0?-a:a", localVars: [], thisVars: ["this_s"] },
        post: { args: [], localVars: [], thisVars: ["this_s"], body: "return this_s" },
        funcName: "norm1"
      });
      exports.sup = compile({
        args: ["array"],
        pre: {
          body: "this_h=-Infinity",
          args: [],
          thisVars: ["this_h"],
          localVars: []
        },
        body: {
          body: "if(_inline_1_arg0_>this_h)this_h=_inline_1_arg0_",
          args: [{ "name": "_inline_1_arg0_", "lvalue": false, "rvalue": true, "count": 2 }],
          thisVars: ["this_h"],
          localVars: []
        },
        post: {
          body: "return this_h",
          args: [],
          thisVars: ["this_h"],
          localVars: []
        }
      });
      exports.inf = compile({
        args: ["array"],
        pre: {
          body: "this_h=Infinity",
          args: [],
          thisVars: ["this_h"],
          localVars: []
        },
        body: {
          body: "if(_inline_1_arg0_<this_h)this_h=_inline_1_arg0_",
          args: [{ "name": "_inline_1_arg0_", "lvalue": false, "rvalue": true, "count": 2 }],
          thisVars: ["this_h"],
          localVars: []
        },
        post: {
          body: "return this_h",
          args: [],
          thisVars: ["this_h"],
          localVars: []
        }
      });
      exports.argmin = compile({
        args: ["index", "array", "shape"],
        pre: {
          body: "{this_v=Infinity;this_i=_inline_0_arg2_.slice(0)}",
          args: [
            { name: "_inline_0_arg0_", lvalue: false, rvalue: false, count: 0 },
            { name: "_inline_0_arg1_", lvalue: false, rvalue: false, count: 0 },
            { name: "_inline_0_arg2_", lvalue: false, rvalue: true, count: 1 }
          ],
          thisVars: ["this_i", "this_v"],
          localVars: []
        },
        body: {
          body: "{if(_inline_1_arg1_<this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
          args: [
            { name: "_inline_1_arg0_", lvalue: false, rvalue: true, count: 2 },
            { name: "_inline_1_arg1_", lvalue: false, rvalue: true, count: 2 }
          ],
          thisVars: ["this_i", "this_v"],
          localVars: ["_inline_1_k"]
        },
        post: {
          body: "{return this_i}",
          args: [],
          thisVars: ["this_i"],
          localVars: []
        }
      });
      exports.argmax = compile({
        args: ["index", "array", "shape"],
        pre: {
          body: "{this_v=-Infinity;this_i=_inline_0_arg2_.slice(0)}",
          args: [
            { name: "_inline_0_arg0_", lvalue: false, rvalue: false, count: 0 },
            { name: "_inline_0_arg1_", lvalue: false, rvalue: false, count: 0 },
            { name: "_inline_0_arg2_", lvalue: false, rvalue: true, count: 1 }
          ],
          thisVars: ["this_i", "this_v"],
          localVars: []
        },
        body: {
          body: "{if(_inline_1_arg1_>this_v){this_v=_inline_1_arg1_;for(var _inline_1_k=0;_inline_1_k<_inline_1_arg0_.length;++_inline_1_k){this_i[_inline_1_k]=_inline_1_arg0_[_inline_1_k]}}}",
          args: [
            { name: "_inline_1_arg0_", lvalue: false, rvalue: true, count: 2 },
            { name: "_inline_1_arg1_", lvalue: false, rvalue: true, count: 2 }
          ],
          thisVars: ["this_i", "this_v"],
          localVars: ["_inline_1_k"]
        },
        post: {
          body: "{return this_i}",
          args: [],
          thisVars: ["this_i"],
          localVars: []
        }
      });
      exports.random = makeOp({
        args: ["array"],
        pre: { args: [], body: "this_f=Math.random", thisVars: ["this_f"] },
        body: { args: ["a"], body: "a=this_f()", thisVars: ["this_f"] },
        funcName: "random"
      });
      exports.assign = makeOp({
        args: ["array", "array"],
        body: { args: ["a", "b"], body: "a=b" },
        funcName: "assign"
      });
      exports.assigns = makeOp({
        args: ["array", "scalar"],
        body: { args: ["a", "b"], body: "a=b" },
        funcName: "assigns"
      });
      exports.equals = compile({
        args: ["array", "array"],
        pre: EmptyProc,
        body: {
          args: [
            { name: "x", lvalue: false, rvalue: true, count: 1 },
            { name: "y", lvalue: false, rvalue: true, count: 1 }
          ],
          body: "if(x!==y){return false}",
          localVars: [],
          thisVars: []
        },
        post: { args: [], localVars: [], thisVars: [], body: "return true" },
        funcName: "equals"
      });
    }
  });

  // photo-worker-src.js
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
  var ColorUtils = class {
    /**
     * Converts sRGB hexadecimal to linear components.
     * @typeParam T vec3 or vec4 linear components.
     */
    static hexToFactor(hex, target) {
      hex = Math.floor(hex);
      const _target = target;
      _target[0] = (hex >> 16 & 255) / 255;
      _target[1] = (hex >> 8 & 255) / 255;
      _target[2] = (hex & 255) / 255;
      return this.convertSRGBToLinear(target, target);
    }
    /**
     * Converts linear components to sRGB hexadecimal.
     * @typeParam T vec3 or vec4 linear components.
     */
    static factorToHex(factor) {
      const target = [...factor];
      const [r, g, b] = this.convertLinearToSRGB(factor, target);
      return r * 255 << 16 ^ g * 255 << 8 ^ b * 255 << 0;
    }
    /**
     * Converts sRGB components to linear components.
     * @typeParam T vec3 or vec4 linear components.
     */
    static convertSRGBToLinear(source, target) {
      const _source = source;
      const _target = target;
      for (let i = 0; i < 3; i++) {
        _target[i] = _source[i] < 0.04045 ? _source[i] * 0.0773993808 : Math.pow(_source[i] * 0.9478672986 + 0.0521327014, 2.4);
      }
      return target;
    }
    /**
     * Converts linear components to sRGB components.
     * @typeParam T vec3 or vec4 linear components.
     */
    static convertLinearToSRGB(source, target) {
      const _source = source;
      const _target = target;
      for (let i = 0; i < 3; i++) {
        _target[i] = _source[i] < 31308e-7 ? _source[i] * 12.92 : 1.055 * Math.pow(_source[i], 0.41666) - 0.055;
      }
      return target;
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
    setNormalScale(scale2) {
      return this.set("normalScale", scale2);
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
    setScale(scale2) {
      return this.set("scale", scale2);
    }
    /** Returns the local matrix of this Node. */
    getMatrix() {
      return MathUtils.compose(this.get("translation"), this.get("rotation"), this.get("scale"), []);
    }
    /** Sets the local matrix of this Node. Matrix will be decomposed to TRS properties. */
    setMatrix(matrix) {
      const translation = this.get("translation").slice();
      const rotation = this.get("rotation").slice();
      const scale2 = this.get("scale").slice();
      MathUtils.decompose(matrix, translation, rotation, scale2);
      return this.set("translation", translation).set("rotation", rotation).set("scale", scale2);
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
    constructor(document) {
      this.extensionName = "";
      this.prereadTypes = [];
      this.prewriteTypes = [];
      this.readDependencies = [];
      this.writeDependencies = [];
      this.document = void 0;
      this.required = false;
      this.properties = /* @__PURE__ */ new Set();
      this._listener = void 0;
      this.document = document;
      document.getRoot()._enableExtension(this);
      this._listener = (_event) => {
        const event = _event;
        const target = event.target;
        if (target instanceof ExtensionProperty && target.extensionName === this.extensionName) {
          if (event.type === "node:create") this._addExtensionProperty(target);
          if (event.type === "node:dispose") this._removeExtensionProperty(target);
        }
      };
      const graph = document.getGraph();
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
      const document = new Document().setLogger(options.logger);
      this.validate(jsonDoc, options);
      const context = new ReaderContext(jsonDoc);
      const assetDef = json.asset;
      const asset = document.getRoot().getAsset();
      if (assetDef.copyright) asset.copyright = assetDef.copyright;
      if (assetDef.extras) asset.extras = assetDef.extras;
      if (json.extras !== void 0) {
        document.getRoot().setExtras(_extends({}, json.extras));
      }
      const extensionsUsed = json.extensionsUsed || [];
      const extensionsRequired = json.extensionsRequired || [];
      options.extensions.sort((a, b) => a.EXTENSION_NAME > b.EXTENSION_NAME ? 1 : -1);
      for (const Extension2 of options.extensions) {
        if (extensionsUsed.includes(Extension2.EXTENSION_NAME)) {
          const extension = document.createExtension(Extension2).setRequired(extensionsRequired.includes(Extension2.EXTENSION_NAME));
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
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.BUFFER)).forEach((extension) => extension.preread(context, PropertyType.BUFFER));
      context.buffers = bufferDefs.map((bufferDef) => {
        const buffer = document.createBuffer(bufferDef.name);
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
        const accessor = document.createAccessor(accessorDef.name, buffer).setType(accessorDef.type);
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
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.TEXTURE)).forEach((extension) => extension.preread(context, PropertyType.TEXTURE));
      context.textures = imageDefs.map((imageDef) => {
        const texture = document.createTexture(imageDef.name);
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
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.MATERIAL)).forEach((extension) => extension.preread(context, PropertyType.MATERIAL));
      const materialDefs = json.materials || [];
      context.materials = materialDefs.map((materialDef) => {
        const material = document.createMaterial(materialDef.name);
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
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.MESH)).forEach((extension) => extension.preread(context, PropertyType.MESH));
      const meshDefs = json.meshes || [];
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.PRIMITIVE)).forEach((extension) => extension.preread(context, PropertyType.PRIMITIVE));
      context.meshes = meshDefs.map((meshDef) => {
        const mesh = document.createMesh(meshDef.name);
        if (meshDef.extras) mesh.setExtras(meshDef.extras);
        if (meshDef.weights !== void 0) {
          mesh.setWeights(meshDef.weights);
        }
        const primitiveDefs = meshDef.primitives || [];
        primitiveDefs.forEach((primitiveDef) => {
          const primitive = document.createPrimitive();
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
            const target = document.createPrimitiveTarget(targetName);
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
        const camera = document.createCamera(cameraDef.name).setType(cameraDef.type);
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
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.NODE)).forEach((extension) => extension.preread(context, PropertyType.NODE));
      context.nodes = nodeDefs.map((nodeDef) => {
        const node = document.createNode(nodeDef.name);
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
          const scale2 = [1, 1, 1];
          MathUtils.decompose(nodeDef.matrix, translation, rotation, scale2);
          node.setTranslation(translation);
          node.setRotation(rotation);
          node.setScale(scale2);
        }
        if (nodeDef.weights !== void 0) {
          node.setWeights(nodeDef.weights);
        }
        return node;
      });
      const skinDefs = json.skins || [];
      context.skins = skinDefs.map((skinDef) => {
        const skin = document.createSkin(skinDef.name);
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
        const animation = document.createAnimation(animationDef.name);
        if (animationDef.extras) animation.setExtras(animationDef.extras);
        const samplerDefs = animationDef.samplers || [];
        const samplers = samplerDefs.map((samplerDef) => {
          const sampler = document.createAnimationSampler().setInput(context.accessors[samplerDef.input]).setOutput(context.accessors[samplerDef.output]).setInterpolation(samplerDef.interpolation || AnimationSampler.Interpolation.LINEAR);
          if (samplerDef.extras) sampler.setExtras(samplerDef.extras);
          animation.addSampler(sampler);
          return sampler;
        });
        const channels = animationDef.channels || [];
        channels.forEach((channelDef) => {
          const channel = document.createAnimationChannel().setSampler(samplers[channelDef.sampler]).setTargetPath(channelDef.target.path);
          if (channelDef.target.node !== void 0) channel.setTargetNode(context.nodes[channelDef.target.node]);
          if (channelDef.extras) channel.setExtras(channelDef.extras);
          animation.addChannel(channel);
        });
        return animation;
      });
      const sceneDefs = json.scenes || [];
      document.getRoot().listExtensionsUsed().filter((extension) => extension.prereadTypes.includes(PropertyType.SCENE)).forEach((extension) => extension.preread(context, PropertyType.SCENE));
      context.scenes = sceneDefs.map((sceneDef) => {
        const scene = document.createScene(sceneDef.name);
        if (sceneDef.extras) scene.setExtras(sceneDef.extras);
        const children = sceneDef.nodes || [];
        children.map((nodeIndex) => context.nodes[nodeIndex]).forEach((node) => scene.addChild(node));
        return scene;
      });
      if (json.scene !== void 0) {
        document.getRoot().setDefaultScene(context.scenes[json.scene]);
      }
      document.getRoot().listExtensionsUsed().forEach((extension) => extension.read(context));
      accessorDefs.forEach((accessorDef, index) => {
        const accessor = context.accessors[index];
        const hasSparseValues = !!accessorDef.sparse;
        const isZeroFilled = !accessorDef.bufferView && !accessor.getArray();
        if (hasSparseValues || isZeroFilled) {
          accessor.setSparse(true).setArray(getSparseArray(accessorDef, context));
        }
      });
      return document;
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
  function getSlot(document, texture) {
    const edge = document.getGraph().listParentEdges(texture).find((edge2) => edge2.getParent() !== document.getRoot());
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
    _nextUint8Array(len2) {
      const value = new Uint8Array(this._dataView.buffer, this._dataView.byteOffset + this._offset, len2);
      this._offset += len2;
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
    setClearcoatNormalScale(scale2) {
      return this.set("clearcoatNormalScale", scale2);
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
    setScale(scale2) {
      return this.set("scale", scale2);
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

  // node_modules/ndarray-pixels/dist/ndarray-pixels-browser.modern.js
  init_define_process_versions();
  var import_ndarray = __toESM(require_ndarray(), 1);
  var import_ndarray_ops = __toESM(require_ndarray_ops(), 1);
  function getPixelsInternal(buffer, mimeType) {
    if (!(buffer instanceof Uint8Array)) {
      throw new Error("[ndarray-pixels] Input must be Uint8Array or Buffer.");
    }
    const blob = new Blob([buffer], {
      type: mimeType
    });
    return createImageBitmap(blob, {
      premultiplyAlpha: "none",
      colorSpaceConversion: "none"
    }).then((img) => {
      const canvas = new OffscreenCanvas(img.width, img.height);
      const context = canvas.getContext("2d");
      context.drawImage(img, 0, 0);
      const pixels = context.getImageData(0, 0, img.width, img.height);
      return (0, import_ndarray.default)(new Uint8Array(pixels.data), [img.width, img.height, 4], [4, 4 * img.width, 1], 0);
    });
  }
  async function getPixels(data, mimeType) {
    return getPixelsInternal(data, mimeType);
  }

  // node_modules/@gltf-transform/functions/dist/functions.modern.js
  var import_ndarray2 = __toESM(require_ndarray(), 1);
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
  function getGLPrimitiveCount(prim) {
    const indices = prim.getIndices();
    const position = prim.getAttribute("POSITION");
    switch (prim.getMode()) {
      case Primitive.Mode.POINTS:
        return indices ? indices.getCount() : position.getCount();
      case Primitive.Mode.LINES:
        return indices ? indices.getCount() / 2 : position.getCount() / 2;
      case Primitive.Mode.LINE_LOOP:
        return indices ? indices.getCount() : position.getCount();
      case Primitive.Mode.LINE_STRIP:
        return indices ? indices.getCount() - 1 : position.getCount() - 1;
      case Primitive.Mode.TRIANGLES:
        return indices ? indices.getCount() / 3 : position.getCount() / 3;
      case Primitive.Mode.TRIANGLE_STRIP:
      case Primitive.Mode.TRIANGLE_FAN:
        return indices ? indices.getCount() - 2 : position.getCount() - 2;
      default:
        throw new Error("Unexpected mode: " + prim.getMode());
    }
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
  function deepSwapAttribute(prim, src, dst) {
    prim.swap(src, dst);
    for (const target of prim.listTargets()) {
      target.swap(src, dst);
    }
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
  function shallowCloneAccessor(document, accessor) {
    return document.createAccessor(accessor.getName()).setArray(accessor.getArray()).setType(accessor.getType()).setBuffer(accessor.getBuffer()).setNormalized(accessor.getNormalized()).setSparse(accessor.getSparse());
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
  function isEmptyObject(object) {
    for (const _key in object) return false;
    return true;
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
    const document = Document.fromGraph(prim.getGraph());
    if (!remap || !dstVertexCount) {
      [remap, dstVertexCount] = createCompactPlan(prim);
    }
    const srcIndices = prim.getIndices();
    const srcIndicesArray = srcIndices ? srcIndices.getArray() : null;
    const srcIndicesCount = getPrimitiveVertexCount(prim, VertexCountMethod.RENDER);
    const dstIndices = document.createAccessor();
    const dstIndicesCount = srcIndicesCount;
    const dstIndicesArray = createIndicesEmpty(dstIndicesCount, dstVertexCount);
    for (let i = 0; i < dstIndicesCount; i++) {
      dstIndicesArray[i] = remap[srcIndicesArray ? srcIndicesArray[i] : i];
    }
    prim.setIndices(dstIndices.setArray(dstIndicesArray));
    const srcAttributesPrev = deepListAttributes(prim);
    for (const srcAttribute of prim.listAttributes()) {
      const dstAttribute = shallowCloneAccessor(document, srcAttribute);
      compactAttribute(srcAttribute, srcIndices, remap, dstAttribute, dstVertexCount);
      prim.swap(srcAttribute, dstAttribute);
    }
    for (const target of prim.listTargets()) {
      for (const srcAttribute of target.listAttributes()) {
        const dstAttribute = shallowCloneAccessor(document, srcAttribute);
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
  function multiply$1(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    return out;
  }
  var mul$1 = multiply$1;
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
    const document = Document.fromGraph(graph);
    const logger = document.getLogger();
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
  function convertPrimitiveToTriangles(prim) {
    const graph = prim.getGraph();
    const document = Document.fromGraph(graph);
    if (!prim.getIndices()) {
      weldPrimitive(prim);
    }
    const srcIndices = prim.getIndices();
    const srcIndicesArray = srcIndices.getArray();
    const dstGLPrimitiveCount = getGLPrimitiveCount(prim);
    const IndicesArray = ComponentTypeToTypedArray[srcIndices.getComponentType()];
    const dstIndicesArray = new IndicesArray(dstGLPrimitiveCount * 3);
    const srcMode = prim.getMode();
    if (srcMode === TRIANGLE_STRIP$2) {
      for (let i = 0, il = srcIndicesArray.length; i < il - 2; i++) {
        if (i % 2) {
          dstIndicesArray[i * 3] = srcIndicesArray[i + 1];
          dstIndicesArray[i * 3 + 1] = srcIndicesArray[i];
          dstIndicesArray[i * 3 + 2] = srcIndicesArray[i + 2];
        } else {
          dstIndicesArray[i * 3] = srcIndicesArray[i];
          dstIndicesArray[i * 3 + 1] = srcIndicesArray[i + 1];
          dstIndicesArray[i * 3 + 2] = srcIndicesArray[i + 2];
        }
      }
    } else if (srcMode === TRIANGLE_FAN$2) {
      for (let i = 0; i < dstGLPrimitiveCount; i++) {
        dstIndicesArray[i * 3] = srcIndicesArray[0];
        dstIndicesArray[i * 3 + 1] = srcIndicesArray[i + 1];
        dstIndicesArray[i * 3 + 2] = srcIndicesArray[i + 2];
      }
    } else {
      throw new Error("Only TRIANGLE_STRIP and TRIANGLE_FAN may be converted to TRIANGLES.");
    }
    prim.setMode(TRIANGLES$1);
    const root = document.getRoot();
    if (srcIndices.listParents().some((parent) => parent !== root && parent !== prim)) {
      prim.setIndices(shallowCloneAccessor(document, srcIndices).setArray(dstIndicesArray));
    } else {
      srcIndices.setArray(dstIndicesArray);
    }
  }
  var DEDUP_DEFAULTS = {
    keepUniqueNames: false,
    propertyTypes: [PropertyType.ACCESSOR, PropertyType.MESH, PropertyType.TEXTURE, PropertyType.MATERIAL, PropertyType.SKIN]
  };
  function dequantizeAttributeArray(srcArray, componentType, normalized) {
    const dstArray = new Float32Array(srcArray.length);
    for (let i = 0, il = srcArray.length; i < il; i++) {
      if (normalized) {
        dstArray[i] = MathUtils.decodeNormalizedInt(srcArray[i], componentType);
      } else {
        dstArray[i] = srcArray[i];
      }
    }
    return dstArray;
  }
  var {
    TEXTURE_INFO,
    ROOT: ROOT$1
  } = PropertyType;
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
  function add(out, a, b) {
    out[0] = a[0] + b[0];
    out[1] = a[1] + b[1];
    out[2] = a[2] + b[2];
    out[3] = a[3] + b[3];
    return out;
  }
  function subtract(out, a, b) {
    out[0] = a[0] - b[0];
    out[1] = a[1] - b[1];
    out[2] = a[2] - b[2];
    out[3] = a[3] - b[3];
    return out;
  }
  function multiply2(out, a, b) {
    out[0] = a[0] * b[0];
    out[1] = a[1] * b[1];
    out[2] = a[2] * b[2];
    out[3] = a[3] * b[3];
    return out;
  }
  function scale(out, a, b) {
    out[0] = a[0] * b;
    out[1] = a[1] * b;
    out[2] = a[2] * b;
    out[3] = a[3] * b;
    return out;
  }
  function length2(a) {
    var x = a[0];
    var y = a[1];
    var z = a[2];
    var w = a[3];
    return Math.sqrt(x * x + y * y + z * z + w * w);
  }
  var sub = subtract;
  var mul = multiply2;
  var len = length2;
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
  var SRGB_PATTERN = /color|emissive|diffuse/i;
  function getTextureColorSpace(texture) {
    const graph = texture.getGraph();
    const edges = graph.listParentEdges(texture);
    const isSRGB = edges.some((edge) => {
      return edge.getAttributes().isColor || SRGB_PATTERN.test(edge.getName());
    });
    return isSRGB ? "srgb" : null;
  }
  function listTextureInfoByMaterial(material) {
    const graph = material.getGraph();
    const visited = /* @__PURE__ */ new Set();
    const results = /* @__PURE__ */ new Set();
    function traverse(prop) {
      const textureInfoNames = /* @__PURE__ */ new Set();
      for (const edge of graph.listChildEdges(prop)) {
        if (edge.getChild() instanceof Texture) {
          textureInfoNames.add(edge.getName() + "Info");
        }
      }
      for (const edge of graph.listChildEdges(prop)) {
        const child = edge.getChild();
        if (visited.has(child)) continue;
        visited.add(child);
        if (child instanceof TextureInfo && textureInfoNames.has(edge.getName())) {
          results.add(child);
        } else if (child instanceof ExtensionProperty) {
          traverse(child);
        }
      }
    }
    traverse(material);
    return Array.from(results);
  }
  function listTextureSlots(texture) {
    const document = Document.fromGraph(texture.getGraph());
    const root = document.getRoot();
    const slots = texture.getGraph().listParentEdges(texture).filter((edge) => edge.getParent() !== root).map((edge) => edge.getName());
    return Array.from(new Set(slots));
  }
  var NAME$l = "prune";
  var EPS = 3 / 255;
  var PRUNE_DEFAULTS = {
    propertyTypes: [PropertyType.NODE, PropertyType.SKIN, PropertyType.MESH, PropertyType.CAMERA, PropertyType.PRIMITIVE, PropertyType.PRIMITIVE_TARGET, PropertyType.ANIMATION, PropertyType.MATERIAL, PropertyType.TEXTURE, PropertyType.ACCESSOR, PropertyType.BUFFER],
    keepLeaves: false,
    keepAttributes: false,
    keepIndices: false,
    keepSolidTextures: false,
    keepExtras: false
  };
  function prune(_options = PRUNE_DEFAULTS) {
    const options = assignDefaults(PRUNE_DEFAULTS, _options);
    const propertyTypes = new Set(options.propertyTypes);
    const keepExtras = options.keepExtras;
    return createTransform(NAME$l, async (document) => {
      const logger = document.getLogger();
      const root = document.getRoot();
      const graph = document.getGraph();
      const counter = new DisposeCounter();
      const onDispose = (event) => counter.dispose(event.target);
      graph.addEventListener("node:dispose", onDispose);
      if (propertyTypes.has(PropertyType.MESH)) {
        for (const mesh of root.listMeshes()) {
          if (mesh.listPrimitives().length > 0) continue;
          mesh.dispose();
        }
      }
      if (propertyTypes.has(PropertyType.NODE)) {
        if (!options.keepLeaves) {
          for (const scene of root.listScenes()) {
            nodeTreeShake(graph, scene, keepExtras);
          }
        }
        for (const node of root.listNodes()) {
          treeShake(node, keepExtras);
        }
      }
      if (propertyTypes.has(PropertyType.SKIN)) {
        for (const skin of root.listSkins()) {
          treeShake(skin, keepExtras);
        }
      }
      if (propertyTypes.has(PropertyType.MESH)) {
        for (const mesh of root.listMeshes()) {
          treeShake(mesh, keepExtras);
        }
      }
      if (propertyTypes.has(PropertyType.CAMERA)) {
        for (const camera of root.listCameras()) {
          treeShake(camera, keepExtras);
        }
      }
      if (propertyTypes.has(PropertyType.PRIMITIVE)) {
        indirectTreeShake(graph, PropertyType.PRIMITIVE, keepExtras);
      }
      if (propertyTypes.has(PropertyType.PRIMITIVE_TARGET)) {
        indirectTreeShake(graph, PropertyType.PRIMITIVE_TARGET, keepExtras);
      }
      if (!options.keepAttributes && propertyTypes.has(PropertyType.ACCESSOR)) {
        const materialPrims = /* @__PURE__ */ new Map();
        for (const mesh of root.listMeshes()) {
          for (const prim of mesh.listPrimitives()) {
            const material = prim.getMaterial();
            if (!material) continue;
            const required = listRequiredSemantics(document, prim, material);
            const unused = listUnusedSemantics(prim, required);
            pruneAttributes(prim, unused);
            prim.listTargets().forEach((target) => pruneAttributes(target, unused));
            materialPrims.has(material) ? materialPrims.get(material).add(prim) : materialPrims.set(material, /* @__PURE__ */ new Set([prim]));
          }
        }
        for (const [material, prims] of materialPrims) {
          shiftTexCoords(material, Array.from(prims));
        }
      }
      if (propertyTypes.has(PropertyType.ANIMATION)) {
        for (const anim of root.listAnimations()) {
          for (const channel of anim.listChannels()) {
            if (!channel.getTargetNode()) {
              channel.dispose();
            }
          }
          if (!anim.listChannels().length) {
            const samplers = anim.listSamplers();
            treeShake(anim, keepExtras);
            samplers.forEach((sampler) => treeShake(sampler, keepExtras));
          } else {
            anim.listSamplers().forEach((sampler) => treeShake(sampler, keepExtras));
          }
        }
      }
      if (propertyTypes.has(PropertyType.MATERIAL)) {
        root.listMaterials().forEach((material) => treeShake(material, keepExtras));
      }
      if (propertyTypes.has(PropertyType.TEXTURE)) {
        root.listTextures().forEach((texture) => treeShake(texture, keepExtras));
        if (!options.keepSolidTextures) {
          await pruneSolidTextures(document);
        }
      }
      if (propertyTypes.has(PropertyType.ACCESSOR)) {
        root.listAccessors().forEach((accessor) => treeShake(accessor, keepExtras));
      }
      if (propertyTypes.has(PropertyType.BUFFER)) {
        root.listBuffers().forEach((buffer) => treeShake(buffer, keepExtras));
      }
      graph.removeEventListener("node:dispose", onDispose);
      if (!counter.empty()) {
        const str = counter.entries().map(([type, count]) => `${type} (${count})`).join(", ");
        logger.info(`${NAME$l}: Removed types... ${str}`);
      } else {
        logger.debug(`${NAME$l}: No unused properties found.`);
      }
      logger.debug(`${NAME$l}: Complete.`);
    });
  }
  var DisposeCounter = class {
    constructor() {
      this.disposed = {};
    }
    empty() {
      for (const _key in this.disposed) return false;
      return true;
    }
    entries() {
      return Object.entries(this.disposed);
    }
    /** Records properties disposed by type. */
    dispose(prop) {
      this.disposed[prop.propertyType] = this.disposed[prop.propertyType] || 0;
      this.disposed[prop.propertyType]++;
    }
  };
  function treeShake(prop, keepExtras) {
    const parents = prop.listParents().filter((p) => !(p instanceof Root || p instanceof AnimationChannel));
    const needsExtras = keepExtras && !isEmptyObject(prop.getExtras());
    if (!parents.length && !needsExtras) {
      prop.dispose();
    }
  }
  function indirectTreeShake(graph, propertyType, keepExtras) {
    for (const edge of graph.listEdges()) {
      const parent = edge.getParent();
      if (parent.propertyType === propertyType) {
        treeShake(parent, keepExtras);
      }
    }
  }
  function nodeTreeShake(graph, prop, keepExtras) {
    prop.listChildren().forEach((child) => nodeTreeShake(graph, child, keepExtras));
    if (prop instanceof Scene) return;
    const isUsed2 = graph.listParentEdges(prop).some((e) => {
      const ptype = e.getParent().propertyType;
      return ptype !== PropertyType.ROOT && ptype !== PropertyType.SCENE && ptype !== PropertyType.NODE;
    });
    const isEmpty = graph.listChildren(prop).length === 0;
    const needsExtras = keepExtras && !isEmptyObject(prop.getExtras());
    if (isEmpty && !isUsed2 && !needsExtras) {
      prop.dispose();
    }
  }
  function pruneAttributes(prim, unused) {
    for (const semantic of unused) {
      prim.setAttribute(semantic, null);
    }
  }
  function listUnusedSemantics(prim, required) {
    const unused = [];
    for (const semantic of prim.listSemantics()) {
      if (semantic === "NORMAL" && !required.has(semantic)) {
        unused.push(semantic);
      } else if (semantic === "TANGENT" && !required.has(semantic)) {
        unused.push(semantic);
      } else if (semantic.startsWith("TEXCOORD_") && !required.has(semantic)) {
        unused.push(semantic);
      } else if (semantic.startsWith("COLOR_") && semantic !== "COLOR_0") {
        unused.push(semantic);
      }
    }
    return unused;
  }
  function listRequiredSemantics(document, prim, material, semantics = /* @__PURE__ */ new Set()) {
    const graph = document.getGraph();
    const edges = graph.listChildEdges(material);
    const textureNames = /* @__PURE__ */ new Set();
    for (const edge of edges) {
      if (edge.getChild() instanceof Texture) {
        textureNames.add(edge.getName());
      }
    }
    for (const edge of edges) {
      const name = edge.getName();
      const child = edge.getChild();
      if (child instanceof TextureInfo) {
        if (textureNames.has(name.replace(/Info$/, ""))) {
          semantics.add(`TEXCOORD_${child.getTexCoord()}`);
        }
      }
      if (child instanceof Texture && name.match(/normalTexture/i)) {
        semantics.add("TANGENT");
      }
      if (child instanceof ExtensionProperty) {
        listRequiredSemantics(document, prim, child, semantics);
      }
    }
    const isLit = material instanceof Material && !material.getExtension("KHR_materials_unlit");
    const isPoints = prim.getMode() === Primitive.Mode.POINTS;
    if (isLit && !isPoints) {
      semantics.add("NORMAL");
    }
    return semantics;
  }
  function shiftTexCoords(material, prims) {
    const textureInfoList = listTextureInfoByMaterial(material);
    const texCoordSet = new Set(textureInfoList.map((info) => info.getTexCoord()));
    const texCoordList = Array.from(texCoordSet).sort();
    const texCoordMap = new Map(texCoordList.map((texCoord, index) => [texCoord, index]));
    const semanticMap = new Map(texCoordList.map((texCoord, index) => [`TEXCOORD_${texCoord}`, `TEXCOORD_${index}`]));
    for (const textureInfo of textureInfoList) {
      const texCoord = textureInfo.getTexCoord();
      textureInfo.setTexCoord(texCoordMap.get(texCoord));
    }
    for (const prim of prims) {
      const semantics = prim.listSemantics().filter((semantic) => semantic.startsWith("TEXCOORD_")).sort();
      updatePrim(prim, semantics);
      prim.listTargets().forEach((target) => updatePrim(target, semantics));
    }
    function updatePrim(prim, srcSemantics) {
      for (const srcSemantic of srcSemantics) {
        const uv = prim.getAttribute(srcSemantic);
        if (!uv) continue;
        const dstSemantic = semanticMap.get(srcSemantic);
        if (dstSemantic === srcSemantic) continue;
        prim.setAttribute(dstSemantic, uv);
        prim.setAttribute(srcSemantic, null);
      }
    }
  }
  async function pruneSolidTextures(document) {
    const root = document.getRoot();
    const graph = document.getGraph();
    const logger = document.getLogger();
    const textures = root.listTextures();
    const pending = textures.map(async (texture) => {
      var _texture$getSize;
      const factor = await getTextureFactor(texture);
      if (!factor) return;
      if (getTextureColorSpace(texture) === "srgb") {
        ColorUtils.convertSRGBToLinear(factor, factor);
      }
      const name = texture.getName() || texture.getURI();
      const size = (_texture$getSize = texture.getSize()) == null ? void 0 : _texture$getSize.join("x");
      const slots = listTextureSlots(texture);
      for (const edge of graph.listParentEdges(texture)) {
        const parent = edge.getParent();
        if (parent !== root && applyMaterialFactor(parent, factor, edge.getName(), logger)) {
          edge.dispose();
        }
      }
      if (texture.listParents().length === 1) {
        texture.dispose();
        logger.debug(`${NAME$l}: Removed solid-color texture "${name}" (${size}px ${slots.join(", ")})`);
      }
    });
    await Promise.all(pending);
  }
  function applyMaterialFactor(material, factor, slot, logger) {
    if (material instanceof Material) {
      switch (slot) {
        case "baseColorTexture":
          material.setBaseColorFactor(mul(factor, factor, material.getBaseColorFactor()));
          return true;
        case "emissiveTexture":
          material.setEmissiveFactor(mul$1([0, 0, 0], factor.slice(0, 3), material.getEmissiveFactor()));
          return true;
        case "occlusionTexture":
          return Math.abs(factor[0] - 1) <= EPS;
        case "metallicRoughnessTexture":
          material.setRoughnessFactor(factor[1] * material.getRoughnessFactor());
          material.setMetallicFactor(factor[2] * material.getMetallicFactor());
          return true;
        case "normalTexture":
          return len(sub(create2(), factor, [0.5, 0.5, 1, 1])) <= EPS;
      }
    }
    logger.warn(`${NAME$l}: Detected single-color ${slot} texture. Pruning ${slot} not yet supported.`);
    return false;
  }
  async function getTextureFactor(texture) {
    const pixels = await maybeGetPixels(texture);
    if (!pixels) return null;
    const min = [Infinity, Infinity, Infinity, Infinity];
    const max = [-Infinity, -Infinity, -Infinity, -Infinity];
    const target = [0, 0, 0, 0];
    const [width, height] = pixels.shape;
    for (let i = 0; i < width; i++) {
      for (let j = 0; j < height; j++) {
        for (let k = 0; k < 4; k++) {
          min[k] = Math.min(min[k], pixels.get(i, j, k));
          max[k] = Math.max(max[k], pixels.get(i, j, k));
        }
      }
      if (len(sub(target, max, min)) / 255 > EPS) {
        return null;
      }
    }
    return scale(target, add(target, max, min), 0.5 / 255);
  }
  async function maybeGetPixels(texture) {
    try {
      return await getPixels(texture.getImage(), texture.getMimeType());
    } catch (_unused) {
      return null;
    }
  }
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
  var NAME$d = "unweld";
  function unweldPrimitive(prim, visited = /* @__PURE__ */ new Map()) {
    const indices = prim.getIndices();
    if (!indices) return;
    const graph = prim.getGraph();
    const document = Document.fromGraph(graph);
    const logger = document.getLogger();
    const srcVertexCount = prim.getAttribute("POSITION").getCount();
    for (const srcAttribute of prim.listAttributes()) {
      prim.swap(srcAttribute, unweldAttribute(document, srcAttribute, indices, visited));
      if (srcAttribute.listParents().length === 1) srcAttribute.dispose();
    }
    for (const target of prim.listTargets()) {
      for (const srcAttribute of target.listAttributes()) {
        target.swap(srcAttribute, unweldAttribute(document, srcAttribute, indices, visited));
        if (srcAttribute.listParents().length === 1) srcAttribute.dispose();
      }
    }
    const dstVertexCount = prim.getAttribute("POSITION").getCount();
    logger.debug(`${NAME$d}: ${formatDeltaOp(srcVertexCount, dstVertexCount)} vertices.`);
    prim.setIndices(null);
    if (indices.listParents().length === 1) indices.dispose();
  }
  function unweldAttribute(document, srcAttribute, indices, visited) {
    if (visited.has(srcAttribute) && visited.get(srcAttribute).has(indices)) {
      return visited.get(srcAttribute).get(indices);
    }
    const srcArray = srcAttribute.getArray();
    const TypedArray = srcArray.constructor;
    const dstArray = new TypedArray(indices.getCount() * srcAttribute.getElementSize());
    const indicesArray = indices.getArray();
    const elementSize = srcAttribute.getElementSize();
    for (let i = 0, il = indices.getCount(); i < il; i++) {
      for (let j = 0; j < elementSize; j++) {
        dstArray[i * elementSize + j] = srcArray[indicesArray[i] * elementSize + j];
      }
    }
    if (!visited.has(srcAttribute)) visited.set(srcAttribute, /* @__PURE__ */ new Map());
    const dstAttribute = shallowCloneAccessor(document, srcAttribute).setArray(dstArray);
    visited.get(srcAttribute).set(indices, dstAttribute);
    return dstAttribute;
  }
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
  var NAME$7 = "simplify";
  var {
    POINTS,
    LINES,
    LINE_STRIP,
    LINE_LOOP,
    TRIANGLES,
    TRIANGLE_STRIP,
    TRIANGLE_FAN
  } = Primitive.Mode;
  var SIMPLIFY_DEFAULTS = {
    ratio: 0,
    error: 1e-4,
    lockBorder: false
  };
  function simplify(_options) {
    const options = assignDefaults(SIMPLIFY_DEFAULTS, _options);
    const simplifier = options.simplifier;
    if (!simplifier) {
      throw new Error(`${NAME$7}: simplifier dependency required \u2014 install "meshoptimizer".`);
    }
    return createTransform(NAME$7, async (document) => {
      const logger = document.getLogger();
      await simplifier.ready;
      await document.transform(weld({
        overwrite: false
      }));
      let numUnsupported = 0;
      for (const mesh of document.getRoot().listMeshes()) {
        for (const prim of mesh.listPrimitives()) {
          const mode = prim.getMode();
          if (mode !== TRIANGLES && mode !== TRIANGLE_STRIP && mode !== TRIANGLE_FAN && mode !== POINTS) {
            numUnsupported++;
            continue;
          }
          simplifyPrimitive(prim, options);
          if (getPrimitiveVertexCount(prim, VertexCountMethod.RENDER) === 0) {
            deepDisposePrimitive(prim);
          }
        }
        if (mesh.listPrimitives().length === 0) mesh.dispose();
      }
      if (numUnsupported > 0) {
        logger.warn(`${NAME$7}: Skipped ${numUnsupported} primitives: Unsupported draw mode.`);
      }
      logger.debug(`${NAME$7}: Complete.`);
    });
  }
  function simplifyPrimitive(prim, _options) {
    const options = _extends3({}, SIMPLIFY_DEFAULTS, _options);
    const simplifier = options.simplifier;
    const graph = prim.getGraph();
    const document = Document.fromGraph(graph);
    const logger = document.getLogger();
    switch (prim.getMode()) {
      case POINTS:
        return _simplifyPoints(document, prim, options);
      case LINES:
      case LINE_STRIP:
      case LINE_LOOP:
        logger.warn(`${NAME$7}: Skipping primitive simplification: Unsupported draw mode.`);
        return prim;
      case TRIANGLE_STRIP:
      case TRIANGLE_FAN:
        convertPrimitiveToTriangles(prim);
        break;
    }
    const srcVertexCount = getPrimitiveVertexCount(prim, VertexCountMethod.UPLOAD);
    const srcIndexCount = getPrimitiveVertexCount(prim, VertexCountMethod.RENDER);
    if (srcIndexCount < srcVertexCount / 2) {
      compactPrimitive(prim);
    }
    const position = prim.getAttribute("POSITION");
    const srcIndices = prim.getIndices();
    let positionArray = position.getArray();
    let indicesArray = srcIndices.getArray();
    if (!(positionArray instanceof Float32Array)) {
      positionArray = dequantizeAttributeArray(positionArray, position.getComponentType(), position.getNormalized());
    }
    if (!(indicesArray instanceof Uint32Array)) {
      indicesArray = new Uint32Array(indicesArray);
    }
    const targetCount = Math.floor(options.ratio * srcIndexCount / 3) * 3;
    const flags = options.lockBorder ? ["LockBorder"] : [];
    const [dstIndicesArray, error] = simplifier.simplify(indicesArray, positionArray, 3, targetCount, options.error, flags);
    prim.setIndices(shallowCloneAccessor(document, srcIndices).setArray(dstIndicesArray));
    if (srcIndices.listParents().length === 1) srcIndices.dispose();
    compactPrimitive(prim);
    const dstVertexCount = getPrimitiveVertexCount(prim, VertexCountMethod.UPLOAD);
    if (dstVertexCount <= 65534) {
      prim.getIndices().setArray(new Uint16Array(prim.getIndices().getArray()));
    }
    logger.debug(`${NAME$7}: ${formatDeltaOp(srcVertexCount, dstVertexCount)} vertices, error: ${error.toFixed(4)}.`);
    return prim;
  }
  function _simplifyPoints(document, prim, options) {
    const simplifier = options.simplifier;
    const logger = document.getLogger();
    const indices = prim.getIndices();
    if (indices) unweldPrimitive(prim);
    const position = prim.getAttribute("POSITION");
    const color = prim.getAttribute("COLOR_0");
    const srcVertexCount = position.getCount();
    let positionArray = position.getArray();
    let colorArray = color ? color.getArray() : void 0;
    const colorStride = color ? color.getComponentSize() : void 0;
    if (!(positionArray instanceof Float32Array)) {
      positionArray = dequantizeAttributeArray(positionArray, position.getComponentType(), position.getNormalized());
    }
    if (colorArray && !(colorArray instanceof Float32Array)) {
      colorArray = dequantizeAttributeArray(colorArray, position.getComponentType(), position.getNormalized());
    }
    const targetCount = Math.floor(options.ratio * srcVertexCount);
    const dstIndicesArray = simplifier.simplifyPoints(positionArray, 3, targetCount, colorArray, colorStride);
    const [remap, unique] = simplifier.compactMesh(dstIndicesArray);
    logger.debug(`${NAME$7}: ${formatDeltaOp(position.getCount(), unique)} vertices.`);
    for (const srcAttribute of deepListAttributes(prim)) {
      const dstAttribute = shallowCloneAccessor(document, srcAttribute);
      compactAttribute(srcAttribute, null, remap, dstAttribute, unique);
      deepSwapAttribute(prim, srcAttribute, dstAttribute);
      if (srcAttribute.listParents().length === 1) srcAttribute.dispose();
    }
    return prim;
  }
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

  // node_modules/meshoptimizer/index.module.js
  init_define_process_versions();

  // node_modules/meshoptimizer/meshopt_encoder.module.js
  init_define_process_versions();
  var MeshoptEncoder = function() {
    var wasm = "b9H79TebbbeJq9Geueu9Geub9Gbb9Gvuuuuueu9Gduueu9Gluuuueu9Gvuuuuub9Gouuuuuub9Gluuuub9GiuuueuiKLdilevlevlooroowwvwbDDbelve9Weiiviebeoweuec:G:Qdkr;RiOo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949c919M9MWVbe8F9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949c919M9MWV9c9V919U9KbdE9TW79O9V9Wt9FW9U9J9V9KW9wWVtW949wWV79P9V9UbiY9TW79O9V9Wt9FW9U9J9V9KW69U9KW949c919M9MWVbl8E9TW79O9V9Wt9FW9U9J9V9KW69U9KW949c919M9MWV9c9V919U9Kbv8A9TW79O9V9Wt9FW9U9J9V9KW69U9KW949wWV79P9V9UboE9TW79O9V9Wt9FW9U9J9V9KW69U9KW949tWG91W9U9JWbra9TW79O9V9Wt9FW9U9J9V9KW69U9KW949tWG91W9U9JW9c9V919U9KbwL9TW79O9V9Wt9FW9U9J9V9KWS9P2tWV9p9JtbDK9TW79O9V9Wt9FW9U9J9V9KWS9P2tWV9r919HtbqL9TW79O9V9Wt9FW9U9J9V9KWS9P2tWVT949WbkE9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94J9H9J9OWbPa9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94J9H9J9OW9ttV9P9Wbsa9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94SWt9J9O9sW9T9H9WbzK9TW79O9V9Wt9F79W9Ht9P9H29t9VVt9sW9T9H9WbHl79IV9RbODwebcekdQXq;A9pLdbk;QqeKu8Jjjjjbcjo9Rgv8Kjjjjbcbhodnalcefae0mbabcbRbN:kjjbc:GeV86bbavcjdfcbcjdzNjjjb8AdnaiTmbavcjdfadalz:tjjjb8Akabaefhrabcefhwavalfcbcbcjdal9RalcFe0EzNjjjb8Aavavcjdfalz:tjjjbhDcj;abal9Uc;WFbGgecjdaecjd6Ehqcbhkindndnaiak9nmbaDcjlfcbcjdzNjjjb8Aaqaiak9Rakaqfai6Egxcsfgecl4cifcd4hmadakal2fhPdndndnaec9WGgsTmbcbhzaPhHawhOxekdnaxmbalheinaraw9Ram6miawcbamzNjjjbamfhwaecufgembxvkkcbhAaPhOinaDaAfRbbhCaDcjlfheaOhoaxhXinaeaoRbbgQaC9RgCcetaCcKtcK91cr4786bbaoalfhoaecefheaQhCaXcufgXmbkaraw9Ram6mdaOcefhOawcbamzNjjjbamfhwaAcefgAal9hmbxlkkindnaxTmbaDazfRbbhCaDcjlfheaHhoaxhXinaeaoRbbgQaC9RgCcetaCcKtcK91cr4786bbaoalfhoaecefheaQhCaXcufgXmbkkaraO9Ram6mearaOcbamzNjjjbgLamfgw9RcK6mecbhKaDcjlfhOinaDcjlfaKfhYcwhAczhQceheindndnaegXce9hmbcuhoaYRbbmecbhodninaogecsSmeaecefhoaOaefcefRbbTmbkkcucbaecs6EhoxekaXcethocuaXtc;:bGcFb7hCcbheinaoaCaOaefRbb9nfhoaecefgecz9hmbkkaoaQaoaQ6geEhQaXaAaeEhAaXcetheaXcl6mbkdndndndnaAcufPdiebkaLaKco4fgeaeRbbcdciaAclSEaKci4coGtV86bbaAcw9hmeawaY8Pbb83bbawcwfaYcwf8Pbb83bbawczfhwxdkaLaKco4fgeaeRbbceaKci4coGtV86bbkdncwaA9Tg8Ambinawcb86bbawcefhwxbkkcuaAtcu7hYcbhEaOh3ina3hea8AhCcbhoinaeRbbgQaYcFeGgXaQaX6EaoaAtVhoaecefheaCcufgCmbkawao86bba3a8Afh3awcefhwaEa8AfgEcz6mbkcbheindnaOaefRbbgoaX6mbawao86bbawcefhwkaecefgecz9hmbkkdnaKczfgKas9pmbaOczfhOaraw9RcL0mekkaKas6meawTmeaHcefhHawhOazcefgzalSmixbkkcbhoxikcbhoaraw9Ralcaalca0E6mddnalc8F0mbawcbcaal9RgezNjjjbaefhwkawaDcjdfalz:tjjjbalfab9RhoxdkaDaPaxcufal2falz:tjjjb8Aaxakfhkawmbkcbhokavcjof8Kjjjjbaok9heeuaecaaeca0Eabcj;abae9Uc;WFbGgdcjdadcjd6Egdfcufad9Uae2adcl4cifcd4adV2fcefkmbcbabBdN:kjjbk:zse5u8Jjjjjbc;ae9Rgl8Kjjjjbcbhvdnaici9UgocHfae0mbabcbyd:e:kjjbgrc;GeV86bbalc;abfcFecjezNjjjb8AalcUfgw9cu83ibalc8WfgD9cu83ibalcyfgq9cu83ibalcafgk9cu83ibalcKfgx9cu83ibalczfgm9cu83ibal9cu83iwal9cu83ibabaefc9WfhPabcefgsaofhednaiTmbcmcsarcb9kgzEhHcbhOcbhAcbhCcbhXcbhQindnaeaP9nmbcbhvxikaQcufhvadaCcdtfgLydbhKaLcwfydbhYaLclfydbh8AcbhEdndndninalc;abfavcsGcitfgoydlh3dndndnaoydbgoaK9hmba3a8ASmekdnaoa8A9hmba3aY9hmbaEcefhExekaoaY9hmea3aK9hmeaEcdfhEkaEc870mdaXcufhvaLaEciGcx2goc:y1jjbfydbcdtfydbh3aLaocN1jjbfydbcdtfydbh8AaLaoc:q1jjbfydbcdtfydbhKcbhodnindnalavcsGcdtfydba39hmbaohYxdkcuhYavcufhvaocefgocz9hmbkkaOa3aOSgvaYce9iaYaH9oVgoGfhOdndndncbcsavEaYaoEgvcs9hmbarce9imba3a3aAa3cefaASgvEgAcefSmecmcsavEhvkasavaEcdtc;WeGV86bbavcs9hmea3aA9Rgvcetavc8F917hvinaeavcFb0crtavcFbGV86bbaecefheavcje6hoavcr4hvaoTmbka3hAxvkcPhvasaEcdtcPV86bba3hAkavTmiavaH9omicdhocehEaQhYxlkavcufhvaEclfgEc;ab9hmbkkdnaLceaYaOSceta8AaOSEcx2gvc:q1jjbfydbcdtfydbgKTaLavcN1jjbfydbcdtfydbg8AceSGaLavc:y1jjbfydbcdtfydbg3cdSGaOcb9hGazGg5ce9hmbaw9cu83ibaD9cu83ibaq9cu83ibak9cu83ibax9cu83ibam9cu83ibal9cu83iwal9cu83ibcbhOkcbhEaXcufgvhodnindnalaocsGcdtfydba8A9hmbaEhYxdkcuhYaocufhoaEcefgEcz9hmbkkcbhodnindnalavcsGcdtfydba39hmbaohExdkcuhEavcufhvaocefgocz9hmbkkaOaKaOSg8EfhLdndnaYcm0mbaYcefhYxekcbcsa8AaLSgvEhYaLavfhLkdndnaEcm0mbaEcefhExekcbcsa3aLSgvEhEaLavfhLkc9:cua8EEh8FcbhvaEaYcltVgacFeGhodndndninavcj1jjbfRbbaoSmeavcefgvcz9hmbxdkka5aKaO9havcm0VVmbasavc;WeV86bbxekasa8F86bbaeaa86bbaecefhekdna8EmbaKaA9Rgvcetavc8F917hvinaeavcFb0gocrtavcFbGV86bbavcr4hvaecefheaombkaKhAkdnaYcs9hmba8AaA9Rgvcetavc8F917hvinaeavcFb0gocrtavcFbGV86bbavcr4hvaecefheaombka8AhAkdnaEcs9hmba3aA9Rgvcetavc8F917hvinaeavcFb0gocrtavcFbGV86bbavcr4hvaecefheaombka3hAkalaXcdtfaKBdbaXcefcsGhvdndnaYPzbeeeeeeeeeeeeeebekalavcdtfa8ABdbaXcdfcsGhvkdndnaEPzbeeeeeeeeeeeeeebekalavcdtfa3BdbavcefcsGhvkcihoalc;abfaQcitfgEaKBdlaEa8ABdbaQcefcsGhYcdhEavhXaLhOxekcdhoalaXcdtfa3BdbcehEaXcefcsGhXaQhYkalc;abfaYcitfgva8ABdlava3Bdbalc;abfaQaEfcsGcitfgva3BdlavaKBdbascefhsaQaofcsGhQaCcifgCai6mbkkcbhvaeaP0mbcbhvinaeavfavcj1jjbfRbb86bbavcefgvcz9hmbkaeab9Ravfhvkalc;aef8KjjjjbavkZeeucbhddninadcefgdc8F0meceadtae6mbkkadcrfcFeGcr9Uci2cdfabci9U2cHfkmbcbabBd:e:kjjbk:ydewu8Jjjjjbcz9Rhlcbhvdnaicvfae0mbcbhvabcbRb:e:kjjbc;qeV86bbal9cb83iwabcefhoabaefc98fhrdnaiTmbcbhwcbhDindnaoar6mbcbskadaDcdtfydbgqalcwfawaqav9Rgvavc8F91gv7av9Rc507gwcdtfgkydb9Rgvc8E91c9:Gavcdt7awVhvinaoavcFb0gecrtavcFbGV86bbavcr4hvaocefhoaembkakaqBdbaqhvaDcefgDai9hmbkkcbhvaoar0mbaocbBbbaoab9RclfhvkavkBeeucbhddninadcefgdc8F0meceadtae6mbkkadcwfcFeGcr9Uab2cvfk:bvli99dui99ludnaeTmbcuadcetcuftcu7:Yhvdndncuaicuftcu7:YgoJbbbZMgr:lJbbb9p9DTmbar:Ohwxekcjjjj94hwkcbhicbhDinalclfIdbgrJbbbbJbbjZalIdbgq:lar:lMalcwfIdbgk:lMgr:varJbbbb9BEgrNhxaqarNhrdndnakJbbbb9GTmbaxhqxekJbbjZar:l:tgqaq:maxJbbbb9GEhqJbbjZax:l:tgxax:marJbbbb9GEhrkdndnalcxfIdbgxJbbj:;axJbbj:;9GEgkJbbjZakJbbjZ9FEavNJbbbZJbbb:;axJbbbb9GEMgx:lJbbb9p9DTmbax:Ohmxekcjjjj94hmkdndnaqJbbj:;aqJbbj:;9GEgxJbbjZaxJbbjZ9FEaoNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:OhPxekcjjjj94hPkdndnarJbbj:;arJbbj:;9GEgqJbbjZaqJbbjZ9FEaoNJbbbZJbbb:;arJbbbb9GEMgr:lJbbb9p9DTmbar:Ohsxekcjjjj94hskdndnadcl9hmbabaifgzas86bbazcifam86bbazcdfaw86bbazcefaP86bbxekabaDfgzas87ebazcofam87ebazclfaw87ebazcdfaP87ebkalczfhlaiclfhiaDcwfhDaecufgembkkk;hlld99eud99eudnaeTmbdndncuaicuftcu7:YgvJbbbZMgo:lJbbb9p9DTmbao:Ohixekcjjjj94hikaic;8FiGhrinabcofcicdalclfIdb:lalIdb:l9EgialcwfIdb:lalaicdtfIdb:l9EEgialcxfIdb:lalaicdtfIdb:l9EEgiarV87ebdndnJbbj:;JbbjZalaicdtfIdbJbbbb9DEgoalaicd7cdtfIdbJ;Zl:1ZNNgwJbbj:;awJbbj:;9GEgDJbbjZaDJbbjZ9FEavNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohqxekcjjjj94hqkabcdfaq87ebdndnalaicefciGcdtfIdbJ;Zl:1ZNaoNgwJbbj:;awJbbj:;9GEgDJbbjZaDJbbjZ9FEavNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohqxekcjjjj94hqkabaq87ebdndnaoalaicufciGcdtfIdbJ;Zl:1ZNNgoJbbj:;aoJbbj:;9GEgwJbbjZawJbbjZ9FEavNJbbbZJbbb:;aoJbbbb9GEMgo:lJbbb9p9DTmbao:Ohixekcjjjj94hikabclfai87ebabcwfhbalczfhlaecufgembkkk;3viDue99eu8Jjjjjbcjd9Rgo8Kjjjjbadcd4hrdndndndnavcd9hmbadcl6meaohwarhDinawc:CuBdbawclfhwaDcufgDmbkaeTmiadcl6mdarcdthqalhkcbhxinaohwakhDarhminawawydbgPcbaDIdbgs:8cL4cFeGc:cufasJbbbb9BEgzaPaz9kEBdbaDclfhDawclfhwamcufgmmbkakaqfhkaxcefgxaeSmixbkkaeTmdxekaeTmekarcdthkavce9hhqadcl6hdcbhxindndndnaqmbadmdc:CuhDalhwarhminaDcbawIdbgs:8cL4cFeGc:cufasJbbbb9BEgPaDaP9kEhDawclfhwamcufgmmbxdkkc:CuhDdndnavPleddbdkadmdaohwalhmarhPinawcbamIdbgs:8cL4cFeGgzc;:bazc;:b9kEc:cufasJbbbb9BEBdbamclfhmawclfhwaPcufgPmbxdkkadmecbhwarhminaoawfcbalawfIdbgs:8cL4cFeGgPc8AaPc8A9kEc:cufasJbbbb9BEBdbawclfhwamcufgmmbkkadmbcbhwarhPinaDhmdnavceSmbaoawfydbhmkdndnalawfIdbgscjjj;8iamai9RcefgmcLt9R::NJbbbZJbbb:;asJbbbb9GEMgs:lJbbb9p9DTmbas:Ohzxekcjjjj94hzkabawfazcFFFrGamcKtVBdbawclfhwaPcufgPmbkkabakfhbalakfhlaxcefgxae9hmbkkaocjdf8Kjjjjbk;HqdCui998Jjjjjbc:qd9Rgv8Kjjjjbavc:Sefcbc;KbzNjjjb8AcbhodnadTmbcbhoaiTmbdnabae9hmbavcuadcdtgradcFFFFi0Ecbyd:m:kjjbHjjjjbbgeBd:SeavceBd:mdaeabarz:tjjjb8Akavc:GefcwfcbBdbav9cb83i:Geavc:Gefaeadaiavc:Sefz:njjjbavyd:Gehwadci9UgDcbyd:m:kjjbHjjjjbbhravc:Sefavyd:mdgqcdtfarBdbavaqcefgkBd:mdarcbaDzNjjjbhxavc:SefakcdtfcuaicdtaicFFFFi0Ecbyd:m:kjjbHjjjjbbgmBdbavaqcdfgPBd:mdawhramhkinakalIdbalarydbgscwascw6Ecdtfc;ebfIdbMUdbarclfhrakclfhkaicufgimbkavc:SefaPcdtfcuaDcdtadcFFFF970Ecbyd:m:kjjbHjjjjbbgPBdbdnadci6mbaehraPhkaDhiinakamarydbcdtfIdbamarclfydbcdtfIdbMamarcwfydbcdtfIdbMUdbarcxfhrakclfhkaicufgimbkkaqcifhoavc;qbfhzavhravyd:KehHavyd:OehOcbhscbhkcbhAcehCinarhXcihQaeakci2gLcdtfgrydbhdarclfydbhqabaAcx2fgicwfarcwfydbgKBdbaiclfaqBdbaiadBdbaxakfce86bbazaKBdwazaqBdlazadBdbaPakcdtfcbBdbdnasTmbcihQaXhiinazaQcdtfaiydbgrBdbaQaraK9harad9haraq9hGGfhQaiclfhiascufgsmbkkaAcefhAcbhsinaOaHaeasaLfcdtfydbcdtgifydbcdtfgKhrawaifgqydbgdhidnadTmbdninarydbakSmearclfhraicufgiTmdxbkkaraKadcdtfc98fydbBdbaqaqydbcufBdbkascefgsci9hmbkdndnaQTmbcuhkJbbbbhYcbhqavyd:KehKavyd:OehLindndnawazaqcdtfydbcdtgsfydbgrmbaqcefhqxekaqcs0hiamasfgdIdbh8AadalcbaqcefgqaiEcdtfIdbalarcwarcw6Ecdtfc;ebfIdbMgEUdbaEa8A:thEarcdthiaLaKasfydbcdtfhrinaParydbgscdtfgdaEadIdbMg8AUdba8AaYaYa8A9DgdEhYasakadEhkarclfhraic98fgimbkkaqaQ9hmbkakcu9hmekaCaD9pmdindnaxaCfRbbmbaChkxdkaDaCcefgC9hmbxikkaQczaQcz6EhsazhraXhzakcu9hmbkkaocdtavc:Seffc98fhrdninaoTmearydbcbyd1:kjjbH:bjjjbbarc98fhraocufhoxbkkavc:qdf8Kjjjjbk;IlevucuaicdtgvaicFFFFi0Egocbyd:m:kjjbHjjjjbbhralalyd9GgwcdtfarBdbalawcefBd9GabarBdbaocbyd:m:kjjbHjjjjbbhralalyd9GgocdtfarBdbalaocefBd9GabarBdlcuadcdtadcFFFFi0Ecbyd:m:kjjbHjjjjbbhralalyd9GgocdtfarBdbalaocefBd9GabarBdwabydbcbavzNjjjb8Aadci9UhDdnadTmbabydbhoaehladhrinaoalydbcdtfgvavydbcefBdbalclfhlarcufgrmbkkdnaiTmbabydbhlabydlhrcbhvaihoinaravBdbarclfhralydbavfhvalclfhlaocufgombkkdnadci6mbabydlhrabydwhvcbhlinaecwfydbhoaeclfydbhdaraeydbcdtfgwawydbgwcefBdbavawcdtfalBdbaradcdtfgdadydbgdcefBdbavadcdtfalBdbaraocdtfgoaoydbgocefBdbavaocdtfalBdbaecxfheaDalcefgl9hmbkkdnaiTmbabydlheabydbhlinaeaeydbalydb9RBdbalclfhlaeclfheaicufgimbkkkQbabaeadaic:01jjbz:mjjjbkQbabaeadaic:C:jjjbz:mjjjbk9DeeuabcFeaicdtzNjjjbhlcbhbdnadTmbindnalaeydbcdtfgiydbcu9hmbaiabBdbabcefhbkaeclfheadcufgdmbkkabk;Wkivuo99lu8Jjjjjbc;W;Gb9Rgl8Kjjjjbcbhvalcj;Gbfcbc;KbzNjjjb8AalcuadcdtadcFFFFi0Egocbyd:m:kjjbHjjjjbbgrBdj9GalceBd;G9GalcFFF;7rBdwal9cFFF;7;3FF:;Fb83dbalcFFF97Bd;S9Gal9cFFF;7FFF:;u83d;K9Gaicd4hwdndnadmbJFFuFhDJFFuuhqJFFuuhkJFFuFhxJFFuuhmJFFuFhPxekawcdthsaehzincbhiinalaifgHazaifIdbgDaHIdbgxaxaD9EEUdbalc;K;GbfaifgHaDaHIdbgxaxaD9DEUdbaiclfgicx9hmbkazasfhzavcefgvad9hmbkalIdwhqalId;S9GhDalIdlhkalId;O9GhxalIdbhmalId;K9GhPkdndnadTmbJbbbbJbbjZJbbbbaPam:tgPaPJbbbb9DEgPaxak:tgxaxaP9DEgxaDaq:tgDaDax9DEgD:vaDJbbbb9BEhDawcdthsarhHadhzindndnaDaeIdbam:tNJb;au9eNJbbbZMgx:lJbbb9p9DTmbax:Ohixekcjjjj94hikaicztaicwtcj;GiGVaicsGVc:p;G:dKGcH2c;d;H:WKGcv2c;j:KM;jbGhvdndnaDaeclfIdbak:tNJb;au9eNJbbbZMgx:lJbbb9p9DTmbax:Ohixekcjjjj94hikaicztaicwtcj;GiGVaicsGVc:p;G:dKGcH2c;d;H:WKGcq2cM;j:KMeGavVhvdndnaDaecwfIdbaq:tNJb;au9eNJbbbZMgx:lJbbb9p9DTmbax:Ohixekcjjjj94hikaHavaicztaicwtcj;GiGVaicsGVc:p;G:dKGcH2c;d;H:WKGcC2c:KM;j:KdGVBdbaeasfheaHclfhHazcufgzmbkalcbcj;GbzNjjjbhiarhHadheinaiaHydbgzcFrGcx2fgvavydbcefBdbaiazcq4cFrGcx2fgvavydlcefBdlaiazcC4cFrGcx2fgzazydwcefBdwaHclfhHaecufgembxdkkalcbcj;GbzNjjjb8AkcbhHcbhzcbhecbhvinalaHfgiydbhsaiazBdbaicwfgwydbhOawavBdbaiclfgiydbhwaiaeBdbasazfhzaOavfhvawaefheaHcxfgHcj;Gb9hmbkcbhHalaocbyd:m:kjjbHjjjjbbgiBd:e9GdnadTmbabhzinazaHBdbazclfhzadaHcefgH9hmbkabhHadhzinalaraHydbgecdtfydbcFrGcx2fgvavydbgvcefBdbaiavcdtfaeBdbaHclfhHazcufgzmbkaihHadhzinalaraHydbgecdtfydbcq4cFrGcx2fgvavydlgvcefBdlabavcdtfaeBdbaHclfhHazcufgzmbkabhHadhzinalaraHydbgecdtfydbcC4cFrGcx2fgvavydwgvcefBdwaiavcdtfaeBdbaHclfhHazcufgzmbkcbhHinabaiydbcdtfaHBdbaiclfhiadaHcefgH9hmbkkclhidninaic98Smealcj;Gbfaifydbcbyd1:kjjbH:bjjjbbaic98fhixbkkalc;W;Gbf8Kjjjjbk9teiucbcbyd:q:kjjbgeabcifc98GfgbBd:q:kjjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabk9teiucbcbyd:q:kjjbgeabcrfc94GfgbBd:q:kjjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik9:eiuZbhedndncbyd:q:kjjbgdaecztgi9nmbcuheadai9RcFFifcz4nbcuSmekadhekcbabae9Rcifc98Gcbyd:q:kjjbfgdBd:q:kjjbdnadZbcztge9nmbadae9RcFFifcz4nb8Akkk:Iddbcjwk:edb4:h9w9N94:P:gW:j9O:ye9Pbbbbbbebbbdbbbebbbdbbbbbbbdbbbbbbbebbbbbbb:l29hZ;69:9kZ;N;76Z;rg97Z;z;o9xZ8J;B85Z;:;u9yZ;b;k9HZ:2;Z9DZ9e:l9mZ59A8KZ:r;T3Z:A:zYZ79OHZ;j4::8::Y:D9V8:bbbb9s:49:Z8R:hBZ9M9M;M8:L;z;o8:;8:PG89q;x:J878R:hQ8::M:B;e87bbbbbbjZbbjZbbjZ:E;V;N8::Y:DsZ9i;H;68:xd;R8:;h0838:;W:NoZbbbb:WV9O8:uf888:9i;H;68:9c9G;L89;n;m9m89;D8Ko8:bbbbf:8tZ9m836ZS:2AZL;zPZZ818EZ9e:lxZ;U98F8:819E;68:bc:eqkzebbbebbbdbbba:vbb";
    var wasmpack = new Uint8Array([
      32,
      0,
      65,
      2,
      1,
      106,
      34,
      33,
      3,
      128,
      11,
      4,
      13,
      64,
      6,
      253,
      10,
      7,
      15,
      116,
      127,
      5,
      8,
      12,
      40,
      16,
      19,
      54,
      20,
      9,
      27,
      255,
      113,
      17,
      42,
      67,
      24,
      23,
      146,
      148,
      18,
      14,
      22,
      45,
      70,
      69,
      56,
      114,
      101,
      21,
      25,
      63,
      75,
      136,
      108,
      28,
      118,
      29,
      73,
      115
    ]);
    if (typeof WebAssembly !== "object") {
      return {
        supported: false
      };
    }
    var instance;
    var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
      instance = result.instance;
      instance.exports.__wasm_call_ctors();
      instance.exports.meshopt_encodeVertexVersion(0);
      instance.exports.meshopt_encodeIndexVersion(1);
    });
    function unpack(data) {
      var result = new Uint8Array(data.length);
      for (var i = 0; i < data.length; ++i) {
        var ch = data.charCodeAt(i);
        result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
      }
      var write = 0;
      for (var i = 0; i < data.length; ++i) {
        result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
      }
      return result.buffer.slice(0, write);
    }
    function assert(cond) {
      if (!cond) {
        throw new Error("Assertion failed");
      }
    }
    function bytes(view) {
      return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
    function reorder(fun, indices, vertices, optf) {
      var sbrk = instance.exports.sbrk;
      var ip = sbrk(indices.length * 4);
      var rp = sbrk(vertices * 4);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      var indices8 = bytes(indices);
      heap.set(indices8, ip);
      if (optf) {
        optf(ip, ip, indices.length, vertices);
      }
      var unique = fun(rp, ip, indices.length, vertices);
      heap = new Uint8Array(instance.exports.memory.buffer);
      var remap = new Uint32Array(vertices);
      new Uint8Array(remap.buffer).set(heap.subarray(rp, rp + vertices * 4));
      indices8.set(heap.subarray(ip, ip + indices.length * 4));
      sbrk(ip - sbrk(0));
      for (var i = 0; i < indices.length; ++i) indices[i] = remap[indices[i]];
      return [remap, unique];
    }
    function spatialsort(fun, positions, count, stride) {
      var sbrk = instance.exports.sbrk;
      var ip = sbrk(count * 4);
      var sp = sbrk(count * stride);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(positions), sp);
      fun(ip, sp, count, stride);
      heap = new Uint8Array(instance.exports.memory.buffer);
      var remap = new Uint32Array(count);
      new Uint8Array(remap.buffer).set(heap.subarray(ip, ip + count * 4));
      sbrk(ip - sbrk(0));
      return remap;
    }
    function encode(fun, bound, source, count, size) {
      var sbrk = instance.exports.sbrk;
      var tp = sbrk(bound);
      var sp = sbrk(count * size);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(source), sp);
      var res = fun(tp, bound, sp, count, size);
      var target = new Uint8Array(res);
      target.set(heap.subarray(tp, tp + res));
      sbrk(tp - sbrk(0));
      return target;
    }
    function maxindex(source) {
      var result = 0;
      for (var i = 0; i < source.length; ++i) {
        var index = source[i];
        result = result < index ? index : result;
      }
      return result;
    }
    function index32(source, size) {
      assert(size == 2 || size == 4);
      if (size == 4) {
        return new Uint32Array(source.buffer, source.byteOffset, source.byteLength / 4);
      } else {
        var view = new Uint16Array(source.buffer, source.byteOffset, source.byteLength / 2);
        return new Uint32Array(view);
      }
    }
    function filter(fun, source, count, stride, bits, insize, mode) {
      var sbrk = instance.exports.sbrk;
      var tp = sbrk(count * stride);
      var sp = sbrk(count * insize);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(source), sp);
      fun(tp, count, stride, bits, sp, mode);
      var target = new Uint8Array(count * stride);
      target.set(heap.subarray(tp, tp + count * stride));
      sbrk(tp - sbrk(0));
      return target;
    }
    return {
      ready,
      supported: true,
      reorderMesh: function(indices, triangles, optsize) {
        var optf = triangles ? optsize ? instance.exports.meshopt_optimizeVertexCacheStrip : instance.exports.meshopt_optimizeVertexCache : void 0;
        return reorder(instance.exports.meshopt_optimizeVertexFetchRemap, indices, maxindex(indices) + 1, optf);
      },
      reorderPoints: function(positions, positions_stride) {
        assert(positions instanceof Float32Array);
        assert(positions.length % positions_stride == 0);
        assert(positions_stride >= 3);
        return spatialsort(instance.exports.meshopt_spatialSortRemap, positions, positions.length / positions_stride, positions_stride * 4);
      },
      encodeVertexBuffer: function(source, count, size) {
        assert(size > 0 && size <= 256);
        assert(size % 4 == 0);
        var bound = instance.exports.meshopt_encodeVertexBufferBound(count, size);
        return encode(instance.exports.meshopt_encodeVertexBuffer, bound, source, count, size);
      },
      encodeIndexBuffer: function(source, count, size) {
        assert(size == 2 || size == 4);
        assert(count % 3 == 0);
        var indices = index32(source, size);
        var bound = instance.exports.meshopt_encodeIndexBufferBound(count, maxindex(indices) + 1);
        return encode(instance.exports.meshopt_encodeIndexBuffer, bound, indices, count, 4);
      },
      encodeIndexSequence: function(source, count, size) {
        assert(size == 2 || size == 4);
        var indices = index32(source, size);
        var bound = instance.exports.meshopt_encodeIndexSequenceBound(count, maxindex(indices) + 1);
        return encode(instance.exports.meshopt_encodeIndexSequence, bound, indices, count, 4);
      },
      encodeGltfBuffer: function(source, count, size, mode) {
        var table = {
          ATTRIBUTES: this.encodeVertexBuffer,
          TRIANGLES: this.encodeIndexBuffer,
          INDICES: this.encodeIndexSequence
        };
        assert(table[mode]);
        return table[mode](source, count, size);
      },
      encodeFilterOct: function(source, count, stride, bits) {
        assert(stride == 4 || stride == 8);
        assert(bits >= 1 && bits <= 16);
        return filter(instance.exports.meshopt_encodeFilterOct, source, count, stride, bits, 16);
      },
      encodeFilterQuat: function(source, count, stride, bits) {
        assert(stride == 8);
        assert(bits >= 4 && bits <= 16);
        return filter(instance.exports.meshopt_encodeFilterQuat, source, count, stride, bits, 16);
      },
      encodeFilterExp: function(source, count, stride, bits, mode) {
        assert(stride > 0 && stride % 4 == 0);
        assert(bits >= 1 && bits <= 24);
        var table = {
          Separate: 0,
          SharedVector: 1,
          SharedComponent: 2,
          Clamped: 3
        };
        return filter(instance.exports.meshopt_encodeFilterExp, source, count, stride, bits, stride, mode ? table[mode] : 1);
      }
    };
  }();

  // node_modules/meshoptimizer/meshopt_decoder.module.js
  init_define_process_versions();
  var MeshoptDecoder = function() {
    var wasm_base = "b9H79Tebbbe8Fv9Gbb9Gvuuuuueu9Giuuub9Geueu9Giuuueuikqbeeedddillviebeoweuec:q:Odkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbeY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVbdE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbiL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtblK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbol79IV9Rbrq;w8Wqdbk;esezu8Jjjjjbcj;eb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Radz1jjjbhwcj;abad9Uc;WFbGgocjdaocjd6EhDaicefhocbhqdnindndndnaeaq9nmbaDaeaq9RaqaDfae6Egkcsfglcl4cifcd4hxalc9WGgmTmecbhPawcjdfhsaohzinaraz9Rax6mvarazaxfgo9RcK6mvczhlcbhHinalgic9WfgOawcj;cbffhldndndndndnazaOco4fRbbaHcoG4ciGPlbedibkal9cb83ibalcwf9cb83ibxikalaoRblaoRbbgOco4gAaAciSgAE86bbawcj;cbfaifglcGfaoclfaAfgARbbaOcl4ciGgCaCciSgCE86bbalcVfaAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc7faAaCfgARbbaOciGgOaOciSgOE86bbalctfaAaOfgARbbaoRbegOco4gCaCciSgCE86bbalc91faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc4faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc93faAaCfgARbbaOciGgOaOciSgOE86bbalc94faAaOfgARbbaoRbdgOco4gCaCciSgCE86bbalc95faAaCfgARbbaOcl4ciGgCaCciSgCE86bbalc96faAaCfgARbbaOcd4ciGgCaCciSgCE86bbalc97faAaCfgARbbaOciGgOaOciSgOE86bbalc98faAaOfgORbbaoRbigoco4gAaAciSgAE86bbalc99faOaAfgORbbaocl4ciGgAaAciSgAE86bbalc9:faOaAfgORbbaocd4ciGgAaAciSgAE86bbalcufaOaAfglRbbaociGgoaociSgoE86bbalaofhoxdkalaoRbwaoRbbgOcl4gAaAcsSgAE86bbawcj;cbfaifglcGfaocwfaAfgARbbaOcsGgOaOcsSgOE86bbalcVfaAaOfgORbbaoRbegAcl4gCaCcsSgCE86bbalc7faOaCfgORbbaAcsGgAaAcsSgAE86bbalctfaOaAfgORbbaoRbdgAcl4gCaCcsSgCE86bbalc91faOaCfgORbbaAcsGgAaAcsSgAE86bbalc4faOaAfgORbbaoRbigAcl4gCaCcsSgCE86bbalc93faOaCfgORbbaAcsGgAaAcsSgAE86bbalc94faOaAfgORbbaoRblgAcl4gCaCcsSgCE86bbalc95faOaCfgORbbaAcsGgAaAcsSgAE86bbalc96faOaAfgORbbaoRbvgAcl4gCaCcsSgCE86bbalc97faOaCfgORbbaAcsGgAaAcsSgAE86bbalc98faOaAfgORbbaoRbogAcl4gCaCcsSgCE86bbalc99faOaCfgORbbaAcsGgAaAcsSgAE86bbalc9:faOaAfgORbbaoRbrgocl4gAaAcsSgAE86bbalcufaOaAfglRbbaocsGgoaocsSgoE86bbalaofhoxekalao8Pbb83bbalcwfaocwf8Pbb83bbaoczfhokdnaiam9pmbaHcdfhHaiczfhlarao9RcL0mekkaiam6mvaoTmvdnakTmbawaPfRbbhHawcj;cbfhlashiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkkascefhsaohzaPcefgPad9hmbxikkcbc99arao9Radcaadca0ESEhoxlkaoaxad2fhCdnakmbadhlinaoTmlarao9Rax6mlaoaxfhoalcufglmbkaChoxekcbhmawcjdfhAinarao9Rax6miawamfRbbhHawcj;cbfhlaAhiakhOinaialRbbgzce4cbazceG9R7aHfgH86bbaiadfhialcefhlaOcufgOmbkaAcefhAaoaxfhoamcefgmad9hmbkaChokabaqad2fawcjdfakad2z1jjjb8Aawawcjdfakcufad2fadz1jjjb8Aakaqfhqaombkc9:hoxekc9:hokavcj;ebf8Kjjjjbaok;cseHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecjez:jjjjb8AavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:Lvoeue99dud99eud99dndnadcl9hmbaeTmeindndnabcdfgd8Sbb:Yab8Sbbgi:Ygl:l:tabcefgv8Sbbgo:Ygr:l:tgwJbb;:9cawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai86bbdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad86bbdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad86bbabclfhbaecufgembxdkkaeTmbindndnabclfgd8Ueb:Yab8Uebgi:Ygl:l:tabcdfgv8Uebgo:Ygr:l:tgwJb;:FSawawNJbbbbawawJbbbb9GgDEgq:mgkaqaicb9iEalMgwawNakaqaocb9iEarMgqaqNMM:r:vglNJbbbZJbbb:;aDEMgr:lJbbb9p9DTmbar:Ohixekcjjjj94hikadai87ebdndnaqalNJbbbZJbbb:;aqJbbbb9GEMgq:lJbbb9p9DTmbaq:Ohdxekcjjjj94hdkavad87ebdndnawalNJbbbZJbbb:;awJbbbb9GEMgw:lJbbb9p9DTmbaw:Ohdxekcjjjj94hdkabad87ebabcwfhbaecufgembkkk;oiliui99iue99dnaeTmbcbhiabhlindndnJ;Zl81Zalcof8UebgvciV:Y:vgoal8Ueb:YNgrJb;:FSNJbbbZJbbb:;arJbbbb9GEMgw:lJbbb9p9DTmbaw:OhDxekcjjjj94hDkalclf8Uebhqalcdf8UebhkabaiavcefciGfcetfaD87ebdndnaoak:YNgwJb;:FSNJbbbZJbbb:;awJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavciGfgkcd7cetfaD87ebdndnaoaq:YNgoJb;:FSNJbbbZJbbb:;aoJbbbb9GEMgx:lJbbb9p9DTmbax:OhDxekcjjjj94hDkabaiavcufciGfcetfaD87ebdndnJbbjZararN:tawawN:taoaoN:tgrJbbbbarJbbbb9GE:rJb;:FSNJbbbZMgr:lJbbb9p9DTmbar:Ohvxekcjjjj94hvkabakcetfav87ebalcwfhlaiclfhiaecufgembkkk9mbdnadcd4ae2gdTmbinababydbgecwtcw91:Yaece91cjjj98Gcjjj;8if::NUdbabclfhbadcufgdmbkkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabkkkebcjwklzNbb";
    var wasm_simd = "b9H79TebbbeKl9Gbb9Gvuuuuueu9Giuuub9Geueuikqbbebeedddilve9Weeeviebeoweuec:q:6dkr;leDo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9KW9J9V9KW9wWVtW949c919M9MWVbdY9TW79O9V9Wt9F9KW9J9V9KW69U9KW949c919M9MWVblE9TW79O9V9Wt9F9KW9J9V9KW69U9KW949tWG91W9U9JWbvL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9p9JtboK9TW79O9V9Wt9F9KW9J9V9KWS9P2tWV9r919HtbrL9TW79O9V9Wt9F9KW9J9V9KWS9P2tWVT949Wbwl79IV9RbDq:p9sqlbzik9:evu8Jjjjjbcz9Rhbcbheincbhdcbhiinabcwfadfaicjuaead4ceGglE86bbaialfhiadcefgdcw9hmbkaec:q:yjjbfai86bbaecitc:q1jjbfab8Piw83ibaecefgecjd9hmbkk:N8JlHud97euo978Jjjjjbcj;kb9Rgv8Kjjjjbc9:hodnadcefal0mbcuhoaiRbbc:Ge9hmbavaialfgrad9Rad;8qbbcj;abad9UhlaicefhodnaeTmbadTmbalc;WFbGglcjdalcjd6EhwcbhDinawaeaD9RaDawfae6Egqcsfglc9WGgkci2hxakcethmalcl4cifcd4hPabaDad2fhsakc;ab6hzcbhHincbhOaohAdndninaraA9RaP6meavcj;cbfaOak2fhCaAaPfhocbhidnazmbarao9Rc;Gb6mbcbhlinaCalfhidndndndndnaAalco4fRbbgXciGPlbedibkaipxbbbbbbbbbbbbbbbbpklbxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklbaoczfhokdndndndndnaXcd4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklzxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklzaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklzaoczfhokdndndndndnaXcl4ciGPlbedibkaipxbbbbbbbbbbbbbbbbpklaxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spklaaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaiaopbbbpklaaoczfhokdndndndndnaXco4Plbedibkaipxbbbbbbbbbbbbbbbbpkl8WxikaiaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaoclfaYpQbfaXc:q:yjjbfRbbfhoxdkaiaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibaXc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgXcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkl8WaocwfaYpQbfaXc:q:yjjbfRbbfhoxekaiaopbbbpkl8Waoczfhokalc;abfhialcjefak0meaihlarao9Rc;Fb0mbkkdnaiak9pmbaici4hlinarao9RcK6miaCaifhXdndndndndnaAaico4fRbbalcoG4ciGPlbedibkaXpxbbbbbbbbbbbbbbbbpkbbxikaXaopbblaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLgQcdp:meaQpmbzeHdOiAlCvXoQrLpxiiiiiiiiiiiiiiiip9ogLpxiiiiiiiiiiiiiiiip8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaoclfaYpQbfaKc:q:yjjbfRbbfhoxdkaXaopbbwaopbbbgQclp:meaQpmbzeHdOiAlCvXoQrLpxssssssssssssssssp9ogLpxssssssssssssssssp8JgQp5b9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibaKc:q:yjjbfpbbbgYaYpmbbbbbbbbbbbbbbbbaQp5e9cjF;8;4;W;G;ab9:9cU1:NgKcitc:q1jjbfpbibp9UpmbedilvorzHOACXQLpPaLaQp9spkbbaocwfaYpQbfaKc:q:yjjbfRbbfhoxekaXaopbbbpkbbaoczfhokalcdfhlaiczfgiak6mbkkaoTmeaohAaOcefgOclSmdxbkkc9:hoxlkdnakTmbavcjdfaHfhiavaHfpbdbhYcbhXinaiavcj;cbfaXfglpblbgLcep9TaLpxeeeeeeeeeeeeeeeegQp9op9Hp9rgLalakfpblbg8Acep9Ta8AaQp9op9Hp9rg8ApmbzeHdOiAlCvXoQrLgEalamfpblbg3cep9Ta3aQp9op9Hp9rg3alaxfpblbg5cep9Ta5aQp9op9Hp9rg5pmbzeHdOiAlCvXoQrLg8EpmbezHdiOAlvCXorQLgQaQpmbedibedibedibediaYp9UgYp9AdbbaiadfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaEa8EpmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwKDYq8AkEx3m5P8Es8FgLa3a5pmwKDYq8AkEx3m5P8Es8Fg8ApmbezHdiOAlvCXorQLgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfglaYaLa8ApmwDKYqk8AExm35Ps8E8FgQaQpmbedibedibedibedip9UgYp9AdbbaladfglaYaQaQpmlvorlvorlvorlvorp9UgYp9AdbbaladfglaYaQaQpmwDqkwDqkwDqkwDqkp9UgYp9AdbbaladfglaYaQaQpmxmPsxmPsxmPsxmPsp9UgYp9AdbbaladfhiaXczfgXak6mbkkaHclfgHad6mbkasavcjdfaqad2;8qbbavavcjdfaqcufad2fad;8qbbaqaDfgDae6mbkkcbc99arao9Radcaadca0ESEhokavcj;kbf8Kjjjjbaokwbz:bjjjbk::seHu8Jjjjjbc;ae9Rgv8Kjjjjbc9:hodnaeci9UgrcHfal0mbcuhoaiRbbgwc;WeGc;Ge9hmbawcsGgwce0mbavc;abfcFecje;8kbavcUf9cu83ibavc8Wf9cu83ibavcyf9cu83ibavcaf9cu83ibavcKf9cu83ibavczf9cu83ibav9cu83iwav9cu83ibaialfc9WfhDaicefgqarfhidnaeTmbcmcsawceSEhkcbhxcbhmcbhPcbhwcbhlindnaiaD9nmbc9:hoxikdndnaqRbbgoc;Ve0mbavc;abfalaocu7gscl4fcsGcitfgzydlhrazydbhzdnaocsGgHak9pmbavawasfcsGcdtfydbaxaHEhoaHThsdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkaxasfhxcdhHavawcdtfaoBdbawasfhwcehsalhOxdkdndnaHcsSmbaHc987aHamffcefhoxekaicefhoai8SbbgHcFeGhsdndnaHcu9mmbaohixekaicvfhiascFbGhscrhHdninao8SbbgOcFbGaHtasVhsaOcu9kmeaocefhoaHcrfgHc8J9hmbxdkkaocefhikasce4cbasceG9R7amfhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhHavawcdtfaoBdbcehsawcefhwalhOaohmxekdnaocpe0mbaxcefgHavawaDaocsGfRbbgocl49RcsGcdtfydbaocz6gzEhravawao9RcsGcdtfydbaHazfgAaocsGgHEhoaHThCdndnadcd9hmbabaPcetfgHax87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHaxBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfaxBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgOaxBdlaOarBdbavawazfgwcsGcdtfaoBdbalcefcsGhOawaCfhwaxhzaAaCfhxxekaxcbaiRbbgOEgzaoc;:eSgHfhraOcsGhCaOcl4hAdndnaOcs0mbarcefhoxekarhoavawaA9RcsGcdtfydbhrkdndnaCmbaocefhxxekaohxavawaO9RcsGcdtfydbhokdndnaHTmbaicefhHxekaicdfhHai8SbegscFeGhzdnascu9kmbaicofhXazcFbGhzcrhidninaH8SbbgscFbGaitazVhzascu9kmeaHcefhHaicrfgic8J9hmbkaXhHxekaHcefhHkazce4cbazceG9R7amfgmhzkdndnaAcsSmbaHhsxekaHcefhsaH8SbbgicFeGhrdnaicu9kmbaHcvfhXarcFbGhrcrhidninas8SbbgHcFbGaitarVhraHcu9kmeascefhsaicrfgic8J9hmbkaXhsxekascefhskarce4cbarceG9R7amfgmhrkdndnaCcsSmbashixekascefhias8SbbgocFeGhHdnaocu9kmbascvfhXaHcFbGhHcrhodninai8SbbgscFbGaotaHVhHascu9kmeaicefhiaocrfgoc8J9hmbkaXhixekaicefhikaHce4cbaHceG9R7amfgmhokdndnadcd9hmbabaPcetfgHaz87ebaHclfao87ebaHcdfar87ebxekabaPcdtfgHazBdbaHcwfaoBdbaHclfarBdbkcdhsavawcdtfazBdbavawcefgwcsGcdtfarBdbcihHavc;abfalcitfgXazBdlaXarBdbavawaOcz6aAcsSVfgwcsGcdtfaoBdbawaCTaCcsSVfhwalcefcsGhOkaqcefhqavc;abfaOcitfgOarBdlaOaoBdbavc;abfalasfcsGcitfgraoBdlarazBdbawcsGhwalaHfcsGhlaPcifgPae6mbkkcbc99aiaDSEhokavc;aef8Kjjjjbaok:flevu8Jjjjjbcz9Rhvc9:hodnaecvfal0mbcuhoaiRbbc;:eGc;qe9hmbav9cb83iwaicefhraialfc98fhwdnaeTmbdnadcdSmbcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcdtfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfglBdbaoalBdbaDcefgDae9hmbxdkkcbhDindnaraw6mbc9:skarcefhoar8SbbglcFeGhidndnalcu9mmbaohrxekarcvfhraicFbGhicrhldninao8SbbgdcFbGaltaiVhiadcu9kmeaocefhoalcrfglc8J9hmbxdkkaocefhrkabaDcetfaic8Etc8F91aicd47avcwfaiceGcdtVgoydbfgl87ebaoalBdbaDcefgDae9hmbkkcbc99arawSEhokaok:wPliuo97eue978Jjjjjbca9Rhiaec98Ghldndnadcl9hmbdnalTmbcbhvabhdinadadpbbbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDpxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpkbbadczfhdavclfgval6mbkkalaeSmeaipxbbbbbbbbbbbbbbbbgqpklbaiabalcdtfgdaeciGglcdtgv;8qbbdnalTmbaiaipblbgocKp:RecKp:Sep;6egraocwp:RecKp:Sep;6earp;Geaoczp:RecKp:Sep;6egwp;Gep;Kep;LegDaqp:2egqarpxbbbjbbbjbbbjbbbjgkp9op9rp;Kegrpxbb;:9cbb;:9cbb;:9cbb;:9cararp;MeaDaDp;Meawaqawakp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFbbbFbbbFbbbFbbbp9oaopxbbbFbbbFbbbFbbbFp9op9qarawp;Meaqp;Kecwp:RepxbFbbbFbbbFbbbFbbp9op9qaDawp;Meaqp;Keczp:RepxbbFbbbFbbbFbbbFbp9op9qpklbkadaiav;8qbbskdnalTmbcbhvabhdinadczfgxaxpbbbgopxbbbbbbFFbbbbbbFFgkp9oadpbbbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpkbbadaDakp9oaoarpmbezHdiOAlvCXorQLp9qpkbbadcafhdavclfgval6mbkkalaeSmbaiaeciGgvcitgdfcbcaad9R;8kbaiabalcitfglad;8qbbdnavTmbaiaipblzgopxbbbbbbFFbbbbbbFFgkp9oaipblbgDaopmbediwDqkzHOAKY8AEgwczp:Reczp:Sep;6egraDaopmlvorxmPsCXQL358E8FpxFubbFubbFubbFubbp9op;6eawczp:Sep;6egwp;Gearp;Gep;Kep;Legopxbbbbbbbbbbbbbbbbp:2egqarpxbbbjbbbjbbbjbbbjgmp9op9rp;Kegrpxb;:FSb;:FSb;:FSb;:FSararp;Meaoaop;Meawaqawamp9op9rp;Kegrarp;Mep;Kep;Kep;Jep;Negwp;Mepxbbn0bbn0bbn0bbn0gqp;KepxFFbbFFbbFFbbFFbbp9oaoawp;Meaqp;Keczp:Rep9qgoarawp;Meaqp;KepxFFbbFFbbFFbbFFbbp9ogrpmwDKYqk8AExm35Ps8E8Fp9qpklzaiaDakp9oaoarpmbezHdiOAlvCXorQLp9qpklbkalaiad;8qbbkk;4wllue97euv978Jjjjjbc8W9Rhidnaec98GglTmbcbhvabhoinaiaopbbbgraoczfgwpbbbgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklbaopxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblbpEb:T:j83ibaocwfarp5eaipblbpEe:T:j83ibawaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblbpEd:T:j83ibaocKfakp5eaipblbpEi:T:j83ibaocafhoavclfgval6mbkkdnalaeSmbaiaeciGgvcitgofcbcaao9R;8kbaiabalcitfgwao;8qbbdnavTmbaiaipblbgraipblzgDpmlvorxmPsCXQL358E8Fgqczp:Segkclp:RepklaaipxbbjZbbjZbbjZbbjZpx;Zl81Z;Zl81Z;Zl81Z;Zl81Zakpxibbbibbbibbbibbbp9qp;6ep;NegkaraDpmbediwDqkzHOAKY8AEgrczp:Reczp:Sep;6ep;MegDaDp;Meakarczp:Sep;6ep;Megxaxp;Meakaqczp:Reczp:Sep;6ep;Megqaqp;Mep;Kep;Kep;Lepxbbbbbbbbbbbbbbbbp:4ep;Jepxb;:FSb;:FSb;:FSb;:FSgkp;Mepxbbn0bbn0bbn0bbn0grp;KepxFFbbFFbbFFbbFFbbgmp9oaxakp;Mearp;Keczp:Rep9qgxaDakp;Mearp;Keamp9oaqakp;Mearp;Keczp:Rep9qgkpmbezHdiOAlvCXorQLgrp5baipblapEb:T:j83ibaiarp5eaipblapEe:T:j83iwaiaxakpmwDKYqk8AExm35Ps8E8Fgkp5baipblapEd:T:j83izaiakp5eaipblapEi:T:j83iKkawaiao;8qbbkk:Pddiue978Jjjjjbc;ab9Rhidnadcd4ae2glc98GgvTmbcbheabhdinadadpbbbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepkbbadczfhdaeclfgeav6mbkkdnavalSmbaialciGgecdtgdVcbc;abad9R;8kbaiabavcdtfgvad;8qbbdnaeTmbaiaipblbgocwp:Recwp:Sep;6eaocep:SepxbbjFbbjFbbjFbbjFp9opxbbjZbbjZbbjZbbjZp:Uep;Mepklbkavaiad;8qbbkk9teiucbcbydj1jjbgeabcifc98GfgbBdj1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaikkkebcjwklz:Dbb";
    var detector = new Uint8Array([
      0,
      97,
      115,
      109,
      1,
      0,
      0,
      0,
      1,
      4,
      1,
      96,
      0,
      0,
      3,
      3,
      2,
      0,
      0,
      5,
      3,
      1,
      0,
      1,
      12,
      1,
      0,
      10,
      22,
      2,
      12,
      0,
      65,
      0,
      65,
      0,
      65,
      0,
      252,
      10,
      0,
      0,
      11,
      7,
      0,
      65,
      0,
      253,
      15,
      26,
      11
    ]);
    var wasmpack = new Uint8Array([
      32,
      0,
      65,
      2,
      1,
      106,
      34,
      33,
      3,
      128,
      11,
      4,
      13,
      64,
      6,
      253,
      10,
      7,
      15,
      116,
      127,
      5,
      8,
      12,
      40,
      16,
      19,
      54,
      20,
      9,
      27,
      255,
      113,
      17,
      42,
      67,
      24,
      23,
      146,
      148,
      18,
      14,
      22,
      45,
      70,
      69,
      56,
      114,
      101,
      21,
      25,
      63,
      75,
      136,
      108,
      28,
      118,
      29,
      73,
      115
    ]);
    if (typeof WebAssembly !== "object") {
      return {
        supported: false
      };
    }
    var wasm = WebAssembly.validate(detector) ? unpack(wasm_simd) : unpack(wasm_base);
    var instance;
    var ready = WebAssembly.instantiate(wasm, {}).then(function(result) {
      instance = result.instance;
      instance.exports.__wasm_call_ctors();
    });
    function unpack(data) {
      var result = new Uint8Array(data.length);
      for (var i = 0; i < data.length; ++i) {
        var ch = data.charCodeAt(i);
        result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
      }
      var write = 0;
      for (var i = 0; i < data.length; ++i) {
        result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
      }
      return result.buffer.slice(0, write);
    }
    function decode(instance2, fun, target, count, size, source, filter) {
      var sbrk = instance2.exports.sbrk;
      var count4 = count + 3 & ~3;
      var tp = sbrk(count4 * size);
      var sp = sbrk(source.length);
      var heap = new Uint8Array(instance2.exports.memory.buffer);
      heap.set(source, sp);
      var res = fun(tp, count, size, sp, source.length);
      if (res == 0 && filter) {
        filter(tp, count4, size);
      }
      target.set(heap.subarray(tp, tp + count * size));
      sbrk(tp - sbrk(0));
      if (res != 0) {
        throw new Error("Malformed buffer data: " + res);
      }
    }
    var filters = {
      NONE: "",
      OCTAHEDRAL: "meshopt_decodeFilterOct",
      QUATERNION: "meshopt_decodeFilterQuat",
      EXPONENTIAL: "meshopt_decodeFilterExp"
    };
    var decoders = {
      ATTRIBUTES: "meshopt_decodeVertexBuffer",
      TRIANGLES: "meshopt_decodeIndexBuffer",
      INDICES: "meshopt_decodeIndexSequence"
    };
    var workers = [];
    var requestId = 0;
    function createWorker(url) {
      var worker = {
        object: new Worker(url),
        pending: 0,
        requests: {}
      };
      worker.object.onmessage = function(event) {
        var data = event.data;
        worker.pending -= data.count;
        worker.requests[data.id][data.action](data.value);
        delete worker.requests[data.id];
      };
      return worker;
    }
    function initWorkers(count) {
      var source = "self.ready = WebAssembly.instantiate(new Uint8Array([" + new Uint8Array(wasm) + "]), {}).then(function(result) { result.instance.exports.__wasm_call_ctors(); return result.instance; });self.onmessage = " + workerProcess.name + ";" + decode.toString() + workerProcess.toString();
      var blob = new Blob([source], { type: "text/javascript" });
      var url = URL.createObjectURL(blob);
      for (var i = workers.length; i < count; ++i) {
        workers[i] = createWorker(url);
      }
      for (var i = count; i < workers.length; ++i) {
        workers[i].object.postMessage({});
      }
      workers.length = count;
      URL.revokeObjectURL(url);
    }
    function decodeWorker(count, size, source, mode, filter) {
      var worker = workers[0];
      for (var i = 1; i < workers.length; ++i) {
        if (workers[i].pending < worker.pending) {
          worker = workers[i];
        }
      }
      return new Promise(function(resolve, reject) {
        var data = new Uint8Array(source);
        var id = ++requestId;
        worker.pending += count;
        worker.requests[id] = { resolve, reject };
        worker.object.postMessage({ id, count, size, source: data, mode, filter }, [data.buffer]);
      });
    }
    function workerProcess(event) {
      var data = event.data;
      if (!data.id) {
        return self.close();
      }
      self.ready.then(function(instance2) {
        try {
          var target = new Uint8Array(data.count * data.size);
          decode(instance2, instance2.exports[data.mode], target, data.count, data.size, data.source, instance2.exports[data.filter]);
          self.postMessage({ id: data.id, count: data.count, action: "resolve", value: target }, [target.buffer]);
        } catch (error) {
          self.postMessage({ id: data.id, count: data.count, action: "reject", value: error });
        }
      });
    }
    return {
      ready,
      supported: true,
      useWorkers: function(count) {
        initWorkers(count);
      },
      decodeVertexBuffer: function(target, count, size, source, filter) {
        decode(instance, instance.exports.meshopt_decodeVertexBuffer, target, count, size, source, instance.exports[filters[filter]]);
      },
      decodeIndexBuffer: function(target, count, size, source) {
        decode(instance, instance.exports.meshopt_decodeIndexBuffer, target, count, size, source);
      },
      decodeIndexSequence: function(target, count, size, source) {
        decode(instance, instance.exports.meshopt_decodeIndexSequence, target, count, size, source);
      },
      decodeGltfBuffer: function(target, count, size, source, mode, filter) {
        decode(instance, instance.exports[decoders[mode]], target, count, size, source, instance.exports[filters[filter]]);
      },
      decodeGltfBufferAsync: function(count, size, source, mode, filter) {
        if (workers.length > 0) {
          return decodeWorker(count, size, source, decoders[mode], filters[filter]);
        }
        return ready.then(function() {
          var target = new Uint8Array(count * size);
          decode(instance, instance.exports[decoders[mode]], target, count, size, source, instance.exports[filters[filter]]);
          return target;
        });
      }
    };
  }();

  // node_modules/meshoptimizer/meshopt_simplifier.module.js
  init_define_process_versions();
  var MeshoptSimplifier = function() {
    var wasm = "b9H79Tebbbe9Hk9Geueu9Geub9Gbb9Gsuuuuuuuuuuuu99uueu9Gvuuuuub9Gvuuuuue999Gquuuuuuu99uueu9Gwuuuuuu99ueu9Giuuue999Gluuuueu9GiuuueuizsdilvoirwDbqqbeqlve9Weiiviebeoweuecj:Pdkr:Tewo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bbz9TW79O9V9Wt9F79P9T9W29P9M95bl8E9TW79O9V9Wt9F79P9T9W29P9M959x9Pt9OcttV9P9I91tW7bvQ9TW79O9V9Wt9F79P9T9W29P9M959q9V9P9Ut7boX9TW79O9V9Wt9F79P9T9W29P9M959t9J9H2Wbra9TW79O9V9Wt9F9V9Wt9P9T9P96W9wWVtW94SWt9J9O9sW9T9H9Wbwl79IV9RbDDwebcekdmxq;UMesdbk:kfvKue99euY99Qu8Jjjjjbc;W;qb9Rgs8Kjjjjbcbhzascxfcbc;Kbz:ljjjb8AdnabaeSmbabaeadcdtz:kjjjb8AkdnamcdGTmbalcrfci4gHcbyd;S1jjbHjjjjbbheascxfasyd2gOcdtfaeBdbasaOcefBd2aecbaHz:ljjjbhAcbhlcbhednadTmbcbhlabheadhHinaAaeydbgOci4fgCaCRbbgCceaOcrGgOtV86bbaCcu7aO4ceGalfhlaeclfheaHcufgHmbkcualcdtalcFFFFi0Ehekaecbyd;S1jjbHjjjjbbhzascxfasyd2gecdtfazBdbasaecefBd2alcd4alfhOcehHinaHgecethHaeaO6mbkcbhXcuaecdtgOaecFFFFi0Ecbyd;S1jjbHjjjjbbhHascxfasyd2gCcdtfaHBdbasaCcefBd2aHcFeaOz:ljjjbhQdnadTmbaecufhCcbhLinabaXcdtfgKydbgAc:v;t;h;Ev2hOcbhedndninaQaOaCGgOcdtfgYydbgHcuSmeazaHcdtfydbaASmdaecefgeaOfhOaeaC9nmbxdkkazaLcdtfaABdbaYaLBdbaLhHaLcefhLkaKaHBdbaXcefgXad9hmbkkaQcbyd;O1jjbH:bjjjbbasasyd2cufBd2kcualcefgecdtaecFFFFi0Ecbyd;S1jjbHjjjjbbh8Aascxfasyd2gecdtfa8ABdbasa8ABdlasaecefBd2cuadcitadcFFFFe0Ecbyd;S1jjbHjjjjbbhEascxfasyd2gecdtfaEBdbasaEBdwasaecefBd2asclfabadalcbz:cjjjbcualcdtg3alcFFFFi0Eg5cbyd;S1jjbHjjjjbbhQascxfasyd2gecdtfaQBdbasaecefBd2a5cbyd;S1jjbHjjjjbbh8Eascxfasyd2gecdtfa8EBdbasaecefBd2alcd4alfhOcehHinaHgecethHaeaO6mbkcbhLcuaecdtgOaecFFFFi0Ecbyd;S1jjbHjjjjbbhHascxfasyd2gCcdtfaHBdbasaCcefBd2aHcFeaOz:ljjjbhXdnalTmbavcd4hCaecufhHinaLhednazTmbazaLcdtfydbhekaiaeaC2cdtfgeydlgOcH4aO7c:F:b:DD2aeydbgOcH4aO7c;D;O:B8J27aeydwgecH4ae7c:3F;N8N27aHGheaLcdth8FdndndndndnazTmbaza8FfhKcbhOinaXaecdtfgYydbgAcuSmlaiazaAcdtfydbaC2cdtfaiaKydbaC2cdtfcxz:ojjjbTmiaOcefgOaefaHGheaOaH9nmbxdkkaiaLaC2cdtfhKcbhOinaXaecdtfgYydbgAcuSmiaiaAaC2cdtfaKcxz:ojjjbTmdaOcefgOaefaHGheaOaH9nmbkkcbhYkaYydbgecu9hmekaYaLBdbaLhekaQa8FfaeBdbaLcefgLal9hmbkcbhea8EhHinaHaeBdbaHclfhHalaecefge9hmbkcbheaQhHa8EhOindnaeaHydbgCSmbaOa8EaCcdtfgCydbBdbaCaeBdbkaHclfhHaOclfhOalaecefge9hmbkkcbhaaXcbyd;O1jjbH:bjjjbbasasyd2cufBd2alcbyd;S1jjbHjjjjbbhXascxfasyd2gecdtfaXBdbasaecefBd2a5cbyd;S1jjbHjjjjbbheascxfasyd2gHcdtfaeBdbasaHcefBd2a5cbyd;S1jjbHjjjjbbhHascxfasyd2gOcdtfaHBdbasaOcefBd2aecFea3z:ljjjbhhaHcFea3z:ljjjbhgdnalTmbaEcwfh8Jindna8AaagOcefgacdtfydbgCa8AaOcdtgefydbgHSmbaCaH9Rh8FaEaHcitfh3agaefh8KahaefhLcbhAindndna3aAcitfydbgYaO9hmbaLaOBdba8KaOBdbxekdna8AaYcdtg8LfgeclfydbgHaeydbgeSmbaEaecitgCfydbaOSmeaHae9Rh8Maecu7aHfhKa8JaCfhHcbheinaKaeSmeaecefheaHydbhCaHcwfhHaCaO9hmbkaea8M6mekaga8LfgeaOaYaeydbcuSEBdbaLaYaOaLydbcuSEBdbkaAcefgAa8F9hmbkkaaal9hmbkaQhHa8EhOaghCahhAcbheindndnaeaHydbgY9hmbdnaeaOydbgY9hmbaAydbhYdnaCydbgKcu9hmbaYcu9hmbaXaefcb86bbxikaXaefhLdnaeaKSmbaeaYSmbaLce86bbxikaLcl86bbxdkdnaea8EaYcdtgKfydb9hmbdnaCydbgLcuSmbaeaLSmbaAydbg8FcuSmbaea8FSmbagaKfydbg3cuSmba3aYSmbahaKfydbgKcuSmbaKaYSmbdnaQaLcdtfydbgYaQaKcdtfydb9hmbaYaQa8FcdtfydbgKSmbaKaQa3cdtfydb9hmbaXaefcd86bbxlkaXaefcl86bbxikaXaefcl86bbxdkaXaefcl86bbxekaXaefaXaYfRbb86bbkaHclfhHaOclfhOaCclfhCaAclfhAalaecefge9hmbkdnaqTmbdndnazTmbazheaQhHalhOindnaqaeydbfRbbTmbaXaHydbfcl86bbkaeclfheaHclfhHaOcufgOmbxdkkaQhealhHindnaqRbbTmbaXaeydbfcl86bbkaqcefhqaeclfheaHcufgHmbkkaQhealhOaXhHindnaXaeydbfRbbcl9hmbaHcl86bbkaeclfheaHcefhHaOcufgOmbkkamceGTmbaXhealhHindnaeRbbce9hmbaecl86bbkaecefheaHcufgHmbkkcualcx2alc;v:Q;v:Qe0Ecbyd;S1jjbHjjjjbbhaascxfasyd2gecdtfaaBdbasaecefBd2aaaialavazz:djjjbh8NdndnaDmbcbhycbh8Jxekcbh8JawhecbhHindnaeIdbJbbbb9ETmbasc;Wbfa8JcdtfaHBdba8Jcefh8JkaeclfheaDaHcefgH9hmbkcua8Jal2gecdtaecFFFFi0Ecbyd;S1jjbHjjjjbbhyascxfasyd2gecdtfayBdbasaecefBd2alTmba8JTmbarcd4hLdnazTmba8JcdthicbhYayhKinaoazaYcdtfydbaL2cdtfhAasc;WbfheaKhHa8JhOinaHaAaeydbcdtgCfIdbawaCfIdbNUdbaeclfheaHclfhHaOcufgOmbkaKaifhKaYcefgYal9hmbxdkka8JcdthicbhYayhKinaoaYaL2cdtfhAasc;WbfheaKhHa8JhOinaHaAaeydbcdtgCfIdbawaCfIdbNUdbaeclfheaHclfhHaOcufgOmbkaKaifhKaYcefgYal9hmbkkcualc8S2gHalc;D;O;f8U0EgCcbyd;S1jjbHjjjjbbheascxfasyd2gOcdtfaeBdbasaOcefBd2aecbaHz:ljjjbhqdndndndna8JTmbaCcbyd;S1jjbHjjjjbbhvascxfasyd2gecdtfavBdbcehOasaecefBd2avcbaHz:ljjjb8Acua8Jal2gecltgHaecFFFFb0Ecbyd;S1jjbHjjjjbbhrascxfasyd2gecdtfarBdbasaecefBd2arcbaHz:ljjjb8AadmexikcbhvadTmecbhrkcbhAabhHindnaaaHclfydbgYcx2fgeIdbaaaHydbgKcx2fgOIdbg8P:tgIaaaHcwfydbgLcx2fgCIdlaOIdlg8R:tg8SNaCIdba8P:tgRaeIdla8R:tg8UN:tg8Va8VNa8UaCIdwaOIdwg8W:tg8XNa8SaeIdwa8W:tg8UN:tg8Sa8SNa8UaRNa8XaIN:tgIaINMM:rgRJbbbb9ETmba8VaR:vh8VaIaR:vhIa8SaR:vh8SkaqaQaKcdtfydbc8S2fgea8SaR:rgRa8SNNg8UaeIdbMUdbaeaIaRaINg8YNg8XaeIdlMUdlaea8VaRa8VNg8ZNg80aeIdwMUdwaea8Ya8SNg8YaeIdxMUdxaea8Za8SNg81aeIdzMUdzaea8ZaINg8ZaeIdCMUdCaea8SaRa8Va8WNa8Sa8PNa8RaINMM:mg8RNg8PNg8SaeIdKMUdKaeaIa8PNgIaeId3MUd3aea8Va8PNg8VaeIdaMUdaaea8Pa8RNg8PaeId8KMUd8KaeaRaeIdyMUdyaqaQaYcdtfydbc8S2fgea8UaeIdbMUdbaea8XaeIdlMUdlaea80aeIdwMUdwaea8YaeIdxMUdxaea81aeIdzMUdzaea8ZaeIdCMUdCaea8SaeIdKMUdKaeaIaeId3MUd3aea8VaeIdaMUdaaea8PaeId8KMUd8KaeaRaeIdyMUdyaqaQaLcdtfydbc8S2fgea8UaeIdbMUdbaea8XaeIdlMUdlaea80aeIdwMUdwaea8YaeIdxMUdxaea81aeIdzMUdzaea8ZaeIdCMUdCaea8SaeIdKMUdKaeaIaeId3MUd3aea8VaeIdaMUdaaea8PaeId8KMUd8KaeaRaeIdyMUdyaHcxfhHaAcifgAad6mbkcbhiabhKinabaicdtfhYcbhHinaXaYaHc:G1jjbfydbcdtfydbgOfRbbhedndnaXaKaHfydbgCfRbbgAc99fcFeGcpe0mbaeceSmbaecd9hmekdnaAcufcFeGce0mbahaCcdtfydbaO9hmekdnaecufcFeGce0mbagaOcdtfydbaC9hmekdnaAcv2aefcj1jjbfRbbTmbaQaOcdtfydbaQaCcdtfydb0mekJbbacJbbacJbbjZaeceSEaAceSEh8ZdnaaaYaHc:K1jjbfydbcdtfydbcx2fgeIdwaaaCcx2fgAIdwg8R:tg8VaaaOcx2fgLIdwa8R:tg8Sa8SNaLIdbaAIdbg8W:tgIaINaLIdlaAIdlg8U:tgRaRNMMg8PNa8Va8SNaeIdba8W:tg80aINaRaeIdla8U:tg8YNMMg8Xa8SN:tg8Va8VNa80a8PNa8XaIN:tg8Sa8SNa8Ya8PNa8XaRN:tgIaINMM:rgRJbbbb9ETmba8VaR:vh8VaIaR:vhIa8SaR:vh8SkaqaQaCcdtfydbc8S2fgea8Sa8Za8P:rNgRa8SNNg8XaeIdbMUdbaeaIaRaINg8ZNg80aeIdlMUdlaea8VaRa8VNg8PNg8YaeIdwMUdwaea8Za8SNg8ZaeIdxMUdxaea8Pa8SNg81aeIdzMUdzaea8PaINgBaeIdCMUdCaea8SaRa8Va8RNa8Sa8WNa8UaINMM:mg8RNg8PNg8SaeIdKMUdKaeaIa8PNgIaeId3MUd3aea8Va8PNg8VaeIdaMUdaaea8Pa8RNg8PaeId8KMUd8KaeaRaeIdyMUdyaqaQaOcdtfydbc8S2fgea8XaeIdbMUdbaea80aeIdlMUdlaea8YaeIdwMUdwaea8ZaeIdxMUdxaea81aeIdzMUdzaeaBaeIdCMUdCaea8SaeIdKMUdKaeaIaeId3MUd3aea8VaeIdaMUdaaea8PaeId8KMUd8KaeaRaeIdyMUdykaHclfgHcx9hmbkaKcxfhKaicifgiad6mbkdna8JTmbcbhKinJbbbbh8WaaabaKcdtfgeclfydbgLcx2fgHIdwaaaeydbgicx2fgOIdwg8Y:tgIaINaHIdbaOIdbg81:tg8Va8VNaHIdlaOIdlgB:tgRaRNMMg8Zaaaecwfydbg8Fcx2fgeIdwa8Y:tg8PNaIaIa8PNa8VaeIdba81:tg8RNaRaeIdlaB:tg8UNMMg8SN:tJbbbbJbbjZa8Za8Pa8PNa8Ra8RNa8Ua8UNMMg80Na8Sa8SN:tg8X:va8XJbbbb9BEg8XNh83a80aINa8Pa8SN:ta8XNhUa8Za8UNaRa8SN:ta8XNh85a80aRNa8Ua8SN:ta8XNh86a8Za8RNa8Va8SN:ta8XNh87a80a8VNa8Ra8SN:ta8XNh88a8Va8UNa8RaRN:tg8Sa8SNaRa8PNa8UaIN:tg8Sa8SNaIa8RNa8Pa8VN:tg8Sa8SNMM:rJbbbZNh8Sayaia8J2g3cdtfhHaya8Fa8J2gwcdtfhOayaLa8J2g8LcdtfhCa8Y:mh89aB:mh8:a81:mhZcbhAa8JhYJbbbbh8UJbbbbh8XJbbbbh8ZJbbbbh80Jbbbbh8YJbbbbh81JbbbbhBJbbbbhnJbbbbhcinasc;WbfaAfgecwfa8SaUaCIdbaHIdbg8P:tgRNa83aOIdba8P:tg8RNMgINUdbaeclfa8Sa86aRNa85a8RNMg8VNUdbaea8Sa88aRNa87a8RNMgRNUdbaecxfa8Sa89aINa8:a8VNa8PaZaRNMMMg8PNUdba8SaIa8VNNa80Mh80a8SaIaRNNa8YMh8Ya8Sa8VaRNNa81Mh81a8Sa8Pa8PNNa8WMh8Wa8SaIa8PNNa8UMh8Ua8Sa8Va8PNNa8XMh8Xa8SaRa8PNNa8ZMh8Za8SaIaINNaBMhBa8Sa8Va8VNNanMhna8SaRaRNNacMhcaHclfhHaCclfhCaOclfhOaAczfhAaYcufgYmbkavaic8S2fgeacaeIdbMUdbaeanaeIdlMUdlaeaBaeIdwMUdwaea81aeIdxMUdxaea8YaeIdzMUdzaea80aeIdCMUdCaea8ZaeIdKMUdKaea8XaeId3MUd3aea8UaeIdaMUdaaea8WaeId8KMUd8Kaea8SaeIdyMUdyavaLc8S2fgeacaeIdbMUdbaeanaeIdlMUdlaeaBaeIdwMUdwaea81aeIdxMUdxaea8YaeIdzMUdzaea80aeIdCMUdCaea8ZaeIdKMUdKaea8XaeId3MUd3aea8UaeIdaMUdaaea8WaeId8KMUd8Kaea8SaeIdyMUdyava8Fc8S2fgeacaeIdbMUdbaeanaeIdlMUdlaeaBaeIdwMUdwaea81aeIdxMUdxaea8YaeIdzMUdzaea80aeIdCMUdCaea8ZaeIdKMUdKaea8XaeId3MUd3aea8UaeIdaMUdaaea8WaeId8KMUd8Kaea8SaeIdyMUdyara3cltfhYcbhHa8JhCinaYaHfgeasc;WbfaHfgOIdbaeIdbMUdbaeclfgAaOclfIdbaAIdbMUdbaecwfgAaOcwfIdbaAIdbMUdbaecxfgeaOcxfIdbaeIdbMUdbaHczfhHaCcufgCmbkara8LcltfhYcbhHa8JhCinaYaHfgeasc;WbfaHfgOIdbaeIdbMUdbaeclfgAaOclfIdbaAIdbMUdbaecwfgAaOcwfIdbaAIdbMUdbaecxfgeaOcxfIdbaeIdbMUdbaHczfhHaCcufgCmbkarawcltfhYcbhHa8JhCinaYaHfgeasc;WbfaHfgOIdbaeIdbMUdbaeclfgAaOclfIdbaAIdbMUdbaecwfgAaOcwfIdbaAIdbMUdbaecxfgeaOcxfIdbaeIdbMUdbaHczfhHaCcufgCmbkaKcifgKad6mbkkcbhOxekcehOcbhrkcbh8FdndnamcwGg9cmbJbbbbh8ZcbhJcbhocbhCxekcbhea5cbyd;S1jjbHjjjjbbhCascxfasyd2gHcdtfaCBdbasaHcefBd2dnalTmbaChHinaHaeBdbaHclfhHalaecefge9hmbkkdnaOmbcbhiinabaicdtfhLcbhKinaQaLaKcdtgec:G1jjbfydbcdtfydbcdtfydbhHdnaCaQaLaefydbcdtfydbgOcdtfgAydbgeaOSmbinaAaCaegOcdtfgYydbgeBdbaYhAaOae9hmbkkdnaCaHcdtfgAydbgeaHSmbinaAaCaegHcdtfgYydbgeBdbaYhAaHae9hmbkkdnaOaHSmbaCaOaHaOaH0EcdtfaOaHaOaH6EBdbkaKcefgKci9hmbkaicifgiad6mbkkcbhJdnalTmbcbhYindnaQaYcdtgefydbaY9hmbaYhHdnaCaefgKydbgeaYSmbaKhOinaOaCaegHcdtfgAydbgeBdbaAhOaHae9hmbkkaKaHBdbkaYcefgYal9hmbkcbheaQhOaChHcbhJindndnaeaOydbgA9hmbdnaeaHydbgA9hmbaHaJBdbaJcefhJxdkaHaCaAcdtfydbBdbxekaHaCaAcdtfydbBdbkaOclfhOaHclfhHalaecefge9hmbkkcuaJcltgeaJcjjjjiGEcbyd;S1jjbHjjjjbbhoascxfasyd2gHcdtfaoBdbasaHcefBd2aocbaez:ljjjbhAdnalTmbaChOaahealhYinaecwfIdbh8SaeclfIdbhIaAaOydbcltfgHaeIdbaHIdbMUdbaHclfgKaIaKIdbMUdbaHcwfgKa8SaKIdbMUdbaHcxfgHaHIdbJbbjZMUdbaOclfhOaecxfheaYcufgYmbkkdnaJTmbaAheaJhHinaecxfgOIdbh8SaOcbBdbaeaeIdbJbbbbJbbjZa8S:va8SJbbbb9BEg8SNUdbaeclfgOa8SaOIdbNUdbaecwfgOa8SaOIdbNUdbaeczfheaHcufgHmbkkdnalTmbaChOaahealhYinaAaOydbcltfgHcxfgKaecwfIdbaHcwfIdb:tg8Sa8SNaeIdbaHIdb:tg8Sa8SNaeclfIdbaHclfIdb:tg8Sa8SNMMg8SaKIdbgIaIa8S9DEUdbaOclfhOaecxfheaYcufgYmbkkdnaJmbcbhJJFFuuh8ZxekaAcxfheaAhHaJhOinaHaeIdbUdbaeczfheaHclfhHaOcufgOmbkJFFuuh8ZaAheaJhHinaeIdbg8Sa8Za8Za8S9EEh8ZaeclfheaHcufgHmbkkasydlh9ednalTmba9eclfhea9eydbhAaXhHalhYcbhOincbaeydbgKaA9RaHRbbcpeGEaOfhOaHcefhHaeclfheaKhAaYcufgYmbkaOce4h8Fkcuada8F9RcifgTcx2aTc;v:Q;v:Qe0Ecbyd;S1jjbHjjjjbbhDascxfasyd2gecdtfaDBdbasaecefBd2cuaTcdtaTcFFFFi0Ecbyd;S1jjbHjjjjbbhSascxfasyd2gecdtfaSBdbasaecefBd2a5cbyd;S1jjbHjjjjbbh8Mascxfasyd2gecdtfa8MBdbasaecefBd2alcbyd;S1jjbHjjjjbbh9hascxfasyd2gecdtfa9hBdbasaecefBd2axaxNa8NJbbjZamclGEg83a83N:vhcJbbbbhndnadak9nmbdnaTci6mba8Jclth9iaDcwfh6JbbbbhBJbbbbhninasclfabadalaQz:cjjjbabh8FcbhEcbh5inaba5cdtfh3cbheindnaQa8FaefydbgOcdtgifydbgYaQa3aec:W1jjbfydbcdtfydbgHcdtgwfydbgKSmbaXaHfRbbgLcv2aXaOfRbbgAfc;a1jjbfRbbg8AaAcv2aLfg8Lc;a1jjbfRbbg8KVcFeGTmbdnaKaY9nmba8Lcj1jjbfRbbcFeGmekaAcufhYdnaAaL9hmbaYcFeGce0mbahaifydbaH9hmekdndnaAclSmbaLcl9hmekdnaYcFeGce0mbahaifydbaH9hmdkaLcufcFeGce0mbagawfydbaO9hmekaDaEcx2fgAaHaOa8KcFeGgYEBdlaAaOaHaYEBdbaAaYa8AGcb9hBdwaEcefhEkaeclfgecx9hmbkdna5cifg5ad9pmba8Fcxfh8FaEcifaT9nmekkaETmdcbhiinJbbbbJbbjZaqaQaDaicx2fgAydlgKaAydbgYaAydwgHEgLcdtfydbc8S2fgeIdyg8S:va8SJbbbb9BEaeIdwaaaYaKaHEg8Fcx2fgHIdwgRNaeIdzaHIdbg8PNaeIdaMg8Sa8SMMaRNaeIdlaHIdlg8RNaeIdCaRNaeId3Mg8Sa8SMMa8RNaeIdba8PNaeIdxa8RNaeIdKMg8Sa8SMMa8PNaeId8KMMM:lNh80JbbbbJbbjZaqaQaYcdtfydbc8S2fgeIdyg8S:va8SJbbbb9BEaeIdwaaaKcx2fgHIdwg8VNaeIdzaHIdbg8WNaeIdaMg8Sa8SMMa8VNaeIdlaHIdlg8UNaeIdCa8VNaeId3Mg8Sa8SMMa8UNaeIdba8WNaeIdxa8UNaeIdKMg8Sa8SMMa8WNaeId8KMMM:lNh8YaAcwfh3aAclfhwdna8JTmbavaYc8S2fgOIdwa8VNaOIdza8WNaOIdaMg8Sa8SMMa8VNaOIdla8UNaOIdCa8VNaOId3Mg8Sa8SMMa8UNaOIdba8WNaOIdxa8UNaOIdKMg8Sa8SMMa8WNaOId8KMMMh8SayaKa8J2cdtfhHaraYa8J2cltfheaOIdyh8Xa8JhOinaHIdbgIaIa8XNaecxfIdba8VaecwfIdbNa8WaeIdbNa8UaeclfIdbNMMMgIaIM:tNa8SMh8SaHclfhHaeczfheaOcufgOmbkavaLc8S2fgOIdwaRNaOIdza8PNaOIdaMgIaIMMaRNaOIdla8RNaOIdCaRNaOId3MgIaIMMa8RNaOIdba8PNaOIdxa8RNaOIdKMgIaIMMa8PNaOId8KMMMhIaya8Fa8J2cdtfhHaraLa8J2cltfheaOIdyh8Wa8JhOinaHIdbg8Va8Va8WNaecxfIdbaRaecwfIdbNa8PaeIdbNa8RaeclfIdbNMMMg8Va8VM:tNaIMhIaHclfhHaeczfheaOcufgOmbka80aI:lMh80a8Ya8S:lMh8YkawaKa8Fa8Ya809FgeEBdbaAaYaLaeEBdba3a8Ya80aeEUdbaicefgiaE9hmbkasc;Wbfcbcj;qbz:ljjjb8Aa6heaEhHinasc;WbfaeydbcA4cF8FGgOcFAaOcFA6EcdtfgOaOydbcefBdbaecxfheaHcufgHmbkcbhecbhHinasc;WbfaefgOydbhAaOaHBdbaAaHfhHaeclfgecj;qb9hmbkcbhea6hHinasc;WbfaHydbcA4cF8FGgOcFAaOcFA6EcdtfgOaOydbgOcefBdbaSaOcdtfaeBdbaHcxfhHaEaecefge9hmbkadak9RgOci9Uh9kdnalTmbcbhea8MhHinaHaeBdbaHclfhHalaecefge9hmbkkcbh0a9hcbalz:ljjjbh9maOcO9Uh9na9kce4h9oasydwh9pcbh8KcbhwdninaDaSawcdtfydbcx2fg3Idwg8Sac9Emea8Ka9k9pmeJFFuuhIdna9oaE9pmbaDaSa9ocdtfydbcx2fIdwJbb;aZNhIkdna8SaI9ETmba8San9ETmba8Ka9n0mdkdna9maQa3ydlgicdtg9qfydbgAfg9rRbba9maQa3ydbgLcdtg9sfydbgHfg9tRbbVmbaXaLfRbbh9udna9eaHcdtfgeclfydbgOaeydbgeSmbaOae9RhKa9paecitfheaaaAcx2fg8Lcwfh5a8Lclfh9vaaaHcx2fg8Acwfh9wa8Aclfh9xcbhHceh8Fdnindna8MaeydbcdtfydbgOaASmba8MaeclfydbcdtfydbgYaASmbaOaYSmbaaaYcx2fgYIdbaaaOcx2fgOIdbg8V:tg8Sa9xIdbaOIdlgR:tg8WNa8AIdba8V:tg8UaYIdlaR:tgIN:tg8Pa8Sa9vIdbaR:tg8XNa8LIdba8V:tg80aIN:tgRNaIa9wIdbaOIdwg8R:tg8YNa8WaYIdwa8R:tg8VN:tg8WaIa5Idba8R:tg81Na8Xa8VN:tgINa8Va8UNa8Ya8SN:tg8Ra8Va80Na81a8SN:tg8SNMMa8Pa8PNa8Wa8WNa8Ra8RNMMaRaRNaIaINa8Sa8SNMMN:rJbbj8:N9FmdkaecwfheaHcefgHaK6h8FaKaH9hmbkka8FceGTmba9ocefh9oxeka3cwfhHdndndndna9uc9:fPdebdkaLheina8MaecdtgefaiBdba8EaefydbgeaL9hmbxikkdnagahaha9sfydbaiSEa8Ea9sfydbgLcdtfydbgecu9hmba8Ea9qfydbheka8Ma9sfaiBdbaehika8MaLcdtfaiBdbka9tce86bba9rce86bbaHIdbg8Sanana8S9DEhna0cefh0cecda9uceSEa8Kfh8KkawcefgwaE9hmbkka0TmddnalTmbcbhKcbhiindna8MaicdtgefydbgOaiSmbaQaOcdtfydbh8FdnaiaQaefydb9hg3mbaqa8Fc8S2fgeaqaic8S2fgHIdbaeIdbMUdbaeaHIdlaeIdlMUdlaeaHIdwaeIdwMUdwaeaHIdxaeIdxMUdxaeaHIdzaeIdzMUdzaeaHIdCaeIdCMUdCaeaHIdKaeIdKMUdKaeaHId3aeId3MUd3aeaHIdaaeIdaMUdaaeaHId8KaeId8KMUd8KaeaHIdyaeIdyMUdyka8JTmbavaOc8S2fgeavaic8S2gwfgHIdbaeIdbMUdbaeaHIdlaeIdlMUdlaeaHIdwaeIdwMUdwaeaHIdxaeIdxMUdxaeaHIdzaeIdzMUdzaeaHIdCaeIdCMUdCaeaHIdKaeIdKMUdKaeaHId3aeId3MUd3aeaHIdaaeIdaMUdaaeaHId8KaeId8KMUd8KaeaHIdyaeIdyMUdya9iaO2hLarhHa8JhAinaHaLfgeaHaKfgOIdbaeIdbMUdbaeclfgYaOclfIdbaYIdbMUdbaecwfgYaOcwfIdbaYIdbMUdbaecxfgeaOcxfIdbaeIdbMUdbaHczfhHaAcufgAmbka3mbJbbbbJbbjZaqawfgeIdyg8S:va8SJbbbb9BEaeIdwaaa8Fcx2fgHIdwg8SNaeIdzaHIdbgINaeIdaMg8Va8VMMa8SNaeIdlaHIdlg8VNaeIdCa8SNaeId3Mg8Sa8SMMa8VNaeIdbaINaeIdxa8VNaeIdKMg8Sa8SMMaINaeId8KMMM:lNg8SaBaBa8S9DEhBkaKa9ifhKaicefgial9hmbkcbhHahheindnaeydbgOcuSmbdnaHa8MaOcdtgAfydbgO9hmbcuhOahaAfydbgAcuSmba8MaAcdtfydbhOkaeaOBdbkaeclfhealaHcefgH9hmbkcbhHagheindnaeydbgOcuSmbdnaHa8MaOcdtgAfydbgO9hmbcuhOagaAfydbgAcuSmba8MaAcdtfydbhOkaeaOBdbkaeclfhealaHcefgH9hmbkkaBana8JEhBcbhYabhecbhKindna8MaeydbcdtfydbgHa8MaeclfydbcdtfydbgOSmbaHa8MaecwfydbcdtfydbgASmbaOaASmbabaYcdtfgLaHBdbaLcwfaABdbaLclfaOBdbaYcifhYkaecxfheaKcifgKad6mbkdndna9cTmbaYak9nmba8ZaB9FTmbcbhdabhecbhHindnaoaCaeydbgOcdtfydbcdtfIdbaB9ETmbabadcdtfgAaOBdbaAclfaeclfydbBdbaAcwfaecwfydbBdbadcifhdkaecxfheaHcifgHaY6mbkJFFuuh8ZaJTmeaoheaJhHJFFuuh8SinaeIdbgIa8Sa8SaI9EEg8Va8SaIaB9EgOEh8Sa8Va8ZaOEh8ZaeclfheaHcufgHmbxdkkaYhdkadak0mbxdkkasclfabadalaQz:cjjjbkdndnadak0mbadhOxekdna9cmbadhOxekdna8Zac9FmbadhOxekina8ZJbb;aZNg8Saca8Sac9DEh8VJbbbbh8SdnaJTmbaoheaJhHinaeIdbgIa8SaIa8V9FEa8SaIa8S9EEh8SaeclfheaHcufgHmbkkcbhOabhecbhHindnaoaCaeydbgAcdtfydbcdtfIdba8V9ETmbabaOcdtfgYaABdbaYclfaeclfydbBdbaYcwfaecwfydbBdbaOcifhOkaecxfheaHcifgHad6mbkJFFuuh8ZdnaJTmbaoheaJhHJFFuuhIinaeIdbgRaIaIaR9EEg8PaIaRa8V9EgAEhIa8Pa8ZaAEh8ZaeclfheaHcufgHmbkkdnaOad9hmbadhOxdka8Sanana8S9DEhnaOak9nmeaOhda8Zac9FmbkkdnamcjjjjlGTmbazmbaOTmbcbhQabheinaXaeydbgAfRbbc3thKaecwfgLydbhHdndnahaAcdtg8FfydbaeclfgiydbgCSmbcbhYagaCcdtfydbaA9hmekcjjjj94hYkaeaKaYVaAVBdbaXaCfRbbc3thKdndnahaCcdtfydbaHSmbcbhYagaHcdtfydbaC9hmekcjjjj94hYkaiaKaYVaCVBdbaXaHfRbbc3thYdndnahaHcdtfydbaASmbcbhCaga8FfydbaH9hmekcjjjj94hCkaLaYaCVaHVBdbaecxfheaQcifgQaO6mbkkdnazTmbaOTmbaOheinabazabydbcdtfydbBdbabclfhbaecufgembkkdnaPTmbaPa83an:rNUdbkasyd2gecdtascxffc98fhHdninaeTmeaHydbcbyd;O1jjbH:bjjjbbaHc98fhHaecufhexbkkasc;W;qbf8KjjjjbaOk;Yieouabydlhvabydbclfcbaicdtz:ljjjbhoadci9UhrdnadTmbdnalTmbaehwadhDinaoalawydbcdtfydbcdtfgqaqydbcefBdbawclfhwaDcufgDmbxdkkaehwadhDinaoawydbcdtfgqaqydbcefBdbawclfhwaDcufgDmbkkdnaiTmbcbhDaohwinawydbhqawaDBdbawclfhwaqaDfhDaicufgimbkkdnadci6mbinaecwfydbhwaeclfydbhDaeydbhidnalTmbalawcdtfydbhwalaDcdtfydbhDalaicdtfydbhikavaoaicdtfgqydbcitfaDBdbavaqydbcitfawBdlaqaqydbcefBdbavaoaDcdtfgqydbcitfawBdbavaqydbcitfaiBdlaqaqydbcefBdbavaoawcdtfgwydbcitfaiBdbavawydbcitfaDBdlawawydbcefBdbaecxfhearcufgrmbkkabydbcbBdbk;Podvuv998Jjjjjbca9RgvcFFF;7rBd3av9cFFF;7;3FF:;Fb83dCavcFFF97Bdzav9cFFF;7FFF:;u83dwdnadTmbaicd4hodnabmbdnalTmbcbhrinaealarcdtfydbao2cdtfhwcbhiinavcCfaifgDawaifIdbgqaDIdbgkakaq9EEUdbavcwfaifgDaqaDIdbgkakaq9DEUdbaiclfgicx9hmbkarcefgrad9hmbxikkaocdthrcbhwincbhiinavcCfaifgDaeaifIdbgqaDIdbgkakaq9EEUdbavcwfaifgDaqaDIdbgkakaq9DEUdbaiclfgicx9hmbkaearfheawcefgwad9hmbxdkkdnalTmbcbhrinabarcx2fgiaealarcdtfydbao2cdtfgwIdbUdbaiawIdlUdlaiawIdwUdwcbhiinavcCfaifgDawaifIdbgqaDIdbgkakaq9EEUdbavcwfaifgDaqaDIdbgkakaq9DEUdbaiclfgicx9hmbkarcefgrad9hmbxdkkaocdthlcbhraehwinabarcx2fgiaearao2cdtfgDIdbUdbaiaDIdlUdlaiaDIdwUdwcbhiinavcCfaifgDawaifIdbgqaDIdbgkakaq9EEUdbavcwfaifgDaqaDIdbgkakaq9DEUdbaiclfgicx9hmbkawalfhwarcefgrad9hmbkkJbbbbavIdwavIdCgk:tgqaqJbbbb9DEgqavIdxavIdKgx:tgmamaq9DEgqavIdzavId3gm:tgPaPaq9DEhPdnabTmbadTmbJbbbbJbbjZaP:vaPJbbbb9BEhqinabaqabIdbak:tNUdbabclfgvaqavIdbax:tNUdbabcwfgvaqavIdbam:tNUdbabcxfhbadcufgdmbkkaPk8MbabaeadaialavcbcbcbcbcbaoarawaDz:bjjjbk8MbabaeadaialavaoarawaDaqakaxamaPz:bjjjbk:nCoDud99rue99lul998Jjjjjbc;Wb9Rgw8KjjjjbdndnarmbcbhDxekawcxfcbc;Kbz:ljjjb8Aawcuadcx2adc;v:Q;v:Qe0Ecbyd;S1jjbHjjjjbbgqBdxawceBd2aqaeadaicbz:djjjb8AawcuadcdtadcFFFFi0Egkcbyd;S1jjbHjjjjbbgxBdzawcdBd2adcd4adfhmceheinaegicetheaiam6mbkcbhPawcuaicdtgsaicFFFFi0Ecbyd;S1jjbHjjjjbbgzBdCawciBd2dndnar:ZgH:rJbbbZMgO:lJbbb9p9DTmbaO:Ohexekcjjjj94hekaicufhAc:bwhmcbhCadhXcbhQinaChLaeamgKcufaeaK9iEaPgDcefaeaD9kEhYdndnadTmbaYcuf:YhOaqhiaxheadhmindndnaiIdbaONJbbbZMg8A:lJbbb9p9DTmba8A:OhCxekcjjjj94hCkaCcCthCdndnaiclfIdbaONJbbbZMg8A:lJbbb9p9DTmba8A:OhExekcjjjj94hEkaEcqtaCVhCdndnaicwfIdbaONJbbbZMg8A:lJbbb9p9DTmba8A:OhExekcjjjj94hEkaeaCaEVBdbaicxfhiaeclfheamcufgmmbkazcFeasz:ljjjbh3cbh5cbh8Eindna3axa8EcdtfydbgCcm4aC7c:v;t;h;Ev2gics4ai7aAGgmcdtfgEydbgecuSmbaeaCSmbcehiina3amaifaAGgmcdtfgEydbgecuSmeaicefhiaeaC9hmbkkaEaCBdba5aecuSfh5a8Ecefg8Ead9hmbxdkkazcFeasz:ljjjb8Acbh5kaDaYa5ar0giEhPaLa5aiEhCdna5arSmbaYaKaiEgmaP9Rcd9imbdndnaQcl0mbdnaX:ZgOaL:Zg8A:taY:Yg8FaD:Y:tgaa8FaK:Y:tgha5:ZggaH:tNNNaOaH:tahNa8Aag:tNa8AaH:taaNagaO:tNM:va8FMJbbbZMgO:lJbbb9p9DTmbaO:Ohexdkcjjjj94hexekaPamfcd9Theka5aXaiEhXaQcefgQcs9hmekkdndnaCmbcihicbhDxekcbhiawakcbyd;S1jjbHjjjjbbg8EBdKawclBd2aPcuf:Yh8AdndnadTmbaqhiaxheadhmindndnaiIdba8ANJbbbZMgO:lJbbb9p9DTmbaO:OhCxekcjjjj94hCkaCcCthCdndnaiclfIdba8ANJbbbZMgO:lJbbb9p9DTmbaO:OhExekcjjjj94hEkaEcqtaCVhCdndnaicwfIdba8ANJbbbZMgO:lJbbb9p9DTmbaO:OhExekcjjjj94hEkaeaCaEVBdbaicxfhiaeclfheamcufgmmbkazcFeasz:ljjjbh3cbhDcbh5inaxa5cdtgYfydbgCcm4aC7c:v;t;h;Ev2gics4ai7hecbhidndnina3aeaAGgmcdtfgEydbgecuSmednaxaecdtgEfydbaCSmbaicefgiamfheaiaA9nmekka8EaEfydbhixekaEa5BdbaDhiaDcefhDka8EaYfaiBdba5cefg5ad9hmbkcuaDc32giaDc;j:KM;jb0EhexekazcFeasz:ljjjb8AcbhDcbhekawaecbyd;S1jjbHjjjjbbgeBd3awcvBd2aecbaiz:ljjjbhEavcd4hxdnadTmbdnalTmbaxcdth3a8EhCalheaqhmadhAinaEaCydbc32fgiamIdbaiIdbMUdbaiamclfIdbaiIdlMUdlaiamcwfIdbaiIdwMUdwaiaeIdbaiIdxMUdxaiaeclfIdbaiIdzMUdzaiaecwfIdbaiIdCMUdCaiaiIdKJbbjZMUdKaCclfhCaea3fheamcxfhmaAcufgAmbxdkka8EhmaqheadhCinaEamydbc32fgiaeIdbaiIdbMUdbaiaeclfIdbaiIdlMUdlaiaecwfIdbaiIdwMUdwaiaiIdxJbbbbMUdxaiaiIdzJbbbbMUdzaiaiIdCJbbbbMUdCaiaiIdKJbbjZMUdKamclfhmaecxfheaCcufgCmbkkdnaDTmbaEhiaDheinaiaiIdbJbbbbJbbjZaicKfIdbgO:vaOJbbbb9BEgONUdbaiclfgmaOamIdbNUdbaicwfgmaOamIdbNUdbaicxfgmaOamIdbNUdbaiczfgmaOamIdbNUdbaicCfgmaOamIdbNUdbaic3fhiaecufgembkkcbhCawcuaDcdtgYaDcFFFFi0Egicbyd;S1jjbHjjjjbbgeBdaawcoBd2awaicbyd;S1jjbHjjjjbbg3Bd8KaecFeaYz:ljjjbh5dnadTmbJbbjZJbbjZa8A:vaPceSEaoNgOaONh8Aaxcdthxalheina8Aaec;C1jjbalEgmIdwaEa8EydbgAc32fgiIdC:tgOaONamIdbaiIdx:tgOaONamIdlaiIdz:tgOaONMMNaqcwfIdbaiIdw:tgOaONaqIdbaiIdb:tgOaONaqclfIdbaiIdl:tgOaONMMMhOdndna5aAcdtgifgmydbcuSmba3aifIdbaO9ETmekamaCBdba3aifaOUdbka8Eclfh8EaeaxfheaqcxfhqadaCcefgC9hmbkkaba5aYz:kjjjb8AcrhikaicdthiinaiTmeaic98fgiawcxffydbcbyd;O1jjbH:bjjjbbxbkkawc;Wbf8KjjjjbaDk:Odieui99iu8Jjjjjbca9RgicFFF;7rBd3ai9cFFF;7;3FF:;Fb83dCaicFFF97Bdzai9cFFF;7FFF:;u83dwdndnaembJbbjFhlJbbjFhvJbbjFhoxekadcd4cdthrcbhwincbhdinaicCfadfgDabadfIdbglaDIdbgvaval9EEUdbaicwfadfgDalaDIdbgvaval9DEUdbadclfgdcx9hmbkabarfhbawcefgwae9hmbkaiIdzaiId3:thoaiIdxaiIdK:thvaiIdwaiIdC:thlkJbbbbalalJbbbb9DEglavaval9DEglaoaoal9DEk9DeeuabcFeaicdtz:ljjjbhlcbhbdnadTmbindnalaeydbcdtfgiydbcu9hmbaiabBdbabcefhbkaeclfheadcufgdmbkkabk9teiucbcbyd;W1jjbgeabcifc98GfgbBd;W1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabk9teiucbcbyd;W1jjbgeabcrfc94GfgbBd;W1jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik9:eiuZbhedndncbyd;W1jjbgdaecztgi9nmbcuheadai9RcFFifcz4nbcuSmekadhekcbabae9Rcifc98Gcbyd;W1jjbfgdBd;W1jjbdnadZbcztge9nmbadae9RcFFifcz4nb8Akk6eiucbhidnadTmbdninabRbbglaeRbbgv9hmeaecefheabcefhbadcufgdmbxdkkalav9Rhikaikk:bedbcjwk9Oeeebeebebbeeebebbbbbebebbbbbbbbbebbbdbbbbbbbebbbebbbdbbbbbbbbbbbeeeeebebbebbebebbbeebbbbbbbbbbbbbbbbbbbbbc;OwkxebbbdbbbjNbb";
    var wasmpack = new Uint8Array([
      32,
      0,
      65,
      2,
      1,
      106,
      34,
      33,
      3,
      128,
      11,
      4,
      13,
      64,
      6,
      253,
      10,
      7,
      15,
      116,
      127,
      5,
      8,
      12,
      40,
      16,
      19,
      54,
      20,
      9,
      27,
      255,
      113,
      17,
      42,
      67,
      24,
      23,
      146,
      148,
      18,
      14,
      22,
      45,
      70,
      69,
      56,
      114,
      101,
      21,
      25,
      63,
      75,
      136,
      108,
      28,
      118,
      29,
      73,
      115
    ]);
    if (typeof WebAssembly !== "object") {
      return {
        supported: false
      };
    }
    var instance;
    var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
      instance = result.instance;
      instance.exports.__wasm_call_ctors();
    });
    function unpack(data) {
      var result = new Uint8Array(data.length);
      for (var i = 0; i < data.length; ++i) {
        var ch = data.charCodeAt(i);
        result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
      }
      var write = 0;
      for (var i = 0; i < data.length; ++i) {
        result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
      }
      return result.buffer.slice(0, write);
    }
    function assert(cond) {
      if (!cond) {
        throw new Error("Assertion failed");
      }
    }
    function bytes(view) {
      return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
    function reorder(fun, indices, vertices) {
      var sbrk = instance.exports.sbrk;
      var ip = sbrk(indices.length * 4);
      var rp = sbrk(vertices * 4);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      var indices8 = bytes(indices);
      heap.set(indices8, ip);
      var unique = fun(rp, ip, indices.length, vertices);
      heap = new Uint8Array(instance.exports.memory.buffer);
      var remap = new Uint32Array(vertices);
      new Uint8Array(remap.buffer).set(heap.subarray(rp, rp + vertices * 4));
      indices8.set(heap.subarray(ip, ip + indices.length * 4));
      sbrk(ip - sbrk(0));
      for (var i = 0; i < indices.length; ++i) indices[i] = remap[indices[i]];
      return [remap, unique];
    }
    function maxindex(source) {
      var result = 0;
      for (var i = 0; i < source.length; ++i) {
        var index = source[i];
        result = result < index ? index : result;
      }
      return result;
    }
    function simplify2(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, target_index_count, target_error, options) {
      var sbrk = instance.exports.sbrk;
      var te = sbrk(4);
      var ti = sbrk(index_count * 4);
      var sp = sbrk(vertex_count * vertex_positions_stride);
      var si = sbrk(index_count * 4);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(vertex_positions), sp);
      heap.set(bytes(indices), si);
      var result = fun(ti, si, index_count, sp, vertex_count, vertex_positions_stride, target_index_count, target_error, options, te);
      heap = new Uint8Array(instance.exports.memory.buffer);
      var target = new Uint32Array(result);
      bytes(target).set(heap.subarray(ti, ti + result * 4));
      var error = new Float32Array(1);
      bytes(error).set(heap.subarray(te, te + 4));
      sbrk(te - sbrk(0));
      return [target, error[0]];
    }
    function simplifyAttr(fun, indices, index_count, vertex_positions, vertex_count, vertex_positions_stride, vertex_attributes, vertex_attributes_stride, attribute_weights, vertex_lock, target_index_count, target_error, options) {
      var sbrk = instance.exports.sbrk;
      var te = sbrk(4);
      var ti = sbrk(index_count * 4);
      var sp = sbrk(vertex_count * vertex_positions_stride);
      var sa = sbrk(vertex_count * vertex_attributes_stride);
      var sw = sbrk(attribute_weights.length * 4);
      var si = sbrk(index_count * 4);
      var vl = vertex_lock ? sbrk(vertex_count) : 0;
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(vertex_positions), sp);
      heap.set(bytes(vertex_attributes), sa);
      heap.set(bytes(attribute_weights), sw);
      heap.set(bytes(indices), si);
      if (vertex_lock) {
        heap.set(bytes(vertex_lock), vl);
      }
      var result = fun(
        ti,
        si,
        index_count,
        sp,
        vertex_count,
        vertex_positions_stride,
        sa,
        vertex_attributes_stride,
        sw,
        attribute_weights.length,
        vl,
        target_index_count,
        target_error,
        options,
        te
      );
      heap = new Uint8Array(instance.exports.memory.buffer);
      var target = new Uint32Array(result);
      bytes(target).set(heap.subarray(ti, ti + result * 4));
      var error = new Float32Array(1);
      bytes(error).set(heap.subarray(te, te + 4));
      sbrk(te - sbrk(0));
      return [target, error[0]];
    }
    function simplifyScale(fun, vertex_positions, vertex_count, vertex_positions_stride) {
      var sbrk = instance.exports.sbrk;
      var sp = sbrk(vertex_count * vertex_positions_stride);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(vertex_positions), sp);
      var result = fun(sp, vertex_count, vertex_positions_stride);
      sbrk(sp - sbrk(0));
      return result;
    }
    function simplifyPoints(fun, vertex_positions, vertex_count, vertex_positions_stride, vertex_colors, vertex_colors_stride, color_weight, target_vertex_count) {
      var sbrk = instance.exports.sbrk;
      var ti = sbrk(target_vertex_count * 4);
      var sp = sbrk(vertex_count * vertex_positions_stride);
      var sc = sbrk(vertex_count * vertex_colors_stride);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(vertex_positions), sp);
      if (vertex_colors) {
        heap.set(bytes(vertex_colors), sc);
      }
      var result = fun(ti, sp, vertex_count, vertex_positions_stride, sc, vertex_colors_stride, color_weight, target_vertex_count);
      heap = new Uint8Array(instance.exports.memory.buffer);
      var target = new Uint32Array(result);
      bytes(target).set(heap.subarray(ti, ti + result * 4));
      sbrk(ti - sbrk(0));
      return target;
    }
    var simplifyOptions = {
      LockBorder: 1,
      Sparse: 2,
      ErrorAbsolute: 4,
      Prune: 8,
      _InternalDebug: 1 << 30
      // internal, don't use!
    };
    return {
      ready,
      supported: true,
      // set this to true to be able to use simplifyPoints and simplifyWithAttributes
      // note that these functions are experimental and may change interface/behavior in a way that will require revising calling code
      useExperimentalFeatures: false,
      compactMesh: function(indices) {
        assert(
          indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
        );
        assert(indices.length % 3 == 0);
        var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
        return reorder(instance.exports.meshopt_optimizeVertexFetchRemap, indices32, maxindex(indices) + 1);
      },
      simplify: function(indices, vertex_positions, vertex_positions_stride, target_index_count, target_error, flags) {
        assert(
          indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
        );
        assert(indices.length % 3 == 0);
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        assert(target_index_count >= 0 && target_index_count <= indices.length);
        assert(target_index_count % 3 == 0);
        assert(target_error >= 0);
        var options = 0;
        for (var i = 0; i < (flags ? flags.length : 0); ++i) {
          assert(flags[i] in simplifyOptions);
          assert(this.useExperimentalFeatures || flags[i] != "Prune");
          options |= simplifyOptions[flags[i]];
        }
        var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
        var result = simplify2(
          instance.exports.meshopt_simplify,
          indices32,
          indices.length,
          vertex_positions,
          vertex_positions.length / vertex_positions_stride,
          vertex_positions_stride * 4,
          target_index_count,
          target_error,
          options
        );
        result[0] = indices instanceof Uint32Array ? result[0] : new indices.constructor(result[0]);
        return result;
      },
      simplifyWithAttributes: function(indices, vertex_positions, vertex_positions_stride, vertex_attributes, vertex_attributes_stride, attribute_weights, vertex_lock, target_index_count, target_error, flags) {
        assert(this.useExperimentalFeatures);
        assert(
          indices instanceof Uint32Array || indices instanceof Int32Array || indices instanceof Uint16Array || indices instanceof Int16Array
        );
        assert(indices.length % 3 == 0);
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        assert(vertex_attributes instanceof Float32Array);
        assert(vertex_attributes.length % vertex_attributes_stride == 0);
        assert(vertex_attributes_stride >= 0);
        assert(vertex_lock == null || vertex_lock instanceof Uint8Array);
        assert(vertex_lock == null || vertex_lock.length == vertex_positions.length / vertex_positions_stride);
        assert(target_index_count >= 0 && target_index_count <= indices.length);
        assert(target_index_count % 3 == 0);
        assert(target_error >= 0);
        assert(Array.isArray(attribute_weights));
        assert(vertex_attributes_stride >= attribute_weights.length);
        assert(attribute_weights.length <= 32);
        for (var i = 0; i < attribute_weights.length; ++i) {
          assert(attribute_weights[i] >= 0);
        }
        var options = 0;
        for (var i = 0; i < (flags ? flags.length : 0); ++i) {
          assert(flags[i] in simplifyOptions);
          options |= simplifyOptions[flags[i]];
        }
        var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
        var result = simplifyAttr(
          instance.exports.meshopt_simplifyWithAttributes,
          indices32,
          indices.length,
          vertex_positions,
          vertex_positions.length / vertex_positions_stride,
          vertex_positions_stride * 4,
          vertex_attributes,
          vertex_attributes_stride * 4,
          new Float32Array(attribute_weights),
          vertex_lock ? new Uint8Array(vertex_lock) : null,
          target_index_count,
          target_error,
          options
        );
        result[0] = indices instanceof Uint32Array ? result[0] : new indices.constructor(result[0]);
        return result;
      },
      getScale: function(vertex_positions, vertex_positions_stride) {
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        return simplifyScale(
          instance.exports.meshopt_simplifyScale,
          vertex_positions,
          vertex_positions.length / vertex_positions_stride,
          vertex_positions_stride * 4
        );
      },
      simplifyPoints: function(vertex_positions, vertex_positions_stride, target_vertex_count, vertex_colors, vertex_colors_stride, color_weight) {
        assert(this.useExperimentalFeatures);
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        assert(target_vertex_count >= 0 && target_vertex_count <= vertex_positions.length / vertex_positions_stride);
        if (vertex_colors) {
          assert(vertex_colors instanceof Float32Array);
          assert(vertex_colors.length % vertex_colors_stride == 0);
          assert(vertex_colors_stride >= 3);
          assert(vertex_positions.length / vertex_positions_stride == vertex_colors.length / vertex_colors_stride);
          return simplifyPoints(
            instance.exports.meshopt_simplifyPoints,
            vertex_positions,
            vertex_positions.length / vertex_positions_stride,
            vertex_positions_stride * 4,
            vertex_colors,
            vertex_colors_stride * 4,
            color_weight,
            target_vertex_count
          );
        } else {
          return simplifyPoints(
            instance.exports.meshopt_simplifyPoints,
            vertex_positions,
            vertex_positions.length / vertex_positions_stride,
            vertex_positions_stride * 4,
            void 0,
            0,
            0,
            target_vertex_count
          );
        }
      }
    };
  }();

  // node_modules/meshoptimizer/meshopt_clusterizer.module.js
  init_define_process_versions();
  var MeshoptClusterizer = function() {
    var wasm = "b9H79Tebbbefx9Geueu9Geub9Gbb9Giuuueu9Gkuuuuuuuuuu99eu9Gvuuuuueu9Gkuuuuuuuuu9999eu9Gruuuuuuub9Gkuuuuuuuuuuueu9Gouuuuuub9Giuuub9GluuuubiOHdilvorwDqrkbiibeilve9Weiiviebeoweuec:q:Odkr:Yewo9TW9T9VV95dbH9F9F939H79T9F9J9H229F9Jt9VV7bb8A9TW79O9V9Wt9F9I919P29K9nW79O2Wt79c9V919U9KbeX9TW79O9V9Wt9F9I919P29K9nW79O2Wt7bd39TW79O9V9Wt9F9J9V9T9W91tWJ2917tWV9c9V919U9K7br39TW79O9V9Wt9F9J9V9T9W91tW9nW79O2Wt9c9V919U9K7bDL9TW79O9V9Wt9F9V9Wt9P9T9P96W9nW79O2Wtbql79IV9RbkDwebcekdsPq;L9kHdbkIbabaec9:fgefcufae9Ugeabci9Uadfcufad9Ugbaeab0Ek:oAlPue99eux998Jjjjjbc:We9Rgk8Kjjjjbakc;mbfcbc;Kbz:njjjb8AakcuaocdtgxaocFFFFi0Egmcbyd:e1jjbHjjjjbbgPBd9makceBd:SeakaPBdnakamcbyd:e1jjbHjjjjbbgsBd9qakcdBd:SeakasBd9eakcualcdtalcFFFFi0Ecbyd:e1jjbHjjjjbbgzBd9uakazBd9iakciBd:SeaPcbaxz:njjjbhHalci9UhOdnalTmbaihPalhAinaHaPydbcdtfgCaCydbcefBdbaPclfhPaAcufgAmbkkdnaoTmbcbhPashAaHhCaohXinaAaPBdbaAclfhAaCydbaPfhPaCclfhCaXcufgXmbkkdnalci6mbcbhPaihAinaAcwfydbhCaAclfydbhXasaAydbcdtfgQaQydbgQcefBdbazaQcdtfaPBdbasaXcdtfgXaXydbgXcefBdbazaXcdtfaPBdbasaCcdtfgCaCydbgCcefBdbazaCcdtfaPBdbaAcxfhAaOaPcefgP9hmbkkdnaoTmbaHhAashPaohCinaPaPydbaAydb9RBdbaAclfhAaPclfhPaCcufgCmbkkakamcbyd:e1jjbHjjjjbbgPBd9yakclBd:SeaPaHaxz:mjjjbhmakaOcbyd:e1jjbHjjjjbbgPBd9CakcvBd:SeaPcbaOz:njjjbhLakcuaOcK2alcjjjjd0Ecbyd:e1jjbHjjjjbbgKBd9GakcoBd:SeJbbbbhYdnalci6g8Ambarcd4hxaihAaKhPaOhrJbbbbhEinavaAclfydbax2cdtfgCIdlh3avaAydbax2cdtfgXIdlhYavaAcwfydbax2cdtfgQIdlh5aCIdwh8EaXIdwh8FaQIdwhaaPaCIdbghaXIdbggMaQIdbg8JMJbbnn:vUdbaPclfaXIdlaCIdlMaQIdlMJbbnn:vUdbaQIdwh8KaCIdwh8LaXIdwh8MaPcxfa3aY:tg3aaa8F:tgaNa5aY:tg5a8Ea8F:tg8EN:tgYJbbbbJbbjZahag:tgha5Na8Jag:tgga3N:tg8Fa8FNaYaYNa8EagNaaahN:tgYaYNMM:rgg:vagJbbbb9BEg3NUdbaPczfaYa3NUdbaPcCfa8Fa3NUdbaPcwfa8Ka8Ma8LMMJbbnn:vUdbaEagMhEaAcxfhAaPcKfhParcufgrmbkaEaO:Z:vJbbbZNhYkakcuaOcdtalcFFFF970Ecbyd:e1jjbHjjjjbbgCBd9KakcrBd:SeaYaD:ZN:rhYdna8AmbcbhPaChAinaAaPBdbaAclfhAaOaPcefgP9hmbkkaYJbbbZNh8MakcuaOcltalcFFFFd0Ecbyd:e1jjbHjjjjbbg8ABd9OakcwBd:Secba8AaKaCaOz:djjjb8Aakaocbyd:e1jjbHjjjjbbgPBd2aPcFeaoz:njjjbhrakc8Wfcwf9cb83ibak9cb83i8WcbhPJbbbbhEJbbbbh5Jbbbbh8EJbbbbhYJbbbbh8FJbbbbhgcbhlinJbbbbh3dnaPTmbJbbjZaP:Z:vh3kaka8Ea3NgaUdaaka5a3NghUd3akaEa3Ng8JUdKJbbbbh3dnagagNaYaYNa8Fa8FNMMg8KJbbbb9BmbJbbjZa8K:r:vh3kakaga3NUd8Saka8Fa3NUdyakaYa3NUd8Kdndndnakyd8WgQakydUgAakcKfaeaiakc;abfaKamara8Maqz:ejjjbgCcuSmbdnaPaD9pmbaAaraiaCcx2fgXydbfRbbcFeSfaraXclfydbfRbbcFeSfaraXcwfydbfRbbcFeSfaw9nmdkaQaAcbaeaiakc;abfaKamara8MJbbbbz:ejjjbgCcu9hmekakaaUdCakahUdzaka8JUdxakcuBdwakcFFF;7rBdla8AcbaKaLakcxfakcwfakclfz:fjjjbakydwgCcuSmekdnakc8WfaiaCcx2fgOydbgPaOclfydbgAaOcwfydbgXarabaeadalawaDz:gjjjbTmbalcefhlJbbbbhEJbbbbh5Jbbbbh8EJbbbbhYJbbbbh8FJbbbbhgkamaPcdtfgPaPydbcufBdbamaAcdtfgPaPydbcufBdbamaXcdtfgPaPydbcufBdbcbhXinazasaOaXcdtfydbcdtgAfydbcdtfgxhPaHaAfgvydbgQhAdnaQTmbdninaPydbaCSmeaPclfhPaAcufgATmdxbkkaPaxaQcdtfc98fydbBdbavavydbcufBdbkaXcefgXci9hmbkaKaCcK2fgPIdbh3aPIdlhaaPIdwhhaPIdxh8JaPIdzh8KaPIdCh8LaLaCfce86bbaga8LMhga8Fa8KMh8FaYa8JMhYa8EahMh8Ea5aaMh5aEa3MhEakyd88hPxekkdnaPTmbdnakyd80gAaPci2fgCciGTmbadaCfcbaPaAcu7fciGcefz:njjjb8AkabalcltfgPak8Pi8W83dbaPcwfakc8Wfcwf8Pib83dbalcefhlkcahPdninaPc98Smeakc;mbfaPfydbcbydj1jjbH:bjjjbbaPc98fhPxbkkakc:Wef8Kjjjjbalk;3vivuv99lu8Jjjjjbca9Rgv8Kjjjjbdndnalcw0mbaiydbhoaeabcitfgralcdtcufBdlaraoBdbdnalcd6mbaiclfhoalcufhwarcxfhrinaoydbhDarcuBdbarc98faDBdbarcwfhraoclfhoawcufgwmbkkalabfhrxekcbhDavczfcwfcbBdbav9cb83izavcwfcbBdbav9cb83ibJbbjZhqJbbjZhkinadaiaDcdtfydbcK2fhwcbhrinavczfarfgoawarfIdbgxaoIdbgm:tgPakNamMgmUdbavarfgoaPaxam:tNaoIdbMUdbarclfgrcx9hmbkJbbjZaqJbbjZMgq:vhkaDcefgDal9hmbkcbhoadcbcecdavIdlgxavIdwgm9GEgravIdbgPam9GEaraPax9GEgscdtgrfhzavczfarfIdbhxaihralhwinaiaocdtfgDydbhHaDarydbgOBdbaraHBdbarclfhraoazaOcK2fIdbax9Dfhoawcufgwmbkaeabcitfhrdndnaocv6mbaoalc98f6mekaraiydbBdbaralcdtcufBdlaiclfhoalcufhwarcxfhrinaoydbhDarcuBdbarc98faDBdbarcwfhraoclfhoawcufgwmbkalabfhrxekaraxUdbaeabcitfgrarydlc98GasVBdlabcefaeadaiaoz:djjjbhwararydlciGawabcu7fcdtVBdlawaeadaiaocdtfalao9Rz:djjjbhrkavcaf8Kjjjjbark;Bloeue99vue99Due99dndnaembcuhkxekJbbjZaq:thxaiabcdtfhmavydbhPavydlhsavydwhzcbhHJFFuuhOcvhbcuhkindnaPamaHcdtfydbcdtgvfydbgATmbazasavfydbcdtfhiindndnawalaiydbgCcx2fgvclfydbgXfRbbcFeSawavydbgQfRbbcFeSfawavcwfydbgLfRbbcFeSfgKmbcbhvxekcehvaraQcdtfydbgYceSmbcehvaraXcdtfydbg8AceSmbcehvaraLcdtfydbgEceSmbdna8AcdSaYcdSfaEcdSfcd6mbaKcefhvxekaKcdfhvkdnavab9kmbdndnadTmbaoaCcK2fgQIdwadIdw:tg3a3NaQIdbadIdb:tg3a3NaQIdladIdl:tg3a3NMM:raD:vaxNJbbjZMJ9VO:d86JbbjZaQIdCadIdCNaQIdxadIdxNaQIdzadIdzNMMaqN:tg3a3J9VO:d869DENh3xekaraQcdtfydbaraXcdtfydbfaraLcdtfydbfc99f:Zh3kaCakavab6a3aO9DVgQEhkavabaQEhba3aOaQEhOkaiclfhiaAcufgAmbkkaHcefgHae9hmbkkakk;bddlue99dndndnabaecitfgrydlgwciGgDci9hmbarclfhqxekinabcbawcd4gwalaDcdtfIdbabaecitfIdb:tgkJbbbb9FEgDaecefgefadaialavaoz:fjjjbak:laoIdb9FTmdabaDaw7aefgecitfgrydlgwciGgDci9hmbkarclfhqkabaecitfhecuhbindnaiaeydbgDfRbbmbadaDcK2fgrIdwalIdw:tgkakNarIdbalIdb:tgkakNarIdlalIdl:tgkakNMM:rgkaoIdb9DTmbaoakUdbavaDBdbaqydbhwkaecwfheabcefgbawcd46mbkkk;yleoudnaladfgkRbbcFeSalaefgxRbbgmcFeSfabydwgPfalaifgsRbbcFeSfaD0abydxaq9pVgzce9hmbavawcltfgmab8Pdb83dbamcwfabcwfgm8Pdb83dbdndnamydbmbcbhqxekcbhDaohminalamabydbcdtfydbfcFe86bbamclfhmaDcefgDabydwgq6mbkkdnabydxglci2gDabydlgmfgPciGTmbaraPfcbalamcu7fciGcefz:njjjb8Aabydxci2hDabydlhmabydwhqkab9cb83dwababydbaqfBdbabaDcifc98GamfBdlaxRbbhmcbhPkdnamcFeGcFe9hmbaxaP86bbababydwgmcefBdwaoabydbcdtfamcdtfaeBdbkdnakRbbcFe9hmbakabydw86bbababydwgmcefBdwaoabydbcdtfamcdtfadBdbkdnasRbbcFe9hmbasabydw86bbababydwgmcefBdwaoabydbcdtfamcdtfaiBdbkarabydlfabydxci2faxRbb86bbarabydlfabydxci2fcefakRbb86bbarabydlfabydxci2fcdfasRbb86bbababydxcefBdxazk;Ckovud99euv99eul998Jjjjjbc:G;ae9Rgo8KjjjjbdndnadTmbavcd4hrcbhwcbhDindnaiaeclfydbar2cdtfgvIdbaiaeydbar2cdtfgqIdbgk:tgxaiaecwfydbar2cdtfgmIdlaqIdlgP:tgsNamIdbak:tgzavIdlaP:tgPN:tgkakNaPamIdwaqIdwgH:tgONasavIdwaH:tgHN:tgPaPNaHazNaOaxN:tgxaxNMM:rgsJbbbb9Bmbaoc:G:qefawcx2fgAakas:vUdwaAaxas:vUdlaAaPas:vUdbaocafawc8K2fgAaq8Pdb83dbaAav8Pdb83dxaAam8Pdb83dKaAcwfaqcwfydbBdbaAcCfavcwfydbBdbaAcafamcwfydbBdbawcefhwkaecxfheaDcifgDad6mbkab9cb83dbabcyf9cb83dbabcaf9cb83dbabcKf9cb83dbabczf9cb83dbabcwf9cb83dbawTmeao9cb83iKao9cb83izaoczfaocafawci2z1jjjbaoIdKhCaoIdChXaoIdzhQao9cb83iwao9cb83ibaoaoc:G:qefawz1jjjbJbbjZhkaoIdwgPJbbbbJbbjZaPaPNaoIdbgPaPNaoIdlgsasNMM:rgx:vaxJbbbb9BEgzNhxasazNhsaPazNhzaoc:G:qefheawhvinaecwfIdbaxNaeIdbazNasaeclfIdbNMMgPakaPak9DEhkaecxfheavcufgvmbkabaCUdwabaXUdlabaQUdbabaoId3UdxdndnakJ;n;m;m899FmbJbbbbhPaoc:G:qefheaocafhvinaCavcwfIdb:taecwfIdbgHNaQavIdb:taeIdbgONaXavclfIdb:taeclfIdbgLNMMaxaHNazaONasaLNMM:vgHaPaHaP9EEhPavc8KfhvaecxfheawcufgwmbkabazUd3abc8KfaxUdbabcafasUdbabcKfaCaxaPN:tUdbabcCfaXasaPN:tUdbabaQazaPN:tUdzabJbbjZakakN:t:rgkUdydndnaxJbbj:;axJbbj:;9GEgPJbbjZaPJbbjZ9FEJbb;:9cNJbbbZJbbb:;axJbbbb9GEMgP:lJbbb9p9DTmbaP:Ohexekcjjjj94hekabc8Ufae86bbdndnasJbbj:;asJbbj:;9GEgPJbbjZaPJbbjZ9FEJbb;:9cNJbbbZJbbb:;asJbbbb9GEMgP:lJbbb9p9DTmbaP:Ohvxekcjjjj94hvkabcRfav86bbdndnazJbbj:;azJbbj:;9GEgPJbbjZaPJbbjZ9FEJbb;:9cNJbbbZJbbb:;azJbbbb9GEMgP:lJbbb9p9DTmbaP:Ohqxekcjjjj94hqkabaq86b8SdndnaecKtcK91:YJbb;:9c:vax:t:lavcKtcK91:YJbb;:9c:vas:t:laqcKtcK91:YJbb;:9c:vaz:t:lakMMMJbb;:9cNJbbjZMgk:lJbbb9p9DTmbak:Ohexekcjjjj94hekaecFbaecFb9iEhexekabcjjj;8iBdycFbhekabae86b8Vxekab9cb83dbabcyf9cb83dbabcaf9cb83dbabcKf9cb83dbabczf9cb83dbabcwf9cb83dbkaoc:G;aef8Kjjjjbk:mvdouq99cbhi8Jjjjjbca9RglczfcwfcbBdbal9cb83izalcwfcbBdbal9cb83ibdnadTmbcbhvinaeaifhocbhrinalczfarfgwavawydbgwaoarfIdbgDaearawcx2ffIdb9DEBdbalarfgwavawydbgwaDaearawcx2ffIdb9EEBdbarclfgrcx9hmbkaicxfhiavcefgvad9hmbkkJbbbbhDcbhrcbhicbhvinaealarfydbcx2fgwIdwaealczfarfydbcx2fgoIdw:tgqaqNawIdbaoIdb:tgqaqNawIdlaoIdl:tgqaqNMMgqaDaqaD9EgwEhDavaiawEhiarclfhravcefgvci9hmbkaealczfaicdtgvfydbcx2fgrIdwaealavfydbcx2fglIdwMJbbbZNhqarIdlalIdlMJbbbZNhkarIdbalIdbMJbbbZNhxaD:rJbbbZNhDdnadTmbindnaecwfIdbgmaq:tgPaPNaeIdbgsax:tgPaPNaeclfIdbgzak:tgPaPNMMgPaDaDN9ETmbaqaDaP:rgH:vJbbbZNJbbbZMgPNamJbbjZaP:tgONMhqakaPNazaONMhkaxaPNasaONMhxaDaHMJbbbZNhDkaecxfheadcufgdmbkkabaDUdxabaqUdwabakUdlabaxUdbkjeeiu8Jjjjjbcj8W9Rgr8Kjjjjbaici2hwdnaiTmbawceawce0EhDarhiinaiaeadRbbcdtfydbBdbadcefhdaiclfhiaDcufgDmbkkabarawaladaoz:hjjjbarcj8Wf8Kjjjjbk:Ylequ8Jjjjjbcjx9Rgl8Kjjjjbcbhvalcjqfcbaiz:njjjb8AdndnadTmbcjehoaehrincuhwarhDcuhqavhkdninawakaoalcjqfaDcefRbbfRbb9RcFeGci6aoalcjqfaDRbbfRbb9RcFeGci6faoalcjqfaDcdfRbbfRbb9RcFeGci6fgxaq9mgmEhwdnammbaxce0mdkaxaqaxaq9kEhqaDcifhDadakcefgk9hmbkkaeawci2fgDcdfRbbhqaDcefRbbhxaDRbbhkaeavci2fgDcifaDawav9Rci2z:qjjjb8Aakalcjqffaocefgo86bbaxalcjqffao86bbaDcdfaq86bbaDcefax86bbaDak86bbaqalcjqffao86bbarcifhravcefgvad9hmbkalcFeaiz:njjjbhoadci2gDceaDce0EhqcbhxindnaoaeRbbgkfgwRbbgDcFe9hmbawax86bbaocjdfaxcdtfabakcdtfydbBdbaxhDaxcefhxkaeaD86bbaecefheaqcufgqmbkaxcdthDxekcbhDkabalcjdfaDz:mjjjb8Aalcjxf8Kjjjjbk9teiucbcbyd11jjbgeabcifc98GfgbBd11jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik;LeeeudndnaeabVciGTmbabhixekdndnadcz9pmbabhixekabhiinaiaeydbBdbaiclfaeclfydbBdbaicwfaecwfydbBdbaicxfaecxfydbBdbaeczfheaiczfhiadc9Wfgdcs0mbkkadcl6mbinaiaeydbBdbaeclfheaiclfhiadc98fgdci0mbkkdnadTmbinaiaeRbb86bbaicefhiaecefheadcufgdmbkkabk;aeedudndnabciGTmbabhixekaecFeGc:b:c:ew2hldndnadcz9pmbabhixekabhiinaialBdbaicxfalBdbaicwfalBdbaiclfalBdbaiczfhiadc9Wfgdcs0mbkkadcl6mbinaialBdbaiclfhiadc98fgdci0mbkkdnadTmbinaiae86bbaicefhiadcufgdmbkkabk9teiucbcbyd11jjbgeabcrfc94GfgbBd11jjbdndnabZbcztgd9nmbcuhiabad9RcFFifcz4nbcuSmekaehikaik9:eiuZbhedndncbyd11jjbgdaecztgi9nmbcuheadai9RcFFifcz4nbcuSmekadhekcbabae9Rcifc98Gcbyd11jjbfgdBd11jjbdnadZbcztge9nmbadae9RcFFifcz4nb8Akk:;Deludndndnadch9pmbabaeSmdaeabadfgi9Rcbadcet9R0mekabaead;8qbbxekaeab7ciGhldndndnabae9pmbdnalTmbadhvabhixikdnabciGmbadhvabhixdkadTmiabaeRbb86bbadcufhvdnabcefgiciGmbaecefhexdkavTmiabaeRbe86beadc9:fhvdnabcdfgiciGmbaecdfhexdkavTmiabaeRbd86bdadc99fhvdnabcifgiciGmbaecifhexdkavTmiabaeRbi86biabclfhiaeclfheadc98fhvxekdnalmbdnaiciGTmbadTmlabadcufgifglaeaifRbb86bbdnalciGmbaihdxekaiTmlabadc9:fgifglaeaifRbb86bbdnalciGmbaihdxekaiTmlabadc99fgifglaeaifRbb86bbdnalciGmbaihdxekaiTmlabadc98fgdfaeadfRbb86bbkadcl6mbdnadc98fgocd4cefciGgiTmbaec98fhlabc98fhvinavadfaladfydbBdbadc98fhdaicufgimbkkaocx6mbaec9Wfhvabc9WfhoinaoadfgicxfavadfglcxfydbBdbaicwfalcwfydbBdbaiclfalclfydbBdbaialydbBdbadc9Wfgdci0mbkkadTmdadhidnadciGglTmbaecufhvabcufhoadhiinaoaifavaifRbb86bbaicufhialcufglmbkkadcl6mdaec98fhlabc98fhvinavaifgecifalaifgdcifRbb86bbaecdfadcdfRbb86bbaecefadcefRbb86bbaeadRbb86bbaic98fgimbxikkavcl6mbdnavc98fglcd4cefcrGgdTmbavadcdt9RhvinaiaeydbBdbaeclfheaiclfhiadcufgdmbkkalc36mbinaiaeydbBdbaiaeydlBdlaiaeydwBdwaiaeydxBdxaiaeydzBdzaiaeydCBdCaiaeydKBdKaiaeyd3Bd3aecafheaicafhiavc9Gfgvci0mbkkavTmbdndnavcrGgdmbavhlxekavc94GhlinaiaeRbb86bbaicefhiaecefheadcufgdmbkkavcw6mbinaiaeRbb86bbaiaeRbe86beaiaeRbd86bdaiaeRbi86biaiaeRbl86blaiaeRbv86bvaiaeRbo86boaiaeRbr86braicwfhiaecwfhealc94fglmbkkabkkAebcjwkxebbbdbbbzNbb";
    var wasmpack = new Uint8Array([
      32,
      0,
      65,
      2,
      1,
      106,
      34,
      33,
      3,
      128,
      11,
      4,
      13,
      64,
      6,
      253,
      10,
      7,
      15,
      116,
      127,
      5,
      8,
      12,
      40,
      16,
      19,
      54,
      20,
      9,
      27,
      255,
      113,
      17,
      42,
      67,
      24,
      23,
      146,
      148,
      18,
      14,
      22,
      45,
      70,
      69,
      56,
      114,
      101,
      21,
      25,
      63,
      75,
      136,
      108,
      28,
      118,
      29,
      73,
      115
    ]);
    if (typeof WebAssembly !== "object") {
      return {
        supported: false
      };
    }
    var instance;
    var ready = WebAssembly.instantiate(unpack(wasm), {}).then(function(result) {
      instance = result.instance;
      instance.exports.__wasm_call_ctors();
    });
    function unpack(data) {
      var result = new Uint8Array(data.length);
      for (var i = 0; i < data.length; ++i) {
        var ch = data.charCodeAt(i);
        result[i] = ch > 96 ? ch - 97 : ch > 64 ? ch - 39 : ch + 4;
      }
      var write = 0;
      for (var i = 0; i < data.length; ++i) {
        result[write++] = result[i] < 60 ? wasmpack[result[i]] : (result[i] - 60) * 64 + result[++i];
      }
      return result.buffer.slice(0, write);
    }
    function assert(cond) {
      if (!cond) {
        throw new Error("Assertion failed");
      }
    }
    function bytes(view) {
      return new Uint8Array(view.buffer, view.byteOffset, view.byteLength);
    }
    var BOUNDS_SIZE = 48;
    var MESHLET_SIZE = 16;
    function extractMeshlet(buffers, index) {
      var vertex_offset = buffers.meshlets[index * 4 + 0];
      var triangle_offset = buffers.meshlets[index * 4 + 1];
      var vertex_count = buffers.meshlets[index * 4 + 2];
      var triangle_count = buffers.meshlets[index * 4 + 3];
      return {
        vertices: buffers.vertices.subarray(vertex_offset, vertex_offset + vertex_count),
        triangles: buffers.triangles.subarray(triangle_offset, triangle_offset + triangle_count * 3)
      };
    }
    function buildMeshlets(indices, vertex_positions, vertex_count, vertex_positions_stride, max_vertices, max_triangles, cone_weight) {
      var sbrk = instance.exports.sbrk;
      var max_meshlets = instance.exports.meshopt_buildMeshletsBound(indices.length, max_vertices, max_triangles);
      var meshletsp = sbrk(max_meshlets * MESHLET_SIZE);
      var meshlet_verticesp = sbrk(max_meshlets * max_vertices * 4);
      var meshlet_trianglesp = sbrk(max_meshlets * max_triangles * 3);
      var indicesp = sbrk(indices.byteLength);
      var verticesp = sbrk(vertex_positions.byteLength);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(indices), indicesp);
      heap.set(bytes(vertex_positions), verticesp);
      var count = instance.exports.meshopt_buildMeshlets(
        meshletsp,
        meshlet_verticesp,
        meshlet_trianglesp,
        indicesp,
        indices.length,
        verticesp,
        vertex_count,
        vertex_positions_stride,
        max_vertices,
        max_triangles,
        cone_weight
      );
      heap = new Uint8Array(instance.exports.memory.buffer);
      var meshletBytes = heap.subarray(meshletsp, meshletsp + count * MESHLET_SIZE);
      var meshlets = new Uint32Array(meshletBytes.buffer, meshletBytes.byteOffset, meshletBytes.byteLength / 4).slice();
      for (var i = 0; i < count; ++i) {
        var vertex_offset = meshlets[i * 4 + 0];
        var triangle_offset = meshlets[i * 4 + 1];
        var vertex_count = meshlets[i * 4 + 2];
        var triangle_count = meshlets[i * 4 + 3];
        instance.exports.meshopt_optimizeMeshlet(
          meshlet_verticesp + vertex_offset * 4,
          meshlet_trianglesp + triangle_offset,
          triangle_count,
          vertex_count
        );
      }
      var last_vertex_offset = meshlets[(count - 1) * 4 + 0];
      var last_triangle_offset = meshlets[(count - 1) * 4 + 1];
      var last_vertex_count = meshlets[(count - 1) * 4 + 2];
      var last_triangle_count = meshlets[(count - 1) * 4 + 3];
      var used_vertices = last_vertex_offset + last_vertex_count;
      var used_triangles = last_triangle_offset + (last_triangle_count * 3 + 3 & ~3);
      var result = {
        meshlets,
        vertices: new Uint32Array(heap.buffer, meshlet_verticesp, used_vertices).slice(),
        triangles: new Uint8Array(heap.buffer, meshlet_trianglesp, used_triangles * 3).slice(),
        meshletCount: count
      };
      sbrk(meshletsp - sbrk(0));
      return result;
    }
    function extractBounds(boundsp) {
      var bounds_floats = new Float32Array(instance.exports.memory.buffer, boundsp, BOUNDS_SIZE / 4);
      return {
        centerX: bounds_floats[0],
        centerY: bounds_floats[1],
        centerZ: bounds_floats[2],
        radius: bounds_floats[3],
        coneApexX: bounds_floats[4],
        coneApexY: bounds_floats[5],
        coneApexZ: bounds_floats[6],
        coneAxisX: bounds_floats[7],
        coneAxisY: bounds_floats[8],
        coneAxisZ: bounds_floats[9],
        coneCutoff: bounds_floats[10]
      };
    }
    function computeMeshletBounds(buffers, vertex_positions, vertex_count, vertex_positions_stride) {
      var sbrk = instance.exports.sbrk;
      var results = [];
      var verticesp = sbrk(vertex_positions.byteLength);
      var meshlet_verticesp = sbrk(buffers.vertices.byteLength);
      var meshlet_trianglesp = sbrk(buffers.triangles.byteLength);
      var resultp = sbrk(BOUNDS_SIZE);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(vertex_positions), verticesp);
      heap.set(bytes(buffers.vertices), meshlet_verticesp);
      heap.set(bytes(buffers.triangles), meshlet_trianglesp);
      for (var i = 0; i < buffers.meshletCount; ++i) {
        var vertex_offset = buffers.meshlets[i * 4 + 0];
        var triangle_offset = buffers.meshlets[i * 4 + 0 + 1];
        var triangle_count = buffers.meshlets[i * 4 + 0 + 3];
        instance.exports.meshopt_computeMeshletBounds(
          resultp,
          meshlet_verticesp + vertex_offset * 4,
          meshlet_trianglesp + triangle_offset,
          triangle_count,
          verticesp,
          vertex_count,
          vertex_positions_stride
        );
        results.push(extractBounds(resultp));
      }
      sbrk(verticesp - sbrk(0));
      return results;
    }
    function computeClusterBounds(indices, vertex_positions, vertex_count, vertex_positions_stride) {
      var sbrk = instance.exports.sbrk;
      var resultp = sbrk(BOUNDS_SIZE);
      var indicesp = sbrk(indices.byteLength);
      var verticesp = sbrk(vertex_positions.byteLength);
      var heap = new Uint8Array(instance.exports.memory.buffer);
      heap.set(bytes(indices), indicesp);
      heap.set(bytes(vertex_positions), verticesp);
      instance.exports.meshopt_computeClusterBounds(resultp, indicesp, indices.length, verticesp, vertex_count, vertex_positions_stride);
      var result = extractBounds(resultp);
      sbrk(resultp - sbrk(0));
      return result;
    }
    return {
      ready,
      supported: true,
      buildMeshlets: function(indices, vertex_positions, vertex_positions_stride, max_vertices, max_triangles, cone_weight) {
        assert(indices.length % 3 == 0);
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        assert(max_vertices <= 255 || max_vertices > 0);
        assert(max_triangles <= 512);
        assert(max_triangles % 4 == 0);
        cone_weight = cone_weight || 0;
        var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
        return buildMeshlets(
          indices32,
          vertex_positions,
          vertex_positions.length / vertex_positions_stride,
          vertex_positions_stride * 4,
          max_vertices,
          max_triangles,
          cone_weight
        );
      },
      computeClusterBounds: function(indices, vertex_positions, vertex_positions_stride) {
        assert(indices.length % 3 == 0);
        assert(indices.length / 3 <= 512);
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        var indices32 = indices.BYTES_PER_ELEMENT == 4 ? indices : new Uint32Array(indices);
        return computeClusterBounds(indices32, vertex_positions, vertex_positions.length / vertex_positions_stride, vertex_positions_stride * 4);
      },
      computeMeshletBounds: function(buffers, vertex_positions, vertex_positions_stride) {
        assert(buffers.meshletCount != 0);
        assert(vertex_positions instanceof Float32Array);
        assert(vertex_positions.length % vertex_positions_stride == 0);
        assert(vertex_positions_stride >= 3);
        return computeMeshletBounds(buffers, vertex_positions, vertex_positions.length / vertex_positions_stride, vertex_positions_stride * 4);
      },
      extractMeshlet: function(buffers, index) {
        assert(index >= 0 && index < buffers.meshletCount);
        return extractMeshlet(buffers, index);
      }
    };
  }();

  // photo-worker-src.js
  var progress = (pct, step, txt) => self.postMessage({ type: "progress", pct, step, txt });
  function countTriangles(doc) {
    let total = 0;
    for (const mesh of doc.getRoot().listMeshes()) {
      for (const prim of mesh.listPrimitives()) {
        const indices = prim.getIndices();
        if (indices) {
          total += indices.getCount() / 3;
        } else {
          const pos = prim.getAttribute("POSITION");
          if (pos) total += pos.getCount() / 3;
        }
      }
    }
    return Math.round(total);
  }
  var LEVEL_TARGETS = {
    conservative: [[1e6, 9e5], [5e5, 7e5], [3e5, 4e5]],
    balanced: [[1e6, 5e5], [5e5, 35e4], [3e5, 25e4]],
    aggressive: [[1e6, 25e4], [5e5, 2e5], [3e5, 15e4]]
  };
  var LEVEL_ERROR = { conservative: 3e-4, balanced: 2e-3, aggressive: 5e-3 };
  function targetRatio(triangles, level) {
    const tiers = LEVEL_TARGETS[level] || LEVEL_TARGETS.balanced;
    for (const [min, target] of tiers) {
      if (triangles > min) return target / triangles;
    }
    return null;
  }
  self.onmessage = async (e) => {
    const { type, buffer, level = "balanced" } = e.data;
    if (type !== "reduce") return;
    try {
      progress(5, "Iniciando simplificaci\xF3n...", "Cargando m\xF3dulo WASM de meshoptimizer");
      await MeshoptSimplifier.ready;
      const io = new WebIO().registerExtensions(ALL_EXTENSIONS);
      progress(15, "Analizando modelo...", "Parseando estructura del GLB");
      const doc = await io.readBinary(new Uint8Array(buffer));
      const triangles = countTriangles(doc);
      const ratio = targetRatio(triangles, level);
      if (ratio === null) {
        progress(
          88,
          "Sin reducci\xF3n necesaria",
          `${(triangles / 1e3).toFixed(0)}k tri\xE1ngulos \u2014 geometr\xEDa ya optimizada`
        );
        const result2 = await io.writeBinary(doc);
        progress(100, "Completado \u2713", "El modelo no requiere reducci\xF3n de pol\xEDgonos");
        self.postMessage({ type: "done", buffer: result2.buffer }, [result2.buffer]);
        return;
      }
      const targetK = Math.round(triangles * ratio / 1e3);
      const geoError = LEVEL_ERROR[level] ?? 2e-3;
      progress(
        30,
        "Soldando v\xE9rtices...",
        `${(triangles / 1e3).toFixed(0)}k tri\xE1ngulos detectados \xB7 preparando malla`
      );
      await doc.transform(weld({ tolerance: 1e-4 }));
      progress(
        52,
        "Reduciendo pol\xEDgonos...",
        `Simplificando a ~${targetK}k tri\xE1ngulos`
      );
      await doc.transform(
        simplify({ simplifier: MeshoptSimplifier, ratio, error: geoError })
      );
      progress(75, "Limpiando geometr\xEDa...", "Eliminando datos no utilizados");
      await doc.transform(prune());
      progress(88, "Serializando GLB...", "Empaquetando modelo reducido");
      const result = await io.writeBinary(doc);
      const finalTriangles = countTriangles(doc);
      progress(
        100,
        "Completado \u2713",
        `${(finalTriangles / 1e3).toFixed(0)}k tri\xE1ngulos (desde ${(triangles / 1e3).toFixed(0)}k)`
      );
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
