#!/bin/sh
cd ../core/node
nx run core:build

cd ../../plugins
npm link ../core/node/dist/libs/core
