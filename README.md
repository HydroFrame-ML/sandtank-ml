# sandtank-ml

SandTank-ML provide an application for learning and seeing how ML behave compared to a physic based simulator such as ParFlow.

# Running the application

## Pre-requisit

In order to run this application you will need to have [Docker](https://docs.docker.com/get-docker/) installed along with a set of pre-trained ML models that have been stored in a google drive under __Hydroframe-ML > Sandtank-ML > data__.

## Running docker

```
# Customize these
PORT=9000
SERVER_NAME="localhost:${PORT}"
DATA=/path_to_gdrive_content/
PROTOCOL=ws

docker run --rm \
  -it \
  -p ${PORT}:80 \
  -e SERVER_NAME=${SERVER_NAME} \
  -e PROTOCOL=${PROTOCOL} \
  -v ${DATA}:/opt/sandtank-ml/data \
  hydroframe/sandtank:ml
```
