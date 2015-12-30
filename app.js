/**
 * Created by azder on 2015-12-27.
 */

($ => {

    'use strict'; //ALWAYS

    // last chance to change stuff or just put an invalid url and see the result
    $.configure($.assign('urlbase', ''))

     // OK, running...
     .run($ =>
         // the html document from urlbase
         $.fetch($.conf.urlbase)
          .then(event =>
              // do the inserts
              $.liftM2(
                  // clones the fragment then appends, so the fragment is not lost
                  (fragment, node) => $.appendTo($.cloneNode(fragment), node),

                  // generate the fragment
                  $.maybe(event)
                   // will transform an ajax Event into DocumentFragment
                   .map($.logx(2, 'response received'))
                   .map($.prop('target'))
                   .map($.prop('response'))
                   .map($.frag)
                   .map($.logx(2, 'fragment created'))
                   // and extract the wanted node(s)
                   .remap($.find('[data-v-content] > *')),

                  // find the insertion points
                  $.elems('.v-app [data-v-copy=doc]')
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
     // now let's try templates
     .run($ =>
         $.liftM2(
             // generate the template
             (data, template) => template(data),

             // provides the data for the template
             $.maybe({
                 header:  'Success',
                 message: 'This little snippet over here is actually from a template.'
             }),

             // finds the template and compiles it
             $.elems('#template01')
              .map($.lcomp($.prop('innerHTML'), Array.of))
              .map($.lcomp($.compile, Array.of))
          )
          .map($.map($.map(html =>
              $.elems('[data-v-copy=template01]').map($.assign('innerHTML', html))
          )))
     )

})($);
