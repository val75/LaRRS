/*
 * reservations.js - Mongoose model for asset reservation
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
    mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    ReservationSchema = new Schema ({
        asset_tag: { type: String, required: true },
        start_time: { type: Date, required: true },
        user: { type: String, required: true }
    });

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

module.exports = mongoose.model('Reservation', ReservationSchema);

//------------------- END PUBLIC METHODS ---------------------