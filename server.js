require('dotenv').config();
const express = require('express');
const path = require('path');
const fs = require('fs');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const app = express();
const port = process.env.PORT || 5000;

// Parse JSON bodies
app.use(express.json());

// Helper functions for JSON file operations
const readJSONFile = (filePath) => {
    try {
        if (!fs.existsSync(filePath)) {
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, '{}');
        }
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error(`Error reading ${filePath}:`, error);
        return {};
    }
};

const writeJSONFile = (filePath, data) => {
    try {
        const dir = path.dirname(filePath);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
        return true;
    } catch (error) {
        console.error(`Error writing ${filePath}:`, error);
        return false;
    }
};

// Serve static files from public directory
app.use(express.static('public'));

// User authentication endpoints
app.post('/api/signup', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const users = readJSONFile('./data/users.json');
        
        // Check if user already exists
        if (users.users && users.users[email]) {
            return res.status(400).json({ error: 'User already exists' });
        }
        
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);
        
        // Create user
        const userId = uuidv4();
        if (!users.users) users.users = {};
        users.users[email] = {
            id: userId,
            email,
            password: hashedPassword,
            createdAt: new Date().toISOString()
        };
        
        writeJSONFile('./data/users.json', users);
        
        res.json({ success: true, userId, email });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/signin', async (req, res) => {
    try {
        const { email, password } = req.body;
        
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }
        
        const users = readJSONFile('./data/users.json');
        
        const user = users.users && users.users[email];
        if (!user) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ error: 'Invalid credentials' });
        }
        
        // Create session
        const sessionToken = uuidv4();
        if (!users.sessions) users.sessions = {};
        users.sessions[sessionToken] = {
            userId: user.id,
            email: user.email,
            createdAt: new Date().toISOString()
        };
        
        writeJSONFile('./data/users.json', users);
        
        res.json({ success: true, sessionToken, userId: user.id, email: user.email });
    } catch (error) {
        console.error('Signin error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// Study data endpoints
app.get('/api/study-data/:userId', (req, res) => {
    try {
        const { userId } = req.params;
        const studyData = readJSONFile('./data/study_data.json');
        
        const userSubjects = Object.values(studyData.subjects || {}).filter(s => s.userId === userId);
        const userSessions = Object.values(studyData.study_sessions || {}).filter(s => s.userId === userId);
        
        res.json({ subjects: userSubjects, sessions: userSessions });
    } catch (error) {
        console.error('Get study data error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/subjects', (req, res) => {
    try {
        const { userId, name, color, goal, description } = req.body;
        
        const studyData = readJSONFile('./data/study_data.json');
        if (!studyData.subjects) studyData.subjects = {};
        
        const subjectId = uuidv4();
        studyData.subjects[subjectId] = {
            id: subjectId,
            userId,
            name,
            color,
            goal,
            description,
            createdAt: new Date().toISOString()
        };
        
        writeJSONFile('./data/study_data.json', studyData);
        
        res.json({ success: true, subject: studyData.subjects[subjectId] });
    } catch (error) {
        console.error('Add subject error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

app.post('/api/sessions', (req, res) => {
    try {
        const { userId, subjectId, duration, date } = req.body;
        
        const studyData = readJSONFile('./data/study_data.json');
        if (!studyData.study_sessions) studyData.study_sessions = {};
        
        const sessionId = uuidv4();
        studyData.study_sessions[sessionId] = {
            id: sessionId,
            userId,
            subjectId,
            duration,
            date,
            timestamp: new Date().toISOString()
        };
        
        writeJSONFile('./data/study_data.json', studyData);
        
        res.json({ success: true, session: studyData.study_sessions[sessionId] });
    } catch (error) {
        console.error('Add session error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
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