import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Procedural high-detail crochet yarn normal & bump map
function createCrochetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Neutral grey base for bump mapping
  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 512, 512);

  // Draw tightly interlocking crochet "V" stitches (puntos bajos amigurumi)
  const stitchW = 24;
  const stitchH = 18;

  for (let y = 0; y < 512; y += stitchH) {
    const rowOffset = (Math.floor(y / stitchH) % 2) * (stitchW / 2);
    for (let x = -stitchW; x < 512 + stitchW; x += stitchW) {
      const px = x + rowOffset;

      // Outer crochet loop shadow
      ctx.strokeStyle = '#484848';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.arc(px + stitchW / 2, y + stitchH / 2, stitchW / 2.4, 0.2, Math.PI - 0.2);
      ctx.stroke();

      // Inner crochet loop highlight (yarn crest)
      ctx.strokeStyle = '#c8c8c8';
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.arc(px + stitchW / 2, y + stitchH / 2 - 2, stitchW / 3.2, Math.PI + 0.2, -0.2);
      ctx.stroke();

      // Central twist knot
      ctx.fillStyle = '#606060';
      ctx.beginPath();
      ctx.ellipse(px + stitchW / 2, y + stitchH / 2, 4, 3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(16, 16);
  return texture;
}

export default function AmigurumiViewer3D({
  character,
  primaryColor,
  secondaryColor,
  accessories = [],
  size = 'mediano',
}) {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const dollGroupRef = useRef(null);
  const accessoriesGroupRef = useRef(null);
  const [autoRotate, setAutoRotate] = useState(true);
  const [lightingMode, setLightingMode] = useState('warm'); // 'warm' | 'neon'
  const [activeHotspot, setActiveHotspot] = useState(null);

  useEffect(() => {
    const currentMount = mountRef.current;
    if (!currentMount) return;

    // ── 1. SCENE SETUP ──
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 460;
    const camera = new THREE.PerspectiveCamera(36, width / height, 0.1, 100);
    camera.position.set(0, 0.8, 5.0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.minDistance = 2.0;
    controls.maxDistance = 6.8;
    controls.maxPolarAngle = Math.PI / 2 + 0.05;
    controls.target.set(0, 0.25, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 1.8;
    controlsRef.current = controls;

    // ── 2. STUDIO LIGHTING RIG ──
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
    ambientLight.name = 'ambient';
    scene.add(ambientLight);

    const mainKey = new THREE.DirectionalLight(0xfff7ed, 1.9);
    mainKey.position.set(3.5, 6, 4.5);
    mainKey.castShadow = true;
    mainKey.shadow.mapSize.width = 1024;
    mainKey.shadow.mapSize.height = 1024;
    mainKey.shadow.bias = -0.0008;
    mainKey.name = 'mainKey';
    scene.add(mainKey);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.9);
    fillLight.position.set(-4.5, 3, 2.5);
    fillLight.name = 'fillLight';
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff2d78, 1.8);
    rimLight.position.set(0, 4.5, -4.5);
    rimLight.name = 'rimLight';
    scene.add(rimLight);

    const groundReflectLight = new THREE.DirectionalLight(0xec4899, 0.5);
    groundReflectLight.position.set(0, -3, 2);
    scene.add(groundReflectLight);

    // ── 3. STUDIO PODIUM ──
    const floorGeo = new THREE.PlaneGeometry(12, 12);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.28 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.75;
    floor.receiveShadow = true;
    scene.add(floor);

    // Luxury Pedestal
    const pedestalGeo = new THREE.CylinderGeometry(1.5, 1.7, 0.12, 64);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x0e0e18,
      roughness: 0.35,
      metalness: 0.4,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.81;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Pedestal Neon Ring
    const ringGeo = new THREE.TorusGeometry(1.52, 0.015, 16, 64);
    const ringMat = new THREE.MeshBasicMaterial({ color: 0xff2d78 });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = -0.75;
    scene.add(ring);

    // Root Groups
    const dollGroup = new THREE.Group();
    scene.add(dollGroup);
    dollGroupRef.current = dollGroup;

    const accGroup = new THREE.Group();
    scene.add(accGroup);
    accessoriesGroupRef.current = accGroup;

    // Animation Loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!currentMount) return;
      const w = currentMount.clientWidth;
      const h = currentMount.clientHeight || 460;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      controls.dispose();
      renderer.dispose();
      if (currentMount && renderer.domElement) {
        currentMount.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Sync Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Sync Studio Lighting Mode
  useEffect(() => {
    if (!sceneRef.current) return;
    const rim = sceneRef.current.getObjectByName('rimLight');
    const mainKey = sceneRef.current.getObjectByName('mainKey');
    const fill = sceneRef.current.getObjectByName('fillLight');

    if (lightingMode === 'neon') {
      if (rim) { rim.color.setHex(0x06b6d4); rim.intensity = 2.6; }
      if (mainKey) { mainKey.color.setHex(0xff2d78); mainKey.intensity = 1.7; }
      if (fill) { fill.color.setHex(0xa855f7); fill.intensity = 1.4; }
    } else {
      if (rim) { rim.color.setHex(0xff80aa); rim.intensity = 1.4; }
      if (mainKey) { mainKey.color.setHex(0xfff7ed); mainKey.intensity = 1.9; }
      if (fill) { fill.color.setHex(0xdbeafe); fill.intensity = 0.9; }
    }
  }, [lightingMode]);

  // ── BUILD REALISTIC CHARACTER-SPECIFIC AMIGURUMI ──
  useEffect(() => {
    if (!dollGroupRef.current || !accessoriesGroupRef.current) return;

    // Clear old objects
    while (dollGroupRef.current.children.length > 0) {
      const obj = dollGroupRef.current.children[0];
      dollGroupRef.current.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }
    while (accessoriesGroupRef.current.children.length > 0) {
      const obj = accessoriesGroupRef.current.children[0];
      accessoriesGroupRef.current.remove(obj);
      if (obj.geometry) obj.geometry.dispose();
    }

    const crochetTexture = createCrochetTexture();

    // ── PBR MATERIALS ──
    const primaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor.hex),
      roughness: 0.92,
      metalness: 0.02,
      bumpMap: crochetTexture,
      bumpScale: 0.045,
    });

    const secondaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(secondaryColor.hex),
      roughness: 0.92,
      metalness: 0.02,
      bumpMap: crochetTexture,
      bumpScale: 0.045,
    });

    // Thermal Glossy Safety Eyes (Ojos de seguridad)
    const safetyEyeMat = new THREE.MeshStandardMaterial({
      color: 0x06060a,
      roughness: 0.08,
      metalness: 0.25,
    });

    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    const feltMat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      bumpMap: crochetTexture,
      bumpScale: 0.02,
    });

    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.9,
    });

    const doll = dollGroupRef.current;
    const charId = character?.id || 'stitch';

    // Helper: make glossy eye with white glint
    const createSafetyEye = (radius = 0.09) => {
      const eyeMesh = new THREE.Mesh(new THREE.SphereGeometry(radius, 24, 24), safetyEyeMat);
      const glint = new THREE.Mesh(new THREE.SphereGeometry(radius * 0.32, 12, 12), eyeHighlightMat);
      glint.position.set(-radius * 0.3, radius * 0.35, radius * 0.85);
      eyeMesh.add(glint);
      return eyeMesh;
    };

    // ========================================================
    // 1. CHARACTER: STITCH ESPACIAL (Experiment 626)
    // ========================================================
    if (charId === 'stitch') {
      // Stitch Squished Head
      const headGeo = new THREE.SphereGeometry(0.72, 36, 36);
      headGeo.scale(1.22, 0.95, 1.05);
      const head = new THREE.Mesh(headGeo, primaryMat);
      head.position.set(0, 0.88, 0);
      head.castShadow = true;
      doll.add(head);

      // Stitch Hair Tuft on Crown
      const tuftGeo = new THREE.ConeGeometry(0.08, 0.22, 12);
      tuftGeo.rotateX(0.2);
      const tuft = new THREE.Mesh(tuftGeo, primaryMat);
      tuft.position.set(0, 1.55, 0.1);
      doll.add(tuft);

      // Stitch Lower Face / Muzzle Patch (Lighter Cyan / Secondary)
      const muzzleGeo = new THREE.SphereGeometry(0.48, 30, 30);
      muzzleGeo.scale(1.25, 0.65, 0.7);
      const muzzle = new THREE.Mesh(muzzleGeo, secondaryMat);
      muzzle.position.set(0, 0.74, 0.46);
      doll.add(muzzle);

      // Stitch Wide Blue/Dark Nose
      const noseMat = new THREE.MeshStandardMaterial({
        color: 0x1d3557,
        roughness: 0.5,
        bumpMap: crochetTexture,
        bumpScale: 0.03,
      });
      const noseGeo = new THREE.SphereGeometry(0.16, 24, 24);
      noseGeo.scale(1.4, 0.85, 0.7);
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0.83, 0.74);
      doll.add(nose);

      // Stitch Iconic Eyes (Angled Teardrops with white border + glossy black pupil)
      [-1, 1].forEach((side) => {
        const eyeGroup = new THREE.Group();

        // White Felt Eye Backing
        const feltGeo = new THREE.SphereGeometry(0.22, 24, 24);
        feltGeo.scale(0.85, 1.25, 0.35);
        const felt = new THREE.Mesh(feltGeo, feltMat);
        eyeGroup.add(felt);

        // Black Pupil
        const pupilGeo = new THREE.SphereGeometry(0.18, 24, 24);
        pupilGeo.scale(0.8, 1.2, 0.35);
        const pupil = new THREE.Mesh(pupilGeo, safetyEyeMat);
        pupil.position.z = 0.05;

        // Catchlight
        const glint = new THREE.Mesh(new THREE.SphereGeometry(0.045, 12, 12), eyeHighlightMat);
        glint.position.set(side * 0.04, 0.08, 0.14);
        pupil.add(glint);
        eyeGroup.add(pupil);

        eyeGroup.position.set(side * 0.38, 0.96, 0.62);
        eyeGroup.rotation.y = side * 0.45;
        eyeGroup.rotation.z = side * -0.28; // Tilted alien eyes
        eyeGroup.rotation.x = -0.05;
        doll.add(eyeGroup);
      });

      // Stitch Iconic Giant Bat/Kangaroo Ears (Cupped, Upright, Notched)
      [-1, 1].forEach((side) => {
        const earGroup = new THREE.Group();

        // Outer Ear Shell (Primary Color)
        const outerEarGeo = new THREE.SphereGeometry(0.65, 32, 32);
        outerEarGeo.scale(0.48, 1.25, 0.22);
        const outerEar = new THREE.Mesh(outerEarGeo, primaryMat);
        outerEar.castShadow = true;
        earGroup.add(outerEar);

        // Inner Ear Filling (Pink / Secondary Color)
        const innerEarGeo = new THREE.SphereGeometry(0.55, 28, 28);
        innerEarGeo.scale(0.4, 1.15, 0.18);
        const innerEar = new THREE.Mesh(innerEarGeo, secondaryMat);
        innerEar.position.set(0, 0, 0.06);
        earGroup.add(innerEar);

        // Signature Stitch Ear Notch cutout on outer edge
        const notchGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.25, 16);
        notchGeo.rotateZ(Math.PI / 2);
        const notch = new THREE.Mesh(notchGeo, new THREE.MeshBasicMaterial({ color: 0x07070b }));
        notch.position.set(side * 0.24, 0.15, 0);

        earGroup.position.set(side * 0.78, 1.35, -0.05);
        earGroup.rotation.z = side * -0.72; // Angled wide
        earGroup.rotation.y = side * 0.35;
        earGroup.rotation.x = -0.15;
        doll.add(earGroup);
      });

      // Stitch Body (Chubby Sitting)
      const bodyGeo = new THREE.SphereGeometry(0.56, 36, 36);
      bodyGeo.scale(1.05, 1.15, 1.0);
      const body = new THREE.Mesh(bodyGeo, primaryMat);
      body.position.set(0, 0, 0);
      body.castShadow = true;
      doll.add(body);

      // Stitch Big Belly Patch (Secondary Color)
      const bellyGeo = new THREE.SphereGeometry(0.42, 28, 28);
      bellyGeo.scale(0.9, 1.05, 0.45);
      const belly = new THREE.Mesh(bellyGeo, secondaryMat);
      belly.position.set(0, -0.02, 0.42);
      doll.add(belly);

      // Stitch Darker Back Patch
      const backPatchGeo = new THREE.SphereGeometry(0.35, 24, 24);
      backPatchGeo.scale(1.0, 1.1, 0.3);
      const backPatch = new THREE.Mesh(backPatchGeo, secondaryMat);
      backPatch.position.set(0, 0.12, -0.44);
      doll.add(backPatch);

      // Stitch Arms
      [-1, 1].forEach((side) => {
        const armGeo = new THREE.SphereGeometry(0.18, 20, 20);
        armGeo.scale(0.75, 1.4, 0.8);
        const arm = new THREE.Mesh(armGeo, primaryMat);
        arm.position.set(side * 0.55, 0.12, 0.15);
        arm.rotation.z = side * 0.45;
        arm.rotation.x = -0.25;
        arm.castShadow = true;
        doll.add(arm);
      });

      // Stitch Sitting Feet with cute paws
      [-1, 1].forEach((side) => {
        const footGeo = new THREE.SphereGeometry(0.24, 24, 24);
        footGeo.scale(0.95, 0.7, 1.35);
        const foot = new THREE.Mesh(footGeo, primaryMat);
        foot.position.set(side * 0.36, -0.58, 0.28);
        foot.rotation.y = side * 0.3;
        foot.castShadow = true;

        // Paw pads (Secondary Color)
        const pad = new THREE.Mesh(new THREE.CircleGeometry(0.1, 16), secondaryMat);
        pad.rotation.x = -Math.PI / 2 + 0.3;
        pad.position.set(0, 0.14, 0.1);
        foot.add(pad);

        doll.add(foot);
      });

      // Stitch Tail
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), primaryMat);
      tail.position.set(0, -0.4, -0.52);
      doll.add(tail);

    // ========================================================
    // 2. CHARACTER: DINO PREHISTÓRICO (Authentic Crochet T-Rex)
    // ========================================================
    } else if (charId === 'dino') {
      // Dino Head with PROMINENT HORIZONTAL EXTENDED SNOUT (like the photo!)
      const headGroup = new THREE.Group();

      // Cranium
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), primaryMat);
      cranium.scale.set(0.95, 1.05, 1.05);
      headGroup.add(cranium);

      // Long Curved Dinosaur Snout (protrudes forward!)
      const snoutGeo = new THREE.SphereGeometry(0.42, 32, 32);
      snoutGeo.scale(0.9, 0.85, 1.35);
      const snout = new THREE.Mesh(snoutGeo, primaryMat);
      snout.position.set(0, -0.08, 0.45);
      headGroup.add(snout);

      // Side-facing Dinosaur Eyes
      [-1, 1].forEach((side) => {
        const eye = createSafetyEye(0.085);
        eye.position.set(side * 0.42, 0.08, 0.38);
        eye.rotation.y = side * 0.75;
        headGroup.add(eye);
      });

      headGroup.position.set(0, 1.0, 0.08);
      doll.add(headGroup);

      // Dino Curved Neck & Body
      const bodyGeo = new THREE.SphereGeometry(0.62, 36, 36);
      bodyGeo.scale(0.92, 1.25, 1.08);
      const body = new THREE.Mesh(bodyGeo, primaryMat);
      body.position.set(0, 0.05, -0.05);
      body.castShadow = true;
      doll.add(body);

      // Long Thick Dinosaur Tail (curves backward and down to ground!)
      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.2, -0.45),
        new THREE.Vector3(0, -0.4, -0.85),
        new THREE.Vector3(0, -0.65, -1.25),
        new THREE.Vector3(0, -0.72, -1.45),
      ]);
      const tailGeo = new THREE.TubeGeometry(tailCurve, 24, 0.18, 16, false);
      const tail = new THREE.Mesh(tailGeo, primaryMat);
      tail.castShadow = true;
      doll.add(tail);

      // SCALLOPED CROCHET DORSAL CREST / RUFFLE SPINES (From head to tip of tail!)
      // Exactly like the green amigurumi photo: continuous fluffy rounded bumps
      const crestPuffs = [
        { x: 0, y: 1.58, z: 0.05, s: 0.13 },
        { x: 0, y: 1.52, z: -0.22, s: 0.14 },
        { x: 0, y: 1.35, z: -0.42, s: 0.15 },
        { x: 0, y: 1.08, z: -0.52, s: 0.15 },
        { x: 0, y: 0.78, z: -0.56, s: 0.16 },
        { x: 0, y: 0.48, z: -0.58, s: 0.16 },
        { x: 0, y: 0.18, z: -0.62, s: 0.15 },
        { x: 0, y: -0.12, z: -0.74, s: 0.14 },
        { x: 0, y: -0.38, z: -0.98, s: 0.13 },
        { x: 0, y: -0.58, z: -1.25, s: 0.12 },
        { x: 0, y: -0.68, z: -1.46, s: 0.10 },
      ];

      crestPuffs.forEach((pt) => {
        const puffGeo = new THREE.SphereGeometry(pt.s, 18, 18);
        puffGeo.scale(0.85, 1.25, 1.0);
        const puff = new THREE.Mesh(puffGeo, secondaryMat);
        puff.position.set(pt.x, pt.y, pt.z);
        puff.rotation.x = -0.3;
        puff.castShadow = true;
        doll.add(puff);
      });

      // Cute Little T-Rex Arms held forward
      [-1, 1].forEach((side) => {
        const armGeo = new THREE.SphereGeometry(0.14, 16, 16);
        armGeo.scale(0.7, 1.4, 0.7);
        const arm = new THREE.Mesh(armGeo, primaryMat);
        arm.position.set(side * 0.42, 0.18, 0.35);
        arm.rotation.x = -1.1; // Reaching forward
        arm.rotation.z = side * 0.3;
        arm.castShadow = true;
        doll.add(arm);
      });

      // Chunky Dino Standing Legs
      [-1, 1].forEach((side) => {
        const legGeo = new THREE.CylinderGeometry(0.16, 0.22, 0.45, 20);
        const leg = new THREE.Mesh(legGeo, primaryMat);
        leg.position.set(side * 0.34, -0.55, 0.05);
        leg.castShadow = true;
        doll.add(leg);

        // Foot base
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 16, 16), primaryMat);
        foot.scale.set(1, 0.5, 1.3);
        foot.position.set(side * 0.34, -0.72, 0.14);
        doll.add(foot);
      });

    // ========================================================
    // 3. CHARACTER: POLLITO COCINERO (Chef Chick with Toque & Apron)
    // ========================================================
    } else if (charId === 'pollito') {
      // Round Yellow Chick Body
      const chickGeo = new THREE.SphereGeometry(0.72, 36, 36);
      chickGeo.scale(1.05, 1.0, 1.0);
      const chick = new THREE.Mesh(chickGeo, primaryMat);
      chick.position.set(0, 0.08, 0);
      chick.castShadow = true;
      doll.add(chick);

      // Wide Flat Orange Beak (Between eyes)
      const beakMat = new THREE.MeshStandardMaterial({
        color: 0xf97316,
        roughness: 0.6,
        bumpMap: crochetTexture,
        bumpScale: 0.03,
      });
      const beakGeo = new THREE.SphereGeometry(0.14, 20, 20);
      beakGeo.scale(1.4, 0.65, 0.9);
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.position.set(0, 0.32, 0.72);
      doll.add(beak);

      // Black bead safety eyes
      [-1, 1].forEach((side) => {
        const eye = createSafetyEye(0.08);
        eye.position.set(side * 0.30, 0.36, 0.64);
        doll.add(eye);
      });

      // Real White Crocheted Chef Hat (Toque Blanche) on head
      const hatGroup = new THREE.Group();
      const hatMat = feltMat;

      // Hat Band
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.38, 0.16, 32), hatMat);
      band.position.y = 0.08;
      hatGroup.add(band);

      // Puffy Mushroom Top
      const puffTop = new THREE.Mesh(new THREE.SphereGeometry(0.48, 32, 32), hatMat);
      puffTop.scale.set(1.15, 0.85, 1.15);
      puffTop.position.y = 0.42;
      hatGroup.add(puffTop);

      hatGroup.position.set(0, 0.82, 0);
      doll.add(hatGroup);

      // Real White Crocheted Chef Apron on chest
      const apronGeo = new THREE.CylinderGeometry(0.74, 0.76, 0.55, 32, 1, true, -Math.PI / 3.2, (Math.PI / 3.2) * 2);
      const apron = new THREE.Mesh(apronGeo, feltMat);
      apron.position.set(0, 0.02, 0.05);
      doll.add(apron);

      // Apron neck strap
      const strapGeo = new THREE.TorusGeometry(0.68, 0.04, 12, 32, Math.PI);
      const strap = new THREE.Mesh(strapGeo, feltMat);
      strap.rotation.x = Math.PI / 2 + 0.3;
      strap.position.set(0, 0.32, 0.15);
      doll.add(strap);

      // Little Chick Wings
      [-1, 1].forEach((side) => {
        const wingGeo = new THREE.SphereGeometry(0.24, 20, 20);
        wingGeo.scale(0.45, 1.1, 0.7);
        const wing = new THREE.Mesh(wingGeo, primaryMat);
        wing.position.set(side * 0.70, 0.10, 0);
        wing.rotation.z = side * 0.45;
        wing.castShadow = true;
        doll.add(wing);
      });

      // Orange Amigurumi Feet standing firmly on the pedestal floor
      [-1, 1].forEach((side) => {
        const footGroup = new THREE.Group();
        [-0.08, 0, 0.08].forEach((tx, idx) => {
          const toe = new THREE.Mesh(new THREE.ConeGeometry(0.05, 0.18, 12), beakMat);
          toe.rotation.x = Math.PI / 2;
          toe.rotation.y = (idx - 1) * 0.22;
          toe.position.set(tx, 0, 0.09);
          footGroup.add(toe);
        });
        const heel = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), beakMat);
        heel.position.set(0, 0, -0.04);
        footGroup.add(heel);

        footGroup.position.set(side * 0.26, -0.68, 0.18);
        footGroup.castShadow = true;
        doll.add(footGroup);
      });

    // ========================================================
    // 4. CHARACTER: GATITO CON CORAZÓN (Con Patas Delanteras y Traseras)
    // ========================================================
    } else if (charId === 'gato') {
      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.62, 36, 36), primaryMat);
      head.position.set(0, 0.72, 0);
      head.castShadow = true;
      doll.add(head);

      // Pointed hollow cat ears
      [-1, 1].forEach((side) => {
        const ear = new THREE.Mesh(new THREE.ConeGeometry(0.20, 0.36, 16), primaryMat);
        ear.position.set(side * 0.36, 1.26, 0.05);
        ear.rotation.z = side * -0.32;
        ear.rotation.x = -0.15;
        ear.castShadow = true;

        const inner = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.28, 16), secondaryMat);
        inner.position.set(0, -0.02, 0.05);
        ear.add(inner);
        doll.add(ear);
      });

      // Black Safety Eyes with specular highlight
      [-1, 1].forEach((side) => {
        const eye = createSafetyEye(0.08);
        eye.position.set(side * 0.26, 0.72, 0.55);
        doll.add(eye);
      });

      // Muzzle / Cheeks (Secondary Color or Cream)
      const muzzle = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 24), secondaryMat);
      muzzle.scale.set(1.25, 0.75, 0.6);
      muzzle.position.set(0, 0.60, 0.56);
      doll.add(muzzle);

      // Pink Embroidered Whiskers & T-mouth (like photo)
      const pinkEmbroidery = new THREE.MeshBasicMaterial({ color: 0xf43f5e });
      [-1, 1].forEach((side) => {
        const whisker1 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.018, 0.02), pinkEmbroidery);
        whisker1.position.set(side * 0.38, 0.65, 0.55);
        whisker1.rotation.z = side * 0.15;
        doll.add(whisker1);

        const whisker2 = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.018, 0.02), pinkEmbroidery);
        whisker2.position.set(side * 0.38, 0.58, 0.55);
        whisker2.rotation.z = side * -0.15;
        doll.add(whisker2);
      });

      // Pink Triangle Nose & Mouth seam
      const catNose = new THREE.Mesh(new THREE.ConeGeometry(0.045, 0.06, 12), pinkEmbroidery);
      catNose.rotation.z = Math.PI;
      catNose.position.set(0, 0.67, 0.68);
      doll.add(catNose);

      const mouthLine = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.06, 0.02), pinkEmbroidery);
      mouthLine.position.set(0, 0.62, 0.68);
      doll.add(mouthLine);

      // Body (Chubby Sitting)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), primaryMat);
      body.scale.set(1.0, 1.15, 0.95);
      body.position.set(0, -0.05, 0);
      body.castShadow = true;
      doll.add(body);

      // Soft Belly Patch (Secondary Color)
      const bellyPatch = new THREE.Mesh(new THREE.SphereGeometry(0.38, 24, 24), secondaryMat);
      bellyPatch.scale.set(0.85, 1.05, 0.35);
      bellyPatch.position.set(0, -0.08, 0.42);
      doll.add(bellyPatch);

      // Heart held on chest (like the real photo!)
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.7,
        bumpMap: crochetTexture,
        bumpScale: 0.04,
      });
      const heartGroup = new THREE.Group();
      const lLob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), heartMat);
      lLob.position.set(-0.1, 0.1, 0);
      heartGroup.add(lLob);
      const rLob = new THREE.Mesh(new THREE.SphereGeometry(0.15, 16, 16), heartMat);
      rLob.position.set(0.1, 0.1, 0);
      heartGroup.add(rLob);
      const cone = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.34, 16), heartMat);
      cone.rotation.z = Math.PI;
      cone.position.set(0, -0.09, 0);
      heartGroup.add(cone);
      heartGroup.position.set(0, 0.08, 0.46);
      heartGroup.scale.set(1.05, 1.05, 0.85);
      doll.add(heartGroup);

      // Front Paws / Arms hugging the heart
      [-1, 1].forEach((side) => {
        const armGroup = new THREE.Group();
        const armGeo = new THREE.CylinderGeometry(0.10, 0.12, 0.38, 16);
        const arm = new THREE.Mesh(armGeo, primaryMat);
        armGroup.add(arm);

        // White / Secondary paw tip
        const pawTip = new THREE.Mesh(new THREE.SphereGeometry(0.11, 16, 16), secondaryMat);
        pawTip.position.y = -0.20;
        armGroup.add(pawTip);

        armGroup.position.set(side * 0.38, 0.06, 0.28);
        armGroup.rotation.z = side * -0.55;
        armGroup.rotation.x = -0.45;
        armGroup.rotation.y = side * 0.35;
        armGroup.castShadow = true;
        doll.add(armGroup);
      });

      // Hind Sitting Legs & Paws (firmly resting on pedestal floor!)
      [-1, 1].forEach((side) => {
        // Thigh
        const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.25, 20, 20), primaryMat);
        thigh.scale.set(0.85, 1.1, 1.15);
        thigh.position.set(side * 0.38, -0.42, 0.02);
        doll.add(thigh);

        // Foot / Paw resting flat on pedestal
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), primaryMat);
        foot.scale.set(0.95, 0.62, 1.35);
        foot.position.set(side * 0.34, -0.68, 0.24);
        foot.castShadow = true;

        // Paw pad (secondary color)
        const pad = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), secondaryMat);
        pad.rotation.x = -Math.PI / 2 + 0.3;
        pad.position.set(0, 0.11, 0.08);
        foot.add(pad);

        doll.add(foot);
      });

      // Playful Curved Tail in the back
      const catTailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.42, -0.45),
        new THREE.Vector3(0.05, -0.32, -0.75),
        new THREE.Vector3(0.20, -0.05, -0.85),
        new THREE.Vector3(0.28, 0.22, -0.80),
      ]);
      const catTailGeo = new THREE.TubeGeometry(catTailCurve, 20, 0.06, 12, false);
      const catTail = new THREE.Mesh(catTailGeo, primaryMat);
      catTail.castShadow = true;
      doll.add(catTail);

    // ========================================================
    // 5. CHARACTER: PERRITO FIEL / SNOOPY (Con Patas Delanteras y Traseras)
    // ========================================================
    } else if (charId === 'perro') {
      // Dog Head
      const headGroup = new THREE.Group();
      const cranium = new THREE.Mesh(new THREE.SphereGeometry(0.55, 32, 32), primaryMat);
      headGroup.add(cranium);

      // Long Beagle / Snoopy Snout
      const dogSnout = new THREE.Mesh(new THREE.SphereGeometry(0.38, 28, 28), primaryMat);
      dogSnout.scale.set(0.95, 0.85, 1.4);
      dogSnout.position.set(0, -0.05, 0.42);
      headGroup.add(dogSnout);

      // Big Glossy Black Button Nose
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.14, 20, 20), safetyEyeMat);
      nose.scale.set(1.2, 0.9, 0.9);
      nose.position.set(0, 0.02, 0.88);
      headGroup.add(nose);

      // Droopy Long Ears along cheeks
      [-1, 1].forEach((side) => {
        const earGeo = new THREE.SphereGeometry(0.22, 20, 20);
        earGeo.scale(0.65, 1.8, 0.4);
        const ear = new THREE.Mesh(earGeo, secondaryMat);
        ear.position.set(side * 0.58, 0.02, 0);
        ear.rotation.z = side * 0.15;
        ear.castShadow = true;
        headGroup.add(ear);
      });

      // Eyes
      [-1, 1].forEach((side) => {
        const eye = createSafetyEye(0.08);
        eye.position.set(side * 0.28, 0.18, 0.48);
        headGroup.add(eye);
      });

      headGroup.position.set(0, 0.75, 0);
      doll.add(headGroup);

      // Chubby Body
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.52, 32, 32), primaryMat);
      body.scale.set(0.98, 1.15, 0.98);
      body.position.set(0, -0.05, 0);
      body.castShadow = true;
      doll.add(body);

      // Dog Belly Patch
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), secondaryMat);
      belly.scale.set(0.85, 1.05, 0.35);
      belly.position.set(0, -0.08, 0.42);
      doll.add(belly);

      // Front Legs reaching down to pedestal
      [-1, 1].forEach((side) => {
        const frontLeg = new THREE.Group();
        const legGeo = new THREE.CylinderGeometry(0.11, 0.13, 0.42, 16);
        const legMesh = new THREE.Mesh(legGeo, primaryMat);
        frontLeg.add(legMesh);

        // Paw base
        const paw = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), secondaryMat);
        paw.scale.set(1.0, 0.65, 1.25);
        paw.position.set(0, -0.21, 0.05);
        frontLeg.add(paw);

        frontLeg.position.set(side * 0.20, -0.48, 0.26);
        frontLeg.castShadow = true;
        doll.add(frontLeg);
      });

      // Hind Sitting Legs & Paws
      [-1, 1].forEach((side) => {
        const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), primaryMat);
        thigh.scale.set(0.85, 1.1, 1.15);
        thigh.position.set(side * 0.36, -0.42, -0.02);
        doll.add(thigh);

        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.16, 16, 16), primaryMat);
        foot.scale.set(0.95, 0.6, 1.3);
        foot.position.set(side * 0.36, -0.68, 0.16);
        foot.castShadow = true;
        doll.add(foot);
      });

      // Wagging Tail
      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.35, -0.48),
        new THREE.Vector3(0, -0.15, -0.72),
        new THREE.Vector3(0.08, 0.05, -0.78),
      ]);
      const tailGeo = new THREE.TubeGeometry(tailCurve, 16, 0.055, 12, false);
      const tail = new THREE.Mesh(tailGeo, primaryMat);
      doll.add(tail);

    // ========================================================
    // 6. CHARACTER: CONEJITA MÁGICA (Con Nariz Rosada, Hocico y Patas)
    // ========================================================
    } else {
      // Head
      const head = new THREE.Mesh(new THREE.SphereGeometry(0.60, 36, 36), primaryMat);
      head.position.set(0, 0.68, 0);
      head.castShadow = true;
      doll.add(head);

      // Sweet White / Secondary Muzzle (Hocico prominente de conejito)
      const muzzleGeo = new THREE.SphereGeometry(0.24, 24, 24);
      muzzleGeo.scale(1.25, 0.8, 0.65);
      const muzzle = new THREE.Mesh(muzzleGeo, secondaryMat);
      muzzle.position.set(0, 0.58, 0.52);
      doll.add(muzzle);

      // Cute Pink Amigurumi Nose (Nariz rosada bien definida que el usuario solicitó)
      const pinkMat = new THREE.MeshStandardMaterial({
        color: 0xf472b6,
        roughness: 0.5,
        bumpMap: crochetTexture,
        bumpScale: 0.03,
      });
      const bunnyNose = new THREE.Mesh(new THREE.SphereGeometry(0.075, 16, 16), pinkMat);
      bunnyNose.scale.set(1.2, 0.9, 0.8);
      bunnyNose.position.set(0, 0.64, 0.68);
      doll.add(bunnyNose);

      // Embroidered Mouth Seam ("Y" amigurumi smile)
      const seamMat = new THREE.MeshBasicMaterial({ color: 0x9d174d });
      const seam = new THREE.Mesh(new THREE.BoxGeometry(0.018, 0.08, 0.02), seamMat);
      seam.position.set(0, 0.58, 0.68);
      doll.add(seam);

      // Sweet Rosy Cheeks (Mejillas sonrosadas de conejita)
      const blushMat = new THREE.MeshBasicMaterial({ color: 0xfb7185 });
      [-1, 1].forEach((side) => {
        const blush = new THREE.Mesh(new THREE.CircleGeometry(0.09, 16), blushMat);
        blush.position.set(side * 0.36, 0.58, 0.50);
        blush.rotation.y = side * 0.45;
        doll.add(blush);
      });

      // Expressive Safety Eyes
      [-1, 1].forEach((side) => {
        const eye = createSafetyEye(0.078);
        eye.position.set(side * 0.25, 0.70, 0.54);
        doll.add(eye);
      });

      // Long Graceful Bunny Ears (Proportion to fit beautifully in canvas)
      [-1, 1].forEach((side) => {
        const earGroup = new THREE.Group();

        // Outer Ear Shell
        const earGeo = new THREE.SphereGeometry(0.18, 24, 24);
        earGeo.scale(0.85, 2.6, 0.35);
        const outerEar = new THREE.Mesh(earGeo, primaryMat);
        outerEar.position.y = 0.42;
        outerEar.castShadow = true;
        earGroup.add(outerEar);

        // Inner Pink Channel
        const innerGeo = new THREE.SphereGeometry(0.14, 20, 20);
        innerGeo.scale(0.75, 2.3, 0.2);
        const innerEar = new THREE.Mesh(innerGeo, secondaryMat);
        innerEar.position.set(0, 0.42, 0.05);
        earGroup.add(innerEar);

        earGroup.position.set(side * 0.26, 1.15, 0.02);
        earGroup.rotation.z = side * -0.16;
        earGroup.rotation.x = -0.08;
        doll.add(earGroup);
      });

      // Body (Chubby Sitting)
      const body = new THREE.Mesh(new THREE.SphereGeometry(0.50, 32, 32), primaryMat);
      body.scale.set(1.0, 1.15, 0.95);
      body.position.set(0, -0.06, 0);
      body.castShadow = true;
      doll.add(body);

      // Belly Patch
      const belly = new THREE.Mesh(new THREE.SphereGeometry(0.36, 24, 24), secondaryMat);
      belly.scale.set(0.85, 1.05, 0.35);
      belly.position.set(0, -0.08, 0.40);
      doll.add(belly);

      // Front Paws / Arms (Patitas delanteras juntas en el pechito)
      [-1, 1].forEach((side) => {
        const pawGroup = new THREE.Group();
        const armGeo = new THREE.CylinderGeometry(0.09, 0.11, 0.34, 16);
        const arm = new THREE.Mesh(armGeo, primaryMat);
        pawGroup.add(arm);

        const pawTip = new THREE.Mesh(new THREE.SphereGeometry(0.10, 16, 16), secondaryMat);
        pawTip.position.y = -0.18;
        pawGroup.add(pawTip);

        pawGroup.position.set(side * 0.24, 0.08, 0.32);
        pawGroup.rotation.z = side * -0.45;
        pawGroup.rotation.x = -0.35;
        pawGroup.castShadow = true;
        doll.add(pawGroup);
      });

      // Long Authentic Bunny Hind Feet (Patas traseras de conejo con almohadillas rosas)
      [-1, 1].forEach((side) => {
        const thigh = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), primaryMat);
        thigh.scale.set(0.85, 1.1, 1.1);
        thigh.position.set(side * 0.34, -0.42, 0.02);
        doll.add(thigh);

        // Big Long Foot extending forward onto pedestal floor
        const foot = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), primaryMat);
        foot.scale.set(0.9, 0.58, 1.6);
        foot.position.set(side * 0.32, -0.68, 0.28);
        foot.castShadow = true;

        // Big Pink Heel Pad
        const mainPad = new THREE.Mesh(new THREE.CircleGeometry(0.08, 16), pinkMat);
        mainPad.rotation.x = -Math.PI / 2 + 0.2;
        mainPad.position.set(0, 0.11, 0.05);
        foot.add(mainPad);

        // 3 Little Pink Toe Pads
        [-0.05, 0, 0.05].forEach((tx) => {
          const toePad = new THREE.Mesh(new THREE.CircleGeometry(0.025, 12), pinkMat);
          toePad.rotation.x = -Math.PI / 2 + 0.2;
          toePad.position.set(tx, 0.11, 0.22);
          foot.add(toePad);
        });

        doll.add(foot);
      });

      // Fluffy White Pompom Tail (Colita redonda de pompón)
      const tail = new THREE.Mesh(new THREE.SphereGeometry(0.18, 20, 20), secondaryMat);
      tail.position.set(0, -0.38, -0.48);
      tail.castShadow = true;
      doll.add(tail);
    }

    // ========================================================
    // DYNAMIC 3D ACCESSORIES (Positioned per Character)
    // ========================================================
    const acc = accessoriesGroupRef.current;

    // 1. Sombrero con cinta
    if (accessories.includes('sombrero')) {
      const hatGroup = new THREE.Group();
      const hatMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.75,
        bumpMap: crochetTexture,
        bumpScale: 0.035,
      });

      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.6, 0.05, 36), hatMat);
      hatGroup.add(brim);

      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.44, 0.38, 36), hatMat);
      crown.position.y = 0.2;
      hatGroup.add(crown);

      const bandMat = new THREE.MeshStandardMaterial({ color: 0xec4899 });
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.445, 0.445, 0.07, 36), bandMat);
      band.position.y = 0.06;
      hatGroup.add(band);

      const hatY =
        charId === 'conejo' ? 1.25 :
        charId === 'gato' ? 1.22 :
        charId === 'perro' ? 1.24 :
        charId === 'stitch' ? 1.48 :
        charId === 'dino' ? 1.55 : 1.40;
      const hatX = charId === 'conejo' ? 0.22 : 0.12;

      hatGroup.position.set(hatX, hatY, 0.05);
      hatGroup.rotation.z = -0.18;
      hatGroup.rotation.x = -0.10;
      acc.add(hatGroup);
    }

    // 2. Corazón Plush
    if (accessories.includes('corazon') && charId !== 'gato') {
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.7,
        bumpMap: crochetTexture,
        bumpScale: 0.04,
      });

      const heartGroup = new THREE.Group();
      const lLob = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), heartMat);
      lLob.position.set(-0.1, 0.1, 0);
      heartGroup.add(lLob);

      const rLob = new THREE.Mesh(new THREE.SphereGeometry(0.14, 16, 16), heartMat);
      rLob.position.set(0.1, 0.1, 0);
      heartGroup.add(rLob);

      const pt = new THREE.Mesh(new THREE.ConeGeometry(0.22, 0.32, 16), heartMat);
      pt.rotation.z = Math.PI;
      pt.position.set(0, -0.09, 0);
      heartGroup.add(pt);

      const heartY =
        charId === 'dino' ? 0.22 :
        charId === 'stitch' ? 0.15 :
        charId === 'perro' ? 0.10 :
        charId === 'conejo' ? 0.08 : 0.12;

      heartGroup.position.set(0, heartY, 0.52);
      heartGroup.scale.set(1.1, 1.1, 0.9);
      acc.add(heartGroup);
    }

    // 3. Moño / Pajarita
    if (accessories.includes('mono')) {
      const bowMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.6 });
      const bowGroup = new THREE.Group();

      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.08, 14, 14), bowMat);
      bowGroup.add(knot);

      const wL = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 14), bowMat);
      wL.rotation.z = Math.PI / 2;
      wL.position.set(-0.15, 0, 0);
      bowGroup.add(wL);

      const wR = new THREE.Mesh(new THREE.ConeGeometry(0.13, 0.24, 14), bowMat);
      wR.rotation.z = -Math.PI / 2;
      wR.position.set(0.15, 0, 0);
      bowGroup.add(wR);

      const bowY =
        charId === 'dino' ? 0.48 :
        charId === 'stitch' ? 0.42 :
        charId === 'perro' ? 0.36 :
        charId === 'gato' ? 0.34 :
        charId === 'conejo' ? 0.32 : 0.32;
      const bowZ =
        charId === 'dino' ? 0.58 :
        charId === 'perro' ? 0.52 : 0.50;

      bowGroup.position.set(0, bowY, bowZ);
      acc.add(bowGroup);
    }

    // 4. Bufanda
    if (accessories.includes('bufanda')) {
      const scarfMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.8,
        bumpMap: crochetTexture,
        bumpScale: 0.05,
      });

      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.52, 0.12, 16, 36), scarfMat);
      torus.rotation.x = Math.PI / 2 + 0.1;

      const scarfY =
        charId === 'dino' ? 0.45 :
        charId === 'stitch' ? 0.38 :
        charId === 'perro' ? 0.34 :
        charId === 'gato' ? 0.30 :
        charId === 'conejo' ? 0.28 : 0.28;

      torus.position.set(0, scarfY, 0.02);
      acc.add(torus);

      const tail = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.42, 0.07), scarfMat);
      tail.position.set(0.22, scarfY - 0.26, 0.52);
      tail.rotation.z = -0.15;
      acc.add(tail);
    }

    // 5. Llavero Metálico
    if (accessories.includes('llavero')) {
      const ringGroup = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.032, 16, 36), metalMat);
      ring.position.y = 0.28;
      ringGroup.add(ring);

      const chain = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.022, 12, 24), metalMat);
      chain.position.y = 0.08;
      ringGroup.add(chain);

      const keyRingY =
        charId === 'dino' ? 1.62 :
        charId === 'stitch' ? 1.62 :
        charId === 'pollito' ? 1.58 :
        charId === 'conejo' ? 1.48 :
        charId === 'gato' ? 1.34 : 1.32;

      ringGroup.position.set(0, keyRingY, 0);
      acc.add(ringGroup);
    }

    // Scale whole doll according to Size and keep feet anchored to pedestal (-0.72)
    const scaleFactor = size === 'mini' ? 0.82 : size === 'grande' ? 1.25 : 1.0;
    doll.scale.set(scaleFactor, scaleFactor, scaleFactor);
    acc.scale.set(scaleFactor, scaleFactor, scaleFactor);

    const baseOffset = -0.72 * (1 - scaleFactor);
    doll.position.y = baseOffset;
    acc.position.y = baseOffset;

  }, [character, primaryColor, secondaryColor, accessories, size]);

  const resetCamera = () => {
    if (controlsRef.current && cameraRef.current) {
      cameraRef.current.position.set(0, 0.8, 5.0);
      controlsRef.current.target.set(0, 0.25, 0);
      controlsRef.current.update();
    }
  };

  return (
    <div className="viewer-3d-wrapper">
      {/* 3D WebGL Canvas */}
      <div ref={mountRef} className="viewer-3d-canvas-container" />

      {/* Floating 3D Controls */}
      <div className="viewer-3d-controls-overlay">
        <button
          className={`viewer-btn ${autoRotate ? 'active' : ''}`}
          onClick={() => setAutoRotate(!autoRotate)}
          title="Giro automático 360°"
          aria-label="Alternar giro 360°"
        >
          <span>🔄 {autoRotate ? 'Giro ON' : 'Giro OFF'}</span>
        </button>

        <button
          className={`viewer-btn ${lightingMode === 'neon' ? 'active' : ''}`}
          onClick={() => setLightingMode(lightingMode === 'warm' ? 'neon' : 'warm')}
          title="Cambiar iluminación de estudio"
          aria-label="Cambiar iluminación"
        >
          <span>💡 {lightingMode === 'neon' ? 'Modo Neón' : 'Luz Estudio'}</span>
        </button>

        <button
          className="viewer-btn"
          onClick={resetCamera}
          title="Reiniciar ángulo de cámara"
          aria-label="Reiniciar cámara"
        >
          <span>🎯 Centrar</span>
        </button>
      </div>

      {/* Interaction Guide */}
      <div className="viewer-3d-hint">
        <span>👆 Arrastra para girar 360° · Rueda para zoom · Clic derecho para desplazar</span>
      </div>

      {/* Quality Callout Badges */}
      <div className="viewer-hotspots-row">
        <button
          className={`hotspot-chip ${activeHotspot === 'yarn' ? 'active' : ''}`}
          onClick={() => setActiveHotspot(activeHotspot === 'yarn' ? null : 'yarn')}
        >
          <span>🧵 Punto Amigurumi 3D</span>
        </button>
        <button
          className={`hotspot-chip ${activeHotspot === 'eyes' ? 'active' : ''}`}
          onClick={() => setActiveHotspot(activeHotspot === 'eyes' ? null : 'eyes')}
        >
          <span>👁️ Ojos Térmicos Reales</span>
        </button>
        <button
          className={`hotspot-chip ${activeHotspot === 'craft' ? 'active' : ''}`}
          onClick={() => setActiveHotspot(activeHotspot === 'craft' ? null : 'craft')}
        >
          <span>🪡 Silueta Fiel al Producto</span>
        </button>
      </div>

      {/* Tooltip Details */}
      {activeHotspot === 'yarn' && (
        <div className="hotspot-tooltip">
          <strong>Textura de Tejido Crochet Realista:</strong>
          <p>Modelado con textura procedural de bucles de hilo de algodón antialérgico que reacciona a la luz.</p>
        </div>
      )}
      {activeHotspot === 'eyes' && (
        <div className="hotspot-tooltip">
          <strong>Ojos de Seguridad con Brillo Especular:</strong>
          <p>Ojos esféricos de plástico brillante con reflejo térmico idénticos a los muñecos terminados.</p>
        </div>
      )}
      {activeHotspot === 'craft' && (
        <div className="hotspot-tooltip">
          <strong>Anatomía Exacta de Cada Personaje:</strong>
          <p>Orejas gigantes ahuecadas para Stitch, cresta dorsal ondulada para el Dino y gorro toque para el pollito.</p>
        </div>
      )}
    </div>
  );
}
