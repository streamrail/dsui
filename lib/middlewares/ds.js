const Datastore = require('@google-cloud/datastore');
const _ = require('lodash');
const atob = require('atob');
const btoa = require('btoa');

class DS {
    constructor({ projectId, apiEndpoint }) {
        this._datastoreOptions = {
            projectId
        };
        if (apiEndpoint) {
            this._datastoreOptions.apiEndpoint = apiEndpoint;
        }
        this._datastore = new Datastore(this._datastoreOptions);
    }

    get projectId(){
        return this._datastoreOptions.projectId;
    }

    get apiEndpoint(){
        return this._datastoreOptions.apiEndpoint;
    }

    async getKinds(){
        const query = this._datastore.createQuery('__kind__').select('__key__');
        const [entities] = await this._datastore.runQuery(query);
        const kinds = entities.map(entity => entity[this._datastore.KEY].name);
        return kinds;
    }

    serializeKey(key) {
        return encodeURIComponent(btoa(JSON.stringify(this.keyToJSON(key))));
    }

    keyToJSON(key) {
        return {
            path: key.path,
            kind: key.kind,
            namespace: key.namespace
        };
    }

    deserializeKey(string) {
        try {
            return this._datastore.key(JSON.parse(decodeURIComponent(atob(string))).path);
        } catch (e) {
            return string;
        }
        
    }

    async getEntities({ kind, page, itemsPerPage, name, id }) {
        page = parseInt(page, 10);
        page = isNaN(page) ? 1 : page;
        let totalPages = 1;
        let currentPage = page
        let isAll = itemsPerPage === 'all';
        let items = [];
        let total;
        let start = 0;
        let end = 0;
        let fields = [];

        if (kind) {
            let query = this._datastore.createQuery(kind);
            if (name) {
                query = query.filter('Name', '=', name);
            }
            if (id) {
                query = query.filter('Id', '=', id);
            }
            [items] = await this._datastore.runQuery(query);
            if (isAll) {
                start = 0;
                end = items.length
            } else {
                itemsPerPage = parseInt(itemsPerPage, 10);
                start = (page - 1) * itemsPerPage;
                end = page * itemsPerPage
            }
            total = items.length;
            items = items.slice(start, end);
        }
        if (!isAll) {
            totalPages = Math.ceil(total / itemsPerPage)
        }
        if (items) {
            items.forEach(item => {
                item._keyURIComponent = this.serializeKey(item[this._datastore.KEY])
            });
            fields = Array.from(items.reduce((acc, item) => {
                Object.keys(item).forEach(key => acc.add(key))
                return acc;
            }, new Set)).sort();
            _.pull(fields, '_keyURIComponent');
            if (fields.includes('Name')) {
                _.pull(fields, 'Name');
                fields.unshift('Name');
            }
            _.pull(fields, 'Id');
            fields.unshift('Id');


        }
        return {
            fields,
            start,
            end,
            items,
            itemsPerPage,
            currentPage,
            totalPages,
            total
        };
    }

    async getEntity(key) {
        key = this.deserializeKey(key);
        const [entity] = await this._datastore.get(key)
        return entity;
    }

    normalizeEntity(entity) {
        return Object.keys(entity).reduce((acc, key) => {
          if (entity[key] instanceof Buffer) {
            acc[key] = entity[key].toString()
          } else {
            acc[key] = _.isPlainObject(entity[key]) || _.isArray(entity[key]) ? JSON.stringify(entity[key]) : entity[key];
          }
          return acc;
        }, {});
    }
}

module.exports = options => {
    const ds = new DS(options);
    return (req, res, next) => {
        req.ds = ds;
        next();
    };
}

module.exports.DS = DS;

