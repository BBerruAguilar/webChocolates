import { Suspense, useState, useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, useGLTF, Center, ContactShadows } from '@react-three/drei'
import * as THREE from 'three'

function ModeloElegante({ isMobile }: { isMobile: boolean }) {
  const { scene } = useGLTF('/models/cacao.gltf') 
  const modelRef = useRef<THREE.Group>(null!)
  
  const responsiveScale = isMobile ? 50 : 100

  // Animación de exhibidor premium
  useFrame((state) => {
    if (!modelRef.current) return
    
    // 1. Rotación continua y muy suave (vitrina)
    modelRef.current.rotation.y += 0.003

    // 2. Inclinación sutil que reacciona al mouse, sin exagerar
    const targetX = (state.mouse.y * 0.15)
    const targetZ = -(state.mouse.x * 0.15)
    
    modelRef.current.rotation.x = THREE.MathUtils.lerp(modelRef.current.rotation.x, targetX, 0.05)
    modelRef.current.rotation.z = THREE.MathUtils.lerp(modelRef.current.rotation.z, targetZ, 0.05)
  })

  return (
    <Center>
      <group ref={modelRef}>
        <primitive object={scene} scale={responsiveScale} />
      </group>
    </Center>
  )
}

export default function HeroCanvas() {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  return (
    <Canvas 
      camera={{ position: [0, 0, 15], fov: 45 }}
      style={{ background: 'transparent', height: '100%', width: '100%' }}
    >
      <ambientLight intensity={1.5} color="#ffffff" />
      <directionalLight position={[10, 10, 10]} intensity={2.5} color="#fff1e0" />
      <directionalLight position={[-10, -10, -5]} intensity={1} color="#4a2a17" />
      
      <Environment preset="city" />

      <Suspense fallback={null}>
        <ModeloElegante isMobile={isMobile} />
        
        {/* Sombra más firme para anclar el producto */}
        <ContactShadows 
          position={[0, -2.5, 0]} 
          opacity={0.8} 
          scale={15} 
          blur={2.5} 
          far={4} 
          color="#2e1b10" 
        />
      </Suspense>
    </Canvas>
  )
}