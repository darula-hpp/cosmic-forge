'use client'

// src/components/SendASA.js
import React, { useEffect, useState } from "react";
import algosdk, {makeAssetTransferTxnWithSuggestedParamsFromObject} from "algosdk";
import { PeraWalletConnect } from "@perawallet/connect";

// MainNet Algod client
const algodClient = new algosdk.Algodv2('', 'https://mainnet-api.algonode.cloud', '');
const peraWallet = new PeraWalletConnect();

const SendASA = () => {
  const [account, setAccount] = useState(null);

  useEffect(() => {
    peraWallet.reconnectSession().then((accounts) => {
      if (accounts.length) {
        setAccount(accounts[0]);
        console.log("Reconnected Account:", accounts[0]); // Added console log
      }
    });
  }, []);

  const connectWallet = async () => {
    try {
      const newAccounts = await peraWallet.connect();
      setAccount(newAccounts[0]);

      peraWallet.connector?.on("disconnect", () => {
        setAccount(null);
      });
    } catch (error) {
      console.error("Wallet connection failed", error);
    }
  };

  const sendASA = async () => {
    if (!account) 
    {
        console.log("Connect your wallet first");
        return;
    }

    try {
      const receiver = "7J3MOH3GGDVFXZUCU7ITAUPCQGIY5JLSP2M4VYYUNW7S72ATQ46XC3T2KY"; // Replace with a real MainNet address
      const assetId = 989457887; // USDC ASA ID on MainNet
      const amountToSend = 1 * 100; // 1 BWC (since BWC has 2 decimals)

      const params = await algodClient.getTransactionParams().do();
      console.log('1#', params)

      const txn = makeAssetTransferTxnWithSuggestedParamsFromObject({
        sender: account,
        receiver,
        assetIndex: assetId,
        amount: amountToSend,
        suggestedParams: params,
      });
      console.log('2#')

      const txnGroup = [{ txn }];
      const signedTxns = await peraWallet.signTransaction([txnGroup]);
      console.log('3#')

      const { txid } = await algodClient.sendRawTransaction(signedTxns).do();
      console.log('4#')
      await algosdk.waitForConfirmation(algodClient, txid, 10);
      console.log('5#')

      alert(`ASA sent! TX ID: ${txid}`);
    } catch (error) {
      console.error("ASA transaction failed", error);
    }
  };

  return (
    <div>
      <h2>Send BWC with Pera Wallet</h2>
      {!account ? (
        <button onClick={connectWallet}>Connect Pera Wallet</button>
      ) : (
        <>
          <p>Connected: {account}</p>
          <button onClick={sendASA}>Send ASA</button>
        </>
      )}
    </div>
  );
};

export default SendASA;
