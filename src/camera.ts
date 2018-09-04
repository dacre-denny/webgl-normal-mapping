import { mat4, mat2, vec3, vec2 } from "gl-matrix";
import * as helpers from "./helpers";

export default class Camera {
  private constructor() {}
  private viewMatrix = mat4.create();
  private projMatrix = mat4.create();
  private position = vec3.create();
  private lookAt = vec3.create();
  private aspect = 1.69;
  private fov = (70 * Math.PI) / 180;
  private near = 0.1;
  private far = 100.0;

  public static Create() {
    return new Camera();
  }

  /**
    const fieldOfView = (70 * Math.PI) / 180; // in radians
    const aspect = gl.canvas.clientWidth / gl.canvas.clientHeight;
    const zNear = 0.1;
    const zFar = 100.0; */
  public setFOV(fov: number) {
    this.fov = helpers.clamp(
      fov,
      helpers.toRadians(0),
      helpers.toRadians(180.0)
    );
    this.projMatrix = undefined;
  }

  public setAspectRatio(aspect: number) {
    this.aspect = aspect;
    this.projMatrix = undefined;
  }

  public setNear(near: number) {
    this.near = helpers.clamp(near, 0, this.far);
    this.projMatrix = undefined;
  }

  public setFar(far: number) {
    this.far = Math.max(far, this.near);
    this.projMatrix = undefined;
  }

  public setPosition(x: number, y: number, z: number) {
    vec3.set(this.position, x, y, z);
    this.viewMatrix = undefined;
  }

  public setLookAt(x: number, y: number, z: number) {
    vec3.set(this.lookAt, x, y, z);
    this.viewMatrix = undefined;
  }

  public setDirection(x: number, y: number, z: number) {
    vec3.set(
      this.lookAt,
      x - this.position[0],
      y - this.position[1],
      z - this.position[2]
    );
    this.viewMatrix = undefined;
  }

  public getForward() {
    const forward = vec3.create();
    vec3.sub(forward, this.lookAt, this.position);
    vec3.normalize(forward, forward);

    return forward;
  }

  public getRight() {
    const forward = this.getForward();
    const right = vec3.create();
    const up = vec3.fromValues(0, 1, 0);

    if (forward[0] === 0 && forward[2] === 0) {
      vec3.set(up, 0, 0, 1);
    }

    vec3.cross(right, forward, up);
    vec3.normalize(right, right);
    return right;
  }

  public getUp() {
    const forward = this.getForward();
    const right = this.getRight();
    const up = vec3.create();

    vec3.cross(up, forward, right);
    vec3.normalize(up, up);
    return up;
  }

  public getPosition() {
    return this.position;
  }

  public getLookAt() {
    return this.lookAt;
  }

  public getProjection(): mat4 {
    if (!this.projMatrix) {
      this.projMatrix = mat4.create();
      mat4.perspective(
        this.projMatrix,
        this.fov,
        this.aspect,
        this.near,
        this.far
      );
    }

    return this.projMatrix;
  }

  public getView(): mat4 {
    if (!this.viewMatrix) {
      this.viewMatrix = mat4.create();
      mat4.lookAt(this.viewMatrix, this.position, this.lookAt, [0, 1, 0]);
    }

    return this.viewMatrix;
  }
}
