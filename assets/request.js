const baseUrl = 'https://api.coinlore.net/api/tickers/';

const requestCoins = async (value) => {
  try{
    const res = await fetch(baseUrl);
    const json = await res.json();
    const data = json.data;

    const results = value ? dividedArray(data.filter(coin => 
    coin.name.toLowerCase().includes(value.toLowerCase())
    ),10) : dividedArray(data,10)

    return {
    results: results,
    total: results.length,
    current: 0,
    prev: null,
    next: 1,
  };
  } catch (error) {
    console.log(error)
  };
};

const dividedArray = (arr,size) => {
  let chuck =[];

  for(let i=0; i< arr.length; i += size){
    chuck.push(arr.slice(i, i + size))
  };

  return chuck;
};

requestCoins();
