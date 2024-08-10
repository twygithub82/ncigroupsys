@echo off

rem Path to your executable
set "EXE_PATH=.\IDMS.BatchJob.Service.exe"

rem Check if an argument is provided
if "%~1"=="" (
    rem No argument provided, run the executable without argument
    "%EXE_PATH%"
) else (
    rem Argument provided, run the executable with the argument
    "%EXE_PATH%" "%~1"
)
