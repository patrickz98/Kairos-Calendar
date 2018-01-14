mac:
	electron-packager ./ Calendar-Webapp --platform=darwin --arch=x64 --version=1.2.7 --icon=calendar-icon.icns

all:
	electron-packager ./ Calendar-Webapp --all --version=1.2.7 --icon=calendar-icon.ico

clean:
	rm -rf Calendar-Webapp*

test:
	/Applications/Electron.app/Contents/MacOS/Electron .

default: mac
