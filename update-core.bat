cd ..\core\node
call nx run core:build --prod
call npm pack dist/libs/core
cd ..\..\plugins
move ..\core\node\dontcode-core-*.tgz .
del dontcode-core-dev.tgz
ren dontcode-core-*.tgz dontcode-core-dev.tgz
call npm install dontcode-core-dev.tgz
