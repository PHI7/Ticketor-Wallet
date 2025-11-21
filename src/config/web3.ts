import { createConfig, http } from 'wagmi'
import { injected } from 'wagmi/connectors'

// ============================================
// UTILITY: Get RPC and Explorer URLs for local/WiFi access
// ============================================
const getRpcUrl = () => {
  return 'http://127.0.0.1:8545';
};

const getExplorerUrl = () => {
  if (typeof window !== 'undefined') {
    const protocol = window.location.protocol;
    const hostname = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'localhost'
      : window.location.hostname;
    return `${protocol}//${hostname}:3000`;
  }
  return 'http://localhost:3000';
};

// ============================================
// HILBERT HOTEL CHAIN (LOCAL)
// ============================================
export const hilbertHotelChain = {
  id: 18504,
  name: 'Hilbert Hotel Chain',
  nativeCurrency: {
    decimals: 18,
    name: 'Argentos',
    symbol: 'ARGO',
  },
  rpcUrls: {
    default: { http: [getRpcUrl()] },
    public: { http: [getRpcUrl()] },
  },
  blockExplorers: {
    default: {
      name: 'Hilbert Hotel Chain Explorer',
      url: getExplorerUrl(),
    },
  },
  testnet: true,
} as const;

// ============================================
// WAGMI CONFIG
// ============================================
export const config = createConfig({
  chains: [hilbertHotelChain] as any,
  connectors: [injected()],
  transports: {
    [hilbertHotelChain.id]: http(getRpcUrl()),
  },
})