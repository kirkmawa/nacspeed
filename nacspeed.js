var ini = require ("node-ini");
var radius = require ("node-radius");
var fs = require("fs");
var zpad = require ("zpad");
var strftime = require ("strftime");
var Tail = require ("node-tail").Tail;
var dgram = require ("dgram");


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
function nacese (line) {
	// This is tab-delimited, we need to split this string
	var fields = line.split("\t");
	if (fields[5] == "AUTH_MAC_PAP") {
		console.log (fields[2] + " " + fields[8]);
	}
}

// Construct and send RADIUS accounting packet
function sendRadiusLogin (username, framedip) {
	var packet = radius.encode({
	  code: "Accounting-Request",
	  secret: nsini.nacspeed.radius_ss,
	  attributes: [
		['User-Name', username],
		['Framed-IP-Address', framedip]
	  ]
	});	
	
	var client = dgram.createSocket("udp4");
	client.bind(49001);
	
	client.send(packet, 0, packet.length, 1813, nsini.nacspeed.lsip);
	client.close();
	
}



var logfile = findLatestFile (nsini.nacspeed.nsroot);

tail = new Tail(logfile);

tail.on("line", function(data) {
  nacese (data);
});


