$(readyNow);

function readyNow() {
    console.log('Document ready');
    $('#submit-button').on('click', postToCalculate); 
    $('#clear-button').on('click', clearInputs);

    $('#no1').on('click', intoMainInputField);
    $('#no2').on('click', intoMainInputField);
    $('#no3').on('click', intoMainInputField);
    $('#no4').on('click', intoMainInputField);
    $('#no5').on('click', intoMainInputField);
    $('#no6').on('click', intoMainInputField);
    $('#no7').on('click', intoMainInputField);
    $('#no8').on('click', intoMainInputField);
    $('#no9').on('click', intoMainInputField);
    $('#no0').on('click', intoMainInputField);
    $('#dot').on('click', intoMainInputField);
    $('#add').on('click', intoMainInputField);
    $('#subtract').on('click', intoMainInputField);
    $('#multiply').on('click', intoMainInputField);
    $('#divide').on('click', intoMainInputField);


    getCalculationHistory();
}

let dataToCalculate = {};
let mainScreen = [];
let dataArray = [];

function intoMainInputField() {
    console.log( $(this).text() );
    let mathFunction = '';
    mainScreen.push($(this).text());
    for (const item of mainScreen) {
        mathFunction += item;
    }
    // document.getElementById("main-input").value = mathFunction;
    $('#main-input').val(mathFunction);
    convertToDataObj();
}

function convertToDataObj () {
    let dataString = $('#main-input').val();
    let dataArray = [];
    if (dataString.includes('+')) {
        dataToCalculate.op = '+';
        dataArray = dataString.split('+');
        dataToCalculate.first = dataArray[0];
        dataToCalculate.second = dataArray[1];
    } else if (dataString.includes('-')) {
        dataToCalculate.op = '+';
        dataArray = dataString.split('-');
        dataToCalculate.first = dataArray[0];
        dataToCalculate.second = dataArray[1];
    }
    
    console.log('in convertDataToObj', dataArray);
}

// function passOperationToData() {
//     let operation = '';
//     switch($(this).attr('id')){
//         case 'add':
//             operation = '+';
//             break;
//         case 'subtract':
//             operation = '-';
//             break;
//         case 'multiply':
//             operation = '*';
//             break;
//         case 'divide':
//             operation = '/';
//             break;
//     }
//     console.log('operation: ', operation);

//     dataToCalculate.op = operation;
// }

// function passFirstToData() {
//     let first = '';
//     switch ($(this).attr('id')) {
//         case 'no1':
//             first = '1';
//             break;
//         case 'no2':
//             first = '2';
//             break;
//         case 'no3':
//             first = '3';
//             break;
//         case 'no4':
//             first = '4';
//             break;
//         case 'no5':
//             first = '5';
//             break;
//         case 'no6':
//             first = '6';
//             break;
//         case 'no7':
//             first = '7';    
//             break;
//         case 'no8':
//             first = '8';
//             break;
//         case 'no9':
//             first = '9';
//             break;
//         case 'no0':
//             first= '0';
//             break;
//         default:
//             break;
//     }
// }

// function addToData() {
//     console.log('chose add');
//     dataToCalculate.op = '+';
// }

// function subtractToData() {
//     console.log('chose subtract');
//     dataToCalculate.op = '-';
// }

// function multiplyToData() {
//     console.log('chose multiply');
//     dataToCalculate.op = '*'
// }

// function divideToData() {
//     console.log('chose divide');
//     dataToCalculate.op = '/';
// }


function clearInputs() {
    $('input').val('');
    mainScreen = [];
}

function postToCalculate () {
    console.log('Data To Post: ', dataToCalculate);
    if (dataArray.length != 3) {
        alert('incomplete statement');
    }
    // dataToCalculate.first = $('#first-number').val();
    // dataToCalculate.second = $('#second-number').val();    
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