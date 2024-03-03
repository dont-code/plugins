module.exports = {
  name: 'plugin-tester',
  exposes: {
    './Fields': './libs/fields/src/lib/fields.module.ts',
    './Basic': './libs/basic/src/lib/basic.module.ts'
  },
  shared: (name, config) => {
    return {
      "@dontcode/core": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-common": {...config,singleton: true, strictVersion: false},
      "@dontcode/sandbox": {...config,singleton: true, strictVersion: false}
    }[name];
  }
};
