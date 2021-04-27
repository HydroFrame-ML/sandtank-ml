docker run --rm \
  -it \
  -p 9000:80 \
  -e SERVER_NAME="192.168.0.78:9000" \
  -e PROTOCOL="ws" \
  --mount type=bind,source="$(pwd)"/../data,target=/opt/sandtank-ml/data \
  sandtank-ml 

