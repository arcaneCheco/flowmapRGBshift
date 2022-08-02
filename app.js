import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { Pane } from "tweakpane";
import Flowmap from "./Flowmap";
import fragmentShader from "./fragment.glsl";
// import fragmentShader from "./fragmentRayMarchStarter.glsl";
import vertexShader from "./vertex.glsl";
import img from "./t4.jpeg";

class World {
  constructor() {
    this.container = document.querySelector("#canvas");
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(
      65,
      this.width / this.height,
      0.1,
      200
    );
    this.renderer = new THREE.WebGLRenderer({ alpha: true });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.autoClear = false;
    this.renderer.setClearColor(0x444444);
    this.container.appendChild(this.renderer.domElement);
    this.raycaster = new THREE.Raycaster();
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.z = 1;
    this.debug = new Pane();
    this.mouse = new THREE.Vector2();
    this.textureLoader = new THREE.TextureLoader();
    window.addEventListener("resize", this.resize.bind(this));
    window.addEventListener("pointermove", this.onPointermove.bind(this));
    this.flowmap = new Flowmap();
    this.setMesh();
    this.resize();
    this.render();
  }

  setMesh() {
    this.geometry = new THREE.PlaneGeometry(1, 1);

    this.material = new THREE.ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        uImage: { value: this.textureLoader.load(img) },
        uFlowmap: this.flowmap.texture,
      },
      transparent: true,
      blending: THREE.NoBlending,
    });
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);
  }

  resize() {
    this.width = this.container.offsetWidth;
    this.height = this.container.offsetHeight;
    this.renderer.setSize(this.width, this.height);
    this.camera.aspect = this.width / this.height;

    this.camera.updateProjectionMatrix();
  }

  onPointermove(event) {
    const x = (2 * event.clientX) / window.innerWidth - 1;
    const y = (-2 * event.clientY) / window.innerHeight + 1;
    this.raycaster.setFromCamera({ x, y }, this.camera);

    const [hit] = this.raycaster.intersectObject(this.mesh);
    if (hit) {
      this.flowmap.onPointermove(event, hit.uv);
    }
  }

  update() {
    this.flowmap.update(this.renderer, this.camera);
  }

  render() {
    this.update();
    this.renderer.render(this.scene, this.camera);
    window.requestAnimationFrame(this.render.bind(this));
  }
}

new World();
