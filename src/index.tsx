import "./scss/index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Demo from "./demo";
import Loading from "./components/loading";
import Switch from "./components/switch";
import Slider from "./components/slider";
import Alert from "./components/alert";

interface State {
  error?: Error,
  loading: boolean,
  controls: {
    normal: number,
    animation: number,
    lights: number
  }
}

class Container extends React.Component {

  state: State = {
    error: undefined,
    loading: false,
    controls: {
      normal: 0.5,
      animation: 1.0,
      lights: 3
    }
  }

  canvas: React.RefObject<HTMLCanvasElement>

  constructor(props: any) {
    super(props);

    this.canvas = React.createRef<HTMLCanvasElement>();
  }

  private onChangeNormal(normalDepth: number) {

    Demo.setNormalDepth(normalDepth)

    this.setState({
      controls: { ...this.state.controls, normalDepth }
    })
  }

  private onChangeLights(lightCount: number) {

    Demo.setLightCount(lightCount)

    this.setState({
      controls: { ...this.state.controls, lightCount }
    })
  }

  private onChangeAnimation(animationSpeed: number) {

    Demo.setAnimationSpeed(animationSpeed)

    this.setState({
      controls: { ...this.state.controls, animationSpeed }
    })
  }

  private onRenderFrame() {
    Demo.render()
    requestAnimationFrame(() => this.onRenderFrame())
  }

  async componentDidMount() {

    this.setState({ loading: true })

    await Demo.create(this.canvas.current)

    this.onRenderFrame()

    this.setState({ loading: false })
  }

  componentWillUnmount() {

    Demo.release()
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {

    this.setState({ error })
  }

  render() {

    const { error, loading, controls } = this.state

    return <div>
      <div className="panel">
        <Switch label="Normal Mapping" />
        <Slider label="Animation" min={0} max={1} step={0.01} value={controls.animation} onChange={value => this.onChangeAnimation(value)} />
        <Slider label="Normal Mapping" min={0} max={1} step={0.01} value={controls.normal} onChange={value => this.onChangeNormal(value)} />
        <Slider label="Light" min={1} max={5} step={1} value={controls.lights} onChange={value => this.onChangeLights(value)} />
      </div>
      {loading && <Loading />}
      {error && <Alert error={error} />}
      <canvas ref={this.canvas} width="1920" height="1080"></canvas>
    </div>
  }
}

ReactDOM.render(<Container />, document.getElementById("app"));
