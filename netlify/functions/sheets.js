// Netlify Function for secure Google Sheets API access
// Place this in netlify/functions/sheets.js

const { GoogleAuth } = require('google-auth-library');
const { google } = require('googleapis');

exports.handler = async (event, context) => {
    // Set CORS headers
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS'
    };

    // Handle preflight requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    try {
        // Initialize Google Auth with service account
        const auth = new GoogleAuth({
            credentials: {
                client_email: process.env.SERVICE_ACCOUNT_EMAIL,
                private_key: process.env.PRIVATE_KEY.replace(/\\n/g, '\n'),
            },
            scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
        });

        // Create sheets API client
        const sheets = google.sheets({ version: 'v4', auth });

        // Fetch data from sheet
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: process.env.GOOGLE_SHEET_ID,
            range: process.env.SHEET_RANGE || 'Sheet1!A:D',
        });

        const values = response.data.values;
        
        if (!values || values.length < 2) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ error: 'No data found in sheet' })
            };
        }

        // Parse the data
        const headers_row = values[0];
        const rows = values.slice(1);
        
        const volunteerData = rows
            .filter(row => row[0] && row[1] && row[2])
            .map(row => ({
                position: row[0]?.toString().trim() || '',
                current: parseInt(row[1]) || 0,
                needed: parseInt(row[2]) || 0,
                description: row[3]?.toString().trim() || ''
            }))
            .filter(item => item.position && item.needed > 0);

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                data: volunteerData,
                lastUpdated: new Date().toISOString()
            })
        };

    } catch (error) {
        console.error('Error fetching from Google Sheets:', error);
        
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ 
                error: 'Failed to fetch data from Google Sheets',
                details: error.message 
            })
        };
    }
};