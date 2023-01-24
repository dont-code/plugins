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
      "@dontcode/sandbox": {...config,singleton: true, strictVersion: false},
      "broadcast-channel": {...config, requiredVersion:"0"}
    }[name];
/*    return {
      "@angular/core": {...config,singleton: true, strictVersion: true},
      "@angular/common": {...config,singleton: true, strictVersion: true},
      "@angular/common/http": {...config,singleton: true, strictVersion: true},
      "@angular/router": {...config,singleton: true, strictVersion: true},
      "@angular/forms": {...config,singleton: true, strictVersion: true},
      "@dontcode/core": {...config,singleton: true, strictVersion: false},
      "@dontcode/plugin-common": {...config,singleton: true, strictVersion: false},
      "@dontcode/sandbox": {...config,singleton: true, strictVersion: false}
    }[name];*/
  }
};
