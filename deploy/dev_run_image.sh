#!/bin/bash
docker run  -it \
  -p 9000:80 \
  -v $PWD/../data:/data \
  -v $PWD/../glossary:/glossary\
  hydroframe/sandtank:ml
