/*
 * routes.js - Simple Express server with logging
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

//------------------- BEGIN PUBLIC METHODS -------------------
configRoutes = function ( app, router ) {

    // Middleware to use for all requests
    router.use( function (req, res, next) {
        // do logging
        console.log( 'Something is happening.' );
        // make sure we go to the next routes and don't stop here
        next();
    });

    // Test route to make sure everything is working
    // accessed at GET http://localhost:<port>/api
    router.get( '/', function ( req, res ) {
        res.json( { message: 'hooray! welcome to our api!' } );
    });

    // REGISTER ROUTES

    // All of our routes will be prefixed with /api
    app.use( '/api', router);

    // ========== Routes that end in /bears ==========
    router.route('/bears')

    // Create a bear
    // accessed at POST http://localhost:<port>/api/bears
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

        // Get all the bears
        // accessed at GET http://localhost:<port>/api/bears
        .get(function (req, res) {
            Bear.find(function (err, bears) {
                if (err)
                    res.send(err);

                res.json(bears);
            });
        });

    // ========== Routes that end in /bears/:bear_id ==========
    router.route('/bears/:bear_id')

    // Get the bear with that id
    // accessed at GET http://localhost:8080/api/bears/:bear_id
        .get(function (req, res) {
            Bear.findById(req.params.bear_id, function (err, bear) {
                if (err)
                    res.send(err);
                res.json(bear);
            });
        })

        // Update the bear with this id
        // accessed at PUT http://localhost:<port>/api/bears/:bear_id
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

        // Delete the bear with this id
        // accessed at DELETE http://localhost:<port>/api/bears/:bear_id
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

};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------