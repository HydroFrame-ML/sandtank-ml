docker run \
  -p 1234:1234 \
  -v "$(pwd)"/models:/home/ubuntu/sandtank/models \
  --mount type=bind,source="$(pwd)"/launcher.json,target=/opt/launcher/config.json \
  --mount type=bind,source="$(pwd)"/launcher.json,target=/opt/launcher/config-template.json \
  sandtank-ml 


#  -it \
#  --entrypoint /bin/bash \

