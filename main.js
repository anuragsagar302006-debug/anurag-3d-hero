// ==========================
// AMBIENT SPACE SOUND
// ==========================
let audioStarted = false;
const listener = new THREE.AudioListener();

// ==========================
// SCROLL STATE
// ==========================
let scrollProgress = 0;
window.addEventListener("scroll", () => {
  const max =
    document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress = max > 0 ? window.scrollY / max : 0;
});

// ==========================
// MOUSE PARALLAX
// ==========================
const mouse = { x: 0, y: 0 };
const targetCameraOffset = { x: 0, y: 0 };

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;

  targetCameraOffset.x = mouse.x * 0.2;
  targetCameraOffset.y = mouse.y * 0.15;
});

// ==========================
// BASIC SETUP
// ==========================
const canvas = document.getElementById("webgl");
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x020205);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  300
);
camera.position.set(0, 0, 7.5);
camera.add(listener);

// ==========================
// RENDERER
// ==========================
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: false
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.2;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// ==========================
// LIGHTING
// ==========================
scene.add(new THREE.AmbientLight(0x111122, 0.2));

const sunLight = new THREE.DirectionalLight(0xffffff, 2.5);
sunLight.position.set(10, 5, 5);
sunLight.castShadow = true;
sunLight.shadow.mapSize.set(2048, 2048);
scene.add(sunLight);

const rimLight = new THREE.SpotLight(0x4455ff, 5);
rimLight.position.set(-5, 5, -5);
rimLight.lookAt(0, 0, 0);
scene.add(rimLight);

// ==========================
// LOADERS
// ==========================
const loader = new THREE.TextureLoader();
const audioLoader = new THREE.AudioLoader();
const ambientSound = new THREE.Audio(listener);

audioLoader.load(
  "https://cdn.pixabay.com/download/audio/2022/03/15/audio_64d10c7d60.mp3",
  (buffer) => {
    ambientSound.setBuffer(buffer);
    ambientSound.setLoop(true);
    ambientSound.setVolume(0.3);
  }
);

// ==========================
// EARTH GROUP
// ==========================
const earthGroup = new THREE.Group();
earthGroup.position.x = -1.6;
scene.add(earthGroup);

// Earth
const earth = new THREE.Mesh(
  new THREE.SphereGeometry(1.6, 64, 64),
  new THREE.MeshStandardMaterial({
    map: loader.load("https://threejs.org/examples/textures/planets/earth_atmos_2048.jpg"),
    normalMap: loader.load("https://threejs.org/examples/textures/planets/earth_normal_2048.jpg"),
    roughness: 0.5,
    metalness: 0.1
  })
);
earth.castShadow = true;
earth.receiveShadow = true;
earthGroup.add(earth);

// Clouds
const clouds = new THREE.Mesh(
  new THREE.SphereGeometry(1.63, 64, 64),
  new THREE.MeshStandardMaterial({
    map: loader.load("https://threejs.org/examples/textures/planets/earth_clouds_1024.png"),
    transparent: true,
    opacity: 0.6,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  })
);
earthGroup.add(clouds);

// Atmosphere
const atmosphere = new THREE.Mesh(
  new THREE.SphereGeometry(1.75, 64, 64),
  new THREE.MeshBasicMaterial({
    color: 0x3a7cbd,
    transparent: true,
    opacity: 0.1,
    side: THREE.BackSide,
    blending: THREE.AdditiveBlending
  })
);
earthGroup.add(atmosphere);

// ==========================
// MOON
// ==========================
const moonPivot = new THREE.Object3D();
earthGroup.add(moonPivot);

const moon = new THREE.Mesh(
  new THREE.SphereGeometry(0.35, 64, 64),
  new THREE.MeshPhongMaterial({
    map: loader.load("https://threejs.org/examples/textures/planets/moon_1024.jpg"),
    bumpMap: loader.load("https://threejs.org/examples/textures/planets/moon_bump_1024.jpg"),
    bumpScale: 0.07,
    specularMap: loader.load("https://threejs.org/examples/textures/planets/moon_specular_1024.jpg"),
    shininess: 8
  })
);
moon.position.set(3.8, 0, 0);
moon.castShadow = true;
moon.receiveShadow = true;
moonPivot.rotation.z = 0.2;
moonPivot.add(moon);

// ==========================
// STARFIELD (BASE)
// ==========================
const starsGroup = new THREE.Group();
scene.add(starsGroup);

function createTwinklingStars(count, radius, size, opacity, c1, c2) {
  const g = new THREE.BufferGeometry();
  const p = new Float32Array(count * 3);
  const c = new Float32Array(count * 3);

  for (let i = 0; i < count; i++) {
    const r = radius * (0.6 + Math.random() * 0.8);
    const t = Math.random() * Math.PI * 2;
    const ph = Math.acos(2 * Math.random() - 1);

    p[i*3] = r * Math.sin(ph) * Math.cos(t);
    p[i*3+1] = r * Math.sin(ph) * Math.sin(t);
    p[i*3+2] = r * Math.cos(ph);

    const k = Math.random();
    c[i*3] = c1.r * (1-k) + c2.r * k;
    c[i*3+1] = c1.g * (1-k) + c2.g * k;
    c[i*3+2] = c1.b * (1-k) + c2.b * k;
  }

  g.setAttribute("position", new THREE.BufferAttribute(p, 3));
  g.setAttribute("color", new THREE.BufferAttribute(c, 3));

  return new THREE.Points(
    g,
    new THREE.PointsMaterial({
      size,
      vertexColors: true,
      transparent: true,
      opacity,
      depthWrite: false
    })
  );
}

// Original stars
starsGroup.add(createTwinklingStars(8000, 200, 0.05, 0.8, new THREE.Color(0xffffff), new THREE.Color(0x88bbff)));
starsGroup.add(createTwinklingStars(5000, 350, 0.08, 0.4, new THREE.Color(0xffeedd), new THREE.Color(0x99aaff)));

// EXTRA stars (added)
starsGroup.add(createTwinklingStars(9000, 450, 0.055, 0.35, new THREE.Color(0xfff2dd), new THREE.Color(0xaaccff)));
starsGroup.add(createTwinklingStars(12000, 600, 0.035, 0.18, new THREE.Color(0x8899ff), new THREE.Color(0xffffff)));

const parallaxStars = [
  { obj: starsGroup.children[0], factor: 0.8 },
  { obj: starsGroup.children[1], factor: 0.5 },
  { obj: starsGroup.children[2], factor: 0.25 },
  { obj: starsGroup.children[3], factor: 0.12 }
];

// ==========================
// NEBULA
// ==========================
const nebula = new THREE.Mesh(
  new THREE.SphereGeometry(400, 32, 32),
  new THREE.MeshBasicMaterial({
    map: loader.load("https://raw.githubusercontent.com/emmelleppi/threejs-examples-assets/main/textures/nebula.png"),
    side: THREE.BackSide,
    transparent: true,
    opacity: 0.13
  })
);
scene.add(nebula);

// ==========================
// ANIMATION LOOP
// ==========================
let cameraAngle = 0;
let pulseTime = 0;

function animate() {
  requestAnimationFrame(animate);

  earth.rotation.y += 0.0008;
  clouds.rotation.y += 0.0011;

  moonPivot.rotation.y += 0.002;
  moon.rotation.y += 0.001;

  starsGroup.rotation.y -= 0.0001;
  nebula.rotation.z += 0.00005;

  parallaxStars.forEach(({ obj, factor }) => {
    obj.position.x = -targetCameraOffset.x * factor;
    obj.position.y = -targetCameraOffset.y * factor;
  });

  cameraAngle += 0.0002;
  camera.position.x = Math.sin(cameraAngle) * 0.3 + targetCameraOffset.x;
  camera.position.y = Math.cos(cameraAngle * 0.8) * 0.2 + targetCameraOffset.y;

  const zTarget = 7.5 - scrollProgress * 3;
  camera.position.z += (zTarget - camera.position.z) * 0.05;

  camera.lookAt(-0.5, 0, 0);

  pulseTime += 0.012;
  atmosphere.material.opacity = 0.1 + Math.sin(pulseTime) * 0.03;

  renderer.render(scene, camera);
}
animate();

// ==========================
// RESIZE
// ==========================
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================
// AUDIO START
// ==========================
window.addEventListener("click", () => {
  if (!audioStarted && ambientSound.buffer) {
    ambientSound.play();
    audioStarted = true;
  }
});