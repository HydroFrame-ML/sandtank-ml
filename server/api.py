import time
import os
import json
import subprocess

from twisted.internet import task
from wslink.websocket import LinkProtocol
from wslink import register as exportRpc
from twisted.internet import reactor

from engine import SandtankEngine

# -----------------------------------------------------------------------------
# Local setup
# -----------------------------------------------------------------------------


class Parflow(LinkProtocol):
    def __init__(self, **kwargs):
        super(Parflow, self).__init__()
        self.sandtankEngine = SandtankEngine()

        # Run on start
        self.results = None
        self.left = 9
        self.right = 29
        self.sandtankEngine.run(self.left, self.right, self.publish_results)

    @exportRpc("parflow.initial")
    def initial(self):
        return self.results

    @exportRpc("parflow.run")
    def run(self, run):
        self.sandtankEngine.run(run["left"], run["right"], self.publish_results)

    def publish_results(self, results):
        self.results = results
        self.publish("parflow.results", results)
