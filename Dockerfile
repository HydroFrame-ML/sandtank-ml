FROM parflow-runtime

USER $USER
COPY ./ sandtank/
WORKDIR sandtank

RUN python3 -m pip install -r server/requirements.txt
