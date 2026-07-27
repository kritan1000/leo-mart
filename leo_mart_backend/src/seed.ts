import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(__dirname, "../.env") });

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/leo_mart";

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    stockStatus: {
      type: String,
      enum: ["in-stock", "bulk-deal", "low-stock"],
      default: "in-stock",
    },
    minBulkQty: { type: Number, default: 0 },
    bulkPrice: { type: Number, default: 0 },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema);

const products = [
  // ===== Noodles & Pasta =====
  {
    name: "Wai Wai Noodles Chicken",
    description: "Instant noodle snack, 70g pack. Cook or eat dry for a crispy snack.",
    price: 20,
    image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?w=400&h=400&fit=crop",
    category: "Noodles & Pasta",
    brand: "Wai Wai",
    stockStatus: "in-stock",
  },
  {
    name: "Wai Wai Noodles Vegetable",
    description: "Vegetarian instant noodles, 70g pack. Light and flavorful.",
    price: 20,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
    category: "Noodles & Pasta",
    brand: "Wai Wai",
    stockStatus: "in-stock",
  },
  {
    name: "Wai Wai Noodles Chatpata",
    description: "Spicy instant noodles, 70g pack. Bold Nepali flavors.",
    price: 20,
    image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=400&h=400&fit=crop",
    category: "Noodles & Pasta",
    brand: "Wai Wai",
    stockStatus: "in-stock",
  },
  {
    name: "Yippee Noodles Magic Masala",
    description: "Non-sticky instant noodles with magic masala taste, 60g pack.",
    price: 15,
    image: "https://images.unsplash.com/photo-1645696301019-35adcc18fc14?w=400&h=400&fit=crop",
    category: "Noodles & Pasta",
    brand: "Yippee",
    stockStatus: "in-stock",
  },
  {
    name: "Ital Pasta Spaghetti 500g",
    description: "Long thin Italian pasta made from durum wheat, perfect with sauces.",
    price: 85,
    image: "https://images.unsplash.com/photo-1551462147-ff29053bfc14?w=400&h=400&fit=crop",
    category: "Noodles & Pasta",
    brand: "Ital",
    stockStatus: "in-stock",
  },

  // ===== Rice & Grains =====
  {
    name: "Tiger Basmati Rice 5kg",
    description: "Premium long grain basmati rice. Aromatic and fluffy, ideal for biryani and pulao.",
    price: 650,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    category: "Rice & Grains",
    brand: "Tiger",
    stockStatus: "in-stock",
    minBulkQty: 10,
    bulkPrice: 600,
  },
  {
    name: "Krishna Head Rice 25kg",
    description: "Everyday premium rice, large pack. Soft, fluffy, and affordable.",
    price: 1800,
    image: "https://images.unsplash.com/photo-1550825902-6c3f5c11b338?w=400&h=400&fit=crop",
    category: "Rice & Grains",
    brand: "Krishna",
    stockStatus: "bulk-deal",
    minBulkQty: 5,
    bulkPrice: 1700,
  },
  {
    name: "Patan Industrial Rice 10kg",
    description: "Quality polished rice for daily Nepali meals.",
    price: 750,
    image: "https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=400&h=400&fit=crop",
    category: "Rice & Grains",
    brand: "Patan",
    stockStatus: "in-stock",
  },
  {
    name: "Chiura (Beaten Rice) 500g",
    description: "Traditional flattened rice, perfect for breakfast and festivals.",
    price: 60,
    image: "https://images.unsplash.com/photo-1606525427413-f2d1c2c0eb06?w=400&h=400&fit=crop",
    category: "Rice & Grains",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },

  // ===== Flour & Baking =====
  {
    name: "Patan Atta Flour 10kg",
    description: "Stone-ground whole wheat flour for making roti, chapati, and puri.",
    price: 480,
    image: "https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400&h=400&fit=crop",
    category: "Flour & Baking",
    brand: "Patan",
    stockStatus: "in-stock",
    minBulkQty: 5,
    bulkPrice: 450,
  },
  {
    name: "Maida Flour 1kg",
    description: "Refined all-purpose flour for baking, pastries, and sweets.",
    price: 55,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    category: "Flour & Baking",
    brand: "Annapurna",
    stockStatus: "in-stock",
  },
  {
    name: "Corn Flour 500g",
    description: "Fine corn flour for making dhindo, porridge, and thicken sauces.",
    price: 45,
    image: "https://images.unsplash.com/photo-1551754655-c320904e4a28?w=400&h=400&fit=crop",
    category: "Flour & Baking",
    brand: "Annapurna",
    stockStatus: "in-stock",
  },
  {
    name: "Baking Powder 100g",
    description: "Double-acting baking powder for fluffy cakes and soft breads.",
    price: 35,
    image: "https://images.unsplash.com/photo-1587132137056-bfbf0166836e?w=400&h=400&fit=crop",
    category: "Flour & Baking",
    brand: "Weikfield",
    stockStatus: "in-stock",
  },

  // ===== Lentils & Pulses =====
  {
    name: "Masoor Dal (Red Lentil) 1kg",
    description: "Husked red lentils, quick-cooking and protein-rich. Essential dal.",
    price: 180,
    image: "https://images.unsplash.com/photo-1610725664285-7c57e6eeac3f?w=400&h=400&fit=crop",
    category: "Lentils & Pulses",
    brand: "Nature's Best",
    stockStatus: "in-stock",
    minBulkQty: 10,
    bulkPrice: 165,
  },
  {
    name: "Moong Dal (Green Gram) 1kg",
    description: "Split green gram lentils, light and easy to digest.",
    price: 160,
    image: "https://images.unsplash.com/photo-1596797038530-2c107229654b?w=400&h=400&fit=crop",
    category: "Lentils & Pulses",
    brand: "Nature's Best",
    stockStatus: "in-stock",
  },
  {
    name: "Kala Dal (Black Gram) 1kg",
    description: "Whole black gram for authentic dal makhani and sambar.",
    price: 150,
    image: "https://images.unsplash.com/photo-1583224994076-28815d83f8b3?w=400&h=400&fit=crop",
    category: "Lentils & Pulses",
    brand: "Nature's Best",
    stockStatus: "in-stock",
  },
  {
    name: "Rajma (Kidney Beans) 500g",
    description: "Premium quality kidney beans for curry and rice combinations.",
    price: 110,
    image: "https://images.unsplash.com/photo-1568702846914-96b305d2uj89?w=400&h=400&fit=crop",
    category: "Lentils & Pulses",
    brand: "Bulk Basics",
    stockStatus: "in-stock",
  },
  {
    name: "Chana Dal (Split Chickpea) 1kg",
    description: "Split Bengal gram, ideal for dal, snacks, and sweets.",
    price: 140,
    image: "https://images.unsplash.com/photo-1586201375761-83865001e31c?w=400&h=400&fit=crop",
    category: "Lentils & Pulses",
    brand: "Bulk Basics",
    stockStatus: "in-stock",
  },

  // ===== Spices & Masala =====
  {
    name: "Turmeric Powder 500g",
    description: "Pure turmeric powder with rich color and aroma. Essential spice.",
    price: 120,
    image: "https://images.unsplash.com/photo-1615485500704-8e990f9900f7?w=400&h=400&fit=crop",
    category: "Spices & Masala",
    brand: "Eastern",
    stockStatus: "in-stock",
  },
  {
    name: "Red Chili Powder 500g",
    description: "Hot and vibrant red chili powder for bold Nepali flavors.",
    price: 150,
    image: "https://images.unsplash.com/photo-1599909533601-aa21c5e83a87?w=400&h=400&fit=crop",
    category: "Spices & Masala",
    brand: "Eastern",
    stockStatus: "in-stock",
  },
  {
    name: "Cumin Powder 200g",
    description: "Freshly ground cumin with earthy aroma for curries and dal.",
    price: 80,
    image: "https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=400&h=400&fit=crop",
    category: "Spices & Masala",
    brand: "Everest",
    stockStatus: "in-stock",
  },
  {
    name: "Garam Masala 100g",
    description: "Blend of warm spices for finishing curries and meat dishes.",
    price: 90,
    image: "https://images.unsplash.com/photo-1505253758473-96b7015fcd40?w=400&h=400&fit=crop",
    category: "Spices & Masala",
    brand: "Everest",
    stockStatus: "in-stock",
  },
  {
    name: "Timur (Sichuan Pepper) 50g",
    description: "Nepali timur with unique tingling sensation. Authentic Himalayan spice.",
    price: 65,
    image: "https://images.unsplash.com/photo-1599909533601-aa21c5e83a87?w=400&h=400&fit=crop",
    category: "Spices & Masala",
    brand: "Himalayan",
    stockStatus: "low-stock",
  },

  // ===== Cooking Oil & Ghee =====
  {
    name: "Fortune Sunflower Oil 1L",
    description: "Light and healthy sunflower oil for everyday cooking.",
    price: 200,
    image: "https://images.unsplash.com/photo-1474979266404-7f28f9f09880?w=400&h=400&fit=crop",
    category: "Cooking Oil & Ghee",
    brand: "Fortune",
    stockStatus: "in-stock",
  },
  {
    name: "Mustard Oil 1L",
    description: "Cold-pressed mustard oil for authentic Nepali and Indian cooking.",
    price: 220,
    image: "https://images.unsplash.com/photo-1615141982690-7f72bb1f0d80?w=400&h=400&fit=crop",
    category: "Cooking Oil & Ghee",
    brand: "Tez",
    stockStatus: "in-stock",
  },
  {
    name: "Amul Ghee 500ml",
    description: "Pure cow ghee for dal, rice, and traditional sweets.",
    price: 380,
    image: "https://images.unsplash.com/photo-1631209121670-44daed2d44f4?w=400&h=400&fit=crop",
    category: "Cooking Oil & Ghee",
    brand: "Amul",
    stockStatus: "in-stock",
    minBulkQty: 5,
    bulkPrice: 360,
  },
  {
    name: "Dalda Vanaspati 1kg",
    description: "Hydrogenated vegetable oil for baking and deep-frying.",
    price: 180,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "Cooking Oil & Ghee",
    brand: "Dalda",
    stockStatus: "in-stock",
  },

  // ===== Tea & Coffee =====
  {
    name: "Red Label Tea 500g",
    description: "Premium blended tea leaves for strong Nepali-style milk tea.",
    price: 180,
    image: "https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?w=400&h=400&fit=crop",
    category: "Tea & Coffee",
    brand: "Red Label",
    stockStatus: "in-stock",
  },
  {
    name: "Nepal Tea Classic 250g",
    description: "Authentic Nepal-grown black tea from Ilam region.",
    price: 250,
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=400&h=400&fit=crop",
    category: "Tea & Coffee",
    brand: "Nepal Tea",
    stockStatus: "in-stock",
  },
  {
    name: "Nescafe Classic Coffee 100g",
    description: "Instant coffee granules for a quick and rich cup of coffee.",
    price: 220,
    image: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400&h=400&fit=crop",
    category: "Tea & Coffee",
    brand: "Nescafe",
    stockStatus: "in-stock",
  },
  {
    name: "Coffee Tea Sugar Combo Pack",
    description: "Value pack with tea, coffee, and sugar. Perfect for shops.",
    price: 450,
    image: "https://images.unsplash.com/photo-1497935586351-b67a49e012bf?w=400&h=400&fit=crop",
    category: "Tea & Coffee",
    brand: "Combo Pack",
    stockStatus: "bulk-deal",
    minBulkQty: 3,
    bulkPrice: 420,
  },

  // ===== Dairy Products =====
  {
    name: "Dhanu Dairy Milk 1L",
    description: "Fresh pasteurized full cream milk. Rich and creamy.",
    price: 90,
    image: "https://images.unsplash.com/photo-1563636619-e9143da7973b?w=400&h=400&fit=crop",
    category: "Dairy Products",
    brand: "Dhanu Dairy",
    stockStatus: "in-stock",
  },
  {
    name: "Amul Butter 100g",
    description: "Creamy and smooth table butter for bread and toast.",
    price: 55,
    image: "https://images.unsplash.com/photo-1589985270826-4b7bb13589ee?w=400&h=400&fit=crop",
    category: "Dairy Products",
    brand: "Amul",
    stockStatus: "in-stock",
  },
  {
    name: "Paneer 200g",
    description: "Fresh cottage cheese block for curries, snacks, and desserts.",
    price: 120,
    image: "https://images.unsplash.com/photo-1631209121670-44daed2d44f4?w=400&h=400&fit=crop",
    category: "Dairy Products",
    brand: "Dhanu Dairy",
    stockStatus: "in-stock",
  },
  {
    name: "Yogurt (Dahi) 400g",
    description: "Fresh creamy yogurt for raita, lassi, and curries.",
    price: 60,
    image: "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&h=400&fit=crop",
    category: "Dairy Products",
    brand: "Dhanu Dairy",
    stockStatus: "in-stock",
  },

  // ===== Beverages & Drinks =====
  {
    name: "Real Fruit Juice Mango 1L",
    description: "Refreshing mango fruit juice made from real mango pulp.",
    price: 130,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
    category: "Beverages & Drinks",
    brand: "Real",
    stockStatus: "in-stock",
  },
  {
    name: "Real Fruit Juice Mixed Fruit 1L",
    description: "Blend of real fruits for a delicious and refreshing drink.",
    price: 130,
    image: "https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&h=400&fit=crop",
    category: "Beverages & Drinks",
    brand: "Real",
    stockStatus: "in-stock",
  },
  {
    name: "Frooti Mango Drink 200ml",
    description: "Ready-to-drink mango-flavored beverage. Kids love it!",
    price: 15,
    image: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=400&h=400&fit=crop",
    category: "Beverages & Drinks",
    brand: "Frooti",
    stockStatus: "in-stock",
  },
  {
    name: "Sprite 1.5L",
    description: "Lime-flavored lemon-lime soda. Refreshing and crisp.",
    price: 85,
    image: "https://images.unsplash.com/photo-1581006852262-e4307cf6283a?w=400&h=400&fit=crop",
    category: "Beverages & Drinks",
    brand: "Sprite",
    stockStatus: "in-stock",
  },
  {
    name: "Coca-Cola 1.5L",
    description: "Classic cola drink. The world's most popular soft drink.",
    price: 90,
    image: "https://images.unsplash.com/photo-1554866585-cd94860890b7?w=400&h=400&fit=crop",
    category: "Beverages & Drinks",
    brand: "Coca-Cola",
    stockStatus: "in-stock",
  },
  {
    name: "Bisleri Mineral Water 1L",
    description: "Purified drinking water. Safe and hygienic.",
    price: 20,
    image: "https://images.unsplash.com/photo-1548839140-29a749e1cf4d?w=400&h=400&fit=crop",
    category: "Beverages & Drinks",
    brand: "Bisleri",
    stockStatus: "in-stock",
  },

  // ===== Snacks & Chips =====
  {
    name: "Kurkure Masala Munch 90g",
    description: "Crunchy corn puffs with bold masala flavors.",
    price: 20,
    image: "https://images.unsplash.com/photo-1599490659213-e2b9527bd087?w=400&h=400&fit=crop",
    category: "Snacks & Chips",
    brand: "Kurkure",
    stockStatus: "in-stock",
  },
  {
    name: "Lays Classic Salted 52g",
    description: "Thin and crispy potato chips with light salt.",
    price: 20,
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=400&h=400&fit=crop",
    category: "Snacks & Chips",
    brand: "Lays",
    stockStatus: "in-stock",
  },
  {
    name: "Haldiram Aloo Bhujia 200g",
    description: "Crunchy spiced potato noodles. Popular Indian snack.",
    price: 55,
    image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=400&h=400&fit=crop",
    category: "Snacks & Chips",
    brand: "Haldiram",
    stockStatus: "in-stock",
  },
  {
    name: "Pringles Original 110g",
    description: "Stackable potato crisps with a consistent crunch.",
    price: 150,
    image: "https://images.unsplash.com/photo-1613919113640-25732ec5e61f?w=400&h=400&fit=crop",
    category: "Snacks & Chips",
    brand: "Pringles",
    stockStatus: "in-stock",
  },

  // ===== Biscuits & Cookies =====
  {
    name: "Parle-G Biscuit 80g",
    description: "India's most loved glucose biscuit. Sweet and crunchy.",
    price: 10,
    image: "https://images.unsplash.com/photo-1590080875515-8a3a8dc5735e?w=400&h=400&fit=crop",
    category: "Biscuits & Cookies",
    brand: "Parle-G",
    stockStatus: "in-stock",
  },
  {
    name: "Britannia Marie Gold 250g",
    description: "Light and crispy tea-time biscuit with a classic taste.",
    price: 30,
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&h=400&fit=crop",
    category: "Biscuits & Cookies",
    brand: "Britannia",
    stockStatus: "in-stock",
  },
  {
    name: "Oreo Cookies 120g",
    description: "Chocolate sandwich cookies with cream filling. Twist, lick, dunk!",
    price: 30,
    image: "https://images.unsplash.com/photo-1528207776546-365bb710ee93?w=400&h=400&fit=crop",
    category: "Biscuits & Cookies",
    brand: "Oreo",
    stockStatus: "in-stock",
  },
  {
    name: "Cadbury Dairy Milk 90g",
    description: "Silky smooth milk chocolate. Perfect treat or gift.",
    price: 80,
    image: "https://images.unsplash.com/photo-1606312619070-d48b4c652a52?w=400&h=400&fit=crop",
    category: "Biscuits & Cookies",
    brand: "Cadbury",
    stockStatus: "in-stock",
  },

  // ===== Bread & Bakery (Nanglo Style) =====
  {
    name: "Nanglo Bread Loaf White 400g",
    description: "Soft and fluffy white bread loaf, freshly baked. Perfect for sandwiches.",
    price: 55,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    category: "Bread & Bakery",
    brand: "Nanglo",
    stockStatus: "in-stock",
  },
  {
    name: "Nanglo Brown Bread 400g",
    description: "Healthy whole wheat brown bread. Rich in fiber.",
    price: 65,
    image: "https://images.unsplash.com/photo-1549931319-a545753467c8?w=400&h=400&fit=crop",
    category: "Bread & Bakery",
    brand: "Nanglo",
    stockStatus: "in-stock",
  },
  {
    name: "Nanglo Bun Pack (6 pcs)",
    description: "Soft dinner buns, perfect with butter or curry.",
    price: 50,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    category: "Bread & Bakery",
    brand: "Nanglo",
    stockStatus: "in-stock",
  },
  {
    name: "Nanglo Rusk 200g",
    description: "Crispy and golden rusk, perfect with tea.",
    price: 40,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    category: "Bread & Bakery",
    brand: "Nanglo",
    stockStatus: "in-stock",
  },
  {
    name: "Nanglo Cream Roll (4 pcs)",
    description: "Flaky pastry rolls filled with sweet cream.",
    price: 80,
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&h=400&fit=crop",
    category: "Bread & Bakery",
    brand: "Nanglo",
    stockStatus: "low-stock",
  },

  // ===== Ready to Eat =====
  {
    name: "Maggi Noodles 70g (6-pack)",
    description: "2-minute instant noodles. The classic yellow pack everyone loves.",
    price: 84,
    image: "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=400&h=400&fit=crop",
    category: "Ready to Eat",
    brand: "Maggi",
    stockStatus: "in-stock",
    minBulkQty: 5,
    bulkPrice: 78,
  },
  {
    name: "Kwality Walls Ice Cream Vanilla 500ml",
    description: "Creamy vanilla ice cream. Perfect dessert for hot days.",
    price: 180,
    image: "https://images.unsplash.com/photo-1497034825429-c343d7c6a68f?w=400&h=400&fit=crop",
    category: "Ready to Eat",
    brand: "Kwality Walls",
    stockStatus: "in-stock",
  },
  {
    name: "MTR Ready to Eat Rajma 300g",
    description: "Ready-to-eat kidney bean curry. Just heat and serve.",
    price: 95,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop",
    category: "Ready to Eat",
    brand: "MTR",
    stockStatus: "in-stock",
  },
  {
    name: "Haldiram Chole 300g",
    description: "Ready-to-eat chickpea curry. Authentic Indian flavors.",
    price: 90,
    image: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=400&h=400&fit=crop",
    category: "Ready to Eat",
    brand: "Haldiram",
    stockStatus: "in-stock",
  },

  // ===== Cleaning & Household =====
  {
    name: "Vim Dishwash Liquid 500ml",
    description: "Powerful grease-cutting dishwash liquid. Leaves utensils sparkling clean.",
    price: 99,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=400&fit=crop",
    category: "Cleaning & Household",
    brand: "Vim",
    stockStatus: "in-stock",
  },
  {
    name: "Surf Excel Easy Wash 1kg",
    description: "Premium detergent powder for tough stain removal.",
    price: 180,
    image: "https://images.unsplash.com/photo-1582735689369-4fe89db7114c?w=400&h=400&fit=crop",
    category: "Cleaning & Household",
    brand: "Surf Excel",
    stockStatus: "in-stock",
    minBulkQty: 5,
    bulkPrice: 165,
  },
  {
    name: "Harpic Power Plus 500ml",
    description: "Thick toilet cleaner that removes 100% stains.",
    price: 115,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=400&fit=crop",
    category: "Cleaning & Household",
    brand: "Harpic",
    stockStatus: "in-stock",
  },
  {
    name: "Lizol Floor Cleaner 500ml",
    description: "Citrus floor cleaner for sparkling clean floors.",
    price: 120,
    image: "https://images.unsplash.com/photo-1585421514284-efb74c2b69ba?w=400&h=400&fit=crop",
    category: "Cleaning & Household",
    brand: "Lizol",
    stockStatus: "in-stock",
  },
  {
    name: "Garbage Bags Roll (30 pcs)",
    description: "Strong and leak-proof garbage bags for daily household use.",
    price: 75,
    image: "https://images.unsplash.com/photo-1611269154421-4e27233ac5c7?w=400&h=400&fit=crop",
    category: "Cleaning & Household",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },

  // ===== Personal Care =====
  {
    name: "Lifebuoy Soap 100g",
    description: "Antibacterial soap for germ protection. Keeps family healthy.",
    price: 38,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop",
    category: "Personal Care",
    brand: "Lifebuoy",
    stockStatus: "in-stock",
  },
  {
    name: "Colgate MaxFresh 150g",
    description: "Fresh breath toothpaste with cooling crystals.",
    price: 95,
    image: "https://images.unsplash.com/photo-1559302504-64aae6ca6b6d?w=400&h=400&fit=crop",
    category: "Personal Care",
    brand: "Colgate",
    stockStatus: "in-stock",
  },
  {
    name: "Head & Shoulders Shampoo 180ml",
    description: "Anti-dandruff shampoo for clean and flake-free hair.",
    price: 185,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop",
    category: "Personal Care",
    brand: "Head & Shoulders",
    stockStatus: "in-stock",
  },
  {
    name: "Vaseline Petroleum Jelly 100ml",
    description: "Multi-purpose skin protectant for dry and chapped skin.",
    price: 80,
    image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?w=400&h=400&fit=crop",
    category: "Personal Care",
    brand: "Vaseline",
    stockStatus: "in-stock",
  },

  // ===== Baby Care =====
  {
    name: "Pampers Diapers Medium (70 pcs)",
    description: "Absorbent baby diapers for up to 12 hours dryness.",
    price: 850,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    category: "Baby Care",
    brand: "Pampers",
    stockStatus: "in-stock",
    minBulkQty: 3,
    bulkPrice: 800,
  },
  {
    name: "Johnson's Baby Powder 200g",
    description: "Gentle baby powder for soft and smooth skin.",
    price: 120,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    category: "Baby Care",
    brand: "Johnson's",
    stockStatus: "in-stock",
  },
  {
    name: "Cerelac Wheat Apple (300g)",
    description: "Baby cereal with wheat and apple for 6-12 month babies.",
    price: 165,
    image: "https://images.unsplash.com/photo-1515488042361-ee00e0ddd4e4?w=400&h=400&fit=crop",
    category: "Baby Care",
    brand: "Nestle",
    stockStatus: "in-stock",
  },

  // ===== Dry Fruits & Nuts =====
  {
    name: "Kishmish (Raisins) 250g",
    description: "Sweet and plump raisins for desserts, biryanis, and snacking.",
    price: 150,
    image: "https://images.unsplash.com/photo-1599909533601-aa21c5e83a87?w=400&h=400&fit=crop",
    category: "Dry Fruits & Nuts",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },
  {
    name: "Badam (Almonds) 250g",
    description: "Premium quality almonds for healthy snacking and cooking.",
    price: 350,
    image: "https://images.unsplash.com/photo-1508061253366-f7da158b6d46?w=400&h=400&fit=crop",
    category: "Dry Fruits & Nuts",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },
  {
    name: "Kaju (Cashews) 250g",
    description: "Whole cashew nuts for cooking, desserts, and snacking.",
    price: 400,
    image: "https://images.unsplash.com/photo-1599909533601-aa21c5e83a87?w=400&h=400&fit=crop",
    category: "Dry Fruits & Nuts",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },
  {
    name: "Chhuara (Dried Dates) 250g",
    description: "Dried dates for energy and nutrition. Great for milk and desserts.",
    price: 180,
    image: "https://images.unsplash.com/photo-1599909533601-aa21c5e83a87?w=400&h=400&fit=crop",
    category: "Dry Fruits & Nuts",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },

  // ===== Pickles & Chutneys =====
  {
    name: "Nepali Achar (Mixed Pickle) 300g",
    description: "Traditional Nepali mixed pickle with mustard oil and spices.",
    price: 120,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop",
    category: "Pickles & Chutneys",
    brand: "Homestyle",
    stockStatus: "in-stock",
  },
  {
    name: "Kasundi Mustard Sauce 200g",
    description: "Tangy mustard sauce perfect for momos and snacks.",
    price: 85,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop",
    category: "Pickles & Chutneys",
    brand: "Homestyle",
    stockStatus: "in-stock",
  },
  {
    name: "Tomato Ketchup 500ml",
    description: "Smooth and sweet tomato ketchup for chips, noodles, and snacks.",
    price: 85,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop",
    category: "Pickles & Chutneys",
    brand: "Kissan",
    stockStatus: "in-stock",
  },

  // ===== Sugar & Sweeteners =====
  {
    name: "Sugar (Chini) 1kg",
    description: "Fine granulated sugar for tea, coffee, and cooking.",
    price: 90,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "Sugar & Sweeteners",
    brand: "Bulk Basics",
    stockStatus: "in-stock",
    minBulkQty: 10,
    bulkPrice: 82,
  },
  {
    name: "Jaggery (Gur) 500g",
    description: "Traditional unrefined cane sugar. Rich in minerals and iron.",
    price: 70,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "Sugar & Sweeteners",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },
  {
    name: "Honey 250ml",
    description: "Pure natural honey for health and sweetness.",
    price: 200,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "Sugar & Sweeteners",
    brand: "Local Fresh",
    stockStatus: "in-stock",
  },

  // ===== Salt & Condiments =====
  {
    name: "Salt (Nun) 1kg",
    description: "Iodized table salt for cooking and seasoning.",
    price: 30,
    image: "https://images.unsplash.com/photo-1587049352846-4a222e784d38?w=400&h=400&fit=crop",
    category: "Salt & Condiments",
    brand: "Tata",
    stockStatus: "in-stock",
    minBulkQty: 20,
    bulkPrice: 25,
  },
  {
    name: "Soy Sauce 200ml",
    description: "Dark soy sauce for Chinese and Nepali-style noodles and fried rice.",
    price: 75,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop",
    category: "Salt & Condiments",
    brand: "Chings",
    stockStatus: "in-stock",
  },
  {
    name: "Vinegar 500ml",
    description: "White synthetic vinegar for cooking and pickling.",
    price: 40,
    image: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=400&h=400&fit=crop",
    category: "Salt & Condiments",
    brand: "Chings",
    stockStatus: "in-stock",
  },
];

async function seed() {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("Connected to MongoDB");

    // Safety check: count existing products before wiping
    const existingCount = await Product.countDocuments();
    if (existingCount > 0) {
      console.log(`WARNING: ${existingCount} products exist in the database.`);
      console.log("This will DELETE all existing products and replace them with seed data.");
      console.log("If you have uploaded products with custom images, they will be LOST.");
      console.log("Run with --force to proceed: npx ts-node src/seed.ts --force");

      const args = process.argv.slice(2);
      if (!args.includes("--force")) {
        console.log("Aborting. No changes made.");
        await mongoose.disconnect();
        process.exit(0);
      }
    }

    // Clear existing products
    await Product.deleteMany({});
    console.log("Cleared existing products");

    // Insert products
    const result = await Product.insertMany(products);
    console.log(`Successfully seeded ${result.length} products`);

    // Print categories
    const categories = [...new Set(products.map((p) => p.category))];
    console.log("\nCategories created:");
    categories.forEach((cat) => console.log(`  - ${cat}`));

    await mongoose.disconnect();
    console.log("\nDisconnected from MongoDB. Seed complete!");
    process.exit(0);
  } catch (error) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
