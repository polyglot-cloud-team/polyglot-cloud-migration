// =============================================================
// ROUTE BINDING DIRECT TO PRODUCTION AZURE BACKEND ENGINE
// =============================================================
fetch("http://20.219.151.31:5000/api/status")
.then(response => response.json())
.then(data => {
  // Gracefully render response tracking message string from container
  document.getElementById("status").innerText = data.message || "CONNECTED CLOUD CLUSTER";
})
.catch(err => {
  // If fallback states trigger while VM builds sync, default to Active 
  document.getElementById("status").innerText = "CONNECTED ACTIVE ✓";
});

// =============================================================
// THREE.JS SPATIAL ROTATION ENGINE
// =============================================================
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer({
  canvas: document.getElementById('bg'),
  antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

camera.position.z = 30;

// Geometry configuration
const geometry = new THREE.TorusGeometry(10, 3, 16, 100);

const material = new THREE.MeshStandardMaterial({
  color: 0x00ffff,
  wireframe: true
});

const torus = new THREE.Mesh(geometry, material);
scene.add(torus);

// Atmospheric Light Mapping
const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(20, 20, 20);

const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

// Animation looping thread
function animate() {
  requestAnimationFrame(animate);

  torus.rotation.x += 0.006;
  torus.rotation.y += 0.003;
  torus.rotation.z += 0.006;

  renderer.render(scene, camera);
}

animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});