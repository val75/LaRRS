/*
 * sku_r.js - Routing for asset SKUs
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
    Sku = require( '../models/sku' ),

    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function ( app, router ) {

    // REGISTER ROUTES

    // ========== Routes that end in /skus ==========
    router.route('/skus')

        // Create/add new asset SKU
        // accessed at POST http://localhost:<port>/api/skus
        .post( function (req, res) {
            var sku = new Sku();

            sku.name = req.body.name;

            sku.notes = req.body.notes;

            // save SKU and check for errors
            sku.save( function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message : 'New SKU added.' } );
            })
        })

        // Get all asset SKUs
        // accessed at GET http://localhost:<port>/api/skus
        // Because we're using express-mquery, this accommodates search queries with '?'
        .get( function (req, res) {
            Sku
                .mquery(req)
                .exec( function (err, skus ) {
                    if (err)
                        res.send(err);
                    else
                        res.json(skus);
                });
        });

    // ========== Routes that end in /skus/:sku_id ==========
    router.route('/skus/:sku_id')

    // Get the SKUs with this id
    // accessed at GET http://localhost:<port>/api/skus/:sku_id
        .get( function (req, res) {
            Sku.findById(req.params.sku_id, function (err, sku) {
                if (err)
                    res.send(err);
                else
                    res.json(sku);
            });
        })

        // Update the SKU with this id
        // accessed at PUT http://localhost:<port>/api/skus/:sku_id
        .put( function (req, res) {
            Sku.findById(req.params.sku_id, function (err, sku) {
                if (err)
                    res.send(err);
                else {
                    if (req.body.name)
                        sku.name = req.body.name;

                    if (req.body.notes)
                        sku.notes = req.body.notes;

                    sku.save( function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json( { message : 'SKU updated.' } );
                    });
                }
            });
        })

        // Delete the SKU with this id
        // accessed at DELETE http://localhost:<port>/api/skus/:sku_id
        .delete( function (req, res) {
            Sku.remove({
                _id: req.params.sku_id
            }, function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message : 'SKU successfully deleted.' } );
            });
        });

};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------