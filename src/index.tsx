import "./scss/index.scss";
import * as React from "react";
import * as ReactDOM from "react-dom";
import { mat4, vec3 } from "gl-matrix";
import * as shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";
import Camera from "./camera";
import cube from "./cube";
import * as Demo from "./demo";
import Switch from "./components/switch";
import Slider from "./components/slider";
import { element } from "prop-types";

class Container extends React.Component {

  gl: WebGLRenderingContext

  constructor(props: any) {
    super(props)

  }

  private async onInit(canvas: HTMLCanvasElement) {

    await Demo.create(canvas)

    this.onRenderFrame()
  }

  private onRenderFrame() {
    Demo.render()
    requestAnimationFrame(() => this.onRenderFrame())
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {


  }

  componentDidMount() {

  }

  render() {

    return <div>
      <div className="panel">
        <Switch label="Normal Mapping" />
        <Switch label="Animation" />
        <Slider label="Light" min={1} max={2} />
      </div>
      <canvas ref={element => this.onInit(element)} width="1920" height="1080"></canvas>
    </div>
  }
}

ReactDOM.render(<Container />, document.getElementById("app"));
