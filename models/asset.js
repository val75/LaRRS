var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AssetSchema = new Schema ({
    asset_id: String,
    reserved : Boolean
});