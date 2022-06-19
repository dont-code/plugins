![image](https://dont-code.net/assets/logo-shadow-squared.png)
## What is it for ?

This repository contains several plugins that are used by default.
It provides as well some common behavior for Angular based plugins in a distinct library.
They can as well be used as example of plugin developments.

They are part of the [dont-code](https://dont-code.net) no-code / low-code platform enabling you to quickly produce your very own application.

## What is it ?
Each plugin is an angular library, that plugs into the ide-ui and the preview-ui.

They all use the [Plugin Common](libs/common) library that provides reusable behaviors.

- The [Sandbox](libs/sandbox) is not a plugin but the common ui used by the Previewer and the Plugin-tester
- The [Basic Plugin](libs/basic) provides a page listing and editing any entity defined
- The [Fields Plugin](libs/basic) provides custom field types, like country or currency
- The [Screen Plugin](libs/screen) shows how a plugin can override default behavior of the ide-ui and the preview-ui

## How is it working ?

## How to build them ?
You can install, run, test and build them from the root directory thanks to the Nx workspace.

1. Installing
   `npm install nx -g` Install nx.dev globally

   `npm install`

2. Running tests
   `nx run common:test`
   `nx run sandbox:test`
   `nx run basic:test`
   `nx run fields:test`
   `nx run screen:test`

3. Building
   `nx run common:build`
   `nx run sandbox:build`
   `nx run basic:build`
   `nx run fields:build`
   `nx run screen:build`

4. Debugging in Builder or Previewer application
   We have setup some commands to enable debugging the plugins when run inside the Builder or Previewer.
   Using npm link is difficult and doesn't work all the time, so we use [Yalc](https://github.com/wclr/yalc).

`npm install yalc -g` Installs the Yalc tool globally

`npm run publish-all` Publish all the plugins in Yalc repository, after version increase (to bypass Angular caching)

Then in the builder project (ide-ui) :
`npm run yalc-add-all` to install the plugin using Yalc

You can now set breakpoints in your plugins classes running in the builder, and if you modify some plugin code, just run
`npm run publish-all` again to rebuild and reload them in the builder application.

## Thank you

This project was generated using [Nx](https://nx.dev), visit the [Nx Documentation](https://nx.dev/angular) to learn more.
