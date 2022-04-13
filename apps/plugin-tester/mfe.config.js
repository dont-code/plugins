module.exports = {
  name: "plugin-tester",
  exposes: {
    './Fields': './libs/fields/src/lib/fields.module.ts',
    './Basic': './libs/basic/src/lib/basic.module.ts'
  },
  shared: (name, config) => {
    return {
      "@angular/core": {singleton: true, strictVersion: true},
      "@angular/common": {singleton: true, strictVersion: true},
      "@angular/common/http": {singleton: true, strictVersion: true},
      "@angular/router": {singleton: true, strictVersion: true},
      "@angular/forms": {singleton: true, strictVersion: true},
      "@dontcode/core": {singleton: true, strictVersion: true}
    }[name];
  }
};
