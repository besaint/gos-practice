// import './wasm_exec'


const go = new Go()
WebAssembly.instantiateStreaming(fetch("/langs/go/main.wasm"), go.importObject).then((result) => {
    window.gowasm = result.instance
    go.run(result.instance)
})