// ===============================
// IMPORTS
// ===============================
const fs = require("fs");
const axios = require("axios");
const csv = require("csv-parser");
const { Readable } = require("stream");

// ===============================
// GOOGLE SHEET CSV URL
// ===============================
const CSV_URL =
  "https://docs.google.com/spreadsheets/d/e/2PACX-1vSf-NvJRWrauaNgrorLP_vUv0olLy72EHSuxyfsV54-1gQ5yXpDwg1Z_MCet8DbdpAeGB-2THEp-8JS/pub?gid=1776037993&single=true&output=csv";

// ===============================
// FETCH CSV USING AXIOS
// ===============================
async function fetchCSV() {
  const response = await axios.get(CSV_URL);

  const results = [];

  return new Promise((resolve, reject) => {
    const stream = Readable.from(response.data);

    stream
      .pipe(csv())
      .on("data", (row) => {
        // normalize keys
        const cleanRow = {};
        Object.keys(row).forEach((key) => {
          cleanRow[key.trim().toLowerCase()] = row[key];
        });

        const date = cleanRow["date"];
        const cityRaw = cleanRow["city"];

        if (!date || !cityRaw) return;

        results.push({
          date: date.trim(),
          city: cityRaw.toLowerCase().trim(),
          gold24: parseFloat(cleanRow["gold24"]),
          gold22: parseFloat(cleanRow["gold22"]),
          silver: parseFloat(cleanRow["silver"]),
        });
      })
      .on("end", () => resolve(results))
      .on("error", reject);
  });
}

// ===============================
// GENERATE JSON
// ===============================
async function generateJSON() {
  try {
    const rows = await fetchCSV();

    console.log("Rows fetched:", rows.length);

    const grouped = {};

    rows.forEach((row) => {
      if (!grouped[row.city]) grouped[row.city] = [];
      grouped[row.city].push(row);
    });

    const finalData = {
      updatedAt: new Date().toISOString(),
      data: {}
    };

    Object.keys(grouped).forEach((city) => {
      const cityData = grouped[city];

      cityData.sort((a, b) => new Date(a.date) - new Date(b.date));

      const last7 = cityData.slice(-7);

      finalData.data[city] = {
        today: last7[last7.length - 1],
        last7Days: last7
      };
    });

    fs.writeFileSync("gold-data.json", JSON.stringify(finalData, null, 2));

    console.log("✅ JSON generated successfully from Google Sheet!");
  } catch (err) {
    console.error("❌ ERROR:", err.message);
  }
}

// ===============================
// RUN
// ===============================
generateJSON();