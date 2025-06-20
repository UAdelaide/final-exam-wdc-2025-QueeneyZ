const express = require('express');
const app = express();
const apiRouter = require('./routes/api');

app.use(express.json());
app.use('/api', apiRouter);

const PORT = 8080;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});