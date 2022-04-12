// import './wasm_exec'

const tinyGo = new TinyGo()
fetch("/langs/tinygo/main.wasm").then(resp => resp.arrayBuffer()).then(bytes =>
    WebAssembly.instantiate(bytes, tinyGo.importObject).then(function (obj) {
        window.wasm = obj.instance
        tinyGo.run(window.wasm)
}))