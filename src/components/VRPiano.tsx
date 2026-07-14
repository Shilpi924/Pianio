import React, { useMemo } from 'react';
import { isBlackKey, noteToMidi, midiToNote } from '../utils/noteUtils';
import { audioService } from '../services/audioService';

interface VRPianoKeyProps {
  note: string;
  position: [number, number, number];
  isBlack: boolean;
}

const VRPianoKey: React.FC<VRPianoKeyProps> = ({ note, position, isBlack }) => {
  const [active, setActive] = React.useState(false);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setActive(true);
    audioService.playNote(note);
  };

  const handlePointerUp = (e: any) => {
    e.stopPropagation();
    setActive(false);
  };

  const color = active ? '#60a5fa' : isBlack ? '#1f2937' : '#ffffff';
  
  // Dimensions
  const width = isBlack ? 0.015 : 0.022;
  const height = isBlack ? 0.015 : 0.012;
  const depth = isBlack ? 0.08 : 0.12;

  return (
    <mesh
      position={position}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerOut={handlePointerUp}
    >
      <boxGeometry args={[width, height, depth]} />
      <meshStandardMaterial color={color} />
    </mesh>
  );
};

interface VRPianoProps {
  startNote?: string;
  endNote?: string;
}

const VRPiano: React.FC<VRPianoProps> = ({ startNote = 'C3', endNote = 'C5' }) => {
  const keys = useMemo(() => {
    const startMidi = noteToMidi(startNote);
    const endMidi = noteToMidi(endNote);
    
    const keyData = [];
    let whiteKeyIndex = 0;
    
    // Standard white key width in meters
    const whiteKeyWidth = 0.024;
    
    for (let midi = startMidi; midi <= endMidi; midi++) {
      const note = midiToNote(midi);
      const isBlack = isBlackKey(note);
      
      let xPos = 0;
      let yPos = 0;
      let zPos = 0;
      
      if (isBlack) {
        // Black keys sit between white keys
        xPos = (whiteKeyIndex - 0.5) * whiteKeyWidth;
        yPos = 0.01; // Raised slightly
        zPos = -0.02; // Pushed back
      } else {
        xPos = whiteKeyIndex * whiteKeyWidth;
        yPos = 0;
        zPos = 0;
        whiteKeyIndex++;
      }
      
      keyData.push({ note, isBlack, position: [xPos, yPos, zPos] as [number, number, number] });
    }
    
    // Center the piano
    const totalWidth = whiteKeyIndex * whiteKeyWidth;
    return keyData.map(key => ({
      ...key,
      position: [key.position[0] - totalWidth / 2, key.position[1], key.position[2]] as [number, number, number]
    }));
    
  }, [startNote, endNote]);

  return (
    <group position={[0, 1, -0.4]}>
      {keys.map(key => (
        <VRPianoKey
          key={key.note}
          note={key.note}
          isBlack={key.isBlack}
          position={key.position}
        />
      ))}
    </group>
  );
};

export default VRPiano;
