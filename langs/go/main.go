// GOARCH=wasm GOOS=js go build -o main.wasm main.go
package main

import (
	"syscall/js"
	"math"
	// "fmt"
	"strings"
	"strconv"
)

func Fibonacci(n uint) uint64 {
	if n <= 1 {
		return uint64(n)
	}

	var n2, n1 uint64 = 0, 1

	for i := uint(2); i < n; i++ {
		n2, n1 = n1, n1+n2
	}

	return n2 + n1
}
func jsFibonacci(this js.Value, args []js.Value) interface{} {
	input := args[0].Int()
	return Fibonacci(uint(input))
}

func FibonacciRecursive(n uint) uint64 {
	if n <= 1 {
		return uint64(n)
	}

	return FibonacciRecursive(n - 1) + FibonacciRecursive(n - 2)
}
func jsFibonacciRecursive(this js.Value, args []js.Value) interface{} {
	input := args[0].Int()
	return FibonacciRecursive(uint(input))
}

func isPrime(n uint) uint {
    var limit = math.Floor(math.Sqrt(float64(n)))
    for i := uint(2); i <= uint(limit); i++ {
        if n % i == 0 {
            return 0
        }
    }

    return 1
}
func jsIsPrime(this js.Value, args []js.Value) interface{} {
	input := args[0].Int()
	return isPrime(uint(input))
}

func MultiplyDouble(a float64, b float64, n uint) float64 {
	var c = 1.0
	
    for i := uint(0); i < n; i++ {
        c = c * a * b
    }

    return c
}
func jsMultiplyDouble(this js.Value, args []js.Value) interface{} {
	a := args[0].Float()
	b := args[1].Float()
	n := args[2].Int()
	return MultiplyDouble(float64(a), float64(b), uint(n))
}

func MultiplyInt(a int, b int, n uint) int {
	var c = 1
	
    for i := uint(0); i < n; i++ {
        c = c * a * b
    }

    return c
}
func jsMultiplyInt(this js.Value, args []js.Value) interface{} {
	a := args[0].Int()
	b := args[1].Int()
	n := args[2].Int()
	return MultiplyInt(int(a), int(b), uint(n))
}

func SumInt(array_str string, n uint) int64 {
	var s = int64(0)
	var array = strings.Split(array_str, ",")
    for i := int(0); i < len(array); i++ {
		v, _ := strconv.ParseInt(array[i], 10, 64)
		s = s + v
    }

    return s
}
func jsSumInt(this js.Value, args []js.Value) interface{} {
	array := args[0].String()
	n := args[1].Int()

	return SumInt(array, uint(n))
}

func SumDouble(array_str string, n uint) float64 {
	var s = float64(0.0)
	var array = strings.Split(array_str, ",")
    for i := int(0); i < len(array); i++ {
		v, _ := strconv.ParseFloat(array[i], 64)
		s = s + v
    }

    return s
}
func jsSumDouble(this js.Value, args []js.Value) interface{} {
	array := args[0].String()
	n := args[1].Int()

	return SumDouble(array, uint(n))
}


func main() {
	c := make(chan bool)

	js.Global().Set("wsFibonacci", js.FuncOf(jsFibonacci))
	js.Global().Set("wsFibonacciRecursive", js.FuncOf(jsFibonacciRecursive))
	js.Global().Set("wsIsPrime", js.FuncOf(jsIsPrime))
	js.Global().Set("wsMultiplyDouble", js.FuncOf(jsMultiplyDouble))
	js.Global().Set("wsMultiplyInt", js.FuncOf(jsMultiplyInt))
	js.Global().Set("wsSumDouble", js.FuncOf(jsSumDouble))
	js.Global().Set("wsSumInt", js.FuncOf(jsSumInt))

	<-c
}
