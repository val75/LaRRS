/*
 * free.js - Mongoose model for free assets table
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
    mongoose = require ('mongoose'),
    Schema = mongoose.Schema,

    FreeSchema = new Schema ({
        asset_tag: { type: String },
        hostname: { type: String },
        sku: { type: String },
        vendor: { type: String },
        location: { type: String },
        group: { type: String }
    });

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

module.exports = mongoose.model('Free', FreeSchema);

//------------------- END PUBLIC METHODS ---------------------