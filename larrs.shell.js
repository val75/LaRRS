/*
 * larrs.shell.js
 * Shell module for LaRRS
 */

/*jslint        node    : true, continue : true,
 devel  : true, indent  : 2,    maxerr   : 50,
 newcap : true, nomen   : true, plusplus : true,
 regexp : true, sloppy  : true, vars     : false,
 white  : true
 */
/*global larrs */

larrs.shell = (function () {
    //---------------- BEGIN MODULE SCOPE VARIABLES --------------
    var
        Group = require('./models/group'),

        defaultGroup,
        initModule;
    //----------------- END MODULE SCOPE VARIABLES ---------------

    //------------------- BEGIN PUBLIC METHODS -------------------

    // Begin public method initModule
    initModule = function () {
        console.log('Initializing LaRRS Shell module');

        defaultGroup = new Group( { name: 'DefaultGroup', notes: 'This is the default group' } );

        defaultGroup.save(function (err) {
            if (err)
                return console.log('Error creating default group: ' + err);
        })
    };

    module.exports = { initModule: initModule };
    //------------------- END PUBLIC METHODS ---------------------
}());