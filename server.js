const express = require("express");
const MongoClient = require("mongodb").MongoClient;
const cors = require("cors");
const ObjectID = require("mongodb").ObjectID;
const dotenv = require("dotenv").config();

console.log(dotenv.parsed);
const app = express();
app.use(cors());

app.use(express.json());
let database;

app.get("/", (req, res) => {
  res.send("worked");
});

app.get("/crud", (req, resp) => {
  database
    .collection("Crud")
    .find()
    .toArray((err, result) => {
      if (err) throw err;
      resp.send(result);
    });
});

app.post("/crud", (req, resp) => {
  const person = req.body;
  database
    .collection("Crud")
    .insertOne(person)
    .then((result) => {
      resp.status(201).json(result);
    });
});

app.delete("/crud/:id", (req, res) => {
  const deleteId = ObjectID(req.params.id);
  database.collection("Crud").deleteOne({ _id: deleteId }, (err, result) => {
    if (err) throw err;
    res.send("deleted");
  });
});

app.put("/crud/:id", (req, res) => {
  const updateId = req.params.id;
  database
    .collection("Crud")
    .updateOne(
      { _id: ObjectID(updateId) },
      { $set: req.body },
      (err, result) => {
        if (err) throw err;
        res.send("updated");
      }
    );
});

app.listen(process.env.PORT, () => {
  MongoClient.connect(
    process.env.MONGODB_URI,
    { useNewUrlParser: true },
    (err, result) => {
      if (err) throw err;
      database = result.db("crud");
      console.log("connected");
    }
  );
});
