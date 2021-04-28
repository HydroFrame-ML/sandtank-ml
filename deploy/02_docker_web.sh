#!/usr/bin/env bash
SCRIPT_DIR=`dirname "$0"`
ROOT_DIR=$SCRIPT_DIR/..

docker build -f $SCRIPT_DIR/Dockerfile.web -t sandtank-ml-web $ROOT_DIR
