#!/usr/bin/env bash
SCRIPT_DIR=`dirname "$0"`
ROOT_DIR=$SCRIPT_DIR/..

docker build -f $SCRIPT_DIR/Dockerfile.runtime -t sandtank-ml $ROOT_DIR