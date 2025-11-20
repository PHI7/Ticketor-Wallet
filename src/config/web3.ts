import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'

// ============================================
// UTILITY: Get RPC and Explorer URLs for local/WiFi access
// ============================================
const getRpcUrl = () => {
  // Use localhost for same machine, or detect IP for WiFi devices
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
    // We're on a different device - try to use detected IP
    // For now, keep localhost - can be configured per-device
    return 'http://127.0.0.1:8545';
  }
  return 'http://127.0.0.1:8545';
};

const getExplorerUrl = () => {
  if (typeof window !== 'undefined') {
    // Use current hostname for block explorer (works for both localhost and network IPs)
    const protocol = window.location.protocol;
    const hostname = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'
      ? 'localhost'
      : window.location.hostname;
    return `${protocol}//${hostname}:3000`;
  }
  return 'http://localhost:3000';
};

// ============================================
// 1. HILBERT HOTEL CHAIN (LOCAL)
// ============================================
export const hilbertHotelChain = defineChain({
  id: 18504,
  chainNamespace: 'eip155',
  caipNetworkId: 'eip155:18504',
  name: 'Hilbert Hotel Chain',
  nativeCurrency: {
    name: 'Argentos',
    symbol: 'ARGO',
    decimals: 18
  },
  rpcUrls: {
    default: {
      http: [getRpcUrl()]
    },
    public: {
      http: [getRpcUrl()]
    },
  },
  blockExplorers: {
    default: {
      name: 'Hilbert Hotel Chain Explorer',
      url: getExplorerUrl()
    },
  },
  testnet: true,
})

// ============================================
// 2. PROJEKT EINSTELLUNGEN
// ============================================
// Demo-ID für lokalen Test. Für TestFlight später: Eigene ID holen!
export const projectId = 'b56e18d47c72ab683b10814fe9495694'

// Hier definieren wir: NUR deine Chain soll sichtbar sein
export const networks = [hilbertHotelChain]

export const metadata = {
  name: 'Ticketor',
  description: 'Hilbert Hotel Ticket Wallet',
  url: 'http://localhost:3000', 
  icons: ['https://avatars.githubusercontent.com/u/179229932']
}

// ============================================
// 3. ADAPTER INITIALISIERUNG
// ============================================
export const wagmiAdapter = new WagmiAdapter({
  storage: createStorage({
    storage: cookieStorage
  }),
  ssr: false,
  projectId,
  networks
})

export const config = wagmiAdapter.wagmiConfig