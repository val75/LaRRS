/*
 * api_root_r.js - Routing for API root
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
    configRoutes;

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS -------------------
//------------------- END UTILITY METHODS ---------------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function ( app, router ) {

    router.get( '/', function (req, res) {
        res.json( { message: 'You have reached LaRRS API.' } );
    });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------