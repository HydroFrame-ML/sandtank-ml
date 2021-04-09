import numpy as np


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
