window.onload = function() {

    const HTML = document.querySelector('html');

    // --- БЛОК ГЛАВНОГО МЕНЮ ---
    const header = document.querySelector('.header');
    const menu = document.querySelector('.header__nav');

    // -- Липкое меню --
    let winScroll = 0;

    // Функция отображения мобильного меню
    const mobileMenuOn = function() {
        header.classList.add('_fixed');
    };
    // Функция скрытия мобильного меню
    const mobileMenuOff = function() {
        header.classList.remove('_fixed');
        closeMenu();
    };
    // Условие отображения мобильного меню
    if (window.screen.width >= 1201) {
        window.addEventListener('scroll', () => {
            winScroll = HTML.scrollTop;
            if (winScroll >= 900 && !header.classList.contains('_fixed')) {
                mobileMenuOn();
            } else if (winScroll <= 700 && header.classList.contains('_fixed')) {
                mobileMenuOff();
            }
        });
    } else {
        mobileMenuOn();
    }

    // Функция открытия меню
    const openMenu = function() {
        menu.classList.remove('_hidden');
    }
    // Функция закрытия меню
    const closeMenu = function() {
        menu.classList.add('_hidden');

        return false;
    }

    const toggleMenu = function() {
        if (menu.classList.contains('_hidden')) {
            openMenu();
        } else {
            closeMenu();
        }
    };
    // Функция присваивания события по клику на закрывающие/открывающие меню элементы
    // exitMenuElems.forEach(elem => {
    //     elem.addEventListener('click', toggleMenu)
    // });
    // Функция присваивания события по клику на закрывающие меню ссылки
    // exitMenuLinks.forEach(elem => {
    //   elem.addEventListener('click', closeMenu);
    // });
    // exitMenuAnchor.forEach(elem => {
    //   elem.addEventListener('click', closeMenu);
    // });

    // ---  ---


}
