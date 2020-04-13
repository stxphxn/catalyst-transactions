import Web3 from 'web3';

async function loadProvider() {
    const mnemonic = 'silly funny task remove diamond maximum rack awesome sting chalk recycle also social banner verify';
    const { HDWalletProvider } = (await import('@catalyst-net-js/truffle-provider'));
    return new HDWalletProvider(mnemonic, 'http://localhost:5005/api/eth/request');
}

async function loadTxLib() {
    return import('@catalyst-net-js/tx');
}

const { numberToHex, toWei, bytesToHex } = Web3.utils;

// export async function sendTransaction(to, value, gasPrice, gasLimit) {
//     const provider = (await loadProvider());
//     const web3 = new Web3(provider);
//     const address = provider.getAddress(0);
//     console.log(address);

//     await web3.eth.sendTransaction({
//     from: address,
//     to: to,
//     value: numberToHex(toWei(value.toString(), 'ether')),
//     gasPrice: numberToHex(toWei(gasPrice.toString(), 'gwei')),
//     gasLimit: numberToHex(gasLimit),
//     data: '0x0',
//     }, function(error, hash){
//     if(error) console.error(error);
//     console.log('Hash: ', hash);
//     return hash;
//     });
// }

export async function sendRawTransaction(to, value, gasPrice, gasLimit) {
    const provider = (await loadProvider());
    const address = provider.getAddress(0);
    const web3 = new Web3('http://localhost:5005/api/eth/request');
    const nonce = await web3.eth.getTransactionCount(address);

    const {Transaction} = (await loadTxLib());
    const tx = new Transaction({
      nonce: `0x${parseInt(nonce, 16)}`,
      gasPrice: numberToHex(toWei(gasPrice.toString(), 'gwei')),
      gasLimit: numberToHex(gasLimit),
      to: to,
      value: numberToHex(toWei(value.toString(), 'ether')),
      data: '0x0',
  });

  await tx.sign(provider.wallets[address].getPrivateKey());

  const raw = bytesToHex(tx.serialize());

  return new Promise((resolve, reject) => {
    web3.eth.sendSignedTransaction(raw, function(error, hash){
        if(error) reject(error);
        console.log('Hash: ', hash);
        return resolve(hash);
        });
  });
 
}