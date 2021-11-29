
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

function createCountryDataSection(countryDataElement, headingName) {
    let section = createElement('section', '', countryDataElement);
    createElement('h2', headingName, section);
    let list = createElement('ul', '', section);
    return list;
}
function createListFromString(text, ulElement, type) {
    createListFromArray(text === undefined ? [] : [text], ulElement, type);
}

function createListFromArray(array, ulElement, type) {
    if (Array.isArray(array) && array.length != 0) {
        for (let data of array) {
            createElement('li', data, ulElement);
        }
    } else {
        ulElement.innerHTML = `Sorry, we don't have any information about ${type} at this point.`;
    }
}

function createListFromObject(obj, ulElement, type) {
    if (obj != undefined) {
        for (let data in obj) {
            createElement('li', `${obj[data]}`, ulElement);
        }
    } else {
        ulElement.innerHTML = `Sorry, we don't have any information about ${type} at this point.`;
    }
}

function createListFromKeyValueObject(obj, ulElement, type) {
    if (obj != undefined) {
        for (let [key, value] of Object.entries(obj)) {
            createElement('li', `${key} - ${value.name}`, ulElement);
        }
    } else {
        ulElement.innerHTML = `Sorry, we don't have any information about ${type} at this point.`;
    }
}


function addPicture(countryPicture, picturesElement) {
    // if (Object.keys(countryPicture).length != 0) {
    if (countryPicture.hasOwnProperty('png')) {
        let element = createElement('img', '', picturesElement);
        element.setAttribute('src', countryPicture.png);
        element.classList.add('img-size');
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
            let countryNameElement = createElement('h1', country.name.common, pageContent);
            let countryContainerElement = createElement('div', '', pageContent);
            let countryContentElement = createElement('div', '', countryContainerElement);
            let countryDataElement = createElement('div', '', countryContentElement);
            let picturesElement = createElement('section', '', countryContentElement);
            countryDataElement.classList.add('country-data');
            countryContentElement.classList.add('country-content');

            let capitalList = createCountryDataSection(countryDataElement, 'Capital:');
            createListFromArray(country.capital, capitalList, 'capital'); //ändra namn på funktionen så den blir generell, används för continent också


            let regionList = createCountryDataSection(countryDataElement, 'Region:');
            createListFromString(country.region, regionList, 'region');


            let subRegionList = createCountryDataSection(countryDataElement, 'Subregion:');
            createListFromString(country.subregion, subRegionList, 'subregion');

            let continentList = createCountryDataSection(countryDataElement, 'Continent:');
            createListFromArray(country.continents, continentList, 'continent'); //ändra namn på funktionen så den blir generell, används för capital och continent


            let languageList = createCountryDataSection(countryDataElement, 'Languages:')
            createListFromObject(country.languages, languageList, 'language');

            let currencyList = createCountryDataSection(countryDataElement, 'Currencies:')
            createListFromKeyValueObject(country.currencies, currencyList, 'currency');

            addPicture(country.flags, picturesElement);

            addPicture(country.coatOfArms, picturesElement);


            let mapLink = `<iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBWDn9j820uDjapPD3v7ItsfLu-KNi8ieM&q=${country.name.common}"></iframe>`
            let mapContainer = createElement('div', mapLink, countryContainerElement);

            countryNameElement.addEventListener('click', () => {
                $(countryContentElement).slideToggle(100);
            });
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


// let googleMapsLink = createElement('a', 'Click here to see where on Earth this country is :)', pictures);
// googleMapsLink.setAttribute('href', country.maps.googleMaps);

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