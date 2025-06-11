// frontend/components/landing/ModelViewer.tsx
"use client";
import '@google/model-viewer';

export function ModelViewer() {
  return (
    // --- LAYOUT FIX: Main container with the EXACT SAME height and flex layout ---
    <div className="w-full flex flex-col h-[480px]">
      <h3 className="text-xl font-semibold mb-4 text-gray-100 text-center">Durable, Mountable Enclosure (3D)</h3>
      {/* --- LAYOUT FIX: This container now fills the remaining space --- */}
      <div className="w-full flex-1 rounded-xl border border-gray-800 p-2 bg-gray-950 shadow-2xl">
        <model-viewer
          src="/assets/sensor.glb"
          poster="/assets/intelvis-poster.jpg"
          alt="Interactive 3D model of the IntelVis sensor"
          auto-rotate
          camera-controls
          shadow-intensity="1"
          // --- LAYOUT FIX: Style is now 100% to fill its parent div ---
          style={{ width: '100%', height: '100%', backgroundColor: 'transparent' }}
        ></model-viewer>
      </div>
    </div>
  );
}