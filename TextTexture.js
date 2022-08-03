import * as THREE from "three";
import TextGeometry from "./TextGeometry";
import font from "./Audiowide-Regular.json";
import fontMap from "./Audiowide-Regular.ttf.png";
import vertexShader from "./shaders/text/vertex.glsl";
import fragmentShader from "./shaders/text/fragment.glsl";
import pTex from "./pencilTexture.png";
import wavePattern from "./wavePattern.jpg";

export default class TextTexture {
  constructor({ lineHeight = 1.4, padding = 0.3 }) {
    this.geometry = new TextGeometry();
    this.geometry.setText({
      font,
      text: "Creative\nWeb\nDeveloper",
      align: "left",
      lineHeight,
    });

    this.geometry.computeBoundingBox();

    let width =
      this.geometry.boundingBox.max.x - this.geometry.boundingBox.min.x;
    let height =
      this.geometry.boundingBox.max.y - this.geometry.boundingBox.min.y;

    this.geometryAspect = width / height;

    this.scale = 2 / width;

    this.geometry.text.updateSize(this.scale);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        tMap: { value: new THREE.TextureLoader().load(fontMap) },
        pMap: { value: new THREE.TextureLoader().load(pTex) },
        wavePatternMap: { value: new THREE.TextureLoader().load(wavePattern) },
      },
      transparent: true,
    });

    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.mesh.scale.y = this.geometryAspect;

    this.mesh.scale.multiplyScalar(1 - padding);

    this.mesh.position.x = -1 + padding;
    this.mesh.position.y = 1 - padding - this.scale * 0.5 * this.geometryAspect;

    this.renderTarget = new THREE.WebGLRenderTarget(512, 512, {
      depthBuffer: false,
      stencilBuffer: false,
    });

    this.scene = new THREE.Scene();
    this.scene.add(this.mesh);
  }

  createTexture(renderer, camera) {
    const currentRenderTarget = renderer.getRenderTarget();
    renderer.setRenderTarget(this.renderTarget);
    renderer.render(this.scene, camera);
    renderer.setRenderTarget(currentRenderTarget);
    renderer.clear();
  }
}
