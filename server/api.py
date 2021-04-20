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
        self.initial_run = None
        (left, right) = (9, 29)
        self.sandtankEngine.run(left, right, self.set_initial_run)

    @exportRpc("parflow.initial")
    def initial(self):
        return self.initial_run

    @exportRpc("parflow.run")
    def run(self, run):
        self.sandtankEngine.run(run["left"], run["right"], self.run_callback)
        return None

    def run_callback(self, inputs):
        self.publish("parflow.results", {"inputs": inputs, "outputs": None})

    def set_initial_run(self, inputs):
        self.initial_run = {"inputs": inputs, "outputs": None}
