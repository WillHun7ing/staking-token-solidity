import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { Web3ReactProvider } from '@web3-react/core';
import useSWR from 'swr';
import React, { useEffect } from 'react';
import { formatEther } from '@ethersproject/units';
// const web3 = new Web3ReactProvider(window.ethereum);
// await window.ethereum.enable();
import { network, injected } from '../connectors/index';
// const StakingContract = web3.eth.Contract(contract_abi, contract_address);
// console.log(StakingContract);
export const Staking = () => {
  const { account, library } = useWeb3React<Web3Provider>();
  const { data: balance, mutate } = useSWR(['getBalance', account, 'latest']);

  useEffect(() => {
    // listen for changes on an Ethereum address
    console.log(`listening for blocks...`);
    library.on('block', () => {
      console.log('update balance...');
      mutate(undefined, true);
    });
    // remove listener when the component is unmounted
    return () => {
      library.removeAllListeners('block');
    };
    // trigger the effect only on component mount
  }, []);

  return <div>The account: {account}</div>;
};
