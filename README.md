# Defrost

<h3 align="center">DEFROST</h3>

[IMAGE PLACEHOLDER - Add project image here]

This is the source repository for the Defrost, a decentralized platform that
connects blockchain project creators, startups with potential funders, investors
providing a transparent and efficient way to showcase and support innovative
blockchain initiatives.

Defrost offers a comprehensive project management system for blockchain
projects, allowing creators to present their ideas with detailed information,
media assets, and social links while enabling supporters to discover and fund
promising projects through a clean, intuitive interface.

Defrost operates fully on the blockchain, ensuring transparency and security for
all transactions and project data. The platform supports multiple parachain
networks, giving project creators flexibility in choosing where to deploy their
projects.

Defrost offer various protocols to help the project deployed thrive and create a
community around the project. One such protocol being a no-lose launchpool that
leverage vAsset LST technology from Bifrost omnichain

## Benefits

### For Stakers

- **Continuous Earnings**: Earn launchpool rewards with vAsset LST
- **Flexibility**: Stake and unstake at your convenience, with emission rate
  mechanism to fairness earning for all investors.
- **Security and Transparency**: Fully decentralized and on-chain processes
  ensure fairness and reliability.
- **Portfolio Growth**: Access to a diverse range of tokens and increased
  earning opportunities.

### For Project Owners

- **Enhanced Liquidity**: Possibility of integrating a flash loan mechanism
  using the investor liquidity and earn the portion of the profit from the flash
  loan (this feat is a follow up expand of Defrost and haven't implemented)
- **Community Engagement**: Build a loyal base of investors through fair and
  transparent reward systems.
- **Trust Building**: Decentralized systems ensure fair token distribution and
  increased trust.

### For the Parachain Ecosystem

- **Increased Activity**: Encourages greater use of Polkadot and Kusama
  networks.
- **Showcasing PolkaVM**: Demonstrates the capabilities of Polkadot’s virtual
  machine for decentralized applications.
- **Ecosystem Growth**: Attracts more developers and projects to the parachain
  ecosystem, boosting its overall value.

### For the Bifrost Ecosystem

- **vAsset Utility**: Expands the use cases for vAssets, increasing their
  adoption and liquidity.
- **Enhanced Staking Appeal**: Adds value to the Bifrost platform by integrating
  it with other DeFi opportunities.
- **Ecosystem Synergy**: Strengthens the connection between Bifrost and the
  broader Polkadot ecosystem, driving mutual growth.

## Demo Video

[VIDEO PLACEHOLDER - Add demo video link and screenshot here]

## Screenshots

### Project Creation

![image](https://github.com/user-attachments/assets/ba4f5799-57b8-4dc2-bbed-58715619bae5)
![image](https://github.com/user-attachments/assets/a0af01a0-1d55-46cf-b25e-658b4533463c)

### Project Management

![image](https://github.com/user-attachments/assets/72da2baa-55ce-4690-a76d-8193cf7ea25b)


### Project Details View

[IMAGE PLACEHOLDER - Add project details view screenshot here]

## Technical Details

<div align="center">  
    <img src="https://skillicons.dev/icons?i=git,github,vscode,figma,react,nextjs" alt="Tech stack icons"/> <br>
    <img src="https://skillicons.dev/icons?i=tailwind,docker,ts,prisma,postgres,postman" alt="Tech stack icons"/> <br>
</div>

### Core Technologies

- **Git & GitHub**: For version control and collaboration, enabling seamless
  code management and team workflows.
- **VSCode**: A versatile code editor with extensive extensions, used for
  writing, debugging, and deploying code across various projects.
- **Figma**: A collaborative design tool for creating high-fidelity UI/UX
  designs, wireframes, and prototypes for web and mobile applications.
- **React**: A powerful JavaScript library for building dynamic and responsive
  user interfaces in web applications.
- **Next.js**: A React framework that enables server-side rendering and static
  site generation for fast and SEO-friendly web applications.
- **Tailwind CSS**: A utility-first CSS framework for designing modern and
  responsive user interfaces with ease.
- **Docker**: A platform for building, deploying, and managing containerized
  applications, ensuring consistency across environments.
- **TypeScript**: A strongly-typed programming language that builds on
  JavaScript, providing better tooling and maintainability for large-scale
  projects.
- **Prisma**: A modern ORM for Node.js and TypeScript, simplifying database
  management and schema migrations with a type-safe API.
- **PostgreSQL**: A powerful, open-source relational database system known for
  its scalability, extensibility, and support for advanced data types.
- **Postman**: A collaborative API development tool used for testing, debugging,
  and documenting APIs with an intuitive interface.
- **Zustand**: A lightweight state management library for React, providing
  simple yet powerful solutions for managing application state.

### Blockchain & Web3 Technologies

- **Thirdweb**: A powerful Web3 development framework for building and deploying
  blockchain-based apps, enabling seamless interaction with smart contracts.
- **Ethers.js/Wagmi**: Comprehensive libraries for interacting with the Ethereum
  blockchain, used for signing transactions, managing wallets, and querying
  blockchain data.
- **Solidity**: The primary programming language for developing secure and
  efficient Ethereum-based smart contracts.
- **Polkadot**: A scalable multi-chain ecosystem that powers our decentralized
  platform.
- **PolkaVM**: A next-gen virtual machine by Polkadot, enabling fast and secure
  decentralized application deployment.
- **Westend Network**: A testnet for Polkadot, used to validate and optimize the
  application before mainnet deployment.
- **Bifrost**: A DeFi liquid staking protocol providing the vAsset LST
  technology.
- **Foundry**: A smart contract development framework that simplifies testing,
  debugging, and deploying Solidity contracts.

### Frontend Structure

- **Pages**: App router-based page components (`app/page.tsx`,
  `app/project/create/page.tsx`, etc.)
- **Components**: Reusable UI elements organized by functionality
  (`app/components/`)
- **State Management**: Zustand stores for various domains (`app/store/`)
- **API Integration**: Next.js API routes for server-side operations
  (`app/api/`)
- **Utilities**: Helper functions for common operations (`app/utils/`)

### Key Components

- `app/components/UI/`: Core UI components including buttons, modals, and
  effects
- `app/components/project-detail-sections/`: Components for project display
- `app/components/homepage-sections/`: Landing page sections
- `app/components/layout/`: Layout components like Navbar and Footer
- `app/components/pool-specific-rows/`: Components related to launchpool
  functionality

### Backend Integration

- Prisma schema for database modeling (`prisma/schema.prisma`)
- API routes for data operations (`app/api/`)
- Smart contract ABIs for blockchain interaction (`abi/`)
- Configuration files for blockchain networks (`app/config/chains.json`)

### Smart Contract Integration

Defrost smart contracts defined in the `abi/` directory:

- `ProjectHubUpgradeable.json`: Main contract for project registration and
  management
- `Launchpool.json`: Contract for funding pool operations
- `ERC20.json`: Standard ERC20 token interface implementation

Contract interactions use the Wagmi hooks pattern:

```typescript
// Example contract interaction
const {
	writeContract: createProject,
	status: createProjectStatus,
	data: createProjectHash,
} = useWriteContract();
```

[PLACEHOLDER - Add some main contracts information that deploy to WESTEND here]

### How interest accrues in our no-loss launchpool

- Exchange Rate System: Rather than directly distributing tokens, the contract
  maintains cumulativeExchangeRate that increases over time according to
  predefined emission rates.

- Block-Based Emission: The contract defines emission rates that change at
  specified blocks through emissionRateChanges and changeBlocks.

- Proportional Distribution: Project tokens are distributed proportionally to
  users based on their staked native amount and the change in the cumulative
  exchange rate since their last interaction.

1. Emission Rate Determination: The contract determines the current emission
   rate based on the block number
2. Pending Exchange Rate Calculation: When \_tick() is called, the contract
   calculates additional exchange rate accrued
3. Interest Accrual: Every time a user stakes, unstakes, or claims tokens, the
   \_tick() function updates cumulativeExchangeRate
4. Claimable Interest Calculation: A user's claimable project tokens are
   calculated using the same mechanic just not saving to state so this is
   essentially causing no gas, maintaining a smooth frontend flow while still
   get the accurate state of the contract without interacting with it
5. Claim Offset Update: After claiming or when staking/unstaking, the offset is
   updated

## Features

### Project Management & Showcase

- **Multi-step Project Creation Flow**: Intuitive interface guiding creators
  through comprehensive project setup process
- **Project Gallery**: Browse and discover innovative blockchain projects across
  multiple networks
- **Detailed Project Profiles**: Showcase projects with rich media,
  descriptions, and technical details
- **Media Management**: Upload and manage up to 3 project images and custom logo
  with intuitive interface
- **Project Editing**: Complete tools for project owners to update existing
  project information

### Blockchain & Web3 Integration

- **Multi-Network Support**: Choose from various blockchain networks including
  Polkadot ecosystem networks
- **Wallet Integration**: Secure connection with Web3 wallets for transaction
  signing and authentication
- **On-Chain Project Registration**: Immutable project records stored on
  blockchain for transparency
- **Transaction Monitoring**: Real-time tracking of blockchain transactions with
  status updates

### Launchpool Functionality

- **No-Loss Launchpools**: Create funding pools leveraging Bifrost vAsset LST
  technology
- **Dynamic Emission Rates**: Configurable token emission schedules for fair
  token distribution
- **Staking Interface**: Intuitive staking and unstaking functionality for
  launchpool participants
- **Analytics Dashboard**: Visual representation of launchpool performance with
  charts

### User Experience

- **Responsive Design**: Full support for mobile and desktop interfaces with
  adaptive layouts
- **Interactive UI Elements**: Modern interface with animations, modals, and
  dynamic components
- **Social Media Integration**: Connect projects to various platforms (Twitter,
  Discord, Telegram, etc.)
- **Real-time Notifications**: Toast notifications for user actions and
  transaction status updates

## Contributing

### Team Core 🎮
