const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    name: String,
    email: String,
    password: String,
    address: {
      street: String,
      city: String,
      state: String,
      country: String,
      zip: String
    }
},{
    versionKey : false
});

const UserModel = mongoose.model("user",userSchema);

module.exports={
    UserModel
}