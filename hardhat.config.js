/** @type import('hardhat/config').HardhatUserConfig */

require('@nomicfoundation/hardhat-toolbox');
require('dotenv').config();

const { ALCHEMY_API_KEY, PRIVATE_KEY } = process.env;


module.exports = {
  solidity: "0.8.24",
 /* networks: {
    sepolia: {
      url: `https://eth-sepolia.g.alchemy.com/v2/${ALCHEMY_API_KEY}`,
      accounts: [PRIVATE_KEY]
    }
  }*/
    paths: {
      artifacts: './mydapp/src/artifacts',
    },
    
};
