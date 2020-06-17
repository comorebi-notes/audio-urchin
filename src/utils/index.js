export const audio = () => {
  const audioCtx = new (window.AudioContext || window.webkitAudioContext)()

  const oscillatorNode = audioCtx.createOscillator()
  const gainNode = audioCtx.createGain()
  gainNode.gain.value = 0.5
  oscillatorNode.connect(gainNode)
  gainNode.connect(audioCtx.destination)
  oscillatorNode.start(0)
}
