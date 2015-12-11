module TsLinq.Iterators
{
    export class GroupByIteratror<K, E, R> extends MethodIteratror<K> implements Iterator<R>
    {
        public constructor(iterator: Iterator<K>, resultSelect: (a: K, b: Iterable<E>) => R, private _map: Map<K, Array<E>>)
        {
            super(iterator, resultSelect);
        }

        public next(value?: any): IteratorResult<R>
        {
            var result: IteratorResult<K> = this._iterator.next();
            if (result.done) return this._done;
            var iterable = this._map.get(result.value);
            return { value: this._method(result.value, iterable), done: false};
        }
    }
}
