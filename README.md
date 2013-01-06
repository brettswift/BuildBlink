Build Blink
====================
Uses [ThingM.com](http://thingm.com/)'s  [blink(1)](http://blink1.thingm.com/) product as a continuous integration build light. 


[![Build Status](https://travis-ci.org/brettswift/BuildBlink.png)](https://travis-ci.org/brettswift/BuildBlink)


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

Supported CI servers: 
----------------------
* TeamCity
* TBD
    * Jenkins
    * Travis CI 

Story Wall
-----------
Private story wall is used to track features:  
[Trello.com story wall (private)]("https://trello.com/board/buildblinker/50e8b74c70aad4fc050025bc")
