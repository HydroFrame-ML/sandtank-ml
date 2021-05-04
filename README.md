# sandtank-ml

SandTank-ML provide an application for learning and seeing how ML behave compared to a physic based simulator such as ParFlow.

# Running the application

## Pre-requisit

In order to run this application you will need to have [Docker](https://docs.docker.com/get-docker/) installed along with a set of pre-trained ML models that have been stored in a google drive under __Hydroframe-ML > Sandtank-ML > data__.

## Running docker

```
# Customize these
PORT=9000
DATA=/path_to_gdrive_content/

docker run --rm \
  -it \
  -p ${PORT}:80 \
  -v ${DATA}:/data \
  hydroframe/sandtank:ml
```

## Using the application

Just point your browser to `$SERVER_NAME`

Then to choose a given `lesson plan` (json file in your `$DATA` directory), just provide the name of the file without the extension in the URL.

For example `http://localhost:9000/?name=dropout`.

## Creating a lesson plan

For that you will have to create a `json` file in your `$DATA` directory following the structure below:

```
# configure the UI to match your expectation
ui:
  time: [-1, 5],
  moduleSelector:
    show: true,
    values:
      - selection
      - prediction
      - diff
      - stats
    diffScaling:
      show: true
      value: 0.5
      min: 0.1
      step: 0.1
      max: 1
    useGradient: // FIXME saturation/pressure toggle
      show: true
      value: true

# set of parameters to selection a trained model
uriPattern: ${model}://models/${training}-${learningRate}-${dropOut}-${epoch}.out
order:
  - model
  - training
  - learningRate
  - dropOut
  - epoch
parameters:
  model:
    label: Model type
    items:
      - { "text": "Pressure", "value": "RegressionPressure" }
  training:
    label: Learning set
    items:
      - { "text": "All", "value": "full" }
      - { "text": "Wet", "value": "wet" }
      - { "text": "Dry", "value": "dry" }
  learningRate:
    label: Learning Rate
    items:
      - { "text": "0.0001", "value": "lr4" }
  dropOut:
    label: Use drop out
    items:
      - { "text": "No", "value": "ndp" }
  epoch:
    label: Number of trainings
    items:
      - { "value": "e1", "text": "One time" }
```

# Developer gotchas
## Use ?dev query param
When running a development environment (eg with `npm run serve` and `python server/server.py ...`), you will have to add ?dev to the URL (eg `http://localhost:8080/?dev&name=dropout`). This configures the client to look for ports differently than with the docker setup. The client will not connect otherwise
