
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
        let response = await fetch('https://restcountries.com/v3.1/name/' + input.value);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        pageContent.innerHTML = '';
        for (country of data) {
            let CountryName = createElement('h1', country.name.common, pageContent);
            let countryContent = createElement('div', '', pageContent);
            let capitalHeadLine = createElement('h2', 'Capital', countryContent);
            if (Array.isArray(country.capital)) {
                for (let capital of country.capital) {
                    let section = createElement('section', '', countryContent);
                    let capitalNamesList = createElement('ul', '', section);
                    createElement('li', capital, capitalNamesList);
                }
            } else {
                let section = createElement('section', 'Capital not found', countryContent);
            }

            createElement('h2', 'Languages:', countryContent);
            if (country.languages != undefined) {
                for (let [languages, details] of Object.entries(country.languages)) {
                    console.log(country.languages);
                    let section = createElement('section', '', countryContent);
                    let languageList = createElement('ul', '', section);
                    createElement('li', `${details}`, languageList);
                    // createElement('li', `${languages} - ${details}`, languageList);
                }
            } else {
                let section = createElement('section', 'Language not found', countryContent);
            }

            createElement('h2', 'Currencies:', countryContent);
            if (country.currencies != undefined) {
                for (let [currency, details] of Object.entries(country.currencies)) {
                    let section = createElement('section', '', countryContent);
                    let currencyList = createElement('ul', '', section);
                    createElement('li', `${currency} - ${details.name}`, currencyList);
                }
            } else {
                let section = createElement('section', 'Currency not found', countryContent);
            }

            let googleMapsLink = createElement('a', 'Click here to see where on Earth this country is :)', countryContent);
            googleMapsLink.setAttribute('href', country.maps.googleMaps);

            let flag = createElement('img', '', countryContent);
            flag.setAttribute('src', country.flags.png);
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