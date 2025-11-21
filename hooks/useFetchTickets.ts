import { useState, useEffect } from 'react';
import { useAccount, usePublicClient } from 'wagmi';
import { TicketNFTABI, TICKET_CONTRACT_ADDRESS } from '../src/abi/TicketNFT';
import type { NFTTicket } from '../types';

export function useFetchTickets() {
  const { address, isConnected } = useAccount();
  const publicClient = usePublicClient();
  const [tickets, setTickets] = useState<NFTTicket[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!isConnected || !address || !publicClient) {
      console.log('useFetchTickets: Missing dependencies', { isConnected, address, publicClient: !!publicClient });
      return;
    }

    const fetchTickets = async () => {
      setIsLoading(true);
      try {
        console.log('Fetching tickets for address:', address);
        // 1. Get all ticket IDs for this owner
        const ticketIds = await publicClient.readContract({
          address: TICKET_CONTRACT_ADDRESS as `0x${string}`,
          abi: TicketNFTABI,
          functionName: 'getTicketsByOwner',
          args: [address],
        });

        console.log('Ticket IDs found:', ticketIds);
        const loadedTickets: NFTTicket[] = [];

        // 2. Fetch detailed data for each ticket
        for (const tokenId of ticketIds as bigint[]) {
          try {
            const ticketData = await publicClient.readContract({
              address: TICKET_CONTRACT_ADDRESS as `0x${string}`,
              abi: TicketNFTABI,
              functionName: 'getTicket',
              args: [tokenId],
            });

            // Convert Unix timestamp to readable date/time
            const eventDateObj = new Date(Number(ticketData[3]) * 1000);
            const eventDate = eventDateObj.toLocaleDateString('de-DE');
            const eventTime = eventDateObj.toLocaleTimeString('de-DE', {
              hour: '2-digit',
              minute: '2-digit',
            });

            // Get QR code data
            const qrData = await publicClient.readContract({
              address: TICKET_CONTRACT_ADDRESS as `0x${string}`,
              abi: TicketNFTABI,
              functionName: 'getQRData',
              args: [tokenId],
            });

            loadedTickets.push({
              id: tokenId.toString(),
              tokenId: tokenId.toString(),
              eventName: ticketData[1], // eventName from getTicket
              eventDate: eventDate,
              eventTime: eventTime,
              venue: ticketData[2], // seatInfo from getTicket
              categoryName: ticketData[2], // Use seatInfo as category
              imageURL: null,
              isRedeemed: ticketData[5], // redeemed status
              qrCodeString: qrData as string,
              redeemedDate: ticketData[6] !== 0n ? new Date(Number(ticketData[6]) * 1000).toLocaleDateString('de-DE') : null,
            });
          } catch (error) {
            console.error(`Error fetching ticket ${tokenId}:`, error);
          }
        }

        setTickets(loadedTickets);
      } catch (error) {
        console.error("Error loading tickets:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, [address, isConnected, publicClient]);

  return { tickets, isLoading };
}
