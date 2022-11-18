const _ = require("lodash");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const express = require("express");
const app = express();

// app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/fadDB");

const factSchema = { num: String, fact: String };

const Fact = mongoose.model("Fact", factSchema);

app
  .route("/facts")
  .get((req, res) => {
    Fact.find((err, facts) => {
      res.send(!err ? facts : err);
    });
  })
  .post((req, res) => {
    const title = req.body.num;
    const content = req.body.fact;
    const fact = new Fact({ num: title, fact: content });
    fact.save((err) => res.send(!err ? "Successfully posted!" : err));
  })
  .delete((req, res) => {
    Fact.deleteMany((err) => res.send(!err ? "Successfully deleted!" : err));
  });

app
  .route("/facts/:fact")
  .get((req, res) => {
    const param = _.words(_.capitalize(req.params.fact));
    Fact.findOne({ num: `${param[0]} #${param[1]}` }, (err, fact) => {
      res.send(fact ? fact : "Not found.");
    });
  })
  .put((req, res) => {
    const param = _.words(_.capitalize(req.params.fact));
    Fact.replaceOne(
      { num: `${param[0]} #${param[1]}` },
      { num: req.body.num, fact: req.body.fact },
      (err, result) => res.send(!err ? result : err)
    );
  })
  .patch((req, res) => {
    const param = _.words(_.capitalize(req.params.fact));
    Fact.updateOne(
      { num: `${param[0]} #${param[1]}` },
      { $set: req.body },
      (err, result) => res.send(!err ? result : err)
    );
  })
  .delete((req, res) => {
    const param = _.words(_.capitalize(req.params.fact));
    Fact.deleteOne({ num: `${param[0]} #${param[1]}` }, (err) =>
      res.send(!err ? "Successfully deleted!" : err)
    );
  });

app.listen(3000, () => {
  console.log(`App listening on port 3000`);
});
