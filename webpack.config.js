const CopyWebpackPlugin = require("copy-webpack-plugin");
const path = require('path');

module.exports = {
  target: 'web',
  entry: "./bootstrap.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bootstrap.js",
  },
  mode: "development",
  plugins: [
    new CopyWebpackPlugin([
      'index.html', 'collision_detection.html', 'fibonacci_recursive.html',
      'fibonacci.html', 'is_prime.html', 'multiply_double.html', 'multiply_int.html',
      'sum_double.html', 'sum_int.html', 'main.css',
    ]),
    new CopyWebpackPlugin([
      { from: 'assets', to: 'assets'},
      { from: 'fonts', to: 'fonts'},
      { from: 'langs/c', to: 'langs/c'},
      { from: 'langs/go', to: 'langs/go'},
      { from: 'langs/tinygo', to: 'langs/tinygo'},
    ])
  ],
};
