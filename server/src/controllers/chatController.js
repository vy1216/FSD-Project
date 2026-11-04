// AI Chatbot Controller for WILDTRAIL Platform
// Provides intelligent responses about expeditions, gear, stays, capacity limits, and policies
// Supports optional Gemini / OpenAI LLM integration when env keys are provided,
// with an integrated student-friendly contextual AI knowledge engine as default.

const KNOWLEDGE_BASE = {
  adventures: [
    { name: 'Hampta Pass Trek & Chandratal Lake', destination: 'Manali, Himachal Pradesh', sport: 'Trekking', difficulty: 'Moderate', duration: '5 Days / 4 Nights', price: '₹9,500', limit: 12 },
    { name: 'Ganga White Water River Rafting', destination: 'Rishikesh, Uttarakhand', sport: 'River Rafting', difficulty: 'Moderate', duration: '1 Day', price: '₹2,400', limit: 8 },
    { name: 'Chadar Frozen River Winter Expedition', destination: 'Leh-Ladakh', sport: 'Trekking', difficulty: 'Extreme', duration: '7 Days / 6 Nights', price: '₹28,500', limit: 10 },
    { name: 'Spiti Valley Mountain Safari', destination: 'Kaza, Spiti Valley', sport: 'Safari', difficulty: 'Moderate', duration: '6 Days / 5 Nights', price: '₹18,000', limit: 6 },
    { name: 'Scuba Diving at Grande Island', destination: 'Goa', sport: 'Scuba Diving', difficulty: 'Easy', duration: '1 Day', price: '₹3,500', limit: 6 },
    { name: 'Anamudi Peak Wilderness & Tea Trek', destination: 'Munnar, Kerala', sport: 'Trekking', difficulty: 'Easy', duration: '2 Days / 1 Night', price: '₹4,200', limit: 15 }
  ],
  stays: [
    { name: 'Solang Valley Alpine Campsite', destination: 'Manali', type: 'Camp', price: '₹1,800/night', amenities: 'Bonfire, Buffet Meals, Alpine Tents' },
    { name: 'Ganga White Water Riverside Eco-Camp', destination: 'Rishikesh', type: 'Camp', price: '₹2,200/night', amenities: 'Beach access, Volleyball, Open dining' },
    { name: 'The Ladakh Himalayan Homestay', destination: 'Leh-Ladakh', type: 'Homestay', price: '₹2,500/night', amenities: 'Traditional Bukkhari heater, Organic meals' },
    { name: 'Spiti Mudhut Eco-Resort', destination: 'Spiti Valley', type: 'Resort', price: '₹3,200/night', amenities: 'Solar heating, Mountain view, Local cafe' },
    { name: 'Palolem Beach Coconut Palm Cottages', destination: 'Goa', type: 'Resort', price: '₹2,800/night', amenities: 'Beachfront balcony, AC, Seafood' },
    { name: 'Munnar Mist Cloud Resort', destination: 'Munnar', type: 'Resort', price: '₹3,500/night', amenities: 'Tea garden trail, Infinity pool, Spa' }
  ],
  gear: [
    { name: 'Wildtrail Everest 65L Expedition Rucksack', category: 'Trekking', price: '₹4,999' },
    { name: 'Sub-Zero -10°C Mummy Sleeping Bag', category: 'Camping', price: '₹3,499' },
    { name: 'Ultralight Carbon Fiber Trekking Poles (Pair)', category: 'Trekking', price: '₹1,899' },
    { name: 'Waterproof 4-Person Alpine Dome Tent', category: 'Camping', price: '₹5,999' },
    { name: 'Rechargeable 800 Lumens Outdoor Headlamp', category: 'Camping', price: '₹1,299' },
    { name: 'Gore-Tex All-Terrain Hiking Boots', category: 'Trekking', price: '₹6,499' },
    { name: 'Heavy-Duty Climbing Carabiners (Set of 4)', category: 'Climbing', price: '₹1,199' }
  ]
};

const generateAIResponse = (query) => {
  const q = (query || '').toLowerCase().trim();

  // 1. Greetings & Identity
  if (/^(hi|hello|hey|namaste|greetings|hola|who are you|what is this|help)/.test(q)) {
    return (
      "Hello explorer! 🏔️ I am **TrailBot**, your WILDTRAIL AI adventure guide. " +
      "I can help you discover thrilling treks, check person limits, find alpine stays, recommend technical gear, or explain booking policies. How can I help your next adventure today?"
    );
  }

  // 2. Beginner / Easy Treks
  if (q.includes('beginner') || q.includes('starter') || q.includes('first trek') || q.includes('easy')) {
    return (
      "For beginners and first-time adventurers, we highly recommend:\n\n" +
      "1. **Anamudi Peak Wilderness & Tea Trek (Munnar, Kerala)**\n" +
      "   • Difficulty: Easy | Duration: 2 Days / 1 Night | Price: ₹4,200\n" +
      "   • Highlights: Rolling tea gardens, Shola forests, Nilgiri Tahr sightings.\n\n" +
      "2. **Scuba Diving at Grande Island (Goa)**\n" +
      "   • Difficulty: Easy | Duration: 1 Day | Price: ₹3,500\n" +
      "   • Highlights: Includes PADI certified training, reef diving, and underwater video.\n\n" +
      "Both require minimal prior conditioning and include certified instructors!"
    );
  }

  // 3. Extreme / Challenging Expeditions
  if (q.includes('extreme') || q.includes('difficult') || q.includes('hard') || q.includes('tough') || q.includes('advanced')) {
    return (
      "Looking for serious Himalayan adrenaline? ❄️\n\n" +
      "• **Chadar Frozen River Winter Expedition (Leh-Ladakh)**\n" +
      "  • Difficulty: Extreme | Duration: 7 Days / 6 Nights | Price: ₹28,500\n" +
      "  • Temperature: -20°C to -30°C\n" +
      "  • Trekking on the frozen Zanskar river gorge with ice caves and ancient monasteries.\n" +
      "  • Group Capacity: Max 10 persons.\n\n" +
      "Make sure you pack our Sub-Zero -10°C Sleeping Bag and Gore-Tex All-Terrain Boots from our Gear Shop!"
    );
  }

  // 4. Specific Sports (Rafting, Trekking, Safari, Scuba)
  if (q.includes('rafting') || q.includes('rishikesh')) {
    return (
      "🌊 **Ganga White Water River Rafting (Rishikesh, Uttarakhand)**\n" +
      "• Price: ₹2,400 per person\n" +
      "• Duration: 1 Day (26 km expedition stretch)\n" +
      "• Rapids: Grade III & IV (The Wall, Roller Coaster, Golf Course)\n" +
      "• Maximum Group Limit: 8 persons per raft with certified IRF guides and safety kayaks.\n" +
      "• Best Stay Nearby: Ganga White Water Riverside Eco-Camp (₹2,200/night)."
    );
  }

  if (q.includes('scuba') || q.includes('diving') || q.includes('goa')) {
    return (
      "🤿 **Scuba Diving at Grande Island (Goa)**\n" +
      "• Price: ₹3,500 per person\n" +
      "• Inclusions: PADI brief, boat cruise, dolphin sighting, full dive equipment, underwater photos & video.\n" +
      "• Capacity: Max 6 persons per dive instructor for personalized safety.\n" +
      "• Stay: Palolem Beach Coconut Palm Cottages (₹2,800/night)."
    );
  }

  if (q.includes('safari') || q.includes('spiti')) {
    return (
      "🚙 **Spiti Valley High Altitude Mountain Safari**\n" +
      "• Destination: Kaza, Spiti Valley (Himachal Pradesh)\n" +
      "• Duration: 6 Days / 5 Nights | Price: ₹18,000\n" +
      "• Highlights: World's highest post office (Hikkim), 1000-year Key Monastery, Chicham suspension bridge.\n" +
      "• Group Limit: 6 explorers per 4x4 expedition vehicle.\n" +
      "• Recommended Stay: Spiti Mudhut Eco-Resort (₹3,200/night)."
    );
  }

  if (q.includes('hampta') || q.includes('manali')) {
    return (
      "🏔️ **Hampta Pass Trek & Chandratal Lake (Manali)**\n" +
      "• Price: ₹9,500 per person | Duration: 5 Days / 4 Nights\n" +
      "• Altitude: 14,100 ft connecting Kullu valley to Lahaul desert.\n" +
      "• Group Limit: Max 12 persons per batch.\n" +
      "• Recommended Campsite: Solang Valley Alpine Campsite (₹1,800/night)."
    );
  }

  // 5. Gear & Equipment Questions
  if (q.includes('gear') || q.includes('equipment') || q.includes('pack') || q.includes('tent') || q.includes('boot') || q.includes('bag')) {
    return (
      "🎒 **Essential Expedition Gear in our Shop:**\n\n" +
      "1. **Everest 65L Rucksack** (₹4,999) — Heavy-duty nylon with internal aluminum frame.\n" +
      "2. **Sub-Zero -10°C Sleeping Bag** (₹3,499) — High-altitude thermal insulation.\n" +
      "3. **Carbon Fiber Trekking Poles** (₹1,899/pair) — Shock-absorbing dual locks.\n" +
      "4. **4-Person Alpine Dome Tent** (₹5,999) — 3000mm PU waterproof double-layer.\n" +
      "5. **Rechargeable 800lm Headlamp** (₹1,299) — IPX6 water-resistant with Type-C.\n" +
      "6. **Gore-Tex Hiking Boots** (₹6,499) — Deep Vibram lugs for snow and rocks.\n\n" +
      "You can add any item to your cart and checkout with COD or Card directly!"
    );
  }

  // 6. Stays & Accommodation Questions
  if (q.includes('stay') || q.includes('camp') || q.includes('hotel') || q.includes('resort') || q.includes('homestay') || q.includes('room')) {
    return (
      "⛺ **Scenic Trail Accommodations Available:**\n\n" +
      "• **Solang Valley Alpine Campsite (Manali)** — ₹1,800/night (Tents, Bonfire, Meals)\n" +
      "• **Ganga Riverside Eco-Camp (Rishikesh)** — ₹2,200/night (Beach access, Sports)\n" +
      "• **The Ladakh Himalayan Homestay (Leh)** — ₹2,500/night (Bukkhari heating, Ladakhi food)\n" +
      "• **Spiti Mudhut Eco-Resort (Kaza)** — ₹3,200/night (River view, Solar heating)\n" +
      "• **Palolem Coconut Cottages (Goa)** — ₹2,800/night (Beachfront, AC, Dining)\n" +
      "• **Munnar Mist Cloud Resort (Kerala)** — ₹3,500/night (Tea trails, Infinity pool)\n\n" +
      "Book directly under the 'Stays' tab in the navbar!"
    );
  }

  // 7. Person Limit / Capacity Questions
  if (q.includes('person limit') || q.includes('limit') || q.includes('capacity') || q.includes('max guest') || q.includes('how many people')) {
    return (
      "👥 **Group Person Limits for Safety & Environmental Protection:**\n\n" +
      "Every expedition has a strict maximum group size enforced by our trail leads:\n" +
      "• River Rafting: Max 8 persons per raft\n" +
      "• Scuba Diving: Max 6 persons per dive instructor\n" +
      "• Mountain Safari: Max 6 persons per 4x4 vehicle\n" +
      "• Chadar Winter Expedition: Max 10 persons\n" +
      "• Hampta Pass Trek: Max 12 persons\n" +
      "• Munnar Wilderness Trek: Max 15 persons\n\n" +
      "Administrators can adjust these limits or temporarily open/close bookings whenever conditions require."
    );
  }

  // 8. Cancellation & Payment Policy
  if (q.includes('cancel') || q.includes('refund') || q.includes('policy')) {
    return (
      "📋 **Cancellation & Refund Policy:**\n\n" +
      "• **Free Cancellation**: You can cancel any adventure or stay up to **72 hours before the start date** for a 100% full refund.\n" +
      "• **Easy Dashboard Access**: You can cancel active reservations directly from your **User Panel (`/dashboard`)** with one click.\n" +
      "• **Emergency Weather Rescheduling**: In case of severe weather or route closures, trips are rescheduled at no additional cost."
    );
  }

  if (q.includes('payment') || q.includes('pay') || q.includes('cod') || q.includes('card') || q.includes('upi')) {
    return (
      "💳 **Payment Options Supported:**\n\n" +
      "• Cash on Delivery (COD) for technical gear orders\n" +
      "• UPI / Instant QR Payment for trips & stays\n" +
      "• Credit / Debit Card & Net Banking\n\n" +
      "All bookings generate an immediate confirmation reference ID viewable in your Dashboard."
    );
  }

  // 9. General / Default Helpful Answer
  return (
    "I understand you are asking about \"" + query + "\". 🧭\n\n" +
    "Here is what I can help you with:\n" +
    "• **Expeditions**: Ask for treks, river rafting, safaris, or scuba diving across India.\n" +
    "• **Stays**: Inquire about alpine campsites, eco-resorts, and Himalayan homestays.\n" +
    "• **Gear**: Inquire about backpacks, sub-zero sleeping bags, dome tents, and boots.\n" +
    "• **Booking**: Ask about group capacity limits, cancellation policy, or payment methods.\n\n" +
    "Feel free to click any of the suggestion chips above or ask me a specific question!"
  );
};

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ message: 'Message text is required' });
    }

    // Check if external Gemini API key is configured
    if (process.env.GEMINI_API_KEY) {
      try {
        const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`;
        const systemPrompt = "You are TrailBot, the official AI adventure guide for WILDTRAIL, an Indian adventure travel, alpine stays, and gear booking platform. Keep answers concise, inspiring, practical, and adventure-focused.";
        
        const response = await fetch(url, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              { role: 'user', parts: [{ text: `${systemPrompt}\nUser Question: ${message}` }] }
            ]
          })
        });

        const data = await response.json();
        const reply = data.candidates?.[0]?.content?.parts?.[0]?.text;
        if (reply) {
          return res.json({ reply, source: 'gemini' });
        }
      } catch (externalErr) {
        // Fall back seamlessly to built-in knowledge engine
      }
    }

    // Built-in intelligent knowledge engine
    const reply = generateAIResponse(message);
    res.json({ reply, source: 'knowledge-engine' });
  } catch (error) {
    res.status(500).json({
      reply: "Sorry, I encountered a temporary trail hiccup! Feel free to explore our Expeditions, Stays, and Gear Shop tabs directly.",
      error: error.message
    });
  }
};
