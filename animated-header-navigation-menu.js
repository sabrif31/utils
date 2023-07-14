(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.hotkeys = factory());
})(this, (function () { 
  'use strict';
  
  const eltToggle = document.querySelector('.toggle');
  eltToggle.addEventListener('click', function() {
    const eltMenu = document.querySelector('.menu');
    const eltSpan = document.querySelector('span');
    const eltContainer = document.querySelector('.container');
    eltMenu.classList.toggle('expanded');
    eltSpan.classList.toggle('hidden');
    eltContainer.classList.toggle('close');
    eltToggle.classList.toggle('close');
  })
}))
/*
$('.toggle').on('click', function() {
  $('.menu').toggleClass('expanded');  
  $('span').toggleClass('hidden');  
  $('.container , .toggle').toggleClass('close');  
});
*/
