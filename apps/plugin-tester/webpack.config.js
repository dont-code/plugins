const ModuleFederationPlugin = require("webpack/lib/container/ModuleFederationPlugin");
const mf = require("@angular-architects/module-federation/webpack");
const path = require("path");
const share = mf.share;

const sharedMappings = new mf.SharedMappings();
sharedMappings.register(
  path.join(__dirname, '../../tsconfig.base.json'),
  [/* mapped paths to share */]);

module.exports = {
  output: {
    uniqueName: "dontCodeStandardPlugins",
    publicPath: "auto"
  },
  optimization: {
    runtimeChunk: false
  },
  resolve: {
    alias: {
      ...sharedMappings.getAliases(),
    }
  },
  plugins: [
    new ModuleFederationPlugin({

      name: "dontCodeStandardPlugins",
      filename: "remoteEntry.js",
      exposes: {
        './Fields': './libs/fields/src/lib/fields.module.ts',
        './Basic': './libs/basic/src/lib/basic.module.ts',
      },

        shared: share({
          "@angular/core": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/common/http": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/router": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@angular/forms": { singleton: true, strictVersion: true, requiredVersion: 'auto' },
          "@dontcode/core": { singleton: true, strictVersion: true},
          "@dontcode/plugin-common": { singleton: true, strictVersion: true},
          "@dontcode/sandbox": { singleton: true, strictVersion: true},
          ...sharedMappings.getDescriptors()
        })

    }),
    sharedMappings.getPlugin()
  ],
};
