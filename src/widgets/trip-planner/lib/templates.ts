export interface TripTemplate {
  id: string
  title: string
  coverImage: string
  prompt: string
}

export const tripTemplates: TripTemplate[] = [
  {
    id: "tashkent-7-days",
    title: "5 Day Trip to Tashkent",
    coverImage:
      "https://www.thetravelmagazine.net/wp-content/uploads/Tashkent.jpg",
    prompt:
      "Plan a 5-day trip to Tashkent, Uzbekistan. I want to explore the historic places and experience the local cuisine. Include recommendations for traditional restaurants and hidden gems.",
  },
  {
    id: "astana-14-days",
    title: "5 Day Trip to Astana",
    coverImage:
      "https://cdn.getyourguide.com/img/location/5a1d41802404f.jpeg/99.jpg",
    prompt:
      "Create a 5-day itinerary for Astana, Kazakhstan. I'd like to see the Bayterek Tower, Khan Shatyr Entertainment Center, Palace of Peace and Reconciliation, and explore the modern architecture. Include day trips to nearby attractions.",
  },
  {
    id: "samarkand-5-days",
    title: "5 Day Trip to Samarkand",
    coverImage:
      "https://uzbekistan.travel/storage/app/media/Rasmlar/Samarqand/umumiy/cropped-images/shutterstock_1979665571-0-0-0-0-1738745770.jpg",
    prompt:
      "Design a 5-day adventure in Samarkand, Uzbekistan. I want to visit Registan Square, Shah-i-Zinda necropolis, Gur-e-Amir mausoleum, and Bibi-Khanym Mosque. Include authentic dining experiences and local market visits.",
  },
  {
    id: "bukhara-4-days",
    title: "5 Day Trip to Bukhara",
    coverImage: "https://ea-travel.uz/images/Night-in-Bukhara-banner.jpg",
    prompt:
      "Plan a 5-day trip to Bukhara, Uzbekistan. I want to explore the historic center, visit the Ark Fortress, Po-i-Kalyan complex, Lyab-i Hauz, and experience the ancient Silk Road atmosphere. Include local craft workshops and traditional cuisine.",
  },
  {
    id: "almaty-6-days",
    title: "6 Day Trip to Almaty",
    coverImage:
      "https://eurasia.travel/wp-content/uploads/2024/10/Almaty-city-3-1024x683.jpg",
    prompt:
      "Create a 5-day itinerary for Almaty, Kazakhstan. Include visits to Big Almaty Lake, Medeu skating rink, Shymbulak ski resort, Zenkov Cathedral, and Green Bazaar. Mix mountain adventures with city exploration.",
  },
  {
    id: "bishkek-5-days",
    title: "5 Day Trip to Bishkek",
    coverImage:
      "https://media.digitalnomads.world/wp-content/uploads/2021/04/20120420/bishkek-digital-nomads.jpg",
    prompt:
      "Design a 5-day trip to Bishkek, Kyrgyzstan. I want to explore Ala-Too Square, visit Osh Bazaar, take day trips to Ala Archa National Park and Burana Tower. Include experiences of nomadic culture and local cuisine.",
  },
]
