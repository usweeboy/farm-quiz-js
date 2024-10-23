// Модальные окна
const popupController = ({popup, btnOpen, btnClose, time = 300}) => {
  const buttonElems = document.querySelectorAll(btnOpen);
  const popupElem = document.querySelector(popup);
  const body = document.body;

  popupElem.style.cssText = `
    display: flex;
    visibility: hidden;
    opacity: 0;
    transition: opacity ${time}ms ease-in-out;
  `;

  const closePopup = event => {
    const target = event.target;

    if (
      target === popupElem ||
      (btnClose && target.closest(btnClose)) ||
      event.code === 'Escape'
    ) {

      popupElem.style.opacity = 0;
      body.classList.remove("body-lock");

      setTimeout(() => {
        popupElem.style.visibility = 'hidden';
      }, time);

      window.removeEventListener('keydown', closePopup);
    }
  }

  const openPopup = () => {
    popupElem.style.visibility = 'visible';
    popupElem.style.opacity = 1;
    body.classList.add("body-lock");
    window.addEventListener('keydown', closePopup);
  };

  buttonElems.forEach(btn => {
    btn.addEventListener('click', openPopup);
  });

  popupElem.addEventListener('click', closePopup);
};

popupController({
  popup: '.popup-login',
  btnOpen: '.popup-login-open',
  btnClose: '.popup-login-close',
});

popupController({
  popup: '.popup-registration',
  btnOpen: '.popup-registration-open',
  btnClose: '.popup-registration-close'
});



// Квиз
const quizItems = document.querySelectorAll("[data-quiz-game]");

if (quizItems.length) {
  quizItems.forEach((quizItem) => {
    const quizBeginning = quizItem.querySelector("[data-quiz-beginning]");
    const quizPlay = quizItem.querySelector("[data-quiz-play]");
    const quizPreview = quizItem.querySelector("[data-quiz-preview]");
    const quizGo = quizItem.querySelector("[data-quiz-go]");
    const quizPages = quizItem.querySelectorAll("[data-quiz-page]");
    const quizResult = quizItem.querySelector("[data-quiz-result]");

    let current = 0;
    let rightAnswers = 0;

    if (quizPlay && quizBeginning && quizPreview) {
      quizPlay.addEventListener("click", (e) => {
        e.preventDefault();

        quizBeginning.classList.add("_hidden");
        quizPreview.classList.remove("_hidden");

        quizItem.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (quizGo && quizPages.length && quizPreview) {
      quizGo.addEventListener("click", (e) => {
        e.preventDefault();

        quizPreview.classList.add("_hidden");
        quizPages[current].classList.remove("_hidden");

        quizItem.scrollIntoView({ behavior: "smooth" });
      });
    }

    if (quizPages.length && quizResult && quizBeginning) {
      quizPages.forEach((quizPage) => {
        const quizNext = quizPage.querySelector("[data-quiz-next]");
        const quizAnswers = quizPage.querySelectorAll("[data-quiz-answer]");
        const quizClose = quizResult.querySelector("[data-quiz-close]");
        const quizResultRights = quizResult.querySelector(
          "[data-quiz-result-rights]"
        );
        const quizResultAll = quizResult.querySelector(
          "[data-quiz-result-all]"
        );

        if (
          quizNext &&
          quizAnswers.length &&
          quizResultRights &&
          quizResultAll &&
          quizClose
        ) {
          quizNext.addEventListener("click", (e) => {
            e.preventDefault();

            quizItem.scrollIntoView({ behavior: "smooth" });

            if (quizNext.classList.contains("_answer")) {
              quizAnswers.forEach((quizAnswer) => {
                const quizAnswerCheckbox = quizAnswer.querySelector(
                  "[data-quiz-answer-checkbox]"
                );

                if (quizAnswerCheckbox && quizAnswerCheckbox.checked == true) {
                  quizAnswer.classList.add("_active");
                  quizNext.removeAttribute("disabled");

                  if (quizAnswer.classList.contains("_right")) {
                    rightAnswers++;
                  }

                  quizAnswers.forEach((item) => {
                    item.classList.add("_disabled");
                  });
                }
              });
            } else {
              current++;

              quizAnswers.forEach((quizAnswer) => {
                const quizAnswerCheckbox = quizAnswer.querySelector(
                  "[data-quiz-answer-checkbox]"
                );

                if (quizAnswerCheckbox && quizAnswerCheckbox.checked === true) {
                  if (quizAnswer.classList.contains("_right")) {
                    rightAnswers++;
                  }
                }
              });

              quizPages.forEach((item) => {
                item.classList.add("_hidden");
              });

              if (current < quizPages.length) {
                quizPages[current].classList.remove("_hidden");
              } else {
                quizResult.classList.remove("_hidden");
                quizResultRights.innerHTML = rightAnswers;
                quizResultAll.innerHTML = quizPages.length;
              }
            }
          });

          quizClose.addEventListener("click", (e) => {
            e.preventDefault();

            current = 0;
            rightAnswers = 0;

            quizResult.classList.add("_hidden");
            quizBeginning.classList.remove("_hidden");
            quizNext.setAttribute("disabled", true);

            quizAnswers.forEach((quizAnswer) => {
              const quizAnswerCheckbox = quizAnswer.querySelector(
                "[data-quiz-answer-checkbox]"
              );

              if (quizAnswerCheckbox) {
                quizAnswer.classList.remove("_active");
                quizAnswer.classList.remove("_disabled");
                quizAnswerCheckbox.checked = false;
              }
            });
          });
        }
      });
    }
  });
}



// Работа с чекбоксами
const checkboxesParents = document.querySelectorAll("[data-quiz-checkboxes]");

if (checkboxesParents.length) {
  checkboxesParents.forEach((checkboxesParent) => {
    const checkboxes = checkboxesParent.querySelectorAll(
      'input[type="checkbox"]'
    );

    if (checkboxes.length) {
      for (let i = 0; i < checkboxes.length; i++) {
        const checkbox = checkboxes[i];

        checkbox.addEventListener("click", () => {
          if (checkboxesParent.dataset.checkboxes != "validate") {
            const quizPage =
              checkbox.parentElement.parentElement.parentElement.parentElement.parentElement.parentElement.closest(
                "[data-quiz-page]"
              );

            if (quizPage) {
              const quizNext = quizPage.querySelector("[data-quiz-next]");

              if (quizNext) {
                quizNext.removeAttribute("disabled");

                checkbox.parentElement.parentElement.classList.add(
                  "_active"
                );
                checkboxes.forEach((item) => {
                  item.parentElement.parentElement.classList.add(
                    "_disabled"
                  );
                });
              }
            }
          }
        });
      }
    }
  });
}



// МАСКА ВВОДА ДЛЯ ТЕЛЕФОНА
document.addEventListener("DOMContentLoaded", function () {
  const phoneInputs = document.querySelectorAll('input[data-tel-input]');

  const getInputNumbersValue = (input) => {
    return input.value.replace(/\D/g, '');
  }

  const onPhonePaste = (e) => {
    let input = e.target,
        inputNumbersValue = getInputNumbersValue(input);
    let pasted = e.clipboardData || window.clipboardData;
    if (pasted) {
      let pastedText = pasted.getData('Text');
      if (/\D/g.test(pastedText)) {
        input.value = inputNumbersValue;
        return;
      }
    }
  }

  const onPhoneInput = (e) => {
    let input = e.target,
        inputNumbersValue = getInputNumbersValue(input),
        selectionStart = input.selectionStart,
        formattedInputValue = "";

    if (!inputNumbersValue) {
      return input.value = "";
    }

    if (input.value.length != selectionStart) {
      if (e.data && /\D/g.test(e.data)) {
        input.value = inputNumbersValue;
      }
      return;
    }

    if (["7", "8", "9"].indexOf(inputNumbersValue[0]) > -1) {
      if (inputNumbersValue[0] == "9") inputNumbersValue = "7" + inputNumbersValue;
      let firstSymbols = (inputNumbersValue[0] == "8") ? "8" : "+7";
      formattedInputValue = input.value = firstSymbols + " ";
      if (inputNumbersValue.length > 1) {
        formattedInputValue += '(' + inputNumbersValue.substring(1, 4);
      }
      if (inputNumbersValue.length >= 5) {
        formattedInputValue += ') ' + inputNumbersValue.substring(4, 7);
      }
      if (inputNumbersValue.length >= 8) {
        formattedInputValue += '-' + inputNumbersValue.substring(7, 9);
      }
      if (inputNumbersValue.length >= 10) {
        formattedInputValue += '-' + inputNumbersValue.substring(9, 11);
      }
    } else {
      formattedInputValue = '+' + inputNumbersValue.substring(0, 16);
    }

    input.value = formattedInputValue;
  }
  const onPhoneKeyDown = (e) => {
    let inputValue = e.target.value.replace(/\D/g, '');
    if (e.keyCode == 8 && inputValue.length == 1) {
      e.target.value = "";
    }
  }

  for (let phoneInput of phoneInputs) {
    phoneInput.addEventListener('keydown', onPhoneKeyDown);
    phoneInput.addEventListener('input', onPhoneInput, false);
    phoneInput.addEventListener('paste', onPhonePaste, false);
  }
});