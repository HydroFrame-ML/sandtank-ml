# Deploy sandtank-ml

The following scripts build up the docker images that can be used for deploying sandtank-ml.

```
./deploy/00_fetch_parflow.sh
./deploy/01_build_parflow.sh
./deploy/02_docker_web.sh
./deploy/02_docker_runtime.sh
```

Ideally, after running those you should have the `sandtank-ml` image available to you.
From here you can run the following command to start the server on port 9000 (all websockets etc are passed through here).

```
# Customize these
PORT=9000
SERVER_NAME=`localhost:$PORT`
DATA=`$PWD/data`
PROTOCOL=ws

docker run --rm \
  -it \
  -p ${PORT}:80 \
  -e SERVER_NAME=${SERVER_NAME} \
  -e PROTOCOL=${PROTOCOL} \
  -v ${DATA}:/opt/sandtank-ml/data \
  sandtank-ml
```
# Details

## ./00_fetch_parflow.sh

We grab parflow from github.

## ./01_build_parflow.sh

Build the docker images of the Parflow repo. The `parflow-runtime` image will be our base image for creating our docker image.

## ./02_docker_web.sh

This steps takes the web client of our repo and build it into `sandtank-ml-web`.

## ./03_docker_runtime.sh

This script build on top of `parflow-runtime` the following set of steps:
  - Install all the Web and AI dependencies
  - Copy built web application from `sandtank-ml-web`
  - Copy helper scripts for ParaViewWeb/Launcher deployement (from github.com/hydroframe/SandTank/tree/master/docker/web)
  - Copy server files from current repo
  - Auto start the service

## ./04_publish_image.sh

Once building those images locally, you may want to publish your local version of `sandtank-ml` to a public image `hydroframe/sandtank:ml`.