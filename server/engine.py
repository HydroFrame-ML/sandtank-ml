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

        self.press_transform = Float32_clamp_scaling_x_bc(
            src_range=[-30, 50], dst_range=[-1, 1], height=50
        )
        self.perm_transform = Float32_clamp_scaling_x_bc(
            src_range=[0, 1], dst_range=[-1, 1], height=50
        )

        self.processPoll = task.LoopingCall(self.pollProcess)
        self.processPoll.start(0.5)

    def pollProcess(self):
        if self.process is None:
            return

        status = self.process.poll()
        if status is None:  # Process still running
            return

        # Respond with run info
        sandtank = parflow.Run.from_definition(f"{self.run_directory.name}/run.yaml")
        parflow.tools.settings.set_working_directory(
            self.run_directory.name
        )  # get_absolute_path forgets tempdir after run

        # Collect inputs for web client
        inputs = dict()
        data = sandtank.data_accessor
        (shape_height, _, shape_width) = data.shape
        (height, width) = (shape_height + 2, shape_width)
        inputs["size"] = (height, width)

        # Add data channels to inputs
        data.time = 0  # Use initial pressure (25/25)
        perm = self.perm_transform.convert(data.computed_permeability_x)
        press = self.press_transform.convert(data.pressure)
        inputs["channels"] = [array.flatten().tolist() for array in [perm, press]]

        self.callback(inputs)

        # Trigger tempfile cleanup
        del self.run_directory
        self.process = None
        self.callback = None

    def run(self, left, right, callback):
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
