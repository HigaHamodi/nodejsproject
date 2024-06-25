const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const dotenv = require("dotenv");
const moment = require("moment");
const morgan = require("morgan");
const cardRouter = require("./routes/cardRoutes");
const createInitialData = require("./helpers/createInitialData");
const fs = require("fs");
const { format } = require("date-fns");
const rateLimit = require("express-rate-limit");

dotenv.config();

async function mongoConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
    createInitialData();
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
  }
}

mongoConnect().catch((err) => console.log(err));

const app = express();
morgan.token("time", () => moment().format("YYYY-MM-DD HH:mm:ss"));
const morganFormat = ":time :method :url :status :response-time ms";
app.use(morgan(morganFormat));
app.use(express.json());
app.use(
  cors({
    origin: true,
    credentials: true,
    methods: "GET,PUT,POST,DELETE,OPTIONS",
    allowedHeaders: "Content-Type, Accept, Authorization",
  })
);

// **** Error Logger Bonus **** //
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
      fs.appendFile(fileName, content, (err) => {});
    }
  });
  next();
});
// **** Error Logger Bonus **** //

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});
app.use(limiter);

app.listen(process.env.PORT, async () => {
  console.log(`Listen to port: ${process.env.PORT}`);
});

app.use(userRouter);
app.use(authRouter);
app.use(cardRouter);
app.use(express.static("public"));
app.use("*", (req, res) => {
  res.status(404).json({ error: "Sorry, page not found 404" });
});
