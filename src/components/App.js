import React, { useState, useEffect } from 'react'
import * as utils from '../utils'

const App = () => {
  const [bgColor, setBgColor] = useState('#fafafa')
  const handleBgColor = (e) => setBgColor(e.target.value)

  const [waveColor, setWaveColor] = useState('#22ccdd')
  const handleWaveColor = (e) => setWaveColor(e.target.value)

  const [src, setSrc] = useState()
  const [video, setVideo] = useState()

  const [audioFile, setAudioFile] = useState()
  const selectAudioFile = (e) => setAudioFile(e.target.files.item(0))
  useEffect(() => {
    if (!audioFile) return
    utils.playAudio({ audioFile, bgColor, waveColor, src, setSrc, setVideo })
  }, [audioFile, bgColor, waveColor]) // eslint-disable-line

  return (
    <main className="py-10 row">
      <div className="col-md-10 col-lg-8 col-xl-7 mx-auto">
        <section className="mb-8">
          <div className="form-group form-row">
            <label className="col-sm-2 col-form-label">背景色</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" defaultValue={bgColor} onChange={handleBgColor} />
            </div>
            <div className="col-sm-1">
              <div style={{ backgroundColor: bgColor }} className="w-100 h-100 border" />
            </div>
          </div>
          <div className="form-group form-row">
            <label className="col-sm-2 col-form-label">描画色</label>
            <div className="col-sm-9">
              <input type="text" className="form-control" defaultValue={waveColor} onChange={handleWaveColor} />
            </div>
            <div className="col-sm-1">
              <div style={{ backgroundColor: waveColor }} className="w-100 h-100 border" />
            </div>
          </div>
          <div className="form-group form-row">
            <div className="col-sm-2 col-form-label">ファイル</div>
            <div className="col-sm-10">
              <div className="custom-file">
                <input id="select-audio-file" type="file" className="custom-file-input" onChange={selectAudioFile} />
                <label className="custom-file-label" htmlFor="select-audio-file">
                  <i className="fa upload mr-1" />
                  {(audioFile && audioFile.name) || 'ファイルを選択'}
                </label>
              </div>
            </div>
          </div>
        </section>
        <canvas id="visualizer" className="visualiser" height="640" />
        {video && (
          <a href={video} className="btn btn-primary btn-block" target="_blank" rel="noopener noreferrer">
            <i className="fa fa-download mr-1" />
            ダウンロード
          </a>
        )}
      </div>
    </main>
  )
}

export default App
