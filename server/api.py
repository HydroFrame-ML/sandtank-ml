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

    @exportRpc("parflow.run")
    def run(self, run):
        inputs = self.sandtankEngine.run(run["left"], run["right"], self.runCallback)
        return None

    def runCallback(self, inputs):
        print("API Recieved", inputs)
        print("</API Recieved>")
        return {"inputs": inputs, "outputs": None}
