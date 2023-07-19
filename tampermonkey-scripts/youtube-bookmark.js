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
// @require      https://sabrif31.github.io/utils/utils/canvas.js
// @require      https://sabrif31.github.io/utils/utils/youtube.js
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

    const debug = true;
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
            const youtubeId = youtubeUtils.parserVideoId(document.location.href)
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

    GM_addStyle(``);

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
                const youtubeId = youtubeUtils.parserVideoId(document.location.href)
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

    document.body.insertAdjacentHTML('beforeend', `<canvas width="480" height="270" id="capture-video-thumbnail" />`);
    document.body.insertAdjacentHTML('beforeend', `<div id="block-body" style='position:absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: 2025; background-color: rgba(0,0,0,0.5); display: none;' />`);
    if (debug) document.body.insertAdjacentHTML('beforeend', `<button id='download-link'>Test capture</button>`);

    if (document.body) {
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
        const video = document.querySelector('video');
        const getBoundingClientRectVideo = video.getBoundingClientRect()
        if (debug) {
            const btnCapture = document.querySelector('#download-link');
            btnCapture.style.top = getBoundingClientRectVideo.top + 'px'
            btnCapture.style.left = getBoundingClientRectVideo.right - btnCapture.clientWidth - (getBoundingClientRectVideo.x / 2) + 2 + 'px'
            btnCapture.addEventListener('click', () => youtubeUtils.thumbnailCapture('capture-video-thumbnail', 'block-body'))
        }
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
            const youtubeId = youtubeUtils.parserVideoId(document.location.href)

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
            const youtubeId = youtubeUtils.parserVideoId(document.location.href) // Get youtube ID
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

        // console.log('window.canvasUtils', window.canvasUtils()?.resizeCanvas())
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

