import Web3 from 'web3';
import Transaction from '@catalyst-net-js/tx';
import {HDWalletProvider} from '@catalyst-net-js/truffle-provider';

const mnemonic = 'silly funny task remove diamond maximum rack awesome sting chalk recycle also social banner verify';
const provider = new HDWalletProvider(mnemonic, `http://localhost:5005/api/eth/request`);
const web3 = new Web3(provider);
const address = provider.getAddress(0);

const { numberToHex, toWei, bytesToHex } = web3.utils;

export function sendTransaction(to, value, gasPrice, gasLimit) {
    web3.eth.sendTransaction({
    from: address,
    to: to,
    value: numberToHex(toWei(value, 'ether')),
    gasPrice: numberToHex(toWei(gasPrice, 'gwei')),
    gasLimit: numberToHex(gasLimit),
    data: '0x0',
    }, function(error, hash){
    if(error) console.error(error);
    console.log('Hash: ', hash);
    });
}

export async function sendRawTransaction(to, value, gasPrice, gasLimit) {
    const nonce = await web3.eth.getTransactionCount(address);

    const tx = new Transaction({
      nonce: `0x${parseInt(nonce, 16)}`,
      gasPrice: numberToHex(toWei(gasPrice, 'gwei')),
      gasLimit: numberToHex(gasLimit),
      to: to,
      value: numberToHex(toWei(value, 'ether')),
      data: '0x0',
  });

  await tx.sign(provider.wallets[address].getPrivateKey());

  const raw = bytesToHex(tx.serialize());

  web3.sendRawTrasnaction(raw, function(error, hash){
    if(error) console.error(error);
    console.log('Hash: ', hash);
    });
}