import * as THREE from "three";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "https://cdn.jsdelivr.net/npm/three@0.161.0/examples/jsm/postprocessing/UnrealBloomPass.js";

const w = window.innerWidth;
const h = window.innerHeight;
const render = new THREE.WebGLRenderer({ antialias: true, alpha: true });
render.setSize(w, h);
render.setClearColor(0x000000, 1);
render.shadowMap.enabled = true;
document.body.appendChild(render.domElement);

const fov = 75;
const aspect = w / h;
const near = 0.1;
const far = 10;
const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
camera.position.z = 2;

const scene = new THREE.Scene();

const controls = new OrbitControls(camera, render.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.03;

const groundGeo = new THREE.PlaneGeometry(10, 10);
const groundMat = new THREE.MeshStandardMaterial({ color: 0xaaaaaa, side: THREE.DoubleSide });
const ground = new THREE.Mesh(groundGeo, groundMat);
ground.rotation.x = -Math.PI / 2;
ground.receiveShadow = true;
scene.add(ground);

const geo = new THREE.IcosahedronGeometry(1.0, 2);
const mat = new THREE.MeshStandardMaterial({
  color: 0x00ff,
  metalness: 0.8, 
  roughness: 0.6, 
  flatShading: true,
});

const mesh = new THREE.Mesh(geo, mat);
mesh.castShadow = true;
scene.add(mesh);

const wireMat = new THREE.MeshBasicMaterial({
  color: 0x00ff,
  wireframe: true,
});

const wireMesh = new THREE.Mesh(geo, wireMat);
wireMesh.scale.setScalar(1.001);
mesh.add(wireMesh);

const dirLight = new THREE.DirectionalLight(0xffffff, 0.8); // Reduced intensity
dirLight.position.set(5, 5, 5);
dirLight.castShadow = true;
scene.add(dirLight);

const hemLight = new THREE.HemisphereLight(0x0099ff, 0x00aa00, 0.5); // Adjusted intensity
scene.add(hemLight);

const pointLight = new THREE.PointLight(0xff9900, 0.5, 100); // Reduced intensity
pointLight.position.set(2, 2, 2);
scene.add(pointLight);

const composer = new EffectComposer(render);
const renderPass = new RenderPass(scene, camera);
composer.addPass(renderPass);

const bloomPass = new UnrealBloomPass();
bloomPass.threshold = 0.2;
bloomPass.strength = 1.5;
bloomPass.radius = 0.5;
composer.addPass(bloomPass);

function animate(t = 0) {
  requestAnimationFrame(animate);
  mesh.rotation.y = t * 0.0008;
  composer.render();
  controls.update();
}
animate();

window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  render.setSize(w, h);
  composer.setSize(w, h);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
});
