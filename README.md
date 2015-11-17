nacspeed
========
##### A utility to send Extreme Networks' NAC authentications to Lightspeed

This tool is for districts that have NAC in conjunction with another 802.1x network not 
associated with the NAC. It will send NAC authentications to the RADIUS accounting 
server on the Rocket.

Extreme has a similar utility called OFConnect that does pretty much the same 
thing. The only problem is, you don't have any options to filter out messages from the NAC 
end-system log. (For example, in my district, I have a separate SSID for machine cert 
authentication and all those are sent to Lightspeed.) This overwrites the username reported
by the user agent on the machine with host/computername.fqdn.example.net, which is bad.

### Prerequisites
- Node.js 0.8.0

### Instructions
Make sure Node.js is installed on your NetSight server and ideally included in your PATH.
Then download the latest release zip or `git clone` the repo to your machine. Rename 
config-start.ini to config.ini and edit to suit your environment. Then run `node nacspeed.js` 
and watch the magic happen. All dependencies are included in the nacspeed package, so there 
is no extra installation necessary.

### Acknowledgements
- Includes [node-ini](https://github.com/pastorbones/node-ini) by Roger Mayfield (MIT license)
- Includes [node-radius](https://github.com/retailnext/node-radius) by Nearbuy Systems (BSD license)
- Includes [node-tail](https://github.com/lucagrulla/node-tail) by Luca Grulla (MIT license)
- Includes [zpad](https://github.com/Daiz/zpad) (public domain)
- Includes [strftime](https://github.com/samsonjs/strftime) by Sami Samhuri (MIT license)
- Includes [watch](https://github.com/mikeal/watch) by Mikeal Rogers (Apache License)


