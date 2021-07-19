const express = require("express");
const Http = require("http");
const port = 3000;
const app = express();
const http = Http.createServer(app);
const signupRouter = require("./routers/signup");
const loginRouter = require("./routers/login");
// const authmiddleware = require("../middlewares/authmiddleware");

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use("/api", [signupRouter]);
app.use("/api", [loginRouter]);
app.set("views", __dirname + "/views");
app.set("view engine", "ejs");

app.get("/", (req, res) => {
  res.render("index");
});
app.get("/signup", (req, res) => {
  res.render("signup");
});

http.listen(port, () => {
  console.log(`Server Start Listen http://localhost:${port}`);
});
