# sandtank-ml

SandTank-ML provides an application for learning and seeing how ML behaves compared to a physics-based simulator such as ParFlow.

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

Then to choose a given `lesson plan` (json file in your `$DATA` directory), just provide the name of the file without the extension in the URL. There are sample lesson plans in a google drive under __Hydroframe-ML > Sandtank-ML > data__.

For example, after downloading`dropout.json`, point your browser to `http://localhost:9000/?name=dropout`.

## Creating a lesson plan

Lesson plans are `.json` files in your `$DATA` directory following the structure below. Samples are available in this repos /data folder.

### UI Features
Set the range of timesteps available to the simulator. (Note, -1 is for debugging purposes)
```
    "time": [-1, 5],
```
Select which charts and images are available for comparison, as well as whether to show their show/hide controls. 
```
    "moduleSelector": {
      "show": true,
      "values": ["selection", "prediction", "diff", "hist", "error", "stats"]
    },
```
Select the contrast range for the image diffing the simulation vs an ai model.
```
    "diffScaling": {
      "show": true,
      "value": 0.5,
      "min": 0.1,
      "step": 0.1,
      "max": 1
    }
```
Select whether to show pressure, or saturation, or to show a button switching betwen them.
```
    "usePressure": {
      "show": true,
      "value": false 
    }

```
Select whether to let the user add/remove models to/from the comparison. Also, set which models will appear in the comparison at startup.
```
    "addRemoveAI": {
      "show": true,
      "defaultModels": [
        { 
          "model": "RegressionPressure",
          "training":"full",
          "learningRate": "lr4",
          "dropOut":"ndp",
          "epoch":"e1"
        },

      ]
    }
```
Configure labels for permeability image. Labels might be in a legend, or overlayed on the image following the mouse. `values` supplies text to overwrite default numeric labels.
```
    "usePermeabilityLabels": {
      "showOverlay": true,
      "showLegend": true,
      "values": {
        "0": "A River",
        "1": "Sand",
        "0.6": "Compacted Sand",
        "0.05": "Dense Clay"
      }
    },
```
Configure labels for pressure or saturation images. Labels might be in a legend, or overlayed on the image following the mouse. `values` supplies text to overwrite default numeric labels.
```
    "useWaterLabels": {
      "showOverlay": true,
      "showLegend": true,
      "saturationValues": {
        "-1": "A River",
        "[-0.3, -0.7]": "Unsaturated",
        "[-0.00005, 0.5]": "Saturated"
      },
      "pressureValues": {
        "-1": "A River",
        "[-0.3, -0.7]": "Low Pressure",
        "[0.3, 0.5]": "High Pressure"
      }
    },
```
Select whether a label should follow the mouse along the diff image. Also, set label values to show instead of numbers. `values` supplies text to overwrite default numeric labels.
```
    "useDiffLabels": {
      "show": true,
      "values": {
        "0": "Accurate",
        "1": "Error"
      }
    }
```
Whether to show the button that toggles legend visibility, and the initial value for that button.
```
    "useLegend": {
      "show": true,
      "value": true
    },
```
Select whether to skip the first epoch in learning stats sets with more than one epoch. First epochs are often outliers, distoring the graph. A value can be set, or a button can be shown.
```
    "useSkipInitial" : {
      "show": true,
      "value": true
    }
```
Add guidance for Sandy Loam, our character, to give the user as they learn to use the application. Every step _must_ have a name, and some names are special. These names will highlight parts of the app, so Sandy can point to them as she explains:
- runAI 
- runSimulation
- simulationPermeability
- changeSlider
- simulationWater
- compareAIWater 
- noticeAIDiff
```
    "walkthrough": {
      "steps": [
        {
          "name": "start",
          "guidance": "If you like, I can guide you through using Sandtank ML."
        },
    }
```

### UI Features
The application will look for files in your $DATA directory corresponding to the uri pattern. That pattern is filled by your parameters, which will be shown in your specified order. 
```
  "uriPattern": "${model}://${training}-${learningRate}-${dropOut}-${epoch}.out"
  "order": ["model", "training", "learningRate", "dropOut", "epoch"],
  "parameters": {
    "model": {
      "label": "Model",
      "items": [{ "text": "Pressure", "value": "RegressionPressure" }]
    },
    "training": {
      "label": "Learning set",
      "items": [
        { "text": "All", "value": "full" },
        { "text": "Wet", "value": "wet" },
        { "text": "Dry", "value": "dry" }
      ]
    },
    "learningRate": {
      "label": "Learning Rate",
      "items": [
        { "text": "0.0001", "value": "lr4" }
      ]
    },
    "dropOut": {
      "label": "Use drop out",
      "items": [
        { "text": "No", "value": "ndp" }
      ]
    },
    "epoch": {
      "label": "Number of trainings",
      "items": [
        { "value": "e1", "text": "One time" }
      ]
    }
```

# Developer gotchas
## Use ?dev query param
When running a development environment (eg with `npm run serve` and `python server/server.py ...`), you will have to add ?dev to the URL (eg `http://localhost:8080/?dev&name=dropout`). This configures the client to look for ports differently than with the docker setup. The client will not connect otherwise
