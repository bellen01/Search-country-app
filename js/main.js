
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
let selectedOption = document.getElementById('search-options');
let numberOfHits = document.getElementById('display-number-of-hits');

let createElement = (elementType, text, appendTo) => {
    let element = document.createElement(elementType);
    element.innerHTML = text;
    appendTo.append(element);
    return element;
}

function createCountryDataSection(countryData, heading) {
    let section = createElement('section', '', countryData);
    createElement('h2', heading, section);
    let list = createElement('ul', '', section);
    return list;
}

function createCapitalListItem(countryData, list, text) {
    if (Array.isArray(countryData)) {
        for (let data of countryData) {
            createElement('li', data, list);
        }
    } else {
        list.innerHTML = `Sorry, we don't have any information about ${text} at this point.`;
    }
}

function createLanguageList(countryData, list, text) {
    if (countryData != undefined) {
        for (let data in countryData) {
            createElement('li', `${countryData[data]}`, list);
        }
    } else {
        list.innerHTML = `Sorry, we don't have any information about ${text} at this point.`;
    }
}

function createCurrencyList(countryData, list, text) {
    if (countryData != undefined) {
        for (let [data, details] of Object.entries(countryData)) {
            createElement('li', `${data} - ${details.name}`, list);
        }
    } else {
        list.innerHTML = `Sorry, we don't have any information about ${text} at this point.`;
    }
}

function createListItem(countryData, list, text) {
    if (countryData != undefined) {
        createElement('li', countryData, list);
    } else {
        list.innerHTML = `Sorry, we don't have any information about ${text} at this point.`;
    }
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

async function fetchCountry(link) {
    if (isStringEmpty(input.value)) {
        displayErrorMessage.innerHTML = errorMessage;
        return;
    }
    displayErrorMessage.innerHTML = '';
    try {
        let response = await fetch(link + input.value);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
        pageContent.innerHTML = '';

        for (country of data) {
            numberOfHits.innerHTML = 'Antal träffar: ' + data.length;
            let CountryName = createElement('h1', country.name.common, pageContent);
            let countryContainer = createElement('div', '', pageContent);
            let countryContent = createElement('div', '', countryContainer);
            let countryData = createElement('div', '', countryContent);
            let pictures = createElement('section', '', countryContent);
            countryData.classList.add('country-data');
            countryContent.classList.add('country-content');

            let capitalList = createCountryDataSection(countryData, 'Capital:');
            createCapitalListItem(country.capital, capitalList, 'capital'); //ändra namn på funktionen så den blir generell, används för continent också


            let regionList = createCountryDataSection(countryData, 'Region:');
            createListItem(country.region, regionList, 'region');


            let subRegionList = createCountryDataSection(countryData, 'Subregion:');
            createListItem(country.subregion, subRegionList, 'subregion');

            let continentList = createCountryDataSection(countryData, 'Continent:');
            createCapitalListItem(country.continents, continentList, 'continent'); //ändra namn på funktionen så den blir generell, används för capital och continent


            let languageList = createCountryDataSection(countryData, 'Languages:')
            createLanguageList(country.languages, languageList, 'language');

            let currencyList = createCountryDataSection(countryData, 'Currencies:')
            createCurrencyList(country.currencies, currencyList, 'currency');

            let flag = createElement('img', '', pictures);
            flag.setAttribute('src', country.flags.png);
            flag.classList.add('img-size');


            if (Object.keys(country.coatOfArms).length != 0) {
                let coatOfArms = createElement('img', '', pictures);
                coatOfArms.setAttribute('src', country.coatOfArms.png);
                coatOfArms.classList.add('img-size')
            }

            // let googleMapsLink = createElement('a', 'Click here to see where on Earth this country is :)', pictures);
            // googleMapsLink.setAttribute('href', country.maps.googleMaps);

            let mapLink = `<iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBWDn9j820uDjapPD3v7ItsfLu-KNi8ieM&q=${country.name.common}"></iframe>`
            let mapContainer = createElement('div', mapLink, countryContainer);
        }
    } catch (error) {
        console.log(error);
        displayErrorMessage.innerHTML = 'Oj, något gick fel. Vänligen försök igen.'
    }
}

input.addEventListener('keyup', (e) => enterKeyTrigger(e, searchButton));
searchButton.addEventListener('click', function () {
    if (selectedOption.value === 'name') {
        fetchCountry('https://restcountries.com/v3.1/name/')
    } else {
        fetchCountry('https://restcountries.com/v3.1/lang/')
    }
});


// let language = createElement('section', '', countryData);
// createElement('h2', 'Languages:', language);
// let languageList = createElement('ul', '', language);
// if (country.languages != undefined) {
//     for (let [languages, details] of Object.entries(country.languages)) {
//         createElement('li', `${languages} - ${details}`, languageList);
//     }
// } else {
//     language.innerHTML = 'Language not found';
// }

// let currency = createElement('section', '', countryData);
// createElement('h2', 'Currencies:', currency);
// let currencyList = createElement('ul', '', currency);
// if (country.currencies != undefined) {
//         for (let currency in country.currencies) {
//         createElement('li', `${country.currencies[currency].name}`, currencyList);
//     }
// } else {
//     currency.innerHTML = 'Currency not found';
// }

            // let nativeName = document.createElement('i');
            // nativeName.innerHTML = country.name.nativeName.swe.common;