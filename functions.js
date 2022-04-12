export function Fibonacci(n) {
    if (n <= 1) {
        return n
    }

    let a = 0
    let b = 1
    let res = 0

    for (let i = 2; i < n; i++) {
        res = a + b
        a = b
        b = res
    }

    return a + b
}

export function FibonacciRecursive(n) {
    if (n < 2) {
        return n
    }
    return FibonacciRecursive(n - 1) + FibonacciRecursive(n - 2)
}

export function isPrime(n) {
    let limit = Math.floor(Math.sqrt(n));
    for (let i = 2; i <= limit; i++) {
        if (n % i == 0) {
            return 0;
        }
    }

    return 1;
}

export function MultiplyDouble(a, b, n) {
    var c = 1.0;
    for (var i = 0; i < n; i++) {
        c = c * a * b;
    }
    return c;
}

export function MultiplyInt(a, b, n) {
    var c = 1;
    for (var i = 0; i < n; i++) {
        c = c * a * b;
    }
    return c;
}

export function SumDouble(array, n) {
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += array[i];
    }
    return s;
}

export function SumInt(array, n) {
    var s = 0;
    for (var i = 0; i < n; i++) {
        s += array[i];
    }
    return s;
}

export function CollisionDetection(positions, radiuses, n) {
    let count = 0

    for (let i = 0; i < n; i++) {
        let p = positions[i]
        let r = radiuses[i]

        for (let j = i + 1; j < n; j++) {
            let p2 = positions[j]
            let r2 = radiuses[j]
            let dx = p.x - p2.x
            let dy = p.y - p2.y
            let dz = p.z - p2.z
            let d = Math.sqrt(dx * dx + dy * dy + dz * dz)

            if (r > d) {
                count++
                break
            }
        }
    }

    return count
}
