/**
 * Created by azder on 2015-12-27.
 */

(($, modules) => {

    'use strict'; // ALWAYS

    Object.assign(modules, {

        log: [
            'console', 'last',
            (console, last) => (...args)=> {
                console.log.apply(console, ['[VANILLA]', ...args]);
                return last(args);
            }
        ],

        logx: [
            'console', 'ncurry', 'last',
            (console, ncurry, last) =>
                ((n, ...inits) => ncurry(n, (...args)=> {
                    console.log.apply(console, ['[VANILLA]', ...args]);
                    return last(args);
                }, ...inits))
        ],

        fetch: [
            '$', 'Promise', 'XMLHttpRequest',
            ($, Promise, XHR) =>
                (uri, options) =>

                    new Promise((resolve, reject) => {

                        let xhr = new XHR;
                        xhr.addEventListener('abort', reject);
                        xhr.addEventListener('error', reject);

                        xhr.addEventListener('load', event => {

                            let code = $.lcomp($.prop('target'), $.prop('status'))(event);

                            return 200 <= code && code < 300 ? resolve(event) : reject(event);

                        });

                        xhr.open((options && options.method) || 'GET', uri);
                        xhr.send(options && options.body);

                    })
        ],

        frag: [
            'document',
            document =>
                html => {
                    let template = document.createElement('template');
                    template.innerHTML = html;
                    return template.content;
                }
        ],

        elems: [
            'document',
            document => selector => $.relist(document.querySelectorAll(selector))
        ],

        find: [
            () => $.curry((selector, node)=> $.relist(node.querySelectorAll(selector)))
        ],


        cloneNode: [
            'document',
            document => node => document.cloneNode.call(node, true)
        ],

        appendTo: [
            () => $.curry((content, element) => {
                element.appendChild(content);
                return element;
            })
        ],

        append: [
            () => $.curry((element, content) => {
                element.appendChild(content);
                return content;
            })
        ]

    });

})($, $.modules);

