import React from 'react';
import { Canvas } from '@react-three/fiber';
import { createXRStore, XR } from '@react-three/xr';
import { OrbitControls, Environment, ContactShadows } from '@react-three/drei';
import { ArrowLeft, Glasses } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import VRPiano from '../components/VRPiano';

// Create the XR store instance (must be outside the component or memoized)
const store = createXRStore({
  depthSensing: true,
  handTracking: true
});

const VRPianoPage: React.FC = () => {
  const { setCurrentView } = useAppStore();

  return (
    <div className="h-screen w-full bg-slate-900 relative overflow-hidden">
      {/* HUD Overlay */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-center z-10 pointer-events-none">
        <button
          onClick={() => setCurrentView('home')}
          className="pointer-events-auto flex items-center gap-2 px-4 py-2 bg-slate-800/80 backdrop-blur text-white rounded-full hover:bg-slate-700 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Back to Home
        </button>

        <div className="flex gap-4 pointer-events-auto">
          <button
            onClick={() => store.enterAR()}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-500 transition-colors shadow-lg shadow-blue-500/20"
          >
            <Glasses className="w-5 h-5" />
            Enter AR
          </button>
          <button
            onClick={() => store.enterVR()}
            className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white font-semibold rounded-full hover:bg-purple-500 transition-colors shadow-lg shadow-purple-500/20"
          >
            <Glasses className="w-5 h-5" />
            Enter VR
          </button>
        </div>
      </div>

      {/* 3D Scene */}
      <Canvas camera={{ position: [0, 1.5, 1], fov: 60 }}>
        <XR store={store}>
          <color attach="background" args={['#0f172a']} />
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          
          <Environment preset="studio" />
          
          <VRPiano startNote="C3" endNote="C5" />
          
          {/* Floor for shadow catching */}
          <ContactShadows position={[0, 0, 0]} opacity={0.4} scale={5} blur={2.5} far={4} />
          
          {/* Fallback controls when not in XR */}
          <OrbitControls 
            enablePan={true}
            enableZoom={true}
            minPolarAngle={0}
            maxPolarAngle={Math.PI / 2}
          />
        </XR>
      </Canvas>

      {/* Helper text */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-slate-400 text-center pointer-events-none">
        <p className="font-medium text-white mb-1">WebXR Piano Prototype</p>
        <p className="text-sm">Put on your Meta Quest or Apple Vision Pro and click Enter AR.</p>
        <p className="text-sm">You can also drag to look around in the browser.</p>
      </div>
    </div>
  );
};

export default VRPianoPage;
