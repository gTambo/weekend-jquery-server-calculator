const express = require('express');
const { resourceLimits } = require('worker_threads');
const app = express();

const PORT = 5000;

app.use(express.urlencoded({ extended: true}));

app.use(express.static('server/public'));

app.post('/tocalculate', (req, res) => {
    console.log('Received numbers to calculate');
    const numbersToCalculate = req.body;
    // some calculate function, post to history?
    const calculationResult;
    res.send(calculationResult);
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});