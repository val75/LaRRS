/*
 * status_r.js - Routing for asset status
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
    Status = require( '../models/status' ),

    configRoutes;

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function ( app, router ) {

    // REGISTER ROUTES

    // ========== Routes that end in /skus ==========
    router.route('/status')

    // Create/add new asset status
    // accessed at POST http://localhost:<port>/api/status
        .post( function (req, res) {
            var status = new Status();

            status.name = req.body.name;

            status.notes = req.body.notes;

            // save status and check for errors
            status.save( function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message : 'New status added.' } );
            })
        })

        // Get all possible asset status names
        // accessed at GET http://localhost:<port>/api/status
        // Because we're using express-mquery, this accommodates search queries with '?'
        .get( function (req, res) {
            Status
                .mquery(req)
                .exec( function (err, status ) {
                    if (err)
                        res.send(err);
                    else
                        res.json(status);
                });
        });

    // ========== Routes that end in /status/:status_id ==========
    router.route('/status/:status_id')

        // Get the status with this id
        // accessed at GET http://localhost:<port>/api/status/:status_id
        .get( function (req, res) {
            Status.findById(req.params.status_id, function (err, status) {
                if (err)
                    res.send(err);
                else
                    res.json(status);
            });
        })

        // Update the status with this id
        // accessed at PUT http://localhost:<port>/api/status/:status_id
        .put( function (req, res) {
            Status.findById(req.params.status_id, function (err, status) {
                if (err)
                    res.send(err);
                else {
                    if (req.body.name)
                        status.name = req.body.name;

                    if (req.body.notes)
                        status.notes = req.body.notes;

                    status.save( function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json( { message : 'Status record updated.' } );
                    });
                }
            });
        })

        // Delete the status with this id
        // accessed at DELETE http://localhost:<port>/api/status/:status_id
        .delete( function (req, res) {
            Status.remove({
                _id: req.params.status_id
            }, function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message : 'Status record successfully deleted.' } );
            });
        });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------