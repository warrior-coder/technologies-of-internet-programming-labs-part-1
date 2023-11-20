// "stat_pvn.js"
// не нашел данный файл в примерах лекций, поэтому реализовал необходимые функции самостоятельно

// функция для вычисления среднего значения элементов массива
function mean_arr(arr) {
  return sum_arr(arr) / arr.length;
}

// функция для вычисления суммы элементов массива
function sum_arr(arr) {
  var sum = 0;

  for (var i = 0; i < arr.length; i++) {
    sum += arr[i];
  }

  return sum;
}

// функция для нахождения максимального значения элементов массива
function max_arr(arr) {
  var max = arr[0];

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] > max) {
      max = arr[i];
    }
  }

  return max;
}

// функция для нахождения минимального значения элементов массива
function min_arr(arr) {
  var min = arr[0];

  for (var i = 1; i < arr.length; i++) {
    if (arr[i] < min) {
      min = arr[i];
    }
  }

  return min;
}
