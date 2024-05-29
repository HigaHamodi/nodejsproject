const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const env = require("dotenv").config();
const moment = require("moment");
const morgan = require("morgan");
const cardRouter = require("./routes/cardRoutes");
const createInitialData = require("./helpers/createInitialData");
const fs = require("fs");
const { format } = require("date-fns");

// Connect to MongoDB
async function mongoConnect() {
  try {
    await mongoose.connect(env.parsed.MONGO_URL);
    console.log("MongoDB Connected");
    createInitialData();
  } catch (err) {
    console.error("Failed to connect to MongoDB");
    process.exit(1); // Exit process on connection failure
  }
}

mongoConnect().catch((err) => console.log(err));

const app = express();

// Morgan token for logging timestamp
morgan.token("time", () => moment().format("YYYY-MM-DD HH:mm:ss"));
const morganFormat = ":time :method :url :status :response-time ms";
app.use(morgan(morganFormat));

// Body parser middleware
app.use(express.json());

// Enable CORS
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,PUT,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);

// Error logger middleware
app.use((req, res, next) => {
  const fileName = `./logs/log_${moment().format("Y_M_D")}.txt`;
  let responseBody;
  const oldJson = res.json;
  res.json = function (data) {
    responseBody = data;
    oldJson.apply(res, arguments);
  };
  res.on("finish", () => {
    if (res.statusCode >= 400) {
      let content = "";
      content += `Time: ${format(new Date(), "dd-MM-yyyy HH:mm:ss")}\n`;
      content += `Method: ${req.method}\n`;
      content += `Route: ${req.url}\n`;
      content += `Status: ${res.statusCode}\n`;
      content += `Response: ${JSON.stringify(responseBody)}\n`;
      content += "\n";
      fs.appendFile(fileName, content, (err) => {
        if (err) {
          console.error("Error writing to log file:", err);
        }
      });
    }
  });
  next();
});

// Routes
app.use(userRouter);
app.use(authRouter);
app.use(cardRouter);

// Static files
app.use(express.static("public"));

// 404 Error handler
app.use("*", (req, res) => {
  res
    .status(404)
    .json({ error: "Oops! The page you're looking for cannot be found." });
});

// Start server
const PORT = env.parsed.PORT || 8181; // Default to port 8181 if PORT environment variable is not set
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
