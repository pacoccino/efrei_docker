const express = require("express");
const mongoose = require("mongoose");
const os = require("os");
//const cors = require("cors");
const process = require("process");

// ____________
// Configuration récuperée des variables d'environnement

const port = process.env["PORT"] || 3000;
const dbUrl = process.env["DB_URL"] || "mongodb://localhost:27017/mydatabase";

const app = express();
app.use(express.json());
//app.use(cors());

console.log("Connecting to MongoDB...");

mongoose
  .connect(dbUrl, {
    serverSelectionTimeoutMS: 500,
  })
  .then(() => {
    console.log("Connected to MongoDB");

    app.listen(port, () =>
      console.log(`Server running at http://localhost:${port}`)
    );
  })
  .catch((err) => console.error("Could not connect to MongoDB", err.message));

const logSchema = new mongoose.Schema({ hostname: String, date: Date });
const Log = mongoose.model("Log", logSchema);

async function log() {
  const hostname = os.hostname();
  await new Log({
    date: Date.now(),
    hostname,
  }).save();
}

app.get("/", async (req, res) => {
  const hostname = os.hostname();
  await log();

  res.status(200).send(`Hello, I am ${hostname}`);
});

app.get("/logs", async (req, res) => {
  await log();
  res.send(
    await Log.find({}).sort({
      date: "desc",
    })
  );
});

async function getHostnameCounts() {
  try {
    const results = await Log.aggregate([
      {
        $group: {
          _id: "$hostname", // Group by hostname
          count: { $sum: 1 }, // Count the number of occurrences
        },
      },
      {
        $project: {
          _id: 0, // Exclude the _id field
          hostname: "$_id", // Rename _id to hostname
          count: 1, // Include the count
        },
      },
      {
        $sort: { count: -1 }, // Optional: Sort by count in descending order
      },
    ]);

    return results;
  } catch (error) {
    console.error("Error fetching hostname counts:", error);
    throw error;
  }
}

app.get("/ids", async (req, res) => {
  await log();
  res.send(await getHostnameCounts());
});

process.on("SIGINT", () => {
  console.info("Interrupted");
  process.exit(0);
});
