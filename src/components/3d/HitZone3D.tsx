import { useMemo } from 'react';
import { getAllNotesInRange } from '../../utils/noteUtils';

export default function HitZone3D() {
  const allNotes = useMemo(() => getAllNotesInRange('C3', 'C6'), []);
  // Count white keys to get full width
  const width = allNotes.filter(n => !n.includes('#') && !n.includes('b')).length;

  return (
    <mesh position={[0, -1, 0]}>
      {/* A thin glowing line that stretches across the keyboard */}
      <boxGeometry args={[width, 0.1, 4]} />
      <meshStandardMaterial 
        color="#ffffff" 
        emissive="#ffffff"
        emissiveIntensity={1}
        transparent
        opacity={0.3}
      />
    </mesh>
  );
}
