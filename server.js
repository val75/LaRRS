/*
 * app.js - Simple Express server with logging
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
    http       = require( 'http'          ),
    express    = require( 'express'       ),
    //routes     = require( './lib/routes'  ),
    routes     = require( './lib/routes_a' ),
    morgan     = require( 'morgan'        ),
    bodyParser = require( 'body-parser'   ),
    mongoose   = require( 'mongoose'      ),

    app        = express(),
    router     = express.Router(),

    //Bear       = require( './models/bear' ),
    Asset      = require( './models/asset' ),

    server     = http.createServer( app );

//----------------- END MODULE SCOPE VARIABLES ---------------

//----------------- BEGIN SERVER CONFIGURATION ---------------

mongoose.connect('mongodb://localhost/test');

app.use( morgan('combined') );

// Configure app to use bodyParser()
// this will let us get the data from a POST
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

// Register our routes
routes.configRoutes( app, router, Asset );

// define the root directory for static files as <current_directory>/public
app.use( express.static( __dirname + '/public' ) );

//------------------ END SERVER CONFIGURATION ----------------

//--------------------- BEGIN START SERVER -------------------
server.listen( 3000 );
console.log(
    'Express server listening on port %d in %s mode',
    server.address().port, app.settings.env
);
