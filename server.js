const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const MongoClient = require("mongodb").MongoClient;

app.set("view engine", "ejs");

const PORT = 3000;
const TEMPLATES_DIR = __dirname + "/templates/";
const CONNECTION_STRING =
  "mongodb+srv://jazz:Mpower123@cluster0.czlgk.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";

// mongodb connection
MongoClient.connect(CONNECTION_STRING, { useUnifiedTopology: true })
  .then((client) => {
    console.log("Connected !!");
    const db = client.db("crud-quotes");
    const quotesCollection = db.collection("quotes");

    // Make sure you place body-parser before your CRUD handlers!
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(express.static("public"));
    app.use(bodyParser.json());

    // App handlers here...
    app.get("/", (req, res) => {
      //   response.send("Hello World");
      const cursor = quotesCollection
        .find()
        .toArray()
        .then((result) => res.render("index.ejs", { quotes: result }))
        .catch((error) => console.error(error));
      console.log(cursor);
      //   res.sendFile(TEMPLATES_DIR + "index.html");
    });

    app.post("/quotes", (req, res) => {
      //   res.send("Helllloo");
      quotesCollection
        .insertOne(req.body)
        .then((result) => {
          // console.log(result)
          res.redirect("/");
        })
        .catch((error) => console.error(error));
    });

    app.put("/quotes", (req, res) => {
      console.log(req.body);
      quotesCollection
        .findOneAndUpdate(
          { name: "Quote1 " },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then((result) => {
          res.json("Success");
        })
        .catch((error) => console.log(error));
    });

    app.delete("/quotes", (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then((result) => {
          if (result.deletedCount === 0) {
            return res.json("No quote to delete");
          }
          res.json(`Deleted Darth Vadar's quote`);
        })
        .catch((error) => console.error(error));
    });

    app.listen(PORT, function () {
      console.log("listening on 3000");
    });
  })
  .catch((error) => console.error(error));
