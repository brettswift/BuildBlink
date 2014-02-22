Build Blink
====================
Uses [ThingM.com](http://thingm.com/)'s  [blink(1)](http://blink1.thingm.com/) product as a continuous integration build light. 


[![Build Status](https://travis-ci.org/brettswift/BuildBlink.png?branch=master)](https://travis-ci.org/brettswift/BuildBlink)


Features
----------
Different colour patterns can be configured.  Default configuration follows the patterns below: 

* Patterns typically blink and then hold solid (blink pattern): 
    * Successful (green)
    * Broken (flashes police colours red/blue, holds red)
    * Building
        * After a broken build (yellow / red fade)
        * After a successful build (yellow / green fade)

Currently one light can support multiple builds.  The blink pattern chosen will be of the most critical build in the pipe. 

**TBD**


Right now the desktop tool triggers BuildBlink at an express http uri.  BuildBlink hits the blink1 api to trigger a specific pattern.  The pattern has already been loaded and stored in the desktop tool. (Script included)  

This architecture is kind of cludgy, but was quick to get running and easy to test.  Eventually remove dependency on the desktop app, and not host it as a website - background process instead?



Supported CI servers: 
----------------------
* TeamCity
* TBD
    * Jenkins
    * Travis CI 
