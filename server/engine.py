import os
import subprocess
import parflow

from twisted.internet import task
from tempfile import TemporaryDirectory

from utils.clampScaling import Float32_clamp_scaling_x_bc

root_path = os.path.dirname(os.path.abspath(__file__))
script = os.path.join(root_path, "runner", "sandtankRunner.py")

###############################################################################


###############################################################################


class SandtankEngine:
    def __init__(self):
        self.process = None
        self.callback = None
        self.processPoll = task.LoopingCall(self.pollProcess)
        self.processPoll.start(0.5)
        self.left = 25
        self.right = 25

    def pollProcess(self):
        if self.process is None:
            return

        status = self.process.poll()
        if status is None:  # Process still running
            return

        # Respond with run info
        sandtank = parflow.Run.from_definition(f"{self.run_directory.name}/run.yaml")

        # Collect inputs for web client
        results = {}
        data = sandtank.data_accessor
        (height, _, width) = data.shape
        results["size"] = (width, height)
        results["left"] = self.left
        results["right"] = self.right

        # Add data channels to inputs
        data.time = 50  # Use stable pressure after 50 timesteps
        results["permeability"] = data.computed_permeability_x.flatten().tolist()
        results["pressure"] = data.pressure.flatten().tolist()
        results["saturation"] = data.saturation.flatten().tolist()

        self.callback(results)

        # Trigger tempfile cleanup
        del self.run_directory
        self.process = None
        self.callback = None

    def run(self, left, right, callback):
        self.left = left
        self.right = right

        # Spawn parflow runner
        self.callback = callback
        self.run_directory = TemporaryDirectory()
        self.process = subprocess.Popen(
            [
                "python",
                script,
                "--left",
                str(left),
                "--right",
                str(right),
                "--run-directory",
                self.run_directory.name,
            ]
        )
