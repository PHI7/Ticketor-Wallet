import { useState, useCallback, useMemo, useEffect } from 'react';
import { useAccount, useConnect, useSwitchChain } from 'wagmi';
import type { NFTTicket } from '../types';
import { useFetchTickets } from './useFetchTickets';
import { TICKET_CONTRACT_ADDRESS } from '../src/abi/TicketNFT';

export const useWallet = () => {
  const { address, isConnected, chainId, status } = useAccount();
  const { connectors, connect } = useConnect();
  const { switchChain } = useSwitchChain();
  const [error, setError] = useState<string | null>(null);
  const [networkName, setNetworkName] = useState<string>('Not Connected');

  // Fetch tickets from blockchain
  const { tickets, isLoading: isLoadingTickets } = useFetchTickets();

  // Expected chain ID for Hilbert Hotel Chain
  const EXPECTED_CHAIN_ID = 18504;

  // Connect wallet
  const connectWallet = useCallback(async () => {
    setError(null);
    try {
      console.log('Available connectors:', connectors);
      const injectedConnector = connectors.find(c => c.id === 'injected');
      if (injectedConnector) {
        console.log('Connecting with injected connector');
        connect({ connector: injectedConnector });
      } else {
        console.log('No injected connector found');
        setError('MetaMask not found. Please install MetaMask.');
      }
    } catch (err: any) {
      console.error('Connection error:', err);
      setError(err.message || 'Failed to connect wallet');
    }
  }, [connect, connectors]);

  // Switch to correct network
  useEffect(() => {
    if (isConnected && chainId && chainId !== EXPECTED_CHAIN_ID) {
      switchChain?.({ chainId: EXPECTED_CHAIN_ID });
    }
  }, [isConnected, chainId, switchChain]);

  // Update network name based on chain
  useEffect(() => {
    if (isConnected && chainId === EXPECTED_CHAIN_ID) {
      setNetworkName('Hilbert Hotel Chain');
    } else if (isConnected) {
      setNetworkName(`Wrong Network (Chain ${chainId})`);
    } else {
      setNetworkName('Not Connected');
    }
  }, [isConnected, chainId]);

  const shortenedAddress = useMemo(() => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  }, [address]);

  const shortenedContract = useMemo(() => {
    return `${TICKET_CONTRACT_ADDRESS.slice(0, 6)}...${TICKET_CONTRACT_ADDRESS.slice(-4)}`;
  }, []);

  const redeemedCount = useMemo(() => tickets.filter(t => t.isRedeemed).length, [tickets]);
  const activeCount = useMemo(() => tickets.filter(t => !t.isRedeemed).length, [tickets]);

  return {
    tickets,
    isLoading: isLoadingTickets || status === 'pending',
    isConnected,
    connectWallet,
    walletAddress: address || null,
    shortenedAddress,
    contractAddress: TICKET_CONTRACT_ADDRESS,
    shortenedContract,
    networkName,
    redeemedCount,
    activeCount,
    error
  };
};
