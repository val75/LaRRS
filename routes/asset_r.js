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
    Asset        = require( '../models/asset'        ),
    Group        = require( '../models/group'        ),
    Location     = require( '../models/locations'    ),
    Manufacturer = require( '../models/manufacturer' ),
    Sku          = require( '../models/sku'          ),
    Status       = require( '../models/status'       ),

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

    // Middleware to check manufacturer and replace with manufacturer_id for POST requests
    router.use('/assets', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware: checking manufacturer for asset POST');

            if(!req.body.hasOwnProperty('manufacturer')) {
                console.log('Asset POST request has no manufacturer parameter');
                res.status(500).send('No manufacturer parameter in POST request');
            } else {
                Manufacturer.findOne( { 'name' : req.body.manufacturer }, function (err, manufacturer) {
                    if (err) {
                        console.log('Error finding manufacturer %s : %s', req.body.manufacturer, err);
                        res.status(500).send('Error finding manufacturer ' + req.body.manufacturer);
                    } else if (!manufacturer) {
                        console.log('Could not find manufacturer ' + req.body.manufacturer);
                        res.status(500).send('Could not find manufacturer ' + req.body.manufacturer);
                    } else {
                        req.manufacturer_id = manufacturer._id;
                        next();
                    }
                });
            }
        } else {
            next();
        }
    });

    // Middleware to check SKU and replace with sku_id for POST requests
    router.use('/assets', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware: checking SKU for asset POST');

            if(!req.body.hasOwnProperty('sku')) {
                console.log('Asset POST request has no sku parameter');
                res.status(500).send('No sku parameter in POST request');
            } else {
                Sku.findOne( { 'name' : req.body.sku }, function (err, sku) {
                    if (err) {
                        console.log('Error finding SKU %s : %s', req.body.sku, err);
                        res.status(500).send('Error finding SKU ' + req.body.sku);
                    } else if (!sku) {
                        console.log('Could not find SKU ' + req.body.sku);
                        res.status(500).send('Could not find SKU ' + req.body.sku);
                    } else {
                        req.sku_id = sku._id;
                        next();
                    }
                });
            }
        } else {
            next();
        }
    });

    // Middleware to check status and replace with status_id for POST requests
    router.use('/assets', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware: checking status for asset POST');

            if(!req.body.hasOwnProperty('status')) {
                console.log('Asset POST request has no status parameter, defaulting to Maintenance');
                Status.findOne( { 'name' : 'Maintenance' }, function (err, status_rec) {
                    if (err) {
                        console.log('Error finding Maintenance status record: ' + err);
                        res.status(500).send('Error finding Maintenance status record');
                    } else if (!status_rec) {
                        console.log('Could not find Maintenance status record');
                        res.status(500).send('Could not find Maintenance status record');
                    } else {
                        req.status_id = status_rec._id;
                        next();
                    }
                });
            } else {
                Status.findOne( { 'name' : req.body.status }, function (err, status_rec) {
                    if (err) {
                        console.log('Error finding status record %s : %s', req.body.status, err);
                        res.status(500).send('Error finding status record ' + req.body.status);
                    } else if (!status_rec) {
                        console.log('Could not find status record ' + req.body.status);
                        res.status(500).send('Could not find SKU ' + req.body.status);
                    } else {
                        req.status_id = status_rec._id;
                        next();
                    }
                });
            }
        } else {
            next();
        }
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

            // Set the SKU Id (comes from the request)
            asset.sku = req.sku_id;

            // Set the asset manufacturer Id (comes from the request)
            asset.manufacturerId = req.manufacturer_id;

            // Set asset location Id (comes from the request)
            asset.locationId = req.location_id;

            // Set the asset group ID (comes from the request)
            asset.groupId = req.group_id;

            // Set the asset status ID (comes from the request, or defaults to Maintenance)
            asset.statusId = req.status_id;

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
                .populate('groupId locationId manufacturerId skuId statusId', 'name')
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

                res.json( { message: 'Asset successfully deleted!' } );
            });
        });

    // ========== Routes that end in /assets/:asset_id/location/:locationId ==========
    router.route('/assets/:asset_id/location/:location_id')

        // Update the location ID of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/location/:location_id
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.locationId = req.params.location_id;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json( { message: 'Asset location updated.' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/manufacturer/:manufacturerId ==========
    router.route('/assets/:asset_id/manufacturer/:manufacturer_id')

        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.manufacturerId = req.params.manufacturer_id;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json({message: 'Asset manufacturer updated.'});
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/sku/:skuId ==========
    router.route('/assets/:asset_id/sku/:sku_id')

        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.skuId = req.params.sku_id;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json({message: 'Asset SKU updated.'});
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
                        res.json( { message: 'Asset hostname updated.' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/groupId/:groupId ==========
    router.route('/assets/:asset_id/group/:groupId')

        // Update the groupId of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/group/:groupId
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
                        res.json( { message: 'Asset group updated.' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/status/:statusId ==========
    router.route('/assets/:asset_id/status/:statusId')

        // Update the statusId of the asset with this id
        // accessed at PUT http://localhost:<port>/api/assets/:asset_id/status/:statusId
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);

                asset.statusId = req.params.statusId;

                // update the asset
                asset.save(function (err) {
                    if (err)
                        res.send(err);
                    else
                        res.json( { message: 'Asset status updated.' } );
                });
            });
        });

    // ========== Routes that end in /assets/:asset_id/remove/:property_to_remove ==========
    router.route('/assets/:asset_id/remove/:property_to_remove')
        .put(function (req, res) {
            Asset.findById(req.params.asset_id, function (err, asset) {
                if (err)
                    res.send(err);
                else {
                    // Need to send 'strict' to false, otherwise not allowed
                    // to set fields that are not in the schema anymore
                    asset.set( req.params.property_to_remove, undefined, { strict: false} );

                    // update the asset
                    asset.save(function (err) {
                        if (err)
                            res.send(err);
                        else
                            res.json( { message: 'Asset updated.' } );
                    });
                }
            })
        });
};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------