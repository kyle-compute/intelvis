// frontend/components/landing/ModelViewer.tsx
'use client';

import { Canvas } from '@react-three/fiber';
import { useGLTF, OrbitControls, Environment } from '@react-three/drei';
import { Suspense, ComponentProps } from 'react';

type ModelProps = Omit<ComponentProps<'primitive'>, 'object'>;

function Model(props: ModelProps) {
  const { scene } = useGLTF('/assets/sensor.glb');
  return <primitive object={scene} {...props} />;
}

export default function ModelViewer() {
  return (
    <div className="flex h-full w-full flex-col">
      <h3 className="mb-4 text-center text-xl font-semibold text-gray-100">Interactive 3D Model</h3>
      {/*
        FIX: Removed `flex-1` from the container and applied `aspect-[4/3]`.
        This makes it perfectly match the carousel's size and responsiveness.
      */}
      <div className="aspect-[4/3] w-full rounded-xl border border-gray-800 bg-gray-950 p-2 shadow-2xl">
        <Canvas camera={{ position: [0, 0, 7], fov: 50 }}>
          <Suspense fallback={null}>
            <ambientLight intensity={0.5} />
            <directionalLight position={[10, 10, 5]} intensity={1.5} />
            <Model scale={1.5} />
            <Environment preset="city" />
          </Suspense>
          <OrbitControls autoRotate autoRotateSpeed={0.5} enableZoom={true} />
        </Canvas>
      </div>
    </div>
  );
}

useGLTF.preload('/assets/sensor.glb');