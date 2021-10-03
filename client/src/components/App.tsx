import 'bootstrap/dist/css/bootstrap.min.css';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
  Button,
} from 'react-bootstrap';

import Web3 from 'web3';

import StakingTokenAbi from '../abi/StakingToken';
import TestTokenAbi from '../abi/TestToken';

const App = () => {
  interface INetwork {
    id: number,
    name: string,
  }
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState<INetwork>({ id: 0, name: 'none' });
  const [userBalance, setUserBalance] = useState<unknown>();
  const [testTokenContract, setTestTokenContract] = useState<unknown>();
  const [tokenStakingContract, setTokenStakingContract] = useState<unknown>();
  const [inputValue, setInputValue] = useState<string>('');
  const [contractBalance, setContractBalance] = useState<number>('0');
  const [totalStaked, setTotalStaked] = useState<unknown[]>([0, 0]);
  const [myStake, setMyStake] = useState<unknown[]>([0, 0]);
  const [appStatus, setAppStatus] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [userBalance, setUserBalance] = useState<unknown>('0');
  const [apy, setApy] = useState<number[]>([0, 0]);
  const [page, setPage] = useState<number>(1);

  const fetchDataFromBlockchain = async () => {
    const web3 = new Web3(Web3.givenProvider);
    const stakingTokenContractAddress = '0x1223E0c74Ac0fC6f84811117cF39554c98cb8a8a';
    const testTokenContractAddress = '0xB01e4883Cba6722d6D6d1c43E6666186EF037836';
    const accounts = await window.ethereum.enable();
    setAccount(accounts[0]);
    const networkId: number = await web3.eth.net.getId();
    const networkType: string = await web3.eth.net.getNetworkType();
    setNetwork({ ...network, id: networkId, name: networkType });
    console.log('network', network);
    const testToken = new web3.eth.Contract(
      TestTokenAbi,
      testTokenContractAddress
    );
    setTestTokenContract(testToken);
    let testTokenBalance = await testToken.methods
    .balanceOf(accounts[0])
    .call();
  let convertedBalance = web3.utils.fromWei(
    testTokenBalance.toString(),
    'Ether'
  );
  console.log(convertedBalance)
  setUserBalance(convertedBalance);
  
  const tokenStaking = new web3.eth.Contract(
    StakingTokenAbi,
    stakingTokenContractAddress
  );
  setTokenStakingContract(tokenStaking);
  let myStake = await tokenStaking.methods
    .stakingBalance(accounts[0])
    .call();

  let convertedStakedBalance = web3.utils.fromWei(
    myStake.toString(),
    'Ether'
  );
    console.log(`convertedStakedBalance: ${convertedStakedBalance}`);
  let myCustomStake = await tokenStaking.methods
    .customStakingBalance(accounts[0])
    .call();

    console.log(`myCustomStake: ${myCustomStake}`);

  let tempCustomdBalance = web3.utils.fromWei(
    myCustomStake.toString(),
    'Ether'
  );

    console.log(`tempCustomdBalance: ${tempCustomdBalance}`);

  setMyStake([convertedBalance, tempCustomdBalance]);

  //checking totalStaked
  let tempTotalStaked = await tokenStaking.methods.totalStaked().call();
  convertedBalance = web3.utils.fromWei(
    tempTotalStaked.toString(),
    'Ether'
  );

  console.log(`tempTotalStaked: ${tempTotalStaked}`);

  let tempcustomTotalStaked = await tokenStaking.methods
    .customTotalStaked()
    .call();

  console.log(`tempcustomTotalStaked: ${tempcustomTotalStaked}`);

  let tempconvertedBalance = web3.utils.fromWei(
    tempcustomTotalStaked.toString(),
    'Ether'
  );
  setTotalStaked([convertedBalance, tempconvertedBalance]);
  console.log(`tempconvertedBalance: ${tempconvertedBalance}`);

  //fetching APY values from contract
  let tempApy =
    ((await tokenStaking.methods.defaultAPY().call()) / 1000) * 365;
  
    console.log(`tempApy: ${tempApy}`);
  
    let tempcustomApy =
    ((await tokenStaking.methods.customAPY().call()) / 1000) * 365;
  setApy([tempApy, tempcustomApy]);
  console.log(`tempcustomApy: ${tempcustomApy}`);


  };


  useEffect(() => {
    //connecting to ethereum blockchain
    const ethEnabled = async () => {
      fetchDataFromBlockchain();
    };

    ethEnabled();
  }, []);

  // componentDidMount = async (t) => {
  //   const accounts = await window.ethereum.enable();
  //   console.log(accounts);
  //   const account_ = accounts[0];

  //   this.setState((prevState) => {
  //     return {
  //       account: account_,
  //     };
  //   });
  // };

  const setValue = async (t) => {
    const val = this.value.current.value;

    const gas = await stakingContract.methods.set(val).estimateGas();

    const result = await stakingContract.methods.set(val).send({
      from: account,

      gas,
    });
  };

  const getValue = async (t) => {
    const result = await stakingContract.methods.get().call({
      from: account,
    });

    this.setState((prevState) => {
      return {
        storedValue: result,
      };
    });
  };
  //#############################
  const stakeToken = async (t) => {
    const val = this.value.current.value;
    console.log('this.value', val);
    const gas = await stakingContract.methods.stakeTokens(val).estimateGas();
    console.log('gas', gas);
    const result = await stakingContract.methods.stakeTokens(val).send({
      from: account,
      gas,
    });
  };

  const getTotalStake = async (t) => {
    const gas = await stakingContract.methods.getTotalStake().estimateGas();
    const result = await stakingContract.methods.getTotalStake().call({
      from: account,
      gas,
    });
    console.log(result);
    this.setState((prevState) => {
      return {
        storedValue: result,
      };
    });
  };

  return (
    <div>
      <h2> Simple Storage </h2>

      <div className="form-row">
        <div className="col xs = {12}">
          <h4> MM Account: {account} </h4>
        </div>
      </div>
      <>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <Container>
          <Row>
            <InputGroup className="mb-3">
              <FormControl
                ref={this.value}
                placeholder="Value to Store"
                aria-label="Value to Store"
                aria-describedby="basic-addon2"
              />

              <Button
                variant="secondary"
                id="button-addon2"
                onClick={this.stakeToken}
              >
                Store
              </Button>
            </InputGroup>
          </Row>

          <Row>
            <Col>
              <Button variant="success" onClick={this.getTotalStake}>
                Retrieve
              </Button>{' '}
            </Col>

            {/* <Col>The Stored Value is: {this.state.storedValue}</Col> */}
          </Row>
          <Row>
            <Button onClick={() => console.log(!!window.ethereum)}>
              Connectivity Test
            </Button>
          </Row>
        </Container>
      </>
    </div>
  );
};

export default App;
