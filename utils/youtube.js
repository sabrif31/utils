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
async function thumbnailCapture() {
    const video = document.querySelector('video');
    const canvas = document.querySelector("#capture-video-thumbnail");
    const blockBody = document.querySelector('#block-body');
    blockBody.style.display = 'block'
    canvas.style.opacity = 1;
    canvas.style.display = 'block';

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

    // Reset previous video options
    setTimeout(() => {
        video.currentTime = previousCurrentTime;
        blockBody.style.display = 'none'
        video.play()
    }, 700);

    setTimeout(() => {
        canvas.style.opacity = 0;
    }, 2000);

    setTimeout(() => {
        canvas.style.display = 'none';
    }, 5000);

    return imageUrl;
}