#This script relies on the Mac tool to be running.   
#Confirm by putting this uri in your browser: http://localhost:8934/blink1/pattern/

#brokenBuild
curl 'http://localhost:8934/blink1/pattern/add?pname=policeFlash&pattern=10,%230000FF,0.5,%23FF0000,0.5'

#buildingFromRed
curl 'http://localhost:8934/blink1/pattern/add?pname=buildingFromRed&pattern=4,%23990000,0.5,%23FFCC00,2'

#buildingFromGreen
curl 'http://localhost:8934/blink1/pattern/add?pname=buildingFromGreen&pattern=10,%23009900,0.5,%23FFCC00,2'

#successfulBuild
curl 'http://localhost:8934/blink1/pattern/add?pname=successfulBuild&pattern=10,%23000000,0.5,%2300FF00,0.5'

