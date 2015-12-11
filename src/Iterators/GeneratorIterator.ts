module TsLinq.Iterators
{
    export class GeneratorIterator<T> extends IteratorBase<T> implements Iterator<T>
    {
        public constructor(private _current: any, private _count: number, private _increment: boolean = false)
        {
            super(null);
        }

        public next<T>(value?: any): IteratorResult<T>
        {
            var result = (0 < this._count) ? { value: this._current, done: 0 >= this._count-- } : this._done;
            if (this._increment) this._current++;
            return result;
        }
    }
}
