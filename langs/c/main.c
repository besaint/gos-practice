// emcc -Os  main.c -o main.js
#include <math.h>
#include <stdlib.h>
#include <emscripten.h>

EMSCRIPTEN_KEEPALIVE
long fibonacci(int n)
{
    if (n <= 1)
        return n;

    int a = 0;
    int b = 1;
    int res;

    for (int i = 2; i < n; i++)
    {
        res = a + b;
        a = b;
        b = res;
    }

    return a + b;
}

EMSCRIPTEN_KEEPALIVE
long fibonacci_recursive(int n)
{
    if (n <= 1)
        return n;

    return fibonacci_recursive(n - 1) + fibonacci_recursive(n - 2);
}

EMSCRIPTEN_KEEPALIVE
char is_prime(long n) 
{
    long limit = floor(sqrt(n));
    for(long i = 2; i <= limit; i++) {
        if (n % i == 0){
            return 0;
        }
    }

    return 1;
}

EMSCRIPTEN_KEEPALIVE
double multiply_double(double a, double b, int n) {
  double c = 1.0;
  for (int i = 0; i < n; i++) {
    c = c * a * b;
  }
  return c;
}

EMSCRIPTEN_KEEPALIVE
int multiply_int(int a, int b, int n) {
  int c = 1;
  for (int i = 0; i < n; i++) {
    c = c * a * b;
  }
  return c;
}

EMSCRIPTEN_KEEPALIVE
double sum_double(double *array, int n) {
  double s = 0.0;
  for (int i = 0; i < n; i++) {
    s = s + array[i];
  }
  return s;
}

EMSCRIPTEN_KEEPALIVE
int sum_int(int *array, int n) {
  int s = 0;
  for (int i = 0; i < n; i++) {
    s = s + array[i]; 
  }
  return s;
}

EMSCRIPTEN_KEEPALIVE
void* _malloc(int n) {
  return malloc(n);
}

EMSCRIPTEN_KEEPALIVE
void _free(void* memory) {
   free(memory);
}
struct position
{
    double x;
    double y;
    double z;
};

EMSCRIPTEN_KEEPALIVE
int collision_detection(struct position *positions, double *radiuses, int n) {
  int count = 0;
  for (int i = 0; i < n; i++) {
    struct position p = positions[i];
    double r = radiuses[i];
    
    for (int j = i+1; j < n; j++) {
      struct position  p2 = positions[j];
      double dx = p.x - p2.x;
      double dy = p.y - p2.y;
      double dz = p.z - p2.z;
      double d = sqrt(dx*dx + dy*dy + dz*dz);

      if (r > d) {
        count++;
        break;
      }
    }
    
  }
  return count;
}