// Environment variable injection for Netlify
// This will be populated at build time
window.ENV = {
    GOOGLE_SHEET_ID: '%%GOOGLE_SHEET_ID%%',
    GOOGLE_API_KEY: '%%GOOGLE_API_KEY%%'
};