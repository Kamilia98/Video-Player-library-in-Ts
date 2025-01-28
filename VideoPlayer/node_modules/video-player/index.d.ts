type VideoPlayerProp = {
    containerId: string;
    videos: string[];
    theme: {
        color: string;
    };
};
declare class VideoPlayer {
    private videoPlayerContainer;
    private videoPlayer;
    private currentIndex;
    private playBtn;
    private muteBtn;
    private nextBtn;
    private prevBtn;
    private speedBtn;
    private fullscreenBtn;
    private speedList;
    private timeRange;
    private volumeRange;
    private videoTimer;
    private videos;
    private controlsColor;
    constructor(prop: VideoPlayerProp);
    private getElement;
    private initVideoPlayer;
    private initControls;
    private updateRangeMaxValue;
    private updateRangeBackground;
    private init;
    private formatTime;
    private initVideoTimer;
    private addEventListeners;
    private togglePlay;
    private toggleMute;
    private nextVideo;
    private prevVideo;
    private showSpeedList;
    private changeVideoSpeed;
    private seek;
    private adjustVolume;
    private toggleFullscreen;
}
export default VideoPlayer;
