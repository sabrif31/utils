(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.canvasUtils = factory());
  })(this, (function () { 'use strict';

    var _downKeys = []; // 记录摁下的绑定键
    var winListendFocus = false; // window是否已经监听了focus事件
    var _scope = 'all'; // 默认热键范围
    var elementHasBindEvent = []; // 已绑定事件的节点记录

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

    function getKeys(key) {
        if (typeof key !== 'string') key = '';
        key = key.replace(/\s/g, '');
        var keys = key.split(',');
        var index = keys.lastIndexOf('');
    
        for (; index >= 0;) {
          keys[index - 1] += ',';
          keys.splice(index, 1);
          index = keys.lastIndexOf('');
        }
        return keys;
      }

    function canvasUtils() {
        console.log('INIT')
        _downKeys = [];
        var keys = getKeys(key);
        var mods = [];
        var scope = 'all';
        var element = document;
        var i = 0;
        var keyup = false;
        var keydown = true;
        var splitKey = '+';
        var capture = false;
        console.log('keys', keys)
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