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
  normalDepth: number,
  animationSpeed: number,
  lightCount: number
}

class Container extends React.Component {

  state: State = {
    error: undefined,
    loading: false,
    normalDepth: 0.5,
    animationSpeed: 1.0,
    lightCount: 3
  }

  canvas: React.RefObject<HTMLCanvasElement>

  constructor(props: any) {
    super(props);

    this.canvas = React.createRef<HTMLCanvasElement>();
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

    const { error, loading } = this.state

    return <div>
      <div className="panel">
        <Switch label="Normal Mapping" />
        <Switch label="Animation" />
        <Slider label="Light" min={1} max={2} />
      </div>
      {loading && <Loading />}
      {error && <Alert error={error} />}
      <canvas ref={this.canvas} width="1920" height="1080"></canvas>
    </div>
  }
}

ReactDOM.render(<Container />, document.getElementById("app"));
