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
    http       = require( 'http'        ),
    express    = require( 'express'     ),
    morgan     = require( 'morgan'      ),
    bodyParser = require( 'body-parser' ),
    mongoose   = require( 'mongoose'    ),

    app        = express(),
    router     = express.Router(),

    Bear       = require( './models/bear'),

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
// all of our routes will be prefixed with /api
app.use( '/api', router);

// define the root directory for static files as <current_directory>/public
app.use( express.static( __dirname + '/public' ) );

router.use( function ( req, res, next ) {
    // do logging
    console.log( 'Something is happening.' );
    // make sure we go to the next routes and don't stop here
    next();
});

router.get( '/', function ( req, res ) {
    res.json( { message: 'hooray! welcome to our api!' } );
});

// Routes for our API will happen here

// routes that end in /bears
router.route('/bears')

    // create a bear (accessed at POST http://localhost:<port>/api/bears)
    .post(function (req, res) {
        var bear = new Bear();      // create a new instance of the Bear model
        bear.name = req.body.name;  // set the bear's name (comes from the request)

        // save the bear and check for errors
        bear.save(function (err) {
            if (err)
                res.send(err);

            res.json( { message: 'Bear created!' } );
        });
    })

    // get all the bears (accessed at GET http://localhost:<port>/api/bears)
    .get(function (req, res) {
        Bear.find(function (err, bears) {
            if (err)
                res.send(err);

            res.json(bears);
        });
    });

// routes that end in /bears/:bear_id
router.route('/bears/:bear_id')

    // get the bear with that id (accessed at GET http://localhost:8080/api/bears/:bear_id)
    .get(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err)
                res.send(err);
            res.json(bear);
        });
    })

    // update the bear with this id (accessed at PUT http://localhost:<port>/api/bears/:bear_id)
    .put(function (req, res) {
        Bear.findById(req.params.bear_id, function (err, bear) {
            if (err)
                res.send(err);

            bear.name = req.body.name; // update the bear's info

            // save the bear
            bear.save(function (err) {
                if (err)
                    res.send(err)

                res.json( { message: 'Bear updated!' } );
            });
        });
    })

    // delete the bear with this id (accessed at DELETE http://localhost:<port>/api/bears/:bear_id)
    .delete(function (req, res) {
        //console.log('bear_id: ', req.params.bear_id);
        Bear.remove({
            _id: req.params.bear_id
        }, function (err, bear) {
            if (err)
                res.send(err)

            res.json( { message: 'Successfully deleted!' } );
        });
    });

//app.get( '/', function ( request, response ) {
//    response.redirect( '/larrs.html' );
//});

//------------------ END SERVER CONFIGURATION ----------------

//--------------------- BEGIN START SERVER -------------------
server.listen( 3000 );
console.log(
    'Express server listening on port %d in %s mode',
    server.address().port, app.settings.env
);
