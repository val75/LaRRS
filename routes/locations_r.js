/*
 * locations_r.js - Routing for asset locations
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
    Location = require('../models/locations'),

    configRoutes;

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function ( app, router ) {

    // REGISTER ROUTES

    // ========== Routes that end in /locations ==========
    router.route('/locations')

        // Create/add a new asset location
        // accessed at POST http://localhost:<port>/api/locations
        .post( function (req, res) {
            var location = new Location();

            location.name = req.body.name;

            location.notes = req.body.notes;

            // save the location and check for errors
            location.save( function(err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message: 'New location added' } );
            })
        })

        // Get all asset locations or query all asset locations
        // accessed at GET http://localhost:<port>/api/locations
        .get( function (req, res) {
            Location
                .mquery(req)
                .exec( function (err, locations) {
                    if (err)
                        res.send(err);
                    else
                        res.json(locations);
                });
        });

    // ========== Routes that end in /locations/:location:id ==========
    router.route('/locations/:location_id')

        // Get the location with this id
        // accessed at GET http://localhost:<port>/api/locations/:location_id
        .get(function (req, res) {
            Location.findById(req.params.location_id, function (err, location) {
                if (err)
                    res.send(err);
                else
                    res.json(location);
            });
        })

        // Update the location with this id
        // accessed at PUT http://localhost:<port>/api/locations/:location_id
        .put(function (req, res) {
            Location.findById(req.params.location_id, function (err, location) {
                if (err)
                    res.send(err);
                else {
                    if (req.body.name)
                        location.name = req.body.name;

                    if (req.body.notes)
                        location.notes = req.body.notes;

                    location.save(function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json( { message: 'Location updated' } );
                    });
                }
            });
        })

        // Delete the location with this id
        // accessed at DELETE http://localhost:<port>/api/locations/:location_id
        .delete(function (req, res) {
            Location.remove({
                _id: req.params.location_id
            }, function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message: 'Asset location successfully deleted' } );
            });
        });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------