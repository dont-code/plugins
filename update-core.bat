cd ../core/node
call nx run core:build --prod
call npm pack dist/libs/core
cd ../../plugins
call npm install ../core/node/dontcode-core-0.1.18.tgz
