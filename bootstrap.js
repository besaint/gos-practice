// A dependency graph that contains any wasm must all be imported
// asynchronously. This `bootstrap.js` file does the single async import, so
// that no one else needs to worry about it again.
import("./fibonacci.js")
    .catch(e => console.error("Error importing `fibonacci.js`:", e))
import("./fibonacci_recursive.js")
    .catch(e => console.error("Error importing `fibonacci_recursive.js`:", e))
import("./is_prime.js")
    .catch(e => console.error("Error importing `is_prime.js`:", e))
import("./multiply_double.js")
    .catch(e => console.error("Error importing `multiply_double.js`:", e))
import("./multiply_int.js")
    .catch(e => console.error("Error importing `multiply_int.js`:", e))
import("./sum_int.js")
    .catch(e => console.error("Error importing `sum_int.js`:", e))
import("./sum_double.js")
    .catch(e => console.error("Error importing `sum_double.js`:", e))
import("./collision_detection.js")
    .catch(e => console.error("Error importing `collision_detection.js`:", e))

import Cookies from 'js-cookie'

jQuery(function () {
    const test_cycles = Cookies.get('test-cycles')
    if (test_cycles) {
        $('#cookie-cycles').val(test_cycles)
    }

    $('[data-toggle="tooltip"]').hover(function () {
        $(this).tooltip('show')
    }, function () {
        $(this).tooltip('hide')
    })

    $('#cookie-cycles').on('change', function () {
        Cookies.set('test-cycles', Number($(this).val()))
    })

    $('#gotop').on('click', function () {
        $(document).scrollTop(0)
    })

    $(window).scroll(function(e) {
        let height = $(window).scrollTop()

        if (height > screen.height) {
            $('#gotop').show()
        } else {
            $('#gotop').hide()
        }
    });
    
})
