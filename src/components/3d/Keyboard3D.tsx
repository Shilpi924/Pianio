import { useMemo } from 'react';
import { getAllNotesInRange, isBlackKey } from '../../utils/noteUtils';

interface Keyboard3DProps {
  activeNotes: string[];
  hitNotes: string[];
}

export default function Keyboard3D({ activeNotes, hitNotes }: Keyboard3DProps) {
  // We use C3 to C6 as our visible range
  const allNotes = useMemo(() => getAllNotesInRange('C3', 'C6'), []);
  
  // Calculate white key count to center the keyboard
  const whiteKeyCount = useMemo(() => allNotes.filter(n => !isBlackKey(n)).length, [allNotes]);
  const keyboardWidth = whiteKeyCount; // 1 unit per white key
  const startX = -keyboardWidth / 2 + 0.5;

  let currentWhiteKey = 0;
  const keyPositions = useMemo(() => {
    return allNotes.map((note) => {
      const isBlack = isBlackKey(note);
      let x = 0;
      let y = 0;
      let z = 0;

      if (!isBlack) {
        x = startX + currentWhiteKey;
        y = 0;
        z = 0;
        currentWhiteKey++;
      } else {
        x = startX + currentWhiteKey - 0.5;
        y = 0.25; // Raised higher
        z = -0.5; // Pushed back slightly
      }
      return { note, isBlack, position: [x, y, z] as [number, number, number] };
    });
  }, [allNotes, startX, currentWhiteKey]);

  return (
    <group position={[0, -2, 0]}>
      {keyPositions.map(({ note, isBlack, position }) => {
        const isHit = hitNotes.includes(note);
        const isActive = activeNotes.includes(note);

        return (
          <mesh key={note} position={position}>
            <boxGeometry args={isBlack ? [0.6, 0.5, 2] : [0.95, 0.4, 3]} />
            <meshStandardMaterial 
              color={
                isHit 
                  ? (isBlack ? '#ffaa00' : '#ffcc00') // Highlight when hit
                  : isActive
                  ? '#3b82f6'
                  : isBlack 
                  ? '#111111' 
                  : '#ffffff'
              } 
              emissive={isHit ? '#ffaa00' : '#000000'}
              emissiveIntensity={isHit ? 2 : 0}
              roughness={0.2}
            />
          </mesh>
        );
      })}
    </group>
  );
}
