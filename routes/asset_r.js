/*
 * asset_r.js - Routing for assets
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
    Asset = require('../models/asset'),
    Group = require('../models/group'),
    Location = require('../models/locations'),

    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS -------------------
//------------------- END UTILITY METHODS ---------------------

//------------------- BEGIN PUBLIC METHODS -------------------
configRoutes = function ( app, router ) {

    router.use( '/assets', function (req, res, next) {
        //console.log('Method: ' + req.method );
        if (req.method == 'POST')
            if (!(req.body.hasOwnProperty('tag')) && !(req.body.hasOwnProperty('hostname')))
                console.log('POST has no tag or hostname property');
        next();
    });

    // Middleware to check group name and replace with group_id for POST requests
    router.use('/assets', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware: checking group for asset POST');

            if (!req.body.hasOwnProperty('group')) {
                console.log('Asset POST request has no group parameter');
                res.status(500).send('No group parameter in POST request');
            } else {
                Group.findOne( { 'name' : req.body.group }, function (err, group) {
                    if (err) {
                        console.log('Error finding group %s : %s', req.body.group, err);
                        res.status(500).send('Problem finding group ' + req.body.group);
                    } else {
                        req.group_id = group._id;
                        next();
                    }
                });
            }
        } else
            next();
    });

    // Middleware to check location and replace with location_id for POST requests
    router.use('/assets', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware: checking location for asset POST');

            if (!req.body.hasOwnProperty('location')) {
                console.log('Asset POST request has no location parameter');
                res.status(500).send('No location parameter in POST request');
            } else {
                Location.findOne( { 'name' : req.body.location }, function (err, location) {
                    if (err) {
                        console.log('Error finding location %s : %s', req.body.location, err);
                        res.status(500).send('Error finding location ' + req.body.location);
                    } else if (!location) {
                        console.log('Could not find location ' + req.body.location);
                        res.status(500).send('Could not find location ' + req.body.location);
                    } else {
                        req.location_id = location._id;
                        next();
                    }
                });
            }
        } else
            next();
    });

    // REGISTER ROUTES

    // ========== Routes that end in /assets ==========
    router.route('/assets')

    // Create an asset
    // accessed at POST http://localhost:<port>/api/assets
        .post(function (req, res) {
            var asset = new Asset();  // create a new instance of the Asset model

            // Set the asset tag (comes from the request)
            asset.tag = req.body.tag;

            // Set the hostname (comes from the request)
            asset.hostname = req.body.hostname;

            // Set the SKU (comes from the request)
            asset.sku = req.body.sku;

            // Set the vendor (comes from the request)
            asset.vendor = req.body.vendor;

            // Set asset location (comes from the request)
            asset.locationId = req.location_id;

            // Set the asset group ID (comes from the request)
            asset.groupId = req.group_id;

            // save the asset and check for errors
            asset.save(function (err) {
                if (err)
                    res.send(err);

                else
                    res.json( { message: 'Asset created!' } );

            });
        })

        // Get all the assets
        // accessed at GET http://localhost:<port>/api/assets
        // Because we're using express-mquery, this accommodates search queries with '?'
        .get(function (req, res) {
            Asset
                .mquery(req)
                .populate('groupId locationId', 'name')
                .exec(function (err, assets) {
                    if (err)
                        res.send(err);
                    else
                        res.json(assets);
                });
        });


    // ========== Routes that end in /assets/:asset_id ==========
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

        // Delete the asset with this id
        // accessed at DELETE http://localhost:<port>/api/asset/:asset_id
        .delete(function (req, res) {
            Asset.remove({
                _id: req.params.asset_id
            }, function (err) {
                if (err)
                    res.send(err);

                res.json( { message: 'Successfully deleted!' } );
            });
        });

    // ========== Routes that end in /assets/:asset_id/location/:location ==========
    router.route('/assets/:asset_id/location/:location')

        // Update the location of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/location/:location
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.location = req.params.location;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json( { message: 'Asset location updated' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/status/:status ==========
    router.route('/assets/:asset_id/status/:status')

        // Update the status of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/status/:status
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.status = req.params.status;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json( { message: 'Asset status updated' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/hostname/:hostname ==========
    router.route('/assets/:asset_id/hostname/:hostname')

        // Update the hostname of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/hostname/:hostname
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.hostname = req.params.hostname;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json( { message: 'Asset hostname updated' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/groupId/:groupId ==========
    router.route('/assets/:asset_id/groupId/:groupId')

        // Update the groupId of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/groupId/:groupId
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.groupId = req.params.groupId;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json( { message: 'Asset groupId updated' } );
                });
            });
        });

};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------