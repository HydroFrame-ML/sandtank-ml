#!/usr/bin/env bash

SCRIPT_DIR=`dirname "$0"`

cmake \
  -G Ninja \
  -S $SCRIPT_DIR/parflow/src \
  -B $SCRIPT_DIR/parflow/build \
  -D BUILD_TESTING=OFF \
  -D PARFLOW_ENABLE_SIMULATOR=OFF \
  -D PARFLOW_ENABLE_TOOLS=OFF \
  -D PARFLOW_ENABLE_DOCKER=ON

cmake \
  --build $SCRIPT_DIR/parflow/build \
  --target DockerBuildRuntime
