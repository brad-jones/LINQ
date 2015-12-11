module TsLinq.Iterators
{
    export class SelectManyIteratror<T, V, Z> extends MethodIteratror<T> implements Iterator<Z>
    {
        protected _resultSelector;
        protected _collection: Iterator<V>;
        protected _collectionState: IteratorResult<T> = this._done;
        protected _resultState: IteratorResult<any> = this._done;

        public constructor(sourceIterator: Iterator<T>, selector: (T, number) => Iterable<V>, transform: (T, V) => Z = Constants.SELF_FN)
        {
            super(sourceIterator, selector);
            this._resultSelector = transform;
        }

        public next(value?: any): IteratorResult<Z>
        {
            do
            {
                if (this._resultState.done)
                {
                    this._collectionState = this._iterator.next();
                    if (this._collectionState.done) return this._done;
                    this._collection = this._method(this._collectionState.value)[Symbol.iterator]();
                }

                this._resultState = this._collection.next();

                if (!this._resultState.done)
                {
                    this._resultState.value = this._resultSelector
                    (
                        this._resultState.value
                    );
                }
            }
            while (this._resultState.done);

            return this._resultState;
        }
    }
}
