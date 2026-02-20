async function fetchWeather(location, unit = 'us') {
    const url = `/api/weather?location=${encodeURIComponent(location)}&unit=${unit}`;
    try {
        const response = await fetch(url);
        if (!response.ok) {
            let details = '';
            try {
                const body = await response.json();
                details = body && body.error ? body.error : JSON.stringify(body);
            } catch (e) {
                details = await response.text();
            }
            throw new Error(`Server returned ${response.status}: ${details}`);
        }
        const data = await response.json();
        console.log('Raw API data:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('location-form');
    const input = document.getElementById('location-input');
    const weatherDisplay = document.getElementById('weather-display');
    const loading = document.getElementById('loading');
    const unitToggle = document.getElementById('unit-toggle');

    async function handleWeatherSearch(e) {
        e.preventDefault();
        const location = input.value.trim();
        const unit = unitToggle.value;
        if (!location) return;
        weatherDisplay.innerHTML = '';
        loading.style.display = 'block';
        let data;
        try {
            data = await fetchWeather(location, unit);
        } catch (err) {
            loading.style.display = 'none';
            weatherDisplay.innerHTML = `<p>${err.message}</p>`;
            return;
        }
        loading.style.display = 'none';
        if (data && data.address) {
                const temp = data.currentConditions && data.currentConditions.temp !== undefined ? data.currentConditions.temp : 'N/A';
                const unitSymbol = unit === 'us' ? 'F' : 'C';
                const description = data.description || '';
                weatherDisplay.innerHTML = `
                    <h2>${data.address}</h2>
                    <p class="temp">Temperature = ${temp}°${unitSymbol}</p>
                    <p class="description">${description}</p>
                `;
        } else {
            weatherDisplay.innerHTML = '<p>Weather data not found. Please try another location.</p>';
        }
    }

    form.addEventListener('submit', handleWeatherSearch);
});
