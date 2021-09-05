$(readyNow);

function readyNow() {
    console.log('Document ready');
    $('#submit-button').on('click', postToCalculate); 

    $('#add').on('click', addToData);
    $('#subtract').on('click', subtractToData);
    $('#multiply').on('click', multiplyToData);
    $('#divide').on('click', divideToData);

    getCalculationHistory();
}

let dataToCalculate = {};

function addToData() {
    console.log('chose add');
    dataToCalculate.op = '+';
}

function subtractToData() {
    console.log('chose subtract');
    dataToCalculate.op = '-';
}

function multiplyToData() {
    console.log('chose multiply');
    dataToCalculate.op = '*'
}

function divideToData() {
    console.log('chose divide');
    dataToCalculate.op = '/';
}

function postToCalculate () {
    console.log('Data To Post: ', dataToCalculate);
    dataToCalculate.first = $('#first-number').val();
    dataToCalculate.second = $('#second-number').val();    
    $.ajax({
        method: 'POST',
        url: '/tocalculate',
        data: dataToCalculate,
    }).then(handleCalculationPost).catch(calculationError);
}

function handleCalculationPost(responseFromPost) {
    console.log('got response', responseFromPost);
    $('#current-result').empty();
    $('#current-result').append(`<li>${responseFromPost.result}</li>`);
    getCalculationHistory();
}

function calculationError() {
    alert('Could not complete calculation post request')
    console.log('Something went wrong in postToCalculate response');        
}

function getCalculationHistory() {
    console.log('getting calulation history');
    $.ajax({
        method: 'GET',
        url: '/history',
    }).then(appendHistoryToDom).catch(getHistoryError);
}

function appendHistoryToDom(responseFromGet) {
    console.log('in appendHistoryToDom', responseFromGet);
    
}

function getHistoryError() {
    alert('Could not retrieve history of calculations.');
    console.log('Error on getCalculationHistory request');
}