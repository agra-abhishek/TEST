import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8100;

app.get("/", async (req, res) => {
  const ip = req.headers["x-forwarded-for"] || req.socket.remoteAddress;

  try {
    const response = await fetch(`https://ipapi.co/${ip}/json/`);
    const data = await response.json();

    console.log(`🌍 New Visitor:
IP: ${ip}
City: ${data.city || "N/A"}
Region: ${data.region || "N/A"}
Country: ${data.country_name || "N/A"}
Coordinates: ${data.latitude || "N/A"}, ${data.longitude || "N/A"}
----------`);

    res.send("Visitor data logged!");
  } catch (err) {
    console.error("❌ Error fetching geo info:", err.message);
    res.send("Error fetching geo info, but server is running ✅");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
