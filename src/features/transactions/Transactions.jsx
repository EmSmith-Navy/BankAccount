import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { transfer, deposit, withdrawal, setBalance } from "./transactionsSlice";
import "./transactions.scss";

/**
 * Allows users to deposit to, withdraw from, and transfer money from their account.
 */
export default function Transactions() {
  const balance = useSelector((state) => state.transactions.balance);
  const dispatch = useDispatch();

  const [amountStr, setAmountStr] = useState("0.00");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [lastTransaction, setLastTransaction] = useState(null);

  useEffect(() => {
    const storedBalance = sessionStorage.getItem("balance");
    if (storedBalance) {
      dispatch(setBalance(Number(storedBalance)));
    }
  }, [dispatch]);

  useEffect(() => {
    sessionStorage.setItem("balance", balance);
  }, [balance]);

  /** Dispatches a transaction action based on the form submission. */
  const onTransaction = (e) => {
    e.preventDefault();

    const action = e.nativeEvent.submitter.name;
    const amount = +amountStr;

    // Reset error message
    setError("");

    if (amount <= 0) {
      setError("Amount must be greater than zero.");
      return;
    }

    if ((action === "withdraw" || action === "transfer") && amount > balance) {
      setError("Insufficient funds for this transaction.");
      return;
    }

    if (action === "transfer") {
      dispatch(transfer({ amount, recipient }));
    } else if (action === "deposit") {
      dispatch(deposit(amount));
    } else if (action === "withdraw") {
      dispatch(withdrawal({ amount }));
    }

    setLastTransaction({ type: action, amount, recipient });
  };

  const undoLastTransaction = () => {
    if (lastTransaction) {
      if (lastTransaction.type === "deposit") {
        dispatch(withdrawal({ amount: lastTransaction.amount }));
      } else if (lastTransaction.type === "withdraw") {
        dispatch(deposit(lastTransaction.amount));
      } else if (lastTransaction.type === "transfer") {
        dispatch(deposit(lastTransaction.amount));
      }
      setLastTransaction(null);
    }
  };

  return (
    <section className="transactions container">
      <h2>Transactions</h2>
      <figure>
        <figcaption>Current Balance &nbsp;</figcaption>
        <strong>${balance.toFixed(2)}</strong>
      </figure>
      {error && <p className="error-message">{error}</p>}
      <form onSubmit={onTransaction}>
        <div className="form-row">
          <label>
            Amount
            <input
              type="number"
              inputMode="decimal"
              min={0}
              step="0.01"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
            />
          </label>
          <div>
            <button default name="deposit">
              Deposit
            </button>
            <button name="withdraw">Withdraw</button>
          </div>
        </div>
        <div className="form-row">
          <label>
            Transfer to
            <input
              placeholder="Recipient Name"
              name="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
            />
          </label>
          <button name="transfer">Transfer</button>
        </div>
      </form>
      <button onClick={undoLastTransaction} disabled={!lastTransaction}>
        Undo Last Transaction
      </button>
    </section>
  );
}
