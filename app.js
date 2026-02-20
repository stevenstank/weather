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

function processWeatherData(data) {
    if (!data || !data.currentConditions) return null;
    return {
        location: data.resolvedAddress,
        temp: data.currentConditions.temp,
        feelslike: data.currentConditions.feelslike,
        description: data.currentConditions.conditions,
        icon: data.currentConditions.icon,
        humidity: data.currentConditions.humidity,
        windspeed: data.currentConditions.windspeed
    };
}

function displayWeather(info, unit) {
    const display = document.getElementById('weather-display');
    if (!info) {
        display.innerHTML = '<span style="color:red;">No weather data found.</span>';
        return;
    }
    const unitSymbol = unit === 'us' ? '°F' : '°C';
    display.innerHTML = `
        <h2>${info.location}</h2>
        <div><strong>${info.temp}${unitSymbol}</strong> (feels like ${info.feelslike}${unitSymbol})</div>
        <div>${info.description}</div>
        <div>Humidity: ${info.humidity}%</div>
        <div>Wind: ${info.windspeed} ${unit === 'us' ? 'mph' : 'kph'}</div>
    `;
}

function setLoading(isLoading) {
    document.getElementById('loading').style.display = isLoading ? 'block' : 'none';
}

const form = document.getElementById('location-form');
const unitToggle = document.getElementById('unit-toggle');
let lastLocation = '';

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const location = document.getElementById('location-input').value.trim();
    const unit = unitToggle.value;
    if (!location) return;
    setLoading(true);
    const data = await fetchWeather(location, unit);
    const info = processWeatherData(data);
    displayWeather(info, unit);
    setLoading(false);
    lastLocation = location;
});

unitToggle.addEventListener('change', async () => {
    if (!lastLocation) return;
    setLoading(true);
    const unit = unitToggle.value;
    const data = await fetchWeather(lastLocation, unit);
    const info = processWeatherData(data);
    displayWeather(info, unit);
    setLoading(false);
});
