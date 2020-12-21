require("dotenv").config();
const { Firestore } = require("@google-cloud/firestore");
const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const morgan = require("morgan");
const yup = require("yup");
const { customAlphabet, urlAlphabet } = require("nanoid");
nanoid = customAlphabet(urlAlphabet, 5);

const urlSchema = yup
  .string()
  .matches(
    /^(https?:\/\/)?(www.)?[a-z0-9]+([\-\.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/,
    "invalid url"
  );

const app = express();
app.use(helmet());
app.use(morgan("tiny"));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const firestore = new Firestore();
let go;
(async () => {
  go = await firestore.collection("go");
})();

app.use(function (req, res, next) {
  res.setHeader(
    "Content-Security-Policy",
    "script-src 'self' 'unsafe-inline' https://unpkg.com"
  );
  next();
});
app.use(express.static("./public"));

app.get("/:id", async (req, res) => {
  const { id } = req.params;
  const { url } = (await go.doc(id).get()).data() || { url: undefined };
  if (url) res.redirect(/https?:\/\//.test(url) ? url : `http://${url}`);
  else res.redirect("/?LinkNotFound");
});

app.post("/url", async (req, res) => {
  const { url, id } = req.body;

  const isValidUrl = await urlSchema
    .validate(url)
    .catch((err) => console.log("errs:", err.errors));

  if (!isValidUrl) {
    res.status(400).json({ err: "invalid url" });
    return;
  }

  console.log("url\t", url, "\nid\t", id);
  if (url.includes(`${req.get("host")}/${id}`)) {
    res.status(400).json({ err: "loop not allow" });
    return;
  }

  const slug = id || nanoid(5);

  // check exist
  const doc = await go.doc(slug).get();
  if (!doc.data()) {
    await go.doc(slug).set({ url });
    res.json({ message: `${req.get("host")}/${slug}` });
  } else {
    res.json({ err: `custom link already exist` });
  }
});

const { PORT } = process.env;
app.listen(PORT || 5000, () => console.log(`app is on port ${PORT || 5000}`));
