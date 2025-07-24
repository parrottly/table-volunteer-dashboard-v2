// Google Sheets API Configuration
// This file handles the Google Sheets integration for volunteer data

class SheetsAPI {
    constructor() {
        // For client-side, we'll use hardcoded values since process.env isn't available in browsers
        // In production, these should be set via build-time environment variables
        // Environment variables - these will be injected by Netlify at build time
        this.SHEET_ID = window.ENV?.GOOGLE_SHEET_ID || '1WVENZ0bUkx256ttYkVpLLGwiu-fFYAh5h94Z6aWI6hM';
        this.API_KEY = window.ENV?.GOOGLE_API_KEY || 'REPLACE_WITH_NEW_KEY';
        this.RANGE = 'Dashboard_Data!A:F'; // Updated for AM/PM columns
        
        // Alternative: Use service account (more secure for server-side)
        // These would only be used in Netlify Functions, not client-side
        this.SERVICE_ACCOUNT_EMAIL = null;
        this.PRIVATE_KEY = null;
    }

    // Method 1: Using API Key (simpler, requires public sheet)
    async fetchDataWithAPIKey() {
        try {
            const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.SHEET_ID}/values/${this.RANGE}?key=${this.API_KEY}`;
            
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            return this.parseSheetData(data.values);
            
        } catch (error) {
            console.error('Error fetching data with API key:', error);
            throw error;
        }
    }

    // Method 2: Using Service Account (more secure, private sheets)
    async fetchDataWithServiceAccount() {
        try {
            // This requires a server-side implementation or Netlify Functions
            // For now, we'll implement the API key method
            console.log('Service account method - implement via Netlify Functions');
            return this.fetchDataWithAPIKey();
        } catch (error) {
            console.error('Error with service account:', error);
            throw error;
        }
    }

    // Parse the raw sheet data into our volunteer format
    parseSheetData(values) {
        if (!values || values.length < 2) {
            throw new Error('No data found in sheet');
        }

        // Sheet structure:
        // Column A: Position Names
        // Column B: Current_AM
        // Column C: Current_PM  
        // Column D: Needed_AM
        // Column E: Needed_PM
        // Column F: Notes
        
        const headers = values[0];
        const rows = values.slice(1);
        
        return rows
            .filter(row => row[0] && (row[1] || row[2]) && (row[3] || row[4])) // Filter out empty rows
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
                    current: currentAM + currentPM, // Total current volunteers
                    needed: neededAM + neededPM,   // Total needed volunteers
                    stillNeeded: totalShortfall,   // Actual volunteers still needed
                    description: row[5]?.toString().trim() || '',
                    // Service-specific details
                    currentAM: currentAM,
                    currentPM: currentPM,
                    neededAM: neededAM,
                    neededPM: neededPM,
                    amShortfall: amShortfall,
                    pmShortfall: pmShortfall
                };
            })
            .filter(item => item.position && item.needed > 0); // Only valid positions
    }

    // Public method to fetch volunteer data
    async getVolunteerData() {
        try {
            // Try API key method first (simpler)
            return await this.fetchDataWithAPIKey();
        } catch (error) {
            console.error('Failed to fetch from Google Sheets:', error);
            // Return sample data as fallback
            return this.getFallbackData();
        }
    }

    // Fallback data if API fails
    getFallbackData() {
        return [
            {
                position: "Greeters",
                current: 8,
                needed: 12,
                description: "Welcome visitors and members at the entrance"
            },
            {
                position: "Ushers", 
                current: 6,
                needed: 10,
                description: "Help with seating and offering collection"
            },
            {
                position: "Children's Ministry",
                current: 15,
                needed: 20,
                description: "Care for and teach children during services"
            },
            {
                position: "Worship Team",
                current: 12,
                needed: 16,
                description: "Lead congregation in worship through music"
            },
            {
                position: "Tech Team",
                current: 4,
                needed: 8,
                description: "Manage sound, lighting, and video equipment"
            },
            {
                position: "Coffee & Fellowship",
                current: 10,
                needed: 12,
                description: "Serve refreshments and facilitate connections"
            }
        ];
    }

    // Validate sheet data structure
    validateSheetStructure(values) {
        if (!values || values.length < 2) {
            return { valid: false, error: 'Sheet is empty or has no data rows' };
        }

        const headers = values[0];
        const requiredColumns = ['Position', 'Current', 'Needed'];
        
        for (let i = 0; i < Math.min(3, headers.length); i++) {
            if (!headers[i] || !headers[i].toString().toLowerCase().includes(requiredColumns[i].toLowerCase())) {
                return { 
                    valid: false, 
                    error: `Column ${i + 1} should contain "${requiredColumns[i]}" but found "${headers[i]}"` 
                };
            }
        }

        return { valid: true };
    }
}

// Export for use in main script
window.SheetsAPI = SheetsAPI;