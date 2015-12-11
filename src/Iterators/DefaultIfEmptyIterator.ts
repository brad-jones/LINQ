module TsLinq.Iterators
{
    export class DefaultIfEmptyIteratror<T> extends IteratorBase<T>
    {
        public constructor(sourceIterator: Iterator<T>, private _default: T)
        {
            super(sourceIterator);
        }

        public next(value?: any): IteratorResult<T>
        {
            return this.check(this._iterator.next());
        }

        private check(result: IteratorResult<T>)
        {
            if (result.done)
            {
                result.value = this._default;
            }
            else
            {
                this.check = (a) => a;
            }

            return result;
        }
    }
}
