cd ..\core\node
call npm run nx run core:build --prod
rem call npm pack dist/libs/core
cd ..\..\plugins
rem del dontcode-core-*.tgz
rem move ..\core\node\dontcode-core-*.tgz .
rem forfiles /M dontcode-core-*.tgz /C "cmd /c npm install @file"
call npm uninstall @dontcode/core
call npm install "..\core\node\dist\libs\core"
