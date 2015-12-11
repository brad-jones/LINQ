module TsLinq.Iterators
{
    export class JoinIteratror<T, I, K, R> extends SelectManyIteratror<T, I, R>
    {
        private _map: Map<K, Array<I>>;

        public constructor(outer: Iterator<T>, inner: Iterator<I>, oKeySelect: (T) => K, iKeySelect: (I) => K, transform: (T, any) => R)
        {
            super(outer, null);
            this._method = oKeySelect;

            var result: IteratorResult<I>;
            this._map = new Map<K, Array<I>>();

            while (!(result = inner.next()).done)
            {
                var key = iKeySelect(result.value);
                var group: Array<I> = this._map.get(key);

                if ('undefined' === typeof group)
                {
                    group = [];
                    this._map.set(key, group);
                }

                group.push(result.value);
            }

            this._resultSelector = transform;
        }

        /** Gets the next element in the collection. */
        public next(value?: any): IteratorResult<R>
        {
            do
            {
                if (this._resultState.done)
                {
                    this._collectionState = this._iterator.next();
                    if (this._collectionState.done) return this._done;

                    var key = this._method(this._collectionState.value);
                    var innerSet = this._map.get(key);
                    if ('undefined' === typeof innerSet) continue;
                    this._collection = innerSet[Symbol.iterator]();
                }

                this._resultState = this._collection.next();

                if (!this._resultState.done)
                {
                    this._resultState.value = this._resultSelector
                    (
                        this._collectionState.value,
                        this._resultState.value
                    );
                }
            }
            while (this._resultState.done);

            return this._resultState;
        }
    }
}
