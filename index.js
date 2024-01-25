let express = require('express');
let port = 8005;
let app = express();
let path = require('path');
let fs = require('fs');


let session = require('express-session');
let passport = require('passport');
let passportlocal = require('./cofig/passport-local-strategy');


let mongoose = require("mongoose");
const connectionString =
  "mongodb+srv://janakkhokhar28:EyrKE75tdXWDsT2K@cluster1.01gkk0r.mongodb.net/EcommerceAdminpanel";
mongoose
  .connect(connectionString, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log("Database connected."))
  .catch((err) => console.log(err));
let catepanel = require('./model/catepanel');
const cookieParser = require('cookie-parser');


app.use(cookieParser())
app.use(session({
  name: "Rnw",
  secret: "Rnw",
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 1000 * 60 * 100
  }
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(passport.setAuthenticatedUser);

app.use(express.urlencoded());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));


app.use("/upload", express.static(path.join(__dirname, "upload")));

app.use(express.static(path.join(__dirname, "assets")));


app.use("/admin", require("./routes/admin"));

app.listen(port, function (err) {
  (err) ? console.log("something worng") : console.log("success runing code", port);
})