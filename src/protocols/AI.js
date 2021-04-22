export default function createMethods(session) {
  return {
    predict(uri, left, right, time) {
      return session.call('parflow.ai.predict', [uri, left, right, time]);
    },
    explain(uri, method, xy) {
      return session.call('parflow.ai.explain', [uri, method, xy]);
    },
    fetchConfig(name) {
      return session.call('parflow.ai.config', [name]);
    },
  };
}
