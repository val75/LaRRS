/*
 * free_assets.js - Mongoose model for free assets table
 */

/*jslint        node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global */

//---------------- BEGIN MODULE SCOPE VARIABLES --------------
'use strict';

var
    mquery   = require ( 'express-mquery' ),
    mongoose = require ( 'mongoose'       ),

    Schema = mongoose.Schema,

    FreeAssetsSchema = new Schema ({
        assetId:        { type: Schema.Types.ObjectId, ref: 'Asset',        required: true },
        skuId:          { type: Schema.Types.ObjectId, ref: 'Sku',          required: true },
        locationId:     { type: Schema.Types.ObjectId, ref: 'Location',     required: true },
        manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
        groupId:        { type: Schema.Types.ObjectId, ref: 'Group',        required: true }
    });

//----------------- END MODULE SCOPE VARIABLES ---------------

//----------------- BEGIN MODULE CONFIGURATION ---------------

// Plugin express-mquery to mongoose
mongoose.plugin(mquery.plugin);

//------------------ END MODULE CONFIGURATION ----------------

//------------------- BEGIN PUBLIC METHODS -------------------

module.exports = mongoose.model('FreeAsset', FreeAssetsSchema);

//------------------- END PUBLIC METHODS ---------------------