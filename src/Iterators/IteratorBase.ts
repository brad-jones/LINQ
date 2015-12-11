module TsLinq.Iterators
{
    export class IteratorBase<T>
    {
        protected _done: any = { value: undefined, done: true };
        public constructor(protected _iterator: Iterator<T>) { }
    }
}
