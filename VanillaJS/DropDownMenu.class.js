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