# Frac brownian

This is small desktop app for modeling fractional brownian motion by few different algorithms

## System requirements

1. NodeJS version 12.16.3 or upper
2. npm version 6.14.4 or upper
3. Windows 7 or upper
   
## Setting up environment

Install packages by running `npm install` in project root directory

## Run application in debug mode

There are two ways to do it:

### Firt way
This way first teminal will watch to file changes and rebuild in case of that

1. run `npm run webpack-watch` in first terminal and wait `build` directory to apper. Don't close or stop this terminal.
2. run `npm run start-electron` in second terminal.
3. Application will start up

### Second way

1. run `npm run start` in terminal
2. Application will start up

## Build production

1. Remove `dist` and `build` directories in case they exists
2. Run `npm run build-prod`
3. Wait proccess to finish
4. Installer will be in `dist` folder