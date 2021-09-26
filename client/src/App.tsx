import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from "redux";
import { actionCreators } from "./state";
import { RootState } from "./state/reducers";
import Web3 from "web3";
import { StakingToken } from "./abi/StakingToken";
const web3 = new Web3(Web3.givenProvider);
const contractAddress = "0x7A8Ab7f867561F3d2ae8F1E4e383E56eCE8D4CB8";
const stakingContract = new web3.eth.Contract(StakingToken, contractAddress);

function App() {
  const dispatch = useDispatch();
  const { depositMoney, withdrawMoney, bankrupt } = bindActionCreators(actionCreators, dispatch);
  const amount = useSelector((state: RootState) => state.bank);

  const componentDidMount = async (t) => {

    const accounts = await window.ethereum.enable();
    const account = accounts[0];
    this.setState({ account: account });
    console.log(accounts[0]);

  }

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
    this.setState({ storedValue: result });
  }

  return (
    <div className="App">
      <h1>{amount}</h1>
      <button onClick={() => depositMoney(5)}>Deposit</button>
      <button onClick={() => withdrawMoney(5)}>Withdraw</button>
      <button onClick={() => bankrupt(5)}>Bankrupt</button>
    </div>
  );
}

export default App;
