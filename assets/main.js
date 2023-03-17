const tbody = document.querySelector('tbody');
const prevBtn = document.querySelector('.prev');
const nextBtn = document.querySelector('.next');
const pageNum = document.querySelector('.page-num');
const form = document.querySelector('form');
const searchInput = document.querySelector('input');
const topBtn = document.querySelector('.top-btn');
const btnCont = document.querySelector('.page-manage');

const twoDecimals = (num) => {
  return num.toFixed(2)
};

const renderCoin = (coin) => {
  const {rank, market_cap_usd, name, symbol, price_usd, volume24, percent_change_24h, percent_change_7d} = coin;

  return `
  <tr>
    <td>${rank}</td>
    <td>${name} (${symbol})</td>
    <td>$${price_usd}</td>
    <td>$${market_cap_usd}</td>
    <td>$${twoDecimals(volume24)}</td>
    <td class="${percent_change_24h < 0 ? 'red' : 'green'}">${percent_change_24h < 0 ? ' ' : '+'}${percent_change_24h}%</td>
    <td class="${percent_change_7d < 0 ? 'red' : 'green'}">${percent_change_7d < 0 ? ' ' : '+'}${percent_change_7d}%</td>
  </tr>`
};

const renderCoins = async (coins, current) => {
  if(!coins.length){
    tbody.innerHTML= `<p>No se han encontrado resultados a su busqueda </p>`
    topBtn.classList.remove('hidden');
    btnCont.classList.add('hidden');
    form.reset();
    return;
  }
  btnCont.classList.remove('hidden');
  tbody.innerHTML= coins[current].map(renderCoin).join('');
}

const disabledPrevBtn = (prev) => {
  if(prev === null){
    prevBtn.classList.add('disabled')
  } else{
    prevBtn.classList.remove('disabled')
  }
}

const disabledNextBtn = (next, total) => {
  if(next === total){
    nextBtn.classList.add('disabled')
  } else{
    nextBtn.classList.remove('disabled')
  }
}

const setCoins = (coins) => {
  prev = coins.prev;
  current = coins.current;
  next = coins.next;
  total = coins.total;
  results = coins.results;
}

const loadCoins = async (e) => {
  e.preventDefault();

  const search = searchInput.value.trim();
  let coins = await requestCoins(search);
  setCoins(coins);

  if(search){
    topBtn.classList.remove('hidden');
    form.reset();
  }else{
    topBtn.classList.add('hidden');
  };

  pageNum.innerHTML= current+1;
  renderCoins(results, current);
  disabledNextBtn(next, total);
  disabledPrevBtn(prev);

  nextBtn.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    if(next === total)return;
    prev = current;
    current += 1;
    next += 1;
    renderCoins(results, current);
    pageNum.innerHTML = current +1;
    disabledNextBtn(next, total);
    disabledPrevBtn(prev);
  })

  prevBtn.addEventListener('click', (e) => {
    e.stopImmediatePropagation();
    if(prev === null) return;
    current -= 1;
    prev = prev===0 ? null : current -1;
    next -= 1;
    renderCoins(results,current);
    pageNum.innerHTML= current+1;
    disabledNextBtn(next, total);
    disabledPrevBtn(prev);
  })
};

const showTop100 = () => {
  loadCoins();
};

const init = () => {
  window.addEventListener('DOMContentLoaded', loadCoins);
  form.addEventListener('submit', loadCoins);
  topBtn.addEventListener('click', loadCoins);
}

init();