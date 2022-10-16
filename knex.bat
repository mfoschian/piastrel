@echo off

set cli=%~dp0node_modules\knex\bin\cli.js

pushd .\server\db\schema
node %cli% %*
popd