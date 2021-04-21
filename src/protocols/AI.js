export default function createMethods(session) {
  return {
    predict(uri, left, right) {
      return session.call('parflow.ai.predict', [uri, left, right]);
    },
    explain(uri, method, xy) {
      return session.call('parflow.ai.explain', [uri, method, xy]);
    },
  };
}
