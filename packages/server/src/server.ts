import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { generateKeyPair } from "./services/crypto.ts";
import {
  contractListner,
  getPrivote,
} from "./services/smart-contract/contract.ts";
import { encryptVote, getResults, publishResults } from "./services/voting.ts";
dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
const port = 3001;

const { subscribe, unsubscribe } = contractListner();

app.get("/gen-keys", (_, res) => {
  console.log("Generating key pair");
  const keyPair = generateKeyPair();
  const keyPairString = {
    publicKey: keyPair.publicKey.toString(),
    privateKey: keyPair.privateKey.toString(),
  };
  res.json(keyPairString).status(200);
});

app.post("/encrypt-vote", async (req, res) => {
  console.log(req.body);
  const { vote } = req.body;
  console.log("Encrypting vote", vote);
  const response = await encryptVote(vote);

  res.json(response).status(200);
});

app.get("/privote/:id", async (req, res) => {
  const privoteId = req.params.id;
  const privote = await getPrivote(parseInt(privoteId));

  if (!privote) {
    res.status(404).send("Privote not found");
  }

  res.json(privote).status(200);
});

app.get("/publish-results/:id", async (req, res) => {
  console.log("Publishing results");
  const privoteId = req.params.id;
  await publishResults(privoteId);
  res.status(200).send("Results published");
});

app.get("/results", async (req, res) => {
  const { id } = req.body;
  return await getResults(id);
});

app
  .listen(port, () => {
    subscribe();
    console.log("rnnn");
    console.log(`Server is running on http://localhost:${port}`);
  })
  .on("error", (err) => {
    if (unsubscribe) {
      unsubscribe();
    }
    console.error(err);
  });
