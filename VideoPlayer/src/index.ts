import VideoPlayer from '../node_modules/video-player/index.js';

const videoPlayer = new VideoPlayer({
  containerId: 'videoPlayerContainer',
  videos: [
    'https://www.w3schools.com/html/mov_bbb.mp4',
    'https://media.w3.org/2010/05/sintel/trailer.mp4',
  ],
  theme: {
    color: 'red',
  },
});
