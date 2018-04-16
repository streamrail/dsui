# dsui
Datastore UI for remote/emulator

## Requirements
Node Version >= 7.6.0

## Installation
`npm i -g streamrail/dsui`

## Usage
```bash
dsui
```
Open http://localhost:3000

## Options

| Option            | Short | Description            | Default                                          | Mandatory |
|-------------------|-------|------------------------|--------------------------------------------------|-----------|
| `port`            | `p`   | HTTP server port       | `3000`                                           | ✔         |
| `project-id`      | `j`   | Datastore Project ID   | `DATASTORE_PROJECT_ID` (Environment Variable)    | ✔         |
| `api-endpoint`    | `e`   | Datastore API Endpoint | `DATASTORE_EMULATOR_HOST` (Environment Variable) |           |
| `key-filename`    | `k`   | Private key file path  |                                                  |           |
| `version`         | `v`   | DSUI module version    |                                                  |           |
| `help`            | `h`   | Show help menu         |                                                  |           |

## Connect to Datastore Emulator

If you want to connect to [local Datastore emnulator](https://cloud.google.com/datastore/docs/tools/datastore-emulator), execute below command:
```bash
$(gcloud beta emulators datastore env-init)
dsui
```

For more information, please see [this document](https://cloud.google.com/datastore/docs/tools/datastore-emulator#setting_environment_variables).

## Develop
```bash
git clone https://github.com/streamrail/dsui.git
cd dsui
npm run watch
```
Open http://localhost:3000
