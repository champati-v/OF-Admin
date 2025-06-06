'use client'

import React, { useEffect, useState } from 'react';
// import { getCompanies, approveRelease } from '../services/api';
import { ethers } from 'ethers';
import Safe from '@safe-global/protocol-kit';
import SafeTransactionDataPartial from '@safe-global/protocol-kit';
import SafeApiKit from '@safe-global/api-kit';

const multisigWallet = '0xCdDf83CA56aACc12b40A535002c9B189963a0CED';

const ESCROW_CONTRACT_ADDRESS = '0x9c6622fAf62279cC9BD1962f332BC99BE203F83c';//mainnet address
const USDC_ADDRESS = '0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48';

const USDC_ABI = [
  'function approve(address spender, uint256 amount) public returns (bool)'
];

interface Company {
  _id: string;
  name: string;
  founderWallet: string;
  multisigWallet: string;
  approved: boolean;
}

const AdminDashboard: React.FC = () => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [amounts, setAmounts] = useState<Record<string, string>>({});

  useEffect(() => {
    // getCompanies().then((res: any) => setCompanies(res.data));
  }, []);

  const handleApproveUSDC = async (multisigWallet: string, amount: string) => {
    try {
      if (!window.ethereum) {
        throw new Error("MetaMask not found");
      }

      const provider = new ethers.BrowserProvider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = await provider.getSigner();
      const signerAddress = await signer.getAddress();

      const safeSdk = await Safe.init({
        provider: window.ethereum,
        signer: signerAddress,
        safeAddress: multisigWallet,
      });

      const usdcAmount = ethers.parseUnits(amount.toString(), 6);
      const usdcInterface = new ethers.Interface(USDC_ABI);
      const data = usdcInterface.encodeFunctionData('approve', [ESCROW_CONTRACT_ADDRESS, usdcAmount]);

      const safeTransactionData: SafeTransactionDataPartial[] = [{
        to: USDC_ADDRESS,
        data,
        value: '0',
        operation: 0
      }];

      const safeTransaction = await safeSdk.createTransaction({ transactions: safeTransactionData });
      const txHash = await safeSdk.getTransactionHash(safeTransaction);
      const signedSafeTransaction = await safeSdk.signTransaction(safeTransaction);

      function encodeSignatures(signatures: Map<string, { data: string }>) {
        let encoded = '0x';
        for (const [, sig] of signatures) {
          encoded += sig.data.slice(2);
        }
        return encoded;
      }

      const senderSignature = encodeSignatures(signedSafeTransaction.signatures);

      await fetch("https://ofStaging.azurewebsites.net/api/admin/company/propose-transaction", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          safeAddress: multisigWallet,
          safeTransactionData: safeTransaction.data,
          safeTxHash: txHash,
          senderAddress: signerAddress,
          senderSignature
        })
      });

      alert("USDC approval transaction proposed successfully ✅");

    } catch (error: any) {
      console.error("Detailed error:", error);

      if (error.message.includes('Safe not found')) {
        alert("Safe wallet not found. Please check the address.");
      } else if (error.message.includes('insufficient funds')) {
        alert("Insufficient funds for transaction.");
      } else if (error.message.includes('user rejected')) {
        alert("Transaction was rejected by user.");
      } else {
        alert("Approve failed: " + error.message);
      }
    }
  };

  const handleApprove = async (id: string) => {
    const amount = amounts[id];
    if (!amount) return alert("Enter an amount");
    try {
      // const res = await approveRelease(id, amount);
      // alert("Funds released: " + res.data.txHash);
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Companies</h1>
      {companies.map(company => (
        <div key={company._id} className="border p-4 rounded mb-2">
          <p><strong>Name:</strong> {company.name}</p>
          <p><strong>Founder:</strong> {company.founderWallet}</p>
          <p><strong>Multisig:</strong> {company.multisigWallet}</p>
          <p><strong>Approved:</strong> {company.approved ? '✅' : '❌'}</p>

          <input
            type="number"
            placeholder="USDC amount"
            className="border p-1 mr-2"
            value={amounts[company._id] || ''}
            onChange={(e) => setAmounts({ ...amounts, [company._id]: e.target.value })}
          />

          <button
            onClick={() => handleApproveUSDC(multisigWallet, amounts[company._id])}
            className="bg-blue-500 text-white px-3 py-1 rounded"
          >
            Approve USDC
          </button>

          <button
            onClick={() => handleApprove(company._id)}
            className="bg-green-500 text-white px-3 py-1 rounded"
          >
            Approve & Release
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
