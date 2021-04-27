import sys
import torch

KEYS_TO_DELETE = [
    'optimizer_states',
    'epoch',
    'global_step',
    'pytorch-lightning_version',
    'callbacks',
    'lr_schedulers',
]

if __name__ == "__main__":
    knowledge_path = sys.argv[1]

    print(f'Loading {knowledge_path}')
    model = torch.load(knowledge_path)
    for name in KEYS_TO_DELETE:
        del model[name]

    # for name in model.keys():
    #     print(name)
    #     print('-' * 60)
    #     print(model[name])
    #     print('-' * 60)
    # print('\n'.join(model.keys()))
    torch.save(model, f'{knowledge_path}.out')
    print('=> done')
