import React, { useState } from "react";
import { Wallet, Check, AlertCircle } from "lucide-react";
import { useWallet } from "./WalletContext";

export default function BlockchainConnect({ onConnected }) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const {connect, disconnect, walletAddress}=useWallet();

  return (
    <div className="flex items-center gap-4">
      {!walletAddress ? (
        <button
          onClick={connect}
          disabled={isLoading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg transition"
        >
          <Wallet size={18} />
          {isLoading ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="flex items-center gap-3">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 text-green-600">
              <Check size={18} />
              <span className="text-sm font-medium">Wallet Connected</span>
            </div>
            <span className="text-xs text-gray-600">
              {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
            </span>
          </div>
          <button
            onClick={disconnect}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Disconnect
          </button>
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 text-red-600 text-sm">
          <AlertCircle size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
