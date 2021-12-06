# Developer workflow
This is a [ParaviewWeb](https://kitware.github.io/paraviewweb/index.html) application, so it combines a frontend web client and a backend server to provide all the capabilities of a desktop application over the web. 

## Docs
- Overall server/client structure - [ParaviewWeb](https://kitware.github.io/paraviewweb/index.html)
- Web framework, templates, and components - [vuejs](https://vuejs.org/v2/guide/)
- Organizational approach for client etc - [vuex](https://vuex.vuejs.org/)
- Design framework and component library - [vuetify](https://vuetifyjs.com/en/https://vuetifyjs.com/en/)

## Client
This setup lets us take advantage of Vue's nice developer tools, including a server that will reload the client as files change.
```
git clone git@github.com:HydroFrame-ML/sandtank-ml.git
cd sandtank-ml
npm i              # Install client dependencies
npm run serve      # Run the vue development server
```
### Gotcha 
The frontend will not find the backend unless you add ?dev to the URL (eg `http://localhost:8080/?dev&name=dropout`). This is because the docker connection settings are the default, not the developer workflow settings.

## Server
Parflow and Pytorch have some tricky dependencies, but this is what has worked for us.
### Install
Installing the server dependencies with `pip install -r server/requirements.txt` will result in this error:
```
ERROR: pytorch-lightning 1.2.10 has requirement PyYAML!=5.4.*,>=5.1, but you'll have pyyaml 5.4 which is incompatible.
pftools 1.2.0 requires pyyaml==5.4.
```
The solution is to remove pytorch-lightning from the file, `pip install -r server/requirements.txt`, then manually `pip install pytorch-lightning==1.2.10`. This will make pftools use pyyaml==6.0, which should be fine.

### Running server
The server will need to know where your parflow installation is, which port the websockets will look for, and where your data is. Here is an example:
```
parflow_dir=/opt/parflow python server/server.py --port 1234 --data data/
```
