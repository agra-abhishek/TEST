import express from "express";
import cors from "cors";
import bodyParser from "body-parser";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());
app.use(express.json());

// Enable CORS
app.use(cors({ origin: "*", methods: ["GET", "POST"] }));

// Serve static frontend
app.use(express.static("public"));

// ---- Score Data ----
let score = {
  teamA: { runs: 0, wickets: 0, overs: "0.0" },
  teamB: { runs: 0, wickets: 0, overs: "0.0" },
  batting: "teamA"
};

// Helper to return simplified score
function getSimpleScore() {
  const battingTeam = score.batting;
  const oppositionTeam = battingTeam === "teamA" ? "teamB" : "teamA";
  return {
    battingTeam,
    oppositionTeam,
    runs: score[battingTeam].runs,
    wickets: score[battingTeam].wickets,
    overs: score[battingTeam].overs
  };
}

// API to get score
app.get("/score", (req, res) => {
  res.setHeader("Cache-Control", "no-cache, no-store, must-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.json(getSimpleScore());
});

// API to update score
app.post("/update", (req, res) => {
  const { batting, runs, wickets, overs } = req.body;
  if (batting && runs != null && wickets != null && overs != null) {
    score.batting = batting;
    score[batting] = { runs, wickets, overs };
  }
  res.json({ message: "Score updated", score: getSimpleScore() });
});

app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
