import './langs/go'
import './langs/tinygo'
import * as wasm from "./langs/rust/pkg/rust"
import * as JS from './functions'

jQuery(function () {
    let RESULTS = {}
    $('#multiply_double_run').on('click', function () {
        let functions = {
            rust: wasm.multiply_double,
            c: Module._multiply_double,
            tinygo: window.wasm.exports.wsTinyMultiplyDouble,
            go: window.wsMultiplyDouble,
            js: JS.MultiplyDouble
        }

        start({
            name: 'Multiply Double',
            key: 'multiply_double',
            cases: [
                {name: 'JavaScript', func: functions.js},
                {name: 'Go', func: functions.go},
                {name: 'TinyGo', func: functions.tinygo},
                {name: 'C', func: functions.c},
                {name: 'RUST', func: functions.rust}
            ]
        })
    })

    function init(test) {
        $('#status').text('Preparing data...')
        $(`#${test.toLowerCase()}_run`).hide()
        $('.test_args').attr('disabled', true)
    }

    function finish(test) {
        $('#status').text('')
        $(`#${test.toLowerCase()}_run`).show()
        $('.test_args').attr('disabled', false)
        showResults()
    }

    function showResults() {
        const langs = Object.keys(RESULTS)
        let items = []
        Object.entries(RESULTS).forEach(item => {
            const lang = item[0]
            const { timeavg, result, timetotal } = item[1]
            items.push({ lang, timeavg, timetotal, result})
        })

        let table = `
            <table class="table table-hover">
                <thead class="thead-light">
                    <tr>
                        <td scope="col">Language</td>
                        <td scope="col">Average time (ms)</td>
                        <td scope="col">Total time (ms)</td>
                        <td scope="col">Value</td>
                    </tr>
                </thead>
                <tbody>
                        ${items.map(v => `
                            <tr>
                                <td scope="row">${v.lang}</td>
                                <td scope="row">${v.timeavg}</td>
                                <td scope="row">${v.timetotal}</td>
                                <td scope="row">${v.result}</td>
                            </tr>
                        `).join('')}
                </tbody>
            </table>
        `

        const cycles = Number($('#cookie-cycles').val())
        let rows = []
        for (const i of Array(cycles).keys()) {
            let cols = [i + 1]
            for(const lang of Object.keys(RESULTS)) {
                cols.push(RESULTS[lang].times[i])
            }
            rows.push(cols.map((v, i) => `<td ${!i ? 'scope="row"':''}>${v}</td>`).join(''))
        }

        let listing = `
            <table class="table table-hover">
                <thead class="thead-light">
                    <tr>
                        <td></td>
                        ${langs.map(v => `<td scope="col">${v}</td>`).join('')}
                    </tr>
                </thead>
                <tbody>
                    ${rows.map(v => `<tr>${v}</tr>`).join('')}
                </tbody>
            </table>
        `

        $('#results').html(`
            <div class="row mt-4 mb-2">
                <h4 class="col-12 text-center">Average</h4>
            </div>
            <div class="row">
                <div class="col-6">
                    ${table}
                </div>
                <div class="col-6" style="height: 300px;">
                    <canvas width="100px" height="100px"></canvas>
                </div>
            </div>
            <div class="row mt-4 mb-2">
                <h4 class="col-12 text-center">Results Listing</h4>
            </div>
            <div class="row">
                ${listing}
            </div>
        `)

        generateChart('Total time (ms)', langs, items.map(v => v.timetotal))
    }

    function generateChart(label, labels, data) {
        let ctx = document.querySelector('#results canvas')
        new Chart(ctx, {
            type: 'bar',
            data: {
                labels,
                datasets: [{
                    label,
                    data,
                    backgroundColor: [
                        'rgba(255, 99, 132, 0.2)',
                        'rgba(54, 162, 235, 0.2)',
                        'rgba(255, 206, 86, 0.2)',
                        'rgba(75, 192, 192, 0.2)',
                        'rgba(153, 102, 255, 0.2)'
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)',
                        'rgba(153, 102, 255, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                maintainAspectRatio: false,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        })
    }

    function run_test(func, args, loop=5) {
        return new Promise((resolve, reject) => {
            let result = func.apply(this, args)
            let elapsedTime = 0.0
            let times = []
            let startTotal = performance.now()
            for (let i = 0; i < loop; i++) {
                let startTime = performance.now()
                func.apply(this, args)
                let endTime = performance.now()
                times.push((endTime - startTime))
                elapsedTime += (endTime - startTime)
            }
            let endTotal = performance.now()
            let timeavg = (elapsedTime / loop).toFixed(6)
            let timetotal = (endTotal - startTotal).toFixed(6)
            resolve({
                result,
                timeavg,
                timetotal,
                times
            }) 
        })
    }

    function executeTest(test, index, args) {
        if (index >= test.cases.length) {
            finish(test.key)
            return
        }

        const test_case = test.cases[index]
        document.getElementById('status').textContent = `Running ${test_case.name}...`
        setTimeout(async () => {
            const ret = await run_test(test_case.func, args, $('#cookie-cycles').val())
            RESULTS[test_case.name] = ret
            setTimeout(() => executeTest(test, index+1, args))
        })
    }

    function start(test) {
        init(test.key)
        
        test.cases.forEach(el => $(`#${el.elem}`).text(''))
        
        const a = parseFloat($('#first').val())
        const b = parseFloat($('#second').val())
        const c = Math.floor(parseFloat($('#count').val()))
        
        setTimeout(() => executeTest(test, 0, [a, b, c]))
    }
})