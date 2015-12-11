module TsLinq.Iterators
{
    export class DistinctIteratror<T> extends IteratorBase<T>
    {
        private _set: Set<T> = new Set<T>();

        public next(value?: any): IteratorResult<T>
        {
            var result;
            while (!(result = this._iterator.next()).done && this._set.has(result.value)) { }
            this._set.add(result.value);
            return result;
        }
    }
}
