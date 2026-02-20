async function fetchWeather(location, unit = 'us') {
    const url = `/api/weather?location=${encodeURIComponent(location)}&unit=${unit}`;
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        console.log('Raw API data:', data);
        return data;
    } catch (error) {
        console.error('Fetch error:', error);
        return null;
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
        const data = await fetchWeather(location, unit);
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
