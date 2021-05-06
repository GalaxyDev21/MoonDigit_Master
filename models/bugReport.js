const mongoose  = require("mongoose");
const Schema    = mongoose.Schema;
const moment    = require("moment");

// create schema & model
const bugSchema = new Schema({
    user: {
        type: String,
        required: [false]
    },
    date: {
        type: String,
        required: [true],
        default: String(moment().format())
    },
    message: {
        type: String,
        required: [true]
    }
});

const bugReport = module.exports = mongoose.model("bugs", userSchema);
