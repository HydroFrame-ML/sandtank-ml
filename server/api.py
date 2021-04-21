import time
import os
import json
import subprocess

from twisted.internet import task
from wslink.websocket import LinkProtocol
from wslink import register as exportRpc
from twisted.internet import reactor

from engine import SandtankEngine
from ml import load_ml_model

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

class AI(LinkProtocol):
    def __init__(self, models_basepath, **kwargs):
        super(AI, self).__init__()
        self.basepath = models_basepath
        self.loaded_models = {}

    def get_model(self, model_uri):
        model_type, model_path = model_uri.split('://')
        if model_path not in self.loaded_models:
            model = load_ml_model(model_type, os.path.abspath(os.path.join(self.basepath, model_path)))
            self.loaded_models[model_path] = model

        return self.loaded_models[model_path]


    @exportRpc("parflow.ai.predict")
    def predict(self, model_uri, left, right):
        model = self.get_model(model_uri)
        result = {
            'left': left,
            'right': right,
            'id': model_uri,
        }
        result.update(model.predict(left, right))
        return result


    @exportRpc("parflow.ai.explain")
    def explain(self, model_uri, method, xy):
        model = self.get_model(model_uri)
        result = { 'id': model_uri }
        result.update(model.explain(method, xy))
        return result