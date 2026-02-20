const fetch = require('node-fetch');

module.exports = async (req, res) => {
  const { location, unit } = req.query || {};

  if (!location) {
    res.status(400).json({ error: 'Location required' });
    return;
  }

  const API_KEY = process.env.VISUAL_CROSSING_KEY;
  if (!API_KEY) {
    res.status(500).json({ error: 'API key not configured' });
    return;
  }

  try {
    const unitGroup = unit === 'metric' ? 'metric' : 'us';
    const BASE_URL = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline';
    const url = `${BASE_URL}/${encodeURIComponent(location)}?unitGroup=${unitGroup}&key=${API_KEY}&contentType=json`;

    const response = await fetch(url);
    if (!response.ok) {
      const text = await response.text();
      res.status(response.status).json({ error: text });
      return;
    }

    const data = await response.json();
    res.status(200).json(data);
  } catch (err) {
    console.error('API error:', err);
    res.status(500).json({ error: err.message });
  }
};
