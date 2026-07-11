import { Canvas } from '@react-three/fiber';
import { EffectComposer, Bloom } from '@react-three/postprocessing';
import { PerspectiveCamera, Environment } from '@react-three/drei';
import Keyboard3D from './Keyboard3D';
import Note3D from './Note3D';
import HitZone3D from './HitZone3D';
import { useAppStore } from '../../store/useAppStore';

interface FallingNoteData {
  note: string;
  hand: 'left' | 'right';
  yPosition: number;
  length: number;
  id: string; // Unique ID for React key
}

interface PianoScene3DProps {
  fallingNotes: FallingNoteData[];
  activeNotes: string[];
  hitNotes: string[];
}

export default function PianoScene3D({ fallingNotes, activeNotes, hitNotes }: PianoScene3DProps) {
  const { settings } = useAppStore();
  const highPerformance = settings.highPerformanceGraphics ?? true;

  return (
    <Canvas
      shadows
      gl={{ antialias: true, alpha: true }}
      camera={{ position: [0, 8, 10], fov: 60 }}
    >
      <color attach="background" args={['#0f172a']} /> {/* Slate 900 background */}
      
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight position={[10, 20, 5]} intensity={1.5} castShadow />
      <pointLight position={[0, 5, 0]} intensity={2} color="#48dbfb" />
      
      {/* Camera */}
      <PerspectiveCamera makeDefault position={[0, 8, 12]} rotation={[-0.5, 0, 0]} />

      {/* Environment reflections */}
      <Environment preset="city" />

      {/* Keyboard & Hit Zone */}
      <Keyboard3D activeNotes={activeNotes} hitNotes={hitNotes} />
      <HitZone3D />

      {/* Falling Notes */}
      <group>
        {fallingNotes.map((note) => (
          <Note3D 
            key={note.id} 
            note={note.note} 
            hand={note.hand} 
            yPosition={note.yPosition} 
            length={note.length} 
          />
        ))}
      </group>

      {/* Post Processing / Glow effects */}
      {highPerformance && (
        <EffectComposer>
          <Bloom luminanceThreshold={1} luminanceSmoothing={0.9} intensity={2} />
        </EffectComposer>
      )}
    </Canvas>
  );
}
