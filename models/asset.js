var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssetSchema = new Schema ({
    tag: String,
    location: String,
    group: String,
    reserved: Boolean
});

module.exports = mongoose.model('Asset', AssetSchema);