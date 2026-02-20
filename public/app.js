// ...existing code...
// Visual Crossing API key is now handled by backend
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
// ...existing code...
// (rest of your JS logic, including event listeners and display functions)
