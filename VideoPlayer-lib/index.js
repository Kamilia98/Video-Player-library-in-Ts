class VideoPlayer {
    constructor(prop) {
        this.currentIndex = 0;
        const { containerId, videos, theme } = prop;
        this.controlsColor = theme.color;
        this.videoPlayerContainer = this.getElement(containerId);
        this.videos = videos;
        this.initVideoPlayer();
        this.initControls(containerId);
        this.init();
    }
    getElement(id) {
        const element = document.getElementById(id);
        if (!element)
            throw new Error(`Element with id "${id}" not found`);
        return element;
    }
    initVideoPlayer() {
        this.videoPlayer = document.createElement('video');
        this.videoPlayer.controls = false;
        this.videoPlayerContainer.appendChild(this.videoPlayer);
    }
    initControls(containerId) {
        const controls = document.createElement('div');
        controls.classList.add('controls');
        controls.innerHTML = `
      <ul id="speedList"><li>0.25</li><li>0.5</li><li>1</li><li>1.25</li><li>1.5</li><li>2</li></ul>
      <input type="range" id="timeRange" min="0" value="0" />
      <div class="buttons">
        <div class="left">
          <button id="prevBtn"><i class="fas fa-backward"></i></button>
          <button id="playBtn"><i class="fa fa-play"></i></button>
          <button id="nextBtn"><i class="fas fa-forward"></i></button>
          <button id="muteBtn"><i class="fas fa-volume-up"></i></button>
          <input type="range" id="volumeRange" min="0" max="1" step="0.01" value="0.5" />
          <div id="videoTimer">00:00 / 00:00</div>
        </div>
        <div class="right">
          <button id="speedBtn">1x</button>
          <button id="fullscreenBtn"><i class="fas fa-expand"></i></button>
        </div>
      </div>
    `;
        this.videoPlayerContainer.appendChild(controls);
        const style = document.createElement('style');
        style.textContent = `
      #${containerId} video {
        width: 100%;
      }
      
      #${containerId} .controls {
        padding: 0 5px;
        width: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        position: relative;
        bottom: 0;
        opacity: 0;
        transform: translateY(-100%);
        transition: all 0.5s ease;
        box-sizing: border-box;
        color:${this.controlsColor}
      }

      #${containerId} .controls ul#speedList {
        list-style-type: none;
        margin: 0;
        padding: 5px;
        align-self: end;
        display: flex;
        flex-direction: column;
        color: white;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 5px;
        position: absolute;
        transform: translateY(-90%);
        opacity: 0;
        visibility: hidden;
        transition: all 0.5s ease;
      }
      
      #${containerId} .controls ul#speedList.show {
        transform: translateY(-100%);
        opacity: 1;
        visibility: visible;
      }

      #${containerId} .controls ul#speedList li {
        padding: 10px;
        width: 100px;
        cursor: pointer;
        color: white;
      }

      #${containerId} .controls #videoTimer{
      }
        
      #${containerId} .controls.show{
        opacity: 1;
      }

      #${containerId} .controls .buttons {
        width: 100%;
        display: flex;
        justify-content: space-between;
        gap: 10px;
        margin-bottom: 10px;
      }

      #${containerId} .controls .buttons button {
        width: 50px;
        border: none;
        border-radius: 5px;
        cursor: pointer;
        font-size: 16px;
        background-color: transparent;
        color: ${this.controlsColor}
      }

      #${containerId} .controls .buttons .left {
        display: flex;
        align-items: center;
      }

      #${containerId} .controls .buttons .left > *{
        padding: 5px;
      }

      #${containerId} .controls .buttons .right {
        display: flex;
        justify-content: flex-end;
      }
      
      #${containerId} .controls #timeRange,
      #${containerId} .controls #volumeRange {
        width: 100%;
        background: linear-gradient(
          to right,
          ${this.controlsColor} 0%,
          ${this.controlsColor} 0%,
          #ddd 0%,
          #ddd 100%
        );
        border-radius: 0.5rem;
        height:5px;
        outline: none;
        transition: all 1s ease;
        padding:0;
      }
      
      #${containerId} .controls .buttons #volumeRange {
        transform: translateX(-50px);
        opacity: 0;
        width: 0;
        transition: all 0.5s ease;
        pointer-events: none;
      }
      
      #${containerId} .controls input[type='range'] {
        -webkit-appearance: none;
        appearance: none;
        background: transparent;
        cursor: pointer;
      }

      #${containerId} .controls input[type='range']::-webkit-slider-thumb {
        -webkit-appearance: none;
        appearance: none;
        background-color: ${this.controlsColor};
        border-radius: 50%;
        width: 10px;
        height: 10px;
        cursor: pointer;
      }

      #${containerId} .controls .volumeRangeContainer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        height:100%;
      }

      #${containerId} .controls .volumeRangeContainer > div {
        height: 20px;
      }

      #${containerId} .controls #volumeRange.show {
        width: 100px;
        opacity: 1;
        transform: translate(0, 0);
        pointer-events: auto;
      }
    `;
        document.head.appendChild(style);
        this.playBtn = controls.querySelector('#playBtn');
        this.muteBtn = controls.querySelector('#muteBtn');
        this.nextBtn = controls.querySelector('#nextBtn');
        this.prevBtn = controls.querySelector('#prevBtn');
        this.speedBtn = controls.querySelector('#speedBtn');
        this.fullscreenBtn = controls.querySelector('#fullscreenBtn');
        this.speedList = controls.querySelector('#speedList');
        this.timeRange = controls.querySelector('#timeRange');
        this.volumeRange = controls.querySelector('#volumeRange');
        this.videoTimer = controls.querySelector('#videoTimer');
        this.updateRangeBackground(this.volumeRange, this.timeRange);
    }
    updateRangeMaxValue() {
        this.timeRange.max = this.videoPlayer.duration.toString();
    }
    updateRangeBackground(...range) {
        range.forEach((r) => {
            const value = (parseFloat(r.value) / parseFloat(r.max)) * 100 || 0;
            r.style.background = `linear-gradient(to right, ${this.controlsColor} ${value}%, #ddd ${value}%)`;
        });
    }
    init() {
        this.videoPlayer.src = this.videos[this.currentIndex];
        this.videoPlayer.volume = parseFloat(this.volumeRange.value);
        this.videoPlayer.addEventListener('loadedmetadata', () => this.updateRangeMaxValue());
        this.videoPlayer.addEventListener('timeupdate', () => {
            this.timeRange.value = this.videoPlayer.currentTime.toString();
            this.updateRangeBackground(this.timeRange);
        });
        this.initVideoTimer();
        this.addEventListeners();
    }
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }
    initVideoTimer() {
        setInterval(() => {
            const currentTime = this.videoPlayer.currentTime;
            const duration = this.videoPlayer.duration || 0;
            this.videoTimer.textContent = `${this.formatTime(currentTime)} / ${this.formatTime(duration)}`;
        }, 1000);
    }
    addEventListeners() {
        console.log(this.videoPlayer);
        this.videoPlayer.addEventListener('click', this.togglePlay);
        this.playBtn.addEventListener('click', this.togglePlay);
        this.muteBtn.addEventListener('click', this.toggleMute);
        this.nextBtn.addEventListener('click', this.nextVideo);
        this.prevBtn.addEventListener('click', this.prevVideo);
        this.speedBtn.addEventListener('click', this.showSpeedList);
        this.speedList.addEventListener('click', (e) => this.changeVideoSpeed(e));
        this.timeRange.addEventListener('input', this.seek);
        this.volumeRange.addEventListener('input', this.adjustVolume);
        this.fullscreenBtn.addEventListener('click', this.toggleFullscreen);
        this.muteBtn.addEventListener('mouseover', () => this.volumeRange.classList.add('show'));
        this.volumeRange.addEventListener('mouseleave', () => this.volumeRange.classList.remove('show'));
        this.videoPlayerContainer.addEventListener('mouseenter', () => {
            var _a;
            return (_a = this.videoPlayerContainer
                .querySelector('.controls')) === null || _a === void 0 ? void 0 : _a.classList.add('show');
        });
        this.videoPlayerContainer.addEventListener('mouseleave', () => {
            var _a;
            return (_a = this.videoPlayerContainer
                .querySelector('.controls')) === null || _a === void 0 ? void 0 : _a.classList.remove('show');
        });
    }
    togglePlay() {
        if (this.videoPlayer.paused || this.videoPlayer.ended) {
            this.videoPlayer.play();
            this.playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        }
        else {
            this.videoPlayer.pause();
            this.playBtn.innerHTML = `<i class="fas fa-play"></i>`;
        }
    }
    toggleMute() {
        const isMuted = (this.videoPlayer.muted = !this.videoPlayer.muted);
        this.muteBtn.innerHTML = isMuted
            ? '<i class="fas fa-volume-mute"></i>'
            : '<i class="fas fa-volume-up"></i>';
    }
    nextVideo() {
        if (this.currentIndex < this.videos.length - 1) {
            this.currentIndex++;
            this.videoPlayer.src = this.videos[this.currentIndex];
            this.videoPlayer.play();
            this.initVideoTimer();
            this.playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        }
    }
    prevVideo() {
        if (this.currentIndex > 0) {
            this.currentIndex--;
            this.videoPlayer.src = this.videos[this.currentIndex];
            this.videoPlayer.play();
            this.playBtn.innerHTML = `<i class="fas fa-pause"></i>`;
        }
    }
    showSpeedList() {
        this.speedList.classList.toggle('show');
    }
    changeVideoSpeed(e) {
        const target = e.target;
        const speed = parseFloat(target.textContent);
        if (!isNaN(speed)) {
            this.videoPlayer.playbackRate = speed;
            this.speedBtn.textContent = `${speed}X`;
        }
    }
    seek() {
        this.videoPlayer.currentTime = parseFloat(this.timeRange.value);
    }
    adjustVolume() {
        this.videoPlayer.volume = parseFloat(this.volumeRange.value);
        this.updateRangeBackground(this.volumeRange);
    }
    toggleFullscreen() {
        if (!document.fullscreenElement) {
            this.videoPlayerContainer.requestFullscreen().catch(console.error);
        }
        else {
            document.exitFullscreen().catch(console.error);
        }
    }
}
export default VideoPlayer;
