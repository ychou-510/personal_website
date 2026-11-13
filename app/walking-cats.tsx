'use client'

import React from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

type CatAction =
  'walk' | 'groom' | 'sleep' | 'stretch' | 'play' | 'chase' | 'belly'

type CatRig = {
  model: THREE.Group
  root: THREE.Group
  bones: Map<string, THREE.Object3D>
  restBoneQuaternions: Map<string, THREE.Quaternion>
  restBonePositions: Map<string, THREE.Vector3>
  baseRootY: number
  action: CatAction
  previousAction: CatAction
  position: number
  direction: number
  speed: number
  hovered: boolean
  petting: boolean
  rub: number
}

const CAT_MODELS = [
  {
    name: 'Golden cat',
    src: '/models/cat-yuling-golden.glb',
    height: 2.3,
    shape: [1.03, 1.03, 0.96],
  },
  {
    name: 'Orange cat',
    src: '/models/cat-yuling-orange.glb',
    height: 2.08,
    shape: [0.98, 0.98, 1.0],
  },
  {
    name: 'Cream cat',
    src: '/models/cat-yuling-cream.glb',
    height: 2.3,
    shape: [0.94, 1.04, 1.08],
  },
] as const

const IDLE_ACTIONS: CatAction[] = ['walk', 'groom', 'sleep', 'stretch', 'play']

const ANIMATED_BONES = [
  'Bone.001',
  'Bone.002',
  'Bone.004',
  'tail1',
  'tail2',
  'tail3',
  'tail4',
  'tail5',
  'leg1_R',
  'leg2_R',
  'leg3_R',
  'leg1_L',
  'leg2_L',
  'leg3_L',
  'paw1_R',
  'paw2_R',
  'paw3_R',
  'paw1_L',
  'paw2_L',
  'paw3_L',
  'leg3_control_R',
  'leg3_control_L',
  'paw_control_R',
  'paw_control_L',
] as const

const damp = (value: number, target: number, factor: number) =>
  THREE.MathUtils.lerp(value, target, factor)

function createFurBumpTexture() {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 128
  const context = canvas.getContext('2d')
  if (!context) return null

  context.fillStyle = '#777'
  context.fillRect(0, 0, canvas.width, canvas.height)
  let seed = 1937
  const random = () => {
    seed = (seed * 16807) % 2147483647
    return (seed - 1) / 2147483646
  }
  for (let index = 0; index < 2600; index += 1) {
    const tone = Math.round(82 + random() * 76)
    const x = random() * canvas.width
    const y = random() * canvas.height
    context.strokeStyle = `rgb(${tone}, ${tone}, ${tone})`
    context.globalAlpha = 0.28 + random() * 0.38
    context.lineWidth = 0.45 + random() * 0.55
    context.beginPath()
    context.moveTo(x, y)
    context.lineTo(x + (random() - 0.5) * 1.2, y + 1.5 + random() * 2.5)
    context.stroke()
  }
  context.globalAlpha = 1

  const texture = new THREE.CanvasTexture(canvas)
  texture.wrapS = THREE.RepeatWrapping
  texture.wrapT = THREE.RepeatWrapping
  texture.repeat.set(7, 7)
  texture.colorSpace = THREE.NoColorSpace
  return texture
}

function setAction(rig: CatRig, action: CatAction) {
  if (!rig.hovered) rig.action = action
}

function animateRig(rig: CatRig, elapsed: number, delta: number) {
  const offsets = new Map<string, THREE.Euler>()
  const positionOffsets = new Map<string, THREE.Vector3>()
  const pace = rig.action === 'chase' ? 11.5 : 6.6
  const phase = elapsed * pace + rig.position * 0.012
  const breathe = Math.sin(elapsed * 2.1 + rig.position * 0.01)
  const ease = 1 - Math.exp(-delta * 7.5)
  let rootY = rig.baseRootY
  let rootXRotation = 0
  let rootZRotation = 0
  let rootScaleX = 1
  let rootScaleY = 1

  const rotate = (name: string, x = 0, y = 0, z = 0) => {
    offsets.set(name, new THREE.Euler(x, y, z, 'XYZ'))
  }
  const move = (name: string, y = 0, z = 0, x = 0) => {
    positionOffsets.set(name, new THREE.Vector3(x, y, z))
  }
  const poseLimb = (
    prefix: 'leg' | 'paw',
    side: 'R' | 'L',
    upper: number,
    lower: number,
    tip: number,
    lift = 0,
    travel = 0,
  ) => {
    rotate(`${prefix}1_${side}`, upper)
    rotate(`${prefix}2_${side}`, lower)
    rotate(`${prefix === 'leg' ? 'leg3' : 'paw3'}_${side}`, tip)
    move(
      prefix === 'leg' ? `leg3_control_${side}` : `paw_control_${side}`,
      lift,
      travel,
    )
  }

  if (rig.action === 'walk' || rig.action === 'chase') {
    const stride = rig.action === 'chase' ? 0.56 : 0.38
    const stepR = Math.sin(phase)
    const stepL = Math.sin(phase + Math.PI)
    const liftR = Math.max(0, Math.sin(phase + 0.35))
    const liftL = Math.max(0, Math.sin(phase + Math.PI + 0.35))
    poseLimb(
      'leg',
      'R',
      stepR * stride,
      liftR * -0.46,
      liftR * 0.22,
      liftR * 0.018,
      stepR * 0.022,
    )
    poseLimb(
      'leg',
      'L',
      stepL * stride,
      liftL * -0.46,
      liftL * 0.22,
      liftL * 0.018,
      stepL * 0.022,
    )
    poseLimb(
      'paw',
      'R',
      stepL * stride,
      liftL * 0.42,
      liftL * -0.2,
      liftL * 0.018,
      stepL * 0.022,
    )
    poseLimb(
      'paw',
      'L',
      stepR * stride,
      liftR * 0.42,
      liftR * -0.2,
      liftR * 0.018,
      stepR * 0.022,
    )
    rootY +=
      Math.abs(Math.sin(phase * 2)) * (rig.action === 'chase' ? 0.05 : 0.025)
    rootZRotation = Math.sin(phase * 2) * 0.018
    rotate('Bone.001', Math.sin(phase * 2) * 0.018)
    rotate('Bone.004', -Math.sin(phase * 2) * 0.035)
    Array.from({ length: 5 }, (_, index) =>
      rotate(
        `tail${index + 1}`,
        Math.sin(phase * 0.48 - index * 0.42) * (0.07 + index * 0.018),
      ),
    )
  }

  if (rig.action === 'groom') {
    const wash = Math.sin(elapsed * 3.1) * 0.12
    rootY -= 0.16
    rootZRotation = 0.38 * rig.direction
    rootScaleX = 0.72
    rootScaleY = 1.06
    poseLimb('leg', 'R', 0.78, -1.15, 0.45)
    poseLimb('leg', 'L', 0.72, -1.08, 0.42)
    poseLimb('paw', 'R', -0.18, 0.54, -0.18)
    poseLimb('paw', 'L', -1.28 + wash, 1.58 - wash * 0.4, -0.55, 0.08, 0.035)
    rotate('Bone.001', -0.12)
    rotate('Bone.002', -0.22)
    rotate('Bone.004', 0.34 + wash * 0.45)
    Array.from({ length: 5 }, (_, index) =>
      rotate(`tail${index + 1}`, 0.08 + index * 0.035),
    )
  }

  if (rig.action === 'sleep') {
    rootY -= 0.015 + breathe * 0.006
    rootZRotation = 0.02
    rootScaleX = 0.7
    rootScaleY = 0.55 + breathe * 0.008
    poseLimb('leg', 'R', 0.82, -1.3, 0.5)
    poseLimb('leg', 'L', 0.76, -1.24, 0.48)
    poseLimb('paw', 'R', -0.62, 1.08, -0.4)
    poseLimb('paw', 'L', -0.58, 1.02, -0.38)
    rotate('Bone.001', -0.28)
    rotate('Bone.002', -0.62)
    rotate('Bone.004', -0.94 + breathe * 0.02)
    Array.from({ length: 5 }, (_, index) =>
      rotate(`tail${index + 1}`, 0.24 + index * 0.12),
    )
  }

  if (rig.action === 'stretch') {
    rootY -= 0.08
    rootZRotation = -0.12 * rig.direction
    rootScaleX = 1.06
    rootScaleY = 0.88
    poseLimb('leg', 'R', -0.1, 0.12, -0.04)
    poseLimb('leg', 'L', -0.06, 0.1, -0.04)
    poseLimb('paw', 'R', 0.52, -0.3, -0.12, 0, 0.045)
    poseLimb('paw', 'L', 0.48, -0.26, -0.1, 0, 0.04)
    rotate('Bone.001', -0.16)
    rotate('Bone.002', -0.28)
    rotate('Bone.004', -0.34 + Math.sin(elapsed * 1.6) * 0.02)
    Array.from({ length: 5 }, (_, index) =>
      rotate(`tail${index + 1}`, -0.08 - index * 0.035),
    )
  }

  if (rig.action === 'play') {
    const pounce = Math.max(0, Math.sin(phase * 0.55))
    rootY -= 0.07 - pounce * 0.05
    rootZRotation = (-0.055 + pounce * 0.04) * rig.direction
    rootScaleX = 1.02
    rootScaleY = 0.86 + pounce * 0.04
    poseLimb('leg', 'R', 0.62, -0.96, 0.36)
    poseLimb('leg', 'L', 0.58, -0.9, 0.32)
    poseLimb('paw', 'R', 0.38, -0.28, -0.1, pounce * 0.018, 0.03)
    poseLimb('paw', 'L', 0.34, -0.24, -0.08, pounce * 0.018, 0.028)
    rotate('Bone.004', -0.16 + Math.sin(phase * 0.7) * 0.05)
    Array.from({ length: 5 }, (_, index) =>
      rotate(
        `tail${index + 1}`,
        Math.sin(phase - index * 0.55) * (0.16 + index * 0.035),
      ),
    )
  }

  if (rig.action === 'belly') {
    const happy = rig.petting ? Math.sin(elapsed * 13) : Math.sin(elapsed * 2.6)
    rootY -= 0.12
    rootXRotation = -1.04 + happy * (rig.petting ? 0.035 : 0.012)
    rootZRotation = -0.08 * rig.direction + rig.rub * 0.035
    rootScaleX = 0.96
    rootScaleY = 0.92 + happy * 0.008
    poseLimb('leg', 'R', -0.72, -1.02, 0.48)
    poseLimb('leg', 'L', -0.58, -0.92, 0.44)
    poseLimb('paw', 'R', 0.88, 1.0, -0.48)
    poseLimb('paw', 'L', 0.72, 0.9, -0.42)
    rotate('Bone.002', 0.12)
    rotate('Bone.004', 0.18 + rig.rub * 0.12 + happy * 0.025)
    Array.from({ length: 5 }, (_, index) =>
      rotate(`tail${index + 1}`, 0.08 + index * 0.04 + happy * 0.025),
    )
  }

  rig.root.rotation.x = damp(rig.root.rotation.x, rootXRotation, ease)
  rig.root.rotation.z = damp(rig.root.rotation.z, rootZRotation, ease)
  rig.root.position.y = damp(rig.root.position.y, rootY, ease)
  rig.root.scale.lerp(new THREE.Vector3(rootScaleX, rootScaleY, 1), ease)

  rig.bones.forEach((bone, name) => {
    const restQuaternion = rig.restBoneQuaternions.get(name)
    const restPosition = rig.restBonePositions.get(name)
    if (!restQuaternion || !restPosition) return
    const rotation = offsets.get(name) ?? new THREE.Euler(0, 0, 0)
    const targetQuaternion = restQuaternion
      .clone()
      .multiply(new THREE.Quaternion().setFromEuler(rotation))
    bone.quaternion.slerp(targetQuaternion, ease)
    bone.position.lerp(
      restPosition
        .clone()
        .add(positionOffsets.get(name) ?? new THREE.Vector3()),
      ease,
    )
  })
}

export function WalkingCats() {
  const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
  const hitRefs = React.useRef<Array<HTMLButtonElement | null>>([])
  const rigsRef = React.useRef<Array<CatRig | null>>([null, null, null])
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const scene = new THREE.Scene()
    const camera = new THREE.OrthographicCamera(-4, 4, 2.8, -0.15, 0.1, 30)
    camera.position.set(0, 0, 8)
    camera.lookAt(0, 0, 0)

    let renderer: THREE.WebGLRenderer
    try {
      renderer = new THREE.WebGLRenderer({
        canvas,
        alpha: true,
        antialias: true,
        powerPreference: 'high-performance',
      })
    } catch {
      canvas.dataset.unavailable = 'true'
      return
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 0)
    renderer.outputColorSpace = THREE.SRGBColorSpace
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.05

    scene.add(new THREE.HemisphereLight(0xfffbf4, 0xb6c0c8, 2.2))
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8)
    keyLight.position.set(-3, 7, 6)
    scene.add(keyLight)
    const fillLight = new THREE.DirectionalLight(0xffd8bd, 1.1)
    fillLight.position.set(5, 3, 4)
    scene.add(fillLight)

    const loader = new GLTFLoader()
    const furBumpTexture = createFurBumpTexture()
    let disposed = false
    let frame = 0
    let behaviorTimer = 0
    let behaviorCycle = 0
    let lastTime = performance.now()
    const reducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches

    const resize = () => {
      const width = window.innerWidth
      const height = width < 640 ? 112 : 150
      renderer.setSize(width, height, false)
      const viewHeight = 2.7
      const viewWidth = viewHeight * (width / height)
      camera.left = -viewWidth / 2
      camera.right = viewWidth / 2
      camera.top = 2.65
      camera.bottom = -0.05
      camera.updateProjectionMatrix()
    }

    resize()
    window.addEventListener('resize', resize)

    Promise.all(
      CAT_MODELS.map(
        (cat) =>
          new Promise<THREE.Group>((resolve, reject) => {
            loader.load(
              cat.src,
              (gltf) => resolve(gltf.scene),
              undefined,
              reject,
            )
          }),
      ),
    )
      .then((models) => {
        if (disposed) return
        models.forEach((model, index) => {
          const cat = CAT_MODELS[index]
          model.traverse((object) => {
            if (!(object instanceof THREE.Mesh)) return
            const sourceMaterials = Array.isArray(object.material)
              ? object.material
              : [object.material]
            const materials = sourceMaterials.map((source, materialIndex) => {
              const material = source.clone()
              if (
                object.name.toLowerCase().includes('sculpt') &&
                'color' in material
              ) {
                const bodyMaterial = material as THREE.MeshStandardMaterial
                bodyMaterial.map = null
                bodyMaterial.color.setHex(0xffffff)
                bodyMaterial.vertexColors = true
                bodyMaterial.roughness = 0.86
                bodyMaterial.metalness = 0
                bodyMaterial.bumpMap = furBumpTexture
                bodyMaterial.bumpScale = 0.022
              }
              if (
                object.name.toLowerCase().includes('eye') &&
                'color' in material
              ) {
                ;(material as THREE.MeshStandardMaterial).color.setHex(
                  materialIndex === 0 ? 0x18130f : 0x4b5134,
                )
                ;(material as THREE.MeshStandardMaterial).roughness = 0.24
                if ('emissive' in material) {
                  ;(material as THREE.MeshStandardMaterial).emissive.setHex(0)
                }
              }
              return material
            })
            object.material = Array.isArray(object.material)
              ? materials
              : materials[0]
            object.castShadow = false
            object.receiveShadow = false
          })

          model.rotation.y = Math.PI / 2 - 0.46
          const unscaledBounds = new THREE.Box3().setFromObject(model)
          const unscaledSize = unscaledBounds.getSize(new THREE.Vector3())
          const responsiveScale = window.innerWidth < 640 ? 0.82 : 1
          const normalizedScale =
            (cat.height * responsiveScale) / unscaledSize.y
          model.scale.set(
            normalizedScale * cat.shape[0],
            normalizedScale * cat.shape[1],
            normalizedScale * cat.shape[2],
          )
          const bounds = new THREE.Box3().setFromObject(model)
          model.position.y = -bounds.min.y + 0.04

          const root = new THREE.Group()
          root.add(model)
          scene.add(root)

          const shadow = new THREE.Mesh(
            new THREE.CircleGeometry(0.82, 32),
            new THREE.MeshBasicMaterial({
              color: 0x4b4038,
              transparent: true,
              opacity: 0.1,
              depthWrite: false,
            }),
          )
          shadow.scale.set(1.15, 0.11, 1)
          shadow.position.set(0, 0.035, -0.8)
          root.add(shadow)

          const bones = new Map<string, THREE.Object3D>()
          const restBoneQuaternions = new Map<string, THREE.Quaternion>()
          const restBonePositions = new Map<string, THREE.Vector3>()
          ANIMATED_BONES.forEach((name) => {
            const bone = model.getObjectByName(name)
            if (!bone) return
            bones.set(name, bone)
            restBoneQuaternions.set(name, bone.quaternion.clone())
            restBonePositions.set(name, bone.position.clone())
          })
          const positions =
            window.innerWidth < 640 ? [0.03, 0.36, 0.69] : [0.1, 0.48, 0.78]
          const directions = [1, -1, 1]
          const rig: CatRig = {
            model,
            root,
            bones,
            restBoneQuaternions,
            restBonePositions,
            baseRootY: root.position.y,
            action: (['walk', 'groom', 'sleep'] as CatAction[])[index],
            previousAction: 'walk',
            position: window.innerWidth * positions[index],
            direction: directions[index],
            speed: index === 1 ? 20 : 24,
            hovered: false,
            petting: false,
            rub: 0,
          }
          rigsRef.current[index] = rig
        })
        setReady(true)
      })
      .catch((error) => console.error('Unable to load the cat models.', error))

    const render = (time: number) => {
      const delta = Math.min((time - lastTime) / 1000, 0.05)
      lastTime = time
      const elapsed = time / 1000
      const canvasWidth = Math.max(1, canvas.clientWidth)
      const frustumWidth = camera.right - camera.left

      rigsRef.current.forEach((rig, index) => {
        if (!rig) return
        if (!reducedMotion && !rig.hovered) {
          const speed =
            rig.action === 'chase' ? 68 : rig.action === 'walk' ? rig.speed : 0
          rig.position += rig.direction * speed * delta
          const catWidth = window.innerWidth < 640 ? 108 : 150
          if (rig.position < 0) {
            rig.position = 0
            rig.direction = 1
          }
          if (rig.position > canvasWidth - catWidth) {
            rig.position = canvasWidth - catWidth
            rig.direction = -1
          }
        }
        rig.position = THREE.MathUtils.clamp(
          rig.position,
          0,
          canvasWidth - (window.innerWidth < 640 ? 108 : 150),
        )

        const center = rig.position + (window.innerWidth < 640 ? 54 : 75)
        rig.root.position.x =
          camera.left + (center / canvasWidth) * frustumWidth
        rig.model.scale.z = Math.abs(rig.model.scale.z) * rig.direction
        animateRig(rig, elapsed, delta)

        const hit = hitRefs.current[index]
        if (hit) hit.style.transform = `translate3d(${rig.position}px, 0, 0)`
      })

      const activeRigs = rigsRef.current.filter((rig): rig is CatRig =>
        Boolean(rig),
      )
      for (let first = 0; first < activeRigs.length; first += 1) {
        for (let second = first + 1; second < activeRigs.length; second += 1) {
          const one = activeRigs[first]
          const two = activeRigs[second]
          const separation = Math.abs(one.position - two.position)
          if (
            one.action === 'chase' &&
            two.action === 'chase' &&
            separation < 88
          ) {
            setAction(one, 'play')
            setAction(two, 'play')
            one.direction *= -1
            two.direction *= -1
          }

          const minimumSeparation = window.innerWidth < 640 ? 108 : 142
          if (!one.hovered && !two.hovered && separation < minimumSeparation) {
            const push = (minimumSeparation - separation) * 0.5
            if (one.position <= two.position) {
              one.position -= push
              two.position += push
            } else {
              one.position += push
              two.position -= push
            }
            one.position = THREE.MathUtils.clamp(
              one.position,
              0,
              canvasWidth - (window.innerWidth < 640 ? 108 : 150),
            )
            two.position = THREE.MathUtils.clamp(
              two.position,
              0,
              canvasWidth - (window.innerWidth < 640 ? 108 : 150),
            )
          }
        }
      }

      renderer.render(scene, camera)
      frame = requestAnimationFrame(render)
    }
    frame = requestAnimationFrame(render)

    behaviorTimer = window.setInterval(() => {
      const rigs = rigsRef.current.filter((rig): rig is CatRig => Boolean(rig))
      if (reducedMotion || rigs.length !== 3) return
      behaviorCycle += 1
      if (behaviorCycle % 4 === 0) {
        const first = behaviorCycle % rigs.length
        const second = (first + 1) % rigs.length
        const direction = rigs[first].position < rigs[second].position ? 1 : -1
        rigs[first].direction = direction
        rigs[second].direction = direction
        setAction(rigs[first], 'chase')
        setAction(rigs[second], 'chase')
        return
      }
      rigs.forEach((rig, index) =>
        setAction(
          rig,
          IDLE_ACTIONS[(behaviorCycle + index) % IDLE_ACTIONS.length],
        ),
      )
    }, 6500)

    return () => {
      disposed = true
      cancelAnimationFrame(frame)
      window.clearInterval(behaviorTimer)
      window.removeEventListener('resize', resize)
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return
        object.geometry.dispose()
        const materials = Array.isArray(object.material)
          ? object.material
          : [object.material]
        materials.forEach((material) => material.dispose())
      })
      renderer.dispose()
      furBumpTexture?.dispose()
      rigsRef.current = [null, null, null]
    }
  }, [])

  const startPetting = (index: number) => {
    const rig = rigsRef.current[index]
    if (!rig) return
    rig.hovered = true
    rig.previousAction = rig.action
    rig.action = 'belly'
  }

  const movePetting = (
    index: number,
    event: React.PointerEvent<HTMLButtonElement>,
  ) => {
    const rig = rigsRef.current[index]
    if (!rig) return
    const bounds = event.currentTarget.getBoundingClientRect()
    rig.rub = ((event.clientX - bounds.left) / bounds.width - 0.5) * 2
    rig.petting = true
    event.currentTarget.classList.add('is-being-petted')
  }

  const stopPetting = (index: number, element: HTMLButtonElement) => {
    const rig = rigsRef.current[index]
    if (!rig) return
    rig.hovered = false
    rig.petting = false
    rig.action = rig.previousAction === 'belly' ? 'walk' : rig.previousAction
    element.classList.remove('is-being-petted')
  }

  return (
    <div
      className={['cats-3d-stage', ready && 'is-ready']
        .filter(Boolean)
        .join(' ')}
      aria-label="Yu-Ling's three cats"
    >
      <canvas ref={canvasRef} className="cats-3d-canvas" aria-hidden="true" />
      {CAT_MODELS.map((cat, index) => (
        <button
          key={cat.name}
          ref={(element) => {
            hitRefs.current[index] = element
          }}
          type="button"
          className="cat-3d-hit-area"
          aria-label={`Pet the ${cat.name.toLowerCase()}`}
          onPointerEnter={() => startPetting(index)}
          onPointerMove={(event) => movePetting(index, event)}
          onPointerLeave={(event) => stopPetting(index, event.currentTarget)}
          onFocus={() => startPetting(index)}
          onBlur={(event) => stopPetting(index, event.currentTarget)}
        >
          <span className="cat-3d-heart" aria-hidden="true">
            ♡
          </span>
        </button>
      ))}
    </div>
  )
}
