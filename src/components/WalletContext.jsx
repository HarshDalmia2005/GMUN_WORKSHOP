import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import blockchainService from '../services/blockchainService';
import { BLOCKCHAIN_CONFIG } from '../config/blockchain';
import { useToast } from './ToastContext';

const WalletContext = createContext(null);

export function WalletProvider({ children }) {
  const [walletAddress, setWalletAddress] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const { showToast, removeAll } = useToast();
  const [blockchainEnabled, setBlockchainEnabled] = useState(false);

  const handleAccountsChanged = (accounts) => {
    if (accounts && accounts.length) {
      setWalletAddress(accounts[0]);
      setIsConnected(true);
    } else {
      setWalletAddress(null);
      setIsConnected(false);
    }
  };

  const handleChainChanged = () => {
    // Reset provider/contract so app re-initializes if needed
    blockchainService.disconnect();
    setIsConnected(false);
    setWalletAddress(null);
    showToast({ type: 'info', message: 'Network changed - please reconnect' });
  };

  useEffect(() => {
    if (window.ethereum && window.ethereum.on) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', handleChainChanged);
    }

    return () => {
      if (window.ethereum && window.ethereum.removeListener) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      }
    };
  }, []);



  const connect = useCallback(async () => {
    setIsConnecting(true);
    try {
      if (!window.ethereum) throw new Error('MetaMask not installed');

      const accounts = await blockchainService.connectWallet();

      // try switch to configured network (Polygon Amoy)
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x13882' }],
        });
      } catch (switchErr) {
        if (switchErr.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: '0x13882',
                  chainName: 'Polygon Amoy',
                  rpcUrls: [BLOCKCHAIN_CONFIG.NETWORK.rpcUrl],
                  blockExplorerUrls: [BLOCKCHAIN_CONFIG.NETWORK.explorer],
                  nativeCurrency: { name: 'POL', symbol: 'POL', decimals: 18 },
                },
              ],
            });
          } catch (addErr) {
            console.warn('Failed to add chain', addErr);
          }
        }
      }

      // initialize contract if address provided
      if (BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS) {
        try {
          await blockchainService.initContract(BLOCKCHAIN_CONFIG.CONTRACT_ADDRESS);
          setBlockchainEnabled(true);
        } catch (err) {
          console.warn('Failed to init contract', err);
          setBlockchainEnabled(false);
        }
      }

      // remove any existing warnings/toasts now that wallet is connected
      try {
        removeAll();
      } catch (e) {
        // ignore if removeAll isn't available for some reason
      }

      setWalletAddress(accounts);
      setIsConnected(true);
      showToast({ type: 'success', message: 'Wallet connected' });
      return accounts;
    } catch (err) {
      showToast({ type: 'error', message: err.message || 'Failed to connect' });
      throw err;
    } finally {
      setIsConnecting(false);
    }
  }, [showToast]);

  const disconnect = useCallback(() => {
    blockchainService.disconnect();
    setWalletAddress(null);
    setIsConnected(false);
    showToast({ type: 'info', message: 'Wallet disconnected' });
  }, [showToast]);

  return (
    <WalletContext.Provider value={{ walletAddress, isConnected, isConnecting, connect, disconnect, blockchainEnabled, setBlockchainEnabled }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) throw new Error('useWallet must be used within WalletProvider');
  return ctx;
}

export default WalletContext;
