/*
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.hotkeys = factory());
})(this, (function () { 
  'use strict';
*/
/*
<div class="menu">
  <div class="container">
    <div class="toggle"></div>
  </div>
  
  <span class="hidden"><a href="#">Home </a></span><span class="hidden"><a href="#">About </a></span><span class="hidden"><a href="#">Info</a></span><span class="hidden"><a href="#">Contact</a></span>
</div>
*/
(function() {
  'use strict';
  function addNavHeader() {
      console.info('INIT NAV HEADER BOOKMARK')
      const menuDiv = document.createElement('div')
      menuDiv.classList.add('.menu-nav-header')
      const containerDiv = document.createElement('div')
      containerDiv.classList.add('container-nav-header')
      const toggleDiv = document.createElement('div')
      toggleDiv.classList.add('toggle-nav-header')
      containerDiv.append(toggleDiv)
      menuDiv.append(containerDiv)
  
      const spanHidden = document.createElement('span')
      spanHidden.classList.add('hidden-nav-header')
      spanHidden.classList.add('span-nav-header')
      spanHidden.innerHTML = 'Test menu'
      menuDiv.append(spanHidden)

      const body = document.querySelector('body')
      body.append(menuDiv)
      console.info('ADDED ELEMENT NAV HEADER BOOKMARK')
  
      const eltToggle = document.querySelector('.toggle-nav-header');
      eltToggle.addEventListener('click', function() {
        const eltMenu = document.querySelector('.menu-nav-header');
        const eltSpan = document.querySelector('span.hidden-nav-header');
        const eltContainer = document.querySelector('.container-nav-header');
        eltMenu.classList.toggle('expanded-nav-header');
        eltSpan.classList.toggle('hidden-nav-header');
        eltContainer.classList.toggle('close-nav-header');
        eltToggle.classList.toggle('close-nav-header');
      })
      console.info('ADDED LISTENER NAV HEADER BOOKMARK')
  }
})
/*
$('.toggle').on('click', function() {
  $('.menu').toggleClass('expanded');  
  $('span').toggleClass('hidden');  
  $('.container , .toggle').toggleClass('close');  
});
*/
