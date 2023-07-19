(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.canvasUtils = factory());
  })(this, (function () { 'use strict';

    var _downKeys = [];

    /**
    * USE RESIZE CANVAS
    * <canvas id="my-canvas" width="480" height="270" />
    * const canvasCtx = canvas.getContext("2d")
    * const { xOffset, yOffset, newWidth, newHeight } = resizeCanvas(video, canvas);
    * canvasCtx.drawImage(video, xOffset, yOffset, newWidth, newHeight);
    */
    function resizeCanvas(srcNode, canvasNode) {
        var wrh = srcNode.width / srcNode.height;
        var newWidth = canvasNode.width;
        var newHeight = newWidth / wrh;
        if (newHeight > canvasNode.height) {
            newHeight = canvasNode.height;
            newWidth = newHeight * wrh;
        }
        var xOffset = newWidth < canvasNode.width ? ((canvasNode.width - newWidth) / 2) : 0;
        var yOffset = newHeight < canvasNode.height ? ((canvasNode.height - newHeight) / 2) : 0;

        return {
            xOffset,
            yOffset,
            newWidth,
            newHeight
        }
    }

    function canvasUtils() {
        console.log('||--- INIT CANVAS UTILS ---||')
        _downKeys = [];
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
    
  return canvasUtils;
  
}));