// Top-level backend for restaurant platform with Google Sheets integration
// Install: npm install express body-parser cors googleapis

const express = require('express');

const app = express();


const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
const { google } = require('googleapis');
const fs = require('fs');

app.use(express.static(__dirname));
app.use(cors());
app.use(bodyParser.json());

// === Google Sheets Setup ===
// 1. Go to Google Cloud Console > Create Project
// 2. Enable Google Sheets API
// 3. Create Service Account, download JSON key, and share your sheet with the service account email
// 4. Place the JSON key as 'google-credentials.json' in your project root

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];
const CREDENTIALS_PATH = 'google-credentials.json';
const SPREADSHEET_ID = '1LQ-zFR2TY1k28D1S9AQBRzJ67IPhgrNvtF0HE5YbQtM'; // <-- Replace with your Sheet ID

function getSheetsClient() {
  const credentials = JSON.parse(fs.readFileSync(CREDENTIALS_PATH));
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  });
  return google.sheets({ version: 'v4', auth });
}

// === Endpoints ===

// Simulated OTP login
const users = {};
app.post('/login', (req, res) => {
  const { phone } = req.body;
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  users[phone] = { otp };
  console.log(`Simulated OTP for ${phone}: ${otp}`);
  res.json({ success: true, message: 'OTP sent (simulated, see server console)' });
});

app.post('/verify-otp', (req, res) => {
  const { phone, otp } = req.body;
  if (users[phone] && users[phone].otp === otp) {
    users[phone].loggedIn = true;
    res.json({ success: true });
  } else {
    res.status(401).json({ success: false, error: 'Invalid OTP' });
  }
});

// Log order to Google Sheets
app.post('/order', async (req, res) => {
  console.log("ORDER API HIT:", req.body);

  const { phone, order, total, timestamp } = req.body;

  if (!order || !Array.isArray(order) || order.length === 0) {
      console.log("❌ EMPTY ORDER BLOCKED");
      return res.status(400).json({ error: "Empty order not allowed" });
  }
  try {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'orders!A:E',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[phone, JSON.stringify(order), total, timestamp,"pending"]],
      },  
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to log order' });
  }
});
app.get('/orders', async (req, res) => {
  try {
    const sheets = getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'orders!A:E',
    });

    res.json(response.data.values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});

// Alias for /get-orders (used by admin panel)
app.get('/get-orders', async (req, res) => {
  try {
    const sheets = getSheetsClient();

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: 'orders!A:E',
    });

    res.json(response.data.values);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});


// Log reservation to Google Sheets
app.get("/get-reservations", async (req, res) => {
    try {
        const sheets = getSheetsClient();
        const response = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Reservations!A:C",
        });

        const rows = response.data.values || [];

        const data = rows.slice(1).map(row => ({
            date: row[0],
            time: row[1],
            guests: row[2]
        }));

        res.json(data);

    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading reservations");
    }
});
    


// Feedback endpoint
app.post('/feedback', async (req, res) => {
  const { phone, rating, comment, timestamp } = req.body;
  try {
    const sheets = getSheetsClient();
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: 'Feedback!A:D',
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[phone, rating, comment, timestamp]],
      },
    });
    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: 'Failed to log feedback' });
  }
});

app.listen(3000, '0.0.0.0', () => {
    console.log("Server running on port 3000");
});

app.get("/test", async (req, res) => {
  await sheets.spreadsheets.values.append({
    spreadsheetId: SPREADSHEET_ID,
    range: "Orders!A:D",
    valueInputOption: "USER_ENTERED",
    requestBody: {
      values: [["9999999999", "Test Order", 100, new Date().toISOString()]],
    },
  });

  res.send("Test Added");
});
app.post("/save-reservation", async (req, res) => {
  try {
    const { date, time, guests } = req.body;

    const sheets = await getSheetsClient();

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: "Reservations!A:C",
      valueInputOption: "USER_ENTERED",
      requestBody: {
        values: [[date, time, guests]],
      },
    });

    res.send("Reservation saved");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error saving reservation");
  }
});


app.post("/save-feedback", async (req, res) => {
    try {
        const { name, feedback } = req.body;

        const sheets = await getSheetsClient();

        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: "Feedback!A:B",
            valueInputOption: "USER_ENTERED",
            requestBody: {
                values: [[name, feedback]]
            }
        });

        res.send("Feedback saved");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error saving feedback");
    }
});

app.get("/get-feedback", async (req, res) => {
    try {
        const sheets = await getSheetsClient();

        const result = await sheets.spreadsheets.values.get({
            spreadsheetId: SPREADSHEET_ID,
            range: "Feedback!A:B"
        });

        const rows = result.data.values || [];

        const feedback = rows.map(row => ({
            name: row[0],
            feedback: row[1]
        }));

        res.json(feedback);
    } catch (error) {
        console.error(error);
        res.status(500).send("Error loading feedback");
    }
});

app.post('/update-status', async (req, res) => {
  const { rowIndex, status } = req.body;

  try {
    const sheets = getSheetsClient();

    await sheets.spreadsheets.values.update({
      spreadsheetId: SPREADSHEET_ID,
      range: `orders!E${rowIndex}`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[status]],
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
});
