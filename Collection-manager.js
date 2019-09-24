class SortManager {
    compareValues(key, order = 'asc') {
        return function (a, b) {
            if (!a.hasOwnProperty(key) ||
                !b.hasOwnProperty(key)) {
                return 0;
            }

            const varA = (typeof a[key] === 'string') ?
                a[key].toUpperCase() : a[key];
            const varB = (typeof b[key] === 'string') ?
                b[key].toUpperCase() : b[key];

            let comparison = 0;
            if (varA > varB) {
                comparison = 1;
            } else if (varA < varB) {
                comparison = -1;
            }
            return (
                (order == 'desc') ?
                    (comparison * -1) : comparison
            );
        };
    }
    sortBy(sort) {
        this.collection = sort.reduce((result, item)=>{
            return result.sort(this.compareValues(item.predicate, item.order))
        }, [...this.collection]);
        return this;
    }
}

class FilterManager extends SortManager {
    constructor() {
        super();
    }

    validate(item, filters) {
        return filters.every((filter) => {
            switch (filter.type) {
                case 'number':
                    return this.compareNumber(item, filter);
                    break;
            }
        });
    }

    compareNumber(item, filter) {
        let itemValue = item[filter.key];
        let value = filter.value;

        itemValue = parseFloat(itemValue);
        value = parseFloat(value);

        const comparison = {
            gt: () => (itemValue > value),
            gte: () => (itemValue >= value),
            eq: () => (itemValue === value),
            lte: () => (itemValue <= value),
            lt: () => (itemValue < value)
        };

        if (comparison.hasOwnProperty(filter.comparator)) {
            return comparison[filter.comparator]();
        }
        return false;
    }
}

class CollectionManager extends FilterManager {
    constructor(collection) {
        super();
        this.collection = collection;
        this._collection = [];
    }
    filterBy(filters) {
        this.collection = [...this.collection].filter(item => this.validate(item, filters));
        return this;
    }
    get value() {
        return this.collection;
    }
    chain(){
        this._collection = [...this.collection];
        return this;
    };
    values(){
        const value = [...this.collection];
        this.collection = [...this._collection];
        return value;
    }
}

function init() {
    const data = [
        { id: 2, name: 'F' },
        { id: 6, name: 'F' },
        { id: 6, name: 'F' },
        { id: 1, name: 'Z' },
        { id: 3, name: 'C' },
        { id: 4, name: 'D' },
        { id: 5, name: 'E' }
    ];

    const collection = new CollectionManager(data);
    const filters = [
        { key: 'id', type: "number", comparator: 'eq', value: 6 }
    ];
    const sort = [
        {
            predicate: 'id',
            order: 'desc'
        },
        {
            predicate: 'name',
            order: 'asc'
        }
    ];
    console.log(JSON.stringify(collection.chain().filterBy([]).sortBy(sort).values()));
}

init();