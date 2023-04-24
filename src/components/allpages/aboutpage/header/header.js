const headerBurger = document.querySelector('.header__burger');
const headerMenu = document.querySelector('.header__menu');
const body = document.querySelector('body');

function handleClick() {
  headerBurger.classList.toggle('active');
  headerMenu.classList.toggle('active');
  body.classList.toggle('lock');
}

headerBurger.addEventListener('click', handleClick);
