const tokens = require('./fromTokenList.json')
const fs = require('fs');

let arrOfAddr = [];
tokens.tokens.forEach((item) => {
    if (item.chainId == 1) {
        arrOfAddr.push(item.address)
    }
})

fs.writeFile('./tokenlist.json', JSON.stringify(arrOfAddr), err => {
    if (err) {
      console.error(err);
    }
    // file written successfully
});