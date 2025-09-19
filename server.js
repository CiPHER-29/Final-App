const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// Serve static files from public directory
app.use(express.static('public'));

// Route for Supabase configuration
app.get('/api/supabase-config', (req, res) => {
    res.json({
        url: process.env.VITE_SUPABASE_URL || 'https://ixpemzhkbewagfjwctlv.supabase.co',
        key: process.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml4cGVtemhrYmV3YWdmandjdGx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTgyNzA0NjMsImV4cCI6MjA3Mzg0NjQ2M30.Qsqsp1ez82eyKUDMVldEGsHWIzIx1BhvwdQwBZUf_2M'
    });
});

// Route for root path
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'landing.html'));
});

// Route for the main app
app.get('/app', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'complete_study_tracker.html'));
});

app.listen(port, '0.0.0.0', () => {
    console.log(`Study Tracker server running on http://0.0.0.0:${port}`);
    console.log(`Supabase URL: ${process.env.VITE_SUPABASE_URL ? 'Loaded from environment' : 'Using fallback'}`);
});