import { useMemo } from 'react';
import { isBlackKey, getAllNotesInRange } from '../../utils/noteUtils';

interface Note3DProps {
  note: string;
  hand: 'left' | 'right';
  yPosition: number;
  length: number;
}

const handColors = {
  left: '#ef4444', // Red
  right: '#3b82f6', // Blue
};

// Generate a lookup map for X positions so we don't recalculate it every frame
const X_POSITIONS = (() => {
  const map = new Map<string, number>();
  const allNotes = getAllNotesInRange('C3', 'C6');
  let currentWhiteKey = 0;
  const startX = -(allNotes.filter(n => !isBlackKey(n)).length) / 2 + 0.5;

  allNotes.forEach(note => {
    const isBlack = isBlackKey(note);
    if (!isBlack) {
      map.set(note, startX + currentWhiteKey);
      currentWhiteKey++;
    } else {
      map.set(note, startX + currentWhiteKey - 0.5);
    }
  });
  return map;
})();

export default function Note3D({ note, hand, yPosition, length }: Note3DProps) {
  const x = useMemo(() => X_POSITIONS.get(note) ?? 0, [note]);
  const isBlack = useMemo(() => isBlackKey(note), [note]);

  // Adjust z and width based on whether it's a black or white key
  const z = isBlack ? -0.5 : 0;
  const width = isBlack ? 0.5 : 0.9;
  const color = handColors[hand];

  return (
    <mesh position={[x, yPosition, z]}>
      <boxGeometry args={[width, length, 0.4]} />
      <meshStandardMaterial 
        color={color} 
        emissive={color}
        emissiveIntensity={0.5} // Constant glow as it falls
        transparent
        opacity={0.9}
      />
    </mesh>
  );
}
