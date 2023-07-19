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