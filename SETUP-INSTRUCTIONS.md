# Google Sheets API Setup Instructions

## 📋 Prerequisites
- Google account with access to Google Cloud Console
- Your volunteer data spreadsheet in Google Sheets
- Netlify account for deployment

## 🔧 Step 1: Prepare Your Google Sheet

1. **Format your sheet** with these columns (in this exact order):
   ```
   A: Position Name (e.g., "Greeters", "Ushers")
   B: Current Volunteers (number)
   C: Needed Volunteers (number)  
   D: Description (optional)
   ```

2. **Example sheet data:**
   ```
   Position        | Current | Needed | Description
   Greeters       | 8       | 12     | Welcome visitors at entrance
   Ushers         | 6       | 10     | Help with seating
   Children's Min | 15      | 20     | Care for children
   ```

## 🚀 Step 2: Google Cloud Setup

### Option A: API Key Method (Simpler - requires public sheet)

1. **Go to [Google Cloud Console](https://console.cloud.google.com/)**
2. **Create a new project** or select existing one
3. **Enable Google Sheets API:**
   - Go to "APIs & Services" → "Library"
   - Search for "Google Sheets API"
   - Click "Enable"
4. **Create API Key:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "API Key"
   - Copy the API key
5. **Make your sheet public:**
   - In Google Sheets, click "Share"
   - Change permissions to "Anyone with the link can view"

### Option B: Service Account Method (More Secure - works with private sheets)

1. **Complete steps 1-3 from Option A**
2. **Create Service Account:**
   - Go to "APIs & Services" → "Credentials"
   - Click "Create Credentials" → "Service Account"
   - Name it "volunteer-dashboard-sheets"
   - Download the JSON key file
3. **Share your sheet:**
   - Copy the service account email from the JSON file
   - Share your Google Sheet with this email
   - Give "Viewer" permissions

## 🔗 Step 3: Get Your Sheet ID

From your Google Sheets URL, extract the Sheet ID:
```
https://docs.google.com/spreadsheets/d/[SHEET_ID]/edit
```

## 🚀 Step 4: Deploy to Netlify

### Method 1: Netlify Functions (Recommended for Service Account)

1. **Create netlify/functions directory:**
   ```bash
   mkdir -p netlify/functions
   mv netlify-function.js netlify/functions/sheets.js
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables in Netlify:**
   - Go to your Netlify site settings
   - Navigate to "Environment Variables"
   - Add these variables:
     - `GOOGLE_SHEET_ID`: Your sheet ID
     - `SERVICE_ACCOUNT_EMAIL`: From your JSON file
     - `PRIVATE_KEY`: From your JSON file (keep the quotes and \\n)
     - `SHEET_RANGE`: "Sheet1!A:D" (adjust if needed)

### Method 2: Client-side API Key (Simpler setup)

1. **Set environment variables in Netlify:**
   - `GOOGLE_API_KEY`: Your API key
   - `GOOGLE_SHEET_ID`: Your sheet ID

2. **No functions needed** - the client will call Google Sheets directly

## 🧪 Step 5: Test Your Setup

1. **Deploy to Netlify**
2. **Check browser console** for any errors
3. **Verify data loads** from your Google Sheet
4. **Test updates** by changing values in your sheet

## 🔄 Step 6: Update Your Sheet

To add or modify volunteer positions:
1. Edit your Google Sheet
2. The website will automatically refresh every 5 minutes
3. Or manually refresh the page

## 🛠️ Troubleshooting

### Data not loading?
- Check browser console for errors
- Verify sheet ID and API key
- Ensure sheet is publicly accessible (for API key method)
- Check column format matches requirements

### Netlify function errors?
- Verify environment variables are set correctly
- Check function logs in Netlify dashboard
- Ensure service account has sheet access

### Need help?
- Test with sample data first
- Check network tab for API calls
- Verify sheet permissions and formatting

## 📊 Sheet Requirements

**Required columns (exact order):**
1. Column A: Position names (text)
2. Column B: Current volunteer count (numbers only)
3. Column C: Needed volunteer count (numbers only)
4. Column D: Description (optional text)

**Tips:**
- Keep position names concise
- Use whole numbers only
- Leave description blank if not needed
- Don't use empty rows between data