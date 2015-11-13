var ini = require ("node-ini");
var radius = require ("node-radius");
var fs = require("fs");
var zpad = require ("zpad");
var strftime = require ("strftime");


// Read the config file
var nsini = ini.parseSync('./config/config.ini');

// FUNCTIONS

// Find latest file. Used at startup and when nacspeed determines the log has been rotated
// Sync function. Returns path of latest end-system event logfile.
function findLatestFile (dirpath) {
	var n = 0;
	while (n < 20) {
		n++;
		try {
			fs.statSync(dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log").isFile();
		}
		catch (err) {
			n--;
			break;
		}
	}
	return dirpath + "NetSight/appdata/logs/" + strftime("nacESE.%Y_%m_%d_") + zpad(n) + ".log";
}


// Process nacESE log file line

// Construct and send RADIUS accounting packet