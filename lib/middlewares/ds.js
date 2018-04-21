const Datastore = require('@google-cloud/datastore');
const _ = require('lodash');
const atob = require('atob');
const btoa = require('btoa');

class DS {
    constructor({ projectId, apiEndpoint, keyFilename, filters }) {
        this._datastoreOptions = {
            projectId
        };
        if (apiEndpoint) {
            this._datastoreOptions.apiEndpoint = apiEndpoint;
        }
        if (keyFilename) {
            this._datastoreOptions.keyFilename = keyFilename;
        }
        this._filters = (filters || []).sort();
        this._datastore = new Datastore(this._datastoreOptions);
    }

    get projectId(){
        return this._datastoreOptions.projectId;
    }

    get apiEndpoint(){
        return this._datastoreOptions.apiEndpoint;
    }

    get filters() {
        return this._filters;
    }

    async getNamespaceKinds(namespace){
        const queryArgs = [];
        if (namespace) {
            queryArgs.push(namespace);
        }
        queryArgs.push('__kind__');
        const query = this._datastore.createQuery(...queryArgs).select('__key__');
        const [entities] = await this._datastore.runQuery(query);
        const kinds = entities.map(entity => entity[this._datastore.KEY].name);
        return kinds;
    }

    async getKinds(namespaces = ['']) {
        const kindsArrays = await Promise.all(namespaces.map(ns => this.getNamespaceKinds(ns)))
        return _.union(...kindsArrays).sort();
    }

    async getNamespaces(){
        const query = this._datastore.createQuery("__namespace__").select("__key__");
        const [entities] = await this._datastore.runQuery(query);
        const namespaces = entities.map(entity => entity[this._datastore.KEY].name);
        if (!namespaces.includes('')) {
            namespaces.unshift('');
        }
        return namespaces;
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

    deserializeKey(string, idToInt = false) {
        try {
            const obj = JSON.parse(decodeURIComponent(atob(string)));
            return this._datastore.key({
                path: obj.path.map(x => (idToInt && !isNaN(parseInt(x)) ? parseInt(x) : x)),
                namespace: obj.namespace || ''
            });
        } catch (e) {
            return string;
        }
        
    }

    async getEntities(options) {
        let { kind, page, itemsPerPage, namespace } = options
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
        const queryArgs = [];
        if (namespace) {
            queryArgs.push(namespace);
        }
        queryArgs.push(kind)
        if (kind) {
            const query = this.filters.filter(f => !!options[f]).reduce(
                (q, f) => q.filter(f, '=', options[f]),
                this._datastore.createQuery(...queryArgs)
            );
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
            fields = Array.from(items.reduce((acc, item) => {
                Object.keys(item).forEach(key => acc.add(key))
                return acc;
            }, new Set)).sort();
            items.forEach(item => {
                item._keyURIComponent = this.serializeKey(item[this._datastore.KEY]);
                item._formattedPath = this.getReadableKey(item[this._datastore.KEY]);
            });
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
        const datastoreKey = this.deserializeKey(key);
        let result = await this._datastore.get(datastoreKey)
        if (typeof result[0] === 'undefined') {
            result = await this._datastore.get(datastoreKey, true);
        }
        return result[0];
    }

    normalizeEntity(entity) {
        const fields = Object.keys(entity);
        const filters = this.filters.filter(f => fields.includes(f));
        _.pullAll(fields, filters);
        fields.unshift(...filters);

        return fields.reduce((acc, key) => {
          if (entity[key] instanceof Buffer) {
            acc[key] = entity[key].toString()
          } else {
            acc[key] = _.isPlainObject(entity[key]) || _.isArray(entity[key]) ? JSON.stringify(entity[key]) : entity[key];
          }
          return acc;
        }, {});
    }

    getReadableKey({ path, namespace }) {
        let str = `[ ${path.join(', ')} ]`
        if (namespace) {
            str += ` / ${namespace}`;
        }
        return str;
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

