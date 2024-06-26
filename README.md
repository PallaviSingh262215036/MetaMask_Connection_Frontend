# MyToken DApp

This project demonstrates a simple token implemented in Solidity, and a React frontend to interact with the token using ethers.js and MetaMask.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Usage](#usage)
- [Project Structure](#project-structure)
- [Smart Contract](#smart-contract)
- [Frontend](#frontend)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## Introduction

MyToken is an Ethereum-based  token with basic functionalities like minting and burning tokens. This project includes:

- A smart contract written in Solidity.
- A React frontend to interact with the smart contract.
- Integration with MetaMask for managing accounts and signing transactions.

## Features

- Deploy and interact with  token on the Ethereum network.
- Mint new tokens.
- Burn existing tokens.
- Display token details such as name, abbreviation, total supply, and balance.

## Prerequisites

Ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or higher)
- [npm](https://www.npmjs.com/)
- [MetaMask](https://metamask.io/) browser extension

## Installation


## Usage

### Running the Local Blockchain

1. Start the local blockchain using Hardhat:

    ```bash
    npx hardhat node
    ```

2. Deploy the smart contract to the local network:

    ```bash
    npx hardhat run scripts/deploy.js --network localhost
    ```

### Running the Frontend

1. Navigate back to the root directory:

    ```bash
    cd mydapp
    ```

2. Start the React development server:

    ```bash
    npm start
    ```

3. Open your browser and navigate to `http://localhost:3000`.

## Project Structure

```plaintext
mytoken-dapp/
├── contracts/
│   └── MyToken.sol
├── scripts/
│   └── deploy.js
├── src/
│   ├── App.js
│   ├── MetaMask.js
│   ├── index.js
│   └── ...
├── artifacts/
│   └── contracts/
│       └── MyToken.json
├── test/
│   └── test.js
├── package.json
└── README.md

### Code Snippet

```solidity
// SPDX-License-Identifier: MIT
pragma solidity >=0.6.12 <0.9.0;

contract MyToken {
    string public TokenName;
    string public TokenAbbrv;
    uint public TotalSupply;
    
    mapping(address => uint) public balances;

    constructor(string memory _tokenName, string memory _tokenAbbrv, uint _totalSupply) {
        TokenName = _tokenName;
        TokenAbbrv = _tokenAbbrv;
        TotalSupply = _totalSupply;
        balances[msg.sender] = _totalSupply;
    }

    function Mint(address to, uint value) external {
        require(to != address(0), "You are minting to the zero address");
        balances[to] += value; 
        TotalSupply += value;
    }

    function burn(address from, uint value) external {
        require(from != address(0), "You are burning from the zero address");
        require(balances[from] >= value, "Insufficient balance to burn");
        balances[from] -= value;
        TotalSupply -= value;
    }
}

```Frontend
import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import './App.css';
import MyTokenAbi from './artifacts/contracts/MyToken.sol/MyToken.json';
const contractABI = MyTokenAbi.abi;
const contractAddress = 'YOUR_CONTRACT_ADDRESS';

const MetaMask = () => {
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [contract, setContract] = useState(null);
  const [tokenName, setTokenName] = useState('');
  const [tokenAbbrv, setTokenAbbrv] = useState('');
  const [totalSupply, setTotalSupply] = useState(0);
  const [balance, setBalance] = useState(0);
  const [mintAmount, setMintAmount] = useState(0);
  const [burnAmount, setBurnAmount] = useState(0);

  useEffect(() => {
    const connectWallet = async () => {
      if (typeof window.ethereum !== 'undefined') {
        try {
          const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
          const account = accounts[0];
          setAccount(account);

          const provider = new ethers.providers.Web3Provider(window.ethereum);
          setProvider(provider);

          const signer = provider.getSigner();
          const contract = new ethers.Contract(contractAddress, contractABI, signer);
          setContract(contract);

          const name = await contract.TokenName();
          const abbrv = await contract.TokenAbbrv();
          const supply = await contract.TotalSupply();
          const balance = await contract.balances(account);

          setTokenName(name);
          setTokenAbbrv(abbrv);
          setTotalSupply(supply.toNumber());
          setBalance(balance.toNumber());
        } catch (error) {
          console.error('Error connecting to MetaMask:', error);
        }
      } else {
        console.log('MetaMask is not installed.');
      }
    };

    connectWallet();
  }, []);

  const handleMint = async () => {
    if (contract) {
      try {
        const tx = await contract.Mint(account, mintAmount);
        await tx.wait();
        const newSupply = await contract.TotalSupply();
        const newBalance = await contract.balances(account);
        setTotalSupply(newSupply.toNumber());
        setBalance(newBalance.toNumber());
      } catch (error) {
        console.error('Error minting tokens:', error);
      }
    }
  };

  const handleBurn = async () => {
    if (contract) {
      try {
        const tx = await contract.burn(account, burnAmount);
        await tx.wait();
        const newSupply = await contract.TotalSupply();
        const newBalance = await contract.balances(account);
        setTotalSupply(newSupply.toNumber());
        setBalance(newBalance.toNumber());
      } catch (error) {
        console.error('Error burning tokens:', error);
      }
    }
  };

  return (
    <div className="app">
      <h1>MetaMask Token Interaction</h1>
      {account ? (
        <div>
          <p>Connected account: {account}</p>
          <p>Token Name: {tokenName}</p>
          <p>Token Abbreviation: {tokenAbbrv}</p>
          <p>Total Supply: {totalSupply}</p>
          <p>Your Balance: {balance}</p>
          <div className="actions">
            <div>
              <input
                type="number"
                value={mintAmount}
                onChange={(e) => setMintAmount(e.target.value)}
                placeholder="Mint Amount"
              />
              <button onClick={handleMint}>Mint Tokens</button>
            </div>
            <div>
              <input
                type="number"
                value={burnAmount}
                onChange={(e) => setBurnAmount(e.target.value)}
                placeholder="Burn Amount"
              />
              <button onClick={handleBurn}>Burn Tokens</button>
            </div>
          </div>
        </div>
      ) : (
        <p>Please connect your MetaMask wallet.</p>
      )}
    </div>
  );
};

export default MetaMask;




