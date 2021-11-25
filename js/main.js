




async function fetchCountry() {
    try {
        let response = await fetch('https://restcountries.com/v3.1/name/');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        let data = await response.json();
        console.log(data);
    } catch {

    }
}

fetchCountry();