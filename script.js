// Google Sheets API integration
let sheetsAPI = null;

// DOM elements
const totalNeededEl = document.getElementById('total-needed');
const totalCurrentEl = document.getElementById('total-current');
const totalRemainingEl = document.getElementById('total-remaining');
const positionsContainer = document.getElementById('positions-container');

// Initialize the dashboard
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Google Sheets API
    if (typeof SheetsAPI !== 'undefined') {
        sheetsAPI = new SheetsAPI();
    }
    
    loadVolunteerData();
});

// Load and display volunteer data
async function loadVolunteerData() {
    try {
        showLoading();
        console.log('Starting to load volunteer data...');
        
        let data;
        
        // Try to fetch from Google Sheets first
        if (sheetsAPI) {
            try {
                console.log('Attempting to load from Google Sheets...');
                data = await sheetsAPI.getVolunteerData();
                console.log('✅ Data loaded from Google Sheets:', data);
            } catch (sheetsError) {
                console.error('❌ Google Sheets failed:', sheetsError);
                data = getFallbackData();
                console.log('Using fallback data instead');
            }
        } else {
            console.log('SheetsAPI not available, trying Netlify function...');
            // Try Netlify function if available
            try {
                data = await fetchFromNetlifyFunction();
                console.log('✅ Data loaded from Netlify function:', data);
            } catch (netlifyError) {
                console.error('❌ Netlify function failed:', netlifyError);
                data = getFallbackData();
                console.log('Using fallback data instead');
            }
        }
        
        console.log('Final data being used:', data);
        updateMetrics(data);
        renderPositions(data);
        hideLoading();
        
    } catch (error) {
        console.error('❌ Critical error loading volunteer data:', error);
        hideLoading();
        showError('Failed to load volunteer data. Please try again later.');
    }
}

// Update the metrics overview
function updateMetrics(data) {
    const totalNeeded = data.reduce((sum, position) => sum + position.needed, 0);
    const totalCurrent = data.reduce((sum, position) => sum + position.current, 0);
    const totalStillNeeded = data.reduce((sum, position) => sum + (position.stillNeeded || 0), 0);
    
    // Animate numbers
    animateNumber(totalNeededEl, totalNeeded);
    animateNumber(totalCurrentEl, totalCurrent);
    animateNumber(totalRemainingEl, totalStillNeeded);
}

// Render volunteer positions
function renderPositions(data) {
    positionsContainer.innerHTML = '';
    
    data.forEach(position => {
        const positionCard = createPositionCard(position);
        positionsContainer.appendChild(positionCard);
    });
}

// Create a position card element
function createPositionCard(position) {
    // Calculate progress based on worst-case service need
    const amProgress = position.neededAM > 0 ? (position.currentAM / position.neededAM) : 1;
    const pmProgress = position.neededPM > 0 ? (position.currentPM / position.neededPM) : 1;
    
    // Use the worse of the two services for overall status
    const worstProgress = Math.min(amProgress, pmProgress);
    const percentage = Math.min(worstProgress * 100, 100);
    
    const card = document.createElement('div');
    card.className = 'position-card';
    
    // Determine status color based on worst service percentage
    let statusColor = '#81C784'; // Green - good
    if (percentage < 50) {
        statusColor = '#FF7043'; // Orange/Red - needs help
        card.style.borderLeftColor = '#FF7043';
    } else if (percentage < 75) {
        statusColor = '#FFB74D'; // Yellow - moderate need
        card.style.borderLeftColor = '#FFB74D';
    }
    
    // Build AM/PM breakdown with service-specific status
    let amPmBreakdown = '';
    if (position.currentAM !== undefined && position.currentPM !== undefined) {
        const amStatus = position.amShortfall > 0 ? 
            `<span style="color: #FF7043;">need ${position.amShortfall} more</span>` : 
            '<span style="color: #81C784;">✓ covered</span>';
        const pmStatus = position.pmShortfall > 0 ? 
            `<span style="color: #FF7043;">need ${position.pmShortfall} more</span>` : 
            '<span style="color: #81C784;">✓ covered</span>';
            
        amPmBreakdown = `
            <div style="margin-top: 0.5rem; font-size: 0.9rem; color: #4A5568;">
                <div><strong>AM Service:</strong> ${position.currentAM}/${position.neededAM} (${amStatus})</div>
                <div><strong>PM Service:</strong> ${position.currentPM}/${position.neededPM} (${pmStatus})</div>
            </div>
        `;
    }

    const totalStillNeeded = position.stillNeeded || 0;

    card.innerHTML = `
        <div class="position-header">
            <h3 class="position-name">${position.position}</h3>
            <div class="position-status">
                <span class="position-numbers">${position.current}/${position.needed} total</span>
            </div>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${percentage}%; background-color: ${statusColor};"></div>
        </div>
        ${amPmBreakdown}
        <p style="margin-top: 1rem; color: #4A5568; font-size: 0.9rem;">${position.description}</p>
        ${totalStillNeeded > 0 ? `<p style="margin-top: 0.5rem; color: #FF7043; font-weight: 600;">Still need ${totalStillNeeded} more volunteers</p>` : '<p style="margin-top: 0.5rem; color: #81C784; font-weight: 600;">All services covered! 🎉</p>'}
    `;
    
    return card;
}

// Animate number counting
function animateNumber(element, target) {
    const duration = 1000;
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current);
    }, 16);
}

// Show error message
function showError(message) {
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.textContent = message;
    
    positionsContainer.innerHTML = '';
    positionsContainer.appendChild(errorDiv);
}

// Fetch data from Netlify function
async function fetchFromNetlifyFunction() {
    const response = await fetch('/.netlify/functions/sheets');
    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    
    if (result.error) {
        throw new Error(result.error);
    }
    
    return result.data;
}

// Fallback data if all methods fail
function getFallbackData() {
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

// Loading and UI helper functions
function showLoading() {
    positionsContainer.innerHTML = '<div class="loading">Loading volunteer data...</div>';
}

function hideLoading() {
    const loadingEl = positionsContainer.querySelector('.loading');
    if (loadingEl) {
        loadingEl.remove();
    }
}

// Refresh data periodically (every 5 minutes)
setInterval(() => {
    loadVolunteerData();
}, 5 * 60 * 1000);

// Manual refresh function (can be called from console or button)
function refreshData() {
    loadVolunteerData();
}