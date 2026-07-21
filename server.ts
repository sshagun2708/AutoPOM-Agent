import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { runAgent } from './autopom-agent';

// Safely define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const upload = multer({ dest: 'uploads/' });

app.use(express.static(path.join(__dirname, 'public')));

app.post('/generate-pom', upload.single('testCaseFile'), async (req: any, res: any) => {
    try {
        const url = req.body.url;
        const file = req.file;

        if (!url || !file) {
            return res.status(400).send({ status: "Error", message: "URL or test case file missing." });
        }

        const testRequirements = fs.readFileSync(file.path, 'utf8');
        
        console.log(`🚀 Request received for: ${url} with file: ${file.originalname}`);
        
        await runAgent(url, testRequirements);

        fs.unlinkSync(file.path);

        res.status(200).send({ status: "Success", message: "Framework generated and tests executed." });
    } catch (error) {
        console.error(error);
        res.status(500).send({ status: "Error", message: "Agent failed to execute." });
    }
});

app.listen(3000, () => console.log('✅ Agent UI running at http://localhost:3000'));