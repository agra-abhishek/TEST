import express from "express";
import fetch from "node-fetch";

const app = express();
const PORT = process.env.PORT || 8100;

app.get("/", async (req, res) => {
  try {
    // Get client IP (Render adds "x-forwarded-for")
    const ip =
      req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress;

    // Fetch geo info
    const geoRes = await fetch(`https://ipapi.co/${ip}/json/`);
    const geoData = await geoRes.json();

    // Get browser info
    const userAgent = req.headers["user-agent"];

    // Log to console
    console.log("🌍 New Visitor:");
    console.log("IP:", ip);
    console.log("City:", geoData.city);
    console.log("Region:", geoData.region);
    console.log("Country:", geoData.country_name);
    console.log("Coordinates:", geoData.latitude, geoData.longitude);
    console.log("Browser Info:", userAgent);
    console.log("----------");

    res.send(`<h2>Welcome Visitor 👋</h2>
              <p>Your IP: ${ip}</p>
              <p>City: ${geoData.city || "Unknown"}</p>
              <p>Region: ${geoData.region || "Unknown"}</p>
              <p>Country: ${geoData.country_name || "Unknown"}</p>
              <p>Coordinates: ${geoData.latitude || "?"}, ${geoData.longitude || "?"}</p>
              <p>Browser: ${userAgent}</p>`);
  } catch (err) {
    console.error("Error fetching geo info:", err);
    res.status(500).send("Something went wrong.");
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
