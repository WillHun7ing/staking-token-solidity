import 'bootstrap/dist/css/bootstrap.min.css';
import './Styles.css';
import React, { useState, useEffect } from 'react';
import {
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
  Button,
  Form,
  Badge,
} from 'react-bootstrap';

import Web3 from 'web3';

import StakingTokenAbi from '../abi/StakingToken';
import TestTokenAbi from '../abi/TestToken';

const App = () => {
  interface INetwork {
    id: number;
    name: string;
  }
  interface IInformation {
    networkType: string;
    balance: number;
    stakeBalance: number;
  }
  const [account, setAccount] = useState<string>('');
  const [network, setNetwork] = useState<INetwork>({ id: 0, name: 'none' });
  const [information, setInformation] = useState<IInformation>({
    networkType: '',
    balance: 0,
    stakeBalance: 0,
  });
  const [web3Instance, setWeb3Instance] = useState<unknown>();
  const [userBalance, setUserBalance] = useState<unknown>();
  const [testTokenContract, setTestTokenContract] = useState<unknown>();
  const [tokenStakingContract, setTokenStakingContract] = useState<unknown>();
  const [inputValue, setInputValue] = useState<string>('');
  const [contractBalance, setContractBalance] = useState<number>('0');
  const [totalStaked, setTotalStaked] = useState<unknown[]>([0, 0]);
  const [myStake, setMyStake] = useState<unknown[]>([0, 0]);
  const [appStatus, setAppStatus] = useState<boolean>(true);
  const [loader, setLoader] = useState<boolean>(false);
  const [apy, setApy] = useState<number[]>([0, 0]);
  const [page, setPage] = useState<number>(1);

  const fetchDataFromBlockchain = async () => {
    const web3 = new Web3(Web3.givenProvider);
    setWeb3Instance(web3);
    const stakingTokenContractAddress =
      '0x1223E0c74Ac0fC6f84811117cF39554c98cb8a8a';
    const testTokenContractAddress =
      '0xB01e4883Cba6722d6D6d1c43E6666186EF037836';
    const accounts = await window.ethereum.enable();
    setAccount(accounts[0]);
    const networkId: number = await web3.eth.net.getId();
    const networkType: string = await web3.eth.net.getNetworkType();
    setNetwork({ ...network, id: networkId, name: networkType });
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
    setUserBalance(convertedBalance);

    const tokenStaking = new web3.eth.Contract(
      StakingTokenAbi,
      stakingTokenContractAddress
    );
    setTokenStakingContract(tokenStaking);
    let myStake = await tokenStaking.methods.stakingBalance(accounts[0]).call();

    let convertedStakedBalance = web3.utils.fromWei(
      myStake.toString(),
      'Ether'
    );
    let myCustomStake = await tokenStaking.methods
      .customStakingBalance(accounts[0])
      .call();

    setInformation({
      ...information,
      network: networkType,
      balance: convertedBalance,
      stakeBalance: convertedStakedBalance,
    });

    let tempCustomdBalance = web3.utils.fromWei(
      myCustomStake.toString(),
      'Ether'
    );

    setMyStake([convertedBalance, tempCustomdBalance]);

    //checking totalStaked
    let tempTotalStaked = await tokenStaking.methods.totalStaked().call();
    convertedBalance = web3.utils.fromWei(tempTotalStaked.toString(), 'Ether');

    let tempcustomTotalStaked = await tokenStaking.methods
      .customTotalStaked()
      .call();

    let tempconvertedBalance = web3.utils.fromWei(
      tempcustomTotalStaked.toString(),
      'Ether'
    );
    setTotalStaked([convertedBalance, tempconvertedBalance]);

    //fetching APY values from contract
    let tempApy =
      ((await tokenStaking.methods.defaultAPY().call()) / 1000) * 365;

    let tempcustomApy =
      ((await tokenStaking.methods.customAPY().call()) / 1000) * 365;
    setApy([tempApy, tempcustomApy]);
    setAppStatus(true);
  };

  useEffect(() => {
    //connecting to ethereum blockchain
    const ethEnabled = async () => {
      fetchDataFromBlockchain();
    };

    ethEnabled();
  }, []);

  /////////////////////////////////////

  const stakeHandler = () => {
    if (!appStatus) {
    } else {
      if (!inputValue || inputValue === '0' || inputValue < 0) {
        setInputValue('');
      } else {
        setLoader(true);
        let convertToWei = web3Instance.utils.toWei(inputValue, 'Ether');
        //aproving tokens for spending
        testTokenContract.methods
          .approve(tokenStakingContract._address, convertToWei)
          .send({ from: account })
          .on('transactionHash', (hash) => {
            tokenStakingContract.methods
              .stakeTokens(convertToWei)
              .send({ from: account })
              .on('transactionHash', (hash) => {
                setLoader(false);
                fetchDataFromBlockchain();
              })
              .on('receipt', (receipt) => {
                setLoader(false);
                fetchDataFromBlockchain();
              })
              .on('confirmation', (confirmationNumber, receipt) => {
                setLoader(false);
                fetchDataFromBlockchain();
              });
          })
          .on('error', function (error) {
            setLoader(false);
            console.log('Error Code:', error.code, error.message);
          });
        setInputValue('');
      }
    }
  };

  const unStakeHandler = () => {
    if (!appStatus) {
    } else {
      setLoader(true);

      // let convertToWei = window.web3.utils.toWei(inputValue, 'Ether')
      tokenStakingContract.methods
        .unstakeTokens()
        .send({ from: account })
        .on('transactionHash', (hash) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('receipt', (receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('error', function (error) {
          console.log('Error Code:', error.code, error.message);
          setLoader(false);
        });
      setInputValue('');
    }
  };

  const getRewardHandler = async () => {
    if (!appStatus) {
    } else {
      setLoader(true);
      tokenStakingContract.methods
        .redistributeRewards()
        .send({ from: account })
        .on('transactionHash', (hash) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('receipt', (receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('confirmation', (confirmationNumber, receipt) => {
          setLoader(false);
          fetchDataFromBlockchain();
        })
        .on('error', function (error) {
          console.log('Error Code:', error.code, error.message);
          setLoader(false);
        });
    }
  };
  /////////////////////////////////////////////////
  /////////////////////////////////////////////////

  // const setValue = async (t) => {
  //   const val = this.value.current.value;

  //   const gas = await stakingContract.methods.set(val).estimateGas();

  //   const result = await stakingContract.methods.set(val).send({
  //     from: account,

  //     gas,
  //   });
  // };

  // const getValue = async (t) => {
  //   const result = await stakingContract.methods.get().call({
  //     from: account,
  //   });

  //   this.setState((prevState) => {
  //     return {
  //       storedValue: result,
  //     };
  //   });
  // };
  // //#############################
  // const stakeToken = async (t) => {
  //   const val = this.value.current.value;
  //   console.log('this.value', val);
  //   const gas = await stakingContract.methods.stakeTokens(val).estimateGas();
  //   console.log('gas', gas);
  //   const result = await stakingContract.methods.stakeTokens(val).send({
  //     from: account,
  //     gas,
  //   });
  // };

  // const getTotalStake = async (t) => {
  //   const gas = await stakingContract.methods.getTotalStake().estimateGas();
  //   const result = await stakingContract.methods.getTotalStake().call({
  //     from: account,
  //     gas,
  //   });
  //   console.log(result);
  //   this.setState((prevState) => {
  //     return {
  //       storedValue: result,
  //     };
  //   });
  // };

  return (
    <Container>
      <h2>
        Staking Token Dapp{' '}
        <Badge bg="warning">CoinIran Academy final project</Badge>
        <Badge bg="success">Mohammadreza Hajbabaei</Badge>
      </h2>
      <div>
        <Badge bg="primary">Solidity</Badge>{' '}
        <Badge bg="secondary">Truffle Suite</Badge>{' '}
        <Badge bg="success">React</Badge>
        {/* <Badge bg="danger">Danger</Badge> */}
        <Badge bg="info" text="dark">
          TypeScript
        </Badge>{' '}
        {/* <Badge bg="info">Info</Badge>{' '}
        <Badge bg="light" text="dark">
          Light
        </Badge>{' '}
        <Badge bg="dark">Dark</Badge> */}
      </div>
      <Row>
        <InputGroup className="mb-3">
          <FormControl
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Value to Store"
            aria-label="Value to Store"
            aria-describedby="basic-addon2"
          />
          <Button variant="secondary" id="button-stake" onClick={stakeHandler}>
            Stake Token
          </Button>
          <Button
            variant="secondary"
            id="button-stake"
            onClick={unStakeHandler}
          >
            Unstake Token
          </Button>
          <Button
            variant="secondary"
            id="button-stake"
            onClick={getRewardHandler}
          >
            Get Reward
          </Button>
          {/* <button
                className="btn"
                // style={{ background: 'yellow' }}
                onClick={() => {
                  console.log('clicked!');
                }}
              >
                <p>Stake</p>
              </button> */}
        </InputGroup>
      </Row>
      {/* <Row>
        <Col>
          <Button variant="success" onClick={this.getTotalStake}>
            Retrieve
          </Button>
        </Col>
      </Row> */}
      <Form>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Connectivity Check:
          </Form.Label>
          <Col sm="10">{!!window.ethereum ? 'Connected' : 'Disconnected'}</Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Netwok Type:
          </Form.Label>
          <Col sm="10">{information.network}</Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Balance:
          </Form.Label>
          <Col sm="10">{information.balance} STT</Col>
        </Form.Group>
        <Form.Group as={Row} className="mb-3" controlId="formPlaintextEmail">
          <Form.Label column sm="2">
            Staked Balance:
          </Form.Label>
          <Col sm="10">{information.stakeBalance} STT</Col>
        </Form.Group>
      </Form>
    </Container>
  );
};

export default App;
