import { describe, expect, it } from 'vitest';
import { SongImportService } from '../services/songImportService';

const musicXml = `<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE score-partwise PUBLIC "-//Recordare//DTD MusicXML 4.0 Partwise//EN" "http://www.musicxml.org/dtds/partwise.dtd">
<score-partwise version="4.0">
  <work>
    <work-title>Test Song</work-title>
  </work>
  <part-list>
    <score-part id="P1">
      <part-name>Piano</part-name>
    </score-part>
  </part-list>
  <part id="P1">
    <measure number="1">
      <attributes>
        <divisions>2</divisions>
      </attributes>
      <direction>
        <sound tempo="96" />
      </direction>
      <note>
        <pitch>
          <step>C</step>
          <octave>4</octave>
        </pitch>
        <duration>2</duration>
      </note>
      <note>
        <rest />
        <duration>2</duration>
      </note>
      <note>
        <pitch>
          <step>E</step>
          <octave>4</octave>
        </pitch>
        <duration>4</duration>
      </note>
    </measure>
  </part>
</score-partwise>`;

describe('SongImportService', () => {
  it('validates and parses MusicXML into a lesson', () => {
    expect(SongImportService.validate(musicXml, 'test.musicxml')).toBe(true);

    const lesson = SongImportService.parseFile(
      new File([musicXml], 'test.musicxml', { type: 'application/xml' })
    );

    return expect(lesson).resolves.toMatchObject({
      title: 'Test Song',
      tempo: 96,
      category: 'Imported Song',
      source: 'user-uploaded',
    });
  });

  it('rejects unsupported file types', () => {
    expect(SongImportService.validate('abc', 'notes.txt')).toBe(false);
  });
});
