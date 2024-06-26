// src/MetaMask.js
import { useState, useEffect } from 'react';
//import { ethers } from 'ethers';
import { ethers } from 'ethers';

import './App.css';
import MyTokenAbi from './artifacts/contracts/Token.sol/MyToken.json';
const contractABI = MyTokenAbi.abi;
const contractAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3';



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

          console.log('Token Name:', name);
          console.log('Token Abbrv:', abbrv);
          console.log('Total Supply:', supply.toString());
          console.log('User Balance:', balance.toString());
  


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