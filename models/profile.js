var mongoose = require('mongoose');

var profileSchema = mongoose.Schema({
    name: String,
    country: String,
    region: String,
    date: String,
    title: String,
    comment: String,
    votes: {type: Number, default: 0},
    images: []
});

module.exports = mongoose.model('Profile', profileSchema);