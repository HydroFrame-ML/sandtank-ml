FROM parflow-runtime

USER ubuntu

# Copy reqs first to cache install early
COPY ./server/requirements.txt server/requirements.txt
RUN python3 -m pip install -r server/requirements.txt

# Install Apache
USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
        apache2-dev \
        apache2 \
        libapr1-dev \
        apache2-utils \
        nodejs \
        npm \
        sudo && \
    rm -rf /var/lib/apt/lists/*


RUN groupadd proxy-mapping && \
    groupadd pvw-user && \
    useradd --system -g pvw-user -G proxy-mapping -s /sbin/nologin pvw-user && \
    usermod -a -G proxy-mapping www-data && \
    useradd admin && echo "admin:admin" | chpasswd && adduser admin sudo && \
    mkdir -p /opt/launcher/log && \
    chown -R pvw-user:pvw-user /opt/launcher && \
    mkdir -p /opt/paraviewweb/scripts && \
    touch /opt/launcher/proxy-mapping.txt && \
    chown pvw-user:proxy-mapping /opt/launcher/proxy-mapping.txt && \
    chmod 660 /opt/launcher/proxy-mapping.txt 


# Copy the apache configuration file into place
COPY ./docker/config/apache/001-pvw.conf /etc/apache2/sites-available/001-pvw.conf

RUN a2enmod vhost_alias && \
    a2enmod proxy && \
    a2enmod proxy_http && \
    a2enmod proxy_wstunnel && \
    a2enmod rewrite && \
    a2enmod headers && \
    a2dissite 000-default.conf && \
    a2ensite 001-pvw && \
    a2dismod autoindex -f


# Install Paraview
RUN mkdir -p /opt/paraview && chown -R ubuntu:ubuntu /opt/paraview
RUN cd /opt/paraview && \
    curl -L https://www.paraview.org/files/v5.7/ParaView-5.7.0-osmesa-MPI-Linux-Python3.7-64bit.tar.gz | tar --strip-components=1 -xzv

# Copy paraviewweb scripts into place
COPY ./docker/scripts/start.sh /opt/paraviewweb/scripts/start.sh

# Build web client
COPY ./ sandtank/
WORKDIR sandtank
RUN npm i && npm run build


ENTRYPOINT ["/bin/bash", "/opt/paraviewweb/scripts/start.sh"]
