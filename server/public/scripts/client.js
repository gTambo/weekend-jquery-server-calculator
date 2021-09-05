$(readyNow);

function readyNow() {
    console.log('Document ready');
    $('#submit-button').on('click', postToCalculate); 
    $('#clear-button').on('click', clearInputs);

    $('#add').on('click', passOperationToData);
    $('#subtract').on('click', passOperationToData);
    $('#multiply').on('click', passOperationToData);
    $('#divide').on('click', passOperationToData);

    getCalculationHistory();
}

let dataToCalculate = {};

function passOperationToData() {
    let operation = '';
    switch($(this).attr('id')){
        case 'add':
            operation = '+';
            break;
        case 'subtract':
            operation = '-';
            break;
        case 'multiply':
            operation = '*';
            break;
        case 'divide':
            operation = '/';
            break;
    }
    console.log('operation: ', operation);
    dataToCalculate.op = operation;
}

/**
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
*/

function clearInputs() {
    $('input').val('');
}

function postToCalculate () {
    console.log('Data To Post: ', dataToCalculate);
    dataToCalculate.first = $('#first-number').val();
    dataToCalculate.second = $('#second-number').val();    
    $.ajax({
        method: 'POST',
        url: '/tocalculate',
        data: dataToCalculate,
    }).then(handlePostToCalculateSuccess).catch(calculationPostError);
}

function handlePostToCalculateSuccess(responseFromPost) {
    console.log('got response', responseFromPost);
    getCalculationResult();
    getCalculationHistory();
}

function calculationPostError() {
    alert('Could not complete calculation post request')
    console.log('Something went wrong in postToCalculate response');        
}

function getCalculationResult() {
    $.ajax({
        method: 'GET',
        url: '/calculation',
    }).then(appendCalculationToDom).catch(getCalculationError);
}

function appendCalculationToDom(responseFromGetCalculation) {
    $('#current-result').empty();
    $('#current-result').append(`<li>${responseFromGetCalculation.result}</li>`);
}

function getCalculationError() {
    alert('could not get calculation result');
    console.log('Get calculation error');
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
    $('#calc-history-body').empty();
    for (let i = 0; i < responseFromGet.length; i++) {
        let prevCalc = responseFromGet[i];
        $('#calc-history-body').append(`
            <tr>
                <td>${prevCalc.first}</td>
                <td>${prevCalc.op}</td>
                <td>${prevCalc.second}</td>
            </tr>
        `);
    }
}

function getHistoryError() {
    alert('Could not retrieve history of calculations.');
    console.log('Error on getCalculationHistory request');
}