export default function createMethods(session) {
  return {
    runModels: (run) => session.call('parflow.run', [run]),
    initialRun: () => session.call('parflow.initial', []),
  };
}
