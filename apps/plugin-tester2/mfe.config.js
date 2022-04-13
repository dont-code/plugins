module.exports = {
  name: 'plugin-tester2',
  exposes: {
    './Module': 'apps/plugin-tester2/src/app/remote-entry/entry.module.ts',
  },
};
