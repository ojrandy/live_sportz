import  express  from 'express';
import res from "express/lib/response.js";

const app = express();
const port = 8000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(port, () => {
    console.log(`Example app listening on port: ${port}!`)
});