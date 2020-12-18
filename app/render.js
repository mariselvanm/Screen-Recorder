const { desktopCapturer, remote } = require('electron');

const { writeFile } = require('fs');

let recorder;
let blobs = [];

// Buttons
const videoElement = document.querySelector('video');


const startBtn = document.getElementById('startBtn');
startBtn.onclick = e => {
  captureScreenVideoWithAudio();
  startBtn.classList.add('is-danger');
  startBtn.innerText = 'Recording';
};

const stopBtn = document.getElementById('stopBtn');
stopBtn.onclick = e => {
  recorder.stop();
  startBtn.classList.remove('is-danger');
  startBtn.innerText = 'Start';
};

const cleanRecord = () => {
  videoElement.pause();
  videoElement.removeAttribute('src'); // empty source
  videoElement.load();
}

function captureScreenVideoWithAudio() {
  navigator.webkitGetUserMedia({
    audio: true
  }, function(audioStream) {
    navigator.webkitGetUserMedia({
      audio: false,
      video: {
        mandatory: {
          chromeMediaSource: 'screen',
          minWidth: 1280,
          minHeight: 720
        }
      }
    }, handleVideoStream(audioStream), handleUserMediaError);
  }, function() {});
}

function handleVideoStream(audioStream) {
  return function(videoStream) {
    if (audioStream) {
      let audioTracks = audioStream.getAudioTracks();
      if (audioTracks.length > 0) {
        videoStream.addTrack(audioTracks[0]);
      }
    }
    videoElement.srcObject = videoStream;
    videoElement.muted = true;
    videoElement.play();
    recorder = new MediaRecorder(videoStream);
    blobs = [];
    recorder.ondataavailable = function(event) {
      blobs.push(event.data);
    };
    recorder.onstop =async function(event) {
      const blob = new Blob(blobs, {
        type: 'video/webm; codecs=vp9'
      });
    
      const buffer = Buffer.from(await blob.arrayBuffer());

      filePath ='/Users/zoomrx/Desktop/sample.webm';
      if (filePath) {
        writeFile(filePath, buffer, () => console.log('video saved successfully!'));
      }

      cleanRecord();
    }
    recorder.start();
  };
}

function handleUserMediaError(e) {
  console.error('handleUserMediaError', e);
}
