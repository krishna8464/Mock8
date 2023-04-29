const mongoose = require("mongoose");

const orderSchema = mongoose.Schema({
    user : {},
    restaurant : {},
    items: [{
    name: String,
    price: Number,
    quantity: Number
    }],
  totalPrice: Number,
  deliveryAddress: {
    street: String,
    city: String,
    state: String,
    country: String,
    zip: String
  },
  status: String // e.g, "placed", "preparing", "on the way", "delivered"
  },{
    versionKey : false
});

const OrderModel = mongoose.model("orders",orderSchema);

module.exports={
    OrderModel
}