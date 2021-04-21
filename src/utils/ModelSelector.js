export const DEFAULT_MODEL = {
  order: ['model', 'training', 'learningRate', 'dropOut', 'epoch'],
  parameters: {
    model: {
      label: 'Model',
      items: [{ text: 'Pressure', value: 'RegressionPressure' }],
    },
    training: {
      label: 'Learning set',
      items: [
        { text: 'Dry', value: 'dry' },
        { text: 'Wet', value: 'wet' },
        { text: 'All', value: 'full' },
      ],
    },
    learningRate: {
      label: 'Learning Rate',
      items: [
        { text: '0.0001', value: 'lr4' },
        { text: '0.001', value: 'lr3' },
        { text: '0.01', value: 'lr2' },
      ],
    },
    dropOut: {
      label: 'Use drop out',
      items: [
        { text: 'No', value: 'ndp' },
        { text: 'Yes', value: 'dp' },
      ],
    },
    epoch: {
      label: 'Number of trainings',
      items: [
        { value: 'e1', text: 'One time' },
        { value: 'e5', text: 'Five times' },
        { value: 'e20', text: 'Twenty times' },
        { value: 'e50', text: 'Fifthy times' },
      ],
    },
  },
  uriPattern:
    '${model}://models/${model}Engine/press-${training}-${learningRate}-${dropOut}-${epoch}',
};

export default class ModelSelector {
  constructor(definitions) {
    this.definitions = definitions || DEFAULT_MODEL;
    this.values = {};
  }

  getKeyNames() {
    return this.definitions.order;
  }

  getLabel(keyName) {
    return this.definitions.parameters[keyName].label;
  }

  getItems(keyName) {
    return this.definitions.parameters[keyName].items;
  }

  getValue(keyName) {
    return this.values[keyName] || this.getItems(keyName)[0].value;
  }

  setValue(keyName, value) {
    this.values[keyName] = value;
  }

  getURI() {
    let uri = this.definitions.uriPattern;
    const keyNames = this.getKeyNames();
    for (let i = 0; i < keyNames.length; i++) {
      const keyName = keyNames[i];
      const value = this.getValue(keyName);
      uri = uri.replaceAll(`\${${keyName}}`, value);
    }
    return uri;
  }
}
