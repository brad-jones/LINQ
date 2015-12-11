module TsLinq.Iterators
{
    export class ArrayIterator<T> implements Iterator<T>
    {
        public constructor(private _source: Array<T>, private _current: number, private _done: Function, private _increment = 1)
        {

        }

        public next(value?: any): IteratorResult<T>
        {
            var result = { value: this._source[this._current], done: this._done(this._current) };
            this._current += this._increment;
            return result;
        }
    }
}
