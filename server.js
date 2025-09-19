const express = require('express');
const path = require('path');

const app = express();
const port = 5000;

// Serve static files
app.use(express.static('.'));

// Route for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'landing.html'));
});

// Route for the main app
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'complete_study_tracker.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Study Tracker server running on http://0.0.0.0:${port}`);
});