module TsLinq.Iterators
{
    export class MethodIteratror<T> extends IteratorBase<T>
    {
        public constructor(iterator: Iterator<T>, protected _method: Function = null, protected _index = 0)
        {
            super(iterator);
        }
    }
}
