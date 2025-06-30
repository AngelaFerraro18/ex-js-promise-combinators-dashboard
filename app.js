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
        const [destinationsResult, weathersResult, airportsResult] = await Promise.allSettled([res1.json(), res2.json(), res3.json()])

        const data = {};

        if (destinationsResult.status === 'rejected') {
            console.error(`Problema in destinations: `, destinationsResult.reason);
            data.city = null;
            data.country = null;
        } else {
            const destinations = destinationsResult.value;
            data.city = destinations[0]?.name ?? null;
            data.country = destinations[0]?.country ?? null
        }

        if (weathersResult.status === 'rejected') {
            console.error(`Problema in weather: `, weathersResult.reason);
            data.temperature = null;
            data.weather = null;
        } else {
            const weathers = weathersResult.value;
            data.temperature = weathers[0]?.temperature ?? null;
            data.weather = weathers[0]?.weather_description ?? null
        }
        if (airportsResult.status === 'rejected') {
            console.error(`Problema in destinations: `, airportsResult.reason);
            data.airport = null;
        } else {
            const airports = airportsResult.value;
            data.airport = airports[0]?.name ?? null;
        }

        return data;

    } catch (error) {
        console.error(error)
        throw new Error(`Non sono stati trovati elementi corrispondenti a ${query}`)

    }
}

(async () => {
    const result = await getDashboardData('london');
    console.log('I dati totali sono:', result)

    let frase = '';

    if (result.city !== null && result.country !== null) {
        frase += `${result.city} is in ${result.country}. \n`
    }
    if (result.temperature !== null && result.weather !== null) {
        frase += `Today there are ${result.temperature} degrees and it's ${result.weather}. \n`
    }

    if (result.airport !== null) {
        frase += `The main airport is ${result.airport}`
    }
    console.log(frase)
})()


