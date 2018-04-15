# dsui
Datastore UI

## Installation
`npm i -g @streamrail/dsui`

## Usage
```bash
$ dsui
```
## Help Menu
```bash
dsui
```

## Options

| Option       | Short | Description            | Default                             | Mandatory |
|--------------|-------|------------------------|-------------------------------------|-----------|
| port         | p     | HTTP server port       | 3000                                | ✔         |
| project-id   | r     | Datastore Project ID   | process.env.DATASTORE_PROJECT_ID    | ✔         |
| api-endpoint | e     | Datastore API Endpoint | process.env.DATASTORE_EMULATOR_HOST |           |

## Help Menu
```bash
dsui -h
```
## Develop
```bash
git clone https://github.com/streamrail/dsui.git
cd dsui
npm run watch
```