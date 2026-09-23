// Edit this file to change what the AI Trip Assistant (src/routes/AIChatbot.tsx)
// says. It's a plain if/else chain matched against keywords in the visitor's
// message — no real model involved. Add more `else if` blocks for new topics,
// or edit the existing replies. Order matters: the first matching branch wins,
// so put more specific keywords (e.g. "crocodile") above general ones.
//
// This is called from src/lib/ai.ts's sendChatMessage — swap that function's
// body for a real model call later and nothing else in the app needs to change.

export function getFakeAiReply(userMessage: string): string {
  const msg = userMessage.toLowerCase()

  if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
    return "G'day! I'm your Northern Territory trip assistant. Ask me about places to go, when to visit, what to pack, or anything else about the Territory."
  } else if (msg.includes('kakadu')) {
    return 'Kakadu is best visited May to October (the dry season) when the roads and waterfalls are accessible. Don’t miss Ubirr and Nourlangie for Aboriginal rock art, and a Yellow Water cruise at sunrise.'
  } else if (msg.includes('uluru') || msg.includes('ayers rock')) {
    return "Uluru is stunning at sunrise and sunset when the rock changes colour. Walking around its base (about 10km) is free and gives you a much closer look than the lookouts."
  } else if (msg.includes('litchfield')) {
    return 'Litchfield National Park is a great day trip from Darwin — Wangi Falls and Florence Falls both have safe swimming holes most of the year.'
  } else if (msg.includes('crocodile') || msg.includes('croc')) {
    return 'Saltwater crocodiles live in NT waterways, so only swim in signed, croc-safe spots. A Jumping Crocodile Cruise on the Adelaide River is the safest way to see one up close.'
  } else if (msg.includes('weather') || msg.includes('when') || msg.includes('best time')) {
    return "The dry season (May–October) has warm, sunny days and is the easiest time to get around. The wet season (November–April) is hot and humid with spectacular storms, but some roads and waterfalls can close."
  } else if (msg.includes('pack') || msg.includes('wear') || msg.includes('bring')) {
    return 'Pack light, breathable clothing, a hat, sunscreen and insect repellent. A reusable water bottle and sturdy walking shoes are worth it for waterfall and gorge walks.'
  } else if (msg.includes('food') || msg.includes('eat') || msg.includes('restaurant')) {
    return "Don't miss the Mindil Beach Sunset Markets or Parap Village Market for local food — great spot to try Territory classics like barramundi and bush tucker-inspired dishes."
  } else if (msg.includes('budget') || msg.includes('cost') || msg.includes('cheap') || msg.includes('expensive')) {
    return 'A comfortable week in the Top End (Darwin + Kakadu + Litchfield) typically runs a few hundred dollars a day for two including a rental car — camping and self-catering can bring that down a lot.'
  } else if (msg.includes('family') || msg.includes('kids')) {
    return 'For families, Litchfield’s swimming holes, the Territory Wildlife Park, and a gentle Nitmiluk Gorge cruise are all easy wins with kids.'
  } else if (msg.includes('itinerary') || msg.includes('plan') || msg.includes('trip')) {
    return "I can help sketch an itinerary! Try the 'Let AI plan your trip' button on the Home screen — tell it your vibe and dates and it'll build a day-by-day plan."
  } else if (msg.includes('thank')) {
    return "You're welcome! Have an amazing trip around the Territory. ✨"
  } else {
    return "That's a great question — once I'm connected to a real model I'll be able to answer that properly using live Northern Territory data. For now, try asking me about Kakadu, Uluru, crocodiles, weather, packing, food or budget."
  }
}
