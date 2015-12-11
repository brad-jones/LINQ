module TsLinq.Iterators
{
    export class ZipIteratror<T, V, Z> extends MethodIteratror<T> implements Iterator<Z>
    {
        public constructor(first: Iterator<T>, private _second: Iterator<V>, func: (T,V) => Z)
        {
            super(first, func);
        }

        public next(value?: any): IteratorResult<Z>
        {
            var first = this._iterator.next();
            var second = this._second.next();

            if (first.done || second.done)
            {
                return this._done;
            }

            return {
                done: false,
                value: this._method(first.value, second.value)
            };
        }
    }
}
