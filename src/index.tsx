import "./scss/index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import * as Demo from "./demo";
import Switch from "./components/switch";
import Slider from "./components/slider";
import Alert from "./components/error";

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

  private onChangeNormal(normal: number) {

    Demo.setNormalDepth(normal)

    this.setState({
      controls: { ...this.state.controls, normal }
    })
  }

  private onChangeLights(lights: number) {

    Demo.setLightCount(lights)

    this.setState({
      controls: { ...this.state.controls, lights }
    })
  }

  private onChangeAnimation(animation: number) {

    Demo.setAnimationSpeed(animation)

    this.setState({
      controls: { ...this.state.controls, animation }
    })
  }

  private onRenderFrame() {
    Demo.render()
    requestAnimationFrame(() => this.onRenderFrame())
  }

  componentDidMount() {
    this.setState({ loading: true })

    Demo.create(this.canvas.current).then(() => {

      this.onRenderFrame()

      this.setState({ loading: false })
    })
  }

  componentWillUnmount() {

    Demo.release()
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {

    this.setState({ error, loading: false })
  }

  render() {

    const { error, loading, controls } = this.state

    return <div>
      <div className={`panel ${loading ? 'loading' : ''}`}>
        <h1>Normal Mapping</h1>
        <Slider label="Animation Speed" min={0} max={1} step={0.01} value={controls.animation} onChange={value => this.onChangeAnimation(value)} />
        <Slider label="Normal Mapping" min={0} max={1} step={0.01} value={controls.normal} onChange={value => this.onChangeNormal(value)} />
        <Slider label="Lights" min={1} max={5} step={1} value={controls.lights} onChange={value => this.onChangeLights(value)} />
        {error && <Alert error={error} />}
      </div>
      <canvas ref={this.canvas} width="1920" height="1080"></canvas>
    </div>
  }
}

ReactDOM.render(<Container />, document.getElementById("app"));
