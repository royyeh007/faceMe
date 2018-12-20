import React from 'react'
import Webcam from 'react-webcam'
import resemble from 'resemblejs'
import FileBase64 from 'react-file-base64'

export default class UserHome extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      screenshot: null,
      images: null,
      currentImage: null,
      totalScore: 0,
      isEnable: true,
      scoreDone: false,
      scoreTalk: ''
    }

    this.screenshot = this.screenshot.bind(this)
    this.handleOnClick = this.handleOnClick.bind(this)
    this.diff = this.diff.bind(this)
    this.getFiles = this.getFiles.bind(this)
    this.scoreTalk = this.scoreTalk.bind(this)
    this.handleReset = this.handleReset.bind(this)
  }

  async screenshot() {
    // access the webcam trough this.refs
    let screenshot = this.refs.webcam.getScreenshot()
    await this.setState({screenshot: screenshot})
  }

  diff(image1, image2) {
    let result = resemble(image1)
      .compareTo(image2)
      .ignoreColors()
      .onComplete(data => {
        this.setState((prevState, currentProps) => ({
          totalScore:
            prevState.totalScore + 100 - Math.ceil(data.misMatchPercentage)
        }))
        console.log('im score', this.state.totalScore)
      })

    result.scaleToSameSize()
    result.ignoreAntialiasing()
  }

  async getFiles(images) {
    await this.setState({
      images: images,
      currentImage: images.length - 1
    })
    console.log(
      'imagem currentimage GetFile',
      this.state.images,
      this.state.currentImage
    )
  }

  async handleOnClick() {
    await this.setState({
      isEnable: false
    })
    await this.screenshot()
    await this.diff(
      this.state.screenshot,
      this.state.images[this.state.currentImage].base64
    )
    this.setState((pastState, currentProps) => ({
      currentImage: pastState.currentImage - 1
    }))
    if (this.state.currentImage) {
      let runTime = this.state.images.length - 2

      const wait = (delay, ...args) =>
        new Promise(resolve => setTimeout(resolve, delay, ...args))

      const changeImage = () => {
        return wait(3000).then(async () => {
          this.setState((pastState, currentProps) => ({
            currentImage: pastState.currentImage - 1
          }))
          await this.diff(
            this.state.screenshot,
            this.state.images[this.state.currentImage].base64
          )
          runTime--
          console.log('afterclick runTime', runTime)
        })
      }

      while (runTime > 0) {
        await changeImage()
        this.screenshot()
      }
      if (runTime === 0) {
        wait(3000).then(async () => {
          await this.screenshot()
          await this.diff(
            this.state.screenshot,
            this.state.images[this.state.currentImage].base64
          )
          this.setState({scoreDone: true})
          this.scoreTalk()
        })
      }
    }
  }

  scoreTalk() {
    console.log(
      'this is total score',
      this.state.totalScore,
      'this is image length',
      this.state.images.length
    )
    if (this.state.totalScore !== 0) {
      if (this.state.totalScore < 35 * this.state.images.length) {
        this.setState({scoreTalk: 'Face it? more like...Faceplam'})
      } else if (this.state.totalScore < 37 * this.state.images.length) {
        this.setState({scoreTalk: 'Come on..you can do better than this..'})
      } else if (this.state.totalScore < 40 * this.state.images.length) {
        this.setState({scoreTalk: 'Face it! you are pretty good!'})
      } else if (this.state.totalScore < 43 * this.state.images.length) {
        this.setState({scoreTalk: 'Face it! O M G! you are good!'})
      } else {
        this.setState({scoreTalk: 'Face it! you are the master!'})
      }
    }
  }

  handleReset() {
    this.setState((pastState, currentProps) => ({
      totalScore: 0,
      isEnable: true,
      currentImage: pastState.images.length - 1,
      scoreDone: false,
      screenshot: null
    }))
  }

  render() {
    const {images, currentImage} = this.state

    return (
      <div>
         <h1><img src="/影像 2018-11-12 上午9.25.jpg" /></h1>
        {this.state.isEnable && (
          <div>
            <FileBase64 multiple={true} onDone={this.getFiles} />
            <button onClick={this.handleOnClick}><h3>Play</h3></button>
          </div>
        )}
        <Webcam audio={false} ref="webcam" width="400" height="320" />

        {this.state.images ? (
          <img src={images[currentImage].base64} width="400" height="320" />
        ) : null}
        {this.state.screenshot ? (
          <img src={this.state.screenshot} width="400" height="320" />
        ) : null}

        {this.state.scoreDone && (
          <div>
            <div><h1>Total Score: {this.state.totalScore}</h1></div>
            <div><h1>{this.state.scoreTalk} </h1></div>
            <button onClick={this.handleReset}><h3>Try Again</h3></button>
          </div>
        )}
      </div>
    )
  }
}
