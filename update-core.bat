cd ..\core\node
call npm run nx run core:build --prod
call npm pack dist/libs/core
cd ..\..\plugins
del dontcode-core-*.tgz
move ..\core\node\dontcode-core-*.tgz .
forfiles /M dontcode-core-*.tgz /C "cmd /c npm install @file"
