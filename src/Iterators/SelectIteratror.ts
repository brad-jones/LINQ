module TsLinq.Iterators
{
    export class SelectIteratror<T, V> extends MethodIteratror<T> implements Iterator<V>
    {
        public next(value?: any): IteratorResult<V>
        {
            var result: any = this._iterator.next();
            if (result.done) return result;
            result.value = this._method(result.value, this._index++);
            return result;
        }
    }
}
