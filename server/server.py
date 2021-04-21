import os
import sys
import argparse

from wslink.websocket import ServerProtocol
from wslink import server

from api import Parflow

# -----------------------------------------------------------------------------
# source /home/seb/Documents/code/AI/parflow/full/opt/setup.sh
# python server/server.py --port 1234 --data ~/Documents/code/AI/NSF/proto-02-parflow-data-extractor/www/data
# -----------------------------------------------------------------------------


class WebServer(ServerProtocol):
    authKey = "wslink-secret"
    working_directory = None

    @staticmethod
    def configure(options):
        WebServer.authKey = options.authKey
        WebServer.working_directory = options.working_directory

    @staticmethod
    def add_arguments(parser):
        parser.add_argument(
            "--data",
            default=os.getcwd(),
            help="Path to working directory",
            dest="working_directory",
        )

    def initialize(self):
        self.registerLinkProtocol(Parflow())
        self.registerLinkProtocol(AI(WebServer.working_directory))

        # Update authentication key to use
        self.updateSecret(WebServer.authKey)


# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------

if __name__ == "__main__":
    # Create argument parser
    parser = argparse.ArgumentParser(description="Sandtank ML")

    # Add arguments
    server.add_arguments(parser)
    WebServer.add_arguments(parser)
    args = parser.parse_args()
    WebServer.configure(args)

    # Start web server
    server.start_webserver(options=args, protocol=WebServer)
