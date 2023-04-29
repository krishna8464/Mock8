const mongoose = require("mongoose");

const menuSchema = mongoose.Schema({
    name: String,
    description: String,
    price: Number,
    image: String,
    hotelid : String,
  },{
    versionKey : false
});

const MenuModel = mongoose.model("menuitems",menuSchema);

module.exports={
    MenuModel
}