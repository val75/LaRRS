/*
 * group_r.js - Routing for asset groups
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
    Group = require(    '../models/group'),

    defaultGroup,
    configRoutes, initGroups;

//----------------- END MODULE SCOPE VARIABLES ---------------

//------------------- BEGIN PUBLIC METHODS -------------------

configRoutes = function ( app, router ) {

    // REGISTER ROUTES

    // ========== Routes that end in /groups ==========
    router.route('/groups')

        // Create a group
        // accessed at POST http://localhost:<port>/api/groups
        .post(function (req, res) {
            var group = new Group(); // create a new instance of the Group model
            group.name = req.body.name; // set the group name (comes from the request)
            group.notes = (req.body.notes) ? req.body.notes : ''; // set the group notes

            // save the group and check for errors
            group.save(function (err) {
                if (err)
                    res.send(err);

                res.json( { message: 'Group created!' });
            });
        })

        // Get all the groups
        // accessed at GET http://localhost:<port>/api/groups
        .get(function (req, res) {
            Group
                .mquery(req)
                .exec(function (err, groups) {
                    if (err)
                        res.send(err);
                    else
                        res.json(groups);
                });
        });


    // ========== Routes that end in /groups/:group_id
    router.route('/groups/:group_id')

        // Get the group with that id
        // accessed at GET http://localhost:<port>/api/groups/:group_id
        .get(function (req, res) {
            Group.findById(req.params.group_id, function (err, group) {
                if (err)
                    res.send(err);

                res.json(group);
            });
        })

        // Update the group with this id
        // accessed at PUT http://localhost:<port>/api/groups/:group_id
        .put(function (req, res) {
            Group.findById(req.params.group_id, function (err, group) {
                if (err)
                    res.send(err);

                if (req.body.name)
                    group.name = req.body.name;

                if (req.body.notes)
                    group.notes = req.body.notes;

                group.save(function (err) {
                    if (err)
                        res.send(err);

                    res.json( { message : 'Group updated!' } );
                });
            });
        })

        // Delete the group with that id
        // accessed at DELETE http://localhost:<port>/api/groups/:group_id
        .delete(function (req, res) {
            Group.remove({
                _id: req.params.group_id
            }, function (err) {
                if (err)
                    res.send(err);

                res.json( { message: 'Group successfully deleted!' } );
            })
        });
};

initGroups = function () {
    console.log('Initializing default group');

    Group.findOne( { 'name': 'DefaultGroup' }, function (err, dgroup) {
        if (err)
            console.log('Error searching for default group: ' + err);

        else if (dgroup == null) {
            defaultGroup = new Group( { name: 'DefaultGroup', notes: 'This is the default group' } );

            defaultGroup.save(function (err) {
                if (err)
                    return console.log('Error creating default group: ' + err);
            });
        } else {
            console.log('Found DefaultGroup with _id ' + dgroup._id);
        }
    });
};

module.exports = {
    configRoutes : configRoutes,
    initGroups   : initGroups
};

//------------------- END PUBLIC METHODS ---------------------