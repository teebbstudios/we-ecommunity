module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1620713234638, function(require, module, exports) {
var __TEMP__ = require('./src/request');var request = __REQUIRE_DEFAULT__(__TEMP__);
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = request;

}, function(modId) {var map = {"./src/request":1620713234639}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1620713234639, function(require, module, exports) {







var __TEMP__ = require('./class');var Request = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./helpers/util');var util = __REQUIRE_WILDCARD__(__TEMP__);
var __TEMP__ = require('./defaults');var defaults = __REQUIRE_DEFAULT__(__TEMP__);


function createInstance(config) {
    let context = new Request(config);
    let instance = util.bind( Request.prototype.request , context );
    util.extend( instance , Request.prototype , context );
    util.extend( instance , context );
    return instance;
}

let request = createInstance(defaults);


// 用于创建多个实例
request.create = function (config) {
    return createInstance(util.merge(defaults, config));
};

// 并发请求数据处理
request.spread = function (callback){
    return function (...arg) {
        return callback.apply(null , [...arg] );
    };
};


if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = request; 



}, function(modId) { var map = {"./class":1620713234640,"./helpers/util":1620713234641,"./defaults":1620713234644}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1620713234640, function(require, module, exports) {
var __TEMP__ = require('./helpers/util');var util = __REQUIRE_WILDCARD__(__TEMP__);
var __TEMP__ = require('./InterceptorManager');var InterceptorManager = __REQUIRE_DEFAULT__(__TEMP__);
var __TEMP__ = require('./core/dispatchRequest');var dispatchRequest = __TEMP__['dispatchRequest'];

class Request {
    constructor( config ){
        this.defaults = config;
        this.interceptors = {
            request: new InterceptorManager(),
            response: new InterceptorManager()
        };
    }
    request( config ){
        if( typeof config === "string"){
            config = util.merge({url: arguments[0]}, arguments[1]);
        }

        config = util.deepMerge(this.defaults , config );
        config.method = config.method ? config.method.toLowerCase() : "get" ;

        let chain = [dispatchRequest, undefined];
        let promise = Promise.resolve( config );

        this.interceptors.request.forEach(function(interceptor) {
            chain.unshift(interceptor.fulfilled, interceptor.rejected);
        });

        this.interceptors.response.forEach(function(interceptor) {
            chain.push(interceptor.fulfilled, interceptor.rejected);
        });

        while (chain.length) {
            promise = promise.then(chain.shift(), chain.shift());
        }

        return promise;
    }
    all (promises){
        return Promise.all(promises);
    }
}

["delete", "get", "head", "options", "trace"].forEach(method => {
    Request.prototype[method] = function ( url,config ) {
        return this.request( util.merge(config || {} ,{
            method,
            url
        }) );
    };
});

["post", "put", "patch" ].forEach(method => {
    Request.prototype[method] = function ( url, data, config ) {
        return this.request( util.merge(config || {} ,{
            method,
            url,
            data
        }) );
    };
});

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = Request;

}, function(modId) { var map = {"./helpers/util":1620713234641,"./InterceptorManager":1620713234642,"./core/dispatchRequest":1620713234643}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1620713234641, function(require, module, exports) {
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var bind = exports.bind = function(fn,thisArg){
    return function warp(){
        return fn.apply(thisArg , Array.from(arguments) );
    };
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var extend = exports.extend = function (a,b, thisArg) {
    let o = Object.getOwnPropertyNames( b );
    o.forEach(attr => {
        if(thisArg && typeof b[attr] === "function" ){
            a[attr] = bind( b[attr] , thisArg );
        }else{
            a[attr] = b[attr];
        }
    });
    return a;
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var copyobj = exports.copyobj = function( a, b ){
    return Object.assign( {} , a ,b );
};


if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var merge = exports.merge = function(){
    var result = {};
    Array.from(arguments).forEach( e =>{
        for(let key in e){
            if( e[key] && typeof e[key] === "object" && !isEmptyObject(e[key]) ){
                merge( result[key] , e[key] );
            }
            result[key] = e[key];
        }
    });
    return result;
};



if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var deepMerge = exports.deepMerge = function () {
    let result = {};
    Array.from(arguments).forEach(e =>{
        if( e && typeof e === "object" && !isEmptyObject(e) ) {
            Object.keys(e).forEach( key => {
                if( e[key] && typeof e[key] === "object"){
                    result[key] = deepMerge( result[key] , e[key] );
                }
                result[key] = e[key];
            });
        }
    });
    return result ;
};


if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var isEmptyObject = exports.isEmptyObject = obj => {
    return Object.getOwnPropertyNames(obj).length === 0;
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var isObject = exports.isObject = obj => {
    return obj !== null && typeof obj === "object";
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var combineURLs = exports.combineURLs = function (baseURL, relativeURL) {
    return relativeURL
        ? baseURL.replace(/\/+$/, "") + "/" + relativeURL.replace(/^\/+/, "")
        : baseURL;
};



function encode(val) {
    return encodeURIComponent(val).
        replace(/%40/gi, "@").
        replace(/%3A/gi, ":").
        replace(/%24/g, "$").
        replace(/%2C/gi, ",").
        replace(/%20/g, "+").
        replace(/%5B/gi, "[").
        replace(/%5D/gi, "]");
}
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var buildURL = exports.buildURL = function ( url , paramsObject ){
    if( !paramsObject || isEmptyObject(paramsObject) ) return url;
    let parts = [];
    Object.keys( paramsObject ).forEach(key =>{
        parts.push( encode(key) + "=" + encode( paramsObject[key] ) );
    });
    return url += ( url.indexOf("?") === -1 ? "?" : "&" ) + parts.join("&");
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var isAbsoluteURL = exports.isAbsoluteURL = function (url) {
    return /^([a-z][a-z\d+\-.]*:)?\/\//i.test(url);
};

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var buildData = exports.buildData = data => {
    if( !isObject(data) || isEmptyObject(data) ) return {};
    const result = {};
    Object.keys(data).forEach( key => {
        if (data[key] !== null && typeof data[key] !== "undefined") {
            result[key] = data[key];
        }
    });
    return result;
};

}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1620713234642, function(require, module, exports) {
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });class InterceptorManager{
    constructor(){
        this.handlers = [];
    }

    use(fulfilled, rejected){
        this.handlers.push({
            fulfilled,
            rejected
        });
        return this.handlers.length - 1;
    }

    eject(id){
        if( this.handlers[id] ){
            this.handlers[id] = null;
        }
    }

    forEach(fn){
        this.handlers.forEach(e =>{
            if(e !== null ){
                fn(e);
            }
        });
    }
};exports.default = InterceptorManager


}, function(modId) { var map = {}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1620713234643, function(require, module, exports) {
var __TEMP__ = require('../helpers/util');var util = __REQUIRE_WILDCARD__(__TEMP__);
if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });var dispatchRequest = exports.dispatchRequest = function (config) {

    if (config.baseURL && !util.isAbsoluteURL(config.url)) {
        config.url = util.combineURLs(config.baseURL, config.url);
    }

    config.url = util.buildURL( config.url , config.params );

    config.data = util.merge(
        config.data ,
        config.transformRequest(config.data)
    );

    config.headers = util.merge(
        config.headers.common || {},
        config.headers[config.method] || {},
        config.headers || {},
    );

    let methods = ["delete", "get", "head", "post", "put", "patch", "common"];
    methods.forEach(method => {
        delete config.headers[method];
    });

    let promise = Promise.resolve( config );
    promise = promise.then( config => {
        return new Promise(function(resolve, reject) {
            let requestTask =  wx.request({
                url : config.url ,
                data : util.buildData(config.data),
                header : config.headers,
                method : config.method,
                dataType : config.dataType,
                success : function (res) {
                    resolve({
                        data : res.data ,
                        headers : res.header,
                        status : res.statusCode,
                        statusText : "ok"
                    });
                },
                fail : function (err) {
                    reject(err);
                },
                complete :  function () {
                    config.complete && config.complete();
                }
            });

            if( config.timeout && typeof config.timeout === "number" && config.timeout > 1000 ){
                setTimeout(() =>{
                    requestTask.abort();
                    resolve({
                        status : "canceled"
                    });
                },config.timeout);
            }
        });
    });

    return promise;
};


}, function(modId) { var map = {"../helpers/util":1620713234641}; return __REQUIRE__(map[modId], modId); })
__DEFINE__(1620713234644, function(require, module, exports) {


var __TEMP__ = require('./helpers/util');var util = __REQUIRE_WILDCARD__(__TEMP__);

let DEFAULT_CONTENT_TYPE = {
    "Content-Type": "application/x-www-form-urlencoded"
};

var defaults = {
    method: "get", // default
    // baseURL: '',
    dataType : "json",
    responseType : "text",
    // timeout: 0,
    headers: {},

    // params : {},

    transformRequest (data) {
        return data;
    },

    // transformResponse (data) {
    //     return data;
    // },

    // validateStatus ( status ) {
    //     return status >= 200 && status < 300
    // }

};

defaults.headers = {
    common: {
        "Accept": "application/json, text/plain, */*"
    }
};

["delete","get", "head","post", "put", "patch"].map(e => {
    defaults.headers[e] = util.merge( defaults.headers , DEFAULT_CONTENT_TYPE);
});


if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });exports.default = defaults;

}, function(modId) { var map = {"./helpers/util":1620713234641}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1620713234638);
})()
//miniprogram-npm-outsideDeps=[]
//# sourceMappingURL=index.js.map