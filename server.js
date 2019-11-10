const express = require("express");
const connectDb = require("./config/db");
const bodyParser = require("body-parser");
var cors = require("cors");
const path = require("path");
const app = express();

// BodyParser Middlewares

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

app.use(cors());

// init middleware
app.use(express.json({ extended: false }));

//connect mongo database
connectDb();

//server static assets in production
if (process.env.NODE_ENV === "production") {
  // Set static folder
  app.use(express.static("client/build"));

  app.get("*", (req, res) =>
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"))
  );
}

app.use("/api/users", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/contact", require("./routes/contacts"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`server is started on ${PORT} port`));
