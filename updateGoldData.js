// ===============================
// ✅ IMPORT
// ===============================
const fs = require("fs");

// ===============================
// ✅ CONFIG (ALL YOUR CITIES)
// ===============================
const cities = [
  "visakhapatnam",
  "vijayawada",
  "tirupati",
  "guntur",
  "kurnool",
  "hyderabad",
  "warangal",
  "nizamabad",
  "karimnagar",
  "chennai",
  "coimbatore",
  "madurai",
  "trichy",
  "salem",
  "bangalore",
  "mysore",
  "mangalore",
  "hubli",
  "kochi",
  "trivandrum",
  "kozhikode",
  "thrissur",
  "new delhi",
  "lucknow",
  "kanpur",
  "varanasi",
  "noida",
  "ghaziabad",
  "amritsar",
  "ludhiana",
  "jalandhar",
  "gurgaon",
  "faridabad",
  "shimla",
  "dehradun",
  "mumbai",
  "pune",
  "nagpur",
  "nashik",
  "ahmedabad",
  "surat",
  "vadodara",
  "rajkot",
  "jaipur",
  "udaipur",
  "jodhpur",
  "kolkata",
  "patna",
  "ranchi",
  "bhubaneswar",
  "guwahati",
  "shillong"
];

// ===============================
// ✅ BASE PRICE (STATIC / API LATER)
// ===============================
function getBasePrice() {
  return {
    gold24: 152922.276,
    gold22: 140176.22,
    silver: 248740.6
  };
}

// ===============================
// ✅ FORMAT DATE (YYYY-MM-DD ONLY)
// ===============================
function formatDate(date) {
  return date.toISOString().split("T")[0];
}

// ===============================
// ✅ GET LAST 7 DAYS (CORRECT LOGIC)
// ===============================
function getLast7Days() {
  const dates = [];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);

    dates.push(formatDate(d));
  }

  return dates;
}

// ===============================
// ✅ GENERATE FULL DATA
// ===============================
function generateData() {
  const result = {
    updatedAt: new Date().toISOString(),
    data: {}
  };

  const last7Dates = getLast7Days();
  const basePrice = getBasePrice();

  cities.forEach((city) => {
    const last7Days = last7Dates.map((date) => ({
      date,
      city,
      gold24: basePrice.gold24,
      gold22: basePrice.gold22,
      silver: basePrice.silver
    }));

    result.data[city] = {
      today: last7Days[last7Days.length - 1],
      last7Days
    };
  });

  return result;
}

// ===============================
// ✅ WRITE TO FILE
// ===============================
const finalData = generateData();

fs.writeFileSync("gold-data.json", JSON.stringify(finalData, null, 2));

console.log("✅ Gold data updated successfully!");
