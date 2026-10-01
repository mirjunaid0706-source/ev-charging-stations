const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

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
        { id: "WS-001-B", type: "DC", power: 150, status: "charging", connector: "ccs2" },
        { id: "WS-001-C", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-001-D", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-001-E", type: "AC", power: 7, status: "available", connector: "type2" },
        { id: "WS-001-F", type: "AC", power: 10, status: "available", connector: "type2" }
      ]
    },
    {
      id: 2, name: "NH-44 Pullur Tollgate", state: "Telangana", lat: 16.2358, lng: 77.8096, status: "operational", address: "NH-44 Hyderabad-Bangalore, Gadwal District",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["Cafe", "Washroom", "Parking"],
      chargers: [
        { id: "WS-002-A", type: "DC", power: 150, status: "charging", connector: "ccs2" },
        { id: "WS-002-B", type: "DC", power: 150, status: "available", connector: "ccs2" },
        { id: "WS-002-C", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-002-D", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-002-E", type: "AC", power: 7, status: "full", connector: "type2" },
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
      id: 4, name: "Khammam District", state: "Telangana", lat: 17.2473, lng: 80.1514, status: "construction", address: "Maddulapalli Mandal, Khammam District (Green Field Highway)",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["Parking", "Security"],
      chargers: [
        { id: "WS-004-A", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-004-B", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-004-C", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-004-D", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-004-E", type: "AC", power: 7, status: "offline", connector: "type2" },
        { id: "WS-004-F", type: "AC", power: 10, status: "offline", connector: "type2" }
      ]
    },
    {
      id: 5, name: "Hitech City, Madhapur", state: "Telangana", lat: 17.4486, lng: 78.3908, status: "operational", address: "Hitech City, Madhapur (IT Corridor, Hyderabad)",
      connectors: ["ccs2", "bharat", "type2"],
      amenities: ["WiFi", "Cafe", "Shopping Mall", "Rest Area", "24/7 Security"],
      chargers: [
        { id: "WS-005-A", type: "DC", power: 180, status: "available", connector: "ccs2" },
        { id: "WS-005-B", type: "DC", power: 180, status: "charging", connector: "ccs2" },
        { id: "WS-005-C", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-005-D", type: "DC", power: 60, status: "available", connector: "bharat" },
        { id: "WS-005-E", type: "AC", power: 22, status: "available", connector: "type2" },
        { id: "WS-005-F", type: "AC", power: 11, status: "available", connector: "type2" }
      ]
    },
    {
      id: 6, name: "Rishikonda Beach Road, Vizag", state: "Andhra Pradesh", lat: 17.6868, lng: 83.2185, status: "planning", address: "Rishikonda Beach Road, Visakhapatnam",
      connectors: ["ccs2", "type2"],
      amenities: ["Beach View", "Cafe", "Parking"],
      chargers: [
        { id: "WS-006-A", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-006-B", type: "DC", power: 150, status: "offline", connector: "ccs2" },
        { id: "WS-006-C", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-006-D", type: "DC", power: 60, status: "offline", connector: "bharat" },
        { id: "WS-006-E", type: "AC", power: 7, status: "offline", connector: "type2" },
        { id: "WS-006-F", type: "AC", power: 10, status: "offline", connector: "type2" }
      ]
    }
  ],
  registeredUsers: [],
  chargingHistory: [],
  bookings: []
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
      bookings: parsed.bookings || defaultData.bookings
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
    version: '2.0.0-max',
    timestamp: new Date().toISOString()
  });
});

// 2. Get All Stations
app.get('/api/stations', (req, res) => {
  const db = loadDb();
  res.json({ success: true, count: db.stations.length, stations: db.stations });
});

// 3. Update Station Status (Admin)
app.put('/api/stations/:id/status', (req, res) => {
  const db = loadDb();
  const stationId = parseInt(req.params.id, 10);
  const { status } = req.body;
  if (!status) return res.status(400).json({ success: false, error: 'Status required' });
  
  const station = db.stations.find(s => s.id === stationId);
  if (!station) {
    return res.status(404).json({ success: false, error: 'Station not found' });
  }

  station.status = status;
  if (status === 'maintenance' || status === 'offline' || status === 'inactive') {
    station.chargers.forEach(c => c.status = 'offline');
  } else if (status === 'operational') {
    station.chargers.forEach(c => {
      if (c.status === 'offline') c.status = 'available';
    });
  }

  saveDb(db);
  res.json({ success: true, message: `Station ${station.name} status updated to ${status}`, station });
});

// 4. Update Charger Gun Status (Admin)
app.put('/api/stations/:id/chargers/:chargerId', (req, res) => {
  const db = loadDb();
  const stationId = parseInt(req.params.id, 10);
  const chargerId = req.params.chargerId;

  const station = db.stations.find(s => s.id === stationId);
  if (!station) return res.status(404).json({ success: false, error: 'Station not found' });

  const charger = station.chargers.find(c => c.id === chargerId);
  if (!charger) return res.status(404).json({ success: false, error: 'Charger gun not found' });

  charger.status = charger.status === 'available' ? 'offline' : 'available';
  saveDb(db);
  res.json({ success: true, message: `Charger gun ${chargerId} updated to ${charger.status}`, charger });
});

// 5. Get Registered Users
app.get('/api/users', (req, res) => {
  const db = loadDb();
  res.json({ success: true, count: db.registeredUsers.length, users: db.registeredUsers });
});

// 6. Register New User
app.post('/api/users/register', (req, res) => {
  const db = loadDb();
  const { name, email, vehicle, accountType } = req.body || {};
  if (!name || !email || !vehicle) {
    return res.status(400).json({ success: false, error: 'Name, email, and vehicle are required' });
  }

  const existing = db.registeredUsers.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.json({ success: true, message: 'User already registered', user: existing });
  }

  const newUser = {
    id: Date.now(),
    name: name.trim(),
    email: email.trim().toLowerCase(),
    vehicle: vehicle.trim(),
    accountType: accountType || 'Standard EV',
    sessions: 0,
    totalSpent: 0,
    date: new Date().toISOString().split('T')[0]
  };

  db.registeredUsers.unshift(newUser);
  saveDb(db);
  res.status(201).json({ success: true, message: 'User registered successfully', user: newUser });
});

// 7. Get Charging History & Transactions
app.get('/api/history', (req, res) => {
  const db = loadDb();
  res.json({ success: true, count: db.chargingHistory.length, history: db.chargingHistory });
});

// 8. Record New Payment / Session
app.post('/api/history', (req, res) => {
  const db = loadDb();
  const { station, energy, duration, amount } = req.body || {};

  const newSession = {
    id: Date.now(),
    date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    station: station || 'WattSquare Station',
    energy: energy || '25.0 kWh',
    duration: duration || '20 mins',
    amount: amount || 'Rs.450',
    status: 'Completed',
    timestamp: Date.now()
  };

  db.chargingHistory.unshift(newSession);

  if (db.registeredUsers.length > 0) {
    const costNum = parseFloat(String(amount).replace(/[^0-9.]/g, '')) || 450;
    db.registeredUsers[0].sessions = (db.registeredUsers[0].sessions || 0) + 1;
    db.registeredUsers[0].totalSpent = (db.registeredUsers[0].totalSpent || 0) + costNum;
  }

  saveDb(db);
  res.status(201).json({ success: true, message: 'Payment recorded', session: newSession });
});

// 9. Book Slot
app.post('/api/bookings', (req, res) => {
  const db = loadDb();
  const { stationId, stationName, date, timeSlot } = req.body || {};

  const booking = {
    id: Date.now(),
    stationId: stationId || 1,
    stationName: stationName || 'WattSquare Station',
    date: date || new Date().toISOString().split('T')[0],
    timeSlot: timeSlot || '12:00',
    createdAt: new Date().toISOString()
  };

  db.bookings.unshift(booking);
  saveDb(db);
  res.status(201).json({ success: true, message: 'Slot booked successfully', booking });
});

// 10. Maximum Understanding AI Chatbot Endpoint
app.post('/api/ai/chat', (req, res) => {
  try {
    const db = loadDb();
    const { question } = req.body || {};
    if (!question || typeof question !== 'string' || !question.trim()) {
      return res.status(400).json({ success: false, error: 'Question string is required' });
    }

    const q = question.trim();
    const qLower = q.toLowerCase();

    // Data snapshots
    const stations = db.stations || [];
    const ops = stations.filter(s => s.status === 'operational');
    const totalGuns = stations.reduce((acc, s) => acc + (s.chargers ? s.chargers.length : 0), 0);
    const availableGuns = stations.reduce((acc, s) => {
      if (!s.chargers) return acc;
      return acc + s.chargers.filter(c => c.status === 'available').length;
    }, 0);

    let answer = '';
    let intent = 'general';
    let suggestionChips = [];

    // Entity extractions
    const matchedStation = stations.find(s => 
      qLower.includes(s.name.toLowerCase()) || 
      (s.address && qLower.includes(s.address.toLowerCase())) ||
      (s.state && qLower.includes(s.state.toLowerCase()))
    );

    // 1. Emergency & Troubleshooting Queries
    if (qLower.includes('problem') || qLower.includes('stuck') || qLower.includes('error') || qLower.includes('gun locked') || qLower.includes('not starting') || qLower.includes('fail') || qLower.includes('emergency') || qLower.includes('issue')) {
      intent = 'emergency';
      answer = `🚨 **Troubleshooting & Emergency Assistance**:\n` +
               `• **Gun Locked in Car?** Stop charging session via App/Dashboard, press your vehicle's central unlock button twice, or pull manual cable release inside trunk.\n` +
               `• **Session Not Starting?** Ensure connector is pushed firmly into port until click sound is heard.\n` +
               `• **24/7 Helpline:** Call **+91 90327 23450** for immediate remote unlock & tech dispatch!`;
      suggestionChips = ['📞 Call Support', '📍 Operational Hubs', '💬 Helpdesk'];

    // 2. Route Planner & Highway Trips
    } else if (qLower.includes('route') || qLower.includes('trip') || qLower.includes('planner') || qLower.includes('highway') || qLower.includes('nh16') || qLower.includes('nh44') || qLower.includes('hyderabad') || qLower.includes('bangalore') || qLower.includes('distance') || qLower.includes('travel') || qLower.includes('plan trip') || qLower.includes('plan a trip')) {
      intent = 'route';
      answer = `🗺️ **WattSquare Route Planner**:\n` +
               `Planning a trip across AP & Telangana? Our Route Planner automatically calculates charging stops along NH-16 (Vijayawada-Vizag) & NH-44 (Hyderabad-Bangalore).\n` +
               `Click **Plan Route** on any station to optimize battery stops and rest area amenities!`;
      suggestionChips = ['🗺️ Open Route Planner', '📍 View Stations', '⚡ Charging Speed'];

    // 3. EV Vehicle & Connector Compatibility
    } else if (qLower.includes('nexon') || qLower.includes('zs') || qLower.includes('ioniq') || qLower.includes('tiago') || qLower.includes('comet') || qLower.includes('atto') || qLower.includes('byd') || qLower.includes('xuv') || qLower.includes('ccs2') || qLower.includes('type2') || qLower.includes('bharat') || qLower.includes('plug') || qLower.includes('connector') || qLower.includes('compatible')) {
      intent = 'compatibility';
      answer = `🚗 **EV & Connector Compatibility Guide**:\n` +
               `• **CCS2 (150kW / 60kW DC):** Fully compatible with Tata Nexon EV, MG ZS EV, Hyundai Ioniq 5, Kia EV6, BYD Atto 3, Mahindra XUV400.\n` +
               `• **Bharat DC (60kW):** Supported by fleet EVs & early Indian DC models.\n` +
               `• **Type 2 AC (7kW - 22kW):** Universal support for all Indian & international 4-wheeler EVs (including MG Comet & Tiago EV).\n` +
               `Our smart guns dynamically auto-negotiate voltage for 100% safe charging!`;
      suggestionChips = ['📍 Active Hubs', '📅 Book Slot', '📞 Live Help'];

    // 4. Station queries / Location / Availability
    } else if (qLower.includes('station') || qLower.includes('location') || qLower.includes('where') || qLower.includes('near') || qLower.includes('map') || matchedStation) {
      intent = 'stations';
      if (matchedStation) {
        const availGuns = matchedStation.chargers ? matchedStation.chargers.filter(c => c.status === 'available').length : 0;
        answer = `📍 **${matchedStation.name}** (${matchedStation.state})\n` +
                 `• **Status:** ${matchedStation.status.toUpperCase()}\n` +
                 `• **Address:** ${matchedStation.address}\n` +
                 `• **Live Available Guns:** ${availGuns} / ${matchedStation.chargers ? matchedStation.chargers.length : 0}\n` +
                 `• **Connectors:** ${matchedStation.connectors ? matchedStation.connectors.join(', ').toUpperCase() : 'CCS2, Type 2'}\n` +
                 `• **Amenities:** ${matchedStation.amenities ? matchedStation.amenities.join(', ') : 'WiFi, Rest Area'}`;
      } else {
        answer = `⚡ **WattSquare Live Station Network**:\n` +
                 `We currently have **${ops.length} operational ultra-fast charging hubs** with **${availableGuns} active guns available** right now:\n` +
                 ops.map(s => `• **${s.name}** (${s.state}) - ${s.chargers ? s.chargers.filter(c => c.status==='available').length : 0} guns ready`).join('\n') +
                 `\n\nFilter live stations on our interactive map!`;
      }
      suggestionChips = ['📍 View Live Stations', '💰 Check Tariffs', '📅 Book Slot'];

    // 5. Pricing / Tariffs / Subscriptions / Cost
    } else if (qLower.includes('price') || qLower.includes('cost') || qLower.includes('rate') || qLower.includes('tariff') || qLower.includes('fee') || qLower.includes('cheap') || qLower.includes('subscription') || qLower.includes('membership')) {
      intent = 'pricing';
      answer = `💰 **WattSquare Transparent Tariff Rates**:\n` +
               `• **150kW DC Ultra-Fast (CCS2):** ₹22 / kWh (10-80% in ~20 mins)\n` +
               `• **60kW DC Fast (Bharat DC):** ₹18 / kWh (10-80% in ~45 mins)\n` +
               `• **AC Type 2 Charging:** ₹16 / kWh (Ideal for overnight / long stays)\n\n` +
               `💎 **Save up to 35% with Membership Subscriptions**:\n` +
               `• **Gold Plan (₹999/mo):** 20% discount on all DC sessions\n` +
               `• **Platinum Plan (₹1999/mo):** 35% discount + Priority slot booking!`;
      suggestionChips = ['🧮 Cost Calculator', '💳 Subscriptions', '📅 Book Slot'];

    // 6. Charging Speed / Duration / Power
    } else if (qLower.includes('speed') || qLower.includes('time') || qLower.includes('duration') || qLower.includes('fast') || qLower.includes('minutes') || qLower.includes('kw') || qLower.includes('how long')) {
      intent = 'speed';
      answer = `⚡ **Charging Speed Breakdown**:\n` +
               `• **150kW Ultra-Fast DC:** Charges 10% to 80% battery in **20 to 25 minutes** for compatible EVs (Ioniq 5, EV6, ZS EV, Nexon EV Max).\n` +
               `• **60kW Fast DC:** Charges 10% to 80% battery in **40 to 50 minutes**.\n` +
               `• **AC Type 2 (7kW - 22kW):** Adds ~35 km range per hour.`;
      suggestionChips = ['🚗 Car Compatibility', '📍 Find 150kW Guns', '💰 Rates'];

    // 7. Slot Booking / Reservations
    } else if (qLower.includes('book') || qLower.includes('slot') || qLower.includes('reserve') || qLower.includes('schedule') || qLower.includes('advance')) {
      intent = 'booking';
      answer = `📅 **How to Book a Charging Slot**:\n` +
               `1. Click **Stations** in top navigation or pick any station on the Map.\n` +
               `2. Click **Reserve Slot / Book Now**.\n` +
               `3. Select your date & 30-minute time window.\n` +
               `4. Confirm your booking! Advance slots can be reserved up to **7 days ahead** with a 15-minute arrival grace period.`;
      suggestionChips = ['📅 Open Booking Modal', '📍 Station Map', '💬 Support'];

    // 8. Payments / Wallet / UPI / Refunds
    } else if (qLower.includes('pay') || qLower.includes('upi') || qLower.includes('card') || qLower.includes('wallet') || qLower.includes('gpay') || qLower.includes('phonepe') || qLower.includes('paytm') || qLower.includes('qr') || qLower.includes('refund') || qLower.includes('receipt')) {
      intent = 'payments';
      answer = `💳 **Payment Methods & Wallet**:\n` +
               `• **Supported Payment Modes:** UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Cards, Net Banking, and WattSquare Instant Wallet.\n` +
               `• **On-site Charging:** Scan QR code directly on any charging gun to pay & start instantaneously.\n` +
               `• **Refunds:** Unused pre-auth holds are refunded automatically to original source within 24 hours.`;
      suggestionChips = ['💰 Check Rates', '📅 Reserve Slot', '📞 Helpdesk'];

    // 9. Support & Contact
    } else if (qLower.includes('contact') || qLower.includes('support') || qLower.includes('email') || qLower.includes('phone') || qLower.includes('helpdesk') || qLower.includes('call')) {
      intent = 'support';
      answer = `📞 **WattSquare 24/7 Customer Support**:\n` +
               `• **Toll-Free Helpline:** +91 90327 23450\n` +
               `• **Official Email:** wattsquarechargehub@gmail.com\n` +
               `• **Instagram:** [@wattsquare.chargehub](https://www.instagram.com/wattsquare.chargehub/)\n` +
               `• **Headquarters:** Geethanjali College of Engineering & Technology, Telangana, India.`;
      suggestionChips = ['🚨 Emergency Help', '📍 Stations', '💰 Tariffs'];

    // 10. Greetings & Capabilities
    } else if (qLower.includes('hi') || qLower.includes('hello') || qLower.includes('hey') || qLower.includes('who are you') || qLower.includes('what can you do') || qLower.includes('help')) {
      intent = 'greeting';
      answer = `👋 **Hello! Welcome to WattSquare AI Assistant!**\n` +
               `I am your intelligent EV charging companion. I can help you with:\n` +
               `• 📍 Locating operational 150kW ultra-fast stations & live gun availability\n` +
               `• 💰 Checking tariff rates, cost calculations & subscription savings\n` +
               `• 🚗 EV connector compatibility (CCS2, Type 2, Bharat DC)\n` +
               `• 📅 Booking charging slots up to 7 days ahead\n` +
               `• 🗺️ Route planning across AP & Telangana highways\n` +
               `• 🚨 24/7 troubleshooting & emergency gun release assistance\n\n` +
               `What would you like to explore today?`;
      suggestionChips = ['📍 Live Stations', '💰 Tariff Rates', '📅 Book Slot', '🗺️ Plan Route'];

    // 11. Fallback for any query
    } else {
      intent = 'fallback';
      answer = `Thank you for asking: "${q}".\n` +
               `WattSquare ChargeHub operates 480kW ultra-fast EV hubs across Andhra Pradesh & Telangana highways.\n\n` +
               `You can check live station status, book slots, or calculate trip costs directly using the quick links below. How else can I assist your trip today?`;
      suggestionChips = ['📍 Live Stations', '💰 Tariff Rates', '📅 Reserve Slot', '📞 Contact Support'];
    }

    res.json({
      success: true,
      question: q,
      answer,
      intent,
      suggestionChips,
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      error: 'AI Chat processing error',
      message: err.message
    });
  }
});

// 11. Admin Metrics Endpoint
app.get('/api/admin/metrics', (req, res) => {
  const db = loadDb();
  const activeStations = db.stations.filter(s => s.status === 'operational').length;
  const totalStations = db.stations.length;

  const activeGuns = db.stations.filter(s => s.status === 'operational').reduce((acc, s) => {
    return acc + (s.chargers ? s.chargers.filter(c => c.status === 'available' || c.status === 'charging').length : 0);
  }, 0);
  const totalGuns = db.stations.reduce((acc, s) => acc + (s.chargers ? s.chargers.length : 0), 0);

  let totalRevenue = 0;
  db.chargingHistory.forEach(h => {
    const amt = parseFloat(String(h.amount).replace(/[^0-9.]/g, '')) || 0;
    totalRevenue += amt;
  });

  res.json({
    success: true,
    metrics: {
      activeStations,
      totalStations,
      activeGuns,
      totalGuns,
      totalRevenue: Math.round(totalRevenue),
      totalUsers: db.registeredUsers.length,
      totalSessions: db.chargingHistory.length
    }
  });
});

// Global express error handler middleware
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).json({
    success: false,
    error: 'Internal Server Error',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`==========================================================`);
  console.log(` ⚡ WattSquare EV Backend REST API Server Live on Port ${PORT}`);
  console.log(` http://localhost:${PORT}/api/health`);
  console.log(`==========================================================`);
});

