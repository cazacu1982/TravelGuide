var mongoose =require('mongoose');

var profileSchema = mongoose.Schema({
    profile: {
        name: String,
        country: String,
        region: String,
        date: String,
        title: String,
        comment: String
    }
});

module.exports = mongoose.model('Profile', profileSchema);