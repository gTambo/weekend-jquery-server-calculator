const express = require('express');
const { resourceLimits } = require('worker_threads');
const app = express();

const PORT = 5000;

app.use(express.urlencoded({ extended: true}));

app.use(express.static('server/public'));

let calcualtionHistory = [];

function makeCalculation (num1, opString, num2) {
    if (opString == '+') {
        return num1 + num2;
    } else if (opString == '-') {
        return num1 - num2;
    } else if (opString == '*') {
        return num1 * num2;
    } else if (opString == '/') {
        return num1 / num2;
    }
}

app.post('/tocalculate', (req, res) => {
    const numbersToCalculate = req.body;
    console.log('Received numbers to calculate', numbersToCalculate);
    let first = parseInt(numbersToCalculate.first);
    let operation = numbersToCalculate.op;
    let second = parseInt(numbersToCalculate.second);
    // some calculate function, post to history?
    calcualtionHistory.unshift(numbersToCalculate);
    const calculationResult = makeCalculation(first, operation, second);
    console.log('Calculation result: ', calculationResult);
    
    res.send({ result: calculationResult});
})

app.get('/history', (req, res) => {
    console.log('GET /history request received'); 
    res.send(calcualtionHistory);
})

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});