import { Request, Response } from 'express';
import speech from '@google-cloud/speech';
import fs from 'fs';

const client = new speech.SpeechClient();

export async function handleSTT(req: Request, res: Response) {
  if (!req.file) return res.status(400).send('No audio file uploaded');

  const audioBytes = fs.readFileSync(req.file.path).toString('base64');

  const request = {
    audio: { content: audioBytes },
    config: {
      encoding: 'MP3',
      languageCode: 'en-US',
    },
  } as const;

  try {
    const responses = await client.recognize(request);
    const response = responses[0];
    res.json({response});
  } catch (err) {
    res.status(500).json({ error: 'STT failed', detail: err });
  } finally {
    fs.unlinkSync(req.file.path);
  }
}
