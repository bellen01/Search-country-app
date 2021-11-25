
/*
Det ska finnas ett sökfält, en select-meny och en sökknapp
Användaren ska kunna söka på landets namn eller språk.
Användaren söker på landets namn:
Information om landet visas tillsammans med bild på landets flagga.

Användaren söker på språk:
En lista visas med namnet på länderna där det valda språket talas samt deras flagga. Vid klick på flaggan eller namnet får man upp mer information om landet. Samma som visas vid namnsök?


Från apiet kommer jag behöva (kommer som objekt i en array):
name: { common: Sweden
    -native name: { common: Sverige } }
currencies: { name: swedish krona }
languages: { swe: Swedish }
capital: [ Stockholm ]
population: 10353442 //ser annorlunda ut än flera av de övriga?
continents: [ Europe ]
flags { png, svg }


*/
let input = document.getElementById('search-field');
let searchButton = document.getElementById('search-btn');
let displayErrorMessage = document.getElementById('display-error-message');
let pageContent = document.getElementById('content-container');

let createElement = (elementType, text, appendTo) => {
    let element = document.createElement(elementType);
    element.innerHTML = text;
    appendTo.append(element);
    return element;
}

input.focus();

let enterKeyTrigger = (e, btn) => {
    console.log('hej');
    if (e.key === 'Enter') {
        btn.click();
    }
}

const errorMessage = 'Please fill in the name of the country or language you want to search for';
function isStringEmpty(text) {
    return text.trim() === '';
}

async function fetchCountry() {
    if (isStringEmpty(input.value)) {
        displayErrorMessage.innerHTML = errorMessage;
        return;
    }
    displayErrorMessage.innerHTML = '';
    try {
        let response = await fetch('https://restcountries.com/v3.1/name/' + input.value); //Ta bort sweden och lägg till + input.value
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        pageContent.innerHTML = '';
        for (country of data) {
            let countryName = document.createElement('h1');
            countryName.innerHTML = country.name.common;
            let countryContent = document.createElement('div');
            let capitalHeadLine = document.createElement('h2');
            capitalHeadLine.innerHTML = 'Capital(s):';
            countryContent.append(capitalHeadLine);
            if (Array.isArray(country.capital)) {
                for (let capital of country.capital) {
                    let capitalContainer = document.createElement('section')
                    let capitalNamesUl = document.createElement('ul');
                    let capitalNamesLi = document.createElement('li');
                    capitalNamesLi.innerHTML = capital;
                    capitalNamesUl.append(capitalNamesLi);
                    capitalContainer.append(capitalNamesUl);
                    countryContent.append(capitalContainer);
                }
            } else {
                let capitalContainer = document.createElement('section');
                capitalContainer.innerHTML = 'Capital not found';
                countryContent.append(capitalContainer);
            }
            let flagImg = document.createElement('img');
            flagImg.setAttribute('src', country.flags.png);
            let currencyHeadLine = document.createElement('h2');
            currencyHeadLine.innerHTML = 'Currencies:';
            countryContent.append(currencyHeadLine);
            for (let [currency, details] of Object.entries(country.currencies)) {
                let currencyContainer = document.createElement('section');
                let currencyUl = document.createElement('ul');
                let currencyLi = document.createElement('li');
                currencyLi.innerHTML = `${currency} - ${details.name}`;
                currencyUl.append(currencyLi);
                currencyContainer.append(currencyUl);
                countryContent.append(currencyContainer);
                console.log(currency, details);
            }
            let googleMaps = document.createElement('a');
            googleMaps.innerHTML = 'Click here to see the country on Google Maps';
            googleMaps.setAttribute('href', country.maps.googleMaps);

            countryContent.append(googleMaps, flagImg);

            pageContent.append(countryName, countryContent);

        }

    } catch (error) {
        console.log(error);
        pageContent.innerHTML = 'Oj, något gick fel. Vänligen försök igen senare.'
    }
}

input.addEventListener('keyup', (e) => enterKeyTrigger(e, searchButton));
searchButton.addEventListener('click', fetchCountry);



            // let nativeName = document.createElement('i');
            // nativeName.innerHTML = country.name.nativeName.swe.common;