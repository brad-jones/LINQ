import "babel-polyfill";
import {assert} from "chai";
import {asEnumerable, Range} from "ts-linq";

var jsn = [
    { "ids": [11, 21, 31], "name": "d" },
    { "ids": [12, 22, 32], "name": "c" },
    { "ids": [13, 23, 33], "name": "b" },
    { "ids": [14, 24, 34], "name": "a" }
];

describe('Enumerable - ', function () {

    it('GetEnumerator()', function () {

        var enumerable = asEnumerable(jsn).SelectMany(a => a.ids, b => b);
        var enumerator = enumerable.GetEnumerator();

        assert.isTrue(enumerator.MoveNext());
        assert.equal(11, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(21, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(31, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(12, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(22, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(32, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(13, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(23, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(33, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(14, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(24, enumerator.Current);
        assert.isTrue(enumerator.MoveNext());
        assert.equal(34, enumerator.Current);
        assert.isFalse(enumerator.MoveNext());
    });

    it('Enumerate()', function () {

        var enumerable = Range(0, 100);
        var enumerator = enumerable.GetEnumerator();
        var index = 0
        while (enumerator.MoveNext()) {
            assert.equal(index++, enumerator.Current);
        }
    });

});
