import { Request, Response } from 'express';
import textToSpeech from '@google-cloud/text-to-speech';
import fs from 'fs/promises';

const client = new textToSpeech.TextToSpeechClient();

export async function handleTTS(req: Request, res: Response) {
  const { text } = req.body;

  if (!text) {
    return res.status(400).json({ error: 'Text is required' });
  }

  const request = {
    input: { text },
    voice: { languageCode: 'en-US',
              name: 'en-US-Chirp3-HD-Laomedeia', 
              ssmlGender: 'FEMALE' },
    audioConfig: { audioEncoding: 'MP3' },
  } as const;

  try {
      // 一度すべての結果を `responses` 配列で受け取る
    const responses = await client.synthesizeSpeech(request);

    // その配列から最初の要素を取り出す
    const response = responses[0];
    const filename = `output-${Date.now()}.mp3`;
    const filepath = `./uploads/${filename}`;

    await fs.writeFile(filepath, response.audioContent as Buffer, 'binary');
    res.sendFile(filepath, { root: '.' }, () => {
      fs.unlink(filepath); // 応答後に削除
    });
  } catch (err) {
    res.status(500).json({ error: 'TTS failed', detail: err });
  }
}
