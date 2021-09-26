import React from 'react';
import { Web3ReactProvider } from '@web3-react/core';
import useSWR from 'swr';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { InjectedConnector } from '@web3-react/injected-connector';

// export const Balance = () => {
//     const { account, library } = useWeb3React<Web3Provider>()
//     const { data, error } = useSWR('/api/user', fetcher);
//     const { data: balance } = useSWR(['getBalance', account, 'latest'], {
//       fetcher: fetcher(library),
//     })
//     if(!balance) {
//       return <div>...</div>
//     }
//     return <div>Balance: {balance.toString()}</div>
//   }