$(readyNow);

function readyNow() {
    console.log('Document ready');
    $('#submit-button').on('click', postToCalculate);
   
}

function postToCalculate () {
    $.ajax({
        method: 'POST',
        url: '/tocalculate',
        data: {
            first: $('#first-number').val(),
            op: $('#operation').val(),
            second: $('#second-number').val(),
        }
    }).then(handleCalculationPost).catch(calculationError);
}

function handleCalculationPost(responseFromPost) {
    console.log('got response');
}

function calculationError() {
    console.log('Something went wrong');        
}
