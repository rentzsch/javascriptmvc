#!/bin/sh
# This script checks for arguments, if they don't exist it opens the Rhino dialog
# if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
# ie: js jmvc/script/controller Todo

if [ $# -eq 0 ]
then
  java -jar jmvc/rhino/js.jar
  exit 127
fi

ARGS=[
for arg
do
  if [ $arg != $1 ]
  then
    ARGS=$ARGS"'$arg'",
  fi
done
ARGS=$ARGS]
java -jar jmvc/rhino/js.jar -e _args=$ARGS -e 'load("jmvc/scripts/controller")'
