
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
let pageContent = document.getElementById('content-container');

let createElement = (elementType, text, appendTo) => {
    let element = document.createElement(elementType);
    element.innerHTML = text;
    appendTo.append(element);
    return element;
}

async function fetchCountry() {
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
            for (let capital of country.capital) {
                let capitalContainer = document.createElement('section')
                let capitalNamesUl = document.createElement('ul');
                let capitalNamesLi = document.createElement('li');
                capitalNamesLi.innerHTML = capital;
                capitalNamesUl.append(capitalNamesLi);
                capitalContainer.append(capitalNamesUl);
                countryContent.append(capitalContainer);
            }
            // let nativeName = document.createElement('i');
            // nativeName.innerHTML = country.name.nativeName.swe.common;
            let currency = document.createElement('h2');
            currency.innerHTML = 'Currency';
            pageContent.append(countryName, countryContent);

        }

    } catch (error) {
        console.log(error);
        pageContent.innerHTML = 'Oj, något gick fel. Vänligen försök igen senare.'
    }
}

searchButton.addEventListener('click', fetchCountry);