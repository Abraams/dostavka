let cart = {};
let dataStorage;

function init() {
    //вычитуем файл goods.json
    $.getJSON("/js/goods.json", goodsOut);

}

function goodsOut(data) {
    dataStorage = data;
    loadCart(); // загружаем корзину из локал сторэдж

    // вывод на страницу

    var out = ''; // Переменная для хранения контента выводящегося из JSON файла
    let carentCategory = data[1].category; // текущая категория
    let lastCategory = carentCategory; // предыдущая категория

    for (var key in data) {
        // перебор JSON файла

        carentCategory = data[key].category; // назначение в качестве текущей категории, категорию текущего товара
        if (lastCategory !== carentCategory) {
            // проверка на соответствие предыдущей и текущей категорий
            // Если они не равны, выводим полученный контент и обнуляем переменную out
            $('[data-category="' + lastCategory + '"]').html(out);
            out = '';
            lastCategory = carentCategory;
        }

        // Создание карты конкретного товара (key)
        out += '<div class="catalog__card">';
        out += '<div class="card__content">';
        out += `<div class="card__img"><img src="${data[key].img}" alt=""></div>`;
        out += '<div class="card__desc">';
        out += '<div class="card__desc-top">';
        out += `<h3 class="card__title">${data[key].name}</h3>`;
        out += '<div class="card__price">' + data[key].cost + '&#8381;</div></div>';
        out += '<div class="card__desc-bottom">';
        out += `<h4 class="card__composition">${data[key].composition}</h4>`;
        out += `<div class="card__weight">${data[key].weight}</div>`;
        out += '</div></div></div>';
        out += `<button data-action='add-to-cart' data-card-id='${key}' class="card__btn btn_white btn">Добавить</button>`;
        out += '</div>';
    }

    // По завершению перебора JSON файла, выводим оставшийся контент
    $('[data-category="' + lastCategory + '"]').html(out);

    // Вызов обработчика клика для кнопки ""добавить""
    $('[data-action="add-to-cart"]').click(goodsPlus);
}

function goodsPlus() {
    let id = $(this).attr('data-card-id'); // id товара, который мы добавляем

    if (cart[id] !== undefined) {
        // если товар в корзине есть, прибавляем единицу
        cart[id]++
    } else {
        // если товара в корзине нет, устанавливаем значение единицы
        cart[id] = 1;
    }
    showGoodsInCart();
    saveCart();
}

function goodsMinus() {
    let id = $(this).attr('data-card-id'); // id товара, который мы добавляем

    if (cart[id] === 1) {
        // если кол-во товара в корзине равно единице, то удаляем товар
        delete cart[id]
    } else {
        // если товара в корзине больше единицы, отнимаем один
        cart[id]--;
    }
    showGoodsInCart();
    saveCart();
}

function saveCart() {
    // Сохраняем содержимое корзины в локал сторэдж
    localStorage.setItem('cart', JSON.stringify(cart)); //переводим объект cart в строку
}

function showGoodsInCart() {
    // Выводим товары в корзину
    let goods = dataStorage;
    let totalPrice = 0;

    let out = '';
    for (var id in cart) {
        // формируем карточку товара в корзине
        out += '<div class="cart__item">';
        out += '<div class="item__content">';
        out += '<div class="item__img">';
        out += `<img src="${goods[id].img}" alt=""></div>`;
        out += '<div class="item__info">';
        out += `<div class="item__title">${goods[id].name}</div>`;
        out += `<div class="item__category">${goods[id].category}</div></div></div>`;
        out += '<div class="item__quantity-wrap">';
        out += `<button data-card-id="${id}" data-action="goodsMinus" type="button" class="item__minus">-</button>`;
        out += `<div class="item__quantity">${cart[id]}</div>`;
        out += `<button data-card-id="${id}" data-action="goodsPlus" type="button" class="item__plus">+</button></div>`;
        out += '<div class="item__price">' + goods[id].cost * cart[id] + '&#8381;</div></div>';

        totalPrice += goods[id].cost * cart[id]; // высчитываем итоговую сумму
    }
    $('[data-cart="cart"]').html(out); //выводим контент из переменной out в корзину
    $('[data-action="goodsPlus"]').on('click', goodsPlus); // Назначаем обработчики для кнопок
    $('[data-action="goodsMinus"]').click(goodsMinus); // прибавления и удаления товара

    refreshResult(parseInt(totalPrice)); // Вызываем функцию обновления итоговой цены
}

function refreshResult(totalPrice) {

    let out = '';
    $('[data-cart="result"]').html(out);

    let deliveryCost;
    if (totalPrice >= 3000 || totalPrice < 100) {
        // определяем сумму доставки в зависимости от суммы заказа
        deliveryCost = 0;
    } else {
        deliveryCost = 99;
    };

    // totalPrice += deliveryCost;

    // формируем каточку результата
    out += `<div class="cart__info">`;
    out += `<h4>Итог:</h4>`;
    out += `<span class="cart__total-price">${parseInt(totalPrice)}&#8381;</span></div>`;
    // out += `<div class="cart__info">`;
    // out += `<h4>Доставка:</h4>`;
    // out += `<span class="cart__delivery-price">${deliveryCost}&#8381;</span></div>`;


    $('[data-cart="result"]').html(out); // выводим результат в корзину
    $('[data-action="enableForm"]').bind('click', enableForm);

}

function enableForm() {
    if ($(this).attr('type') === 'button') {

        let out = '';
        let cartForm = $('form[data-type="cart"]');

        out += '<input type="text" id="ename" name="user__name" placeholder="Имя">';
        out += '<input type="text" id="ephone" name="user__phone" required placeholder="+7 (999) 999-99-99">'

        $('[data-cart="form"]').html(out);

        $('[data-cart="form"]').removeClass('_hidden');

        $('[data-action="enableForm"]').unbind('click', enableForm);
        $('[data-action="enableForm"]').bind('click', sendEmail);
    }

    $(this).attr('type', "submit");
}

function sendEmail() {
    let ename = $('#ename').val();
    let phone = $('#ephone').val();
    let ephone = String(parseInt(phone));

    if (ephone.length >= 11) {
        $('#ephone').removeClass('_alert');

        $.ajax({
            type: "POST",
            url: "/mail.php",
            data: {
                "ename": ename,
                "ephone": ephone,
                "cart": cart
            }
        }).done(function() {
            $('[data-cart="cart"]').hide();
            delGoods();

            $(this).trigger("reset");
            $('[data-action="enableForm"]').hide();

            $('[data-cart="form"]').addClass('_hidden');

            let out = '';
            $('[data-cart="result"]').html(out);

            out += '<h2 class="tnx">Спасибо за заказ! <br> Мы вам перезвоним</h2>';
            $('[data-cart="result"]').html(out);
            return true;
        });

        return false;

    } else {
        $('#ephone').addClass('_alert');
        return false;
    }
}

function delGoods() {

    for (var id in cart) {
        delete cart[id];
        saveCart();
        showGoodsInCart();
    }

}

function isEmpty(object) {
    //проверка корзины на пустоту
    for (var key in object)
        if (object.hasOwnProperty(key)) return true;
    return false;
}



function loadCart() {
    //проверяю есть ли в localStorage запись cart
    if (localStorage.getItem('cart')) {
        // если есть - расширфровываю и записываю в переменную cart
        cart = JSON.parse(localStorage.getItem('cart'));
        showGoodsInCart();
    }
}


$(document).ready(function() {

    init();

});
