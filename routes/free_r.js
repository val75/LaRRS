/*
 * free_r.js - Routing for free table
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
    Free  = require( '../models/free'  ),
    Asset = require( '../models/asset' ),

    checkAssetStatusByName,
    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS -------------------
checkAssetStatusByName = function ( hostname ) {
    console.log('Running checkAssetStatusByName');

    Asset.findOne( { 'hostname' : hostname }, function ( err, asset ) {
        if (err) {
            console.log('Error finding asset by hostname: ' + err);
            return false;
        }

        else if ( asset.status != 'Healthy' ) {
            console.log('Asset status for %s not Healthy, but %s', asset.hostname, asset.status);
            return false;
        }

        else
            return true;
    })
};
//------------------- END UTILITY METHODS ---------------------

//------------------- BEGIN PUBLIC METHODS -------------------
configRoutes = function (app, router) {

    // REGISTER ROUTES

    // Middleware to check asset hostname exists if request is a POST (add asset to Free collection)
    router.use( '/free', function (req, res, next) {
        if (req.method == 'POST') {
            if (!checkAssetStatusByName(req.body.hostname)) {
                res.json( { messsage: "Found problems with asset while adding to Free table" } );
            } else {
                next();
            }
        } else {
            next();
        }
    });

    // ========== Routes that end in /free ==========
    router.route('/free')

        // Mark an asset as free and add it to the free table
        // accessed at POST http://localhost:<port>/api/free
        .post(function (req, res) {
            var free_asset = new Free();

            free_asset.asset = req.body.asset;

            free_asset.hostname = req.body.hostname;

            free_asset.sku = req.body.sku;

            free_asset.vendor = req.body.vendor;

            free_asset.location = req.body.location;

            free_asset.group = req.body.group;

            free_asset.save( function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message: 'Asset added to free table!' } );
            })

        })

        // Get all the free assets
        // accessed at GET http://localhost:<port>/api/free
        // Because we're using express-mquery, this accommodates search queries with '?'
        .get(function (req, res) {
            Free
                .mquery(req)
                .exec(function (err, free) {
                    if (err)
                        res.send(err);
                    else
                        res.json(free);
                });
        });

    // ========== Routes that end in /free/:free_id ==========
    router.route('/free/:free_id')

        // Get the free asset with that free_id
        // accessed at GET http://localhost:<port>/api/free/:free_id
        .get(function (req, res) {
            Free.findById(req.params.free_id, function (err, free_asset) {
                if (err)
                    res.send(err);
                else
                    res.json(free_asset);
            });
        })

        // Delete the asset with this free_id from free assets table
        // accessed at DELETE http://localhost:<port>/api/free/:free_id
        .delete(function (req, res) {
            Free.remove({
                _id: req.params.free_id
            }, function (err) {
                if (err)
                    res.send(err);
                else
                    res.json( { message: 'Asset successfully removed from free list' } );
                }
            )
        });

};

module.exports = { configRoutes : configRoutes };

//------------------- END PUBLIC METHODS ---------------------