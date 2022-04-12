// wasm-pack build 
mod utils;

use wasm_bindgen::prelude::*;

use serde::{Serialize, Deserialize};

// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;

#[wasm_bindgen]
extern {
    fn alert(s: &str);
}

#[wasm_bindgen]
pub fn fibonacci(n: i32) -> u64 {
	if n < 2 {
		return n as u64;
	}

	let mut sum = 0;
	let mut last = 0;
	let mut curr = 1;
	for _i in 1..n {
		sum = last + curr;
		last = curr;
		curr = sum;
	}
	sum
}

#[wasm_bindgen]
pub fn fibonacci_recursive(n: i32) -> u64 {
	if n < 2 {
		return n as u64;
	}

	fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2)
}

#[wasm_bindgen]
pub fn is_prime(n: i32) -> i32 {
	let limit = (n as f32).sqrt().floor();
	for _i in 2..(limit as i32) {
		if n % _i == 0 {
            return 0;
        }
	}

    1
}

#[wasm_bindgen]
pub fn multiply_double(a: f64, b: f64, n: i32) -> f64 {
	let mut c = 1.0;

	for _i in 0..n {
	  	c = c * a * b;
	}

	c
}

#[wasm_bindgen]
pub fn multiply_int(a: i32, b: i32, n: i32) -> i32 {
	let mut c = 1;

	for _i in 0..n {
	  	c = c * a * b;
	}

	c
}

#[wasm_bindgen]
pub fn sum_int(array: Vec<i32>, n: usize) -> i32 {
	let mut s = 0;

	for _i in 0..n {
	  	s = s + array[_i];
	}

	s
}

#[wasm_bindgen]
pub fn sum_double(array: Vec<f32>, n: usize) -> f32 {
	let mut s = 0.0;

	for _i in 0..n {
	  	s = s + array[_i];
	}

	s
}

#[derive(Serialize, Deserialize)]
pub struct Position {
    x: f64,
    y: f64,
    z: f64,
}

#[wasm_bindgen]
pub fn collision_detection(js_positions: &JsValue, radiuses: Vec<f64>, n: i32) -> i32 {
	let positions: Vec<Position> = js_positions.into_serde().unwrap();
	let mut count = 0;

	for _i in 0..(n as usize) {

		for _j in (_i + 1)..(n as usize) {
			let dx = positions[_i].x - positions[_j].x;
			let dy = positions[_i].y - positions[_j].y;
			let dz = positions[_i].z - positions[_j].z;
			let d = (dx * dx + dy * dy + dz * dz).sqrt();

			if radiuses[_i] > d {
				count += 1;
				break;
			}
		}
	}

	count
}

