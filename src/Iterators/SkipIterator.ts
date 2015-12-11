module TsLinq.Iterators
{
    export class SkipIterator<T> extends MethodIteratror<T> implements Iterator<T>
    {
        private _hasSkipped = false;

        public next(value?: any): IteratorResult<T>
        {
            var result;
            if (this._hasSkipped) return this._iterator.next();
            while (!(result = this._iterator.next()).done && this._method(result.value, this._index++)) { }
            this._hasSkipped = true;
            return result;
        }
    }
}
