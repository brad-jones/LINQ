module TsLinq.Iterators
{
    import Constants = TsLinq.Constants;

    export class UnionIteratror<T> extends SelectManyIteratror<T, T, T> implements Iterator<T>
    {
        private _set = new Set<T>();

        public constructor(sourceIterator: Iterator<T>)
        {
            super(sourceIterator, Constants.SELF_FN);
        }

        public next(value?: any): IteratorResult<T>
        {
            var result;
            while (!(result = super.next()).done && this._set.has(result.value)) { }
            this._set.add(result.value);
            return result;
        }
    }
}
