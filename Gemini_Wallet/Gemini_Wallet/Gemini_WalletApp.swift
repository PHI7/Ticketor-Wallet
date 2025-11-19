//
//  ContentView.swift
//  Ticketor
//
//  Created by Your World-Class AI Engineer
//
//  Instructions:
//  1. Create a new SwiftUI project in Xcode.
//  2. Add the WalletConnectSwiftV2 package: File > Add Package Dependencies... > https://github.com/WalletConnect/WalletConnectSwiftV2.git
//  3. Add the Futura font file to your project and register it in your Info.plist under "Fonts provided by application".
//  4. Replace the contents of ContentView.swift with this code.
//

import SwiftUI
import WalletConnectSign

// MARK: - Main App Entry Point
@main
struct TicketorApp: App {
    var body: some Scene {
        WindowGroup {
            ContentView()
        }
    }
}

// MARK: - Main View (Handles Connection State)
struct ContentView: View {
    @StateObject private var viewModel = WalletViewModel()

    var body: some View {
        if viewModel.isConnected {
            WalletView()
                .environmentObject(viewModel)
        } else {
            ConnectView()
                .environmentObject(viewModel)
        }
    }
}

// MARK: - Connect Wallet View
struct ConnectView: View {
    @EnvironmentObject var viewModel: WalletViewModel

    var body: some View {
        ZStack {
            Color.main.ignoresSafeArea()
            
            VStack(spacing: 20) {
                Text("Ticketor")
                    .font(.custom("Futura-Bold", size: 50))
                    .foregroundColor(.white)
                
                Text("Your NFT Ticket Wallet")
                    .font(.custom("Futura", size: 18))
                    .foregroundColor(.gray)
                
                if viewModel.isLoading {
                    ProgressView()
                        .progressViewStyle(CircularProgressViewStyle(tint: .white))
                        .scaleEffect(1.5)
                        .padding(.top, 40)
                } else {
                    Button(action: viewModel.connect) {
                        Text("Connect Wallet")
                            .font(.custom("Futura-Medium", size: 20))
                            .foregroundColor(.white)
                            .padding()
                            .frame(maxWidth: 250)
                            .background(Color.accent)
                            .cornerRadius(12)
                    }
                    .padding(.top, 40)
                }
                
                if let error = viewModel.errorMessage {
                    Text(error)
                        .font(.custom("Futura", size: 14))
                        .foregroundColor(.red)
                        .multilineTextAlignment(.center)
                        .padding()
                }
            }
        }
    }
}


// MARK: - Main Wallet View
struct WalletView: View {
    @EnvironmentObject var viewModel: WalletViewModel
    @State private var selectedTicket: NFTTicket?

    var body: some View {
        NavigationView {
            ZStack {
                Color.main.ignoresSafeArea()
                
                VStack(spacing: 0) {
                    WalletHeaderView()
                        .padding()

                    if viewModel.isLoading && viewModel.tickets.isEmpty {
                        Spacer()
                        ProgressView()
                            .progressViewStyle(CircularProgressViewStyle(tint: .accent))
                            .scaleEffect(1.5)
                        Text("Lade Tickets...")
                            .foregroundColor(.gray)
                            .padding(.top)
                        Spacer()
                    } else if viewModel.tickets.isEmpty {
                        EmptyWalletView()
                    } else {
                        ScrollView {
                            LazyVGrid(columns: [GridItem(.flexible(), spacing: 16), GridItem(.flexible(), spacing: 16)], spacing: 16) {
                                ForEach(viewModel.tickets) { ticket in
                                    TicketCardView(ticket: ticket)
                                        .onTapGesture {
                                            selectedTicket = ticket
                                        }
                                }
                            }
                            .padding()
                        }
                    }
                }
                .navigationBarTitleDisplayMode(.inline)
                .toolbar {
                    ToolbarItem(placement: .principal) {
                        Text("Ticketor")
                            .font(.custom("Futura-Bold", size: 24))
                            .foregroundColor(.white)
                    }
                }
            }
        }
        .accentColor(.accent) // For back buttons etc.
        .sheet(item: $selectedTicket) { ticket in
            TicketDetailView(ticket: ticket)
                .environmentObject(viewModel)
        }
    }
}

// MARK: - Wallet Header
struct WalletHeaderView: View {
    @EnvironmentObject var viewModel: WalletViewModel

    var body: some View {
        VStack(spacing: 16) {
            HStack {
                Image(systemName: "wallet.pass.fill")
                    .font(.title)
                    .foregroundColor(.accent)
                
                VStack(alignment: .leading, spacing: 4) {
                    Text("Meine Wallet")
                        .font(.custom("Futura", size: 12))
                        .foregroundColor(.gray)
                    Text(viewModel.shortenedAddress)
                        .font(.custom("Menlo", size: 14))
                        .fontWeight(.medium)
                        .foregroundColor(.white)
                }
                Spacer()
                Button(action: {
                    UIPasteboard.general.string = viewModel.walletAddress
                }) {
                    Image(systemName: "doc.on.doc")
                        .foregroundColor(.gray)
                }
            }
            .padding()
            .background(Color.card)
            .cornerRadius(12)
            
            HStack(spacing: 12) {
                StatBoxView(title: "Tickets", value: "\(viewModel.tickets.count)", icon: "ticket.fill", color: .accent)
                StatBoxView(title: "Eingelöst", value: "\(viewModel.redeemedCount)", icon: "checkmark.circle.fill", color: .green)
                StatBoxView(title: "Aktiv", value: "\(viewModel.activeCount)", icon: "clock.fill", color: .orange)
            }
        }
    }
}

// MARK: - Stat Box
struct StatBoxView: View {
    let title: String, value: String, icon: String, color: Color
    
    var body: some View {
        VStack(spacing: 8) {
            Image(systemName: icon)
                .font(.title3)
                .foregroundColor(color)
            Text(value)
                .font(.custom("Futura-Bold", size: 22))
                .foregroundColor(.white)
            Text(title)
                .font(.custom("Futura", size: 11))
                .textCase(.uppercase)
                .foregroundColor(.gray)
        }
        .frame(maxWidth: .infinity)
        .padding()
        .background(Color.card)
        .cornerRadius(12)
    }
}

// MARK: - Ticket Card
struct TicketCardView: View {
    let ticket: NFTTicket
    
    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            ZStack(alignment: .topTrailing) {
                AsyncImage(url: URL(string: ticket.imageURL ?? "")) { image in
                    image.resizable()
                } placeholder: {
                    Color.gray.opacity(0.3)
                }
                .aspectRatio(contentMode: .fill)
                .frame(height: 120)
                .clipped()

                Text(ticket.isRedeemed ? "Eingelöst" : "Gültig")
                    .font(.custom("Futura-Bold", size: 10))
                    .foregroundColor(.white)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(ticket.isRedeemed ? Color.green : Color.orange)
                    .cornerRadius(6)
                    .padding(8)
            }
            
            VStack(alignment: .leading, spacing: 6) {
                Text(ticket.eventName)
                    .font(.custom("Futura-Bold", size: 16))
                    .foregroundColor(.white)
                    .lineLimit(1)
                
                InfoRow(icon: "calendar", text: ticket.eventDate)
                InfoRow(icon: "mappin.circle", text: ticket.venue)

                Text(ticket.categoryName)
                    .font(.custom("Futura-Medium", size: 10))
                    .foregroundColor(.accent)
                    .padding(.horizontal, 8)
                    .padding(.vertical, 4)
                    .background(Color.accent.opacity(0.2))
                    .cornerRadius(10)
                    .padding(.top, 4)
            }
            .padding()
        }
        .background(Color.card)
        .cornerRadius(16)
    }
    
    private func InfoRow(icon: String, text: String) -> some View {
        HStack {
            Image(systemName: icon)
                .font(.caption)
            Text(text)
                .font(.custom("Futura", size: 12))
        }
        .foregroundColor(.gray)
    }
}

// MARK: - Ticket Detail View
struct TicketDetailView: View {
    let ticket: NFTTicket
    @EnvironmentObject var viewModel: WalletViewModel
    @Environment(\.dismiss) var dismiss

    var body: some View {
        ZStack {
            Color.card.ignoresSafeArea()
            
            ScrollView {
                VStack(spacing: 24) {
                    ZStack(alignment: .topTrailing) {
                        AsyncImage(url: URL(string: ticket.imageURL ?? "")) { image in
                            image.resizable()
                        } placeholder: {
                            Color.main
                        }
                        .aspectRatio(contentMode: .fill)
                        .frame(height: 200)
                        .clipped()
                        
                        Button(action: { dismiss() }) {
                            Image(systemName: "xmark.circle.fill")
                                .font(.title)
                                .foregroundColor(.white)
                                .shadow(radius: 5)
                        }
                        .padding()
                    }
                    
                    VStack(alignment: .leading, spacing: 20) {
                        Text(ticket.eventName)
                            .font(.custom("Futura-Bold", size: 32))
                            .foregroundColor(.white)
                        
                        VStack(alignment: .leading, spacing: 12) {
                            DetailInfoRow(icon: "calendar", text: ticket.eventDate)
                            DetailInfoRow(icon: "clock", text: ticket.eventTime)
                            DetailInfoRow(icon: "mappin.circle", text: ticket.venue)
                        }
                        
                        Divider().background(Color.gray.opacity(0.5))
                        
                        HStack {
                            VStack(alignment: .leading) {
                                Text("Kategorie").font(.custom("Futura", size: 12)).foregroundColor(.gray)
                                Text(ticket.categoryName).font(.custom("Futura-Medium", size: 18)).foregroundColor(.white)
                            }
                            Spacer()
                            VStack(alignment: .trailing) {
                                Text("Ticket ID").font(.custom("Futura", size: 12)).foregroundColor(.gray)
                                Text("#\(ticket.tokenId)").font(.custom("Menlo", size: 18)).foregroundColor(.white)
                            }
                        }
                        
                        VStack(spacing: 12) {
                            Text("Ihr Eintrittscode")
                                .font(.custom("Futura-Medium", size: 18))
                                .foregroundColor(.white)
                            
                            if ticket.isRedeemed {
                                VStack(spacing: 16) {
                                    Image(systemName: "checkmark.circle.fill").font(.system(size: 80)).foregroundColor(.green)
                                    Text("Ticket eingelöst").font(.custom("Futura-Bold", size: 22)).foregroundColor(.green)
                                    Text("Eingelöst am \(ticket.redeemedDate ?? "N/A")").font(.custom("Futura", size: 12)).foregroundColor(.gray)
                                }
                                .frame(height: 250)
                            } else {
                                QRCodeView(value: ticket.qrCodeString)
                                    .frame(width: 250, height: 250)
                                    .background(Color.white)
                                    .cornerRadius(12)
                                Text("Zeigen Sie diesen Code am Eingang vor").font(.custom("Futura", size: 12)).foregroundColor(.gray)
                            }
                        }
                        .frame(maxWidth: .infinity)
                        .padding()
                        .background(Color.main)
                        .cornerRadius(16)
                        
                        VStack(alignment: .leading, spacing: 12) {
                            Text("Blockchain-Details").font(.custom("Futura-Bold", size: 18)).foregroundColor(.white)
                            BlockchainInfoRow(label: "Contract", value: viewModel.shortenedContract)
                            BlockchainInfoRow(label: "Token ID", value: ticket.tokenId)
                            BlockchainInfoRow(label: "Network", value: viewModel.networkName)
                            BlockchainInfoRow(label: "Status", value: ticket.isRedeemed ? "Eingelöst" : "Gültig")
                        }
                        .padding()
                        .background(Color.main)
                        .cornerRadius(16)
                    }
                    .padding()
                }
            }
        }
    }
    
    private func DetailInfoRow(icon: String, text: String) -> some View {
        HStack {
            Image(systemName: icon).foregroundColor(.accent).frame(width: 20)
            Text(text).font(.custom("Futura", size: 16)).foregroundColor(.white.opacity(0.8))
        }
    }
    
    private func BlockchainInfoRow(label: String, value: String) -> some View {
        HStack {
            Text(label).font(.custom("Futura", size: 14)).foregroundColor(.gray)
            Spacer()
            Text(value).font(.custom("Menlo", size: 14)).foregroundColor(.white)
        }
    }
}

// MARK: - Empty Wallet View
struct EmptyWalletView: View {
    var body: some View {
        VStack(spacing: 20) {
            Image(systemName: "ticket")
                .font(.system(size: 80))
                .foregroundColor(.gray.opacity(0.5))
            
            Text("Keine Tickets vorhanden")
                .font(.custom("Futura-Bold", size: 22))
                .foregroundColor(.white)
            
            Text("Ihre gekauften Tickets werden hier angezeigt.")
                .font(.custom("Futura", size: 16))
                .foregroundColor(.gray)
                .multilineTextAlignment(.center)
                .padding(.horizontal)
        }
        .frame(maxHeight: .infinity)
    }
}

// MARK: - QR Code Generator
struct QRCodeView: View {
    let value: String
    
    var body: some View {
        if let qrImage = generateQRCode(from: value) {
            Image(uiImage: qrImage)
                .interpolation(.none)
                .resizable()
                .scaledToFit()
        } else {
            Image(systemName: "xmark.circle")
                .font(.largeTitle)
                .foregroundColor(.red)
        }
    }
    
    func generateQRCode(from string: String) -> UIImage? {
        let data = string.data(using: .utf8)
        if let filter = CIFilter(name: "CIQRCodeGenerator") {
            filter.setValue(data, forKey: "inputMessage")
            let transform = CGAffineTransform(scaleX: 10, y: 10)
            if let output = filter.outputImage?.transformed(by: transform) {
                let context = CIContext()
                if let cgImage = context.createCGImage(output, from: output.extent) {
                    return UIImage(cgImage: cgImage)
                }
            }
        }
        return nil
    }
}


// MARK: - Models and ViewModel
struct NFTTicket: Identifiable {
    let id: String, tokenId: String, eventName: String, eventDate: String, eventTime: String, venue: String, categoryName: String, imageURL: String?, isRedeemed: Bool, qrCodeString: String, redeemedDate: String?
}

@MainActor
class WalletViewModel: ObservableObject {
    // Published properties to update the UI
    @Published var tickets: [NFTTicket] = []
    @Published var isLoading: Bool = false
    @Published var isConnected: Bool = false
    @Published var walletAddress: String = ""
    @Published var errorMessage: String?
    
    // Static properties
    let contractAddress: String = "0xABCD...EFGH"
    let networkName: String = "Hilbert Hotelkette"

    // WalletConnect Service (Placeholder)
    // In a real app, this would be a separate, more robust service.
    private var signClient: SignClient?
    
    // Computed Properties
    var shortenedAddress: String {
        guard walletAddress.count > 10 else { return walletAddress }
        return "\(walletAddress.prefix(6))...\(walletAddress.suffix(4))"
    }
    var shortenedContract: String {
        guard contractAddress.count > 10 else { return contractAddress }
        return "\(contractAddress.prefix(6))...\(contractAddress.suffix(4))"
    }
    var redeemedCount: Int { tickets.filter { $0.isRedeemed }.count }
    var activeCount: Int { tickets.filter { !$0.isRedeemed }.count }
    
    private let hilbertChain = Blockchain("eip155:18504")! // ChainID 18504

    init() {
        // Setup WalletConnect client
        // This is a simplified setup. Refer to WalletConnect documentation for a production setup.
        let metadata = AppMetadata(
            name: "Ticketor",
            description: "NFT Ticket Wallet",
            url: "https://your-app-url.com",
            icons: ["https://your-app-url.com/icon.png"]
        )
        signClient = SignClient(
            projectId: "YOUR_WALLETCONNECT_PROJECT_ID", // Get this from cloud.walletconnect.com
            metadata: metadata
        )
    }

    func connect() {
        isLoading = true
        errorMessage = nil

        Task {
            do {
                // Get the URI to show in a QR code or to open a mobile wallet
                let uri = try await signClient?.connect(
                    requiredNamespaces: [
                        "eip155": ProposalNamespace(
                            chains: [hilbertChain],
                            methods: ["eth_sendTransaction", "personal_sign"],
                            events: ["chainChanged", "accountsChanged"]
                        )
                    ]
                )
                
                // Present the connection URI to the user (e.g., via QR code sheet)
                // This part requires a UI component to show the QR code or deep link.
                // For simplicity, we'll assume the connection is established.
                // In a real app, you would handle the session proposal and approval flow.
                
                // ---- MOCK CONNECTION FOR DEMO ----
                // In a real app, you would get the address from the session approval.
                try await Task.sleep(nanoseconds: 2_000_000_000) // Simulate connection delay
                let mockAddress = "0x1234567890abcdef1234567890abcdef12345678"
                self.walletAddress = mockAddress
                self.isConnected = true
                await self.loadTickets()
                // ---- END MOCK ----

            } catch {
                errorMessage = "Failed to connect wallet. Please try again."
                print("Connection failed: \(error.localizedDescription)")
            }
            isLoading = false
        }
    }
    
    // Note: The logic for `switchOrAddNetwork` would involve sending a `wallet_addEthereumChain`
    // request through the WalletConnect session, which is more complex than the web version.
    // For this native app, we request the correct chain during the initial connection.

    func loadTickets() async {
        isLoading = true
        // Simulate network delay
        try? await Task.sleep(nanoseconds: 1_500_000_000)
        
        // Mock data
        self.tickets = [
            NFTTicket(id: "1", tokenId: "12345", eventName: "Rock am Ring 2025", eventDate: "15. Juni 2025", eventTime: "18:00 Uhr", venue: "Nürburgring", categoryName: "VIP", imageURL: "https://picsum.photos/seed/rock/400/300", isRedeemed: false, qrCodeString: "TICKET:12345", redeemedDate: nil),
            NFTTicket(id: "2", tokenId: "67890", eventName: "FC Bayern vs. Dortmund", eventDate: "20. Mai 2025", eventTime: "15:30 Uhr", venue: "Allianz Arena", categoryName: "Standard", imageURL: "https://picsum.photos/seed/bayern/400/300", isRedeemed: true, qrCodeString: "TICKET:67890", redeemedDate: "19. Mai 2025"),
            NFTTicket(id: "3", tokenId: "11223", eventName: "Classical Concert Gala", eventDate: "05. Juli 2025", eventTime: "20:00 Uhr", venue: "Elbphilharmonie Hamburg", categoryName: "Premium", imageURL: "https://picsum.photos/seed/classic/400/300", isRedeemed: false, qrCodeString: "TICKET:11223", redeemedDate: nil),
            NFTTicket(id: "4", tokenId: "44556", eventName: "Tech Conference 2025", eventDate: "10. August 2025", eventTime: "09:00 Uhr", venue: "Messe Berlin", categoryName: "All-Access", imageURL: "https://picsum.photos/seed/tech/400/300", isRedeemed: false, qrCodeString: "TICKET:44556", redeemedDate: nil)
        ]
        
        isLoading = false
    }
}


// MARK: - Helpers
extension Color {
    static let main = Color(hex: "242424")
    static let card = Color(hex: "1A1A1A")
    static let accent = Color(hex: "c70035")
    
    init(hex: String) {
        let hex = hex.trimmingCharacters(in: CharacterSet.alphanumerics.inverted)
        var int: UInt64 = 0
        Scanner(string: hex).scanHexInt64(&int)
        let a, r, g, b: UInt64
        switch hex.count {
        case 3: // RGB (12-bit)
            (a, r, g, b) = (255, (int >> 8) * 17, (int >> 4 & 0xF) * 17, (int & 0xF) * 17)
        case 6: // RGB (24-bit)
            (a, r, g, b) = (255, int >> 16, int >> 8 & 0xFF, int & 0xFF)
        case 8: // ARGB (32-bit)
            (a, r, g, b) = (int >> 24, int >> 16 & 0xFF, int >> 8 & 0xFF, int & 0xFF)
        default:
            (a, r, g, b) = (255, 0, 0, 0)
        }
        self.init(.sRGB, red: Double(r) / 255, green: Double(g) / 255, blue: Double(b) / 255, opacity: Double(a) / 255)
    }
}
