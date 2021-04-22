FROM parflow-runtime

USER ubuntu

# Copy reqs first to cache install early
COPY ./server/requirements.txt server/requirements.txt
RUN python3 -m pip install -r server/requirements.txt

COPY ./ sandtank/
EXPOSE 1234
WORKDIR sandtank

ENTRYPOINT ["python3", "server/server.py", "--port", "1234"]
