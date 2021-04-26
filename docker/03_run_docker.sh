docker run --rm \
  -it \
  -p 9000:80 \
  -e SERVER_NAME="192.168.0.78:9000" \
  -e PROTOCOL="ws" \
  -v "$(pwd)"/models:/home/ubuntu/sandtank/models \
  --mount type=bind,source="$(pwd)"/launcher.json,target=/opt/launcher/config-template.json \
  --mount type=bind,source="$(pwd)"/logs,target=/logs \
  sandtank-ml 

