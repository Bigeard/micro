const express = require("express");
const axios = require("axios");
const bodyparser = require("body-parser");
const crypto = require("crypto");

const app = express();
app.use(bodyparser.json());
const port = 3000;
let key = {};

// Fonction lancée eu démarrage du service
const start = async () => {
  // http://10.44.17.33:1338/grid
  // Envoie d'une requete
  let response;
  try {
    response = await axios.post(
      "http://10.44.17.33:1338/register",
      { code: "robin.bigeard", host: "http://10.44.17.250:3000" },
      { auth: { username: "ynovset", password: "tHuds4752_525@" } }
    );
  } catch (e) {
    console.error(e.response ? e.response.data : e);
    return;
  }
  // console.log(response.data);
  key = response.data;
  console.log("Hello");
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
  console.log(response_register.data);

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
  try {
    response_unlock = await axios.post(
      "http://10.44.17.33:1338/key/unlock",
      { code, key: response_register.data.encrypted_public_key },
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
