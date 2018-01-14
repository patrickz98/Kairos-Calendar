#!/bin/bash

find ../ -name ".*DS*" -delete
rm -f xxx.js
find img/*.js -exec cat {} >> xxx.js \;
find lib/*.js -exec cat {} >> xxx.js \;
find lib/externals/*.js -exec cat {} >> xxx.js \;
find js/*.js -exec cat {} >> xxx.js \;
find strings/*.js -exec cat {} >> xxx.js \;
cp xxx.js ../App/Kairos-Calendar-Android-pro/app/src/main/res/raw/app.js
cp xxx.js ../App/Kairos-Calendar-Android-free/app/src/main/res/raw/app.js
cp xxx.js ../App/Kairos-Calendar-IOS/Dragon-Calendar/app.js
cp xxx.js ../App/Kairos-Calendar-Desktop/app.js
