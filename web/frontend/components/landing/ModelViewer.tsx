// frontend/components/landing/ModelViewer.tsx
"use client";
import '@google/model-viewer';

export function ModelViewer() {
  return (
    <div className="w-full">
      <h3 className="text-xl font-semibold mb-3 text-gray-900 text-center">Durable, Mountable Enclosure (3D)</h3>
      <div className="w-full max-w-md mx-auto rounded-lg border border-gray-200 p-2 bg-white">
        <model-viewer
          src="/assets/sensor.glb"
          poster="/assets/intelvis-poster.jpg"
          alt="Interactive 3D model of the IntelVis sensor"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          style={{ width: '100%', height: '350px' }}
        ></model-viewer>
      </div>
    </div>
  );
}