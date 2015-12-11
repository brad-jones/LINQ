module TsLinq
{
    export class OrderedLinq<T> extends Linq<T>
    {
        public constructor(target: Iterable<any>|IEnumerable<any>, factory: Function, public equal: Function)
        {
            super(target, factory);
        }

        public [Symbol.iterator](): Iterator<T>
        {
            if ('undefined' === typeof this._factoryArg)
            {
                this._factoryArg = (<Linq<T>>this._target).ToArray();
                this._factoryArg.sort(this.equal);
            }

            return this._factory(this._factoryArg);
        }
    }
}
