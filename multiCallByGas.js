const Web3 = require('web3');
const ethWallet = require('ethereumjs-wallet').default;
const {
  Web3ProviderConnector,
  MultiCallService,
  GasLimitService
} = require('@1inch/multicall');
const {ERC20ABI, contractAddress} = require('./util')
const tokens = require('./tokenlist.json')

const provider = new Web3ProviderConnector(
  new Web3(
    'https://xxx'
  )
);

const gasLimitService = new GasLimitService(provider, contractAddress);
const multiCallService = new MultiCallService(provider, contractAddress);

const balanceOfGasUsage = 30_000;

const gasLimit = gasLimitService.calculateGasLimit();

const params = {
    maxChunkSize: 500,
    retriesLimit: 3,
    blockNumber: 'latest',
    gasBuffer: 3000000,
    maxGasLimit: 150000000
};


async function checker() {

  let walletAddress = ethWallet.generate();
  console.log("address: " + walletAddress.getAddressString());

  const requests = tokens.map((tokenAddress) => {
    return {
        to: tokenAddress,
        data: provider.contractEncodeABI(
            ERC20ABI,
            tokenAddress,
            'balanceOf',
            [walletAddress.getAddressString()]
        ),
        gas: balanceOfGasUsage
    };
  });

  await multiCallService.callByGasLimit(
      requests,
      gasLimit,
      params
  ).then((res)=>{
    res.forEach((item, counter) => {
      if (item > 0) {
        console.log(requests[counter].to)
        console.log(parseInt(item, 16) + "\n")
      }
    })
  });

  console.log('done')

}

(async function() {while (true) {
  await checker()
}})()



