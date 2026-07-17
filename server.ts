import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { runAgent } from './autopom-agent.js';

const app = express();
const port = 3000;
const upload = multer({ dest: 'uploads/' });

app.use(cors());

// Native way to get directory path in ES Modules
const __dirname = import.meta.dirname;

// Serve static files
app.use(express.static(path.join(__dirname, '.')));

// Serve index.html at root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Handle POM generation
app.post('/generate-pom', upload.single('file'), async (req, res) => {
  const { url } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    await runAgent(url, file.path); 
    res.json({ message: "Success: Test cases processed and POM updated!" });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: "Agent failed to process file" });
  }
});

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));