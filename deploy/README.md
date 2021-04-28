# Deploy sandtank-ml
The following scripts build up the docker image for deploying sandtank-ml. They are meant to be run in this directory (`deploy/`).

```
cd deploy/
./00_fetch_repo.sh
./01_build_parflow.sh
./02_dockerize_sandtank.sh
```
Ideally, after running those there should be a sandtank server running on port 9000 (all websockets etc are passed through here).

To do so you can run the following commands:

```
# Customize these
PORT=9000
SERVER_NAME="localhost:${PORT}"
DATA="$(pwd)"/../data
PROTOCOL="ws" #Switch to "wss" if serving over https

docker run --rm \
  -it \
  -p ${PORT}:80 \
  -e SERVER_NAME=${SERVER_NAME} \
  -e PROTOCOL=${PROTOCOL} \
  -v ${DATA}:/opt/sandtank-ml/data \
  sandtank-ml
```
# Details

## ./00_fetch_repo.sh
We grab parflow from github.

## ./01_build_parflow.sh
Parflow has docker images for its development and runtime environments, which we depend on. This builds those images.

## ./02_dockerize_sandtank.sh
Our docker image wraps our sandtank server with a launcher + apache server. We build the web client for apache to serve, and wire launcher up to our server. The configurations for each of those, and a script from pvw_web to make things easier, are here in `deploy/config/`. They are largely copied from github.com/hydroframe/SandTank/tree/master/docker/web.