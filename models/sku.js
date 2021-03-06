/*
 * sku.js - Mongoose model for asset SKU
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

    SkuSchema = new Schema ({
        name:    { type: String, required: true },
        hwmodel: { type: String                 },
        notes:   { type: String                 }
    });

//----------------- END MODULE SCOPE VARIABLES ---------------

//----------------- BEGIN MODULE CONFIGURATION ---------------

// Plugin express-mquery to mongoose
mongoose.plugin(mquery.plugin);

//------------------ END MODULE CONFIGURATION ----------------

//------------------- BEGIN PUBLIC METHODS -------------------

module.exports = mongoose.model( 'Sku', SkuSchema );

//------------------- END PUBLIC METHODS ---------------------