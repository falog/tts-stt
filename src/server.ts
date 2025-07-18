import express from 'express';
import dotenv from 'dotenv';
import multer from 'multer';
import { handleTTS } from './tts';
import { handleSTT } from './stt';
import path from 'path';

dotenv.config();
const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('OK');
});

app.post('/tts', handleTTS);
app.post('/stt', upload.single('audio'), handleSTT);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
