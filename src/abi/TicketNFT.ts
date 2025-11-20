// Ticket NFT Contract Configuration
export const TICKET_CONTRACT_ADDRESS = '0x9FfD22337ea57daC396891526Cac42A03C76abfC';

// Full TicketorNFT ABI
export const TicketNFTABI = [
  {
    inputs: [],
    stateMutability: 'nonpayable',
    type: 'constructor',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'balanceOf',
    outputs: [
      {
        internalType: 'uint256',
        name: '',
        type: 'uint256',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'address',
        name: 'owner',
        type: 'address',
      },
    ],
    name: 'getTicketsByOwner',
    outputs: [
      {
        internalType: 'uint256[]',
        name: '',
        type: 'uint256[]',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getTicket',
    outputs: [
      {
        components: [
          {
            internalType: 'uint256',
            name: 'eventId',
            type: 'uint256',
          },
          {
            internalType: 'string',
            name: 'eventName',
            type: 'string',
          },
          {
            internalType: 'string',
            name: 'seatInfo',
            type: 'string',
          },
          {
            internalType: 'uint256',
            name: 'eventDate',
            type: 'uint256',
          },
          {
            internalType: 'bytes32',
            name: 'qrHash',
            type: 'bytes32',
          },
          {
            internalType: 'bool',
            name: 'redeemed',
            type: 'bool',
          },
          {
            internalType: 'uint256',
            name: 'redeemedAt',
            type: 'uint256',
          },
          {
            internalType: 'address',
            name: 'redeemedBy',
            type: 'address',
          },
          {
            internalType: 'address',
            name: 'currentOwner',
            type: 'address',
          },
        ],
        internalType: 'struct TicketorNFT.TicketView',
        name: '',
        type: 'tuple',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'getQRData',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'isRedeemed',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'tokenURI',
    outputs: [
      {
        internalType: 'string',
        name: '',
        type: 'string',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'tokenId',
        type: 'uint256',
      },
    ],
    name: 'ownerOf',
    outputs: [
      {
        internalType: 'address',
        name: '',
        type: 'address',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
  {
    inputs: [
      {
        internalType: 'uint256',
        name: 'eventId',
        type: 'uint256',
      },
    ],
    name: 'getEvent',
    outputs: [
      {
        internalType: 'string',
        name: 'name',
        type: 'string',
      },
      {
        internalType: 'uint256',
        name: 'date',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'maxTickets',
        type: 'uint256',
      },
      {
        internalType: 'uint256',
        name: 'soldTickets',
        type: 'uint256',
      },
      {
        internalType: 'bool',
        name: 'active',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
] as const;
