import { mat4, mat2, vec3, vec2 } from "gl-matrix";
import * as shader from "./shader";
import * as textures from "./texture";
import * as geometry from "./geometry";
import Camera from "./camera";
import cube from "./cube";

let clockLast = Date.now();

const camera = Camera.Create();
camera.setPosition(1, 2, 5);
camera.setLookAt(0, 0, 0);

const ambient = vec3.fromValues(0.1, 0.1, 0.1);
const lights = [
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

function applyWindowSize() {
  camera.setAspectRatio(document.body.clientWidth / document.body.clientHeight);
}

window.addEventListener("resize", () => {
  applyWindowSize();
});

document.addEventListener("mousewheel", (event: MouseWheelEvent) => {
  const vector = camera.getForward();
  vec3.scale(vector, vector, event.wheelDelta * 0.005);
  vec3.add(vector, vector, camera.getPosition());
  camera.setPosition(vector[0], vector[1], vector[2]);
});

document.addEventListener("mousemove", (event: MouseEvent) => {
  const dx = event.movementX / document.body.clientWidth;
  const position = vec3.rotateY(
    vec3.create(),
    camera.getPosition(),
    camera.getLookAt(),
    dx * 30
  );
  camera.setPosition(position[0], position[1], position[2]);
});

async function main() {
  const canvas = document.querySelector("canvas");
  canvas.addEventListener("contextmenu", event => event.preventDefault());
  const gl = canvas.getContext("webgl2") as WebGL2RenderingContext;

  if (gl === null) {
    console.error(
      "Unable to initialize WebGL. Your browser or machine may not support it."
    );
    return;
  }

  const textureColor = await textures.loadTexture(
    gl,
    "./textures/EC_Stone_Wall_D.jpg"
  );
  const textureNormal = await textures.loadTexture(
    gl,
    "./textures/EC_Stone_Wall_Normal.jpg"
  );

  const normalShader = await shader.loadProgram(
    gl,
    "./shaders/normal.vs",
    "./shaders/normal.fs",
    ["LIGHTS " + lights.length]
  );

  const wireframeShader = await shader.loadProgram(
    gl,
    "./shaders/simple.vs",
    "./shaders/simple.fs"
  );

  const axisGeometry = geometry.createAxis(gl);

  const lightGeometry = geometry.createLight(gl, 0.5);

  const objectGeometry = geometry.loadGeometry(gl, cube);

  function updateClock() {
    const clockNow = Date.now() / 1000.0;
    clockLast = clockNow;
  }

  function renderObject() {
    const rotationMatrix = mat4.fromZRotation(mat4.create(), clockLast);

    const translationMatrix = mat4.fromTranslation(mat4.create(), [
      0,
      Math.sin(clockLast),
      0
    ]);

    const worldMatrix = mat4.multiply(
      mat4.create(),
      translationMatrix,
      rotationMatrix
    );

    gl.useProgram(normalShader.program);

    shader.updateUniforms(gl, normalShader, {
      lights: lights,
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

  function renderLights() {
    vec3.set(
      lights[0].position,
      Math.sin(clockLast) * 2,
      Math.sin(clockLast * 0.5) * 2,
      Math.cos(clockLast) * 2
    );

    vec3.set(
      lights[1].position,
      Math.sin(Math.PI + clockLast) * 2,
      Math.sin(Math.PI + clockLast * 0.5) * 2,
      Math.cos(Math.PI + clockLast) * 2
    );

    vec3.set(
      lights[2].position,
      Math.sin(0.5 * clockLast * 0.5) * 2,
      Math.cos(0.5 * clockLast) * 2,
      Math.sin(0.5 * clockLast) * 2
    );

    gl.useProgram(wireframeShader.program);

    shader.updateUniforms(gl, wireframeShader, {
      uProjectionMatrix: camera.getProjection(),
      uViewMatrix: camera.getView()
    });

    for (const light of lights) {
      const lightTranslation = mat4.create();
      mat4.fromTranslation(lightTranslation, light.position);

      shader.updateUniforms(gl, wireframeShader, {
        uWorldMatrix: lightTranslation
      });

      geometry.bindBufferAndProgram(gl, wireframeShader, lightGeometry);
      geometry.drawBuffer(gl, lightGeometry, gl.LINES);
    }
  }

  function renderAxis() {
    gl.useProgram(wireframeShader.program);

    shader.updateUniforms(gl, wireframeShader, {
      uProjectionMatrix: camera.getProjection(),
      uViewMatrix: camera.getView(),
      uWorldMatrix: mat4.create()
    });

    geometry.bindBufferAndProgram(gl, wireframeShader, axisGeometry);

    geometry.drawBuffer(gl, axisGeometry, gl.LINES);
  }

  function render() {
    gl.clearColor(ambient[0], ambient[1], ambient[2], 1.0);
    gl.clearDepth(1.0);
    gl.enable(gl.DEPTH_TEST);
    gl.depthFunc(gl.LEQUAL);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderObject();

    renderLights();

    renderAxis();

    updateClock();

    requestAnimationFrame(render);
  }

  applyWindowSize();
  requestAnimationFrame(render);
}

main();
