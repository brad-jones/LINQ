declare module TsLinq.Constants {
    /** Default predicate, always true */
    const TRUE_FN: () => boolean;
    /** Default transformer, returns self */
    const SELF_FN: (o: any) => any;
    /** Default Grouping */
    const DEFAULT_GROUPING: (a: any, b: any) => any;
    /** Returns default value for the type */
    const DEFAULT_VALUE: (type: string) => any;
    const NOTHING_FOUND: string;
    const NO_ELEMENTS: string;
    const TOO_MANY: string;
}
declare module TsLinq {
    interface IEnumerable<T> {
        GetEnumerator(): IEnumerator<T>;
    }
    interface IEnumerator<T> {
        Current: T;
        MoveNext(): Boolean;
        Reset(): void;
    }
    class Enumerator<T> implements IEnumerator<T> {
        private _result;
        private _iterator;
        constructor(sourceIterator: Iterator<T>);
        /** Gets the current element in the collection. */
        Current: T;
        /** Advances the enumerator to the next element of the collection.*/
        MoveNext(): Boolean;
        /** Sets the enumerator to its initial position, which is before the first
        * element in the collection. */
        Reset(): void;
    }
}
declare module TsLinq.Iterators {
    class IteratorBase<T> {
        protected _iterator: Iterator<T>;
        protected _done: any;
        constructor(_iterator: Iterator<T>);
    }
}
declare module TsLinq.Iterators {
    class MethodIteratror<T> extends IteratorBase<T> {
        protected _method: Function;
        protected _index: number;
        constructor(iterator: Iterator<T>, _method?: Function, _index?: number);
    }
}
declare module TsLinq.Iterators {
    class ArrayIterator<T> implements Iterator<T> {
        private _source;
        private _current;
        private _done;
        private _increment;
        constructor(_source: Array<T>, _current: number, _done: Function, _increment?: number);
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class DefaultIfEmptyIteratror<T> extends IteratorBase<T> {
        private _default;
        constructor(sourceIterator: Iterator<T>, _default: T);
        next(value?: any): IteratorResult<T>;
        private check(result);
    }
}
declare module TsLinq.Iterators {
    class DistinctIteratror<T> extends IteratorBase<T> {
        private _set;
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class GeneratorIterator<T> extends IteratorBase<T> implements Iterator<T> {
        private _current;
        private _count;
        private _increment;
        constructor(_current: any, _count: number, _increment?: boolean);
        next<T>(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class GroupByIteratror<K, E, R> extends MethodIteratror<K> implements Iterator<R> {
        private _map;
        constructor(iterator: Iterator<K>, resultSelect: (a: K, b: Iterable<E>) => R, _map: Map<K, Array<E>>);
        next(value?: any): IteratorResult<R>;
    }
}
declare module TsLinq.Iterators {
    class GroupJoinIteratror<T, I, K, R> extends MethodIteratror<T> implements Iterator<R> {
        private _transform;
        private _map;
        constructor(iterator: Iterator<T>, oKeySelect: (T) => K, _transform: (a: T, b: Iterable<I>) => R, _map: Map<K, Array<I>>);
        next(value?: any): IteratorResult<R>;
    }
}
declare module TsLinq.Iterators {
    class IntersectIteratror<T> extends IteratorBase<T> {
        private _set;
        private _switch;
        constructor(iterator: Iterator<T>, _set: Set<T>, _switch?: boolean);
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class SelectIteratror<T, V> extends MethodIteratror<T> implements Iterator<V> {
        next(value?: any): IteratorResult<V>;
    }
}
declare module TsLinq.Iterators {
    class SelectManyIteratror<T, V, Z> extends MethodIteratror<T> implements Iterator<Z> {
        protected _resultSelector: any;
        protected _collection: Iterator<V>;
        protected _collectionState: IteratorResult<T>;
        protected _resultState: IteratorResult<any>;
        constructor(sourceIterator: Iterator<T>, selector: (T, number) => Iterable<V>, transform?: (T, V) => Z);
        next(value?: any): IteratorResult<Z>;
    }
}
declare module TsLinq.Iterators {
    class JoinIteratror<T, I, K, R> extends SelectManyIteratror<T, I, R> {
        private _map;
        constructor(outer: Iterator<T>, inner: Iterator<I>, oKeySelect: (T) => K, iKeySelect: (I) => K, transform: (T, any) => R);
        /** Gets the next element in the collection. */
        next(value?: any): IteratorResult<R>;
    }
}
declare module TsLinq.Iterators {
    class SkipIterator<T> extends MethodIteratror<T> implements Iterator<T> {
        private _hasSkipped;
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class TakeIterator<T> extends MethodIteratror<T> implements Iterator<T> {
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class UnionIteratror<T> extends SelectManyIteratror<T, T, T> implements Iterator<T> {
        private _set;
        constructor(sourceIterator: Iterator<T>);
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class WhereIteratror<T> extends MethodIteratror<T> implements Iterator<T> {
        next(value?: any): IteratorResult<T>;
    }
}
declare module TsLinq.Iterators {
    class ZipIteratror<T, V, Z> extends MethodIteratror<T> implements Iterator<Z> {
        private _second;
        constructor(first: Iterator<T>, _second: Iterator<V>, func: (T, V) => Z);
        next(value?: any): IteratorResult<Z>;
    }
}
declare module TsLinq {
    class Linq<T> implements Iterable<T>, IEnumerable<T> {
        protected _target: Iterable<T> | IEnumerable<T>;
        protected _factory: Function;
        protected _factoryArg: any;
        protected _initialize: Function;
        constructor(target: Iterable<any> | IEnumerable<any>, factory?: Function, arg?: any);
        /** Returns JavaScript iterator */
        [Symbol.iterator](): Iterator<T>;
        /** Returns C# style enumerator */
        GetEnumerator(): IEnumerator<T>;
        Aggregate<A, B>(seed: A, func: (A, T) => A, resultSelector?: (A) => B): B;
        All(predicate?: (T) => boolean): boolean;
        Any(predicate?: (T) => boolean): boolean;
        Average(func?: (T) => number): number;
        Contains(value: T, equal?: (a: T, b: T) => boolean): boolean;
        Count(predicate?: (T) => boolean): number;
        Max(transform?: (T) => number): number;
        Min(transform?: (T) => number): number;
        ElementAt(index: number): T;
        ElementAtOrDefault(index: number): T;
        First(predicate?: (T) => boolean): T;
        FirstOrDefault(predicate?: (T) => boolean): T;
        Last(predicate?: (T) => boolean): T;
        LastOrDefault(predicate?: (T) => boolean): T;
        SequenceEqual(other: Iterable<T>, equal?: (a: T, b: T) => boolean): boolean;
        Single(predicate?: (T) => boolean): T;
        SingleOrDefault(predicate?: (T) => boolean): T;
        Sum(transform?: (T) => number): number;
        ToArray(): Array<T>;
        ToDictionary<TKey, TElement>(keySelector: (T) => TKey, elementSelector?: (T) => TElement): Map<TKey, TElement>;
        ToMap: <TKey, TElement>(keySelector: (T: any) => TKey, elementSelector?: (T: any) => TElement) => Map<TKey, TElement>;
        DefaultIfEmpty(defaultValue?: T): Linq<T>;
        Cast<V>(): Linq<V>;
        Concat(second: Iterable<T>): Linq<T>;
        Distinct(): Linq<T>;
        Except(other: Iterable<T>): Linq<T>;
        GroupBy<K, E, R>(selKey: (T) => K, selElement: (T) => E, selResult?: (a: K, b: Iterable<E>) => R): Linq<R>;
        GroupJoin<I, K, R>(inner: Iterable<I>, oKeySelect: (T) => K, iKeySelect: (I) => K, resultSelector?: (a: T, b: Iterable<I>) => R): Linq<R>;
        Intersect(other: Iterable<T>): Linq<T>;
        Join<I, TKey, R>(inner: Iterable<I>, oSelector: (T) => TKey, iSelector: (I) => TKey, transform: (T, I) => R): Linq<R>;
        OrderBy<K>(keySelect?: (T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        OrderByDescending<K>(keySelect?: (T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        ThenBy<K>(keySelect?: (T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        ThenByDescending<K>(keySelect?: (T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        Range<T>(start: T, count: number): Linq<T>;
        Repeat(element: T, count: number): Linq<T>;
        Reverse(): Linq<T>;
        Select<V>(transform: (T, number?) => V): Linq<V>;
        SelectMany<S, V>(selector?: (T, number) => Iterable<S>, result?: (T, S) => V): Linq<V>;
        Skip(skip: number): Linq<T>;
        SkipWhile(predicate?: (T, number) => boolean): Linq<T>;
        Take(take: number): Linq<T>;
        TakeWhile(predicate: (T, number) => boolean): Linq<T>;
        Union(second: Iterable<T>): Linq<T>;
        Where(predicate?: (T, number?) => Boolean): Linq<T>;
        Zip<V, Z>(second: Iterable<V>, func: (T, V) => Z): Linq<Z>;
    }
}
declare module TsLinq {
    class OrderedLinq<T> extends Linq<T> {
        equal: Function;
        constructor(target: Iterable<any> | IEnumerable<any>, factory: Function, equal: Function);
        [Symbol.iterator](): Iterator<T>;
    }
}
declare module TsLinq {
    /**
     * Converts any Iterable<T> object into LINQ-able object
     *
     * @param TSource An Array, Map, Set, String or other Iterable object.
     *
     * @example
     *     import {asEnumerable} from "linq-ts";
     *
     *     var enumerable = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Take(3);
     *     var sum = enumerable.Sum();
     *
     */
    function asEnumerable<T>(TSource?: Iterable<T> | IEnumerable<T>): Linq<T>;
    /**
     * Generates <count> of <T> elements starting with <start>. T is any
     * type which could be cast to number: number, enum, etc.
     *
     * @param start First value in sequence.
     * @param count Number of elements to iteratel.
     *
     * @example
     *     var sum = Range(0, 7).Sum();
     */
    function Range<T>(start: T, count: number): Linq<T>;
    /**
     * Repeat element <start> of type T <count> of times.
     *
     * @param start First value in sequence.
     * @param count Number of elements to iteratel.
     *
     * @example
     *     var sum = Repeat("v", 7);
     */
    function Repeat<T>(start: T, count: number): Linq<T>;
}
declare module "ts-linq" {
    export = TsLinq;
}
