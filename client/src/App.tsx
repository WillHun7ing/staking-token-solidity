import './App.css';
import { useDispatch, useSelector } from "react-redux";
import { bindActionCreators } from 'redux';
import { actionCreators } from './state';
import { RootState } from "./state/reducers";
import Web3 from "web3";

function App() {
  const dispatch = useDispatch();
  const { depositMoney, withdrawMoney, bankrupt } = bindActionCreators(actionCreators, dispatch);
  const amount = useSelector((state: RootState) => state.bank);

  const web3 = new Web3(Web3.givenProvider);
  import { StakingToken } from "./ABI/SimpleStorage";
  const contractAddress = "0x816da4d3Fd13aB025504e5AbaD48Ad999b3A3275";
  const storageContract = new web3.eth.Contract(SimpleStorage, contractAddress);

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
