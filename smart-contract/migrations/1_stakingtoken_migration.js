const TestToken = artifacts.require('TestToken');
const StakingToken = artifacts.require('StakingToken');

module.exports = async function(deployer, network, accounts) {
  //deploying TesToken
  await deployer.deploy(TestToken);
  //fetching back TestToken address
  const testToken = await TestToken.deployed();

  //deploying staking contract, passing token address
  await deployer.deploy(StakingToken, testToken.address);
  const stakingToken = await StakingToken.deployed();

  //transfer 500k TestToken to smart contract for rewards
  await testToken.transfer(stakingToken.address, '500000000000000000000000');

  //   sending 1000 TestTokens to User and Creator for test , investor is second address
  await testToken.transfer(accounts[1], '1000000000000000000000');
};