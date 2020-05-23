import express from 'express';
import path from 'path';

const __dirname = path.resolve();
const port = process.env.PORT || "3000";

const app = express();

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public/index.html'));
});

app.listen(port, () => {
    console.log('Example app listening on port 3000!');
});