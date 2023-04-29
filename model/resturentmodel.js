const mongoose = require("mongoose");

const resturentSchema = mongoose.Schema({
    name: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    },
    menu: []
  },{
    versionKey : false
});

const ResturentModel = mongoose.model("resturents",resturentSchema);

module.exports={
    ResturentModel
}