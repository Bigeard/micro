const express = require("express");
const axios = require("axios");
const bodyparser = require("body-parser");
const crypto = require("crypto");


const names_data = [
  "abderahimmalick.assimmahamat",
  "florian.aubin",
  "bastien.aubry",
  "romain.axilais",
  "nicolas.baca",
  "valentin.baudry",
  "robin.bigeard",
  "simon.billet",
  "clemence.bitaud",
  "axel.borget",
  "alexis.brohan",
  "killian.cambert",
  "geoffrey.clermont",
  "alexis.coinet",
  "martin.danvers",
  "marceau.david",
  "mael.debon",
  "jeremie.delecrin",
  "medi.demirdelen",
  "quentin.duchesne",
  "mael.fournier",
  "joris.gallot",
  "simon.galoyan",
  "alexandre.garault",
  "marius.gaudin",
  "marie.gautron",
  "arthur.geay",
  "guillaume.gouy",
  "valentin.guibert",
  "antonin.joulie",
  "abdellah.jrondi",
  "auriane.labille",
  "maxime.preard",
  "yessi.yessiymunguengui",
  "abdellatif.elmaknati",
];

const map = [
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,1,1,1,1,1,0,0,0,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,1,1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,1,1,0,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
 [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0],
]
console.log(names_data.length);
console.log(map.length);

console.log(process.env.PORT);
console.log(process.env.NAME);

const app = express();
// app.use(bodyparser.json());
const port = process.env.PORT;
let key = {};

// Fonction lancée eu démarrage du service
const start = async () => {
  // http://10.44.17.33:1338/grid
  // Envoie d'une requete
  let response;
  try {
    response = await axios.post(
      "http://10.44.17.33:1338/register",
      { code: process.env.NAME, host: "http://10.44.17.250:"+port },
      { auth: { username: "ynovset", password: "tHuds4752_525@" } }
    );
  } catch (e) {
    console.error(e.response ? e.response.data : e);
    return;
  }
  // console.log(response.data);
  key = response.data;

  getMicro();
};

const getMicro = async () => {
  // Envoie d'une requete récupération micro
  let response_register;
  try {
    response_register = await axios.get("http://10.44.17.33:1338/registry", {
      headers: { "x-auth-token": key.token },
    });
  } catch (e) {
    console.error(e.response ? e.response.data : e);
    return;
  }
  // console.log(response_register.data);

  if (response_register.data) {
    loopMicro(response_register.data);
  }
};

const loopMicro = async (micro) => {
  await Promise.all(
    micro.map(async (e) => {
      validateMicro(e);
    })
  );
  // loopMicro(micro);
};

const validateMicro = async ({ host, code }) => {
  let response_register;
  try {
    response_register = await axios.get(host + "/getKey", {
      headers: { "x-auth-token": key.token },
    });
  } catch (e) {
    console.error(e.response ? e.response.data : e);
    return;
  }
  // console.log(response_register.data);
  let response_unlock;


  let encrypted_public_key = response_register.data.encrypted_public_key

  const x = names_data.indexOf(code)
  const y = names_data.indexOf(process.env.NAME)
  if (map[y][x]) {
    encrypted_public_key = "sqsqfqsdfqsfqsf"
  }

  try {
    response_unlock = await axios.post(
      "http://10.44.17.33:1338/key/unlock",
      { code, key: encrypted_public_key },
      {
        headers: { "x-auth-token": key.token },
      }
    );
  } catch (e) {
    console.error(e.response ? e.response.data : e);
    return;
  }
  // console.log(response_unlock.data);
};

app.get("/ping", async (req, res) => {
  res.sendStatus(200);
});

// Création d'un endpoint en GET
app.get("/getkey", async (req, res) => {
  // Récuperer les headers
  const token = req.headers["x-auth-token"];
  if (!token) {
    return res.status(400).send("Salut BG <3 !!!!!!!!!!!!!!!!!!");
  }

  // Envoie d'une requete check token
  let response_token;
  try {
    response_token = await axios.post(
      "http://10.44.17.33:1338/token/validate",
      { token },
      {
        headers: { "x-auth-token": key.token },
      }
    );
  } catch (e) {
    if (e.response.status === 500) {
      return res.status(500).send("Salut BG <3 !!!!!!!!!!!!!!!!!!");
    } else if (e.response.status === 403) {
      return res.status(403).send("Salut BG <3 !!!!!!!!!!!!!!!!!!");
    }
    return res.status(502).send("Salut BG <3 !!!!!!!!!!!!!!!!!!");
  }
  // console.log(response_token.data);
  if (!response_token.data.valid) {
    return res.status(403).send("Salut BG <3 !!!!!!!!!!!!!!!!!!");
  }
  let sec = encrypt(key.secret_key, key.public_key);
  return res.status(200).json({ encrypted_public_key: sec });
});

// Création d'un endpoint en POST
app.post("/newservice", async (req, res) => {
  // console.log(req.body);
  validateMicro(req.body);
});

// Lancement du service
app.listen(port, () => {
  console.log(`Service listening at http://localhost:${port}`);
  start();
});

/**
 * Fonction de chiffrement
 * @param secretKey
 * @param publicKey
 * @returns {string}
 */
function encrypt(secretKey, publicKey) {
  return crypto.createHmac("sha256", secretKey).update(publicKey).digest("hex");
}
