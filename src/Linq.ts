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

        public ToDictionary<TKey, TElement>(keySelector: (T: T) => TKey, elementSelector: (T: T) => TElement = Constants.SELF_FN): Map<TKey, TElement>
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
        public ToMap = this.ToDictionary;

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

        public Distinct(): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.DistinctIteratror
            (
                this._target[Symbol.iterator]()
            ));
        }

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

        public OrderBy<K>(keySelect: (T: T) => K = Constants.SELF_FN, equal: (a: K, b: K) => number = (a, b) => <any>a - <any>b): Linq<T>
        {
            return new OrderedLinq<T>
            (
                this,
                (array) => new Iterators.ArrayIterator(array, 0, (i) => i >= array.length),
                (a: T, b: T) => equal(keySelect(a), keySelect(b))
            );
        }

        public OrderByDescending<K>(keySelect: (T: T) => K = Constants.SELF_FN, equal: (a: K, b: K) => number = (a, b) => <any>a - <any>b): Linq<T>
        {
            return new OrderedLinq<T>
            (
                this,
                (array) => new Iterators.ArrayIterator(array, array.length - 1, (i) => 0 > i, -1),
                (a: T, b: T) => equal(keySelect(a), keySelect(b))
            );
        }

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

        public Range<T>(start: T, count: number): Linq<T>
        {
            return new Linq<T>(null, () => new Iterators.GeneratorIterator
            (
                start,
                count,
                true
            ));
        }

        public Repeat(element: T, count: number): Linq<T>
        {
            return new Linq<T>(null, () => new Iterators.GeneratorIterator
            (
                element,
                count
            ));
        }

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

        public Select<V>(transform: (T: T, number?) => V): Linq<V>
        {
            return new Linq<V>(this, () => new Iterators.SelectIteratror
            (
                this._target[Symbol.iterator](),
                transform
            ));
        }

        public SelectMany<S, V>(selector: (T: T, number) => Iterable<S> = Constants.SELF_FN, result: (T: T, S) => V = Constants.SELF_FN): Linq<V>
        {
            return new Linq<V>(this, () => new Iterators.SelectManyIteratror
            (
                this._target[Symbol.iterator](),
                selector,
                result
            ));
        }

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

        public SkipWhile(predicate: (T: T, number) => boolean = (a, n) => false): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.SkipIterator
            (
                this._target[Symbol.iterator](),
                predicate
            ));
        }

        public Take(take: number): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.TakeIterator
            (
                this._target[Symbol.iterator](),
                (a, n) => take > n
            ));
        }

        public TakeWhile(predicate: (T: T, number) => boolean): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.TakeIterator
            (
                this._target[Symbol.iterator](),
                predicate
            ));
        }

        public Union(second: Iterable<T>): Linq<T>
        {
            var aggregate = [this._target, second];
            return new Linq<T>(this, () => new Iterators.UnionIteratror
            (
                aggregate[Symbol.iterator]()
            ));
        }

        public Where(predicate: (T: T, number?) => Boolean = Constants.TRUE_FN): Linq<T>
        {
            return new Linq<T>(this, () => new Iterators.WhereIteratror
            (
                this._target[Symbol.iterator](),
                predicate
            ));
        }

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
