import "dotenv/config";
import express from "express";
import cors from "cors";
import studyRoutes from "./routes/ai.routes.js";

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(cors({ origin: CLIENT_ORIGIN }));
app.use(express.json({ limit: "100kb" }));

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/study", studyRoutes);

// Fallback error handler — guarantees we never leak a stack trace to the
// client even if something upstream throws unexpectedly.
app.use((err, req, res, next) => {
  console.error("[server] Unhandled error:", err);
  res.status(500).json({ success: false, error: "Something went wrong on the server." });
});

app.listen(PORT, () => {
  if (!process.env.GEMINI_API_KEY) {
    console.warn(
      "\n⚠️  GEMINI_API_KEY is not set. Copy .env.example to .env and add your key.\n"
    );
  }
  console.log(`StudyFlow API listening on http://localhost:${PORT}`);
});
