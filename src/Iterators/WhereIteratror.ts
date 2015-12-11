module TsLinq.Iterators
{
    export class WhereIteratror<T> extends MethodIteratror<T> implements Iterator<T>
    {
        public next(value?: any): IteratorResult<T>
        {
            var result;

            do
            {
                result = this._iterator.next();
            }
            while (!result.done && !this._method(result.value, this._index++));

            return result;
        }
    }
}
