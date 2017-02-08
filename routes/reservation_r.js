/*
 * reservation_r.js - Routing for reservations
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
    Reservation = require( '../models/reservations' ),
    Asset       = require( '../models/asset'        ),

    assetRecord, reservationRecord,
    configRoutes;

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function (app, router) {

    // Middleware to check asset status for reservation POST requests
    router.use( '/reservations', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware -> reservation POST: check asset status');

            if (!req.body.hasOwnProperty('assetId')) {
                console.log('Reservation POST request has no assetId parameter');
                res.status(500).send('No assetId parameter in POST request');
            } else {
                Asset
                    .findById(req.body.assetId)
                    .populate('statusId')
                    .exec(function (err, asset) {
                        if (err) {
                            console.log('Error finding asset with ID %s : %s', req.body.assetId, err);
                            res.status(500).json({
                                error   : 'Error finding asset',
                                assetId : req.body.assetId
                            })
                        } else if (!asset) {
                            console.log('Could not find asset with ID ' + req.body.assetId);
                            res.status(500).json({
                                error   : 'Could not find asset',
                                assetId : req.body.assetId
                            })
                        } else {
                            if (asset.statusId.name != 'Healthy') {
                                console.log('Asset with ID %s has status %s', req.body.assetId, asset.statusId.name);
                                res.status(500).json({
                                    error   : 'Incorrect asset status',
                                    assetId : req.body.assetId,
                                    status  : asset.statusId.name
                                });
                            } else {
                                console.log('Asset with ID %s has status Healthy', req.body.assetId);
                                assetRecord = asset;
                                next();
                            }
                        }
                    });
            }
        } else
            next();
    });

    // Middleware to change asset reservation status to True for reservation POST requests
    router.use( '/reservations', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware -> reservation POST: flip true asset reservation status');

            if (assetRecord.reserved) {
                console.log('Asset is already reserved');
                res.status(404).json({
                    error: 'Asset already reserved',
                    assetId: assetRecord._id
                });
            } else {
                assetRecord.reserved = true;

                assetRecord.save(function (err) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            message: 'In flip asset reservation status middlewhere, save asset record'
                        });
                    else {
                        console.log('Asset reservation status changed to True');
                        next();
                    }
                })
            }
        } else
            next();
    });

    // Middleware to get reservation record and asset record in case reservation_id param in request
    router.param('reservation_id', function (req, res, next, id) {
        console.log('--> Middleware -> reservation_id param');

        Reservation.findById(id, function (err, reservation) {
            if (err)
                res.status(500).json({
                    error: err,
                    message: 'In reservation_id middleware, finding reservation'
                });
            else if (req.method == 'DELETE') {
                Asset.findById(reservation.assetId, function (err, asset) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            message: 'In reservation_id middleware, finding asset'
                        });
                    else {
                        assetRecord = asset;
                        next();
                    }
                });
            } else {
                reservationRecord = reservation;
                next();
            }
        });
    });

    // REGISTER ROUTES

    // ========== Routes that end in /reservations ==========
    router.route('/reservations')

        // Create a reservation
        // accessed at POST http://localhost:<port>/api/reservations
        .post(function (req, res) {

            var reservation = new Reservation();

            reservation.assetId = req.body.assetId;

            reservation.user = req.body.user;

            if (req.body.start_time)
                reservation.start_time = req.body.start_time;

            if (req.body.end_time)
                reservation.end_time = req.body.end_time;

            // save the reservation record and check for errors
            reservation.save(function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message: 'New asset reservation created' } );
            });
        })

        // Get all reservation records
        // accessed at GET http://localhost:<port>/api/reservations
        // Because we're using express-mquery, this accommodates search queries with '?'
        .get(function (req, res) {
            Reservation
                .mquery(req)
                .populate('assetId', 'hostname')
                .exec(function (err, reservations) {
                    if (err)
                        res.status(500).json({
                            error: err,
                            message: 'In GET reservation record(s).'
                        });
                    else
                        res.json(reservations)
                });
        });


    // ========== Routes that end in /reservations/:reservation_id ==========
    router.route('/reservations/:reservation_id')

        // Get the reservation with that id
        // accessed at GET http://localhost:8080/api/reservations/:reservation_id
        .get(function (req, res) {
            //console.log('=== In GET ' + JSON.stringify(reservationRecord));
            /*Reservation.findById(req.params.reservation_id, function (err, reservation) {
                if (err)
                    res.send(err);
                else
                    res.json(reservation);
            });*/
            res.json(reservationRecord);
        })

        // Update the reservation with this id
        // accessed at PUT http://localhost:<port>/api/reservations/:reservation_id
        .put(function (req, res) {
            /*Reservation.findById(req.params.reservation_id, function (err, reservation) {
                if (err)
                    res.send(err);
                else {
                    // Update user
                    reservation.user = req.body.user;

                    // Save the reservation
                    reservation.save(function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json( { message: 'Reservation updated!' } );
                    })
                }
            });*/
            if (req.body.user)
                reservationRecord.user = req.body.user;

            if (req.body.end_time)
                reservationRecord.end_time = req.body.end_time;

            // Update the reservation record
            reservationRecord.save(function (err) {
                if (err)
                    res.status(500).json({
                        error: err,
                        message: 'In reservation PUT'
                    });
                else
                    res.json( { message: 'Reservation record updated' } );
            })
        })

        // Delete the reservation with this id
        // accessed at DELETE http://localhost:<port>/api/reservations/:reservation_id
        .delete(function (req, res) {

            assetRecord.reserved = false;

            assetRecord.save(function (err) {
                if (err)
                    res.status(500).json({
                        error: err,
                        message: 'During delete reservation, update asset reserved status.'
                    });
                else {
                    console.log('Asset reservation status changed to True');

                    Reservation.remove({
                        _id: req.params.reservation_id
                    }, function (err, reservation) {
                        if (err)
                            res.status(500).json({
                                error: err,
                                message: 'During delete reservation, remove reservation record.'
                            });
                        else
                            res.json( { message: 'Successfully deleted!' } );
                    });
                }
            });
        });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------