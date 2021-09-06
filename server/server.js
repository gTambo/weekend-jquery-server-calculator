const express = require('express');
const { resourceLimits } = require('worker_threads'); // I don't know where this came from or what it is doing
const app = express();

const PORT = 5000;

app.use(express.urlencoded({ extended: true}));

app.use(express.static('server/public'));

let calcualtionHistory = []; //Storing objects received in POST req.body
let calculationResult = undefined; // to be determined with each POST from client

function makeCalculation (opString, num1, num2) {
    if (opString == '+') { // using passed in values to perform designated math function
        return num1 + num2;
    } else if (opString == '-') {
        return num1 - num2;
    } else if (opString == '*') {
        return num1 * num2;
    } else if (opString == '/') {
        return num1 / num2;
    }
}

app.post('/tocalculate', (req, res) => { // Matching client side request url
    const numbersToCalculate = req.body; // as object with 3 properties
    console.log('Received numbers to calculate', numbersToCalculate);
    let operation = numbersToCalculate.op; // parsing out the properties
    let first = parseFloat(numbersToCalculate.first);
    let second = parseFloat(numbersToCalculate.second);
    // some calculate function, post to history?
    calcualtionHistory.unshift(numbersToCalculate); // store in history, most recent first
    calculationResult = makeCalculation(operation, first, second); // Pass each property from req.body to the calculation
    console.log('Calculation result: ', calculationResult);
    
    res.send('Post success'); // sending just a messeage
});

app.get('/calculation', (req, res) => {
    console.log('GET calculation request received; sending result', calculationResult);
    res.send({ result: calculationResult}); // as determined with most recent POST from client
});

app.get('/history', (req, res) => {
    console.log('GET /history request received'); 
    res.send(calcualtionHistory); // send back all objects in history array
});

app.listen(PORT, () => {
    console.log(`Listening on port: ${PORT}`);
});