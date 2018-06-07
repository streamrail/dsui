# dsui
Datastore UI for remote/emulator

<img src="/docs/example.png" alt="DSUI example screenshot"/>

## Requirements
Node Version >= 7.6.0

## Installation
`npm i -g @streamrail/dsui`

## Usage
```bash
dsui
```
Open http://localhost:3000

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