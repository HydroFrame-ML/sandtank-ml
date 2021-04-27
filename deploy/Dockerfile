FROM node as build-web

# Build web client
COPY ./ sandtank
WORKDIR sandtank
RUN npm i && npm run build

FROM parflow-runtime as build-server

# Install Apache and setup user permissions
USER root

RUN groupadd proxy-mapping && \
    groupadd pvw-user && \
    useradd --system -g pvw-user -G proxy-mapping -s /sbin/nologin pvw-user && \
    usermod -a -G proxy-mapping www-data && \
    mkdir -p /opt/sandtank-ml/launcher && \
    mkdir -p /opt/sandtank-ml/logs && \
    touch /opt/sandtank-ml/launcher/proxy-mapping.txt && \
    chown ubuntu:proxy-mapping /opt/sandtank-ml/launcher/proxy-mapping.txt && \
    chmod 660 /opt/sandtank-ml/launcher/proxy-mapping.txt

RUN apt-get update && apt-get install -y --no-install-recommends \
        apache2-dev \
        apache2 \
        libapr1-dev \
        apache2-utils \
        sudo && \
    rm -rf /var/lib/apt/lists/*

# Copy the apache configuration file into place
COPY ./deploy/config/apache/001-pvw.conf /etc/apache2/sites-available/001-pvw.conf

RUN a2enmod vhost_alias && \
    a2enmod proxy && \
    a2enmod proxy_http && \
    a2enmod proxy_wstunnel && \
    a2enmod rewrite && \
    a2enmod headers && \
    a2dissite 000-default.conf && \
    a2ensite 001-pvw && \
    a2dismod autoindex -f

# Install sandtank-ml dependencies
COPY ./server /opt/sandtank-ml/server
RUN python3 -m pip install --system -r /opt/sandtank-ml/server/requirements.txt

# Copy scripts, config, and client into place
COPY ./deploy/config/pvw_start.sh /opt/sandtank-ml/start.sh
COPY ./deploy/config/launcher.json /opt/sandtank-ml/launcher/config-template.json 
COPY --from=build-web /sandtank/dist /opt/sandtank-ml/www
RUN chown -R pvw-user:pvw-user /opt/sandtank-ml && \
    chown ubuntu:proxy-mapping /opt/sandtank-ml/launcher/proxy-mapping.txt 

ENTRYPOINT ["/bin/bash", "/opt/sandtank-ml/start.sh"]
