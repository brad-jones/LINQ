module TsLinq
{
    export class Linq<T> implements Iterable<T>, IEnumerable<T>
    {
        protected _target: Iterable<T>|IEnumerable<T>;
        protected _factory: Function;
        protected _factoryArg: any;
        protected _initialize: Function;

        public constructor(target: Iterable<any>|IEnumerable<any>, factory?: Function, arg?: any)
        {
            this._target = target;
            this._factory = factory;
            this._factoryArg = arg;
        }

        /** Returns JavaScript iterator */
        public [Symbol.iterator](): Iterator<T>
        {
            return (null != this._factory) ? this._factory(this._factoryArg)
                 : (null != this._target)  ? this._target[Symbol.iterator]()
                    : { next: () => { return {done: true, value: undefined}; }};
        }

        /** Returns C# style enumerator */
        public GetEnumerator(): IEnumerator<T>
        {
            return new Enumerator<T>(this[Symbol.iterator]());
        }

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
        public Aggregate<A, B>(seed: A, func: (A, T) => A, resultSelector: (A) => B = Constants.SELF_FN): B
        {
            var result: A = seed;
            var res, iterator: Iterator<T> = this[Symbol.iterator]();

            while (!(res = iterator.next()).done)
            {
                result = func(result, res.value);
            }

            return resultSelector(result);
        }

        /**
         * Determines whether all elements of a sequence satisfy a condition.
         *
         * @returns True is all elements satisfy criteria.
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e:boolean = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).All((a) => a > 0);
         */
        public All(predicate: (T: T) => boolean = Constants.TRUE_FN)
        {
            var result, iterator: Iterator<T> = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (!predicate(result.value))
                {
                    return false;
                }
            }

            return true;
        }

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
        public Any(predicate?: (T: T) => boolean)
        {
            var result, iterator: Iterator<T> = this[Symbol.iterator]();
            // Check if at least one exist
            if (null == predicate)
            {
                return !iterator.next().done;
            }

            // Check if any satisfy the criteria
            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    return true;
                }
            }

            return false;
        }

        /**
         * Computes the average of a sequence of Number values that are obtained by
         * invoking a transform function on each element of the input sequence.
         *
         * @param func A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable(['5', '6', '7']).Average(a=>eval(a));
         */
        public Average(func: (T: T) => number = Constants.SELF_FN): number
        {
            var result, sum = 0, count = 0;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                sum += result.value;
                count++;
            }

            return sum / count;
        }

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
        public Contains(value: T, equal: (a: T, b: T) => boolean = (a, b) => a === b): boolean
        {
            var result, iterator: Iterator<T> = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (equal(value, result.value))
                {
                    return true;
                }
            }

            return false;
        }

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
        public Count(predicate: (T: T) => boolean = Constants.TRUE_FN): number
        {
            var result, count = 0;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    count++;
                }
            }

            return count;
        }

        /**
         * Invokes a transform function on each element of a sequence and returns
         * the maximum value.
         *
         * @param transform A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Max();
         */
        public Max(transform: (T: T) => number = Constants.SELF_FN): number
        {
            var result, value, max, hasValue = false;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                value = transform(result.value);

                if (hasValue)
                {
                    if (max < value) max = value;
                }
                else
                {
                    max = value;
                    hasValue = true;
                }
            }

            if (!hasValue) throw Constants.NO_ELEMENTS;

            return max;
        }

        /**
         * Invokes a transform function on each element of a sequence and returns the minimum Decimal value.
         *
         * @param transform A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Min()
         */
        public Min(transform: (T: T) => number = Constants.SELF_FN): number
        {
            var result, value, min, hasValue = false;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                value = transform(result.value);

                if (hasValue)
                {
                    if (min > value) min = value;
                }
                else
                {
                    min = value;
                    hasValue = true;
                }
            }

            if (!hasValue) throw Constants.NO_ELEMENTS;

            return min;
        }

        /**
         * Returns the element at a specified index in a sequence.
         *
         * @param index The zero-based index of the element to retrieve.
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).ElementAt(3);
         */
        public ElementAt(index: number): T
        {
            var result, count = 0;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (index === count++)
                {
                    return result.value;
                }
            }

            throw "Argument Out Of Range";
        }

        /**
         * Returns the element at a specified index in a sequence or a default
         * value if the index is out of range.
         *
         * @param index The zero-based index of the element to retrieve.
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).ElementAtOrDefault(31);
         */
        public ElementAtOrDefault(index: number): T
        {
            var result, value, count = 0;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (index === count++)
                {
                    return result.value;
                }

                value = result.value;
            }

            return Constants.DEFAULT_VALUE(typeof value); // Last good value
        }

        /**
         * Returns the first element in a sequence that satisfies a specified condition.
         * Throws an exception if no matching element is found in source.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).First(a => a > 2);
         */
        public First(predicate: (T: T) => boolean = Constants.TRUE_FN): T
        {
            var result;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    return result.value;
                }
            }

            throw Constants.NOTHING_FOUND;
        }

        /**
         * Returns the first element of the sequence that satisfies a condition or a
         * default value if no such element is found.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).FirstOrDefault(a => a > 2);
         */
        public FirstOrDefault(predicate: (T: T) => boolean = Constants.TRUE_FN): T
        {
            var result, value;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                value = result.value;

                if (predicate(value))
                {
                    return result.value;
                }
            }

            return Constants.DEFAULT_VALUE(typeof value); // Last good value
        }

        /**
         * Returns the last element of a sequence that satisfies a specified condition.
         * Throws an exception if no matching element is found in source.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Last();
         */
        public Last(predicate: (T: T) => boolean = Constants.TRUE_FN): T
        {
            var result, value, found = false;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    value = result.value;
                    found = true;
                }
            }

            if (!found) throw Constants.NOTHING_FOUND;

            return value;
        }

        /**
         * Returns the last element of a sequence that satisfies a condition or a default value if no such element is found.
         *
         * @param predicate A function to test each element for a condition.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).LastOrDefault();
         */
        public LastOrDefault(predicate: (T: T) => boolean = Constants.TRUE_FN): T
        {
            var result, value, lastKnown, found = false;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    value = result.value;
                    found = true;
                }

                lastKnown = result.value;
            }

            return (found) ? value : Constants.DEFAULT_VALUE(typeof lastKnown);
        }

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
        public SequenceEqual(other: Iterable<T>, equal: (a: T, b: T) => boolean = (a, b) => a === b): boolean
        {
            var res1, res2;
            var it1 = this[Symbol.iterator]();
            var it2 = other[Symbol.iterator]();

            do
            {
                res1 = it1.next(); res2 = it2.next();

                if ((res1.done != res2.done) || !equal(res1.value, res2.value))
                {
                    return false;
                }
            }
            while (!(res1.done) && !(res2.done));

            return true;
        }

        /**
         * Returns the only element of a sequence that satisfies a specified condition, and throws an exception if more than one such element exists.
         *
         * @param predicate A function to test an element for a condition.
         *
         * @example
         *     var e = asEnumerable([4]).Single();
         */
        public Single(predicate: (T: T) => boolean = Constants.TRUE_FN): T
        {
            var value, hasValue = false;
            var result, iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    if (!hasValue)
                    {
                        value = result.value;
                        hasValue = true;
                    }
                    else
                    {
                        throw Constants.TOO_MANY;
                    }
                }
            }

            if (hasValue) return value;

            throw Constants.NOTHING_FOUND;
        }

        /**
         * Returns the only element of a sequence that satisfies a specified condition or a default value if no such element exists; this method
         * Throws an exception if more than one element satisfies the condition.
         *
         * @param predicate A function to test an element for a condition.
         *
         * @example
         *     var e = asEnumerable([4]).SingleOrDefault();
         */
        public SingleOrDefault(predicate: (T: T) => boolean = Constants.TRUE_FN): T
        {
            var value, lastKnown, hasValue = false;
            var result, iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                if (predicate(result.value))
                {
                    if (!hasValue)
                    {
                        value = result.value;
                        hasValue = true;
                    }
                    else
                    {
                        throw Constants.TOO_MANY;
                    }
                }

                lastKnown = result.value;
            }

            return (hasValue) ? value : Constants.DEFAULT_VALUE(typeof lastKnown);
        }

        /**
         * Computes the sum of the sequence of Decimal values that are obtained by
         * invoking a transform function on each element of the input sequence.
         *
         * @param transform A transform function to apply to each element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Sum();
         */
        public Sum(transform: (T: T) => number = Constants.SELF_FN): number
        {
            var result, sum: number = 0;
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                sum += result.value;
            }

            return sum;
        }

        /**
         * Converts Iterable to Array<T>
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).ToArray();
         */
        public ToArray(): Array<T>
        {
            var result, array = [];
            var iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                array.push(result.value);
            }

            return array;
        }

        /**
         * Creates a Map< TKey, TValue > from an IEnumerable< T > according
         * to a specified key selector function, a comparer, and an element selector
         * function.
         *
         * @param keySelector A function to extract a key from each element.
         * @param elementSelector A transform function to produce a result element value from each element.
         */
        public ToMap<TKey, TElement>(keySelector: (T: T) => TKey, elementSelector: (T: T) => TElement = Constants.SELF_FN): Map<TKey, TElement>
        {
            var dictionary = new Map<TKey, TElement>();
            var result, iterator = this[Symbol.iterator]();

            while (!(result = iterator.next()).done)
            {
                dictionary.set
                (
                    keySelector(result.value),
                    elementSelector(result.value)
                );
            }

            return dictionary;
        }

        // Alias for above
        public ToDictionary = this.ToMap;

        /**
         * Returns the elements of the specified sequence or the specified value in
         * a singleton collection if the sequence is empty.
         *
         * @param defaultValue The value to return if the sequence is empty
         *
         * @example
         *     var e:number = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).DefaultIfEmpty(0);
         */
        public DefaultIfEmpty(defaultValue: T = undefined): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.DefaultIfEmptyIteratror
            (
                this._target[Symbol.iterator](),
                defaultValue
            ));
        }

        public Cast<V>(): Linq<V>
        {
            return new Linq<V>(this, () => new Iterators.SelectIteratror
            (
                this._target[Symbol.iterator](),
                (a) => <V>a
            ));
        }

        /**
         * Concatenates two sequences.
         *
         * @param second The sequence to concatenate to the first sequence.
         *
         * @example
         *     var enumerable = asEnumerable([3, 4, 5, 6, 7]).Concat([1,2,8]);
         */
        public Concat(second: Iterable<T>): Linq<T>
        {
            var aggregate = [this._target, second];
            return new Linq<T>(this, () => new Iterators.SelectManyIteratror
            (
                aggregate[Symbol.iterator](),
                Constants.SELF_FN,
                Constants.SELF_FN
            ));
        }

        /**
         * Returns distinct elements from a sequence by using the default equality
         * comparer to compare values.
         *
         * @example
         *     var enumerable = asEnumerable([1, 1, 2, 2, 4, 5, 6, 7]).Distinct();
         */
        public Distinct(): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.DistinctIteratror
            (
                this._target[Symbol.iterator]()
            ));
        }

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
        public Except(other: Iterable<T>): Linq<T>
        {
            var _set: Set<T> = new Set<T>();
            var result, otherIterator = other[Symbol.iterator]();

            while (!(result = otherIterator.next()).done)
            {
                _set.add(result.value);
            }

            return new Linq<T>(this, () => new Iterators.IntersectIteratror
            (
                this._target[Symbol.iterator](),
                _set,
                true
            ));
        }

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
        public GroupBy<K, E, R>(selKey: (T: T) => K, selElement: (T: T) => E, selResult: (a: K, b: Iterable<E>) => R = Constants.DEFAULT_GROUPING): Linq<R>
        {
            var result: IteratorResult<T>;
            var iterator: Iterator<T> = this[Symbol.iterator]();
            var _map = new Map<K, Array<E>>();

            while (!(result = iterator.next()).done)
            {
                var key = selKey(result.value);
                var group: Array<E> = _map.get(key);

                if ('undefined' === typeof group)
                {
                    group = [];
                    _map.set(key, group);
                }

                group.push(selElement(result.value));
            }

            var factory = () => new Iterators.GroupByIteratror
            (
                _map.keys(),
                selResult,
                _map
            );

            var tst = factory();

            return new Linq<R>(this, () => new Iterators.GroupByIteratror
            (
                _map.keys(),
                selResult,
                _map
            ));
        }

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
        public GroupJoin<I, K, R>(inner: Iterable<I>, oKeySelect: (T) => K, iKeySelect: (I) => K, resultSelector: (a: T, b: Iterable<I>) => R = Constants.DEFAULT_GROUPING): Linq<R>
        {
            var _map = new Map<K, Array<I>>();
            var _inner = inner[Symbol.iterator]();
            var result: IteratorResult<I>;

            while (!(result = _inner.next()).done)
            {
                var key = iKeySelect(result.value);

                if ('undefined' === typeof key) throw "Inner Key selector returned undefined Key";

                var group: Array<I> = _map.get(key);

                if ('undefined' === typeof group)
                {
                    group = [];
                    _map.set(key, group);
                }

                group.push(result.value);
            }

            return new Linq<R>(this, () => new Iterators.GroupJoinIteratror
            (
                this._target[Symbol.iterator](),
                oKeySelect,
                resultSelector,
                _map
            ));
        }

        /**
         * Produces the intersection of two sequences.
         *
         * @param An Iterable<T> whose distinct elements that also appear in the first sequence will be returned.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Intersect([1, 3, 5, 11, 23, 44]);
         */
        public Intersect(other: Iterable<T>): Linq<T>
        {
            var _set: Set <T> = new Set<T>();
            var result, otherIterator = other[Symbol.iterator]();

            while (!(result = otherIterator.next()).done)
            {
                _set.add(result.value);
            }

            return new Linq<T>(this, () => new Iterators.IntersectIteratror
            (
                this._target[Symbol.iterator](),
                _set
            ));
        }

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
        public Join<I, TKey, R>(inner: Iterable<I>, oSelector: (T) => TKey, iSelector: (I) => TKey, transform: (T, I) => R): Linq<R>
        {
            return new Linq<R>(this, () => new Iterators.JoinIteratror<T, I, TKey, R>
            (
                this._target[Symbol.iterator](),
                inner[Symbol.iterator](),
                oSelector,
                iSelector,
                transform
            ));
        }

        /**
         * Sorts the elements of a sequence in ascending order by using a specified  comparer.
         *
         * @param keySelect A function to extract a key from an element.
         * @param equal An IComparer<T> to compare keys.
         *
         * @example
         *     var e = asEnumerable(jsn).OrderBy(a=> a.name);
         */
        public OrderBy<K>(keySelect: (T: T) => K = Constants.SELF_FN, equal: (a: K, b: K) => number = (a, b) => <any>a - <any>b): Linq<T>
        {
            return new OrderedLinq<T>
            (
                this,
                (array) => new Iterators.ArrayIterator(array, 0, (i) => i >= array.length),
                (a: T, b: T) => equal(keySelect(a), keySelect(b))
            );
        }

        /**
         * Sorts the elements of a sequence in descending order by using a specified comparer.
         *
         * @param keySelect A function to extract a key from an element.
         * @param equal An IComparer<T> to compare keys.
         *
         * @example
         *     var e = asEnumerable(jsn).OrderByDescending(a=> a.name);
         */
        public OrderByDescending<K>(keySelect: (T: T) => K = Constants.SELF_FN, equal: (a: K, b: K) => number = (a, b) => <any>a - <any>b): Linq<T>
        {
            return new OrderedLinq<T>
            (
                this,
                (array) => new Iterators.ArrayIterator(array, array.length - 1, (i) => 0 > i, -1),
                (a: T, b: T) => equal(keySelect(a), keySelect(b))
            );
        }

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
        public ThenBy<K>(keySelect: (T: T) => K = Constants.SELF_FN, equal: (a: K, b: K) => number = (a, b) => <any>a - <any>b): Linq<T>
        {
            if (this instanceof OrderedLinq)
            {
                var superEqual = (<any>this).equal;

                (<any>this).equal = (a: T, b: T) =>
                {
                    var result: number = superEqual(a, b);
                    return (0 != result) ? result : equal(keySelect(a), keySelect(b));
                }

                return this;
            }
            else
            {
                return new OrderedLinq<T>
                (
                    this,
                    (array) => new Iterators.ArrayIterator(array, 0, (i) => i >= array.length),
                    (a: T, b: T) => equal(keySelect(a), keySelect(b))
                );
            }
        }

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
        public ThenByDescending<K>(keySelect: (T: T) => K = Constants.SELF_FN, equal: (a: K, b: K) => number = (a, b) => <any>a - <any>b): Linq<T>
        {
            if (this instanceof OrderedLinq)
            {
                var superEqual = (<any>this).equal;

                (<any>this).equal = (a: T, b: T) =>
                {
                    var result: number = superEqual(a, b);
                    return (0 != result) ? result : equal(keySelect(a), keySelect(b));
                }

                return this;
            }
            else
            {
                return new OrderedLinq<T>
                (
                    this,
                    (array) => new Iterators.ArrayIterator(array, array.length - 1, (i) => 0 > i, -1),
                    (a: T, b: T) => equal(keySelect(a), keySelect(b))
                );
            }
        }

        /**
         * Returns count of numbers beginning from start
         *
         * @param start First value in sequence.
         * @param count Number of elements to iteratel.
         *
         * @example
         *     var sum = asEnumerable().Range(0, 7).Sum();
         */
        public Range<T>(start: T, count: number): Linq<T>
        {
            return new Linq<T>(null, () => new Iterators.GeneratorIterator
            (
                start,
                count,
                true
            ));
        }

        /**
         * Generates a sequence that contains one repeated value.
         *
         * @param start First value in sequence.
         * @param count Number of elements to iteratel.
         *
         * @example
         *     var sum = asEnumerable().Repeat("v", 7);
         */
        public Repeat(element: T, count: number): Linq<T>
        {
            return new Linq<T>(null, () => new Iterators.GeneratorIterator
            (
                element,
                count
            ));
        }

        /**
         * Inverts the order of the elements in a sequence.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Reverse();
         */
        public Reverse(): Linq<T>
        {
            var array: Array<T> = Array.isArray(this._target) ? <Array<T>>this._target : this.ToArray();

            return new Linq<T>(null, () => new Iterators.ArrayIterator
            (
                array,
                array.length - 1,
                (i) => 0 > i,
                -1
            ));
        }

        /**
         * Projects each element of a sequence into a new form by incorporating the element's index.
         *
         * @param transform A transform function to apply to each source element; the second parameter of the function represents the index of the source element.
         *
         * @example
         * var array = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Select((a, idx) => a * idx);
         */
        public Select<V>(transform: (T: T, number?) => V): Linq<V>
        {
            return new Linq<V>(this, () => new Iterators.SelectIteratror
            (
                this._target[Symbol.iterator](),
                transform
            ));
        }

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
        public SelectMany<S, V>(selector: (T: T, number) => Iterable<S> = Constants.SELF_FN, result: (T: T, S) => V = Constants.SELF_FN): Linq<V>
        {
            return new Linq<V>(this, () => new Iterators.SelectManyIteratror
            (
                this._target[Symbol.iterator](),
                selector,
                result
            ));
        }

        /**
         * Bypasses a specified number of elements in a sequence and then returns
         * the remaining elements.
         *
         * @param skip The number of elements to skip before returning the remaining elements.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Skip(3);
         */
        public Skip(skip: number): Linq<T>
        {
            var iterator = this._target[Symbol.iterator]();
            for (var i = 0; i < skip; i++) iterator.next();
            return new Linq<T>(this, () => new Iterators.WhereIteratror
            (
                iterator,
                Constants.TRUE_FN
            ));
        }

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
        public SkipWhile(predicate: (T: T, number) => boolean = (a, n) => false): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.SkipIterator
            (
                this._target[Symbol.iterator](),
                predicate
            ));
        }

        /**
         * Returns a specified number of contiguous elements from the start of a
         * sequence.
         *
         * @param take The number of elements to return.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Take(3);
         */
        public Take(take: number): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.TakeIterator
            (
                this._target[Symbol.iterator](),
                (a, n) => take > n
            ));
        }

        /**
         * Returns elements from a sequence as long as a specified condition is true.
         * The element's index is used in the logic of the predicate function.
         *
         * @param predicate A function to test each source element for a condition; the second parameter of the function represents the index of the source element.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).TakeWhile(a=> a < 4);
         */
        public TakeWhile(predicate: (T: T, number) => boolean): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.TakeIterator
            (
                this._target[Symbol.iterator](),
                predicate
            ));
        }

        /**
         * Produces the set union of two sequences. Union returns only unique values.
         *
         * @param second An IEnumerable<T> whose distinct elements form the second set for the union.
         *
         * @example
         *     var e = asEnumerable([0, 1, 2, 3, 4, 5, 6, 7]).Union([5,6,7,8,9]);
         */
        public Union(second: Iterable<T>): Linq<T>
        {
            var aggregate = [this._target, second];
            return new Linq<T>(this, () => new Iterators.UnionIteratror
            (
                aggregate[Symbol.iterator]()
            ));
        }

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
        public Where(predicate: (T: T, number?) => Boolean = Constants.TRUE_FN): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.WhereIteratror
            (
                this._target[Symbol.iterator](),
                predicate
            ));
        }

        /**
         * Applies a specified function to the corresponding elements of two sequences, producing a sequence of the results.
         *
         * @param second The second input sequence.
         * @param func A function that specifies how to combine the corresponding elements of the two sequences.
         * 
         * @example
         *     var e = asEnumerable(numbers).Zip(words, (first, second) => first + " " + second);
         */
        public Zip<V, Z>(second: Iterable<V>, func: (T: T, V) => Z): Linq<Z>
        {
            return new Linq<Z>(this, () => new Iterators.ZipIteratror
            (
                this._target[Symbol.iterator](),
                second[Symbol.iterator](),
                func
            ));
        }
    }
}
