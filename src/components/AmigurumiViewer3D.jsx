import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Generate procedural crochet yarn texture
function createCrochetTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, 256, 256);

  // Draw interlocking crochet stitches pattern
  ctx.lineWidth = 4;
  for (let y = 0; y < 256; y += 16) {
    for (let x = 0; x < 256; x += 16) {
      const offset = (Math.floor(y / 16) % 2) * 8;
      const px = (x + offset) % 256;
      
      // Loop stitch highlight
      ctx.strokeStyle = '#b0b0b0';
      ctx.beginPath();
      ctx.arc(px + 8, y + 8, 6, 0, Math.PI);
      ctx.stroke();

      // Loop stitch shadow
      ctx.strokeStyle = '#505050';
      ctx.beginPath();
      ctx.arc(px + 8, y + 8, 6, Math.PI, Math.PI * 2);
      ctx.stroke();
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(12, 12);
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

    // Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // Camera
    const width = currentMount.clientWidth;
    const height = currentMount.clientHeight || 420;
    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 100);
    camera.position.set(0, 1.2, 4.5);

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    currentMount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 2.2;
    controls.maxDistance = 7.0;
    controls.maxPolarAngle = Math.PI / 2 + 0.1; // Don't go completely under floor
    controls.target.set(0, 0.4, 0);
    controls.autoRotate = autoRotate;
    controls.autoRotateSpeed = 2.0;
    controlsRef.current = controls;

    // Studio Environment & Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    ambientLight.name = 'ambient';
    scene.add(ambientLight);

    const mainKeyLight = new THREE.DirectionalLight(0xfff1e6, 1.8);
    mainKeyLight.position.set(3, 5, 4);
    mainKeyLight.castShadow = true;
    mainKeyLight.shadow.mapSize.width = 1024;
    mainKeyLight.shadow.mapSize.height = 1024;
    mainKeyLight.shadow.bias = -0.001;
    mainKeyLight.name = 'mainKey';
    scene.add(mainKeyLight);

    const fillLight = new THREE.DirectionalLight(0xdbeafe, 0.8);
    fillLight.position.set(-4, 2, 2);
    fillLight.name = 'fillLight';
    scene.add(fillLight);

    const rimLight = new THREE.DirectionalLight(0xff2d78, 1.4);
    rimLight.position.set(0, 4, -4);
    rimLight.name = 'rimLight';
    scene.add(rimLight);

    // Shadow catcher floor
    const floorGeo = new THREE.PlaneGeometry(10, 10);
    const floorMat = new THREE.ShadowMaterial({ opacity: 0.25 });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.75;
    floor.receiveShadow = true;
    scene.add(floor);

    // Pedestal ring
    const pedestalGeo = new THREE.CylinderGeometry(1.4, 1.6, 0.1, 48);
    const pedestalMat = new THREE.MeshStandardMaterial({
      color: 0x11111a,
      roughness: 0.4,
      metalness: 0.3,
    });
    const pedestal = new THREE.Mesh(pedestalGeo, pedestalMat);
    pedestal.position.y = -0.8;
    pedestal.receiveShadow = true;
    scene.add(pedestal);

    // Groups
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

    // Handle Resize
    const handleResize = () => {
      if (!currentMount) return;
      const newWidth = currentMount.clientWidth;
      const newHeight = currentMount.clientHeight || 420;
      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
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

  // Update Auto-Rotate
  useEffect(() => {
    if (controlsRef.current) {
      controlsRef.current.autoRotate = autoRotate;
    }
  }, [autoRotate]);

  // Update Studio Lighting Mode
  useEffect(() => {
    if (!sceneRef.current) return;
    const rim = sceneRef.current.getObjectByName('rimLight');
    const mainKey = sceneRef.current.getObjectByName('mainKey');
    const fill = sceneRef.current.getObjectByName('fillLight');

    if (lightingMode === 'neon') {
      if (rim) { rim.color.setHex(0x06b6d4); rim.intensity = 2.4; }
      if (mainKey) { mainKey.color.setHex(0xff2d78); mainKey.intensity = 1.6; }
      if (fill) { fill.color.setHex(0xa855f7); fill.intensity = 1.2; }
    } else {
      if (rim) { rim.color.setHex(0xff80aa); rim.intensity = 1.2; }
      if (mainKey) { mainKey.color.setHex(0xfff7ed); mainKey.intensity = 1.8; }
      if (fill) { fill.color.setHex(0xdbeafe); fill.intensity = 0.8; }
    }
  }, [lightingMode]);

  // Build / Rebuild 3D Amigurumi Mesh based on Character & Colors
  useEffect(() => {
    if (!dollGroupRef.current || !accessoriesGroupRef.current) return;

    // Clear old meshes
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

    const crochetBump = createCrochetTexture();

    // Material 1: Primary Yarn
    const primaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(primaryColor.hex),
      roughness: 0.88,
      metalness: 0.05,
      bumpMap: crochetBump,
      bumpScale: 0.04,
    });

    // Material 2: Secondary / Accent Yarn
    const secondaryMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color(secondaryColor.hex),
      roughness: 0.88,
      metalness: 0.05,
      bumpMap: crochetBump,
      bumpScale: 0.04,
    });

    // Material 3: Shiny Thermal Safety Eyes
    const eyesMat = new THREE.MeshStandardMaterial({
      color: 0x07070b,
      roughness: 0.1,
      metalness: 0.3,
    });

    // Material 4: Eye reflection white dot
    const eyeHighlightMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

    // Material 5: Metallic Keychain
    const metalMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      roughness: 0.25,
      metalness: 0.85,
    });

    const doll = dollGroupRef.current;

    // ── 1. BODY ──
    const bodyGeo = new THREE.SphereGeometry(0.55, 36, 36);
    bodyGeo.scale(1, 1.15, 0.95);
    const body = new THREE.Mesh(bodyGeo, primaryMat);
    body.position.set(0, 0, 0);
    body.castShadow = true;
    body.receiveShadow = true;
    doll.add(body);

    // Tummy patch (Secondary Color)
    const tummyGeo = new THREE.SphereGeometry(0.36, 28, 28);
    tummyGeo.scale(0.85, 1, 0.3);
    const tummy = new THREE.Mesh(tummyGeo, secondaryMat);
    tummy.position.set(0, -0.05, 0.44);
    doll.add(tummy);

    // ── 2. HEAD ──
    const headGeo = new THREE.SphereGeometry(0.68, 36, 36);
    headGeo.scale(1.08, 0.96, 1.02);
    const head = new THREE.Mesh(headGeo, primaryMat);
    head.position.set(0, 0.85, 0);
    head.castShadow = true;
    head.receiveShadow = true;
    doll.add(head);

    // ── 3. SAFETY EYES ──
    const eyeGeo = new THREE.SphereGeometry(0.085, 24, 24);
    const eyeHighlightGeo = new THREE.SphereGeometry(0.025, 12, 12);

    // Left Eye
    const leftEye = new THREE.Mesh(eyeGeo, eyesMat);
    leftEye.position.set(-0.25, 0.88, 0.62);
    const leftGlint = new THREE.Mesh(eyeHighlightGeo, eyeHighlightMat);
    leftGlint.position.set(-0.02, 0.03, 0.07);
    leftEye.add(leftGlint);
    doll.add(leftEye);

    // Right Eye
    const rightEye = new THREE.Mesh(eyeGeo, eyesMat);
    rightEye.position.set(0.25, 0.88, 0.62);
    const rightGlint = new THREE.Mesh(eyeHighlightGeo, eyeHighlightMat);
    rightGlint.position.set(-0.02, 0.03, 0.07);
    rightEye.add(rightGlint);
    doll.add(rightEye);

    // Cheeks blushing (Rosy crochet spots)
    const cheekMat = new THREE.MeshStandardMaterial({
      color: 0xf43f5e,
      roughness: 0.9,
      transparent: true,
      opacity: 0.6,
    });
    const cheekGeo = new THREE.CircleGeometry(0.08, 20);
    const leftCheek = new THREE.Mesh(cheekGeo, cheekMat);
    leftCheek.position.set(-0.35, 0.76, 0.62);
    leftCheek.rotation.y = -0.3;
    doll.add(leftCheek);

    const rightCheek = new THREE.Mesh(cheekGeo, cheekMat);
    rightCheek.position.set(0.35, 0.76, 0.62);
    rightCheek.rotation.y = 0.3;
    doll.add(rightCheek);

    // ── 4. ARMS & LEGS ──
    const limbGeo = new THREE.SphereGeometry(0.18, 20, 20);
    limbGeo.scale(0.8, 1.4, 0.8);

    // Left Arm
    const leftArm = new THREE.Mesh(limbGeo, primaryMat);
    leftArm.position.set(-0.54, 0.15, 0.12);
    leftArm.rotation.z = 0.45;
    leftArm.rotation.x = -0.2;
    leftArm.castShadow = true;
    doll.add(leftArm);

    // Right Arm
    const rightArm = new THREE.Mesh(limbGeo, primaryMat);
    rightArm.position.set(0.54, 0.15, 0.12);
    rightArm.rotation.z = -0.45;
    rightArm.rotation.x = -0.2;
    rightArm.castShadow = true;
    doll.add(rightArm);

    // Feet
    const footGeo = new THREE.SphereGeometry(0.2, 20, 20);
    footGeo.scale(1, 0.7, 1.3);

    const leftFoot = new THREE.Mesh(footGeo, secondaryMat);
    leftFoot.position.set(-0.28, -0.62, 0.15);
    leftFoot.castShadow = true;
    doll.add(leftFoot);

    const rightFoot = new THREE.Mesh(footGeo, secondaryMat);
    rightFoot.position.set(0.28, -0.62, 0.15);
    rightFoot.castShadow = true;
    doll.add(rightFoot);

    // ── 5. CHARACTER-SPECIFIC GEOMETRIES ──
    const charId = character?.id || 'gato';

    if (charId === 'gato') {
      // Pointed Cat Ears
      const earGeo = new THREE.ConeGeometry(0.24, 0.45, 18);
      earGeo.scale(0.8, 1, 0.5);

      const leftEar = new THREE.Mesh(earGeo, primaryMat);
      leftEar.position.set(-0.4, 1.5, 0);
      leftEar.rotation.z = 0.35;
      leftEar.rotation.x = -0.15;
      leftEar.castShadow = true;
      doll.add(leftEar);

      // Inner Ear
      const innerEarGeo = new THREE.ConeGeometry(0.16, 0.35, 18);
      innerEarGeo.scale(0.7, 0.9, 0.3);
      const leftInner = new THREE.Mesh(innerEarGeo, secondaryMat);
      leftInner.position.set(0, -0.02, 0.08);
      leftEar.add(leftInner);

      const rightEar = new THREE.Mesh(earGeo, primaryMat);
      rightEar.position.set(0.4, 1.5, 0);
      rightEar.rotation.z = -0.35;
      rightEar.rotation.x = -0.15;
      rightEar.castShadow = true;
      doll.add(rightEar);

      const rightInner = new THREE.Mesh(innerEarGeo, secondaryMat);
      rightInner.position.set(0, -0.02, 0.08);
      rightEar.add(rightInner);

      // Snout & cute nose
      const noseGeo = new THREE.ConeGeometry(0.04, 0.05, 4);
      const noseMat = new THREE.MeshStandardMaterial({ color: 0xf43f5e });
      const nose = new THREE.Mesh(noseGeo, noseMat);
      nose.position.set(0, 0.8, 0.68);
      nose.rotation.x = Math.PI;
      doll.add(nose);

      // Cat Tail
      const tailCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, -0.4, -0.5),
        new THREE.Vector3(0.1, -0.2, -0.85),
        new THREE.Vector3(0.25, 0.2, -0.8),
        new THREE.Vector3(0.15, 0.45, -0.65),
      ]);
      const tailGeo = new THREE.TubeGeometry(tailCurve, 20, 0.08, 12, false);
      const tail = new THREE.Mesh(tailGeo, primaryMat);
      tail.castShadow = true;
      doll.add(tail);
    } else if (charId === 'perro') {
      // Floppy dog ears
      const earGeo = new THREE.SphereGeometry(0.25, 20, 20);
      earGeo.scale(0.7, 1.6, 0.4);

      const leftEar = new THREE.Mesh(earGeo, secondaryMat);
      leftEar.position.set(-0.65, 1.05, 0);
      leftEar.rotation.z = -0.35;
      leftEar.castShadow = true;
      doll.add(leftEar);

      const rightEar = new THREE.Mesh(earGeo, secondaryMat);
      rightEar.position.set(0.65, 1.05, 0);
      rightEar.rotation.z = 0.35;
      rightEar.castShadow = true;
      doll.add(rightEar);

      // Snout Muzzle
      const snoutGeo = new THREE.SphereGeometry(0.22, 20, 20);
      snoutGeo.scale(1.1, 0.8, 0.9);
      const snout = new THREE.Mesh(snoutGeo, secondaryMat);
      snout.position.set(0, 0.77, 0.58);
      doll.add(snout);

      // Black button nose
      const noseMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2 });
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.06, 16, 16), noseMat);
      nose.position.set(0, 0.83, 0.76);
      doll.add(nose);
    } else if (charId === 'stitch') {
      // Giant Alien Ears
      const earShape = new THREE.SphereGeometry(0.45, 24, 24);
      earShape.scale(1.2, 0.4, 0.25);

      const leftEar = new THREE.Mesh(earShape, primaryMat);
      leftEar.position.set(-0.75, 1.25, 0);
      leftEar.rotation.z = 0.6;
      leftEar.rotation.y = 0.2;
      leftEar.castShadow = true;
      doll.add(leftEar);

      const innerEar = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 20), secondaryMat);
      innerEar.scale.set(1.1, 0.35, 0.15);
      innerEar.position.set(0, 0, 0.05);
      leftEar.add(innerEar);

      const rightEar = new THREE.Mesh(earShape, primaryMat);
      rightEar.position.set(0.75, 1.25, 0);
      rightEar.rotation.z = -0.6;
      rightEar.rotation.y = -0.2;
      rightEar.castShadow = true;
      doll.add(rightEar);

      const rightInner = new THREE.Mesh(new THREE.SphereGeometry(0.35, 20, 20), secondaryMat);
      rightInner.scale.set(1.1, 0.35, 0.15);
      rightInner.position.set(0, 0, 0.05);
      rightEar.add(rightInner);

      // Big Stitch Nose
      const noseMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.3 });
      const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), noseMat);
      nose.scale.set(1.3, 0.8, 1);
      nose.position.set(0, 0.78, 0.68);
      doll.add(nose);
    } else if (charId === 'pollito') {
      // Little wings
      const wingGeo = new THREE.SphereGeometry(0.2, 16, 16);
      wingGeo.scale(0.5, 1.2, 0.7);

      const leftWing = new THREE.Mesh(wingGeo, primaryMat);
      leftWing.position.set(-0.55, 0.1, 0.05);
      leftWing.rotation.z = 0.4;
      doll.add(leftWing);

      const rightWing = new THREE.Mesh(wingGeo, primaryMat);
      rightWing.position.set(0.55, 0.1, 0.05);
      rightWing.rotation.z = -0.4;
      doll.add(rightWing);

      // Orange Beak
      const beakMat = new THREE.MeshStandardMaterial({ color: 0xf97316, roughness: 0.5 });
      const beakGeo = new THREE.ConeGeometry(0.1, 0.2, 16);
      const beak = new THREE.Mesh(beakGeo, beakMat);
      beak.rotation.x = Math.PI / 2;
      beak.position.set(0, 0.8, 0.72);
      doll.add(beak);
    } else if (charId === 'dino') {
      // Dorsal Plates / Spikes
      const spineMat = secondaryMat;
      const spineGeo = new THREE.ConeGeometry(0.12, 0.2, 16);

      for (let i = 0; i < 5; i++) {
        const spine = new THREE.Mesh(spineGeo, spineMat);
        const y = 1.35 - i * 0.35;
        const z = -0.5 - Math.sin(i * 0.4) * 0.25;
        spine.position.set(0, y, z);
        spine.rotation.x = -Math.PI / 3;
        doll.add(spine);
      }

      // Snout
      const dinoSnout = new THREE.Mesh(new THREE.SphereGeometry(0.24, 20, 20), primaryMat);
      dinoSnout.scale.set(0.9, 0.7, 1.1);
      dinoSnout.position.set(0, 0.75, 0.6);
      doll.add(dinoSnout);
    } else if (charId === 'conejo') {
      // Long Bunny Ears
      const bunnyEarGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.8, 16);
      bunnyEarGeo.scale(0.8, 1, 0.4);

      const leftEar = new THREE.Mesh(bunnyEarGeo, primaryMat);
      leftEar.position.set(-0.3, 1.7, 0);
      leftEar.rotation.z = 0.15;
      leftEar.castShadow = true;
      doll.add(leftEar);

      const leftInner = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.6), secondaryMat);
      leftInner.position.set(0, 0, 0.08);
      leftEar.add(leftInner);

      const rightEar = new THREE.Mesh(bunnyEarGeo, primaryMat);
      rightEar.position.set(0.3, 1.7, 0);
      rightEar.rotation.z = -0.15;
      rightEar.castShadow = true;
      doll.add(rightEar);

      const rightInner = new THREE.Mesh(new THREE.PlaneGeometry(0.1, 0.6), secondaryMat);
      rightInner.position.set(0, 0, 0.08);
      rightEar.add(rightInner);
    }

    // ── 6. DYNAMIC 3D ACCESSORIES ──
    const acc = accessoriesGroupRef.current;

    // A. Sombrero / Chef Hat
    if (accessories.includes('sombrero')) {
      const hatGroup = new THREE.Group();
      const hatMat = new THREE.MeshStandardMaterial({
        color: 0xfef08a,
        roughness: 0.7,
        bumpMap: crochetBump,
        bumpScale: 0.03,
      });

      // Brim
      const brim = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.55, 0.05, 32), hatMat);
      brim.position.y = 0;
      hatGroup.add(brim);

      // Crown
      const crown = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.42, 0.35, 32), hatMat);
      crown.position.y = 0.2;
      hatGroup.add(crown);

      // Ribbon Band
      const bandMat = new THREE.MeshStandardMaterial({ color: 0xec4899 });
      const band = new THREE.Mesh(new THREE.CylinderGeometry(0.425, 0.425, 0.06, 32), bandMat);
      band.position.y = 0.06;
      hatGroup.add(band);

      hatGroup.position.set(0.1, 1.48, 0.05);
      hatGroup.rotation.z = -0.15;
      hatGroup.rotation.x = -0.1;
      acc.add(hatGroup);
    }

    // B. Plush Heart
    if (accessories.includes('corazon')) {
      const heartMat = new THREE.MeshStandardMaterial({
        color: 0xef4444,
        roughness: 0.7,
        bumpMap: crochetBump,
        bumpScale: 0.04,
      });

      const heartGroup = new THREE.Group();
      const leftLob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), heartMat);
      leftLob.position.set(-0.08, 0.08, 0);
      heartGroup.add(leftLob);

      const rightLob = new THREE.Mesh(new THREE.SphereGeometry(0.12, 16, 16), heartMat);
      rightLob.position.set(0.08, 0.08, 0);
      heartGroup.add(rightLob);

      const point = new THREE.Mesh(new THREE.ConeGeometry(0.18, 0.28, 16), heartMat);
      point.rotation.z = Math.PI;
      point.position.set(0, -0.08, 0);
      heartGroup.add(point);

      heartGroup.position.set(0, 0.12, 0.55);
      heartGroup.scale.set(1.1, 1.1, 0.9);
      acc.add(heartGroup);
    }

    // C. Moño / Bow Tie
    if (accessories.includes('mono')) {
      const bowMat = new THREE.MeshStandardMaterial({ color: 0xa855f7, roughness: 0.6 });
      const bowGroup = new THREE.Group();

      const knot = new THREE.Mesh(new THREE.SphereGeometry(0.07, 14, 14), bowMat);
      bowGroup.add(knot);

      const wingL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 14), bowMat);
      wingL.rotation.z = Math.PI / 2;
      wingL.position.set(-0.14, 0, 0);
      bowGroup.add(wingL);

      const wingR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.22, 14), bowMat);
      wingR.rotation.z = -Math.PI / 2;
      wingR.position.set(0.14, 0, 0);
      bowGroup.add(wingR);

      bowGroup.position.set(0, 0.38, 0.52);
      acc.add(bowGroup);
    }

    // D. Scarf (Bufanda)
    if (accessories.includes('bufanda')) {
      const scarfMat = new THREE.MeshStandardMaterial({
        color: 0x06b6d4,
        roughness: 0.8,
        bumpMap: crochetBump,
        bumpScale: 0.05,
      });

      const torus = new THREE.Mesh(new THREE.TorusGeometry(0.48, 0.11, 16, 32), scarfMat);
      torus.rotation.x = Math.PI / 2 + 0.1;
      torus.position.set(0, 0.35, 0.02);
      acc.add(torus);

      // Hanging ends
      const endMat = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.06), scarfMat);
      endMat.position.set(0.2, 0.12, 0.48);
      endMat.rotation.z = -0.15;
      acc.add(endMat);
    }

    // E. Metallic Keychain (Llavero)
    if (accessories.includes('llavero')) {
      const ringGroup = new THREE.Group();
      const ring = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 16, 32), metalMat);
      ring.position.y = 0.25;
      ringGroup.add(ring);

      const chain1 = new THREE.Mesh(new THREE.TorusGeometry(0.06, 0.02, 12, 20), metalMat);
      chain1.position.y = 0.08;
      ringGroup.add(chain1);

      ringGroup.position.set(0, 1.5, 0);
      acc.add(ringGroup);
    }

    // Scale whole doll according to Size parameter
    const scaleFactor = size === 'mini' ? 0.8 : size === 'grande' ? 1.25 : 1.0;
    doll.scale.set(scaleFactor, scaleFactor, scaleFactor);
    acc.scale.set(scaleFactor, scaleFactor, scaleFactor);

  }, [character, primaryColor, secondaryColor, accessories, size]);

  const resetCamera = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
    }
  };

  return (
    <div className="viewer-3d-wrapper">
      {/* 3D Canvas Canvas Mount */}
      <div ref={mountRef} className="viewer-3d-canvas-container" />

      {/* Floating 3D Toolbar Controls */}
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

      {/* Interactive 3D Guide Notice */}
      <div className="viewer-3d-hint">
        <span>👆 Arrastra con el mouse/dedo para girar 360° · Rueda para hacer zoom</span>
      </div>

      {/* Interactive Quality Callout Badges */}
      <div className="viewer-hotspots-row">
        <button
          className="hotspot-chip"
          onClick={() => setActiveHotspot(activeHotspot === 'yarn' ? null : 'yarn')}
        >
          <span>🧵 Textura Crochet 3D</span>
        </button>
        <button
          className="hotspot-chip"
          onClick={() => setActiveHotspot(activeHotspot === 'eyes' ? null : 'eyes')}
        >
          <span>👁️ Ojos Térmicos</span>
        </button>
        <button
          className="hotspot-chip"
          onClick={() => setActiveHotspot(activeHotspot === 'craft' ? null : 'craft')}
        >
          <span>🪡 Hecho a Mano</span>
        </button>
      </div>

      {/* Hotspot details popover */}
      {activeHotspot === 'yarn' && (
        <div className="hotspot-tooltip">
          <strong>Textura Crochet Hiperrealista:</strong>
          <p>Modelado con textura procedural de bucles de lana de algodón antialérgico.</p>
        </div>
      )}
      {activeHotspot === 'eyes' && (
        <div className="hotspot-tooltip">
          <strong>Ojos de Seguridad con Traba Térmica:</strong>
          <p>100% seguros para bebés y niños, no se desprenden ni se desgastan.</p>
        </div>
      )}
      {activeHotspot === 'craft' && (
        <div className="hotspot-tooltip">
          <strong>Puntadas Invisibles:</strong>
          <p>Uniones reforzadas a mano para garantizar máxima durabilidad durante años.</p>
        </div>
      )}
    </div>
  );
}
