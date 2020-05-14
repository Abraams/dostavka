  const modal = document.querySelectorAll('.modal');
  const modalExit = document.querySelectorAll('[data-modal-exit]');
  const buttons = document.querySelectorAll('[data-action^="modal"]');
  const pageWrap = document.querySelector('.page-wrap');

  // --- список возможных заголовков
  const titles = [
      'Закажите обратный звонок',
      'Оформить заказ',
      'Спасибо за заявку'
  ];

  const closeModal = function() {
      modal.forEach(item => {
          if (!item.classList.contains('_hidden')) {
              item.classList.add('_hidden')
          }
      })

      // toggleBlur();
  };

  // const toggleBlur = function() {
  //   pageWrap.classList.toggle('_blur');
  // }

  // --- функция смены заголовка можального окна исходя из дата атрибута кнопки
  const changemodalTitle = function(modalId, modalTitle, modalParagraph) {


      // --- определяем заголовок и параграф модального окна
      const modalTitleElem = document.querySelector("#" + modalId + ' .modal__title');
      const modalParagraphElem = document.querySelector("#" + modalId + ' .modal__policy');
      // меняем заголовок
      modalTitle = parseInt(modalTitle);
      modalTitleElem.innerHTML = titles[modalTitle - 1]

      if (modalParagraph) {
          modalParagraph = parseInt(modalParagraph);
          modalParagraphElem.innerHTML = document.querySelector('[data-policy="' + modalParagraph + '"]').innerHTML;

      }

  };

  // --- Функция Открытия модального окна
  const openModal = function(modalId, modalTitle, modalParagraph) {


      let currentModal = document.querySelector("#" + modalId);

      let massageSubj = currentModal.querySelector('input[name="massage_subj"]');

      if (massageSubj !== null) {
          massageSubj.value = titles[modalTitle - 1];
      }


      // --- меняем заголовок модального окна
      if (modalTitle !== false && modalParagraph !== false) {
          changemodalTitle(modalId, modalTitle, modalParagraph);
      } else if (modalTitle !== false && modalParagraph == false) {
          changemodalTitle(modalId, modalTitle);
      }
      // --- блюрим задний фон
      // toggleBlur();

      // --- открываем модальное окно
      currentModal.classList.remove('_hidden')
  };



  modalExit.forEach(item => {
      item.addEventListener('click', closeModal)
  })

  // --- Перебор все кнопок на сайте и вызов функции открытия модального окна
  buttons.forEach(function(element) {
      element.addEventListener('click', () => {
          if (element.hasAttribute('data-action')) {
              // --- определение дата атрибутов
              let modalId = element.getAttribute('data-action');
              let modalTitle = element.getAttribute('data-title');
              // --- вызов функции открытия модального окна
              if (element.hasAttribute('data-paragraph')) {
                  let modalParagraph = element.getAttribute('data-paragraph');
                  openModal(modalId, modalTitle, modalParagraph);
              } else {
                  openModal(modalId, modalTitle);
              }
          }
      });

  });

  $("form[data-type='modal']").submit(function() {
      let th = $(this);
      let id = th.attr('data-metrica-id');
      let submitBtn = th.children('.modal__btn')
      $.ajax({
          type: "POST",
          url: "/mail2.php", //Change
          data: th.serialize()
      }).done(function formSubmit() {
          // fbq('track', 'Lead', {
          // 	content_name: 'Отправка формы'
          // });
          submitBtn.attr('disabled', 'disabled');
          submitBtn.val('Отправка заявки...');
          // yaCounter56484733.reachGoal(id);
          setTimeout(function() {
              th.trigger("reset");
              submitBtn.val('Ваша заявка доставлена');
              closeModal();
              openModal('modal-thx', '3');
              setTimeout(function() {
                  closeModal();
              }, 2500);
              return true;
          }, 1000);
      });
      return false;
  });
