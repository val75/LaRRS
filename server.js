/*
 * server.js - Simple Express server with logging
 */

/*jslint        node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global larrs*/

//---------------- BEGIN MODULE SCOPE VARIABLES --------------
'use strict';
var
    http       = require( 'http'          ),
    express    = require( 'express'       ),

    // Routes
    asset_r    = require( './routes/asset_r'),
    group_r    = require( './routes/group_r'),
    free_r     = require( './routes/free_r' ),
    reservation_r = require('./routes/reservation_r'),

    morgan     = require( 'morgan'         ),
    bodyParser = require( 'body-parser'    ),
    mquery     = require( 'express-mquery' ),
    mongoose   = require( 'mongoose'       ),

    app        = express(),
    router     = express.Router(),

    //Asset      = require( './models/asset' ),
    Group      = require( './models/group' ),

    server     = http.createServer( app );

//----------------- END MODULE SCOPE VARIABLES ---------------

//----------------- BEGIN SERVER CONFIGURATION ---------------

mongoose.connect('mongodb://localhost/test');

// Plugin express-mquery to mongoose
mongoose.plugin(mquery.plugin);

app.use( morgan('combined') );

// Configure app to use bodyParser()
// this will let us get the data from a POST
app.use( bodyParser.urlencoded( { extended: true } ) );
app.use( bodyParser.json() );

app.use(mquery.middleware({limit:10, maxLimit:50}));

// Register our routes
group_r.configRoutes(       app, router );
asset_r.configRoutes(       app, router );
free_r.configRoutes(        app, router );
reservation_r.configRoutes( app, router );


// Initialize default group
group_r.initGroups();

// define the root directory for static files as <current_directory>/public
app.use( express.static( __dirname + '/public' ) );

//------------------ END SERVER CONFIGURATION ----------------

//--------------------- BEGIN START SERVER -------------------
server.listen( 3000 );
console.log(
    'Express server listening on port %d in %s mode',
    server.address().port, app.settings.env
);
