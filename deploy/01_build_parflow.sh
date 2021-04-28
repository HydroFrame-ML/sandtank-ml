#!/bin/bash

## You may need the following set of packages
# sudo apt-get install \
#   libcurl4 gfortran libopenblas-dev liblapack-dev  openmpi-bin libopenmpi-dev tcl-dev tk-dev

SCRIPT_DIR=`dirname "$0"`

cmake \
  -G "Unix Makefiles" \
  -S $SCRIPT_DIR/src \
  -B $SCRIPT_DIR/build \
  -D BUILD_TESTING=OFF \
  -D PARFLOW_ENABLE_SIMULATOR=OFF \
  -D PARFLOW_ENABLE_TOOLS=OFF \
  -D PARFLOW_ENABLE_DOCKER=ON

cd $SCRIPT_DIR/build
make DockerBuildRuntime
