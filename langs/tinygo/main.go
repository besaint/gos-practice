// tinygo build -o main.wasm -target wasm ./main.go
package main

import (
	"math"
	"fmt"
)

//export wsTinyFibonacci
func wsTinyFibonacci(n uint) uint {
	if n <= 1 {
		return uint(n)
	}

	var n2, n1 uint = 0, 1

	for i := uint(2); i < n; i++ {
		n2, n1 = n1, n1+n2
	}

	return n2 + n1
}

//export wsTinyFibonacciRecursive
func wsTinyFibonacciRecursive(n uint) uint {
	if n <= 1 {
		return uint(n)
	}

	return wsTinyFibonacciRecursive(n - 1) + wsTinyFibonacciRecursive(n - 2)
}

//export wsTinyIsPrime
func wsTinyIsPrime(n uint) uint {
    var limit = math.Floor(math.Sqrt(float64(n)))
    for i := uint(2); i <= uint(limit); i++ {
        if n % i == 0 {
            return 0
        }
    }

    return 1
}

//export wsTinyMultiplyDouble
func wsTinyMultiplyDouble(a float64, b float64, n uint) float64 {
	var c = 1.0
	
    for i := uint(0); i < n; i++ {
        c = c * a * b
    }

    return c
}

//export wsTinyMultiplyInt
func wsTinyMultiplyInt(a int, b int, n uint) int {
	var c = 1
	
    for i := uint(0); i < n; i++ {
        c = c * a * b
    }

    return c
}

//export wsTinySumInt
func wsTinySumInt(array []int, n int) int {
	var s = 0
    for i := int(0); i < len(array); i++ {
        s = s + array[i]
    }

    return s
}

//export wsTinySumDouble
func wsTinySumDouble(array []int, n int) int {
	var s = 0
    for i := int(0); i < len(array); i++ {
        s = s + array[i]
    }

    return s
}

//export wsTinyAllocateInt
func wsTinyAllocateInt(n uint) []int {
    return make([]int, n)
}

//export wsTinyAllocateDouble
func wsTinyAllocateDouble(n uint) []float64 {
    return make([]float64, n)
}

//export wsTinyAllocatePositions
func wsTinyAllocatePositions(n uint) []Position {
    return make([]Position, n)
}


type Position struct {
    x float64
    y float64
    z float64
}

//export wsTinyCollisionDetection
func wsTinyCollisionDetection(x []float64, y []float64, z []float64, radiuses []float64, n uint) int {
    var count = 0
    fmt.Println(x)
    fmt.Println(radiuses)
    fmt.Println(n)
    // for i := uint(0); i < n; i++ {
    //   var p = positions[i]
    //   var r = radiuses[i]
      
    //   for j := uint(i)+1; j < n; j++ { 
    //     var p2 = positions[j]
    //     var dx = p.x - p2.x
    //     var dy = p.y - p2.y
    //     var dz = p.z - p2.z
    //     var d = math.Sqrt(float64(dx*dx + dy*dy + dz*dz))
  
    //     if r > d {
    //       count++
    //       break
    //     }
    //   }
      
    // }
    return count
}

func main() {
}
