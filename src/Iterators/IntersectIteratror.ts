module TsLinq.Iterators
{
    export class IntersectIteratror<T> extends IteratorBase<T>
    {
        constructor(iterator: Iterator<T>, private _set: Set<T>, private _switch: boolean = false)
        {
            super(iterator);
        }

        public next(value?: any): IteratorResult<T>
        {
            var result;
            while (!(result = this._iterator.next()).done && (this._switch == this._set.has(result.value))) { }
            if (!this._switch) this._set.add(result.value);
            return result;
        }
    }
}
