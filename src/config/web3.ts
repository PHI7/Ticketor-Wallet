import { cookieStorage, createStorage } from 'wagmi'
import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { defineChain } from '@reown/appkit/networks'

// ============================================
// 1. DEINE HILBERT HOTEL CHAIN (LOKAL)
// ============================================
export const hilbertHotelChain = defineChain({
  id: 18504, // Muss exakt mit deiner lokalen Chain übereinstimmen
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
      http: ['http://127.0.0.1:8545'] 
    },
    public: { 
      http: ['http://127.0.0.1:8545'] 
    },
  },
  blockExplorers: {
    default: {
      name: 'Hilbert Hotel Chain Explorer',
      url: 'http://localhost:3000'
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