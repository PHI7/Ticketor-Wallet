import { useState, useCallback, useMemo, useEffect } from 'react';
import type { NFTTicket } from '../types';

// Fix: Define a proper type for window.ethereum to resolve the "Untyped function calls may not accept type arguments" error.
interface EIP1193Provider {
  request: <T>(args: { method: string; params?: unknown[] | object }) => Promise<T>;
  on: (eventName: string, listener: (...args: any[]) => void) => void;
  removeListener: (eventName: string, listener: (...args: any[]) => void) => void;
}

declare global {
  interface Window {
    ethereum?: EIP1193Provider;
  }
}

const MOCK_TICKETS: NFTTicket[] = [
  {
    id: "1",
    tokenId: "12345",
    eventName: "Rock am Ring 2025",
    eventDate: "15. Juni 2025",
    eventTime: "18:00 Uhr",
    venue: "Nürburgring",
    categoryName: "VIP",
    imageURL: `https://picsum.photos/seed/rock/400/300`,
    isRedeemed: false,
    qrCodeString: "TICKET:12345",
    redeemedDate: null
  },
  {
    id: "2",
    tokenId: "67890",
    eventName: "FC Bayern vs. Dortmund",
    eventDate: "20. Mai 2025",
    eventTime: "15:30 Uhr",
    venue: "Allianz Arena",
    categoryName: "Standard",
    imageURL: `https://picsum.photos/seed/bayern/400/300`,
    isRedeemed: true,
    qrCodeString: "TICKET:67890",
    redeemedDate: "19. Mai 2025"
  },
    {
    id: "3",
    tokenId: "11223",
    eventName: "Classical Concert Gala",
    eventDate: "05. Juli 2025",
    eventTime: "20:00 Uhr",
    venue: "Elbphilharmonie Hamburg",
    categoryName: "Premium",
    imageURL: `https://picsum.photos/seed/classic/400/300`,
    isRedeemed: false,
    qrCodeString: "TICKET:11223",
    redeemedDate: null
  },
  {
    id: "4",
    tokenId: "44556",
    eventName: "Tech Conference 2025",
    eventDate: "10. August 2025",
    eventTime: "09:00 Uhr",
    venue: "Messe Berlin",
    categoryName: "All-Access",
    imageURL: `https://picsum.photos/seed/tech/400/300`,
    isRedeemed: false,
    qrCodeString: "TICKET:44556",
    redeemedDate: null
  }
];

const HILBERT_CHAIN = {
  chainId: '0x4848', // 18504
  chainName: 'Hilbert Hotelkette',
  nativeCurrency: {
    name: 'ARGO',
    symbol: 'ARGO',
    decimals: 18,
  },
  rpcUrls: ['http://192.168.173.101:8545'],
  blockExplorerUrls: null as string[] | null,
};


export const useWallet = () => {
  const [tickets, setTickets] = useState<NFTTicket[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [contractAddress] = useState<string>('0xABCD...EFGH');
  const [networkName, setNetworkName] = useState<string | null>(null);

  const isConnected = useMemo(() => !!walletAddress, [walletAddress]);

  const loadTickets = useCallback(async () => {
    if (!walletAddress) return;
    setIsLoading(true);
    // Simulate network delay for fetching tickets
    await new Promise(res => setTimeout(res, 1500));
    setTickets(MOCK_TICKETS);
    setIsLoading(false);
  }, [walletAddress]);

  const switchOrAddNetwork = async () => {
    if (!window.ethereum) throw new Error("MetaMask is not installed");
    try {
      await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: HILBERT_CHAIN.chainId }],
      });
      setNetworkName(HILBERT_CHAIN.chainName);
    } catch (switchError: any) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [HILBERT_CHAIN],
          });
           setNetworkName(HILBERT_CHAIN.chainName);
        } catch (addError) {
          console.error("Failed to add network", addError);
          throw new Error("Failed to add Hilbert Hotel Chain to MetaMask.");
        }
      } else {
        console.error("Failed to switch network", switchError);
        throw new Error("Failed to switch to Hilbert Hotel Chain.");
      }
    }
  };

  const connectWallet = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    if (!window.ethereum) {
      setError("Please install MetaMask to use this app.");
      setIsLoading(false);
      return;
    }

    try {
      const accounts = await window.ethereum.request<string[]>({ method: 'eth_requestAccounts' });
      if (accounts && accounts.length > 0) {
        setWalletAddress(accounts[0]);
        await switchOrAddNetwork();
        await loadTickets();
      }
    } catch (err: any) {
      console.error("Connection failed", err);
      setError(err.message || "Failed to connect wallet. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [loadTickets]);

  useEffect(() => {
    if (!window.ethereum) return;

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        setWalletAddress(null);
        setTickets([]);
        setNetworkName(null);
      } else if (accounts[0] !== walletAddress) {
        setWalletAddress(accounts[0]);
      }
    };

    const handleChainChanged = (_chainId: string) => {
      window.location.reload();
    };

    window.ethereum.on('accountsChanged', handleAccountsChanged);
    window.ethereum.on('chainChanged', handleChainChanged);

    return () => {
      window.ethereum?.removeListener('accountsChanged', handleAccountsChanged);
      window.ethereum?.removeListener('chainChanged', handleChainChanged);
    };
  }, [walletAddress]);

  const shortenedAddress = useMemo(() => {
    if (!walletAddress) return '';
    return `${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
  }, [walletAddress]);

  const shortenedContract = useMemo(() => {
    if (contractAddress.length <= 10) return contractAddress;
    return `${contractAddress.slice(0, 6)}...${contractAddress.slice(-4)}`;
  }, [contractAddress]);

  const redeemedCount = useMemo(() => tickets.filter(t => t.isRedeemed).length, [tickets]);
  const activeCount = useMemo(() => tickets.filter(t => !t.isRedeemed).length, [tickets]);

  return {
    tickets,
    isLoading,
    isConnected,
    connectWallet,
    walletAddress,
    shortenedAddress,
    contractAddress,
    shortenedContract,
    networkName: networkName || 'Not Connected',
    redeemedCount,
    activeCount,
    error
  };
};