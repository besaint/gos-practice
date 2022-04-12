import './langs/go'
import './langs/tinygo'
import * as wasm from "./langs/rust/pkg/rust"
import * as JS from './functions'

jQuery(function () {
    let RESULTS = {}
    function c_run(positions, radiuses, n) {
        var pointer1 = Module.__malloc(positions.length * 3 * 8);
        var pointer2 = Module.__malloc(radiuses.length * 8);
        var offset1 = pointer1 / 8;
        var offset2 = pointer2 / 8;
        setPositionsToFloat64Array(positions, Module.HEAPF64, offset1);
        Module.HEAPF64.set(radiuses, offset2);

        var result = Module._collision_detection( pointer1, pointer2, n);

        Module.__free(pointer1);
        Module.__free(pointer2);
        return result;
    }
    function tgo_run(positions, radiuses, n) {
        let { wsTinyCollisionDetection, memory, wsTinyAllocateDouble, wsTinySumDouble, wsTinyAllocatePositions } = window.wasm.exports

        let x = positions.map(v => v.x)
        let y = positions.map(v => v.y)
        let z = positions.map(v => v.z)
        // console.log();
        // return 0;
        let xPtr = wsTinyAllocateDouble(x.length);
        let xArr = new Float64Array(memory.buffer, xPtr, x.length);
        xArr.set(x);
        let yPtr = wsTinyAllocateDouble(y.length);
        let yArr = new Float64Array(memory.buffer, yPtr, y.length);
        yArr.set(y);
        let zPtr = wsTinyAllocateDouble(z.length);
        let zArr = new Float64Array(memory.buffer, zPtr, z.length);
        zArr.set(z);
        // let positionsPtr = wsTinyAllocatePositions(positions.length);
        // let positionsArr = new Float64Array(memory.buffer, positionsPtr, positions.length);
        // positionsArr.set(positions);

        let radiusesPtr = wsTinyAllocateDouble(radiuses.length)//wsTinyAllocateDouble(radiuses.length);
        let radiusesArr = new Float64Array(memory.buffer, radiusesPtr, radiuses.length);
        radiusesArr.set(radiuses);


        return wsTinyCollisionDetection(xArr, yArr, zArr, radiusesArr, n)
    }
    function go_run(array, n) {
        return wsSumDouble(array.join(','), 3)
    }
    $('#collision_detection_run').on('click', function () {
        let functions = {
            rust: wasm.collision_detection,
            c: c_run,
            tinygo: tgo_run,
            go: go_run, //window.wsSumDouble,
            js: JS.CollisionDetection
        }

        start({
            name: 'Collision Detection',
            key: 'collision_detection',
            cases: [
                { name: 'JavaScript', func: functions.js },
                // {name: 'Go', func: functions.go},
                // {name: 'TinyGo', func: functions.tinygo},
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
            items.push({ lang, timeavg, timetotal, result })
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
            for (const lang of Object.keys(RESULTS)) {
                cols.push(RESULTS[lang].times[i])
            }
            rows.push(cols.map((v, i) => `<td ${!i ? 'scope="row"' : ''}>${v}</td>`).join(''))
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

    function run_test(func, args, loop = 5) {
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
            setTimeout(() => executeTest(test, index + 1, args))
        })
    }

    function start(test) {
        init(test.key)

        var elemNum = Number($('#number').val());

        var positions = [];
        var radiuses = new Float64Array(elemNum);

        initPositions(positions, elemNum);
        initRadiuses(radiuses);

        setTimeout(() => executeTest(test, 0, [positions, radiuses, elemNum]))
    }

    function Position(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    function initPositions(array, n) {
        for (var i = 0; i < n; i++) {
            var x = Math.random() * 2000 - 1000;
            var y = Math.random() * 2000 - 1000;
            var z = Math.random() * 2000 - 1000;
            array[i] = new Position(x, y, z);
        }
    }

    function initRadiuses(array) {
        for (var i = 0, il = array.length; i < il; i++) {
            array[i] = Math.random() * 10;
        }
    }

    function setPositionsToFloat64Array(positions, array, offset) {
        for (var i = 0, il = positions.length; i < il; i++) {
            var index = offset + i * 3;
            array[index + 0] = positions[i].x;
            array[index + 1] = positions[i].y;
            array[index + 2] = positions[i].z;
        }
    }
})