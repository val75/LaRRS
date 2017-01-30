/*
 * manufacturer_r.js - Routing for asset manufacturers
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
    Manufacturer = require ('../models/manufacturer' ),

    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function ( app, router ) {

    // REGISTER ROUTES

    // ========== Routes that end in /manufacturers ==========
    router.route('/manufacturers')

        // Create/add new asset manufacturer
        // accessed at POST http://localhost:<port>/api/manufacturers
        .post( function (req, res) {
            var manufacturer = new Manufacturer();

            manufacturer.name = req.body.name;

            manufacturer.notes = req.body.notes;

            // save manufacturer and check for errors
            manufacturer.save( function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message : 'New manufacturer added' } );
            })
        })

        // Get all asset manufacturers
        // accessed at GET http://localhost:<port>/api/manufacturers
        // Because we're using express-mquery, this accommodates search queries with '?'
        .get( function (req, res) {
            Manufacturer
                .mquery(req)
                .exec( function (err, manufacturers ) {
                    if (err)
                        res.send(err);
                    else
                        res.json(manufacturers);
                });
        });

    // ========== Routes that end in /manufacturers/:manufacturer_id ==========
    router.route('/manufacturers/:manufacturer_id')

        // Get the manufacturer with this id
        // accessed at GET http://localhost:<port>/api/manufacturer/:manufacturer_id
        .get( function (req, res) {
            Manufacturer.findById(req.params.manufacturer_id, function (err, manufacturer) {
                if (err)
                    res.send(err);
                else
                    res.json(manufacturer);
            });
        })

        // Update the manufacturer with this id
        // accessed at PUT http://localhost:<port>/api/manufacturer/:manufacturer_id
        .put( function (req, res) {
            Manufacturer.findById(req.params.manufacturer_id, function (err, manufacturer) {
                if (err)
                    res.send(err);
                else {
                    if (req.body.name)
                        manufacturer.name = req.body.name;

                    if (req.body.notes)
                        manufacturer.notes = req.body.notes;

                    manufacturer.save( function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json( { message : 'Manufacturer updated.' } );
                    });
                }
            });
        })

        // Delete the manufacturer with this id
        // accessed at DELETE http://localhost:<port>/api/manufacturer/:manufacturer_id
        .delete( function (req, res) {
            Manufacturer.remove({
                _id: req.params.manufacturer_id
            }, function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message : 'Manufacturer successfully deleted.' } );
            });
        });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------