const MIMETYPE_LIST = [
  'video/webm;codecs=h264',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
  'video/mp4'
]

export const playAudio = ({ audioFile, bgColor, waveColor, src, setSrc, setWebmVideo }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const destination = audioContext.createMediaStreamDestination()
  const chunks = []
  let animationId

  const analyser = audioContext.createAnalyser()
  analyser.fftSize = 128
  analyser.connect(audioContext.destination)

  const canvas = document.getElementById('visualizer')
  const canvasContext = canvas.getContext('2d')
  canvas.setAttribute('width', 825)
  canvas.setAttribute('height', 640)

  const canvasStream = canvas.captureStream()
  const audioStream = destination.stream
  const streams = [canvasStream, audioStream]
  const mediaStream = new MediaStream()
  streams.forEach((stream) => stream.getTracks().forEach((track) => mediaStream.addTrack(track)))
  const mimeType = MIMETYPE_LIST.find((type) => MediaRecorder.isTypeSupported(type))

  const mediaRecorder = new MediaRecorder(mediaStream, { mimeType })
  mediaRecorder.addEventListener('dataavailable', (e) => chunks.push(e.data))

  const blob = URL.createObjectURL(audioFile)
  const audioElement = new Audio(blob)
  const source = audioContext.createMediaElementSource(audioElement)

  audioElement.playbackRate = 1;

  audioElement.onloadstart = () => {
    source.connect(analyser)
    source.connect(destination)

    if (audioElement.paused) {
      mediaRecorder.start(0)
      audioElement.play()
      render();
    } else {
      audioElement.pause()
      cancelAnimationFrame(animationId)
    }
  };

  audioElement.onended = () => {
    mediaRecorder.stop()
    const video = new Blob(chunks, { type: mimeType })
    console.log(video)
    setWebmVideo(video)
  };

  const render = () => {
    const spectrums = new Uint8Array(analyser.frequencyBinCount)
    const interval = canvas.width / spectrums.length

    canvasContext.clearRect(0, 0, canvas.width, canvas.height)

    canvasContext.fillStyle = bgColor
    canvasContext.fillRect(0, 0, canvas.width, canvas.height)

    canvasContext.fillStyle = waveColor
    analyser.getByteFrequencyData(spectrums)
    for (let i = 0; i < spectrums.length; i++) {
      canvasContext.fillRect(i * interval, canvas.height - spectrums[i] * 2, interval - 2, spectrums[i] * 2)
    }

    canvasContext.textAlign = 'left'
    canvasContext.font = "20px 'sans-serif'"
    canvasContext.fillText(audioFile.name, 30, 40)

    canvasContext.textAlign = 'right'
    canvasContext.font = "12px 'sans-serif'"
    canvasContext.fillText('波形動画メーカー (Audio Urchin) ver. 0.0.1', canvas.width - 30, canvas.height - 50)
    canvasContext.fillText('comorebi notes', canvas.width - 30, canvas.height - 30)

    animationId = requestAnimationFrame(render)
  }
}

// export const convertWebmToMp4 = (webmVideo) => {
//   const worker = new Worker('https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js')
//   console.log(worker)
// }
//
