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
        /**
         * Applies an accumulator function over a sequence.The specified seed value
         * is used as the initial accumulator value, and the specified function is
         * used to select the result value.
         *
         * @param seed The initial accumulator value.
         * @param func An accumulator function to be invoked on each element.
         * @param resultSelector A function to transform the final accumulator value into the result value.
         *
         * @example
         * var fruits = [ "apple", "mango", "orange", "passionfruit", "grape" ];
         * var longestName = asEnumerable(fruits)
         *                  .Aggregate("banana", (longest, next) => next.Length > longest.Length ? next : longest, fruit => fruit.ToUpper());
         */
        Aggregate<A, B>(seed: A, func: (A, T) => A, resultSelector?: (A) => B): B;
        /**
         * Determines whether all elements of a sequence satisfy a condition.
         *
         * @returns True is all elements satisfy criteria.
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e:boolean = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).All((a) => a > 0);
         */
        All(predicate?: (T: T) => boolean): boolean;
        /**
         * Determines whether a sequence contains any elements or if predicate is
         * present determines whether any element of a sequence satisfies a
         * condition.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         * var unvaccinated = asEnumerable(pets).Any(p => p.Vaccinated == false);
         */
        Any(predicate?: (T: T) => boolean): boolean;
        /**
         * Computes the average of a sequence of Number values that are obtained by
         * invoking a transform function on each element of the input sequence.
         *
         * @param func A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable(['5', '6', '7']).Average(a=>eval(a));
         */
        Average(func?: (T: T) => number): number;
        /**
         * Determines whether a sequence contains a specified element by using a
         * specified Comparer.
         *
         * @param value The value to locate in the sequence.
         * @param equal An equality comparer to compare values.
         *
         * @example
         *     var e: boolean = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Contains(0, (a) => a);
         */
        Contains(value: T, equal?: (a: T, b: T) => boolean): boolean;
        /**
         * Returns the number of elements in a sequence.
         * Returns a number that represents how many elements in the
         * specified sequence satisfy a condition.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Count((a) => a > 3)
         */
        Count(predicate?: (T: T) => boolean): number;
        /**
         * Invokes a transform function on each element of a sequence and returns
         * the maximum value.
         *
         * @param transform A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Max();
         */
        Max(transform?: (T: T) => number): number;
        /**
         * Invokes a transform function on each element of a sequence and returns the minimum Decimal value.
         *
         * @param transform A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Min()
         */
        Min(transform?: (T: T) => number): number;
        /**
         * Returns the element at a specified index in a sequence.
         *
         * @param index The zero-based index of the element to retrieve.
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).ElementAt(3);
         */
        ElementAt(index: number): T;
        /**
         * Returns the element at a specified index in a sequence or a default
         * value if the index is out of range.
         *
         * @param index The zero-based index of the element to retrieve.
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).ElementAtOrDefault(31);
         */
        ElementAtOrDefault(index: number): T;
        /**
         * Returns the first element in a sequence that satisfies a specified condition.
         * Throws an exception if no matching element is found in source.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).First(a => a > 2);
         */
        First(predicate?: (T: T) => boolean): T;
        /**
         * Returns the first element of the sequence that satisfies a condition or a
         * default value if no such element is found.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).FirstOrDefault(a => a > 2);
         */
        FirstOrDefault(predicate?: (T: T) => boolean): T;
        /**
         * Returns the last element of a sequence that satisfies a specified condition.
         * Throws an exception if no matching element is found in source.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Last();
         */
        Last(predicate?: (T: T) => boolean): T;
        /**
         * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).LastOrDefault();
         */
        LastOrDefault(predicate?: (T: T) => boolean): T;
        /**
         * Determines whether two sequences are equal by comparing their elements
         * by using a specified IEqualityComparer<T>.
         *
         * @param other An IEnumerable<T> to compare to the first sequence.
         * @param equal An IEqualityComparer<T> to use to compare elements.
         *
         * @example
         *     var e:boolean = asEnumerable([0, 1, 2, 3]).SequenceEqual([0, 1, 2, 3]);
         */
        SequenceEqual(other: Iterable<T>, equal?: (a: T, b: T) => boolean): boolean;
        /**
         * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
         *
         * @param predicate A function to test an element for a condition.
         *
         * @example
         *     var e = asEnumerable([4]).Single();
         */
        Single(predicate?: (T: T) => boolean): T;
        /**
         * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method
         * Throws an exception if more than one element satisfies the condition.
         *
         * @param predicate A function to test an element for a condition.
         *
         * @example
         *     var e = asEnumerable([4]).SingleOrDefault();
         */
        SingleOrDefault(predicate?: (T: T) => boolean): T;
        /**
         * Computes the sum of the sequence of Decimal values that are obtained by
         * invoking a transform function on each element of the input sequence.
         *
         * @param transform A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Sum();
         */
        Sum(transform?: (T: T) => number): number;
        /**
         * Converts Iterable to Array<T>
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).ToArray();
         */
        ToArray(): Array<T>;
        /**
         * Creates a Map< TKey, TValue > from an IEnumerable< T > according
         * to a specified key selector function, a comparer, and an element selector
         * function.
         *
         * @param keySelector A function to extract a key from each element.
         * @param elementSelector A transform function to produce a result element value from each element.
         */
        ToMap<TKey, TElement>(keySelector: (T: T) => TKey, elementSelector?: (T: T) => TElement): Map<TKey, TElement>;
        ToDictionary: <TKey, TElement>(keySelector: (T: T) => TKey, elementSelector?: (T: T) => TElement) => Map<TKey, TElement>;
        /**
         * Returns the elements of the specified sequence or the specified value in
         * a singleton collection if the sequence is empty.
         *
         * @param defaultValue The value to return if the sequence is empty
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).DefaultIfEmpty(0);
         */
        DefaultIfEmpty(defaultValue?: T): Linq<T>;
        Cast<V>(): Linq<V>;
        /**
         * Concatenates two sequences.
         *
         * @param second The sequence to concatenate to the first sequence.
         *
         * @example
         *     var enumerable = asEnumerable([3, 4, 5, 6, 7]).Concat([1,2,8]);
         */
        Concat(second: Iterable<T>): Linq<T>;
        /**
         * Returns distinct elements from a sequence by using the default equality
         * comparer to compare values.
         *
         * @example
         *     var enumerable = asEnumerable([1, 1, 2, 2, 4, 5, 6, 7]).Distinct();
         */
        Distinct(): Linq<T>;
        /**
         * Produces the set difference of two sequences by using the default equality comparer to compare values.
         * This method returns those elements in first that do not appear in second.
         * It does not also return those elements in second that do not appear in first.
         *
         * @param other An Iterable<T> whose elements that also occur in the first sequence will cause those elements to be removed from the returned sequence.
         *
         * @example
         *     var enumerable = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Except([2,3,5]);
         */
        Except(other: Iterable<T>): Linq<T>;
        /**
         * Groups the elements of a sequence according to a specified key selector
         * function and creates a result value from each group and its key. Elements
         * of each group are projected by using a specified function.
         *
         * @param selKey A function to extract the key for each element.
         * @param selElement A function to map each source element to an element in an Grouping<TKey, TElement>.
         * @param selResult A function to create a result value from each group.
         *
         * @example
         *   var e = asEnumerable(pets).GroupBy(pet => pet.Age, pet => pet)
         */
        GroupBy<K, E, R>(selKey: (T: T) => K, selElement: (T: T) => E, selResult?: (a: K, b: Iterable<E>) => R): Linq<R>;
        /**
         * Correlates the elements of two sequences based on equality of keys and groups the results. The default equality comparer is used to compare keys.
         *
         * @param inner The sequence to join to the first sequence.
         * @param outerKeySelector A function to extract the join key from each element of the first sequence.
         * @param innerKeySelector A function to extract the join key from each element of the second sequence.
         * @param resultSelector A function to create a result element from an element from the first sequence and a collection of matching elements from the second sequence.
         *
         * @example
         *   var iterable = asEnumerable(people)
         *       .GroupJoin(pets, person => person, pet => pet.Owner,
         *                  (person, petCollection) => { return {
         *                       Owner: person.Name,
         *                       Pets: asEnumerable(petCollection) .Select(pet=> pet.Name);
         *               };
         *       });
         */
        GroupJoin<I, K, R>(inner: Iterable<I>, oKeySelect: (T) => K, iKeySelect: (I) => K, resultSelector?: (a: T, b: Iterable<I>) => R): Linq<R>;
        /**
         * Produces the intersection of two sequences.
         *
         * @param An Iterable<T> whose distinct elements that also appear in the first sequence will be returned.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Intersect([1, 3, 5, 11, 23, 44]);
         */
        Intersect(other: Iterable<T>): Linq<T>;
        /**
         * Correlates the elements of two sequences based on matching keys. A specified IEqualityComparer<T> is used to compare keys.
         *
         * @param inner The sequence to join to the first sequence.
         * @param oSelector A function to extract the join key from each element of the first sequence.
         * @param iSelector A function to extract the join key from each element of the second sequence.
         * @param transform A function to create a result element from two matching elements.
         *
         * @example
         *   var iterable =
         *       asEnumerable(people).Join(pets,
         *           person => person,
         *           pet => pet.Owner,
         *           (person, pet) => {
         *               return person.Name + " - " + pet.Name;
         *           });
         */
        Join<I, TKey, R>(inner: Iterable<I>, oSelector: (T) => TKey, iSelector: (I) => TKey, transform: (T, I) => R): Linq<R>;
        /**
         * Sorts the elements of a sequence in ascending order by using a specified  comparer.
         *
         * @param keySelect A function to extract a key from an element.
         * @param equal An IComparer<T> to compare keys.
         *
         * @example
         *     var e = asEnumerable(jsn).OrderBy(a=> a.name);
         */
        OrderBy<K>(keySelect?: (T: T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        /**
         * Sorts the elements of a sequence in descending order by using a specified comparer.
         *
         * @param keySelect A function to extract a key from an element.
         * @param equal An IComparer<T> to compare keys.
         *
         * @example
         *     var e = asEnumerable(jsn).OrderByDescending(a=> a.name);
         */
        OrderByDescending<K>(keySelect?: (T: T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        /**
         * Performs a subsequent ordering of the elements in a sequence in ascending order by using a specified comparer.
         *
         * @param keySelect A function to extract a key from an element.
         * @param equal An IComparer<T> to compare keys.
         *
         * @example
         *   var iterable: any = asEnumerable(fruits)
         *                       .OrderBy(fruit=> fruit.length)
         *                       .ThenBy(fruit=> fruit.charCodeAt(0))
         *                       .ThenBy(fruit=> fruit.charCodeAt(4));
         */
        ThenBy<K>(keySelect?: (T: T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        /**
         * Performs a subsequent ordering of the elements in a sequence in descending order by using a specified comparer.
         *
         * @param keySelect A function to extract a key from an element.
         * @param equal An IComparer<T> to compare keys.
         *
         * @example
         *   var iterable: any = asEnumerable(fruits)
         *                       .OrderBy(fruit=> fruit.length)
         *                       .ThenByDescending(fruit=> fruit.charCodeAt(0))
         *                       .ThenByDescending(fruit=> fruit.charCodeAt(4));
         */
        ThenByDescending<K>(keySelect?: (T: T) => K, equal?: (a: K, b: K) => number): Linq<T>;
        /**
         * Returns count of numbers beginning from start
         *
         * @param start First value in sequence.
         * @param count Number of elements to iteratel.
         *
         * @example
         *     var sum = asEnumerable().Range(0, 7).Sum();
         */
        Range<T>(start: T, count: number): Linq<T>;
        /**
         * Generates a sequence that contains one repeated value.
         *
         * @param start First value in sequence.
         * @param count Number of elements to iteratel.
         *
         * @example
         *     var sum = asEnumerable().Repeat("v", 7);
         */
        Repeat(element: T, count: number): Linq<T>;
        /**
         * Inverts the order of the elements in a sequence.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Reverse();
         */
        Reverse(): Linq<T>;
        /**
         * Projects each element of a sequence into a new form by incorporating the element's index.
         *
         * @param transform A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
         *
         * @example
         * var array = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Select((a, idx) => a * idx);
         */
        Select<V>(transform: (T: T, number?) => V): Linq<V>;
        /**
         * Projects each element of a sequence to an Iterable<T>, flattens the resulting sequences into one sequence, and invokes a result selector
         * function on each element therein. The index of each source element is used in the intermediate projected form of that element.
         *
         * @param selector A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
         * @param result A transform function to apply to each element of the intermediate sequence.
         *
         * @example
         *     var iterable = asEnumerable(jsn).SelectMany(a => a.ids, b => b);
         */
        SelectMany<S, V>(selector?: (T: T, number) => Iterable<S>, result?: (T: T, S) => V): Linq<V>;
        /**
         * Bypasses a specified number of elements in a sequence and then returns
         * the remaining elements.
         *
         * @param skip The number of elements to skip before returning the remaining elements.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Skip(3);
         */
        Skip(skip: number): Linq<T>;
        /**
         * Bypasses elements in a sequence as long as a specified condition is true
         * and then returns the remaining elements. The element's index is used in
         * the logic of the predicate function.
         *
         * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).SkipWhile((amount, index) => amount > index * 1000);
         */
        SkipWhile(predicate?: (T: T, number) => boolean): Linq<T>;
        /**
         * Returns a specified number of contiguous elements from the start of a
         * sequence.
         *
         * @param take The number of elements to return.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Take(3);
         */
        Take(take: number): Linq<T>;
        /**
         * Returns elements from a sequence as long as a specified condition is true.
         * The element's index is used in the logic of the predicate function.
         *
         * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).TakeWhile(a=> a < 4);
         */
        TakeWhile(predicate: (T: T, number) => boolean): Linq<T>;
        /**
         * Produces the set union of two sequences. Union returns only unique values.
         *
         * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Union([5,6,7,8,9]);
         */
        Union(second: Iterable<T>): Linq<T>;
        /**
         * Filters a sequence of values based on a predicate.
         *
         * @param predicate A function to test each source element for a condition;
         * the second parameter of the function represents the index of the source element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Where(a => a % 2 == 1)
         *     var j = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Where((a,i) => a * i % 2 == 1)
         */
        Where(predicate?: (T: T, number?) => Boolean): Linq<T>;
        /**
         * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
         *
         * @param second The second input sequence.
         * @param func A function that specifies how to combine the corresponding elements of the two sequences.
         *
         * @example
         *     var e = asEnumerable(numbers).Zip(words, (first, second) => first + " " + second);
         */
        Zip<V, Z>(second: Iterable<V>, func: (T: T, V) => Z): Linq<Z>;
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
