![image](https://dont-code.net/assets/logo-shadow-squared.png)
## What is it for ?

This repository contains several plugins that are used by default.
It provides as well some common behavior for Angular based plugins in a distinct library.
They can as well be used as example of plugin developments.

They are part of the [dont-code](https://dont-code.net) no-code / low-code platform enabling you to quickly produce your very own application.

## What is it ?
Each plugin is an angular library, that plugs into the ide-ui and the preview-ui.

They all use the [Plugin Common](libs/common) library that provides reusable behaviors.

- The [Basic Plugin](libs/basic) provides a page listing and editing any entity defined
- The [Fields Plugin](libs/basic) provides custom field types, like country or currency
- The [Screen Plugin](libs/screen) shows how a plugin can override default behavior of the ide-ui and the preview-ui

## How is it working ?

## How to build them ?
You can install, run, test and build them from the root directory thanks to the Nx workspace.

1. Installing
   `npm install`

2. Running tests
   `npm run nx run common:test`
   `npm run nx run basic:test`
   `npm run nx run fields:test`
   `npm run nx run screen:test`

3. Building
   `npm run nx run common:build`
   `npm run nx run basic:build`
   `npm run nx run fields:build`
   `npm run nx run screen:build`

## Thank you

This project was generated using [Nx](https://nx.dev), visit the [Nx Documentation](https://nx.dev/angular) to learn more.
