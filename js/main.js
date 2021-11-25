
/*
Det ska finnas ett sökfält, en select-meny och en sökknapp
Användaren ska kunna söka på landets namn eller språk.
Användaren söker på landets namn:
Information om landet visas tillsammans med bild på landets flagga.

Användaren söker på språk:
En lista visas med namnet på länderna där det valda språket talas samt deras flagga. Vid klick på flaggan eller namnet får man upp mer information om landet. Samma som visas vid namnsök?

*/

let input = document.getElementById('search-field');
let searchButton = document.getElementById('search-btn');
let pageContent = document.getElementById('content-container');

async function fetchCountry() {
    try {
        let response = await fetch('https://restcountries.com/v3.1/name/sweden'); //Ta bort sweden och lägg till + input.value
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);


    } catch (error) {
        console.log(error);
        pageContent.innerHTML = 'Oj, något gick fel. Vänligen försök igen senare.'
    }
}

fetchCountry();