import os
import parflow
import argparse

from shutil import copyfile


base_path = os.path.dirname(os.path.abspath(__file__))
refs_path = os.path.join(base_path, "refs")


def copy_refs(dest):
    for name in ["run.yaml", "SandTank_Indicator.pfb", "SandTank.pfsol"]:
        copyfile(os.path.join(refs_path, name), os.path.join(dest, name))


class SandtankRunner:
    def run_sandtank(self, left, right, run_directory):
        print("hit run_sandtank", left, right, run_directory)

        # Run sandtank
        copy_refs(run_directory)
        sandtank = parflow.Run.from_definition(f"{run_directory}/run.yaml")
        sandtank.Patch.x_lower.BCPressure.alltime.Value = left
        sandtank.Patch.x_upper.BCPressure.alltime.Value = right
        sandtank.dist("SandTank_Indicator.pfb")
        sandtank.run()


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SandTank Boundary Condition Runner")

    # Add arguments
    parser.add_argument("--left", type=float)
    parser.add_argument("--right", type=float)
    parser.add_argument("--run-directory", dest="run_directory")
    args = parser.parse_args()

    s = SandtankRunner()
    s.run_sandtank(args.left, args.right, args.run_directory)
