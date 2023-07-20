(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.youtubeUtils = factory());
  })(this, (function () { 'use strict';

    /**
     * Get videoId from url
     * @param {string} url 
     * @returns videoId
     */
    function parserVideoId(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        var match = url.match(regExp)
        return (match&&match[7].length==11)? match[7] : false
    }

    /**
     * USE THUMBNAIL CAPTURE
     * if (document.body) {
     *      const video = document.querySelector('video');
     *      const getBoundingClientRectVideo = video.getBoundingClientRect()
     *      const btnCapture = document.querySelector('#download-link');
     *      btnCapture.style.top = getBoundingClientRectVideo.top + 'px'
     *      btnCapture.style.left = getBoundingClientRectVideo.right - btnCapture.clientWidth - (getBoundingClientRectVideo.x / 2) + 2 + 'px'
     *      btnCapture.addEventListener('click', () => thumbnailCapture())
     *   }
     * @returns string data:image/base64
     */
    // Generate thumbnail from the video
    async function thumbnailCapture(canvasId, blockBodyId) {
        const video = document.querySelector('video');
        if (!canvasId) throw console.error('canvasId is required');
        const canvas = document.getElementById(canvasId);
        let blockBody;
        if (blockBodyId) {
            blockBody = document.getElementById(blockBodyId);
            // blockBody.style.display = 'block'

            if (anime) {
                anime.timeline()
                   .add({
                       targets: blockBody,
                       opacity: [0,1],
                       easing: "linear",
                       duration: 100,
                       delay: 0,
                       begin: function() {
                         document.getElementById(blockBodyId).style.display = 'block';
                       },
                   })
                   .add({
                       targets: blockBody,
                       opacity: [1,0],
                       easing: "linear",
                       duration: 500,
                       delay: 700,
                       complete: function() {
                         document.getElementById(blockBodyId).style.display = 'none';
                       },
                   })
            }
        }
        // canvas.style.opacity = 1;
        // canvas.style.display = 'block';

        // Draw the thumbnailz
        const previousCurrentTime = video.currentTime
        let imageUrl = ''
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        // video.currentTime = 10; // video.duration * 0.25; = 1/4 video

        const canvasCtx = canvas.getContext("2d")
        if (canvasUtils) {
            const { xOffset, yOffset, newWidth, newHeight } = canvasUtils.resizeCanvas(video, canvas);
            canvasCtx.drawImage(video, xOffset, yOffset, newWidth, newHeight);
        } else {
            canvas.width = video.width
            canvas.height = video.height
            canvasCtx.drawImage(video, 0, 0, video.width, video.height);
        }

        imageUrl = canvas.toDataURL("image/png");
        setTimeout(() => {
            // video.pause()
            // console.log('imageUrl', imageUrl)

            /*
            // Show data:image blob in new tab
            var w = window.open("about:blank");
            setTimeout(() => {
                w.document.body.appendChild(w.document.createElement('iframe')).src = imageUrl;
                w.document.body.style.margin = 0;
                w.document.getElementsByTagName("iframe")[0].style.width = '100%';
                w.document.getElementsByTagName("iframe")[0].style.height = '100%';
                w.document.getElementsByTagName("iframe")[0].style.border = 0;
            }, 0);
            */
        }, 500);
        // HOw declenche manual ????
        if (anime) {
            anime.timeline()
            .add({
                targets: canvas,
                translateX: [270, -270],
                opacity: [0,1],
                easing: "linear",
                duration: 300,
                delay: 700 // 200 + 30
            })
            .add({
                targets: canvas,
                translateX: [-270, 270],
                opacity: [1,0],
                easing: "linear",
                duration: 1000,
                delay: 1500 // 200 + 30
            })
        }

        // Reset previous video options
        setTimeout(() => {
            // video.currentTime = previousCurrentTime;
            if (blockBodyId) {
                // blockBody.style.display = 'none'
            }
            // video.play()
        }, 700);

        return imageUrl;
    }

    function youtubeUtils() {
        console.log('||--- INIT YOUTUBE UTILS ---||')
        _downKeys = [];
    }
  
    var _api = {
        parserVideoId: parserVideoId,
        thumbnailCapture: thumbnailCapture,
    };
    for (var a in _api) {
        if (Object.prototype.hasOwnProperty.call(_api, a)) {
            youtubeUtils[a] = _api[a];
        }
    }
    if (typeof window !== 'undefined') {
        var _youtubeUtils = window.youtubeUtils;
        youtubeUtils.noConflict = function (deep) {
            if (deep && window.youtubeUtils === youtubeUtils) {
            window.youtubeUtils = _youtubeUtils;
            }
            return youtubeUtils;
        };
        window.youtubeUtils = youtubeUtils;
    }
    
  return youtubeUtils;
  
}));