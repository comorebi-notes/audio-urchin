export const playAudio = ({ audioFile, bgColor, waveColor, src, setSrc, setVideo }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const destination = audioContext.createMediaStreamDestination()
  const fileReader = new FileReader()
  const chunks = []
  let animationId

  const analyser = audioContext.createAnalyser()
  analyser.fftSize = 128
  analyser.connect(audioContext.destination)

  const canvas = document.getElementById('visualizer')
  const canvasContext = canvas.getContext('2d')
  canvas.setAttribute('width', 850)
  canvas.setAttribute('height', 640)

  const canvasStream = canvas.captureStream()
  const audioStream = destination.stream
  const streams = [canvasStream, audioStream]
  const mediaStream = new MediaStream()
  streams.forEach((stream) => stream.getTracks().forEach((track) => mediaStream.addTrack(track)))
  const mimeType = MIMETYPE_LIST.find((type) => MediaRecorder.isTypeSupported(type))

  const mediaRecorder = new MediaRecorder(mediaStream, { mimeType })
  mediaRecorder.addEventListener('dataavailable', (e) => chunks.push(e.data))

  fileReader.onload = () => {
    audioContext.decodeAudioData(fileReader.result, (buffer) => {
      if (src) {
        src.stop()
        cancelAnimationFrame(animationId)
      }

      const tempSrc = audioContext.createBufferSource()
      setSrc(tempSrc)

      tempSrc.buffer = buffer
      tempSrc.connect(analyser)
      tempSrc.connect(destination)

      mediaRecorder.start(100)
      tempSrc.start(0)

      animationId = requestAnimationFrame(render)

      tempSrc.onended = () => setTimeout(() => {
        mediaRecorder.stop()
        const video = new Blob(chunks, { type: mimeType })
        console.log(video)
        setVideo(window.URL.createObjectURL(video))
      }, 100)
    })
  }
  fileReader.readAsArrayBuffer(audioFile)

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
    canvasContext.fillText(audioFile.name, 40, 40)

    canvasContext.textAlign = 'right'
    canvasContext.font = "10px 'sans-serif'"
    canvasContext.fillText('comorebi notes', canvas.width - 20, canvas.height - 30)

    animationId = requestAnimationFrame(render)
  }
}

const MIMETYPE_LIST = [
  'video/webm;codecs=h264',
  'video/webm;codecs=vp9',
  'video/webm;codecs=vp8',
  'video/webm',
  'video/mp4'
]
