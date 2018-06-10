[![CircleCI Build Status][circleci-badge]][circleci-url]
[![Latest npm release][npm-badge]][npm-url]

[circleci-badge]: https://img.shields.io/circleci/project/github/streamrail/dsui.svg
[circleci-url]: https://circleci.com/gh/streamrail/dsui
[npm-badge]: https://badge.fury.io/js/%40streamrail%2Fdsui.svg
[npm-url]: https://www.npmjs.com/package/@streamrail/dsui

# dsui
Datastore Emulator UI   

<img src="/docs/example.png" alt="DSUI example screenshot"/>

## Requirements
Node Version >= 7.6.0

## Installation
`npm i -g @streamrail/dsui`

## Usage
```bash
# Start the datastore emulator
gcloud beta emulators datastore start

# Open a new terminal
$(gcloud beta emulators datastore env-init)
dsui

# Open http://localhost:3000 and start browsing
```

For more information about the datastore emulator, please see [this document](https://cloud.google.com/datastore/docs/tools/datastore-emulator#setting_environment_variables).

## Options

| Option            | Short | Value Type        | Description            | Default                                          | Mandatory |
|-------------------|-------|-------------------|------------------------|--------------------------------------------------|-----------|
| `port`            | `p`   | Number            | HTTP server port       | `3000`                                           | ✔         |
| `project-id`      | `j`   | String            | Datastore Project ID   | `DATASTORE_PROJECT_ID` (Environment Variable)    | ✔         |
| `api-endpoint`    | `e`   | String            | Datastore API Endpoint | `DATASTORE_EMULATOR_HOST` (Environment Variable) |           |
| `filter`          | `f`   | Array<String>     | UI Filters             | `[]`                                             |           |
| `key-filename`    | `k`   | String            | Private key file path  |                                                  |           |
| `version`         | `v`   | -                 | DSUI module version    |                                                  |           |
| `help`            | `h`   | -                 | Show help menu         |                                                  |           |

## Customize UI Filters
You can customize the UI filters by specifiying an array of Field Names.   
For example when running:
```bash
dsui --filter Id --filter Name
```
The UI will include 2 inputs for filtering by `Id` and `Name` fields.  
Populating `Name` with `somename` will result a query with `query.filter('Name', '=', 'somename')`  
**Note:** At the moment this feature supports fields of type `String` only. 


For more information, please see [this document](https://cloud.google.com/datastore/docs/tools/datastore-emulator#setting_environment_variables).

## Develop
```bash
git clone https://github.com/streamrail/dsui.git
cd dsui
npm run watch
```
Open http://localhost:3000

## Tests
Running the tests will seed the datastore emulator with predefined data.
For running the tests you'll need to run 3 terminals:
###  Terminal 1
```bash
# start datastore emulator
gcloud beta emulators datastore start --consistency=1 --no-store-on-disk
```
### Terminal 2
```bash
# starting the dsui server
$(gcloud beta emulators datastore env-init)
npm run watch
```
### Terminal 3
```bash
# seeding & running tests
$(gcloud beta emulators datastore env-init)
npm run test
```