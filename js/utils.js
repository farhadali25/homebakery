// utils.js — helper functions
function formatCurrency(amount){
  return new Intl.NumberFormat('en-US',{style:'currency',currency:'USD'}).format(amount);
}

function qs(selector){return document.querySelector(selector)}

window.HBUtils = { formatCurrency, qs };
