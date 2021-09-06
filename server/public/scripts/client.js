$(readyNow);

function readyNow() {
    console.log('Document ready');
    $('#submit-button').on('click', convertToDataObj); 
    $('#clear-button').on('click', clearInputs);

    //Handle all button clicks
    // should look into building this into the buttons 
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

    // Append history on page reload
    getCalculationHistory();
}
//  global variables to be called and manipulated for sending
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
    // convertToDataObj(); // rerouted to line 5
}

function convertToDataObj () {
    // getting whatever string ends up in the input field "main-input"
    let dataString = $('#main-input').val();
    // Findidng which mathematical operation
    if (dataString.includes('+')) {
        dataToCalculate.op = '+'; // assigning operation to data, if found in string
        dataArray = dataString.split('+'); // converting contents to array of strings, removing operation '+'
        dataToCalculate.first = dataArray[0]; // only expecting 2 numbers from client
        dataToCalculate.second = dataArray[1]; // and assigning to data object
    } else if (dataString.includes('-')) { // same as above, but for '-'
        dataToCalculate.op = '-';
        dataArray = dataString.split('-');
        dataToCalculate.first = dataArray[0];
        dataToCalculate.second = dataArray[1];
    } else if (dataString.includes('*')) { // check for each math operation
        dataToCalculate.op = '*';
        dataArray = dataString.split('*');
        dataToCalculate.first = dataArray[0];
        dataToCalculate.second = dataArray[1];
    } else if (dataString.includes('/')) {
        dataToCalculate.op = '/';
        dataArray = dataString.split('/');
        dataToCalculate.first = dataArray[0];
        dataToCalculate.second = dataArray[1];
    } else { // in case something unusual/unexpected is entered
        alert('incomplete function');
        console.log('Do not POST');
        clearInputs();
        return; // Return so we don't go to POST
    }
    console.log('in convertDataToObj', dataArray);
    postToCalculate();
}

// Older functions for base functionality below (lines 82-121)

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
    mainScreen = []; // reset string to input as well
    return; // don't continue from here
}

function postToCalculate () { // lets send this calculation to the server!
    console.log('Data To Post: ', dataToCalculate);
    // Prevent bad or incomplete data
    // If undefined properties or wrong number of properties in array, don't continue
    if (dataToCalculate.first === '' || dataToCalculate.second === '' || dataArray.length != 2) {
        console.log('Incomplete Function, do not POST!');
        alert('check input; format must follow example: x+y')
        clearInputs();
        return;
    }
    // dataToCalculate.first = $('#first-number').val(); // from baseline functionality
    // dataToCalculate.second = $('#second-number').val();    
    $.ajax({
        method: 'POST',
        url: '/tocalculate', // Matching server side app.post url
        data: dataToCalculate, // from main input, converted to an object with 3 properties
    }).then(handlePostToCalculateSuccess).catch(calculationPostError);
}

function handlePostToCalculateSuccess(responseFromPost) {
    console.log('got response', responseFromPost); // Expecting success message
    getCalculationResult(); // now call the separate GET, per instructions
    getCalculationHistory(); // get history again after new calculation
}

function calculationPostError() { // complete the request loop if something goes wrong
    alert('Could not complete calculation post request')
    console.log('Something went wrong in postToCalculate response'); // messsage specific to the POST
}

function getCalculationResult() { // Using a GET for the calculation answer
    $.ajax({
        method: 'GET',
        url: '/calculation', // matches GET url and POST url
    }).then(appendCalculationToDom).catch(getCalculationError);
}

function appendCalculationToDom(responseFromGetCalculation) {
    $('#current-result').empty(); // Get rid of any lingering content
    $('#current-result').append(`<p class="answer">Answer: ${responseFromGetCalculation.result}</p>`); // appending to div in a p tag for simple display
}

function getCalculationError() { // close response loop
    alert('could not get calculation result');
    console.log('Get calculation error'); // stay specific, so it's clear where the error happened
}

function getCalculationHistory() { // separate GET for history, called on page load and after successful POST
    console.log('getting calulation history');
    $.ajax({
        method: 'GET',
        url: '/history',
    }).then(appendHistoryToDom).catch(getHistoryError);
}

function appendHistoryToDom(responseFromGet) {
    console.log('in appendHistoryToDom', responseFromGet);
    $('#calc-history-body').empty();
    // in hindsight, it would have looked cleaner to append history as an unordered list
    for (let i = 0; i < responseFromGet.length; i++) {
        let prevCalc = responseFromGet[i]; 
        $('#calc-history-body').append(`
            <li class="previous-calc" > 
                ${prevCalc.first}${prevCalc.op}${prevCalc.second} 
            </li>
        `); // Goal, make this clickable, for resubmission to POST
    }
}

function getHistoryError() {
    alert('Could not retrieve history of calculations.');
    console.log('Error on getCalculationHistory request');
}