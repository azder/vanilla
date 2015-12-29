/**
 * Created by azder on 2015-12-27.
 */

($ => {

    'use strict'; // ALWAYS

    const VAL = Symbol('the private value');

    let slice = Function.prototype.call.bind(Array.prototype.slice);
    let apply = Function.prototype.call.bind(Function.prototype.apply);
    let concat = Function.prototype.call.bind(Array.prototype.concat);

    let ident = x => x;
    let nil = value=> null === value || void 0 === value;

    let curry = (fn, ...args) =>
        args.length >= fn.length
            ? fn(...args)
            : curry.bind(null, fn, ...args);

    let ncurry = (n, fn, ...args) =>
        args.length >= n
            ? fn(...args)
            : ncurry.bind(null, n, fn, ...args);

    class Maybe {

        static of(value) {
            let m = new Maybe(value);
            m[VAL] = value;
            return m;
        }

        remap(fn) {
            return nil(this[VAL]) ? this : fn(this[VAL]);
        }

        map(fn) {
            return nil(this[VAL]) ? this : Maybe.of(fn(this[VAL]));
        }

    }

    class List {

        static of(value) {
            let m = new List(value);
            m[VAL] = Array.of(value);
            return m;
        }

        static from(value) {
            let m = new List(value);
            m[VAL] = Array.from(value);
            return m;
        }

        remap(fn) {
            return concat(
                ...this[VAL].map(
                    x => fn(x)  // removes the extra args (value, index, array) to not break curry
                )
            );
        }

        map(fn) {
            return List.from(this.remap(fn));
        }

        flatten() {
            return (1 === this[VAL].length && this[VAL][0] instanceof List ? this[VAL][0] : this);
        }

    }

    return Object.assign($, {

        slice,
        apply,
        concat,

        ident,
        nil,
        curry,
        ncurry,

        VAL,
        Maybe,
        List,

        maybe:  Maybe.of,
        list:   List.of,
        relist: List.from,

        first: a => nil(a) ? void 0 : a[0],
        last:  a => nil(a) ? void 0 : a[a.length - 1],

        rcomp: (...args) => arg => args.reduceRight((x, fn) => fn(x), arg),
        lcomp: (...args) => arg => args.reduce((x, fn) => fn(x), arg),

        prop: curry((key, object) => object[key]),

        put: curry((key, object, value) => {
            object[key] = value;
            return value;
        }),

        assign: curry((key, value, object) => {
            object[key] = value;
            return object;
        }),

        tap: curry((fn, val) => {
            fn && fn(val);
            return val;
        }),

        liftM: (fn, monad) => monad.map(value => monad.constructor.of(fn(value))),

        liftM2: (fn, m1, m2) =>
                    m1.map(v1 =>
                        m2.map(v2 =>
                            m1.constructor.of(fn(v1, v2))
                        )
                    )

    });

})($);

