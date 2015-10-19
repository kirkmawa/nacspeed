nacspeed
========
##### A utility to send Extreme Networks' NAC authentications to Lightspeed

This tool is for districts that have Active Directory and NAC. It will format user names (or look up the UPN) for users that authenticate to NAC and send the RADIUS accounting information to Lightspeed.

Extreme has a similar utility called OpenFabric Connect that does pretty much the same thing. The only problem is, it makes no effort to look up AD information on your users and you don't have many options to filter out messages from the NAC end-system log. (For example, in my district I have a separate SSID for machine cert authentication and all those are sent to Lightspeed.)

### Prerequisites
- Python 3.x
- pyrad 2.0 [link](https://pypi.python.org/pypi/pyrad)
- pysqlite [link](https://github.com/ghaering/pysqlite)
- python-ldap [link](https://pypi.python.org/pypi/python-ldap/)