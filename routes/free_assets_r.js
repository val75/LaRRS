/*
 * free_r.js - Routing for free assets table
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
    FreeAsset  = require( '../models/free_assets'  ),
    Asset      = require( '../models/asset'        ),

    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------
configRoutes = function (app, router) {

    router.use('/free_assets', function (req, res, next) {
        if (req.method == 'POST') {
            console.log('--> Middleware -> free_assets: populate for asset POST');

            if(!req.body.hasOwnProperty('assetId')) {
                console.log('FreeAsset POST request has no assetId parameter');
                res.status(500).send('No assetId parameter in POST request');
            } else {
                Asset.findById(req.params.assetId, function (err, asset) {
                    if (err) {
                        console.log('Error finding asset with ID %s : %s', req.body.assetId, err);
                        res.status(500).send('Error finding asset with ID ' + req.body.assetId);
                    } else if (!asset) {
                        console.log('Could not find asset with ID ' + req.body.assetId);
                        res.status(500).send('Could not find location with ID ' + req.body.assetId);
                    } else {
                        req.skuId = asset.skuId;
                        req.locationId = asset.locationId;
                        req.manufacturerId = asset.manufacturerId;
                        req.groupId = asset.groupId;

                        next();
                    }
                });
            }
        } else
            next();
    });

    // REGISTER ROUTES

    // ========== Routes that end in /free_assets ==========
    router.route('/free_assets')

        // Add asset to free asset table - create FreeAsset record
        // accessed at POST http://localhost:<port>/api/free_asset
        .post(function (req, res) {
            var free_asset = new FreeAsset();

            free_asset.assetId = req.body.assetId;

            free_asset.skuId = req.skuId;
            free_asset.locationId = req.locationId;
            free_asset.manufacturerId = req.manufacturerId;
            free_asset.groupId = req.groupId;

            // save the free asset record and check for errors
            free_asset.save( function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message: 'Asset added to free table.' } );
            })
        })

        // Get all assets in the free asset table
        // accessed at GET http://localhost:<port>/api/free_asset
        .get(function (req, res) {
            FreeAsset
                .mquery(req)
                .exec(function (err, free) {
                    if (err)
                        res.send(err);
                    else
                        res.json(free);
                });
        });

    // ========== Routes that end in /free_assets/:free_asset_id ==========
    router.route('/free_assets/:free_asset_id')

};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------