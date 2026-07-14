import { useRef, useEffect } from 'react';
import { getAllNotesInRange, isBlackKey } from '../utils/noteUtils';

interface DuetKeyProps {
  note: string;
  isBlack: boolean;
  isLocalActive: boolean;
  isRemoteActive: boolean;
  onPressed: () => void;
  onReleased: () => void;
}

function DuetKey({ note, isBlack, isLocalActive, isRemoteActive, onPressed, onReleased }: DuetKeyProps) {
  let bgColor = isBlack ? 'bg-gray-900' : 'bg-white';
  
  if (isLocalActive && isRemoteActive) {
    bgColor = 'bg-gradient-to-b from-blue-500 to-purple-500';
  } else if (isLocalActive) {
    bgColor = 'bg-blue-500';
  } else if (isRemoteActive) {
    bgColor = 'bg-purple-500';
  }

  const baseClasses = "relative flex-shrink-0 rounded-b-md shadow-sm transition-colors duration-100 ease-out select-none cursor-pointer";
  const blackClasses = "z-10 w-8 h-24 border-x border-b border-gray-950";
  const whiteClasses = "z-0 w-12 h-40 border border-gray-300";

  return (
    <div
      className={`${baseClasses} ${isBlack ? blackClasses : whiteClasses} ${bgColor}`}
      onPointerDown={(e) => {
        e.preventDefault();
        onPressed();
      }}
      onPointerUp={(e) => {
        e.preventDefault();
        onReleased();
      }}
      onPointerOut={onReleased}
      onPointerCancel={onReleased}
    >
      {!isBlack && (
        <div className="absolute bottom-2 left-0 right-0 text-center text-xs font-medium text-gray-400 pointer-events-none">
          {note}
        </div>
      )}
    </div>
  );
}

interface DuetKeyboardProps {
  localActiveNotes: Set<string>;
  remoteActiveNotes: Set<string>;
  onNoteOn: (note: string) => void;
  onNoteOff: (note: string) => void;
}

export default function DuetKeyboard({
  localActiveNotes,
  remoteActiveNotes,
  onNoteOn,
  onNoteOff
}: DuetKeyboardProps) {
  const allNotes = getAllNotesInRange('C3', 'C6');
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  let whiteKeyCount = 0;
  const notePositions = allNotes.map((note) => {
    const isBlack = isBlackKey(note);
    let position;
    
    if (!isBlack) {
      position = { left: whiteKeyCount * 48 };
      whiteKeyCount++;
    } else {
      position = {
        left: (whiteKeyCount - 1) * 48 + 32,
        marginLeft: '-16px'
      };
    }
    
    return { note, isBlack, position };
  });

  const totalWidth = whiteKeyCount * 48;

  useEffect(() => {
    if (scrollContainerRef.current) {
      const container = scrollContainerRef.current;
      container.scrollLeft = (container.scrollWidth - container.clientWidth) / 2;
    }
  }, []);

  return (
    <div 
      ref={scrollContainerRef}
      className="relative w-full overflow-x-auto bg-slate-800 rounded-xl p-4 shadow-2xl hide-scrollbar touch-pan-x select-none"
      style={{ WebkitOverflowScrolling: 'touch' }}
    >
      <div className="relative mx-auto" style={{ width: `${totalWidth}px`, height: '160px' }}>
        {notePositions.map(({ note, isBlack, position }) => (
          <div
            key={note}
            className="absolute"
            style={{
              left: `${position.left}px`,
              marginLeft: position.marginLeft,
            }}
          >
            <DuetKey
              note={note}
              isBlack={isBlack}
              isLocalActive={localActiveNotes.has(note)}
              isRemoteActive={remoteActiveNotes.has(note)}
              onPressed={() => onNoteOn(note)}
              onReleased={() => onNoteOff(note)}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
