/**
 * Created by azder on 2015-12-27.
 */

($ => {

    'use strict'; //ALWAYS

    $.configure(
        // last chance to change stuff or just put an invalid url and see the result
        $.assign('urlbase', '')
    ).run($ =>

        // OK, running...


        $.fetch($.conf.urlbase)
         .then(event =>
             // do the inserts
             $.liftM2(
                 // clones the fragment then appends, so the fragment is not lost
                 (fragment, node) => $.appendTo($.cloneNode(fragment), node),

                 // generate the fragment
                 $.maybe(event)
                  .map(
                      // will transform an ajax Event into DocumentFragment
                      $.lcomp(
                          $.logx(2, 'response received'),
                          $.prop('target'),
                          $.prop('response'),
                          $.frag,
                          $.logx(2, 'fragment created')
                      )
                  )
                  .remap($.find('[data-v-content] > *')),

                 // find the insertion points
                 $.elems('.v-app [data-v-copy]')
             )
         )
         .catch(event =>

             $.liftM2(
                 //display the message
                 $.put('textContent'),

                 // show the alert box and find the message element
                 $.elems('[data-v-alertbox]')
                  .map($.lcomp(
                      $.assign('className', 'v-alert-box v-size-large v-error'),
                      $.logx(2, 'showing alert box'),
                      $.find('[data-v-message]'),
                      Array.of
                  ))
                  .flatten(),

                 // find the error message
                 $.maybe(event)
                  .map($.log)
                  .map($.prop('target'))
                  .map($.prop('statusText'))
                  .map($.log)
             )
         )
    )

})($);
