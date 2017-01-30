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
    Reservation = require('../models/reservations'),

    configRoutes;

//----------------- END MODULE SCOPE VARIABLES ---------------


//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function (app, router) {

    // Middleware to use for all requests
    router.use( function (req, res, next) {
        // do logging
        console.log( 'Running API middleware.' );
        // make sure we go to the next routes and don't stop here
        next();
    });

    // REGISTER ROUTES

    // ========== Routes that end in /reservations ==========
    router.route('/reservations')

        // Create a reservation
        // accessed at POST http://localhost:<port>/api/reservations
        .post(function (req, res) {

        });


    // ========== Routes that end in /reservations/:reservation_id ==========
    router.route('/reservations/:reservation_id')

        // Get the reservation with that id
        // accessed at GET http://localhost:8080/api/reservations/:reservation_id
        .get(function (req, res) {
            Reservation.findById(req.params.reservation_id, function (err, reservation) {
                if (err)
                    res.send(err);
                res.json(reservation);
            });
        })

        // Update the reservation with this id
        // accessed at PUT http://localhost:<port>/api/reservations/:reservation_id
        .put(function (req, res) {
            Reservation.findById(req.params.reservation_id, function (err, reservation) {
                if (err)
                    res.send(err);

                // Update user
                reservation.user = req.body.user;

                // Save the reservation
                reservation.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json( { message: 'Reservation updated!' } );
                })
            });
        })

        // Delete the reservation with this id
        // accessed at DELETE http://localhost:<port>/api/reservations/:reservation_id
        .delete(function (req, res) {
            Reservation.remove({
                _id: req.params.reservation_id
            }, function (err, reservation) {
                if (err)
                    res.send(err)

                res.json( { message: 'Successfully deleted!' } );
            });
        });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------