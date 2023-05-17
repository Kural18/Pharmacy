const express = require("express");
const bodyParser = require("body-parser");
const date = require(__dirname + "/date.js");
const mongoose = require("mongoose");
const app = express();

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb://localhost:27017/medicineDB", {useNewUrlParser: true});

const itemsSchema = {
  name: String,
  quantity: String,
  price: String
};

const Item = mongoose.model("Item", itemsSchema);

const item1 = new Item({
  name: "Parecetomol",
  quantity: "1250",
  price: "10"
});

const item2 = new Item({
  name: "Parecetomol",
  quantity: "1200",
  price: "10"
});

const item3 = new Item({
  name: "Parecetomol",
  quantity: "120",
  price: "100"
});

const defaultItems = [item1, item2, item3];

app.get("/", function(req, res) {

  Item.find({}, function(err, foundItems){

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function(err){
        if (err) {
          console.log(err);
        } else {
          console.log("Successfully savevd default items to DB.");
        }
      });
      res.redirect("/");
    } else {
      res.render("list", {listTitle: "Pharmacy Management System", newListItems: foundItems});
    }
  });

});

app.get('/add',function(req,res){
  res.render("addnew");
})

app.post("/", function(req, res){

  const item = req.body.newItem;
  const quant = req.body.quant;
  const price = req.body.price;

  const itemnew = new Item({
    name: item,
    quantity: quant,
    price: price
  });

  itemnew.save();
    res.redirect("/");
});


app.post("/delete", function(req,res){
  const checkedItemId = req.body.checkbox;
  Item.findByIdAndRemove(checkedItemId, function(err){
    if (!err) {
      console.log("Successfully deleted checked item.");
      res.redirect("/");
    }
  });
});

let checkedItemIdUpdate;
app.post("/update", function(req,res){
  checkedItemIdUpdate = req.body.checkbox2;
  Item.findOne({_id:checkedItemIdUpdate},function(err,user){
    if(!err){
      res.render("update",{user: user});
    }
  });
});

app.post("/last", function(req,res){
  const item = req.body.newItem;
  const quant = req.body.quant;
  const price = req.body.price;
  Item.updateOne({_id:checkedItemIdUpdate}, {name: item, quantity: quant, price: price}, function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
});

app.listen(3000, function() {
  console.log("Server started on port 3000");
});
