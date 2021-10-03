// import React from 'react';
// import { Web3ReactProvider } from '@web3-react/core';
// import { Web3Provider } from '@ethersproject/providers';
// import { Wallet } from './Wallet';
// import { Staking } from './Staking';

// function getLibrary(provider: any): Web3Provider {
//   const library = new Web3Provider(provider);
//   library.pollingInterval = 12000;
//   return library;
// }

// export const App = () => {
//   return (
//     <Web3ReactProvider getLibrary={getLibrary}>
//       {/* <Wallet /> */}
//       {/* <Staking /> */}
//     </Web3ReactProvider>
//   );
// };

import React, { Component } from 'react';
import {
  Container,
  Row,
  Col,
  FormControl,
  InputGroup,
  Button,
} from 'react-bootstrap';

import Web3 from 'web3';

import StakingToken from '../abi/StakingToken';
const web3 = new Web3(Web3.givenProvider);

const contractAddress = '0xcAD41F63eA31F4b89f1cAA134f5fEB172dFe85D7';

const stakingContract = new web3.eth.Contract(StakingToken, contractAddress);
class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      storedValue: 0,

      account: null,
    };

    this.value = React.createRef();
  }

  componentDidMount = async (t) => {
    const accounts = await window.ethereum.enable();
    console.log(accounts);
    const account_ = accounts[0];

    this.setState((prevState) => {
      return {
        account: account_,
      };
    });
  };

  setValue = async (t) => {
    const val = this.value.current.value;

    const gas = await stakingContract.methods.set(val).estimateGas();

    const result = await stakingContract.methods.set(val).send({
      from: this.state.account,

      gas,
    });
  };

  getValue = async (t) => {
    const result = await stakingContract.methods.get().call({
      from: this.state.account,
    });

    this.setState((prevState) => {
      return {
        storedValue: result,
      };
    });
  };

  stakeToken = async (t) => {
    const val = this.value.current.value;
    console.log('this.value', val);
    const gas = await stakingContract.methods.stakeTokens(val).estimateGas();
    const result = await stakingContract.methods.stakeTokens(val).send({
      from: this.state.account,
      gas,
    });
  };
  render() {
    return (
      <div>
        <h2> Simple Storage </h2>

        <div className="form-row">
          <div className="col xs = {12}">
            <h4> MM Account: {this.state.account} </h4>
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
                <Button variant="success" onClick={this.getValue}>
                  Retrieve
                </Button>{' '}
              </Col>

              <Col>The Stored Value is: {this.state.storedValue}</Col>
            </Row>
          </Container>
        </>
      </div>
    );
  }
}

export default App;
