import { Request, Response } from 'express';
import textToSpeech from '@google-cloud/text-to-speech';

const client = new textToSpeech.TextToSpeechClient();

export async function handleTTS(req: Request, res: Response) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const request = {
    input: { text },
    voice: {
      languageCode: 'en-US',
      name: 'en-US-Chirp3-HD-Laomedeia',
      ssmlGender: 'FEMALE',
    },
    audioConfig: { audioEncoding: 'MP3' },
  } as const;

  try {
    const [response] = await client.synthesizeSpeech(request);

    if (!response.audioContent) {
      return res.status(500).json({ error: 'No audio content returned' });
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', 'attachment; filename="output.mp3"');
    res.send(response.audioContent);
  } catch (err) {
    res.status(500).json({ error: 'TTS failed', detail: err });
  }
}
