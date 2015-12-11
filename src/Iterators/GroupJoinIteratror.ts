module TsLinq.Iterators
{
    export class GroupJoinIteratror<T, I, K, R> extends MethodIteratror<T> implements Iterator<R>
    {
        public constructor(iterator: Iterator<T>, oKeySelect: (T) => K, private _transform: (a: T, b: Iterable<I>) => R, private _map: Map<K, Array<I>>)
        {
            super(iterator, oKeySelect);
        }

        public next(value?: any): IteratorResult<R>
        {
            var innerSet: Iterable<I>;
            var result: IteratorResult<T>;

            do
            {
                result = this._iterator.next();
                if (result.done) return this._done;
                var key = this._method(result.value);
                innerSet = this._map.get(key);
            }
            while ('undefined' === typeof innerSet);

            return {
                value: this._transform(result.value, innerSet),
                done: false
            };
        }
    }
}
