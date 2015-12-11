module TsLinq
{
    export interface IEnumerable<T>
    {
        GetEnumerator(): IEnumerator<T>;
    }

    export interface IEnumerator<T>
    {
        Current: T;
        MoveNext(): Boolean;
        Reset(): void;
    }

    //  Gets Iterator and turns it into Enumerator
    export class Enumerator<T> implements IEnumerator<T>
    {
        private _result: any;
        private _iterator: Iterator<T>;

        public constructor(sourceIterator: Iterator<T>)
        {
            this._iterator = sourceIterator;
        }

        /** Gets the current element in the collection. */
        public get Current(): T
        {
            return this._result.value;
        }

        /** Advances the enumerator to the next element of the collection.*/
        public MoveNext(): Boolean
        {
            this._result = this._iterator.next();
            return !this._result.done;
        }

        /** Sets the enumerator to its initial position, which is before the first
        * element in the collection. */
        public Reset(): void
        {
            throw "JavaScript iterators could not be Reset";
        }
    }
}
