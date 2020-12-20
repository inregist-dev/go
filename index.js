const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' https://unpkg.com"
  );
  next();
});
app.use(express.static("./public"));

app.get("/:id", (req, res) => {
  const { id } = req.params;
  res.redirect(
    id === "wow" ? "http://localhost:4000/wow" : "https://google.com"
  );
});

app.post("/url", (req, res) => {
  const { url, slug } = req.body;
  console.log("url\t", url, "\nslug\t", slug);
  if (url.includes(`${req.get("host")}/${slug}`)) {
    res.status(400).json({ message: "loop not allow" });
    return;
  }

  res.json({ message: `${req.protocol}://${req.get("host")}/${slug}` });
});

app.listen(4000, () => console.log("app is on port 4000"));
