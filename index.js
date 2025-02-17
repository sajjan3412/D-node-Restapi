const express = require('express');
const { Pool } = require('pg');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// PostgreSQL Connection
const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'iot_data',
    password: 'Sahil3412',
    port: 5432
});
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*"); // Allow all origins
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT,DELETE"); // Allow specific methods
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization"); // Allow specific headers
    next();
});
// API to store sensor data
app.post('/api/post', async (req, res) => {
    const { temperature, humidity, air_quality, lpg_level } = req.body;
    
    try {
        const query = `
            INSERT INTO sensor_data (temperature, humidity, air_quality, lpg_level) 
            VALUES ($1, $2, $3, $4) RETURNING *`;
        const values = [temperature, humidity, air_quality, lpg_level];

        const result = await pool.query(query, values);
        res.status(201).json({ message: 'Data stored successfully', data: result.rows[0] });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to store data' });
    }
});

// API to fetch latest sensor data
app.get('/api/data/', async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM sensor_data ORDER BY timestamp DESC LIMIT 10');
        res.json(result.rows);
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ error: 'Failed to fetch data' });
    }
});

app.listen(3000, () => console.log('Server running on port 3000'));