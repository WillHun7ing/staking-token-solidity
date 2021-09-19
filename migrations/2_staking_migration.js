const StakingToken = artifacts.require("StakingToken");

module.exports = function (deployer) {
  const initialSupply = 10000
  const address = "0xb666Fa3Df3A482563786fc2EDF8df42Ed34C9701"
  deployer.deploy(StakingToken, address, initialSupply);
};
