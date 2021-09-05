$(readyNow);

function readyNow() {
    console.log('Document ready');
    $('#submit-button').on('click', postToCalculate); 

    $('#add').on('click', addToData);
    $('#subtract').on('click', subtractToData);
    $('#multiply').on('click', multiplyToData);
    $('#divide').on('click', divideToData)
}

let dataToCalculate = {
    first: $('#first-number').val(),
    second: $('#second-number').val(),
};

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
    console.log(`Data To Post: ${dataToCalculate}`);
    
    $.ajax({
        method: 'POST',
        url: '/tocalculate',
        data: dataToCalculate,
    }).then(handleCalculationPost).catch(calculationError);
}

function handleCalculationPost(responseFromPost) {
    console.log('got response');
}

function calculationError() {
    console.log('Something went wrong');        
}
