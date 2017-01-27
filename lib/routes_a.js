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
    mongoose = require('mongoose'),
    Asset = require('../models/asset'),
    Group = require('../models/group'),

    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------
configRoutes = function ( app, router ) {

    // Middleware to use for all requests
    router.use( function (req, res, next) {
        // do logging
        console.log( 'Running API middleware.' );
        // make sure we go to the next routes and don't stop here
        next();
    });

    // Test route to make sure everything is working
    // accessed at GET http://localhost:<port>/api
    router.get( '/', function ( req, res ) {
        res.json( { message: 'You have reached LaRRS API.' } );
    });

    // REGISTER ROUTES

    // All of our routes will be prefixed with /api
    app.use( '/api', router);

    // ========== Routes that end in /assets ==========
    router.route('/assets')

        // Create an asset
        // accessed at POST http://localhost:<port>/api/assets
        .post(function (req, res) {
            var defaultGroupId;
            var asset = new Asset();  // create a new instance of the Asset model
            asset.tag = req.body.tag;  // set the asset tag (comes from the request)
            //asset.location = ( req.body.location ) ? req.body.location : 'DefaultLocation'; // set the asset location (comes from the request)
            //asset.group = 'DefaultGroup'; // set the asset group to DefaultGroup
            //asset.reserved = false;  // set the asset reserved to default / false

            // save the asset and check for errors
            asset.save(function (err) {
                if (err)
                    res.send(err);

                Asset.find({})
                    .populate('group')
                    .exec( function (err, assets) {
                        if (err)
                            res.send(err);

                        console.log(JSON.stringify(assets, null, "\t"))
                    });

                res.json( { message: 'Asset created!' } );
            });
        })

        // Get all the assets
        // accessed at GET http://localhost:<port>/api/assets
        .get(function (req, res) {
            Asset.find(function (err, assets) {
                if (err)
                    res.send(err);

                res.json(assets);
            });
        });

    // ========== Routes that end in /asset/:asset_id ==========
    router.route('/assets/:asset_id')

        // Get the asset with that id
        // accessed at GET http://localhost:8080/api/assets/:asset_id
        .get(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);
                res.json(asset);
            });
        })

        // Update the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.tag = req.body.tag; // update the asset tag

                // save the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err)

                    res.json( { message: 'Asset updated!' } );
                });
            });
        })

        // Delete the asset with this id
        // accessed at DELETE http://localhost:<port>/api/asset/:asset_id
        .delete(function (req, res) {
            Asset.remove({
                _id: req.params.asset_id
            }, function (err, asset) {
                if (err)
                    res.send(err)

                res.json( { message: 'Successfully deleted!' } );
            });
        });

    // ========== Routes that end in /asset/tag/:asset_tag ==========
    router.route('/assets/tag/:asset_tag')

        .get(function (req, res) {
            Asset.findOne( { tag : req.params.asset_tag }, function (err, asset) {
                if (err)
                    res.send(err);

                res.json(asset);
            });
        });


};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------