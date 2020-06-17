export const playAudio = ({ audioFile, bgColor, waveColor, src, setSrc }) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)()
  const fileReader = new FileReader()
  let animationId

  const analyser = audioContext.createAnalyser()
  analyser.fftSize = 128
  analyser.connect(audioContext.destination)

  const canvas = document.getElementById('visualizer')
  const canvasContext = canvas.getContext('2d')
  canvas.setAttribute('width', 850)
  canvas.setAttribute('height', 640)

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
      tempSrc.start(0)

      animationId = requestAnimationFrame(render)
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

    canvasContext.textAlign = 'right'
    canvasContext.font = "20px 'sans-serif'"
    canvasContext.fillText(audioFile.name, canvas.width - 20, 40)

    animationId = requestAnimationFrame(render)
  }
}
