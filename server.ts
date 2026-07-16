import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { runAgent } from './autopom-agent';

const app = express();
const upload = multer({ dest: 'uploads/' }); // Files will be saved here temporarily

app.use(cors());
// Note: We don't need express.json() for the file upload route 
// because we are using FormData (multipart/form-data)

app.post('/generate-pom', upload.single('file'), async (req, res) => {
  const { url } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: "No file uploaded" });
  }

  try {
    // Pass the URL and the path of the uploaded file to your agent
    await runAgent(url, file.path); 
    
    res.json({ message: "Success: Test cases processed and POM updated!" });
  } catch (error) {
    console.error("Agent error:", error);
    res.status(500).json({ error: "Agent failed to process file" });
  }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));