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
    //mongoose = require('mongoose'),
    Asset = require('../models/asset'),
    Group = require('../models/group'),

    groupIdMap = {},

    getGroupId, getGroupId1,

    configRoutes;
//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN UTILITY METHODS -------------------
getGroupId = function (name) {
    console.log('In getGroupId, looking for ' + name);

    Group.findOne( { 'name' : name }, function (err, group) {
        if (err)
            console.log('Error while looking for group: ' + err);

        else if (group == null)
            console.log('Could not find group ' + name);

        else {
            console.log('Found group with id ' + group._id);
            groupIdMap[name] = group._id;
            console.log('===' + JSON.stringify(groupIdMap));
        };
    } );
};
var findGroupId = function (name) {
    return function () {
        Group.findOne( { 'name': name }, function (err, group) {
            return group._id;
        } )
    }
};

getGroupId1 = function (name) {
    var error_code = -1;
    var return_value;

    console.log('In getGroupId1, looking for ' + name);

    Group.findOne( { 'name' : name }, function (err, group) {
        if (err) {
            console.log('Error while looking for group: ' + err);
            return function () {
                return error_code;
            };
        }

        else if (group == null) {
            console.log('Could not find group ' + name);
            return function () {
                return error_code;
            };
        }

        else {
            console.log('Found group with id ' + group._id);
            groupIdMap[name] = group._id;
            console.log('===' + JSON.stringify(groupIdMap));
            return function () {
                return group._id;
            };
        };
    });
};

var getGroupId2 = function (name) {
    var myvar = "blah";

    return function () {
        console.log('!!!' + myvar);
        groupIdMap[name] = "58465611f7d150b41990a7e6";
        return "58465611f7d150b41990a7e6";
    }
};

var getGroupId3 = function (name) {
    return function () {
        Group.findOne( { 'name' : name }, function (err, group) {
            console.log('Found group with id ' + group._id);
            groupIdMap[name] = group._id;
        });
    }
};

var isEmptyObject = function (obj) {
    for (var key in obj) {
        console.log('Key ' + key);
        if (obj.hasOwnProperty(key))
            return false;
    }

    return true;
};
//------------------- END UTILITY METHODS ---------------------

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
            var asset = new Asset();  // create a new instance of the Asset model

            // Set the asset tag (comes from the request)
            asset.tag = req.body.tag;

            // Set asset location to DefaultLocation, unless request contains location
            asset.location = ( req.body.location ) ? req.body.location : 'DefaultLocation';

            // Set the asset group ID (comes from the request)
            asset.group = req.body.group;

            // save the asset and check for errors
            asset.save(function (err) {
                if (err)
                    res.send(err);

                else
                    res.json( { message: 'Asset created!' } );

                //Asset.find({})
                //    .populate('group')
                //    .exec( function (err, assets) {
                //        if (err)
                //            res.send(err);

                 //       console.log(JSON.stringify(assets, null, "\t"))
                 //   });
            });
        })

        // Get all the assets
        // accessed at GET http://localhost:<port>/api/assets
        .get(function (req, res) {
            Asset
                .mquery(req)
                .populate('groupId')
                .exec(function (err, assets) {
                    if (err)
                        res.send(err)
                    else
                        res.json(assets)
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