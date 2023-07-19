// ==UserScript==
// @name         Youtube Bookmark V0.6.1
// @namespace    http://tampermonkey.net/
// @version      0.5
// @description  Bookmark youtube video
// @author       Florin Sabri
// @match        https://www.youtube.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @resource     ICONOIR_CSS https://cdnjs.cloudflare.com/ajax/libs/iconoir/4.5/css/iconoir.min.css
// @resource     SIDEBAR_CSS https://sabrif31.github.io/utils/sidebar-navigation.css
// @require      https://unpkg.com/hotkeys-js/dist/hotkeys.min.js
// @require      https://cdnjs.cloudflare.com/ajax/libs/animejs/3.2.1/anime.min.js
// @resource     injectionSidebarJS https://sabrif31.github.io/utils/sidebar-navigation.js
// @grant        GM_getResourceText
// @grant        GM_addStyle
// @grant        GM_openInTab
// @grant        GM_registerMenuCommand
// @grant        GM_xmlhttpRequest
// ==/UserScript==

/*
{
  [YoutubeID]: {
   title: 'Title Video',
   bookmark: [{
     name: 'Test1',
     secs: '3600'
   }]
  }
}

*/
(async function() {
    'use strict';

/*
// @resource     injectionJS1 https://sabrif31.github.io/utils/animated-header-navigation-menu.js
// @resource     ANIMATED_HEADER_CSS https://sabrif31.github.io/utils/animated-header-navigation-menu.css

// @exclude      /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @resource     ANIMATED_HEADER_CSS https://sabrif31.github.io/utils/animated-header-navigation-menu.css
// @require      https://sabrif31.github.io/utils/animated-header-navigation-menu.js
// @grant        GM_xmlhttpRequest
// @require      https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.js
// @resource     REMOTE_CSS https://cdn.tailwindcss.com
// @resource     FLOW_CSS https://cdnjs.cloudflare.com/ajax/libs/flowbite/1.7.0/flowbite.min.css

// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM_getValue
// @grant        GM_setValue
// @grant        GM_listValues
*/

    /*
    GM.setValue("foo", { name: 'TEST' });
    console.log('getValue', await GM.getValue("foo"));
    console.log('listValues', await GM.listValues());
    console.log('deleteValue', await GM.deleteValue("foo"));
    */

    // EXPORT LOCALSTORAGE
    const exportBookmark = isAll => {
        const localGetItem = localStorage.getItem('youtube-bookmark')
        if (localGetItem) {
            const localStorageData = JSON.parse(localGetItem)
            const youtubeId = youtube_parser(document.location.href)
            // const videoTitle = document.querySelector('#above-the-fold yt-formatted-string').innerText
            var a = document.createElement("a");
            document.body.appendChild(a);
            a.style = "display: none";
            const json = JSON.stringify(isAll ? localStorageData : localStorageData[youtubeId])
            const blob = new Blob([json], {type: "octet/stream"})
            const url = window.URL.createObjectURL(blob);
            a.href = url;
            a.download = `YT-Bookmark${isAll ? '-all' : ''}.json`;
            a.click();
            window.URL.revokeObjectURL(url);
        }
    }
    const exportUniq = () => exportBookmark(false)
    const exportAll = () => exportBookmark(true)
    GM_registerMenuCommand("Export video bookmark to JSON", exportUniq);
    GM_registerMenuCommand("Export All video bookmark to JSON", exportAll);
    // END
    // Load remote JS
/*
    GM_xmlhttpRequest({
        method : "GET",
        // from other domain than the @match one (.org / .com):
        url : "https://unpkg.com/hotkeys-js/dist/hotkeys.min.js",
        onload : (ev) =>
        {
            let e = document.createElement('script');
            e.innerText = ev.responseText;
            document.head.appendChild(e);
        }
    });

    GM_xmlhttpRequest({
        method : "GET",
        // from other domain than the @match one (.org / .com):
        url : "https://sabrif31.github.io/utils/animated-header-navigation-menu.js",
        onload : (ev) =>
        {
            let e = document.createElement('script');
            e.innerText = ev.responseText;
            document.head.appendChild(e);
        }
    });
    */
    // Load remote CSS
    // @see https://github.com/Tampermonkey/tampermonkey/issues/835
    /*
    const myCss = GM_getResourceText("REMOTE_CSS");
    GM_addStyle(myCss);
    const myFlowCss = GM_getResourceText("FLOW_CSS");
    GM_addStyle(myFlowCss);
    */

    const isMyScriptInChromeRuntime = () => typeof GM === 'undefined' && typeof ((((window || 0).chrome || 0).runtime || 0).getURL) === 'function';

    function addScript(/** @type {string} */ scriptText) {
        const scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.textContent = scriptText;
        try {
            document.documentElement.appendChild(scriptNode);
        } catch (e) {
            console.log('addScript Error', e)
        }
        return scriptNode;
    }

    function addScriptByURL(/** @type {string} */ scriptURL) {
        const scriptNode = document.createElement('script');
        scriptNode.type = 'text/javascript';
        scriptNode.src = scriptURL;
        try {
            document.documentElement.appendChild(scriptNode);
        } catch (e) {
            console.log('addScriptByURL Error', e)
        }
        return scriptNode;
    }

    function scriptInjector(script_id, url_chrome, response_id) {
        let res = {
            script_id: script_id,
            inject: function () {
                let res = this, script_id = this.script_id;
                if (!document.querySelector(`script#${script_id}`)) {
                    if (res.runtime_url) {
                        addScriptByURL(res.runtime_url).id = script_id;
                    } else {
                        addScript(`${res.injection_script}`).id = script_id;
                    }
                }
            }
        }
        res.script_id = script_id;
        if (isMyScriptInChromeRuntime()) {
            res.runtime_url = window.chrome.runtime.getURL(url_chrome)
        } else {
            res.injection_script = GM_getResourceText(response_id);
        }
        return res;
    }

    const script_inject_js1 = scriptInjector(
        'userscript-bookmark-injection-1',
        'js/animated-header-navigation-menu.js',
        "injectionJS1");

    const script_inject_sidebar = scriptInjector(
        'userscript-bookmark-sidebar',
        'js/sidebar-navigation.js',
        "injectionSidebarJS");

/*
    const myinjectionJShotkeys = GM_getResourceText("injectionJShotkeys");
    GM_addScript(myinjectionJShotkeys);
    const myinjectionJSNav = GM_getResourceText("injectionJS1");
    GM_addStyle(myinjectionJSNav);
*/
    const myIconoirCss = GM_getResourceText("ICONOIR_CSS");
    GM_addStyle(myIconoirCss);
    // const myAnimatedHeaderCss = GM_getResourceText("ANIMATED_HEADER_CSS");
    // GM_addStyle(myAnimatedHeaderCss);
    const mySidebarCss = GM_getResourceText("SIDEBAR_CSS");
    GM_addStyle(mySidebarCss);

    // script_inject_js1.inject();
    script_inject_sidebar.inject();

    GM_addStyle(`
            #bookmark-container {
                display: flex;
                align-items: center;
                justify-content: flex-end;
                flex-direction: row-reverse;
                position: absolute;
                right: 0;
                z-index: 305;
            }
            #bookmark, #bookmark-add-button {
                font-size: 12px;
                height:32px !important;
                display: flex;
                align-items: center;
                justify-content: center;
                background: transparent;
                border: none;
                cursor: pointer;
                transition: 0.1s;
                opacity: 0.7;
                transform: scale(1);
            }
            #bookmark:hover, #bookmark-add-button:hover {
                opacity: 1;
                transform: scale(1.1);
            }

            #bookmark-name {
                font-size: 12px;
                background-color: transparent;
                border: 1px solid #313131;
                border-radius: 5px;
                height: 28px !important;
                display: flex;
                align-items: center;
                justify-content: center;
                outline: none;
                padding-left: 5px;
                color: #c7c7c7;
            }
            #bookmark-form {
                display: flex;
                align-items: center;
                visibility: hidden;
                opacity: 0;
                width: 0;
                transition: visibility 0.25s, opacity 0.25s, width 0.1s;
            }

            #bookmark-add-button[disabled] {
                opacity: 0.2;
            }


            .bookmark-select-menu {
                color: rgb(69, 69, 69) !important;
                background-color: transparent;
                border: 1px solid #2f2f2f;
                border-radius: 5px;
                min-width:135px;
                cursor:pointer;
                height:32px !important;
                font-size: 12px;
                max-width: 135px;
                text-overflow: ellipsis;
                white-space: nowrap;
                text-align: left;
                vertical-align: middle;
            }
            .bookmark-select-menu .bookmark-select-btn {
              display: flex;
              height: 32px;
              font-size: 12px;
              font-weight: 400;
              border-radius: 8px;
              align-items: center;
              cursor: pointer;
              justify-content: space-between;
              box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
              padding-left:5px;
              position: relative;
              color: #c7c7c7;
            }

            .bookmark-select-menu .bookmark-option-text {
                display: flex;
                align-items: center;
                color: #c7c7c7;
            }
            .bookmark-select-menu .bookmark-options .bookmark-option-text svg {
                position: absolute;
                right: 0;
            }
            .bookmark-select-menu .bookmark-option-text svg {
              transform: rotate(0deg);
              transition: 0.3s;
            }
            .bookmark-select-menu.active .bookmark-option-text svg {
              transform: rotate(90deg);
            }
            .bookmark-select-menu .bookmark-options .bookmark-option-text svg path {
                transition: 0.3s;
            }
            .bookmark-select-menu .bookmark-options .bookmark-option-text svg:hover path {
                fill: #ff0000;
                stroke: #ff0000 !important;
                transition: 0.3s;
            }
            .bookmark-select-menu .bookmark-select-btn .bookmark-option-text svg {
              margin-left: 5px;
              transition: transform 0.3s;
              position: absolute;
              right: 0px;
            }

            .bookmark-select-menu .bookmark-options {
              /*overflow-y: auto;*/
              max-height: 295px;
              margin-top: 4px;
              left: -5px;
              /*border-radius: 0 0 8px 8px;*/
              border-radius: 8px;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
              animation-name: fadeInDown;
              -webkit-animation-name: fadeInDown;
              animation-duration: 0.35s;
              animation-fill-mode: both;
              -webkit-animation-duration: 0.35s;
              -webkit-animation-fill-mode: both;
              background-color: #181a1b;
              display: none;
              flex-direction: column;
              position: absolute;
              width: 100%;
            }
            .bookmark-select-menu .bookmark-options .bookmark-option {
              display: flex;
              height: 36px;
              cursor: pointer;
              align-items: center;
              padding-left: 5px;
              border-radius: 8px;
              transition: color 0.3s, background 0.3s;
            }
            .bookmark-select-menu .bookmark-options .bookmark-option:hover {
              background: #1e1e1e;
              color: #252424;
            }

            .bookmark-select-menu .bookmark-options .bookmark-option:hover .bookmark-option-text {
              color: #ffffff;
            }

            .bookmark-select-menu .bookmark-options .bookmark-option i {
              font-size: 25px;
              margin-right: 12px;
            }

            .bookmark-select-menu.active .bookmark-select-btn i {
              transform: rotate(-180deg);
              transition: 0.3s;
            }

            .bookmark-select-menu .bookmark-option-text .selected-text {
              max-width: 110px;
              text-overflow: ellipsis;
              display: block;
              overflow: hidden;
              color: #c7c7c7;
            }

            .bookmark-select-menu.active .bookmark-options {
              display: block;
              opacity: 0;
              z-index: 10;
              animation-name: fadeInUp;
              -webkit-animation-name: fadeInUp;
              animation-duration: 0.4s;
              animation-fill-mode: both;
              -webkit-animation-duration: 0.4s;
              -webkit-animation-fill-mode: both;
              display: flex;
            }

            @keyframes fadeInUp {
              from {
                transform: translate3d(0, 30px, 0);
              }
              to {
                transform: translate3d(0, 0, 0);
                opacity: 1;
              }
            }
            @keyframes fadeInDown {
              from {
                transform: translate3d(0, 0, 0);
                opacity: 1;
              }
              to {
                transform: translate3d(0, 20px, 0);
                opacity: 0;
              }
            }
            .no-cursor {
                 pointer-events: none;
            }

           #download-link {
                background-color: #000000d9;
               border: none;
               padding: 8px;
               border-radius: 0px 0px 5px 5px;
               cursor: pointer;
               color: #c5c5c5;
               position:absolute;
               left: 50%;
               top: 80%;
               z-index: 2023;
               transition: 0.2s;
           }
           #download-link:hover {
               border-radius: 0px 0px 5px 5px;
               cursor: pointer;
               color: #ffffff;
           }
           #capture-video-thumbnail {
               position:fixed;
               top: 0;
               right: -270px;
               transform: translateX(270px);
               z-index: 2024;
               opacity: 0;
               /*transition: 2s;*/
           }
            `);

    const arrowSvg = `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#6f6f6f"><path d="M9 6l6 6-6 6" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
    const cancelSvg = `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#6f6f6f" data-darkreader-inline-color="" style="--darkreader-inline-color: #e8e6e3;"><path d="M6.758 17.243L12.001 12m5.243-5.243L12 12m0 0L6.758 6.757M12.001 12l5.243 5.243" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" data-darkreader-inline-stroke="" style="--darkreader-inline-stroke: #6f6f6f;"></path></svg>`
    const addBookmarkSvg = `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#6f6f6f"><path d="M13 21H3.6a.6.6 0 01-.6-.6V3.6a.6.6 0 01.6-.6h16.8a.6.6 0 01.6.6V13M16 19h3m3 0h-3m0 0v-3m0 3v3" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M9.898 8.513a.6.6 0 00-.898.52v5.933a.6.6 0 00.898.521l5.19-2.966a.6.6 0 000-1.042l-5.19-2.966z" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`
    const bookmarkSvg = `<?xml version="1.0" encoding="UTF-8"?><svg width="24px" height="24px" stroke-width="1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" color="#6f6f6f"><path d="M2 12h3m3 0H5m0 0V9m0 3v3M6.25 6l.245-.28a2 2 0 013.01 0l4.343 4.963a2 2 0 010 2.634L9.505 18.28a2 2 0 01-3.01 0L6.25 18" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M13 19l4.884-5.698a2 2 0 000-2.604L13 5" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path><path d="M17 19l4.884-5.698a2 2 0 000-2.604L17 5" stroke="#6f6f6f" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>`


    /*
  ObserverRegister.uidStore = {}; // backward compatible with FireFox 55.
      const mtoObservationDetails = new ObserverRegister(() => {
    return new IntersectionObserver(ito_details, {
      root: null,
      rootMargin: "0px"
    })
  });
    */


    class VideoPlayer {
        constructor() {
            this.videoPlayer = document.querySelector('.video-stream')

            this.seek = this.seek.bind(this);
            this.getCurrentTime = this.getCurrentTime.bind(this);
        }

        /* Seek to time video */
        seek(secs) {
            if (this.videoPlayer.fastSeek) this.videoPlayer.fastSeek(secs)
            else this.videoPlayer.currentTime = secs
        }

        getCurrentTime() {
            return this.videoPlayer.currentTime
        }
    }

    class DropdownMenu {
        constructor(dropdownButtonSelector, dropdownListSelector, dropdownItemSelector, dropdownItemsUl, videoPlayer) {
            this.dropdownButton = document.querySelector(dropdownButtonSelector);
            this.dropdownList = document.querySelector(dropdownListSelector);
            this.dropdownItems = document.querySelectorAll(dropdownItemSelector);
            this.dropdownItemsUl = document.querySelector(dropdownItemsUl);
            this.boorkmarkForm = document.getElementById('bookmark-form');
            this.videoPlayer = videoPlayer

            this.toggleDropdown = this.toggleDropdown.bind(this);
            this.selectItem = this.selectItem.bind(this);
            this.deleteItem = this.deleteItem.bind(this);
            this.toHHMMSS = this.toHHMMSS.bind(this);

            this.dropdownButton.addEventListener('click', this.toggleDropdown);
            this.dropdownItems.forEach(item => {
                // Select event
                item.addEventListener('click', this.selectItem);
                // Remove event
                const cancelSvgBtn = item.querySelector('svg')
                cancelSvgBtn.addEventListener('click', this.deleteItem);
            });
        }

        toHHMMSS (secs) {
            console.log('secs', secs)
            var sec_num = parseInt(secs, 10); // don't forget the second param
            var hours = Math.floor(sec_num / 3600);
            var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            var seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) {hours = "0"+hours;}
            if (minutes < 10) {minutes = "0"+minutes;}
            if (seconds < 10) {seconds = "0"+seconds;}
            return hours+':'+minutes+':'+seconds;
        }

        addOption(option) {
            const newOption = document.createElement('li');
            newOption.classList.add('bookmark-option')
            newOption.dataset.secs = option.secs
            console.log('this.toHHMMSS(option.secs', this.toHHMMSS(option.secs))

            const span = document.createElement("span")
            span.classList.add('bookmark-option-text')
            span.innerHTML = option.name + cancelSvg // ' ' + this.toHHMMSS(option.secs) + ' ' +

            newOption.append(span)

            const cancelSvgBtn = span.querySelector('svg')
            cancelSvgBtn.addEventListener('click', this.deleteItem);

            newOption.addEventListener('click', this.selectItem);

            this.dropdownItemsUl.appendChild(newOption);
        }

        toggleDropdown() {
            this.dropdownList.classList.toggle('active');
            const hasClassActive = this.dropdownList.classList.contains('active')
            const selectMenuRectoffsetLeft = this.dropdownList.offsetLeft
            let left = (selectMenuRectoffsetLeft/2)
            if (hasClassActive) {
                left = selectMenuRectoffsetLeft - 26
            }
            this.dropdownItemsUl.style.left = left + 'px' // Center dropDown menu
            this.dropdownItemsUl.style.maxWidth = '192px'
        }

        selectItem(event) {
            const selectedItem = event.currentTarget;
            this.dropdownButton.innerHTML = selectedItem.textContent + ' ' + arrowSvg;
            this.dropdownList.classList.remove('active');
            this.videoPlayer.seek(Number(selectedItem.getAttribute('data-secs')))
        }

        async deleteItem(event) {
            event.stopPropagation()
            const selectedItem = event.currentTarget.parentElement.parentElement;
            const localGetItem = localStorage.getItem('youtube-bookmark')
            if (localGetItem) {
                const localStorageData = JSON.parse(localGetItem)
                const youtubeId = youtube_parser(document.location.href)
                if (localStorageData[youtubeId]) {
                    const newLocalStorageDataBookmark = localStorageData[youtubeId].bookmark.filter(item => Number(item.secs) !== Number(selectedItem.getAttribute('data-secs')));
                    await localStorage.setItem('youtube-bookmark', JSON.stringify({ ...localStorageData, [youtubeId]: {
                        ...localStorageData[youtubeId],
                        bookmark: newLocalStorageDataBookmark
                    }}))
                    selectedItem.remove()
                }
            }
        }
    }

    function youtube_parser(url){
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/
        var match = url.match(regExp)
        return (match&&match[7].length==11)? match[7] : false
    }

    /*
    async function process(text) {
        const video = document.querySelector('video');
        const canvas = document.querySelector("#capture-video-thumbnail");
         await new Promise((resolve, reject) => {
             video.addEventListener("loadedmetadata", e => {
                 video.width = video.videoWidth;
                 video.height = video.videoHeight;
                 canvas.width = video.videoWidth;
                 canvas.height = video.videoHeight;
                 // Seek the video to 25%
                 video.currentTime = video.duration * 0.25;
             });
             video.addEventListener("seeked", () => resolve());
         });
        // Draw the thumbnailz
        canvas
            .getContext("2d")
            .drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
    }
    */

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


    document.body.insertAdjacentHTML('beforeend', `<canvas width="480" height="270" id="capture-video-thumbnail" />`);
    document.body.insertAdjacentHTML('beforeend', `<div id="block-body" style='position:absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2025; background-color: rgba(0,0,0,0.5); display: none;' />`);
    document.body.insertAdjacentHTML('beforeend', `<button id='download-link'>Test capture</button>`);

    async function thumbnailCapture() {
        const video = document.querySelector('video');
        const canvas = document.querySelector("#capture-video-thumbnail");
        const blockBody = document.querySelector('#block-body');
        blockBody.style.display = 'block'
        // canvas.style.opacity = 1;
        // canvas.style.display = 'block';

        // Draw the thumbnailz
        const previousCurrentTime = video.currentTime
        let imageUrl = ''
        video.width = video.videoWidth;
        video.height = video.videoHeight;
        video.currentTime = 10; // video.duration * 0.25; = 1/4 video

        setTimeout(() => {
            video.pause()
            const canvasCtx = canvas.getContext("2d")
            const { xOffset, yOffset, newWidth, newHeight } = resizeCanvas(video, canvas);
            canvasCtx.drawImage(video, xOffset, yOffset, newWidth, newHeight);

            imageUrl = canvas.toDataURL("image/png");
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

        // Reset previous video options
        setTimeout(() => {
            video.currentTime = previousCurrentTime;
            blockBody.style.display = 'none'
            video.play()
        }, 700);

        setTimeout(() => {
            // canvas.style.opacity = 0;
        }, 2000);

        setTimeout(() => {
            // canvas.style.display = 'none';
        }, 5000);

        return imageUrl;
    }

    if (document.body) {
        const video = document.querySelector('video');
        const getBoundingClientRectVideo = video.getBoundingClientRect()
        const btnCapture = document.querySelector('#download-link');
        btnCapture.style.top = getBoundingClientRectVideo.top + 'px'
        btnCapture.style.left = getBoundingClientRectVideo.right - btnCapture.clientWidth - (getBoundingClientRectVideo.x / 2) + 2 + 'px'
        btnCapture.addEventListener('click', () => thumbnailCapture())
    } else {
        // document.addEventListener('DOMContentLoaded', process);
    }

    const dropDownSelect = `
       <div class="bookmark-select-menu">
         <div class="bookmark-select-btn">
           <span class="bookmark-option-text"><span class="selected-text">Select a bookmark</span> ${arrowSvg}</span>
           <i class="bx bx-chevron-down"></i>
         </div>

         <ul class="bookmark-options">
         </ul>
       </div>
    `

    let oldHref = document.location.href;
    /****************************************************************
    *****************************************************************
    **************************** INIT *******************************
    *****************************************************************
    *****************************************************************/
    const initBookmarkTimeYT = () => {
        const list = localStorage.getItem('youtube-bookmark')
        if (list) {
            // var btn = new NavHeaderYTBookmark(Object.keys(JSON.parse(list))) // eslint-disable-line
            // btn.addButtonToDOM()
            const isInit = document.querySelector('.sidebar-container')
            if (!isInit) {
                const localData = JSON.parse(list);
                const formatedData = Object.keys(localData).map(ytId => ({
                    id: ytId,
                    title: localData[ytId].title
                }))
                var sidebar = new SideBar(formatedData, anime)
                sidebar.addButtonToDOM()
            }
        }

        const videoHtml5Player = document.querySelector('ytd-player')
        // const videoPlayer = document.querySelector('.video-stream')
        const buttonMenu = document.querySelector('ytd-menu-renderer')
        const emplacementButton = document.querySelector('.efyt-control-bar')

        const bookmarkContainer = document.createElement('div')
        bookmarkContainer.id = 'bookmark-container'
        videoHtml5Player.parentElement.append(bookmarkContainer)

        const selectMenu = document.createElement("div")
        selectMenu.innerHTML = dropDownSelect
        bookmarkContainer.append(selectMenu)

        // Bookmark form
        const bookmarkForm = document.createElement('div')
        bookmarkForm.id = 'bookmark-form'
        bookmarkContainer.append(bookmarkForm)

        /**
        * Init select options with localStorage
        **/
        const localGetItem = localStorage.getItem('youtube-bookmark')
        const ul = document.querySelector('.bookmark-options')

        if (localGetItem) {
            // Load bookmark list for the video
            const localStorageData = JSON.parse(localGetItem)
            const youtubeId = youtube_parser(document.location.href)

            if (localStorageData[youtubeId]) {
                const options = localStorageData[youtubeId]
                if (options.bookmark.length === 0 || options.length === 0) document.querySelector('.bookmark-select-menu').classList.add('no-cursor');
                //Create and append the options
                for (let i = 0; i < options.bookmark.length; i++) {
                    const li = document.createElement("li")
                    li.classList.add('bookmark-option')
                    li.dataset.secs = options.bookmark[i].secs

                    const span = document.createElement("span")
                    span.classList.add('bookmark-option-text')
                    span.innerHTML = options.bookmark[i].name + cancelSvg

                    li.appendChild(span)
                    ul.appendChild(li)
                }
            }
        }
        const videoPlayer = new VideoPlayer()
        const myDropdownMenu = new DropdownMenu('.bookmark-select-btn', '.bookmark-select-menu', '.bookmark-option', '.bookmark-options', videoPlayer);

        // Button show form input
        const bookmarkButton = document.createElement('button')
        bookmarkButton.innerHTML = bookmarkSvg
        bookmarkButton.type = 'button'
        bookmarkButton.id = 'bookmark'
        bookmarkButton.title = 'bookmark'
        bookmarkButton.addEventListener('click', () => {
            document.querySelector('.bookmark-select-menu').classList.remove('active');
            const formBookmarkNode = document.getElementById("bookmark-form")
            if (formBookmarkNode.style.visibility === 'hidden' || formBookmarkNode.style.visibility === '') {
                formBookmarkNode.style.visibility = 'visible'
                formBookmarkNode.style.opacity = 1
                formBookmarkNode.style.width = '191px'

            } else {
                formBookmarkNode.style.visibility = 'hidden'
                formBookmarkNode.style.opacity = 0
                formBookmarkNode.style.width = 0
            }
        })
        bookmarkContainer.append(bookmarkButton)

        // Bookmark input name
        const bookmarkInput = document.createElement('input')
        bookmarkInput.id = 'bookmark-name'
        bookmarkInput.placeholder = 'Bookmark name'
        bookmarkInput.addEventListener('keyup', e => {
            const addBmBtn = document.getElementById("bookmark-add-button")
            addBmBtn.disabled = e.target.value === ''
        })
        bookmarkForm.append(bookmarkInput)

        // Create add button
        const addBookmarkButton = document.createElement('button')
        addBookmarkButton.innerHTML = addBookmarkSvg
        addBookmarkButton.id = 'bookmark-add-button'
        addBookmarkButton.disabled = 'true'
        addBookmarkButton.addEventListener('click', (e) => {
            const bookmarkName = document.getElementById('bookmark-name')
            const youtubeId = youtube_parser(document.location.href) // Get youtube ID
            const localGetItem = localStorage.getItem('youtube-bookmark')
            let localStorageData = {}
            if (localGetItem) localStorageData = JSON.parse(localGetItem)
            if (!localStorageData[youtubeId]) {
                const videoTitle = document.querySelector('#above-the-fold yt-formatted-string').innerText
                const newYtB = {
                    title: videoTitle,
                    bookmark: []
                }
                localStorageData = { ...localStorageData, [youtubeId]: newYtB } // Init if not exist
            }
            localStorage.setItem('youtube-bookmark', JSON.stringify({
                ...localStorageData,
                [youtubeId]: {
                    ...localStorageData[youtubeId],
                    bookmark: [
                      ...localStorageData[youtubeId]?.bookmark,
                      { name: bookmarkName.value, secs: videoPlayer.getCurrentTime() }
                    ]
                }
            }))

            // Add new option to select after save new bookmark
            document.querySelector('.bookmark-select-menu').classList.remove('no-cursor');
            myDropdownMenu.addOption({ secs: videoPlayer.getCurrentTime(), name: bookmarkName.value })

            // Clear form
            bookmarkName.value = ''
            e.currentTarget.disabled = 'true'

            const formBookmarkNode = document.getElementById("bookmark-form")
            formBookmarkNode.style.visibility = 'hidden'
            formBookmarkNode.style.opacity = 0
            formBookmarkNode.style.width = 0
        })
        bookmarkForm.append(addBookmarkButton)

        /**
        * Hotkeys
        **/
        /*
        window.hotkeys('ctrl+b', function (event, handler) {
            switch (handler.key) {
                case 'ctrl+b':
                    alert('you pressed ctrl+b!');
                    break;
                default:
                    alert(event);
                    break
            }
        });
        */

        /* On change video */
        /*
        var playerNode = document.querySelector("#above-the-fold") //  yt-formatted-string
        if (playerNode) {
            const mutationsObs = new MutationObserver(mutations => {
                if (oldHref !== document.location.href) {
                    oldHref = document.location.href;
                    const bookmarkContainer = document.querySelector('#bookmark-container')
                    if (bookmarkContainer) bookmarkContainer.remove()
                    initBookmarkTimeYT()
                }
            })
            mutationsObs.observe(playerNode, { childList: true, subtree: true, characterData: true });
        }

        const cleanLocalStorage = () => {
            const localGetItem = localStorage.getItem('youtube-bookmark')
            if (localGetItem) {
                const localStorageData = JSON.parse(localGetItem)
                Object.keys(localStorageData).forEach(i => { if (localStorageData[i].length === 0) delete localStorageData[i] })
                localStorage.setItem('youtube-bookmark', JSON.stringify(localStorageData))
            }
        }
        */
    }

    /*
    */
    document.addEventListener('yt-navigate-finish', () => {
        console.log('process', location.pathname.startsWith('/watch'))
        const emplacementButton = document.querySelector('.efyt-control-bar')
        if (emplacementButton) {
            // initBookmarkTimeYT();
        }
    });


    const intervBookmarkTimeYT = setInterval(() => {
        // html5-video-container
        // const videoHtml5Player = document.querySelector('ytd-player')
        const emplacementButton = document.querySelector('.efyt-control-bar')
        if (emplacementButton) {
            clearInterval(intervBookmarkTimeYT)
            initBookmarkTimeYT();
        }
    }, 1000)
    intervBookmarkTimeYT()
})();

