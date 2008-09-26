#!/bin/sh
# This script checks for arguments, if they don't exist it opens the Rhino dialog
# if arguments do exist, it loads the script in the first argument and passes the other arguments to the script
# ie: ./js jmvc/script/controller Todo

if [ $# -eq 0 ]
then
  java -jar jmvc/rhino/js.jar
  exit 127
fi

if [ $1 == "-h" -o $1 == "-?" -o $1 == "--help" ]
then
echo Load a command line Rhino JavaScript environment or run JavaScript script files in Rhino.
echo Available commands:
echo js				Opens a command line JavaScript environment
echo js [FILE]			Runs FILE in the Rhino environment

echo JavaScriptMVC script usage:
echo js jmvc/generate/app [NAME]	Creates a new JavaScriptMVC application
echo js jmvc/generate/page [APP] [PAGE]	Generates a page for the application
echo js jmvc/generate/controller [NAME]	Generates a Controller file
echo js jmvc/generate/model [TYPE] [NAME]	Generates a Model file
echo js apps/[NAME]/compress.js	Compress your application and generate documentation
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
java -jar jmvc/rhino/js.jar -e _args=$ARGS -e 'load('"'"$1"'"')'
