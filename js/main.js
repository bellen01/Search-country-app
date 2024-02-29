
let input = document.getElementById('search-field1');
let searchButton = document.getElementById('search-btn1');
let displayErrorMessage = document.getElementById('display-error-message');
let pageContent = document.getElementById('content-container');
let numberOfHits = document.getElementById('display-number-of-hits');

const optionMenu = document.querySelector(".select-menu"),
    selectBtn = optionMenu.querySelector(".select-btn"),
    options = optionMenu.querySelectorAll(".option"),
    selectText = optionMenu.querySelector(".select-text");

selectBtn.addEventListener("click", () => optionMenu.classList.toggle("active"));

options.forEach(option => {
    option.addEventListener("click", () => {
        let selectedOption2 = option.querySelector('.option-text').innerText;
        selectText.innerText = selectedOption2;

        optionMenu.classList.toggle("active");
    })
})

input.focus();

let enterKeyTrigger = (e, btn) => {
    if (e.key === 'Enter') {
        btn.click();
    }
};

const errorMessage = 'Please fill in the name of the country or language you want to search for';
function isStringEmpty(text) {
    return text.trim() === '';
}

let createElement = (elementType, text, appendTo) => {
    let element = document.createElement(elementType);
    element.innerHTML = text;
    appendTo.append(element);
    return element;
};

let countryDataMethods = {

    createCountryDataSection(countryDataElement, headingName) {
        let section = createElement('section', '', countryDataElement);
        createElement('h3', headingName, section);
        let list = createElement('ul', '', section);
        return list;
    },

    createListFromString(text, ulElement, type) {
        countryDataMethods.createListFromArray(text === undefined ? [] : [text], ulElement, type);
    },

    createListFromArray(array, ulElement, type) {
        if (Array.isArray(array) && array.length != 0) {
            for (let data of array) {
                createElement('li', data, ulElement);
            }
        } else {
            ulElement.innerHTML = `Sorry, we don't have any information about ${type} at this point.`;
        }
    },

    createListFromObject(obj, ulElement, type) {
        if (obj != undefined) {
            for (let data in obj) {
                createElement('li', `${obj[data]}`, ulElement);
            }
        } else {
            ulElement.innerHTML = `Sorry, we don't have any information about ${type} at this point.`;
        }
    },

    createListFromKeyValueObject(obj, ulElement, type) {
        if (obj != undefined) {
            for (let [key, value] of Object.entries(obj)) {
                createElement('li', `${key} - ${value.name}`, ulElement);
            }
        } else {
            ulElement.innerHTML = `Sorry, we don't have any information about ${type} at this point.`;
        }
    },

    addPicture(countryPicture, picturesElement) {
        if (countryPicture.hasOwnProperty('png')) {
            let element = createElement('img', '', picturesElement);
            element.setAttribute('src', countryPicture.png);
            element.classList.add('img-size');
        }
    },

    formatNumber(obj) {
        let element = obj;
        let elementFormatted = Intl.NumberFormat().format(element);
        return elementFormatted;
    }
};

async function fetchCountry(link) {
    pageContent.innerHTML = '';
    numberOfHits.innerHTML = '';
    if (isStringEmpty(input.value)) {
        displayErrorMessage.innerHTML = errorMessage;
        return;
    }
    displayErrorMessage.innerHTML = '';
    try {
        let response = await fetch(link + input.value);
        if (!response.ok) {
            console.log(response.status);
            if (response.status === 404) {
                displayErrorMessage.innerHTML = `We're sorry but we couldn't find what you were looking for, please check the spelling or try a more specific search query.`;
                return;
            }
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        let data = await response.json();
        numberOfHits.innerHTML = 'Number of hits: ' + data.length;

        data.sort((a, b) => (a.name.common > b.name.common) ? 1 : -1);

        for (let country of data) {
            let countryNameElement = createElement('h2', country.name.common, pageContent);
            let countryContainerElement = createElement('div', '', pageContent);
            let countryContentElement = createElement('div', '', countryContainerElement);
            let countryDataElement = createElement('div', '', countryContentElement);
            let picturesElement = createElement('section', '', countryContentElement);
            countryContainerElement.classList.add('hide');
            picturesElement.classList.add('pictures');
            countryDataElement.classList.add('country-data');
            countryContentElement.classList.add('country-content');

            let capitalList = countryDataMethods.createCountryDataSection(countryDataElement, 'Capital:');
            countryDataMethods.createListFromArray(country.capital, capitalList, 'capital');

            let currencyList = countryDataMethods.createCountryDataSection(countryDataElement, 'Currencies:');
            countryDataMethods.createListFromKeyValueObject(country.currencies, currencyList, 'currency');

            let regionList = countryDataMethods.createCountryDataSection(countryDataElement, 'Region:');
            countryDataMethods.createListFromString(country.region, regionList, 'region');

            let subRegionList = countryDataMethods.createCountryDataSection(countryDataElement, 'Subregion:');
            countryDataMethods.createListFromString(country.subregion, subRegionList, 'subregion');

            let languageList = countryDataMethods.createCountryDataSection(countryDataElement, 'Languages:');
            countryDataMethods.createListFromObject(country.languages, languageList, 'language');

            let countryPopulationFormatted = countryDataMethods.formatNumber(country.population);
            let populationList = countryDataMethods.createCountryDataSection(countryDataElement, 'Population:');
            countryDataMethods.createListFromString(countryPopulationFormatted, populationList, 'population');

            let timeZoneList = countryDataMethods.createCountryDataSection(countryDataElement, 'Timezone:');
            countryDataMethods.createListFromArray(country.timezones, timeZoneList, 'timezone');

            let countryAreaFormatted = countryDataMethods.formatNumber(country.area);
            let areaList = countryDataMethods.createCountryDataSection(countryDataElement, 'Landarea (km²): ');
            countryDataMethods.createListFromString(countryAreaFormatted, areaList, 'landarea');

            countryDataMethods.addPicture(country.flags, picturesElement);

            countryDataMethods.addPicture(country.coatOfArms, picturesElement);

            let mapLink = `<iframe width="100%" height="450" style="border:0" loading="lazy" allowfullscreen src="https://www.google.com/maps/embed/v1/place?key=AIzaSyBWDn9j820uDjapPD3v7ItsfLu-KNi8ieM&q=${country.name.common}"></iframe>`;
            createElement('div', mapLink, countryContainerElement);

            if (data.length === 1) {
                countryContainerElement.classList.toggle('hide');
            }

            countryNameElement.addEventListener('click', () => {
                $(countryContainerElement).slideToggle(500);
            });
        }
    } catch (error) {
        console.log(error);
        displayErrorMessage.innerHTML = 'Ooops, something went wrong. Please try again.';
    }
}

input.addEventListener('keyup', (e) => enterKeyTrigger(e, searchButton));
searchButton.addEventListener('click', function () {
    if (selectText.innerText === 'Name') {
        fetchCountry('https://restcountries.com/v3.1/name/');
    } else if (selectText.innerText === 'Language') {
        fetchCountry('https://restcountries.com/v3.1/lang/');
    } else if (selectText.innerText === 'Capital') {
        fetchCountry('https://restcountries.com/v3.1/capital/');
    }
});
