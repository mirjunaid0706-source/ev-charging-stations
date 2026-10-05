const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.static(__dirname));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ev charging.html'));
});

const DATA_FILE = path.join(__dirname, 'db_data.json');

// Default Database State
const defaultData = {
  stations: [
    {
      id: 1, name: "NH-16 Nellore Bypass Road", state: "Andhra Pradesh", lat: 14.4426, lng: 79.9865, status: "operational", address: "NH-16 Highway Corridor, Nellore",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["Food Court", "Rest Area", "WiFi", "24/7 Security"],
      chargers: [
        { id: "WS-001-A", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-001-B", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-001-C", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-001-D", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-001-E", type: "AC", power: 7, status: "available", connector: "type2" },
        { id: "WS-001-F", type: "AC", power: 10, status: "available", connector: "type2" }
      ]
    },
    {
      id: 2, name: "NH-44 Pullur Tollgate", state: "Telangana", lat: 16.2358, lng: 77.8096, status: "operational", address: "NH-44 Hyderabad-Bangalore, Gadwal District",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["Cafe", "Washroom", "Parking"],
      chargers: [
        { id: "WS-002-A", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-002-B", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-002-C", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-002-D", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-002-E", type: "AC", power: 7, status: "available", connector: "type2" },
        { id: "WS-002-F", type: "AC", power: 10, status: "available", connector: "type2" }
      ]
    },
    {
      id: 3, name: "NH-16 Ongole", state: "Andhra Pradesh", lat: 15.5057, lng: 80.0499, status: "operational", address: "NH-16, Medarametla, Boddupalem, Ongole",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["Food Court", "Rest Area", "WiFi"],
      chargers: [
        { id: "WS-003-A", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-003-B", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-003-C", type: "DC", power: 60, status: "charging", connector: "bharat" },
        { id: "WS-003-D", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-003-E", type: "AC", power: 7, status: "available", connector: "type2" },
        { id: "WS-003-F", type: "AC", power: 10, status: "available", connector: "type2" }
      ]
    },
    {
      id: 4, name: "Hitech City, Madhapur", state: "Telangana", lat: 17.4486, lng: 78.3908, status: "operational", address: "Hitech City, Madhapur (IT Corridor, Hyderabad)",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["WiFi", "Cafe", "Shopping Mall", "Rest Area", "24/7 Security"],
      chargers: [
        { id: "WS-004-A", type: "DC", power: 180, status: "available", connector: "ccs2" },
        { id: "WS-004-B", type: "DC", power: 180, status: "available", connector: "ccs2" },
        { id: "WS-004-C", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-004-D", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-004-E", type: "AC", power: 22, status: "available", connector: "type2" },
        { id: "WS-004-F", type: "AC", power: 11, status: "available", connector: "type2" }
      ]
    },
    {
      id: 5, name: "Khammam District", state: "Telangana", lat: 17.2473, lng: 80.1514, status: "upcoming", address: "Maddulapalli Mandal, Khammam District (Green Field Highway)",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["Parking", "Security"],
      chargers: [
        { id: "WS-005-A", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-005-B", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-005-C", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-005-D", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-005-E", type: "AC", power: 7, status: "offline", connector: "type2" }
      ]
    },
    {
      id: 6, name: "Rishikonda Beach Road, Vizag", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, status: "upcoming", address: "Rishikonda Beach Road, Visakhapatnam",
      connectors: ["ccs2", "type2"],
      amenities: ["Beach View", "Cafe", "Parking"],
      chargers: [
        { id: "WS-006-A", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-006-B", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-006-C", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-006-D", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-006-E", type: "AC", power: 7, status: "offline", connector: "type2" }
      ]
    }
  ],
  registeredUsers: [],
  chargingHistory: [],
  partnerLeads: []
};

function loadDb() {
  if (!fs.existsSync(DATA_FILE)) {
    saveDb(defaultData);
    return defaultData;
  }
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== 'object') throw new Error('Invalid DB structure');
    return {
      stations: parsed.stations || defaultData.stations,
      registeredUsers: parsed.registeredUsers || defaultData.registeredUsers,
      chargingHistory: parsed.chargingHistory || defaultData.chargingHistory,
      partnerLeads: parsed.partnerLeads || []
    };
  } catch (err) {
    console.warn('⚠️ DB load error, using fallback:', err.message);
    return defaultData;
  }
}

function saveDb(data) {
  try {
    const tempFile = DATA_FILE + '.tmp';
    fs.writeFileSync(tempFile, JSON.stringify(data, null, 2), 'utf-8');
    fs.renameSync(tempFile, DATA_FILE);
  } catch (err) {
    console.error('❌ DB save error:', err.message);
  }
}

// 1. Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'WattSquare ChargeHub REST API Backend',
    version: '3.5.0-max',
    website: 'wattsquarechargehub.com',
    timestamp: new Date().toISOString()
  });
});

// 2. Get All Stations
app.get('/api/stations', (req, res) => {
  const db = loadDb();
  res.json({ success: true, count: db.stations.length, stations: db.stations });
});

// 3. Save Partner Lead / Contact Form
app.post('/api/leads', (req, res) => {
  const db = loadDb();
  const { name, phone, email, type, location, message } = req.body || {};
  if (!name || !phone) {
    return res.status(400).json({ success: false, error: 'Name and Phone are required' });
  }

  const newLead = {
    id: Date.now(),
    name: name.trim(),
    phone: phone.trim(),
    email: email ? email.trim() : '',
    type: type || 'Landowner',
    location: location || '',
    message: message || '',
    date: new Date().toISOString().split('T')[0]
  };

  db.partnerLeads.unshift(newLead);
  saveDb(db);
  res.status(201).json({ success: true, message: 'Lead submitted successfully', lead: newLead });
});

// 4. ADVANCED GEMINI-POWERED & SMART INTELLECTUAL AI CHATBOT ENDPOINT
app.post('/api/ai/chat', async (req, res) => {
  try {
    const db = loadDb();
    const { question, userApiKey, history } = req.body || {};
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question string is required' });
    }

    const qTrim = question.trim();
    const qLower = qTrim.toLowerCase();
    const stations = db.stations || [];
    const mainStation = stations.find(s => s.name.includes('Pullur') || s.id === 1) || stations[0] || {
      name: "NH-44 Pullur Tollgate",
      state: "Telangana",
      lat: 16.2358,
      lng: 77.8096,
      status: "operational",
      address: "NH-44 Hyderabad-Bangalore Highway, Pullur Tollgate, Gadwal District, Telangana"
    };

    // 1. Try Google Gemini API if an API key is provided
    const apiKeyToUse = userApiKey || process.env.GEMINI_API_KEY;

    if (apiKeyToUse) {
      try {
        const systemPrompt = `You are WattSquare AI Companion, an expert AI Assistant for WattSquare ChargeHub — India's premier 720 kW ultra-fast EV highway charging station.

PRIMARY LIVE STATION DATA:
- Station Name: ${mainStation.name}
- State: ${mainStation.state}
- Location: ${mainStation.address}
- Coordinates: Latitude ${mainStation.lat}, Longitude ${mainStation.lng}
- Status: OPERATIONAL & LIVE
- Available Chargers: 6 Active Guns (150 kW DC CCS2 Ultra-Fast, 60 kW DC Bharat Fast, 22 kW AC Type 2, 7 kW AC Type 2)
- Amenities: 24/7 Food Court, AC Rest Lounge, WiFi, Washrooms, 24/7 Security & CCTV

KEY POLICIES & SPECS:
- Ultra-Fast Speed: 150 kW DC charges EVs 10% to 80% in ~18 minutes (~250 km range added).
- Tariffs: ₹22/kWh for 150kW DC Ultra-Fast, ₹18/kWh for 60kW DC Fast, ₹16/kWh for Type 2 AC.
- Payments: No app required! Direct UPI (GPay/PhonePe/Paytm), Debit/Credit Card, RFID.
- EV Compatibility: Universal CCS2, Bharat DC-001, Type 2 AC (Tata Nexon EV, MG ZS EV, Ioniq 5, BYD Atto 3, Tiago EV, Comet EV, Mahindra XUV400).
- Emergency Help: If gun is locked in vehicle, click key fob unlock button twice or pull manual release inside trunk. Helpline: +91 90327 23450.
- Directions: Available via Google Maps to Lat: ${mainStation.lat}, Lng: ${mainStation.lng}.

RESPONSE INSTRUCTIONS:
Answer the user query concisely, accurately, using bolding, bullet points, and helpful tone. Format interactive buttons like [📍 View Station Map] or [📞 Call Helpline] or [🗺️ Get Directions].`;

        const geminiRes = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKeyToUse}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: systemPrompt }] },
              { role: 'model', parts: [{ text: 'Understood. I am WattSquare AI Companion ready to assist EV drivers at NH-44 Pullur Tollgate!' }] },
              ...(Array.isArray(history) ? history.map(h => ({
                role: h.sender === 'user' ? 'user' : 'model',
                parts: [{ text: h.text }]
              })) : []),
              { role: 'user', parts: [{ text: qTrim }] }
            ]
          })
        });

        if (geminiRes.ok) {
          const geminiData = await geminiRes.json();
          const aiText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text;
          if (aiText) {
            return res.json({
              success: true,
              source: 'gemini-ai',
              question: qTrim,
              answer: aiText,
              suggestionChips: ['📍 Active Station', '⚡ 720kW Speed', '💰 Tariff Rates', '🚨 Emergency Help']
            });
          }
        } else {
          const errBody = await geminiRes.json().catch(() => ({}));
          console.warn('Gemini API Returned Error:', geminiRes.status, errBody);
        }
      } catch (geminiErr) {
        console.warn('Gemini API call exception, using smart knowledge engine:', geminiErr.message);
      }
    }

    // 2. High-Performance Smart Knowledge Engine (Tailored to NH-44 Pullur Tollgate)
    let answer = '';
    let intent = 'general';
    let suggestionChips = [];

    // Chip & Query Matching Logic
    if (qLower.includes('active') || qLower.includes('station') || qLower.includes('location') || qLower.includes('where') || qLower.includes('pullur') || qLower.includes('hub') || qLower.includes('gadwal') || qLower.includes('map')) {
      intent = 'stations';
      answer = `📍 **WattSquare Live Station Details**:\n\n` +
               `• **Station:** **${mainStation.name}**\n` +
               `• **Location:** ${mainStation.address}\n` +
               `• **Status:** 🟢 **100% OPERATIONAL & LIVE**\n` +
               `• **Active Guns:** 6 Chargers (150 kW DC CCS2, 60 kW DC Bharat, 22 kW & 7 kW AC Type 2)\n` +
               `• **Amenities:** ☕ 24/7 Food Court, 🛋️ Rest Lounge, 📶 High-Speed WiFi, 🚻 Washrooms\n\n` +
               `[🗺️ Get Live Directions] [📍 View Station Map]`;
      suggestionChips = ['⚡ 720kW Speed', '💰 Tariff Rates', '🚗 Compatibility', '🚨 Emergency Help'];

    } else if (qLower.includes('speed') || qLower.includes('720') || qLower.includes('fast') || qLower.includes('minut') || qLower.includes('power') || qLower.includes('kw') || qLower.includes('time')) {
      intent = 'speed';
      answer = `⚡ **720 kW Ultra-Fast Technology at NH-44 Pullur**:\n\n` +
               `• **150 kW DC Ultra-Fast:** Adds ~250 km range in just **18 minutes** (10% to 80% charge).\n` +
               `• **60 kW DC Fast:** 10% to 80% charge in ~35 minutes.\n` +
               `• **22 kW / 7 kW AC:** Universal overnight / long-stay charging.\n` +
               `• **Dynamic Power Pooling:** Intelligently delivers peak safe current without battery overheating!`;
      suggestionChips = ['💰 Tariff Rates', '📍 Active Station', '🚗 Compatibility', '🚨 Emergency Help'];

    } else if (qLower.includes('tariff') || qLower.includes('price') || qLower.includes('cost') || qLower.includes('rate') || qLower.includes('kwh') || qLower.includes('pay') || qLower.includes('upi') || qLower.includes('calc')) {
      intent = 'pricing';
      answer = `💰 **Transparent WattSquare Tariffs at NH-44 Pullur**:\n\n` +
               `• **150 kW DC Ultra-Fast:** ₹22 / kWh (10% to 80% in ~18 minutes)\n` +
               `• **60 kW DC Fast:** ₹18 / kWh\n` +
               `• **Type 2 AC Charging:** ₹16 / kWh\n\n` +
               `💳 **Zero App Lock-in:** Pay directly via UPI (GPay, PhonePe, Paytm), Debit/Credit Card, or RFID!\n` +
               `🧮 **Trip Savings:** Charging a 40 kWh EV (Nexon MAX) costs ~₹620 vs ₹2,400 petrol!\n\n` +
               `[🧮 Open Calculator]`;
      suggestionChips = ['📍 Active Station', '⚡ 720kW Speed', '🚗 Compatibility', '🚨 Emergency Help'];

    } else if (qLower.includes('emergency') || qLower.includes('stuck') || qLower.includes('lock') || qLower.includes('help') || qLower.includes('trouble') || qLower.includes('release') || qLower.includes('error')) {
      intent = 'emergency';
      answer = `🚨 **Emergency & Troubleshooting Guide at NH-44 Pullur**:\n\n` +
               `• **Gun Locked in Vehicle?** Press central key fob unlock button twice, or pull the manual mechanical release wire inside your car trunk/boot.\n` +
               `• **Session Start Failure?** Re-plug connector firmly until an audible click is heard, then tap UPI / RFID.\n` +
               `• **24/7 Hotline Support:** Call **+91 90327 23450** for immediate remote engineer assistance!\n\n` +
               `[📞 Call Helpline]`;
      suggestionChips = ['📍 Active Station', '⚡ 720kW Speed', '💰 Tariff Rates', '🚗 Compatibility'];

    } else if (qLower.includes('compatib') || qLower.includes('nexon') || qLower.includes('zs') || qLower.includes('ioniq') || qLower.includes('atto') || qLower.includes('tiago') || qLower.includes('comet') || qLower.includes('byd') || qLower.includes('car') || qLower.includes('plug') || qLower.includes('ccs2')) {
      intent = 'compatibility';
      answer = `🚗 **EV Vehicle Compatibility Guide**:\n\n` +
               `• **CCS2 DC (150 kW / 60 kW):** 100% compatible with Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, Kia EV6, BYD Atto 3, Mahindra XUV400.\n` +
               `• **Type 2 AC (7 kW - 22 kW):** Universal support for all 4-wheelers including MG Comet EV & Tiago EV.\n` +
               `• **Bharat DC-001 (15 kW):** Supports commercial & fleet EV vans.`;
      suggestionChips = ['📍 Active Station', '⚡ 720kW Speed', '💰 Tariff Rates', '🚨 Emergency Help'];

    } else if (qLower.includes('partner') || qLower.includes('franchise') || qLower.includes('land') || qLower.includes('invest') || qLower.includes('business')) {
      intent = 'partner';
      answer = `🤝 **Partner With WattSquare ChargeHub**:\n\n` +
               `• **Model 01 - Franchise:** Own land & hardware, earn 85% revenue share.\n` +
               `• **Model 02 - Landowner Profit Share:** Provide prime highway land, WattSquare invests 100% capital.\n\n` +
               `[🤝 Partner Form]`;
      suggestionChips = ['📍 Active Station', '💰 Tariff Rates', '⚡ 720kW Speed'];

    } else if (qLower.includes('hi') || qLower.includes('hello') || qLower.includes('hey') || qLower.includes('who are you')) {
      intent = 'greeting';
      answer = `👋 **Hello! Welcome to WattSquare AI Companion!**\n\n` +
               `I am your 24/7 intelligent assistant for India's 720 kW ultra-fast EV highway charging station at **NH-44 Pullur Tollgate**.\n\n` +
               `Tap any quick topic below to explore live station status, speed, tariffs, or emergency help!`;
      suggestionChips = ['📍 Active Station', '⚡ 720kW Speed', '💰 Tariff Rates', '🚨 Emergency Help'];

    } else {
      intent = 'fallback';
      answer = `⚡ **WattSquare ChargeHub — NH-44 Pullur Tollgate**\n\n` +
               `Operating 720 kW ultra-fast 150 kW DC EV charging on the NH-44 Hyderabad-Bangalore Highway!\n\n` +
               `Tap a quick topic below or ask about location, tariffs, speed, or emergency help!`;
      suggestionChips = ['📍 Active Station', '⚡ 720kW Speed', '💰 Tariff Rates', '🚨 Emergency Help'];
    }

    res.json({
      success: true,
      source: apiKeyToUse ? 'gemini-knowledge-engine' : 'smart-knowledge-engine',
      question: qTrim,
      answer,
      intent,
      suggestionChips
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(` ⚡ WattSquare EV Backend REST API Server Live on Port ${PORT}`);
  console.log(` http://localhost:${PORT}/api/health`);
  console.log(`==========================================================`);
});
