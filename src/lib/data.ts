export const RESTAURANT = {
  name: "Hentak.",
  tagline: "Nouvelle Manipuri Cuisine",
  description:
    "A contemporary dining experience rooted in the ancient fermented food traditions of Manipur. We bring the soulful, fermented flavours of the Meitei kitchen — hentak, ngari, singju — to the modern table.",
  address: "Imphal, Manipur, India",
  phone: "+91 98621 00000",
  email: "hello@hentakrestaurant.com",
  instagram: "https://www.instagram.com/hentak_restaurant",
  facebook: "https://facebook.com/hentakrestaurant",
  twitter: "https://twitter.com/hentakrestaurant",
  mapsEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d56933.05806627649!2d93.90334!3d24.80972!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3749e5b60f9e7abf%3A0x94babd913ec114e3!2sImphal%2C%20Manipur!5e0!3m2!1sen!2sin!4v1699900000000",
};

export const HOURS = [
  { day: "Monday",    open: false, hours: "Closed" },
  { day: "Tuesday",   open: true,  hours: "12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM" },
  { day: "Wednesday", open: true,  hours: "12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM" },
  { day: "Thursday",  open: true,  hours: "12:00 PM – 3:00 PM, 6:30 PM – 10:00 PM" },
  { day: "Friday",    open: true,  hours: "12:00 PM – 3:00 PM, 6:30 PM – 10:30 PM" },
  { day: "Saturday",  open: true,  hours: "11:00 AM – 3:30 PM, 6:30 PM – 10:30 PM" },
  { day: "Sunday",    open: true,  hours: "11:00 AM – 3:30 PM, 6:00 PM – 9:30 PM" },
];

export type MenuItem = {
  id: string;
  name: string;
  meitei?: string;
  description: string;
  price: number;
  tag?: string;
};

export const MENU: Record<string, MenuItem[]> = {
  Starters: [
    {
      id: "s1",
      name: "Singju",
      meitei: "ꯁꯤꯡꯖꯨ",
      description: "Traditional Manipuri fermented salad of banana flower, lotus stem & water cress, dressed with ngari and maroi nakuppi",
      price: 220,
      tag: "Signature",
    },
    {
      id: "s2",
      name: "Champhut Board",
      description: "A curated spread of hentak paste, ngari, ooti, and pickled bamboo shoot with handmade rice crackers",
      price: 380,
      tag: "Chef's Pick",
    },
    {
      id: "s3",
      name: "Soibum Singju",
      meitei: "ꯁꯣꯢꯕꯨꯝ ꯁꯤꯡꯖꯨ",
      description: "Fermented bamboo shoot salad with fresh herbs, chilli and toasted sesame — sharp, funky, alive",
      price: 240,
    },
    {
      id: "s4",
      name: "Pakora Thongba",
      description: "Crispy gram flour fritters in a light, aromatic curry of maroi and seasonal greens",
      price: 280,
    },
    {
      id: "s5",
      name: "Hentak Bruschetta",
      description: "Our take on a classic — handmade rice bread, hentak butter, pickled banana flower, herb oil",
      price: 260,
      tag: "New",
    },
  ],
  Mains: [
    {
      id: "m1",
      name: "Hentak Eromba",
      meitei: "ꯍꯦꯟꯇꯥꯛ ꯏꯔꯣꯝꯕ",
      description: "The soul of our kitchen — mashed seasonal vegetables with aged hentak paste, dried chilli and fresh coriander",
      price: 420,
      tag: "Signature",
    },
    {
      id: "m2",
      name: "Nga Thongba",
      meitei: "ꯉꯥ ꯊꯣꯡꯕ",
      description: "Whole river fish simmered in a clay pot broth with fermented soybean, ginger, lemongrass and bamboo shoot",
      price: 580,
      tag: "Chef's Pick",
    },
    {
      id: "m3",
      name: "Kangsoi",
      meitei: "ꯀꯥꯡꯁꯣꯢ",
      description: "A meditative broth of seasonal wild greens, maroi, and taro — the everyday soul food of Manipur, elevated",
      price: 360,
      tag: "Vegetarian",
    },
    {
      id: "m4",
      name: "Chamthong",
      description: "Light and nourishing stew of lotus root, water chestnut, and banana blossom in a clear lemongrass stock",
      price: 340,
      tag: "Vegetarian",
    },
    {
      id: "m5",
      name: "Manipuri Thali",
      description: "A complete traditional spread: steamed rice, eromba, kangsoi, singju, fried ngari, pickle, and seasonal greens",
      price: 620,
      tag: "Must Try",
    },
  ],
  Desserts: [
    {
      id: "d1",
      name: "Chak-hao Kheer",
      meitei: "ꯆꯥꯛ-ꯍꯥꯎ ꯈꯤꯔ",
      description: "Black glutinous rice slow-cooked in coconut milk, cardamom, and palm jaggery — served warm",
      price: 220,
      tag: "Signature",
    },
    {
      id: "d2",
      name: "Chak-hao Poireiton",
      description: "Purple sticky rice pressed into moulds, served with fresh banana, honey, and sesame brittle",
      price: 200,
    },
    {
      id: "d3",
      name: "Koukhen",
      description: "Traditional steamed rice cake with grated coconut and raw cane sugar — soft, fragrant, simple",
      price: 180,
    },
    {
      id: "d4",
      name: "Seasonal Fruit Plate",
      description: "Locally grown fruit with a drizzle of wild honey and crushed black pepper — foraged by our kitchen team",
      price: 160,
    },
  ],
  Drinks: [
    {
      id: "dr1",
      name: "Chumchet Tea",
      description: "Traditional Meitei herb tea brewed with maroi nakuppi, dried citrus and ginger — served in clay cups",
      price: 120,
      tag: "Signature",
    },
    {
      id: "dr2",
      name: "Yu Spritz",
      description: "House-fermented rice spirit, fresh lime, honey, sparkling water — bright and clean",
      price: 280,
    },
    {
      id: "dr3",
      name: "Sugarcane Cooler",
      description: "Fresh-pressed local sugarcane, raw ginger, lime leaf, black salt",
      price: 140,
    },
    {
      id: "dr4",
      name: "Lakshmi Lassi",
      description: "Thick yoghurt blended with seasonal fruit, rose water and a pinch of cardamom",
      price: 160,
    },
    {
      id: "dr5",
      name: "Bamboo Water",
      description: "Cold-infused water with fresh bamboo shoot, cucumber and mint — zero sugar, deeply refreshing",
      price: 100,
      tag: "Non-Alcoholic",
    },
  ],
};

export const FEATURED_DISHES = [
  {
    name: "Hentak Eromba",
    description: "Mashed vegetables, aged hentak paste",
    price: 420,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=400&fit=crop&q=80",
    alt: "Hentak Eromba — traditional Manipuri mashed vegetable dish with fermented fish paste",
  },
  {
    name: "Singju",
    description: "Fermented salad, ngari dressing",
    price: 220,
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=400&fit=crop&q=80",
    alt: "Singju — traditional Manipuri fermented salad with lotus stem and banana flower",
  },
  {
    name: "Nga Thongba",
    description: "River fish, clay pot, bamboo shoot",
    price: 580,
    image: "https://images.unsplash.com/photo-1534766555764-ce878a5e3a2b?w=600&h=400&fit=crop&q=80",
    alt: "Nga Thongba — Manipuri river fish curry in clay pot",
  },
  {
    name: "Chak-hao Kheer",
    description: "Black rice, coconut milk, jaggery",
    price: 220,
    image: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop&q=80",
    alt: "Chak-hao Kheer — Manipuri black glutinous rice pudding",
  },
];

export const GALLERY_IMAGES = [
  {
    src: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&h=600&fit=crop&q=80",
    alt: "Hentak restaurant interior — warm, intimate dining room",
  },
  {
    src: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=600&h=700&fit=crop&q=80",
    alt: "Traditional Manipuri curry — earthy, aromatic, deeply comforting",
  },
  {
    src: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&h=450&fit=crop&q=80",
    alt: "Singju — fresh herb salad with fermented dressing",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=500&fit=crop&q=80",
    alt: "Manipuri thali spread — complete traditional meal",
  },
  {
    src: "https://images.unsplash.com/photo-1482049016688-2d3e1291311a?w=600&h=400&fit=crop&q=80",
    alt: "Close-up of plated Hentak dish with microgreens",
  },
  {
    src: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&h=400&fit=crop&q=80",
    alt: "Chumchet herb tea and bamboo water served in clay cups",
  },
  {
    src: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&h=500&fit=crop&q=80",
    alt: "Hentak restaurant — evening dining atmosphere",
  },
  {
    src: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&h=400&fit=crop&q=80",
    alt: "Chef plating a dish at the open kitchen",
  },
  {
    src: "https://images.unsplash.com/photo-1551024506-0bccd828d307?w=600&h=400&fit=crop&q=80",
    alt: "Chak-hao Kheer — black rice dessert",
  },
];
