/*
 * asset.js - Mongoose model for assets
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
    mquery   = require( 'express-mquery' ),
    mongoose = require( 'mongoose'       ),

    Schema = mongoose.Schema,

    AssetSchema = new Schema ({
        tag:            { type: String },
        hostname:       { type: String },
        skuId:          { type: Schema.Types.ObjectId, ref: 'Sku',          required: true },
        manufacturerId: { type: Schema.Types.ObjectId, ref: 'Manufacturer', required: true },
        locationId:     { type: Schema.Types.ObjectId, ref: 'Location',     required: true },
        groupId:        { type: Schema.Types.ObjectId, ref: 'Group',        required: true },
        statusId:       { type: Schema.Types.ObjectId, ref: 'Status',       required: true },

        reserved:       { type: Boolean,               default: false,      required: true}
    });

//----------------- END MODULE SCOPE VARIABLES ---------------

//----------------- BEGIN MODULE CONFIGURATION ---------------

// Plugin express-mquery to mongoose
mongoose.plugin(mquery.plugin);

//------------------ END MODULE CONFIGURATION ----------------

//------------------- BEGIN PUBLIC METHODS -------------------

module.exports = mongoose.model('Asset', AssetSchema);

//------------------- END PUBLIC METHODS ---------------------