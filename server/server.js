require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const http = require("http");

const app = express();
const server = http.createServer(app);

/* Configuration */
app.use(cors({ origin: [process.env.URL_CLIENT] }));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", require("./routes/authRoute"));
app.use("/api/users", require("./routes/userRoute"));

const PORT = process.env.PORT || 8080;

server.listen(PORT, () => {
    console.log('\x1b[34m%s\x1b[0m', "Listening on port " + PORT);
});
