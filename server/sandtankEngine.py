import os
import numpy as np
import parflow

from shutil import copyfile
from tempfile import TemporaryDirectory


base_path = os.path.dirname(os.path.abspath(__file__))
refs_path = os.path.join(base_path, "refs")


def copy_refs(dest):
    for name in ["run.yaml", "SandTank_Indicator.pfb", "SandTank.pfsol"]:
        copyfile(os.path.join(refs_path, name), os.path.join(dest, name))


###############################################################################


class Float32_clamp_scaling_x_bc:
    def __init__(self, src_range=[0, 50], dst_range=[-1, 1], height=50):
        self.height = height
        self.dst_range = dst_range
        in_delta = src_range[1] - src_range[0]
        self.in_min = src_range[0]
        self.in_max = src_range[1]
        self.out_min = dst_range[0]
        self.out_max = dst_range[1]
        out_delta = dst_range[1] - dst_range[0]
        self.out_scale = out_delta / in_delta
        self.bc_left = np.empty(height, dtype=np.float32)
        self.bc_right = np.empty(height, dtype=np.float32)

    def set_left(self, value):
        for i in range(self.height):
            if i < value:
                self.bc_left[i] = self.dst_range[1]
            else:
                self.bc_left[i] = self.dst_range[0]

    def set_right(self, value):
        for i in range(self.height):
            if i < value:
                self.bc_right[i] = self.dst_range[1]
            else:
                self.bc_right[i] = self.dst_range[0]

    def convert(self, array):
        in_shape = array.shape

        # convert 3D => 2D
        if len(in_shape) == 3:
            in_shape = (in_shape[0], in_shape[2])
            array = array.reshape(in_shape)

        out_shape = (in_shape[0], in_shape[1] + 2)
        out = np.empty(out_shape, dtype=np.float32)
        # print(f'in shape {in_shape} => out shape {out_shape} => real {out.shape}')
        for z in range(in_shape[0]):
            for x in range(in_shape[1]):
                value = array[z, x]
                if value < self.in_min:
                    out[z, x + 1] = self.out_min
                elif value > self.in_max:
                    out[z, x + 1] = self.out_max
                else:
                    out[z, x + 1] = (
                        value - self.in_min
                    ) * self.out_scale + self.out_min

        # Add BCs
        for i in range(self.height):
            out[i, 0] = self.bc_left[i]
            out[i, out_shape[1] - 1] = self.bc_right[i]

        return out


###############################################################################


class SandtankEngine:
    def __init__(self, data_dir):
        self.data_dir = data_dir
        self.time = 0  # Use initial pressure (25/25)
        self.press_transform = Float32_clamp_scaling_x_bc(
            src_range=[-30, 50], dst_range=[-1, 1], height=50
        )
        self.perm_transform = Float32_clamp_scaling_x_bc(
            src_range=[0, 1], dst_range=[-1, 1], height=50
        )

    def get_sandtank(self, left, right):
        l = "{:0>2d}".format(left)
        r = "{:0>2d}".format(right)
        sandtank_path = f"{self.data_dir}/{l}/{r}/"
        if os.path.exists(f"{sandtank_path}/"):
            pass
        else:
            return run_sandtank(left, right)

    def run_sandtank(self, left, right):
        with TemporaryDirectory() as run_directory:

            # Run sandtank
            copy_refs(run_directory)
            sandtank = parflow.Run.from_definition(f"{run_directory}/run.yaml")
            sandtank.Patch.x_lower.BCPressure.alltime.Value = left
            sandtank.Patch.x_upper.BCPressure.alltime.Value = right
            sandtank.dist("SandTank_Indicator.pfb")
            sandtank.run()
            parflow.tools.settings.set_working_directory(
                run_directory
            )  # get_absolute_path forgets tempdir after run

            # Collect inputs for web client
            inputs = dict()
            data = sandtank.data_accessor
            (shape_height, _, shape_width) = data.shape
            (height, width) = (shape_height + 2, shape_width)
            inputs["size"] = (height, width)

            # Add data channels to inputs
            data.time = 0
            perm = self.perm_transform.convert(data.computed_permeability_x)
            press = self.press_transform.convert(data.pressure)
            inputs["channels"] = [array.flatten().tolist() for array in [perm, press]]

        return inputs


if __name__ == "__main__":
    data_dir = "."
    s = SandtankEngine(data_dir)
    print(s.run_sandtank(32, 68))
