import { apiKey } from "./config.js";

// OUTER EVENT HANDLERS
const boxContainer = document.querySelector('.box-container');
const box1 = document.querySelector('.box1');
const currencySE1 = document.getElementById('currency1');
const box2 = document.querySelector('.box2');
const currencySE2 = document.getElementById('currency2');
const swapButton = document.getElementById('swap-currency');
// const result = document.querySelector('#result');
const rateInput = document.querySelector('#rate');
const rateInput2 = document.querySelector('#rate2');
const viewHistory = document.querySelector('#history-record')
const deleteHistory = document.querySelector('#delete-history')
const historyRecord = document.createElement('div');
const historyContainer = document.querySelector('#track-history')  

// async function convertCurrency(currency1, currency2, amount) {
//     try {
//         const response = await fetch(`https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=${currency1}&want=${currency2}&amount=${amount}`, {
//             headers: {
//                 'X-RapidAPI-Key': apiKey,
//                 'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com'
//             }
//         });
//         const data = await response.json();
//         return data;
//     } catch (err) {
//         console.log(err);
//     }
// }


const options = {
	method: 'GET',
	headers: {
		'X-RapidAPI-Key': apiKey,
		'X-RapidAPI-Host': 'currency-converter-by-api-ninjas.p.rapidapi.com'
	}
};


// The function sends a GET request to the API endpoint https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency to 
//convert a given amount of one currency1 to another currency2. The request includes the query parameters 
// have, want, and amount to specify the currencies and the amount to be converted.
async function convertCurrency(currency1, currency2, amount) {

// If the request is successful, the function waits for the response to be received as JSON using await response.json() and stores the response data in a variable named data. 
// The function then logs the data to the console and returns it.
    try{
        let response = await fetch(`https://currency-converter-by-api-ninjas.p.rapidapi.com/v1/convertcurrency?have=${currency1}&want=${currency2}&amount=${amount}`, options)
        let data = await response.json()
        console.log(`data is `, data)
        return data
    }catch(error){
        console.log(error)

    }

}





// more like display function...
// This code defines an async function called calculate() which is called at the end of the function.
//Inside the function, it first retrieves the selected currencies and the amount to convert from the user interface, and then calls the convertCurrency() function to retrieve the conversion rate and the converted amount.
//After that, it updates the UI with the converted value and calculates the exchange rate between the two currencies.
//Then, it stores the conversion history in the browser's local storage and also provides functionality to view and delete the conversion history.
//Finally, the calculate() function is called to execute the code.
async function calculate() {
    let currency1 = currencySE1.value;
    let currency2 = currencySE2.value;
    let amount = parseFloat(rateInput.value);

    console.log(currency1,currency2,amount)

    let data = await convertCurrency(currency1, currency2, amount);
    console.log('returned data', data);
    rateInput2.innerHTML = `${data.new_amount}`
    let convertedValue = data.new_amount;
    console.log(convertedValue);
    let rates = (data.new_amount / data.old_amount);
    console.log(rates);

    rateInput2.value = convertedValue;
    // rateInput.value = `1 ${currency1} : ${rates.toFixed(4)} ${currency2}`;
   
    console.log("Currency2 is UPDATED");

     // Store the conversion history
     const convertHistory = JSON.parse(localStorage.getItem('past-conversion')) || [];
     convertHistory.push({
         currency1,
         currency2,
         amount,
         convertedValue,
         date: new Date().toDateString()
     });
     localStorage.setItem('past-conversion', JSON.stringify(convertHistory));

     console.log(convertHistory)


     // INNNER EVENT HANDLERS
      // button to remove conversion history
      deleteHistory.addEventListener('click', (e) => {
        localStorage.removeItem('past-conversion');
        historyRecord.innerHTML = '';
        historyContainer.innerHTML = ''; // clear the history container in the UI
    });
    
    
    // button to view conversion history
    viewHistory.addEventListener('click', () => {
        const convertHistory = JSON.parse(localStorage.getItem('past-conversion')) || [];
        historyRecord.innerHTML = ''; // clear existing content
        convertHistory.forEach(history => {
            historyRecord.innerHTML += `
            <div>
                <div class="loader"></div>
                <div id="print-history">${`You have converted: <br> ${history.amount} ${history.currency1} to ${rateInput2.value} ${history.currency2} <br> on ${history.date}.`}</div> 
            </div>
            `;
        });
        historyContainer.appendChild(historyRecord);
    });
    
    
   
    
}

calculate();

// PREVENT AUTO UPDATE FOR EVERY SINGLE INPUT, PREVENT USING INPUT!
rateInput.addEventListener('keydown', (event) => {
    if (event.key === "Enter") {
        calculate();
    }
});

currencySE1.addEventListener('change', calculate);
currencySE2.addEventListener('change', calculate);


swapButton.addEventListener('click', () => {
    let temporaryVariable = currencySE1.value;
    currencySE1.value = currencySE2.value;
    currencySE2.value = temporaryVariable;
    calculate();
});
 


