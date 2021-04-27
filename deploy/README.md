# Deploy sandtank-ml
The following scripts build up the docker image for deploying sandtank-ml. They are meant to be run in this directory (`deploy/`).
```
cd deploy/
./00_fetch_repo.sh
./01_build_parflow.sh
./02_dockerize_sandtank.sh
./03_run_docker.sh
```
Ideally, after running those there should be a sandtank server running on port 9000 (all websockets etc are passed through here).

# Details

## ./00_fetch_repo.sh
We grab parflow from github.

## ./01_build_parflow.sh
Parflow has docker images for its development and runtime environments, which we depend on. This builds those images.

## ./02_dockerize_sandtank.sh
Our docker image wraps our sandtank server with a launcher + apache server. We build the web client for apache to serve, and wire launcher up to our server. The configurations for each of those, and a script from pvw_web to make things easier, are here in `deploy/config/`. They are largely copied from github.com/hydroframe/SandTank/tree/master/docker/web.

## ./03_run_docker.sh
Running our docker image involves making some choices about which models and configuration to pass in, as well as where the logs should go

# Debug
Adding a `--entrypoint /bin/bash` line in ./03_run_docker.sh will let you poke around the image quickly.
