/**
 * @type {{
 *  value: string;
 * }}
 */
var expressionInputElement = document.getElementById('expression-input');
var tokens = [];
expressionInputElement.value = '';

var DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
var OPERATORS = ['+', '-', '×', '÷', '--', '++'];
var MAX_DEFAULT_LENGTH = 16;
var FONT_DEFAULT_SIZE = 25;
var MIN_FONT_SIZE = 14;

function operatorButtonOnClick(op) {
  var str = expressionInputElement.value;
  var delim = '';

  // если введен оператор
  console.log('введен оператор:', op);
  
  if (op == '--' || op == '++' ) {
    if (tokens.length == 0 || OPERATORS.includes(tokens.at(-1))) {
      // если префиксный оператор можно
      tokens.push(op);
      delim = ' ';
  } else {
      console.log('Префиксный оператор может быть только в начале выражения');
      return;
    }
  } else if (OPERATORS.includes(tokens.at(-1))) {
    // если последний символ - оператор
    console.log('Оператор уже введен');
    return;
  } else if (tokens.length == 0) {
    // если строка пустая
    console.log('Нельзя вводить операторы в начале выражения');
    return;
  } else if (DIGITS.includes(str.at(-1))) {
    // если последний символ - цифра
    tokens.push(op);
    delim = ' ';
  }

  console.log('токены:', tokens);
  expressionInputElement.value += delim;
  expressionInputElement.value += op;
  updateExpressionInputFontSize();
}

function digitButtonOnClick(dig) {
  var str = expressionInputElement.value;
  var delim = '';
  
  // если введена цифра
  console.log('введена цифра:', dig);

  if (OPERATORS.includes(tokens.at(-1))) {
    // если последний символ - оператор
    tokens.push(dig);
    delim = ' ';
  } else if (str.at(-1) == '.') {
    // если последний символ - точка
    tokens[tokens.length - 1] += dig;
  } else if (DIGITS.includes(str.at(-1))) {
    // если последний символ - цифра
    if (tokens.at(-1) == '0') {
      // если последняя цифра - ноль
      if (dig == '0') {
        // если число уже начинается с нуля
        console.log('Число уже начинается с нуля');
        return;
      } 

      tokens[tokens.length - 1] = dig;
      expressionInputElement.value = expressionInputElement.value.slice(0, -1);
    } else {
      tokens[tokens.length - 1] += dig;
    }
  } else if (tokens.length == 0) {
    // если строка пустая
    tokens.push(dig);
  } 

  console.log('токены:', tokens);
  expressionInputElement.value += delim;
  expressionInputElement.value += dig;
  updateExpressionInputFontSize();
}

function dotButtonOnClick() {
  // если введена точка
  console.log('введена точка:');

  if (OPERATORS.includes(tokens.at(-1))) {
    // если последний символ - оператор
    console.log('Нельзя вводить точку после оператора');
    return;
  }

  if (tokens.length == 0) {
    // если строка пустая
    console.log('Нельзя вводить точку в начале выражения');
    return;
  }

  if (tokens.at(-1).includes('.')) {
    // если число уже содержит точку
    console.log('Число уже содержит точку');
    return;
  }

  tokens[tokens.length - 1] += '.';
  console.log('токены:', tokens);
  expressionInputElement.value += '.';
  updateExpressionInputFontSize();
}

function changeSignButtonOnClick() {
  var str = expressionInputElement.value;

  console.log('введена смена знака числа');

  if (OPERATORS.includes(str.at(-1))) {
    // если последний символ - не цифра
    console.log('Нельзя менять знак после оператора');
    return;
  }

  var lastToken = tokens.at(-1);
  if (lastToken[0] == '-') {
    // если число уже отрицательное
    tokens[tokens.length - 1] = lastToken.slice(1);
  } else {
    tokens[tokens.length - 1] = '-' + lastToken;
  }

  console.log('токены:', tokens);
  expressionInputElement.value = expressionInputElement.value.slice(0, -lastToken.length) + tokens.at(-1);
  updateExpressionInputFontSize();
}

function updateExpressionInputFontSize() {
  // изменяем размер шрифта в зависимости от длины строки
  if (expressionInputElement.value.length > MAX_DEFAULT_LENGTH) {
    var fontSize = Math.round(MAX_DEFAULT_LENGTH / expressionInputElement.value.length * FONT_DEFAULT_SIZE);

    if (fontSize < MIN_FONT_SIZE) {
      fontSize = MIN_FONT_SIZE;
    }

    expressionInputElement.style.fontSize = fontSize + 'px';
  } else {
    expressionInputElement.style.fontSize = FONT_DEFAULT_SIZE + 'px';
  }
}

function clearButtonOnClick() {
  tokens = [];
  expressionInputElement.value = '';
  updateExpressionInputFontSize();

  console.log('токены:', tokens);
}

function deleteButtonOnClick() {
  expressionInputElement.value = expressionInputElement.value.trim();

  if (tokens.at(-1) == '--' || tokens.at(-1) == '++') {
    tokens.pop();
    expressionInputElement.value = expressionInputElement.value.slice(0, -2);
  } else if (tokens.length > 0) {
    expressionInputElement.value = expressionInputElement.value.slice(0, -1);
    tokens[tokens.length - 1] = tokens.at(-1).slice(0, -1);

    if (tokens.at(-1) == '-') {
      // если стиралось отрицательное число и остался только минус
      expressionInputElement.value = expressionInputElement.value.slice(0, -1);
      tokens[tokens.length - 1] = '';
    }

    if (tokens.at(-1).length == 0) {
      // если последний токен полностью очищен
      tokens.pop();
    }
  }
  
  console.log('токены:', tokens);
  expressionInputElement.value = expressionInputElement.value.trim();
  updateExpressionInputFontSize();
}

function equalButtonOnClick() {
  try {
    if (tokens.length == 0) {
      // если строка пустая
      throw new Error('Empty expression');
    }

    var parsedTokens = tokens.slice();
    
    // заменяем символы операторов на символы, которые понимает метод eval()
    for (var i = 0; i < parsedTokens.length; i++) {
      if (parsedTokens[i] == '×') {
        parsedTokens[i] = '*';
      } else if (parsedTokens[i] == '÷') {
        parsedTokens[i] = '/';
      }
    }

    // заменяем префиксные операторы на примитивные выражения
    for (var i = 0; i < parsedTokens.length; i++) {
      if (parsedTokens[i] == '++') {
        parsedTokens[i] = '(1+';
        for (var j = i + 1; j < parsedTokens.length; j++) {
          if (DIGITS.includes(parsedTokens[j].at(-1))) {
            // если последний символ - цифра, то дальше закрываем скобку
            parsedTokens.splice(j + 1, 0, ')');
            break;
          }
        }
      } else if (parsedTokens[i] == '--') {
        parsedTokens[i] = '(-1+';
        for (var j = i + 1; j < parsedTokens.length; j++) {
          if (DIGITS.includes(parsedTokens[j].at(-1))) {
            // если последний символ - цифра, то дальше закрываем скобку
            parsedTokens.splice(j + 1, 0, ')');
            break;
          }
        }
      }
    }

    console.log('обработанные токены:', parsedTokens);

    // конкатенируем обработанные токены в строку выражения и вычисляем
    var expression = parsedTokens.join(' ');
    console.log('выражение:', expression);
    var result = eval(expression);

    // проверяем результат на правильность
    if (isNaN(result) || !isFinite(result) || result == undefined || result == null) {
      throw new Error('Unexpected result');
    }
    
    // избавляемся от ошибок вычисления с плавающей точкой
    if (Math.abs(result) < 1e-10) {
      result = 0;
    }

    console.log('результат:', result);
    result = result.toString();

    tokens = [result];
    expressionInputElement.value = result;
    updateExpressionInputFontSize();

    console.log('вычисленные токены:', tokens);
  } catch (error) {
    alert('Ошибка вычисления: ' + error.message);
  }
}
