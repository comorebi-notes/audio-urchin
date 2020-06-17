import React, { useState, useEffect } from 'react'
import * as utils from '../utils'

const App = () => {
  const [bgColor, setBgColor] = useState('#fafafa')
  const handleBgColor = (e) => setBgColor(e.target.value)

  const [waveColor, setWaveColor] = useState('#22ccdd')
  const handleWaveColor = (e) => setWaveColor(e.target.value)

  const [src, setSrc] = useState()
  const [webmVideo, setWebmVideo] = useState()
  // const [mp4Video, setMp4Video] = useState()

  const [audioFile, setAudioFile] = useState()
  const selectAudioFile = (e) => setAudioFile(e.target.files.item(0))

  useEffect(() => {
    if (!audioFile) return
    utils.playAudio({ audioFile, bgColor, waveColor, src, setSrc, setWebmVideo })
  }, [audioFile]) // eslint-disable-line

  // useEffect(() => {
  //   utils.convertWebmToMp4(webmVideo, setMp4Video)
  // }, [webmVideo, mp4Video])

  const disabledInput = !!audioFile
  return (
    <div className="container py-4 py-sm-8">
      <div className="row">
        <div className="col-md-10 col-lg-8 col-xl-9 mx-auto">
          <main>
            <h1 className="mb-4">
              波形動画メーカー
              <small className="ml-1">(Audio Urchin) ver. 0.0.1</small>
            </h1>
            <p>Twitterに音楽を投稿したい！という時に、別サービスにアップすると再生に一手間かかるし、いちいち動画を作るのも大変だし…という悩みを解消すべく作成しました。</p>
            <ul className="pl-0 mb-6">
              <li>ファイルを選択すると録画が始まります。</li>
              <li><strong>このアプリは割と原始的な方法で動いています。</strong>録画中は必ずブラウザを表示したままにしておいてください。</li>
              <li>録画が完了するとダウンロードボタンが表示されます。</li>
              <li>
                出力される動画は WebM 形式です。そのままでは Twitter に投稿できないので
                <a href="https://convertio.co/ja/webm-mp4/" target="_blank" rel="noopener noreferrer" className="mx-1">
                  Convertio
                </a>
                等で変換してください。
              </li>
              <li>Google Chrome で動作確認済みです。</li>
            </ul>
            <section className="mb-6">
              <div className="form-group form-row">
                <label className="col-sm-2 col-form-label">背景色</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" defaultValue={bgColor} onChange={handleBgColor} disabled={disabledInput} />
                </div>
                <div className="col-sm-1">
                  <div style={{ backgroundColor: bgColor }} className="color-sample" />
                </div>
              </div>
              <div className="form-group form-row">
                <label className="col-sm-2 col-form-label">描画色</label>
                <div className="col-sm-9">
                  <input type="text" className="form-control" defaultValue={waveColor} onChange={handleWaveColor} disabled={disabledInput} />
                </div>
                <div className="col-sm-1">
                  <div style={{ backgroundColor: waveColor }} className="color-sample" />
                </div>
              </div>
              <div className="form-group form-row">
                <div className="col-sm-2 col-form-label">ファイル</div>
                <div className="col-sm-10">
                  <div className="custom-file">
                    <input id="select-audio-file" type="file" className="custom-file-input" onChange={selectAudioFile} disabled={disabledInput} />
                    <label className="custom-file-label" htmlFor="select-audio-file">
                      <i className="fa upload mr-1" />
                      {(audioFile && audioFile.name) || 'ファイルを選択'}
                    </label>
                  </div>
                </div>
              </div>
            </section>
            <canvas id="visualizer" className="visualiser" height="640" />
            <div className="mb-4">
              <a
                href={webmVideo ? window.URL.createObjectURL(webmVideo) : ''}
                className={`btn btn-primary btn-block mb-2 ${webmVideo ? '' : 'disabled'}`}
                download="audio_video.webm"
                target="_blank"
                rel="noopener noreferrer"
              >
                {webmVideo ? (
                  <span>
                    <i className="fa fa-download mr-1" />
                    ダウンロード (WebM)
                  </span>
                ) : '↑ でファイルを選択してください'}
              </a>
              <a href="https://convertio.co/ja/webm-mp4/" target="_blank" rel="noopener noreferrer">
                <i className="fa fa-arrow-right mr-1" />
                Convertio
              </a>
            </div>
          </main>
          <footer className="">
            <ul className="list-unstyled mb-0">
              <li>
                つくった人 :
                <a href="https://twitter.com/kero_BIRUGE" target="_blank" rel="noopener noreferrer" className="ml-1">
                  <i className="fab fa-twitter mr-1" />
                  ケロ | comorebi notes
                </a>
              </li>
              <li>
                ソースコード  :
                <a href="https://github.com/comorebi-notes/audio-urchin" target="_blank" rel="noopener noreferrer" className="ml-1">
                  <i className="fab fa-github mr-1" />
                  GitHub
                </a>
              </li>
            </ul>
          </footer>
        </div>
      </div>
    </div>
  )
}

export default App
