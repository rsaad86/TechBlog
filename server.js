//Import libraries
import express, { json, urlencoded, static } from "express";
import { join } from "path";
import sequelize, { sync } from "./config/connection";
import routes from "./controllers";
import { create } from "express-handlebars";
import session, { Store } from "express-session";
const SequelizeStore = require("connect-session-sequelize")(Store);
import helpers from "./utils/helpers";

const app = express();
const PORT = process.env.PORT || 3001;

const sessions = {
  secret: "You can't see me, I am a secret!",
  //Sets the expiration of the cookie
  cookie: { maxAge: 60000 * 5 },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({ db: sequelize }),
  rolling: true,
};

app.use(session(sessions));

const hbs = create({ helpers });
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");

app.use(json());
app.use(urlencoded({ extended: true }));

app.use(static(join(__dirname, "/public")));

app.use(routes);

sync({ force: false }).then(() => {
  app.listen(PORT, () => console.log(`App is listening on port: ${PORT}`));
});
