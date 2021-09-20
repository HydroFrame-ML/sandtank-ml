#!/bin/env bash
SCRIPT_DIR=`dirname "$0"`
ROOT_DIR=$SCRIPT_DIR/..

docker run  -it \
  -p 9000:80 \
  -v $ROOT_DIR/data:/data \
  -v $ROOT_DIR/public/glossary:/opt/sandtank-ml/www/glossary \
  sandtank-ml

