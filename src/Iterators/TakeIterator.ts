module TsLinq.Iterators
{
    export class TakeIterator<T> extends MethodIteratror<T> implements Iterator<T>
    {
        public next(value?: any): IteratorResult<T>
        {
            var result = this._iterator.next();

            if (result.done || !this._method(result.value, this._index++))
            {
                return this._done;
            }

            return result;
        }
    }
}
