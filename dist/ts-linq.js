;(function(root, factory) {
  if (typeof define === 'function' && define.amd) {
    define(['babel-polyfill'], factory);
  } else if (typeof exports === 'object') {
    module.exports = factory(require('babel-polyfill'));
  } else {
    root.TsLinq = factory(root._babelPolyfill);
  }
}(this, function(babel) {
'use strict';

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var TsLinq;
(function (TsLinq) {
    var Constants;
    (function (Constants) {
        /** Default predicate, always true */
        Constants.TRUE_FN = function () {
            return true;
        };
        /** Default transformer, returns self */
        Constants.SELF_FN = function (o) {
            return o;
        };
        /** Default Grouping */
        Constants.DEFAULT_GROUPING = function (a, b) {
            if ('undefined' != typeof b['key']) {
                throw "Object already has property [key]";
            }
            b['key'] = a;
            return b;
        };
        /** Returns default value for the type */
        Constants.DEFAULT_VALUE = function (type) {
            // Handle simple types (primitives and plain function/object)
            switch (type) {
                case 'boolean':
                    return false;
                case 'function':
                    return function () {};
                case 'null':
                    return null;
                case 'number':
                    return 0;
                case 'object':
                    return {};
                case 'string':
                    return "";
                case 'symbol':
                    return Symbol();
                case 'undefined':
                    return void 0;
            }
            try {
                // Grab the global scope.
                // @see: http://goo.gl/Wr6jnG
                var globalScope = (function () {
                    return this || (1, eval)('this');
                })();
                // Look for constructor in the global scope
                var ctor;
                if (typeof globalScope[type] === 'function') {
                    ctor = globalScope[type];
                } else {
                    ctor = eval(type);
                }
                return new ctor();
            } catch (e) {
                return {};
            }
        };
        Constants.NOTHING_FOUND = "No element satisfies the condition in predicate";
        Constants.NO_ELEMENTS = "The source sequence is empty.";
        Constants.TOO_MANY = "More than one element satisfies the condition in predicate.";
    })(Constants = TsLinq.Constants || (TsLinq.Constants = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    //  Gets Iterator and turns it into Enumerator

    var Enumerator = (function () {
        function Enumerator(sourceIterator) {
            _classCallCheck(this, Enumerator);

            this._iterator = sourceIterator;
        }
        /** Gets the current element in the collection. */

        _createClass(Enumerator, [{
            key: 'MoveNext',

            /** Advances the enumerator to the next element of the collection.*/
            value: function MoveNext() {
                this._result = this._iterator.next();
                return !this._result.done;
            }
            /** Sets the enumerator to its initial position, which is before the first
            * element in the collection. */

        }, {
            key: 'Reset',
            value: function Reset() {
                throw "JavaScript iterators could not be Reset";
            }
        }, {
            key: 'Current',
            get: function get() {
                return this._result.value;
            }
        }]);

        return Enumerator;
    })();

    TsLinq.Enumerator = Enumerator;
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var IteratorBase = function IteratorBase(_iterator) {
            _classCallCheck(this, IteratorBase);

            this._iterator = _iterator;
            this._done = { value: undefined, done: true };
        };

        Iterators.IteratorBase = IteratorBase;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var MethodIteratror = (function (_Iterators$IteratorBa) {
            _inherits(MethodIteratror, _Iterators$IteratorBa);

            function MethodIteratror(iterator) {
                var _method = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

                var _index = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];

                _classCallCheck(this, MethodIteratror);

                var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(MethodIteratror).call(this, iterator));

                _this._method = _method;
                _this._index = _index;
                return _this;
            }

            return MethodIteratror;
        })(Iterators.IteratorBase);

        Iterators.MethodIteratror = MethodIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var ArrayIterator = (function () {
            function ArrayIterator(_source, _current, _done) {
                var _increment = arguments.length <= 3 || arguments[3] === undefined ? 1 : arguments[3];

                _classCallCheck(this, ArrayIterator);

                this._source = _source;
                this._current = _current;
                this._done = _done;
                this._increment = _increment;
            }

            _createClass(ArrayIterator, [{
                key: 'next',
                value: function next(value) {
                    var result = { value: this._source[this._current], done: this._done(this._current) };
                    this._current += this._increment;
                    return result;
                }
            }]);

            return ArrayIterator;
        })();

        Iterators.ArrayIterator = ArrayIterator;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var DefaultIfEmptyIteratror = (function (_Iterators$IteratorBa2) {
            _inherits(DefaultIfEmptyIteratror, _Iterators$IteratorBa2);

            function DefaultIfEmptyIteratror(sourceIterator, _default) {
                _classCallCheck(this, DefaultIfEmptyIteratror);

                var _this2 = _possibleConstructorReturn(this, Object.getPrototypeOf(DefaultIfEmptyIteratror).call(this, sourceIterator));

                _this2._default = _default;
                return _this2;
            }

            _createClass(DefaultIfEmptyIteratror, [{
                key: 'next',
                value: function next(value) {
                    return this.check(this._iterator.next());
                }
            }, {
                key: 'check',
                value: function check(result) {
                    if (result.done) {
                        result.value = this._default;
                    } else {
                        this.check = function (a) {
                            return a;
                        };
                    }
                    return result;
                }
            }]);

            return DefaultIfEmptyIteratror;
        })(Iterators.IteratorBase);

        Iterators.DefaultIfEmptyIteratror = DefaultIfEmptyIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var DistinctIteratror = (function (_Iterators$IteratorBa3) {
            _inherits(DistinctIteratror, _Iterators$IteratorBa3);

            function DistinctIteratror() {
                var _Object$getPrototypeO;

                _classCallCheck(this, DistinctIteratror);

                for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
                    args[_key] = arguments[_key];
                }

                var _this3 = _possibleConstructorReturn(this, (_Object$getPrototypeO = Object.getPrototypeOf(DistinctIteratror)).call.apply(_Object$getPrototypeO, [this].concat(args)));

                _this3._set = new Set();
                return _this3;
            }

            _createClass(DistinctIteratror, [{
                key: 'next',
                value: function next(value) {
                    var result;
                    while (!(result = this._iterator.next()).done && this._set.has(result.value)) {}
                    this._set.add(result.value);
                    return result;
                }
            }]);

            return DistinctIteratror;
        })(Iterators.IteratorBase);

        Iterators.DistinctIteratror = DistinctIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var GeneratorIterator = (function (_Iterators$IteratorBa4) {
            _inherits(GeneratorIterator, _Iterators$IteratorBa4);

            function GeneratorIterator(_current, _count) {
                var _increment = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                _classCallCheck(this, GeneratorIterator);

                var _this4 = _possibleConstructorReturn(this, Object.getPrototypeOf(GeneratorIterator).call(this, null));

                _this4._current = _current;
                _this4._count = _count;
                _this4._increment = _increment;
                return _this4;
            }

            _createClass(GeneratorIterator, [{
                key: 'next',
                value: function next(value) {
                    var result = 0 < this._count ? { value: this._current, done: 0 >= this._count-- } : this._done;
                    if (this._increment) this._current++;
                    return result;
                }
            }]);

            return GeneratorIterator;
        })(Iterators.IteratorBase);

        Iterators.GeneratorIterator = GeneratorIterator;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var GroupByIteratror = (function (_Iterators$MethodIter) {
            _inherits(GroupByIteratror, _Iterators$MethodIter);

            function GroupByIteratror(iterator, resultSelect, _map) {
                _classCallCheck(this, GroupByIteratror);

                var _this5 = _possibleConstructorReturn(this, Object.getPrototypeOf(GroupByIteratror).call(this, iterator, resultSelect));

                _this5._map = _map;
                return _this5;
            }

            _createClass(GroupByIteratror, [{
                key: 'next',
                value: function next(value) {
                    var result = this._iterator.next();
                    if (result.done) return this._done;
                    var iterable = this._map.get(result.value);
                    return { value: this._method(result.value, iterable), done: false };
                }
            }]);

            return GroupByIteratror;
        })(Iterators.MethodIteratror);

        Iterators.GroupByIteratror = GroupByIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var GroupJoinIteratror = (function (_Iterators$MethodIter2) {
            _inherits(GroupJoinIteratror, _Iterators$MethodIter2);

            function GroupJoinIteratror(iterator, oKeySelect, _transform, _map) {
                _classCallCheck(this, GroupJoinIteratror);

                var _this6 = _possibleConstructorReturn(this, Object.getPrototypeOf(GroupJoinIteratror).call(this, iterator, oKeySelect));

                _this6._transform = _transform;
                _this6._map = _map;
                return _this6;
            }

            _createClass(GroupJoinIteratror, [{
                key: 'next',
                value: function next(value) {
                    var innerSet;
                    var result;
                    do {
                        result = this._iterator.next();
                        if (result.done) return this._done;
                        var key = this._method(result.value);
                        innerSet = this._map.get(key);
                    } while ('undefined' === typeof innerSet);
                    return {
                        value: this._transform(result.value, innerSet),
                        done: false
                    };
                }
            }]);

            return GroupJoinIteratror;
        })(Iterators.MethodIteratror);

        Iterators.GroupJoinIteratror = GroupJoinIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var IntersectIteratror = (function (_Iterators$IteratorBa5) {
            _inherits(IntersectIteratror, _Iterators$IteratorBa5);

            function IntersectIteratror(iterator, _set) {
                var _switch = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];

                _classCallCheck(this, IntersectIteratror);

                var _this7 = _possibleConstructorReturn(this, Object.getPrototypeOf(IntersectIteratror).call(this, iterator));

                _this7._set = _set;
                _this7._switch = _switch;
                return _this7;
            }

            _createClass(IntersectIteratror, [{
                key: 'next',
                value: function next(value) {
                    var result;
                    while (!(result = this._iterator.next()).done && this._switch == this._set.has(result.value)) {}
                    if (!this._switch) this._set.add(result.value);
                    return result;
                }
            }]);

            return IntersectIteratror;
        })(Iterators.IteratorBase);

        Iterators.IntersectIteratror = IntersectIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var SelectIteratror = (function (_Iterators$MethodIter3) {
            _inherits(SelectIteratror, _Iterators$MethodIter3);

            function SelectIteratror() {
                _classCallCheck(this, SelectIteratror);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(SelectIteratror).apply(this, arguments));
            }

            _createClass(SelectIteratror, [{
                key: 'next',
                value: function next(value) {
                    var result = this._iterator.next();
                    if (result.done) return result;
                    result.value = this._method(result.value, this._index++);
                    return result;
                }
            }]);

            return SelectIteratror;
        })(Iterators.MethodIteratror);

        Iterators.SelectIteratror = SelectIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var SelectManyIteratror = (function (_Iterators$MethodIter4) {
            _inherits(SelectManyIteratror, _Iterators$MethodIter4);

            function SelectManyIteratror(sourceIterator, selector) {
                var transform = arguments.length <= 2 || arguments[2] === undefined ? TsLinq.Constants.SELF_FN : arguments[2];

                _classCallCheck(this, SelectManyIteratror);

                var _this9 = _possibleConstructorReturn(this, Object.getPrototypeOf(SelectManyIteratror).call(this, sourceIterator, selector));

                _this9._collectionState = _this9._done;
                _this9._resultState = _this9._done;
                _this9._resultSelector = transform;
                return _this9;
            }

            _createClass(SelectManyIteratror, [{
                key: 'next',
                value: function next(value) {
                    do {
                        if (this._resultState.done) {
                            this._collectionState = this._iterator.next();
                            if (this._collectionState.done) return this._done;
                            this._collection = this._method(this._collectionState.value)[Symbol.iterator]();
                        }
                        this._resultState = this._collection.next();
                        if (!this._resultState.done) {
                            this._resultState.value = this._resultSelector(this._resultState.value);
                        }
                    } while (this._resultState.done);
                    return this._resultState;
                }
            }]);

            return SelectManyIteratror;
        })(Iterators.MethodIteratror);

        Iterators.SelectManyIteratror = SelectManyIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var JoinIteratror = (function (_Iterators$SelectMany) {
            _inherits(JoinIteratror, _Iterators$SelectMany);

            function JoinIteratror(outer, inner, oKeySelect, iKeySelect, transform) {
                _classCallCheck(this, JoinIteratror);

                var _this10 = _possibleConstructorReturn(this, Object.getPrototypeOf(JoinIteratror).call(this, outer, null));

                _this10._method = oKeySelect;
                var result;
                _this10._map = new Map();
                while (!(result = inner.next()).done) {
                    var key = iKeySelect(result.value);
                    var group = _this10._map.get(key);
                    if ('undefined' === typeof group) {
                        group = [];
                        _this10._map.set(key, group);
                    }
                    group.push(result.value);
                }
                _this10._resultSelector = transform;
                return _this10;
            }
            /** Gets the next element in the collection. */

            _createClass(JoinIteratror, [{
                key: 'next',
                value: function next(value) {
                    do {
                        if (this._resultState.done) {
                            this._collectionState = this._iterator.next();
                            if (this._collectionState.done) return this._done;
                            var key = this._method(this._collectionState.value);
                            var innerSet = this._map.get(key);
                            if ('undefined' === typeof innerSet) continue;
                            this._collection = innerSet[Symbol.iterator]();
                        }
                        this._resultState = this._collection.next();
                        if (!this._resultState.done) {
                            this._resultState.value = this._resultSelector(this._collectionState.value, this._resultState.value);
                        }
                    } while (this._resultState.done);
                    return this._resultState;
                }
            }]);

            return JoinIteratror;
        })(Iterators.SelectManyIteratror);

        Iterators.JoinIteratror = JoinIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var SkipIterator = (function (_Iterators$MethodIter5) {
            _inherits(SkipIterator, _Iterators$MethodIter5);

            function SkipIterator() {
                var _Object$getPrototypeO2;

                _classCallCheck(this, SkipIterator);

                for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
                    args[_key2] = arguments[_key2];
                }

                var _this11 = _possibleConstructorReturn(this, (_Object$getPrototypeO2 = Object.getPrototypeOf(SkipIterator)).call.apply(_Object$getPrototypeO2, [this].concat(args)));

                _this11._hasSkipped = false;
                return _this11;
            }

            _createClass(SkipIterator, [{
                key: 'next',
                value: function next(value) {
                    var result;
                    if (this._hasSkipped) return this._iterator.next();
                    while (!(result = this._iterator.next()).done && this._method(result.value, this._index++)) {}
                    this._hasSkipped = true;
                    return result;
                }
            }]);

            return SkipIterator;
        })(Iterators.MethodIteratror);

        Iterators.SkipIterator = SkipIterator;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var TakeIterator = (function (_Iterators$MethodIter6) {
            _inherits(TakeIterator, _Iterators$MethodIter6);

            function TakeIterator() {
                _classCallCheck(this, TakeIterator);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(TakeIterator).apply(this, arguments));
            }

            _createClass(TakeIterator, [{
                key: 'next',
                value: function next(value) {
                    var result = this._iterator.next();
                    if (result.done || !this._method(result.value, this._index++)) {
                        return this._done;
                    }
                    return result;
                }
            }]);

            return TakeIterator;
        })(Iterators.MethodIteratror);

        Iterators.TakeIterator = TakeIterator;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var Constants = TsLinq.Constants;

        var UnionIteratror = (function (_Iterators$SelectMany2) {
            _inherits(UnionIteratror, _Iterators$SelectMany2);

            function UnionIteratror(sourceIterator) {
                _classCallCheck(this, UnionIteratror);

                var _this13 = _possibleConstructorReturn(this, Object.getPrototypeOf(UnionIteratror).call(this, sourceIterator, Constants.SELF_FN));

                _this13._set = new Set();
                return _this13;
            }

            _createClass(UnionIteratror, [{
                key: 'next',
                value: function next(value) {
                    var result;
                    while (!(result = _get(Object.getPrototypeOf(UnionIteratror.prototype), 'next', this).call(this)).done && this._set.has(result.value)) {}
                    this._set.add(result.value);
                    return result;
                }
            }]);

            return UnionIteratror;
        })(Iterators.SelectManyIteratror);

        Iterators.UnionIteratror = UnionIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var WhereIteratror = (function (_Iterators$MethodIter7) {
            _inherits(WhereIteratror, _Iterators$MethodIter7);

            function WhereIteratror() {
                _classCallCheck(this, WhereIteratror);

                return _possibleConstructorReturn(this, Object.getPrototypeOf(WhereIteratror).apply(this, arguments));
            }

            _createClass(WhereIteratror, [{
                key: 'next',
                value: function next(value) {
                    var result;
                    do {
                        result = this._iterator.next();
                    } while (!result.done && !this._method(result.value, this._index++));
                    return result;
                }
            }]);

            return WhereIteratror;
        })(Iterators.MethodIteratror);

        Iterators.WhereIteratror = WhereIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Iterators;
    (function (Iterators) {
        var ZipIteratror = (function (_Iterators$MethodIter8) {
            _inherits(ZipIteratror, _Iterators$MethodIter8);

            function ZipIteratror(first, _second, func) {
                _classCallCheck(this, ZipIteratror);

                var _this15 = _possibleConstructorReturn(this, Object.getPrototypeOf(ZipIteratror).call(this, first, func));

                _this15._second = _second;
                return _this15;
            }

            _createClass(ZipIteratror, [{
                key: 'next',
                value: function next(value) {
                    var first = this._iterator.next();
                    var second = this._second.next();
                    if (first.done || second.done) {
                        return this._done;
                    }
                    return {
                        done: false,
                        value: this._method(first.value, second.value)
                    };
                }
            }]);

            return ZipIteratror;
        })(Iterators.MethodIteratror);

        Iterators.ZipIteratror = ZipIteratror;
    })(Iterators = TsLinq.Iterators || (TsLinq.Iterators = {}));
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var Linq = (function () {
        function Linq(target, factory, arg) {
            _classCallCheck(this, Linq);

            // Alias for above
            this.ToMap = this.ToDictionary;
            this._target = target;
            this._factory = factory;
            this._factoryArg = arg;
        }
        /** Returns JavaScript iterator */

        _createClass(Linq, [{
            key: Symbol.iterator,
            value: function value() {
                return null != this._factory ? this._factory(this._factoryArg) : null != this._target ? this._target[Symbol.iterator]() : { next: function next() {
                        return { done: true, value: undefined };
                    } };
            }
            /** Returns C# style enumerator */

        }, {
            key: 'GetEnumerator',
            value: function GetEnumerator() {
                return new TsLinq.Enumerator(this[Symbol.iterator]());
            }
        }, {
            key: 'Aggregate',
            value: function Aggregate(seed, func) {
                var resultSelector = arguments.length <= 2 || arguments[2] === undefined ? TsLinq.Constants.SELF_FN : arguments[2];

                var result = seed;
                var res,
                    iterator = this[Symbol.iterator]();
                while (!(res = iterator.next()).done) {
                    result = func(result, res.value);
                }
                return resultSelector(result);
            }
        }, {
            key: 'All',
            value: function All() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var result,
                    iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (!predicate(result.value)) {
                        return false;
                    }
                }
                return true;
            }
        }, {
            key: 'Any',
            value: function Any(predicate) {
                var result,
                    iterator = this[Symbol.iterator]();
                // Check if at least one exist
                if (null == predicate) {
                    return !iterator.next().done;
                }
                // Check if any satisfy the criteria
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            key: 'Average',
            value: function Average() {
                var func = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];

                var result,
                    sum = 0,
                    count = 0;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    sum += result.value;
                    count++;
                }
                return sum / count;
            }
        }, {
            key: 'Contains',
            value: function Contains(value) {
                var equal = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
                    return a === b;
                } : arguments[1];

                var result,
                    iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (equal(value, result.value)) {
                        return true;
                    }
                }
                return false;
            }
        }, {
            key: 'Count',
            value: function Count() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var result,
                    count = 0;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        count++;
                    }
                }
                return count;
            }
        }, {
            key: 'Max',
            value: function Max() {
                var transform = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];

                var result,
                    value,
                    max,
                    hasValue = false;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    value = transform(result.value);
                    if (hasValue) {
                        if (max < value) max = value;
                    } else {
                        max = value;
                        hasValue = true;
                    }
                }
                if (!hasValue) throw TsLinq.Constants.NO_ELEMENTS;
                return max;
            }
        }, {
            key: 'Min',
            value: function Min() {
                var transform = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];

                var result,
                    value,
                    min,
                    hasValue = false;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    value = transform(result.value);
                    if (hasValue) {
                        if (min > value) min = value;
                    } else {
                        min = value;
                        hasValue = true;
                    }
                }
                if (!hasValue) throw TsLinq.Constants.NO_ELEMENTS;
                return min;
            }
        }, {
            key: 'ElementAt',
            value: function ElementAt(index) {
                var result,
                    count = 0;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (index === count++) {
                        return result.value;
                    }
                }
                throw "Argument Out Of Range";
            }
        }, {
            key: 'ElementAtOrDefault',
            value: function ElementAtOrDefault(index) {
                var result,
                    value,
                    count = 0;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (index === count++) {
                        return result.value;
                    }
                    value = result.value;
                }
                return TsLinq.Constants.DEFAULT_VALUE(typeof value === 'undefined' ? 'undefined' : _typeof(value)); // Last good value
            }
        }, {
            key: 'First',
            value: function First() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var result;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        return result.value;
                    }
                }
                throw TsLinq.Constants.NOTHING_FOUND;
            }
        }, {
            key: 'FirstOrDefault',
            value: function FirstOrDefault() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var result, value;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    value = result.value;
                    if (predicate(value)) {
                        return result.value;
                    }
                }
                return TsLinq.Constants.DEFAULT_VALUE(typeof value === 'undefined' ? 'undefined' : _typeof(value)); // Last good value
            }
        }, {
            key: 'Last',
            value: function Last() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var result,
                    value,
                    found = false;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        value = result.value;
                        found = true;
                    }
                }
                if (!found) throw TsLinq.Constants.NOTHING_FOUND;
                return value;
            }
        }, {
            key: 'LastOrDefault',
            value: function LastOrDefault() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var result,
                    value,
                    lastKnown,
                    found = false;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        value = result.value;
                        found = true;
                    }
                    lastKnown = result.value;
                }
                return found ? value : TsLinq.Constants.DEFAULT_VALUE(typeof lastKnown === 'undefined' ? 'undefined' : _typeof(lastKnown));
            }
        }, {
            key: 'SequenceEqual',
            value: function SequenceEqual(other) {
                var equal = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
                    return a === b;
                } : arguments[1];

                var res1, res2;
                var it1 = this[Symbol.iterator]();
                var it2 = other[Symbol.iterator]();
                do {
                    res1 = it1.next();
                    res2 = it2.next();
                    if (res1.done != res2.done || !equal(res1.value, res2.value)) {
                        return false;
                    }
                } while (!res1.done && !res2.done);
                return true;
            }
        }, {
            key: 'Single',
            value: function Single() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var value,
                    hasValue = false;
                var result,
                    iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        if (!hasValue) {
                            value = result.value;
                            hasValue = true;
                        } else {
                            throw TsLinq.Constants.TOO_MANY;
                        }
                    }
                }
                if (hasValue) return value;
                throw TsLinq.Constants.NOTHING_FOUND;
            }
        }, {
            key: 'SingleOrDefault',
            value: function SingleOrDefault() {
                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                var value,
                    lastKnown,
                    hasValue = false;
                var result,
                    iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    if (predicate(result.value)) {
                        if (!hasValue) {
                            value = result.value;
                            hasValue = true;
                        } else {
                            throw TsLinq.Constants.TOO_MANY;
                        }
                    }
                    lastKnown = result.value;
                }
                return hasValue ? value : TsLinq.Constants.DEFAULT_VALUE(typeof lastKnown === 'undefined' ? 'undefined' : _typeof(lastKnown));
            }
        }, {
            key: 'Sum',
            value: function Sum() {
                var transform = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];

                var result,
                    sum = 0;
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    sum += result.value;
                }
                return sum;
            }
        }, {
            key: 'ToArray',
            value: function ToArray() {
                var result,
                    array = [];
                var iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    array.push(result.value);
                }
                return array;
            }
        }, {
            key: 'ToDictionary',
            value: function ToDictionary(keySelector) {
                var elementSelector = arguments.length <= 1 || arguments[1] === undefined ? TsLinq.Constants.SELF_FN : arguments[1];

                var dictionary = new Map();
                var result,
                    iterator = this[Symbol.iterator]();
                while (!(result = iterator.next()).done) {
                    dictionary.set(keySelector(result.value), elementSelector(result.value));
                }
                return dictionary;
            }
        }, {
            key: 'DefaultIfEmpty',
            value: function DefaultIfEmpty() {
                var _this16 = this;

                var defaultValue = arguments.length <= 0 || arguments[0] === undefined ? undefined : arguments[0];

                return new Linq(this, function () {
                    return new TsLinq.Iterators.DefaultIfEmptyIteratror(_this16._target[Symbol.iterator](), defaultValue);
                });
            }
        }, {
            key: 'Cast',
            value: function Cast() {
                var _this17 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.SelectIteratror(_this17._target[Symbol.iterator](), function (a) {
                        return a;
                    });
                });
            }
        }, {
            key: 'Concat',
            value: function Concat(second) {
                var aggregate = [this._target, second];
                return new Linq(this, function () {
                    return new TsLinq.Iterators.SelectManyIteratror(aggregate[Symbol.iterator](), TsLinq.Constants.SELF_FN, TsLinq.Constants.SELF_FN);
                });
            }
        }, {
            key: 'Distinct',
            value: function Distinct() {
                var _this18 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.DistinctIteratror(_this18._target[Symbol.iterator]());
                });
            }
        }, {
            key: 'Except',
            value: function Except(other) {
                var _this19 = this;

                var _set = new Set();
                var result,
                    otherIterator = other[Symbol.iterator]();
                while (!(result = otherIterator.next()).done) {
                    _set.add(result.value);
                }
                return new Linq(this, function () {
                    return new TsLinq.Iterators.IntersectIteratror(_this19._target[Symbol.iterator](), _set, true);
                });
            }
        }, {
            key: 'GroupBy',
            value: function GroupBy(selKey, selElement) {
                var selResult = arguments.length <= 2 || arguments[2] === undefined ? TsLinq.Constants.DEFAULT_GROUPING : arguments[2];

                var result;
                var iterator = this[Symbol.iterator]();
                var _map = new Map();
                while (!(result = iterator.next()).done) {
                    var key = selKey(result.value);
                    var group = _map.get(key);
                    if ('undefined' === typeof group) {
                        group = [];
                        _map.set(key, group);
                    }
                    group.push(selElement(result.value));
                }
                var factory = function factory() {
                    return new TsLinq.Iterators.GroupByIteratror(_map.keys(), selResult, _map);
                };
                var tst = factory();
                return new Linq(this, function () {
                    return new TsLinq.Iterators.GroupByIteratror(_map.keys(), selResult, _map);
                });
            }
        }, {
            key: 'GroupJoin',
            value: function GroupJoin(inner, oKeySelect, iKeySelect) {
                var _this20 = this;

                var resultSelector = arguments.length <= 3 || arguments[3] === undefined ? TsLinq.Constants.DEFAULT_GROUPING : arguments[3];

                var _map = new Map();
                var _inner = inner[Symbol.iterator]();
                var result;
                while (!(result = _inner.next()).done) {
                    var key = iKeySelect(result.value);
                    if ('undefined' === typeof key) throw "Inner Key selector returned undefined Key";
                    var group = _map.get(key);
                    if ('undefined' === typeof group) {
                        group = [];
                        _map.set(key, group);
                    }
                    group.push(result.value);
                }
                return new Linq(this, function () {
                    return new TsLinq.Iterators.GroupJoinIteratror(_this20._target[Symbol.iterator](), oKeySelect, resultSelector, _map);
                });
            }
        }, {
            key: 'Intersect',
            value: function Intersect(other) {
                var _this21 = this;

                var _set = new Set();
                var result,
                    otherIterator = other[Symbol.iterator]();
                while (!(result = otherIterator.next()).done) {
                    _set.add(result.value);
                }
                return new Linq(this, function () {
                    return new TsLinq.Iterators.IntersectIteratror(_this21._target[Symbol.iterator](), _set);
                });
            }
        }, {
            key: 'Join',
            value: function Join(inner, oSelector, iSelector, transform) {
                var _this22 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.JoinIteratror(_this22._target[Symbol.iterator](), inner[Symbol.iterator](), oSelector, iSelector, transform);
                });
            }
        }, {
            key: 'OrderBy',
            value: function OrderBy() {
                var keySelect = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];
                var equal = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
                    return a - b;
                } : arguments[1];

                return new TsLinq.OrderedLinq(this, function (array) {
                    return new TsLinq.Iterators.ArrayIterator(array, 0, function (i) {
                        return i >= array.length;
                    });
                }, function (a, b) {
                    return equal(keySelect(a), keySelect(b));
                });
            }
        }, {
            key: 'OrderByDescending',
            value: function OrderByDescending() {
                var keySelect = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];
                var equal = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
                    return a - b;
                } : arguments[1];

                return new TsLinq.OrderedLinq(this, function (array) {
                    return new TsLinq.Iterators.ArrayIterator(array, array.length - 1, function (i) {
                        return 0 > i;
                    }, -1);
                }, function (a, b) {
                    return equal(keySelect(a), keySelect(b));
                });
            }
        }, {
            key: 'ThenBy',
            value: function ThenBy() {
                var keySelect = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];
                var equal = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
                    return a - b;
                } : arguments[1];

                if (this instanceof TsLinq.OrderedLinq) {
                    var superEqual = this.equal;
                    this.equal = function (a, b) {
                        var result = superEqual(a, b);
                        return 0 != result ? result : equal(keySelect(a), keySelect(b));
                    };
                    return this;
                } else {
                    return new TsLinq.OrderedLinq(this, function (array) {
                        return new TsLinq.Iterators.ArrayIterator(array, 0, function (i) {
                            return i >= array.length;
                        });
                    }, function (a, b) {
                        return equal(keySelect(a), keySelect(b));
                    });
                }
            }
        }, {
            key: 'ThenByDescending',
            value: function ThenByDescending() {
                var keySelect = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];
                var equal = arguments.length <= 1 || arguments[1] === undefined ? function (a, b) {
                    return a - b;
                } : arguments[1];

                if (this instanceof TsLinq.OrderedLinq) {
                    var superEqual = this.equal;
                    this.equal = function (a, b) {
                        var result = superEqual(a, b);
                        return 0 != result ? result : equal(keySelect(a), keySelect(b));
                    };
                    return this;
                } else {
                    return new TsLinq.OrderedLinq(this, function (array) {
                        return new TsLinq.Iterators.ArrayIterator(array, array.length - 1, function (i) {
                            return 0 > i;
                        }, -1);
                    }, function (a, b) {
                        return equal(keySelect(a), keySelect(b));
                    });
                }
            }
        }, {
            key: 'Range',
            value: function Range(start, count) {
                return new Linq(null, function () {
                    return new TsLinq.Iterators.GeneratorIterator(start, count, true);
                });
            }
        }, {
            key: 'Repeat',
            value: function Repeat(element, count) {
                return new Linq(null, function () {
                    return new TsLinq.Iterators.GeneratorIterator(element, count);
                });
            }
        }, {
            key: 'Reverse',
            value: function Reverse() {
                var array = Array.isArray(this._target) ? this._target : this.ToArray();
                return new Linq(null, function () {
                    return new TsLinq.Iterators.ArrayIterator(array, array.length - 1, function (i) {
                        return 0 > i;
                    }, -1);
                });
            }
        }, {
            key: 'Select',
            value: function Select(transform) {
                var _this23 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.SelectIteratror(_this23._target[Symbol.iterator](), transform);
                });
            }
        }, {
            key: 'SelectMany',
            value: function SelectMany() {
                var _this24 = this;

                var selector = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.SELF_FN : arguments[0];
                var result = arguments.length <= 1 || arguments[1] === undefined ? TsLinq.Constants.SELF_FN : arguments[1];

                return new Linq(this, function () {
                    return new TsLinq.Iterators.SelectManyIteratror(_this24._target[Symbol.iterator](), selector, result);
                });
            }
        }, {
            key: 'Skip',
            value: function Skip(skip) {
                var iterator = this._target[Symbol.iterator]();
                for (var i = 0; i < skip; i++) {
                    iterator.next();
                }return new Linq(this, function () {
                    return new TsLinq.Iterators.WhereIteratror(iterator, TsLinq.Constants.TRUE_FN);
                });
            }
        }, {
            key: 'SkipWhile',
            value: function SkipWhile() {
                var _this25 = this;

                var predicate = arguments.length <= 0 || arguments[0] === undefined ? function (a, n) {
                    return false;
                } : arguments[0];

                return new Linq(this, function () {
                    return new TsLinq.Iterators.SkipIterator(_this25._target[Symbol.iterator](), predicate);
                });
            }
        }, {
            key: 'Take',
            value: function Take(take) {
                var _this26 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.TakeIterator(_this26._target[Symbol.iterator](), function (a, n) {
                        return take > n;
                    });
                });
            }
        }, {
            key: 'TakeWhile',
            value: function TakeWhile(predicate) {
                var _this27 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.TakeIterator(_this27._target[Symbol.iterator](), predicate);
                });
            }
        }, {
            key: 'Union',
            value: function Union(second) {
                var aggregate = [this._target, second];
                return new Linq(this, function () {
                    return new TsLinq.Iterators.UnionIteratror(aggregate[Symbol.iterator]());
                });
            }
        }, {
            key: 'Where',
            value: function Where() {
                var _this28 = this;

                var predicate = arguments.length <= 0 || arguments[0] === undefined ? TsLinq.Constants.TRUE_FN : arguments[0];

                return new Linq(this, function () {
                    return new TsLinq.Iterators.WhereIteratror(_this28._target[Symbol.iterator](), predicate);
                });
            }
        }, {
            key: 'Zip',
            value: function Zip(second, func) {
                var _this29 = this;

                return new Linq(this, function () {
                    return new TsLinq.Iterators.ZipIteratror(_this29._target[Symbol.iterator](), second[Symbol.iterator](), func);
                });
            }
        }]);

        return Linq;
    })();

    TsLinq.Linq = Linq;
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
    var OrderedLinq = (function (_TsLinq$Linq) {
        _inherits(OrderedLinq, _TsLinq$Linq);

        function OrderedLinq(target, factory, equal) {
            _classCallCheck(this, OrderedLinq);

            var _this30 = _possibleConstructorReturn(this, Object.getPrototypeOf(OrderedLinq).call(this, target, factory));

            _this30.equal = equal;
            return _this30;
        }

        _createClass(OrderedLinq, [{
            key: Symbol.iterator,
            value: function value() {
                if ('undefined' === typeof this._factoryArg) {
                    this._factoryArg = this._target.ToArray();
                    this._factoryArg.sort(this.equal);
                }
                return this._factory(this._factoryArg);
            }
        }]);

        return OrderedLinq;
    })(TsLinq.Linq);

    TsLinq.OrderedLinq = OrderedLinq;
})(TsLinq || (TsLinq = {}));
var TsLinq;
(function (TsLinq) {
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
    function asEnumerable() {
        var TSource = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

        return new TsLinq.Linq(TSource);
    }
    TsLinq.asEnumerable = asEnumerable;
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
    function Range(start, count) {
        return new TsLinq.Linq(null, function () {
            return new TsLinq.Iterators.GeneratorIterator(start, count, true);
        });
    }
    TsLinq.Range = Range;
    /**
     * Repeat element <start> of type T <count> of times.
     *
     * @param start First value in sequence.
     * @param count Number of elements to iteratel.
     *
     * @example
     *     var sum = Repeat("v", 7);
     */
    function Repeat(start, count) {
        return new TsLinq.Linq(null, function () {
            return new TsLinq.Iterators.GeneratorIterator(start, count);
        });
    }
    TsLinq.Repeat = Repeat;
})(TsLinq || (TsLinq = {}));
return TsLinq;
}));
