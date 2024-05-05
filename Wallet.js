import { ethers } from 'https://cdnjs.cloudflare.com/ajax/libs/ethers/6.7.0/ethers.min.js';

const etherData = {
  provider: undefined,
  balance: undefined,
  address: undefined,
  signer: undefined,
};

const bitcoinData = {
  network: undefined,
  address: undefined,
  keyPair: undefined,
  p2pkh: undefined,
  balance: undefined,
};

const ERC20Abi = [
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'MaxSupply',
        type: 'uint256',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'increasedSupply',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'cap',
        type: 'uint256',
      },
    ],
    name: 'ERC20ExceededCap',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'allowance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'ERC20InsufficientAllowance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'balance',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'needed',
        type: 'uint256',
      },
    ],
    name: 'ERC20InsufficientBalance',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'approver',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidApprover',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'cap',
        type: 'uint256',
      },
    ],
    name: 'ERC20InvalidCap',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'receiver',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidReceiver',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'sender',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidSender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'ERC20InvalidSpender',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'OwnableInvalidOwner',
    type: 'error',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'OwnableUnauthorizedAccount',
    type: 'error',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'previousOwner',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'OwnershipTransferred',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        indexed: true,
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        indexed: false,
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'Transfer',
    type: 'event',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
    ],
    name: 'allowance',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'spender',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'approve',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'burn',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'account',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'burnFrom',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'cap',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'decimals',
    outputs: [
      {
        internalType: 'uint8',
        name: '',
        type: 'uint8',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'name',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'owner',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'renounceOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [],
    name: 'symbol',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [],
    name: 'totalSupply',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transfer',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'from',
        type: 'address',
      },
      {
        internalType: 'address',
        name: 'to',
        type: 'address',
      },
      {
        internalType: 'uint256',
        name: 'value',
        type: 'uint256',
      },
    ],
    name: 'transferFrom',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'newOwner',
        type: 'address',
      },
    ],
    name: 'transferOwnership',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
];
const tokenAddress = '0xc81785A7D2fB4069e820258D761e3a702aB06b36'; 
const accountPriKey = '';
//Your ethereum private key

let lockClick = false;
let txLinkState = false;
let wrapperState = 'ETH';

//connect
const connectMetamask = document.getElementById('connectMetamask');
const connectBTC = document.getElementById('connectBTC');

//wrappers
const wrapperETH = document.getElementById('wrapper-eth');
const wrapperERC20 = document.getElementById('wrapper-erc20');
const wrapperBTC = document.getElementById('wrapper-btc');
const wrapperAuthBTC = document.getElementById('BTCAuthwrapper');
let wrappers = [wrapperETH, wrapperERC20, wrapperAuthBTC];

//Switchers
const switcherETH = document.getElementById('EtherSwitcher');
const switcherERC20 = document.getElementById('ERC20Switcher');
const switcherBTC = document.getElementById('BTCSwitcher');
let switchers = [switcherETH, switcherERC20, switcherBTC];

//Transaction Data
const txHash = document.getElementById('tx-hash');
const txLink = document.getElementById('TX-link');
const txHashBTC = document.getElementById('tx-hashBTC');
const txLinkBTC = document.getElementById('TX-linkBTC');

//Ether part
const userBalanceETH = document.getElementById('current-balance');
const userAddressETH = document.getElementById('AddressETH');
const addressToETH = document.getElementById('address-to');
const amountToSendETH = document.getElementById('Amount-toSend');
const transferButtonETH = document.getElementById('B-transfer');

//ERC20 part
const userBalanceERC20 = document.getElementById('current-balanceERC');
const userAddressERC20 = document.getElementById('AddressERC20');
const userTokenSymbolERC20 = document.getElementById('ERC20Token-Symbol');
const userTokenNameERC20 = document.getElementById('ERC20Token-name');
const transferButtonERC20 = document.getElementById('B-transferERC20');
const amountToSendERC20 = document.getElementById('Amount-toSend-ERC20');
const addressToERC20 = document.getElementById('address-to-ERC20');

//Bitcoin part
const userBalanceBTC = document.getElementById('current-balanceBTC');
const userAddressBTC = document.getElementById('AddressBTC');
const amountToSendBTC = document.getElementById('Amount-toSend-BTC');
const addressToBTC = document.getElementById('address-to-BTC');
const transferButtonBTC = document.getElementById('B-transferBTC');
const transactionFeeBTC = document.getElementById('BitcoinSendFee');

//Bitcoin Auth
const btcGenerateMnemonicButton = document.getElementById('btcGenerateMnemonicButton');
const btcAuthConnectButton = document.getElementById('btcAuthConnectButton');
const privateKeyFromInput = document.getElementById('btcPrivateKeyField');
const mnemonicInput = document.getElementById('btcMnemonicField');

async function checkMetamaskConnection() {
  console.log(window.ethereum);
  if (!window.ethereum) {
    alert('Install metamask');
    return;
  }

  const providers = new ethers.BrowserProvider(window.ethereum);
  providers.send('eth_requestAccounts', []);

  changeLockStatus();
  checkLockStatus();

  etherData.provider = providers;
  const signers = await etherData.provider.getSigner();
  const addresses = await signers.getAddress();
  etherData.signer = signers;
  etherData.address = addresses;
  etherData.balance = await providers.getBalance(addresses);
  console.log('Connected');
  console.log(etherData.address);

  GetAccountInfoETH();
  GetAccountInfoERC20();

  connectMetamask.parentElement.classList.remove('active');

  if (wrapperState === 'ETH') {
    wrapperETH.classList.add('active');
  }
  if (wrapperState === 'ERC20') {
    wrapperERC20.classList.add('active');
  }
}

async function checkBitcoinConnection() {
  if (txLinkState == true) {
    wrapperBTC.classList.add('active');
  }
  txLinkBTC.classList.remove('active');

  const network = bitcoinjs.networks.testnet;
  bitcoinData.network = network;
  connectBTC.parentElement.classList.remove('active');
  changeWrapperState('BTC');
  console.log('connect');
  const privateKey = privateKeyFromInput.value;
  bitcoinData.keyPair = bitcoinjs.ECPair.fromPrivateKey(bitcoinjs.Buffer.from(privateKey, 'hex'), {
    network: bitcoinData.network,
  });
  bitcoinData.p2pkh = bitcoinjs.payments.p2pkh({
    pubkey: bitcoinData.keyPair.publicKey,
    network: bitcoinData.network,
  });
  bitcoinData.address = bitcoinData.p2pkh.address;
  userAddressBTC.textContent = bitcoinData.address;
  const getBalance = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${bitcoinData.address}/balance`);
  const data = await getBalance.json();
  const balance = data.final_balance;
  bitcoinData.balance = ethers.formatUnits(balance, 8);
  userBalanceBTC.textContent = bitcoinData.balance;
  txLinkState = false;
}

const bitcoinAuthConnect = async () => {
  txLinkBTC.classList.remove('active');
  const privateKey = privateKeyFromInput.value;
  if (!privateKey) {
    alert('Please generate or enter your private key');
    return;
  }
  wrapperAuthBTC.classList.remove('active');
  wrapperBTC.classList.add('active');

  bitcoinData.keyPair = bitcoinjs.ECPair.fromPrivateKey(bitcoinjs.Buffer.from(privateKey, 'hex'), {
    network: bitcoinData.network,
  });
  bitcoinData.p2pkh = bitcoinjs.payments.p2pkh({
    pubkey: bitcoinData.keyPair.publicKey,
    network: bitcoinData.network,
  });

  bitcoinData.address = bitcoinData.p2pkh.address;
  userAddressBTC.textContent = bitcoinData.address;
  const getBalance = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${bitcoinData.address}/balance`);
  const data = await getBalance.json();
  const balance = data.final_balance;
  bitcoinData.balance = ethers.formatUnits(balance, 8);
  userBalanceBTC.textContent = bitcoinData.balance;
  console.log('connect');
};

async function GenerateMnemonic() {
  const seed = ethers.randomBytes(16);
  const mnemonic = ethers.Mnemonic.entropyToPhrase(seed);
  const path = "m/49'/1'/0'/0/0";
  const root = bitcoinjs.bip32.fromSeed(bitcoinjs.Buffer.from(seed), bitcoinData.network);
  const childPrivateKey = root.derivePath(path);
  mnemonicInput.value = mnemonic;
  privateKeyFromInput.value = childPrivateKey.privateKey.toString('Hex');
}

const changeWrapperState = (newState) => {
  if (wrapperState === newState) {
    return;
  }
  wrapperState = newState;
  switchers.forEach((byOne, num) => {
    if (byOne.textContent === newState) {
      byOne.classList.add('active');
      wrappers[num].classList.add('active');
      return;
    }
    byOne.classList.remove('active');
    wrappers[num].classList.remove('active');
  });
};

async function GetAccountInfoETH() {
  txLink.classList.remove('active');
  if (wrapperState == 'ETH') {
    wrapperETH.classList.add('active');
  }
  userAddressETH.textContent = etherData.address;

  let balance = await etherData.provider.getBalance(etherData.address);
  balance = ethers.formatUnits(balance, 18);
  balance = Number(balance).toFixed(4);
  userBalanceETH.textContent = balance;
  userAddressETH.textContent = etherData.address;
}

async function GetAccountInfoERC20() {
  txLink.classList.remove('active');
  if (wrapperState == 'ERC20') {
    wrapperERC20.classList.add('active');
  }
  const wallet = new ethers.Wallet(accountPriKey, etherData.provider);
  const token = new ethers.Contract(tokenAddress, ERC20Abi, etherData.provider);
  const balance = await token.balanceOf('0x960567CE0dF7BB7627Ea124b47dC2FFc7De19d29');
  const name = await token.name();
  const symbol = await token.symbol();
  const decimals = await token.connect(wallet).decimals();
  const balances = ethers.formatUnits(balance, decimals);
  userBalanceERC20.textContent = balances;
  userTokenSymbolERC20.textContent = symbol;
  userTokenNameERC20.textContent = name;
  userAddressERC20.textContent = etherData.address;
}

const sendEther = async function () {
  const addrZero = '0x0000000000000000000000000000000000000000';
  const amount = amountToSendETH.value;
  const toAddr = addressToETH.value;
  const tx = {
    value: ethers.parseEther(amount),
    to: toAddr,
  };

  if (addressToETH.value == addrZero || amountToSendETH.value == 0 || addressToETH.value.length < 42) {
    alert('Wrong Inputs');
    return;
  }

  const sendTx = await etherData.signer.sendTransaction(tx);
  wrapperETH.classList.remove('active');
  txLinkCheck = true;
  await sendTx.wait();
  if (txLinkCheck) {
    txHash.textContent = await sendTx.hash;
    txLink.classList.add('active');
  }
  alert(`${amount} Ether was send to this address => ${toAddr}\nTransaction hash => ${sendTx.hash} `);
  addressToETH.value = '';
  amountToSendETH.value = '';
  setTimeout(GetAccountInfoETH, 7000);
};

const sendERC20 = async function () {
  GetAccountInfoERC20();
  const wallet = new ethers.Wallet(accountPriKey, etherData.provider);
  const valueToSend = amountToSendERC20.value;
  const addressTo = addressToERC20.value;
  const token = new ethers.Contract(tokenAddress, ERC20Abi, etherData.signer);
  const name = await token.name();
  const decimals = await token.decimals();
  const value = ethers.parseUnits(amountToSendERC20.value, decimals);

  const transfer = await token.transfer(addressTo, value);
  await transfer.wait();
  wrapperERC20.classList.remove('active');
  txLinkCheck = true;
  //
  txHash.textContent = await transfer.hash;
  txLink.classList.add('active');

  alert(`${valueToSend} ${name} was send to this address => ${addressTo}\nTransaction hash => ${transfer.hash} `);
  setTimeout(GetAccountInfoERC20, 7000);
  amountToSendERC20.value = '';
  addressToERC20.value = '';
};

const sendBTC = async function () {
  let feeAmountValue = ethers.parseUnits(transactionFeeBTC.value, 8);
  feeAmountValue = Number(feeAmountValue);
  let sendAmount = ethers.parseUnits(amountToSendBTC.value, 8);
  sendAmount = Number(sendAmount);
  const sendToAddress = addressToBTC.value;
  const balance = ethers.parseUnits(bitcoinData.balance, 8);
  const finalBalance = Number(balance) - sendAmount - feeAmountValue;
  console.log(finalBalance);
  const userDataResponce = await fetch(`https://api.blockcypher.com/v1/btc/test3/addrs/${bitcoinData.address}`);
  const userData = await userDataResponce.json();
  console.log(userData);
  const lastTx = userData.txrefs[0];
  const txData = new bitcoinjs.TransactionBuilder(bitcoinData.network);
  txData.addInput(lastTx.tx_hash, lastTx.tx_output_n);
  txData.addOutput(bitcoinData.address, finalBalance);
  txData.addOutput(sendToAddress, sendAmount);
  txData.sign(0, bitcoinData.keyPair);
  const tx = txData.build().toHex();
  console.log(tx);
  wrapperBTC.classList.remove('active');
  try {
    const broadcast = await fetch(`https://api.blockcypher.com/v1/btc/test3/txs/push`, {
      method: 'POST',
      body: JSON.stringify({
        tx: tx,
      }),
    });
    const broadcastTx = await broadcast.json();
    console.log(broadcastTx);
  } catch (e) {
    console.dir(e);
  }

  txHashBTC.textContent = tx.substring(0, 65) + '...';
  txLinkBTC.classList.add('active');
  txLinkState = true;
  alert(`${sendAmount} BTC was send to this address => ${sendToAddress}\nTransaction hash => ${tx} `);
  amountToSendBTC.value = '';
  addressToBTC.value = '';
  setTimeout(checkBitcoinConnection, 7000);
};

transferButtonETH.addEventListener('click', sendEther);
//Sending Ether
transferButtonERC20.addEventListener('click', sendERC20);
//Sending ERC-20 token
transferButtonBTC.addEventListener('click', sendBTC);
// Sending Bitcoin

connectMetamask.addEventListener('click', checkMetamaskConnection);
//Metamask connection
connectBTC.addEventListener('click', checkBitcoinConnection);
//Bitcoin connection

btcGenerateMnemonicButton.addEventListener('click', GenerateMnemonic);
btcAuthConnectButton.addEventListener('click', bitcoinAuthConnect);

function checkLockStatus() {
  if (lockClick == true)
    switcherETH.addEventListener('click', () => {
      changeWrapperState('ETH');
    });
  switcherERC20.addEventListener('click', () => {
    changeWrapperState('ERC20');
  });
  switcherBTC.addEventListener('click', () => {
    changeWrapperState('BTC');
  });
}

function changeLockStatus() {
  lockClick = true;
}

function nothing() {
  console.log('nothing');
}
