export default function createMethods(session) {
  return {
    runModels(run) {
      return session.call('parflow.run', [run]);
    },
    initialRun() {
      return session.call('parflow.initial', []);
    },
    subscribeToParflowOutput(callback) {
      return session.subscribe('parflow.results', callback);
    },
    unsubscribe(subscription) {
      return session.unsubscribe(subscription);
    },
  };
}
