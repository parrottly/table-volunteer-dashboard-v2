// Netlify Function for secure Google Sheets API access
// Uses API key from environment variables (secure server-side)

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
        // Use API key method (simpler and works with public sheets)
        const SHEET_ID = process.env.GOOGLE_SHEET_ID;
        const API_KEY = process.env.GOOGLE_API_KEY;
        const RANGE = 'Dashboard_Data!A:F';
        
        if (!SHEET_ID || !API_KEY) {
            throw new Error('Missing required environment variables');
        }
        
        // Fetch from Google Sheets API
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${SHEET_ID}/values/${RANGE}?key=${API_KEY}`;
        const response = await fetch(url);
        
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Google Sheets API error: ${response.status} ${errorText}`);
        }
        
        const data = await response.json();
        const values = data.values;
        
        if (!values || values.length < 2) {
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({ error: 'No data found in sheet' })
            };
        }

        // Parse the data with AM/PM logic
        const headers_row = values[0];
        const rows = values.slice(1);
        
        const volunteerData = rows
            .filter(row => row[0] && (row[1] || row[2]) && (row[3] || row[4]))
            .map(row => {
                const currentAM = parseInt(row[1]) || 0;
                const currentPM = parseInt(row[2]) || 0;
                const neededAM = parseInt(row[3]) || 0;
                const neededPM = parseInt(row[4]) || 0;
                
                // Calculate independent service needs
                const amShortfall = Math.max(0, neededAM - currentAM);
                const pmShortfall = Math.max(0, neededPM - currentPM);
                const totalShortfall = amShortfall + pmShortfall;
                
                return {
                    position: row[0]?.toString().trim() || '',
                    current: currentAM + currentPM,
                    needed: neededAM + neededPM,
                    stillNeeded: totalShortfall,
                    description: row[5]?.toString().trim() || '',
                    currentAM: currentAM,
                    currentPM: currentPM,
                    neededAM: neededAM,
                    neededPM: neededPM,
                    amShortfall: amShortfall,
                    pmShortfall: pmShortfall
                };
            })
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