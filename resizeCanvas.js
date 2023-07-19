(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.canvasUtils = factory());
  })(this, (function () { 'use strict';


    function resizeCanvas() {
        console.log('resizeCanvas')
    }
  
    var _api = {
        resizeCanvas: resizeCanvas,
    };
    for (var a in _api) {
        if (Object.prototype.hasOwnProperty.call(_api, a)) {
            canvasUtils[a] = _api[a];
        }
    }
    if (typeof window !== 'undefined') {
        var _canvasUtils = window.canvasUtils;
        canvasUtils.noConflict = function (deep) {
            if (deep && window.canvasUtils === canvasUtils) {
            window.canvasUtils = _canvasUtils;
            }
            return canvasUtils;
        };
        window.canvasUtils = canvasUtils;
    }
    
  return resizeCanvas;
  
}));