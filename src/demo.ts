import "./scss/index.scss";
import { mat4, vec3 } from "gl-matrix";
import Shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";
import Camera from "./camera";
import cube from "./cube";

let clockLast = Date.now();
let clock = 0;

const camera = Camera.Create();
camera.setPosition(1, 2, 5);
camera.setLookAt(0, 0, 0);

const ambient = vec3.fromValues(0.1, 0.1, 0.1);
let lights = [
  {
    position: vec3.fromValues(2, 1, 2),
    color: vec3.fromValues(0.85, 0.95, 1),
    range: 0.25
  },
  {
    position: vec3.fromValues(2, 1, 2),
    color: vec3.fromValues(0.35, 0.95, 1),
    range: 1.0
  },
  {
    position: vec3.fromValues(2, 1, 2),
    color: vec3.fromValues(0.85, 0.45, 0.4),
    range: 0.5
  }
];

let axisGeometry: any
let lightGeometry: any
let objectGeometry: any;

let textureColor: WebGLTexture
let textureNormal: WebGLTexture;

let normalShader: Shader
let wireframeShader: Shader;

let paramDepth: number = 0.5;
let paramAnimation: number = 1;
let paramLight: number = 3;

let gl: WebGLRenderingContext

function renderLights() {

  for (var i = 0; i < lights.length; i++) {

    vec3.set(
      lights[i].position,
      Math.sin(Math.PI + clock + (i * 0.5)) * 2,
      Math.sin(Math.PI + clock + (i * 0.5) * 0.5) * 2,
      Math.cos(Math.PI + clock + (i * 0.5)) * 2
    );
  }

  // vec3.set(
  //   lights[0].position,
  //   Math.sin(clock) * 2,
  //   Math.sin(clock * 0.5) * 2,
  //   Math.cos(clock) * 2
  // );

  // vec3.set(
  //   lights[1].position,
  //   Math.sin(Math.PI + clock) * 2,
  //   Math.sin(Math.PI + clock * 0.5) * 2,
  //   Math.cos(Math.PI + clock) * 2
  // );

  // vec3.set(
  //   lights[2].position,
  //   Math.sin(0.5 * clock * 0.5) * 2,
  //   Math.cos(0.5 * clock) * 2,
  //   Math.sin(0.5 * clock) * 2
  // );

  wireframeShader.use(gl);

  wireframeShader.updateUniforms(gl, {
    uProjectionMatrix: camera.getProjection(),
    uViewMatrix: camera.getView()
  });

  for (const light of lights) {
    const lightTranslation = mat4.create();
    mat4.fromTranslation(lightTranslation, light.position);

    wireframeShader.updateUniforms(gl, {
      uWorldMatrix: lightTranslation
    });

    geometry.bindBufferAndProgram(gl, wireframeShader, lightGeometry);
    geometry.drawBuffer(gl, lightGeometry, gl.LINES);
  }
}

function renderAxis() {
  wireframeShader.use(gl)

  wireframeShader.updateUniforms(gl, {
    uProjectionMatrix: camera.getProjection(),
    uViewMatrix: camera.getView(),
    uWorldMatrix: mat4.create()
  })

  geometry.bindBufferAndProgram(gl, wireframeShader, axisGeometry);

  geometry.drawBuffer(gl, axisGeometry, gl.LINES);
}

function applyWindowSize() {
  camera.setAspectRatio(document.body.clientWidth / document.body.clientHeight);
}

export async function create(canvas: HTMLCanvasElement) {

  gl = canvas.getContext("webgl") as WebGLRenderingContext;
  if (!gl) {
    throw new Error("Unable to initialize WebGL. Your browser or machine may not support it.")
  }

  canvas.addEventListener("contextmenu", event => event.preventDefault());

  canvas.addEventListener("mousewheel", (event: MouseWheelEvent) => {
    const vector = camera.getForward();
    vec3.scale(vector, vector, event.wheelDelta * 0.005);
    vec3.add(vector, vector, camera.getPosition());
    camera.setPosition(vector[0], vector[1], vector[2]);
  });

  canvas.addEventListener("mousemove", (event: MouseEvent) => {
    if (event.buttons > 0) {

      const dx = event.movementX / document.body.clientWidth;
      const position = vec3.rotateY(
        vec3.create(),
        camera.getPosition(),
        camera.getLookAt(),
        dx * 30
      );
      camera.setPosition(position[0], position[1], position[2]);
    }
  });

  window.addEventListener("resize", () => {
    applyWindowSize();
  });

  applyWindowSize()

  textureColor = await textures.loadTexture(
    gl,
    "./textures/EC_Stone_Wall_D.jpg"
  );
  textureNormal = await textures.loadTexture(
    gl,
    "./textures/EC_Stone_Wall_Normal.jpg"
  );

  normalShader = await Shader.create(
    gl,
    "./shaders/normal.vs",
    "./shaders/normal.fs",
    ["LIGHTS " + lights.length]
  );

  wireframeShader = await Shader.create(
    gl,
    "./shaders/simple.vs",
    "./shaders/simple.fs"
  );

  axisGeometry = geometry.createAxis(gl);

  lightGeometry = geometry.createLight(gl, 0.5);

  objectGeometry = geometry.loadGeometry(gl, cube);
}

function updateClock() {
  const clockNow = (Date.now() / 1000.0)

  clock += (clockNow - clockLast) * paramAnimation
  clockLast = clockNow;
}

function renderObject() {
  const rotationMatrix = mat4.fromZRotation(mat4.create(), clock);

  const translationMatrix = mat4.fromTranslation(mat4.create(), [
    0,
    Math.sin(clock),
    0
  ]);

  const worldMatrix = mat4.multiply(
    mat4.create(),
    translationMatrix,
    rotationMatrix
  );

  normalShader.use(gl);

  normalShader.updateUniforms(gl, {
    lights: lights,
    normalScale: paramDepth,
    uTextureNormal: textureNormal,
    uTextureColor: textureColor,
    uProjectionMatrix: camera.getProjection(),
    uViewMatrix: camera.getView(),
    uViewPosition: camera.getPosition(),
    uWorldMatrix: worldMatrix,
    ambient: ambient
  });

  geometry.bindBufferAndProgram(gl, normalShader, objectGeometry);

  geometry.drawBuffer(gl, objectGeometry);
}

export function release() {

}

export function render() {

  gl.clearColor(ambient[0], ambient[1], ambient[2], 1.0);
  gl.clearDepth(1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.depthFunc(gl.LEQUAL);

  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  renderObject();

  renderLights();

  renderAxis();

  updateClock();
}

export function setNormalDepth(depth: number) {

  paramDepth = depth
}

export function setAnimationSpeed(speed: number) {

  paramAnimation = speed;
}

var loading = false;

export function setLightCount(count: number) {

  lights = []

  for (var i = 0; i < count; i++) {
    lights.push({
      position: vec3.fromValues(2, 1, 2),
      color: vec3.fromValues(Math.sin(i * 0.1), Math.sin(i * 0.3), Math.cos(i * 0.1)),
      range: 0.5
    })
  }

  if (!loading) {
    loading = true;
    Shader.create(
      gl,
      "./shaders/normal.vs",
      "./shaders/normal.fs",
      ["LIGHTS " + lights.length]
    ).then(shader => {

      normalShader.release(gl)
      normalShader = shader
      loading = true
    });
  }

  paramLight = count
}