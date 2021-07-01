const express = require("express");
const path = require("path");
const sequelize = require("./config/connection");
const routes = require("./controllers");
const exphbs = require("express-handlebars");
const session = require("express-session");
const SequelizeStore = require("connect-session-sequelize")(session.Store);
const helpers = require("./utils/helpers");

const app = express();
const PORT = process.env.PORT || 3001;

const sess = {
  secret: "You can't see me! I'm a secret",
  //Sets the expiration of the cookie to be 5 minutes
  cookie: { maxAge: 60000 * 5 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize }),
  rolling: true,
};

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "/public")));
app.use(session(sess));

const hbs = exphbs.create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(routes);

sequelize.sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
});
