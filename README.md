# The Table Church - Volunteer Dashboard

A live volunteer tracking dashboard that displays current volunteer needs across AM and PM services, pulling data directly from Google Sheets.

## 🌐 Live Site
**Production URL:** [Your Netlify URL here]

## 📊 Features

- **Live Google Sheets Integration** - Automatically updates from your volunteer spreadsheet
- **AM/PM Service Logic** - Independently tracks needs for both services
- **Visual Progress Indicators** - Color-coded progress bars showing urgent needs
- **Mobile Responsive** - Works perfectly on all devices
- **Brand Compliant** - Follows The Table Church style guide
- **Secure API Management** - API keys safely stored server-side
- **Auto Sign-up Integration** - Direct links to Church Center volunteer form

## 🏗️ Architecture

### Frontend
- **Static HTML/CSS/JavaScript** - Deployed via Netlify
- **Responsive Design** - Mobile-first approach
- **Brand Typography** - Rubik Mono One + Raleway fonts
- **Color Palette** - Official Table Church colors

### Backend
- **Netlify Functions** - Secure server-side API calls
- **Google Sheets API** - Live data integration
- **Environment Variables** - Secure credential management

## 📝 Google Sheets Setup

Your volunteer spreadsheet should have these exact columns in "Dashboard_Data" tab:

| Column A | Column B | Column C | Column D | Column E | Column F |
|----------|----------|----------|----------|----------|----------|
| Position Names | Current_AM | Current_PM | Needed_AM | Needed_PM | Notes |

### Example Data:
```
Position Names    | Current_AM | Current_PM | Needed_AM | Needed_PM | Notes
Greeters         | 4          | 3          | 6         | 6         | Welcome visitors at entrance
Ushers           | 2          | 4          | 5         | 5         | Help with seating
Acoustic Guitar  | 5          | 1          | 6         | 6         | Lead worship music
```

## 🔧 Development Setup

### Prerequisites
- Node.js (for Netlify Functions)
- Git
- GitHub account
- Netlify account
- Google Cloud Console access

### Local Development
```bash
# Clone the repository
git clone https://github.com/parrottly/table-volunteer-dashboard-v2.git
cd table-volunteer-dashboard-v2

# Install dependencies
npm install

# Run locally with Netlify CLI
npm run dev
```

## 🚀 Deployment

### Initial Setup (Already Done)
1. **GitHub Repository** - Connected to this repo
2. **Netlify Deployment** - Auto-deploys from main branch
3. **Environment Variables** - Configured in Netlify
4. **Google Sheets API** - API key generated and secured

### Making Updates
```bash
# Make your changes to files
git add .
git commit -m "Description of changes"
git push origin main

# Site automatically rebuilds and deploys in ~2-3 minutes
```

## 🔐 Environment Variables

**Set these in Netlify Dashboard → Site Settings → Environment Variables:**

| Variable | Value | Purpose |
|----------|-------|---------|
| `GOOGLE_SHEET_ID` | `1WVENZ0bUkx256ttYkVpLLGwiu-fFYAh5h94Z6aWI6hM` | Your Google Sheet identifier |
| `GOOGLE_API_KEY` | `[Your secure API key]` | Google Sheets API access |

**⚠️ NEVER put API keys directly in code files!**

## 📊 Volunteer Logic

### Independent Service Tracking
- **AM Service**: Tracks current vs needed separately
- **PM Service**: Tracks current vs needed separately  
- **Total Still Needed**: Sum of shortfalls from both services
- **Progress Bars**: Show worst-case service (most urgent need)

### Example Logic:
```
Position: Acoustic Guitar
- AM: 5/6 (need 1 more)
- PM: 1/6 (need 5 more)
- Total Still Needed: 6 volunteers
- Progress Bar: Red (shows PM's 17% completion)
```

## 🎨 Brand Guidelines

### Typography
- **Headlines**: Rubik Mono One
- **Body Text**: Raleway
- **Hierarchy**: H1 (48px), H2 (36px), H3 (24px), Body (16px)

### Colors
- **Pure White**: `#FFFFFF`
- **Soft Gray**: `#D1D5DB`  
- **Fresh Green**: `#86EFAC`
- **Deep Purple**: `#5B21B6`
- **Charcoal**: `#374151`

### UI Elements
- **Buttons**: Fresh Green background, 8px border radius
- **Cards**: White background, subtle gray border
- **Progress Bars**: Color-coded (red=urgent, yellow=moderate, green=good)

## 🔍 Troubleshooting

### Site Not Updating?
1. Check Google Sheet format (exact column names required)
2. Verify sheet is publicly viewable ("Anyone with link can view")  
3. Check Netlify function logs for errors
4. Ensure environment variables are set correctly

### API Errors?
1. Check if API key is valid (regenerate if needed)
2. Verify sheet ID is correct
3. Test API directly: `https://sheets.googleapis.com/v4/spreadsheets/[SHEET_ID]/values/Dashboard_Data!A:F?key=[API_KEY]`

### Data Not Displaying?
1. Open browser console (F12) for JavaScript errors
2. Check Network tab for failed API calls
3. Verify sheet data format matches expected structure

## 📱 Testing

### Manual Testing
- **Desktop**: Chrome, Safari, Firefox
- **Mobile**: iOS Safari, Android Chrome
- **Tablet**: iPad, Android tablets

### Debug Tools
- `/simple-debug.html` - Test Google Sheets connection
- Browser console - Check for JavaScript errors
- Netlify function logs - Monitor server-side errors

## 🔄 Maintenance Tasks

### Weekly
- [ ] Verify volunteer data is updating correctly
- [ ] Check for any console errors

### Monthly  
- [ ] Review Google Sheets API usage
- [ ] Test sign-up form links still work
- [ ] Verify all volunteer positions display correctly

### As Needed
- [ ] Update API key if compromised
- [ ] Add new volunteer positions to sheet
- [ ] Modify styling per brand updates

## 🆘 Emergency Contacts

### Technical Issues
- **Repository**: https://github.com/parrottly/table-volunteer-dashboard-v2
- **Netlify Dashboard**: [Your Netlify site URL]
- **Google Cloud Console**: https://console.cloud.google.com/

### Quick Fixes
- **Site Down**: Check Netlify deployment status
- **Data Not Loading**: Verify Google Sheet is public
- **Form Not Working**: Test Church Center link manually

## 📚 Documentation References

- [Netlify Functions Docs](https://docs.netlify.com/functions/overview/)
- [Google Sheets API Docs](https://developers.google.com/sheets/api)
- [The Table Church Style Guide](./style%20guide.html)

---

## 🚀 Generated with Claude Code

This volunteer dashboard was built with assistance from Claude Code, ensuring best practices for security, accessibility, and maintainability.

**Co-Authored-By:** Claude <noreply@anthropic.com>

---

*Last Updated: July 2025*