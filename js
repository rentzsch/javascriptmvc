#!/bin/sh
# This script checks for arguments, if they don't exist it opens the Rhino dialog
# if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
# ie: js jmvc/script/controller Todo

echo ${#}

#for %%a in (%2 %3 %4 %5 %6 %7) do (
#	if not "%%a"=="" SET ARGS=!ARGS!'%%a',
#)