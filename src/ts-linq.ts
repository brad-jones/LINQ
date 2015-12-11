module TsLinq
{
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
    export function asEnumerable<T>(TSource: Iterable<T>|IEnumerable<T> = null): Linq<T>
    {
        return new Linq<T>(TSource);
    }

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
    export function Range<T>(start: T, count: number): Linq<T>
    {
        return new Linq<T>(null, () => new Iterators.GeneratorIterator
        (
            start,
            count,
            true
        ));
    }

    /**
     * Repeat element <start> of type T <count> of times.
     *
     * @param start First value in sequence.
     * @param count Number of elements to iteratel.
     *
     * @example
     *     var sum = Repeat("v", 7);
     */
    export function Repeat<T>(start: T, count: number): Linq<T>
    {
        return new Linq<T>(null, () => new Iterators.GeneratorIterator
        (
            start,
            count
        ));
    }
}

declare module "ts-linq"
{
    export = TsLinq;
}
