import express from "express";
import path from "path";
import { fileURLToPath } from 'url';

// Get the current directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from the React build
app.use(express.static(path.join(__dirname,"..", "client", "build")));

app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname,"..", "client", "build", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});