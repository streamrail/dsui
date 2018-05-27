## v0.1.0
### Changes:
- [Enhancement] Query by Namespace
- [Enhancement] Dynamic UI filters by cli param
- [Enhancement] Show Path & Namespace in Key column and as the header of the entity view screen.
- [Enhancement] Fallback Keys's Identifier to Integer in case `datastore.get(key)` resulted with `undefined`.

## v0.1.1
### Changes:
- [Bug Fix] Show kinds of all entities

## v0.1.2
### Changes:
- [Bug Fix] Truncte long keys in entities table view (https://github.com/streamrail/dsui/issues/4)
- [Bug Fix] Fix double `Default` option for namespace selection, when the only namespace is the default one