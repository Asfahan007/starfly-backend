const mongoose = require("mongoose")

const customerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    industry: String,
    order: [
        {
            name: String,
            price: Number
        }
    ]
})

module.exports = mongoose.model('Customer', customerSchema)