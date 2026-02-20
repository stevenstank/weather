require('dotenv').config();
const express = require('express');
const fetch = require('node-fetch');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const API_KEY = process.env.VISUAL_CROSSING_KEY;
const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';

app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/weather', async (req, res) => {
    const { location, unit } = req.query;

    console.log("Incoming request:", location, unit);

    if (!location) return res.status(400).json({ error: 'Location required' });

    try {
        const unitGroup = unit === 'metric' ? 'metric' : 'us';

        const url = `${BASE_URL}/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;

        console.log("API URL:", url);

        const response = await fetch(url);
        const data = await response.json();

        console.log("Weather API response:", data);

        res.json(data);

    } catch (err) {
        console.log("ERROR:", err.message);
        res.status(500).json({ error: err.message });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
