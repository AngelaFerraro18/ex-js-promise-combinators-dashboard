// Scrivi la funzione getDashboardData(query), che deve:
// Essere asincrona (async).
// Utilizzare Promise.all() per eseguire più richieste in parallelo.
// Restituire una Promise che risolve un oggetto contenente i dati aggregati.
// Stampare i dati in console in un messaggio ben formattato.
// Testa la funzione con la query "london"


async function getDashboardData(query) {
    const url = fetch(`http://localhost:3333/destinations?search=${query}`);

    const url2 = fetch(`http://localhost:3333/weathers?search=${query}`);

    const url3 = fetch(`http://localhost:3333/airports?search=${query}`);

    try {
        const [res1, res2, res3] = await Promise.all([url, url2, url3]);
        const [destinations, weather, airports] = await Promise.all([res1.json(), res2.json(), res3.json()])

        return {
            destinations,
            weather,
            airports
        }

    } catch (error) {
        console.error(error)
        throw new Error(`Non sono stati trovati elementi corrispondenti a ${query}`)

    }
}

(async () => {
    const result = await getDashboardData('vienna');
    console.log('I dati totali sono:', result)

    const destination = result.destinations[0];
    const weather = result.weather[0];
    const airport = result.airports[0];

    console.log(`${destination.name} is in ${destination.country}.
        Today there are ${weather.temperature} degrees and it's ${weather.weather_description}.
        The main airport is ${airport.name}`)
})()


