#!/usr/bin/env bash

SCRIPT_DIR=`dirname "$0"`

mkdir -p $SCRIPT_DIR/parflow
cd $SCRIPT_DIR/parflow
git clone https://github.com/parflow/parflow.git src
