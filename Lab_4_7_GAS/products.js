// Задание 4.5.5.
// файл с функциями для работы с товарами

var products = [];
var req;

function loadTextData(url, cb) {
  function processReqChange() {
    // выводим состояние запроса в консоль
    console.log('Состояние запроса: ' + getReadyStateInfo(req.readyState));

    // через 5 секунд прерываем запрос
    ab = window.setTimeout('req.abort();', 5000);

    // только при состоянии "complete"
    if (req.readyState == 4) {
      // отменяем таймер на прерывание запроса
      clearTimeout(ab);

      // для статуса "OK"
      if (req.status == 200) {
        console.log('Данные:\n' + req.responseText);

        // вызываем функцию обработки ответа
        cb(req.responseText);
      } else {
        console.log('Не удалось получить данные:\n' + req.statusText);
      }
    }
  }
  if (window.XMLHttpRequest) {
    // для родного XMLHttpRequest
    req = new XMLHttpRequest();
    req.onreadystatechange = processReqChange;
    req.open('GET', url, true);
    req.send(null);
  } else if (window.ActiveXObject) {
    // для версии с ActiveX
    req = new ActiveXObject('Microsoft.XMLHTTP');

    if (req) {
      req.onreadystatechange = processReqChange;
      req.open('GET', url, true);
      req.send();
    }
  }
}

function processProductsResponseText(responseText) {
  var rows = responseText.split('\n');

  for (var i = 0; i < rows.length; i++) {
    var row = rows[i];
    var columns = row.split('#');

    // пропускаем строки с недостаточным количеством данных
    if (columns.length < 4) {
      continue;
    }

    var product = {
      code: columns[0],
      name: columns[1],
      price: columns[2],
      file: columns[3],
    };

    products.push(product);
  }

  return products;
}

function getReadyStateInfo(readyState) {
  switch (readyState) {
    case 0:
      return 'НЕ ИНИЦИАЛИЗИРОВАН';
    case 1:
      return 'ЗАГРУЗКА...';
    case 2:
      return 'ЗАГРУЖЕНО';
    case 3:
      return 'В ПРОЦЕССЕ...';
    case 4:
      return 'ГОТОВО';
    default:
      return 'НЕИЗВЕСТНОЕ СОСТОЯНИЕ';
  }
}

function createProductsTable() {
  var productListElement = document.getElementById('products');

  productListElement.innerHTML = '';

  // создаем таблицу
  var table = document.createElement('table');
  table.setAttribute('border', '3');
  table.setAttribute('cellpadding', '10');
  table.setAttribute('bgcolor', '#fbfbf3');

  // создаем заголовок таблицы
  var caption = document.createElement('caption');
  caption.innerHTML = '<h3>Список товаров</h3>';
  table.appendChild(caption);

  // создаем заголовок таблицы
  var headerRow = document.createElement('tr');
  var headers = ['Код товара', 'Наименование товара', 'Цена'];

  headers.forEach(function (headerText) {
    var headerCell = document.createElement('th');
    headerCell.textContent = headerText;
    headerRow.appendChild(headerCell);
  });

  table.appendChild(headerRow);

  // заполняем таблицу данными о товарах
  products.forEach(function (product) {
    var row = document.createElement('tr');

    // добавляем ячейки в строку
    var codeCell = document.createElement('td');
    codeCell.textContent = product.code;
    row.appendChild(codeCell);

    var nameCell = document.createElement('td');
    var nameLink = document.createElement('a');
    nameLink.href = '#';
    nameLink.textContent = product.name;

    // при клике на ссылку загружаем новую страницу с данными о товаре
    nameLink.addEventListener('click', function (event) {
      loadProductPage(product);
    });

    nameCell.appendChild(nameLink);
    row.appendChild(nameCell);

    var fileCell = document.createElement('td');
    fileCell.textContent = product.price;
    row.appendChild(fileCell);

    // добавляем строку в таблицу
    table.appendChild(row);
  });

  // добавляем таблицу в документ
  document.body.appendChild(table);
}

function loadProducts(params) {
  var productsFileName = './text_files/products.txt';

  // загружаем данные о товарах
  loadTextData(productsFileName, function (responseText) {
    // обрабатываем полученные данные
    products = processProductsResponseText(responseText);

    // создаем таблицу с данными о товарах
    createProductsTable();
  });
}

function writeProductPage(page, details) {
  var content = `
    <html>
      <head>
        <title>Задание 4.5.5. Информация о товаре</title>
      </head>
      <body bgcolor="#c6ffd1">
        <h2>Задание 4.5.5. Информация о товаре</h2>
        <div>${details}</div>
      </body>
    </html>
  `;

  page.document.open();
  page.document.write(content);
  page.document.close();
}

function loadProductPage(product) {
  // создаем новое окно
  var productPage = window.open();
  var productFileName = './text_files/' + product.file;

  // загружаем данные о товаре
  loadTextData(productFileName, function (responseText) {
    var productDetails = responseText;

    // выводим данные о товаре в созданное окно
    writeProductPage(productPage, productDetails);
  });
}
