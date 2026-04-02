import  express  from 'express';
import { matchesRouter } from './routes/matches.js';

const app = express();
const port = 8000;

app.use(express.json()); // this is the line that enables middleware to parse JSON bodies in requests

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.use('/matches', matchesRouter);

app.listen(port, () => {
    console.log(`Sportz listening on port: ${port}!`)
});