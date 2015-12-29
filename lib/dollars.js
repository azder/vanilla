/**
 * Created by azder on 2015-12-26.
 */

var $ = (() => {

    'use strict'; // ALWAYS

    let $ = Object.assign(Object.create(null), {

        window,
        document,
        console,

        Promise,
        XMLHttpRequest,

        modules: Object.create(null),
        conf:    Object.create(null),

        run: cb =>

                 $.tap(
                     cb,
                     Object.keys($.modules)
                           .map(modname => {

                               let args = $.slice($.modules[modname]);
                               let fn = args.pop();
                               let injects = args.map(key=>$[key]);
                               return [$.apply(fn, null, injects), modname];

                           })
                           .reduce((memo, tuple)=> {
                               memo[tuple[1]] = tuple[0];
                               return memo;
                           }, $)
                 ),

        configure: cb => {
            cb && cb($.conf, $);
            return $;
        }

    });

    return ($.$ = $); // LOL, why not? :D

})();
