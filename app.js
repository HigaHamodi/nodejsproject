const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoutes");
const authRouter = require("./routes/authRoutes");
const dotenv = require("dotenv").config();
const moment = require("moment");
const morgan = require("morgan");
const cardRouter = require("./routes/cardRoutes");
const createInitialData = require("./helpers/createInitialData");
const fs = require("fs");
const { format } = require("date-fns");

async function mongoConnect() {
  try {
    await mongoose.connect(process.env.MONGO_URL);
    console.log("MongoDB Connected");
    createInitialData();
  } catch (err) {
    console.error("Failed to connect to MongoDB", err);
    process.exit(1); // Exit the process if unable to connect to MongoDB
  }
}

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

// **** Error Logger **** //
app.use((req, res, next) => {
  const fileName = `./logs/log_${moment().format("YYYY_MM_DD")}.txt`;
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
          console.error("Failed to write log:", err);
        }
      });
    }
  });
  next();
});
// **** Error Logger **** //

app.use(userRouter);
app.use(authRouter);
app.use(cardRouter);
app.use(express.static("public"));
app.use("*", (req, res) => {
  res.status(404).json({ error: "Sorry, page not found 404" });
});

const startServer = async () => {
  await mongoConnect();
  app.listen(process.env.PORT, () => {
    console.log(`Server is listening on port ${process.env.PORT}`);
  });
};

startServer();
