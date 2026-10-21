// Learning Styles Framework & Strategy Recommendations (VARK Model)

export const LEARNING_STYLES = {
  visual: {
    id: 'visual',
    name: 'Visual Explorer',
    icon: 'Eye',
    tagline: 'Learns best through diagrams, visual hierarchies & architecture maps',
    color: '#38bdf8', // sky blue
    description: 'You understand cloud architecture best when you can see the topology, boundaries, and relationship flows between services.',
    studyMethod: 'Draw architecture diagrams, inspect resource hierarchy trees, and use color-coded comparison matrices.'
  },
  auditory: {
    id: 'auditory',
    name: 'Auditory & Storyteller',
    icon: 'Headphones',
    tagline: 'Learns best through conversational dialogue & African analogies',
    color: '#f59e0b', // amber
    description: 'You grasp abstract concepts through storytelling, real-world African analogies (like M-Pesa kiosks, grain silos, and local governance), and conversational discussions.',
    studyMethod: 'Listen to explanations, explain concepts out loud to someone else (Feynman technique), and connect Azure services to everyday community models.'
  },
  kinesthetic: {
    id: 'kinesthetic',
    name: 'Kinesthetic Builder',
    icon: 'Terminal',
    tagline: 'Learns best by doing: CLI commands, portal simulators & mini-labs',
    color: '#10b981', // emerald
    description: 'You retain information when your hands are on the keyboard: testing CLI syntax, exploring portal click paths, and deploying simulated resources.',
    studyMethod: 'Run interactive sandbox commands, follow step-by-step portal walkthroughs, and troubleshoot real-life broken cloud scenarios.'
  },
  reading: {
    id: 'reading',
    name: 'Reading & Synthesis',
    icon: 'BookOpen',
    tagline: 'Learns best with high-yield cheat sheets, tables & mnemonics',
    color: '#ec4899', // pink
    description: 'You excel by analyzing structured comparison tables, bullet-point summaries, acronyms, and flashcards.',
    studyMethod: 'Review high-yield summary matrices (e.g. CapEx vs OpEx, Blob vs Files, Entra ID vs RBAC), quiz with flashcards, and write structured summary notes.'
  }
};

// Rich, multi-modal revision strategies for every AZ-900 subtopic
export const REVISION_CONTENT_BY_TOPIC = {
  'cloud-benefits': {
    title: 'Cloud Benefits & Shared Responsibility',
    visual: {
      diagramType: 'Responsibility Matrix',
      summary: 'Visual division of responsibility across On-Premises, IaaS, PaaS, and SaaS.',
      elements: [
        { label: 'SaaS', customer: 'Data & Access only', cloud: 'Everything else (Apps, OS, Hardware)' },
        { label: 'PaaS', customer: 'Data, Access, Applications', cloud: 'OS, Runtime, Networking, Hardware' },
        { label: 'IaaS', customer: 'Data, Access, Apps, OS, Network Config', cloud: 'Physical Datacenter, Power, Host' },
        { label: 'On-Premises', customer: '100% of the entire stack', cloud: 'None' }
      ],
      tip: 'Remember: In ALL cloud models, YOU (the customer) always own your Data and Identity access management!'
    },
    auditory: {
      analogyTitle: 'The Nairobi Rental Car vs Matatu Analogy',
      story: `Imagine you need transportation in Nairobi:
• On-Premises: You buy your own car, pay for fuel, change oil, replace flat tires, and build a garage.
• IaaS (Car Rental): You rent a car. You still steer the wheel, choose the route, and buy fuel, but the agency maintains the engine and chassis.
• PaaS (Ride-hail / Uber): You tell the driver where to go and sit in the backseat with your laptop. You don't care about transmission or tire pressure.
• SaaS (Boarding an Express Matatu): You just buy a ticket, step inside, and ride. The vehicle, driver, route, and maintenance are completely handled for you.`,
      voicePrompt: 'Audio recap: IaaS gives infrastructure control, PaaS runs your code without server hassle, SaaS gives ready-to-use software.'
    },
    kinesthetic: {
      labTitle: 'Interactive Shared Responsibility Test',
      actionPrompt: 'Sort responsibility: Who updates the Operating System patch in Azure Virtual Machines vs Azure App Service?',
      cliCommand: 'az vm auto-upgrade enable --resource-group MyRG --name MyVM',
      stepGuide: [
        '1. In Azure VMs (IaaS), you as the admin must trigger OS updates.',
        '2. In Azure App Service (PaaS), Microsoft handles OS patches automatically without downtime.',
        '3. Try thinking of your current workload: Is your team spending time patching servers? If yes, you are in IaaS.'
      ]
    },
    reading: {
      mnemonics: 'S.H.E.A.D: Scalability, High Availability, Elasticity, Agility, Disaster Recovery',
      cheatSheet: [
        '• Scalability: Ability to handle increased workload by adding resources (Vertical = Bigger VM, Horizontal = More VMs).',
        '• Elasticity: Dynamic automatic scaling up and DOWN based on real-time traffic spikes.',
        '• High Availability: System remains accessible with minimal downtime (99.9% - 99.99% SLA).',
        '• Disaster Recovery: Ability to restore functionality after catastrophic region failure (Geo-redundancy).'
      ]
    }
  },

  'service-models': {
    title: 'Cloud Service Models: IaaS vs PaaS vs SaaS',
    visual: {
      diagramType: 'Control vs Convenience Spectrum',
      summary: 'IaaS (Maximum Control) -> PaaS (Balanced Productivity) -> SaaS (Zero Maintenance)',
      elements: [
        { label: 'IaaS', scope: 'Virtual Machines, Virtual Networks, Disks', customer: 'OS, Middleware, Code, Data' },
        { label: 'PaaS', scope: 'Azure App Service, Azure SQL, Azure Functions', customer: 'Code and Data only' },
        { label: 'SaaS', scope: 'Microsoft 365, Dynamics 365', customer: 'User access and Data input' }
      ],
      tip: 'The higher you go (IaaS -> SaaS), the more Microsoft manages for you, reducing your operational burden.'
    },
    auditory: {
      analogyTitle: 'Building a Farm Granary vs Renting Grain Space',
      story: `• IaaS: You lease empty agricultural land. You build your own wooden grain silo, buy padlocks, and hire a watchman. You have total freedom over dimensions, but all repairs fall on you.
• PaaS: You deliver your harvest to a cooperative grain silo. They provide temperature control, security, and electricity. You only focus on weighing and selling your maize.
• SaaS: You buy pre-packaged, milled maize flour at the local supermarket. You never see the farm, the miller, or the trucks.`,
      voicePrompt: 'Listen carefully: When an exam question mentions configuring custom OS drivers or legacy software dependencies, the answer is always IaaS!'
    },
    kinesthetic: {
      labTitle: 'Deploying Azure App Service (PaaS) in 1 Command',
      actionPrompt: 'Notice how PaaS deploys code without creating a virtual machine or configuring Linux kernel:',
      cliCommand: 'az webapp up --name MyAfriCloudApp --runtime "NODE:20-lts"',
      stepGuide: [
        '1. Run `az webapp up` with your code.',
        '2. Microsoft provisions the server, configures the HTTPS certificate, and sets up routing.',
        '3. Zero OS patching required from your side!'
      ]
    },
    reading: {
      mnemonics: 'I.P.S: Infrastructure (rent bare metal/VM), Platform (run code), Software (consume ready app)',
      cheatSheet: [
        '• IaaS: Azure Virtual Machines, Virtual Network, Azure Disks. Customer controls OS.',
        '• PaaS: Azure App Service, Azure SQL Database, Azure Functions. Microsoft controls OS and runtime.',
        '• SaaS: Microsoft 365, OneDrive, Teams. Customer only manages data and user credentials.',
        '• Serverless: A category of PaaS where billing is 100% execution-based (zero idle cost).'
      ]
    }
  },

  'cloud-types': {
    title: 'Cloud Deployment Types & CapEx vs OpEx Economics',
    visual: {
      diagramType: 'Deployment Venn Diagram',
      summary: 'Public Cloud (Shared hardware) | Private Cloud (Dedicated single-tenant) | Hybrid (Connected both)',
      elements: [
        { label: 'Public Cloud', scope: 'Multiple organizations share provider hardware securely over internet' },
        { label: 'Private Cloud', scope: 'Single organization owns or exclusively leases infrastructure' },
        { label: 'Hybrid Cloud', scope: 'Connects on-premises/private datacenter to public cloud via VPN/ExpressRoute' },
        { label: 'Multi-Cloud', scope: 'Using services across multiple public providers (Azure + AWS + GCP)' }
      ],
      tip: 'Financial rule: CapEx = Upfront capital expense with depreciation. OpEx = Pay-as-you-go operational expense deductible immediately.'
    },
    auditory: {
      analogyTitle: 'Drilling a Borehole vs Tap Water Consumption',
      story: `• CapEx (Private Datacenter): Like spending $10,000 upfront to survey land, drill a 200-meter water borehole, and buy massive backup diesel pumps. Huge upfront investment whether you drink 1 glass or 1,000 liters.
• OpEx (Public Cloud): Like connecting to the municipal water meter. Zero upfront drilling cost; you simply pay a small bill at the end of the month based on exact liters consumed.
• Hybrid Cloud: You keep your private borehole for emergency farm irrigation, but connect your home to the municipal tap for daily cooking.`,
      voicePrompt: 'Exam key: Consumption-based pricing means zero upfront costs, pay only for what you use, and deallocate to stop billing.'
    },
    kinesthetic: {
      labTitle: 'Checking Azure Pricing & Consumption Metering',
      actionPrompt: 'Calculate the cost difference between running a VM 24/7 vs auto-stopping it at night:',
      cliCommand: 'az vm deallocate --resource-group ProdRG --name ComputeWorker01',
      stepGuide: [
        '1. When a VM is "Stopped (Deallocated)", compute billing drops to $0.00/hr.',
        '2. Only storage disk fees persist.',
        '3. This is the definition of the OpEx consumption model!'
      ]
    },
    reading: {
      mnemonics: 'C.O.P.H: CapEx (Upfront buy), OpEx (Pay as you go), Private (Dedicated), Hybrid (Bridge)',
      cheatSheet: [
        '• Capital Expenditure (CapEx): Upfront money spent on physical infrastructure, servers, cooling, and real estate.',
        '• Operational Expenditure (OpEx): Ongoing costs for services or products with zero upfront hardware costs.',
        '• Public Cloud: No capital expenditure to scale up; high reliability with zero hardware maintenance.',
        '• Hybrid Cloud: Provides greatest flexibility for legacy data compliance and cloud modernization.'
      ]
    }
  },

  'core-components': {
    title: 'Core Architectural Components (Regions & Zones)',
    visual: {
      diagramType: 'Hierarchy Pyramid',
      summary: 'Management Groups -> Subscriptions -> Resource Groups -> Resources',
      elements: [
        { label: 'Management Groups', scope: 'Organize multiple subscriptions & enforce compliance at scale' },
        { label: 'Subscriptions', scope: 'Billing boundary and access control limit' },
        { label: 'Resource Groups', scope: 'Logical container for resources with same lifecycle' },
        { label: 'Resources', scope: 'Individual services (VM, VNet, Storage Account, SQL DB)' }
      ],
      tip: 'Visual rule: Resources in one Resource Group can reside in DIFFERENT regions! A Resource Group is just metadata.'
    },
    auditory: {
      analogyTitle: 'M-Pesa Agents & The Homestead (Boma) Analogy',
      story: `• Availability Zones: Think of M-Pesa agents in a busy market town. If Agent 1's phone battery dies or kiosk loses power, Agent 2 on the next block has independent power, cooling, and internet. That is an Availability Zone—physically separate datacenters within the same region!
• Region Pairs: South Africa North (Johannesburg) paired with South Africa West (Cape Town) at least 300 miles apart to protect against regional disasters like grid blackouts.
• Resource Groups: Like a family homestead (Boma). All items belonging to a single project live together; if you dismantle the boma, all resources inside are cleared together.`,
      voicePrompt: 'Listen to the rule: An Availability Zone is one or more physical datacenters with independent power, cooling, and networking!'
    },
    kinesthetic: {
      labTitle: 'Simulate Azure CLI Resource Group & Hierarchy',
      actionPrompt: 'Type the command to create a resource group in South Africa North:',
      cliCommand: 'az group create --name MyAfriCloudRG --location southafricanorth',
      stepGuide: [
        '1. Run `az account list --output table` to view active subscriptions.',
        '2. Run `az group create --name 1MDevsRG --location southafricanorth`.',
        '3. Notice how fast the logical boundary is established without billing charge.'
      ]
    },
    reading: {
      mnemonics: 'R.A.D: Region (geography) -> Availability Zone (datacenter with power/cooling) -> Datacenter (racks)',
      cheatSheet: [
        '• Azure Region: A geographical area with at least one datacenter connected via low-latency network.',
        '• Availability Zone (AZ): Unique physical locations within an Azure region. Minimum 3 separate zones per enabled region.',
        '• Region Pairs: Two regions within same geography at least 300 miles apart. One updated at a time during maintenance.',
        '• Sovereign Regions: US DoD, Azure Government, Azure China 21Vianet for strict regulatory isolation.'
      ]
    }
  },

  'compute-services': {
    title: 'Azure Compute & Containers (VMs, ACI, Functions)',
    visual: {
      diagramType: 'Compute Spectrum Tree',
      summary: 'Virtual Machines (Full OS) -> Containers (Microservices) -> Serverless (Pure Code)',
      elements: [
        { label: 'Azure VMs', scope: 'IaaS full virtual machines (Linux/Windows) with dedicated OS' },
        { label: 'Virtual Machine Scale Sets (VMSS)', scope: 'Manage and scale a pool of identical VMs automatically' },
        { label: 'Azure Container Instances (ACI)', scope: 'Fastest way to run a Docker container without managing clusters' },
        { label: 'Azure Kubernetes Service (AKS)', scope: 'Enterprise container orchestration for complex microservices' },
        { label: 'Azure Functions', scope: 'Event-driven serverless code execution billed strictly per millisecond' }
      ],
      tip: 'Virtual Desktop: Azure Virtual Desktop (AVD) delivers cloud-hosted Windows desktops to remote workers on any device.'
    },
    auditory: {
      analogyTitle: 'The Full-Time Driver vs Rideshare vs Courier Dispatch',
      story: `• Virtual Machines (VMs): Hiring a permanent full-time driver with a car on monthly salary. You pay whether the car is parked or driving, and you maintain the seats and tires.
• Containers (ACI/Docker): Packing your tools in a portable metal briefcase. You can hop into any commercial van in Nairobi, Lagos, or Johannesburg and your tools work identically.
• Azure Functions (Serverless): A motorcycle courier on call. You don't own the motorbike or pay a monthly retainer; you dial when a parcel arrives, they deliver in 10 minutes, you pay $1, and they vanish!`,
      voicePrompt: 'Audio tip: Azure Functions run on triggers (HTTP request, queue message, timer) with zero server management.'
    },
    kinesthetic: {
      labTitle: 'Deploy a Serverless Azure Function',
      actionPrompt: 'Simulate creating an event-driven function app:',
      cliCommand: 'az functionapp create --resource-group 1MRG --consumption-plan-location southafricanorth --runtime node --functions-version 4 --name AfriFunction',
      stepGuide: [
        '1. Notice `--consumption-plan-location`: you pay zero dollars when no events trigger.',
        '2. Scalability scales from 0 to 1,000 instances automatically during traffic spikes.'
      ]
    },
    reading: {
      mnemonics: 'V.C.S: VMs (Virtual machines), Containers (Docker/AKS), Serverless (Event-driven Functions)',
      cheatSheet: [
        '• Azure Virtual Machines: IaaS compute for legacy apps or full OS control.',
        '• Scale Sets: Automatically increase or decrease VM instances based on demand.',
        '• ACI: Run container without managing virtual machines or Kubernetes.',
        '• AKS: Orchestrates thousands of containerized services at enterprise scale.',
        '• Azure Functions: Event-driven serverless code that scales automatically.'
      ]
    }
  },

  'storage-services': {
    title: 'Azure Storage & Tiers (Blob, Files, Disk)',
    visual: {
      diagramType: 'Storage Temperature Gradient',
      summary: 'Hot (High access, low cost/access) -> Cool (30 days) -> Cold (90 days) -> Archive (180 days, hours retrieval)',
      elements: [
        { label: 'Hot Tier', access: 'Frequent reading/writing', cost: 'Highest storage cost, Lowest transaction fee' },
        { label: 'Cool Tier', access: 'Infrequent (min 30 days)', cost: 'Lower storage cost, Higher transaction fee' },
        { label: 'Cold Tier', access: 'Rarely accessed (min 90 days)', cost: 'Very low storage cost, Moderate retrieval cost' },
        { label: 'Archive Tier', access: 'Long-term backup (min 180 days)', cost: 'Lowest storage cost, Highest retrieval latency (hours)' }
      ],
      tip: 'Archive tier must be "rehydrated" before data can be read! You cannot read archived blobs immediately.'
    },
    auditory: {
      analogyTitle: 'The Village Granary & Harvest Analogy',
      story: `Think of maize and grain storage after a harvest:
• Hot Tier: The bowl of maize flour on your kitchen counter for tonight's dinner—accessed every single hour.
• Cool Tier: The reserve sack kept in your storeroom—accessed once or twice a month when guests arrive.
• Archive Tier: The village granary sealed underground for emergency drought reserves. It is very cheap to store for years, but if you need it, you must send for the elders, break the seal, and wait hours for rehydration!`,
      voicePrompt: 'Audio reminder: Azure Files supports SMB and NFS for network file shares, while Azure Blob is optimized for massive unstructured objects!'
    },
    kinesthetic: {
      labTitle: 'CLI Storage Tier Migration',
      actionPrompt: 'Change a blob storage tier to Cool using AzCopy or CLI:',
      cliCommand: 'az storage blob set-tier --account-name myexamstorage --container-name docs --name report.pdf --tier Cool',
      stepGuide: [
        '1. Identify unstructured video/audio/log data -> Use Azure Blob Storage.',
        '2. Need legacy file share mounted across Linux & Windows -> Use Azure Files (SMB).',
        '3. Need virtual hard drive for VM OS -> Use Azure Managed Disks.'
      ]
    },
    reading: {
      mnemonics: 'B.F.D: Blob (unstructured objects) | Files (shared SMB/NFS drive) | Disks (VM block storage)',
      cheatSheet: [
        '• Blob Storage: Unstructured text and binary data (images, videos, backups, logs).',
        '• Azure Files: Fully managed cloud file shares accessible via SMB 3.0 / NFS. Mounts like a network drive.',
        '• Azure Queue Storage: Store millions of messages between decoupled app components.',
        '• AzCopy: Command-line utility to copy blobs or files to/from storage accounts.',
        '• Azure Storage Explorer: GUI desktop app to manage cloud storage data visually.'
      ]
    }
  },

  'networking-services': {
    title: 'Azure Networking & Hybrid Connectivity',
    visual: {
      diagramType: 'Network Topology Map',
      summary: 'Virtual Network (Isolation) -> Subnets (Segmentation) -> VPN Gateway (Public Encrypted) -> ExpressRoute (Private Dedicated)',
      elements: [
        { label: 'Azure Virtual Network (VNet)', scope: 'Isolated private IP network boundary in Azure' },
        { label: 'Subnets', scope: 'Subdivide VNet into logical IP ranges (e.g. Frontend vs Backend)' },
        { label: 'VPN Gateway', scope: 'Encrypted tunnel over public internet (up to 10 Gbps)' },
        { label: 'Azure ExpressRoute', scope: 'Private dedicated fiber connection bypassing public internet (up to 100 Gbps)' },
        { label: 'VNet Peering', scope: 'Direct low-latency connection between two Azure VNets using Microsoft backbone' }
      ],
      tip: 'ExpressRoute does NOT travel over the public internet! It offers the highest reliability, throughput, and predictable SLAs.'
    },
    auditory: {
      analogyTitle: 'Bullion Escort on Highway vs Private Express Train',
      story: `• Azure VPN Gateway: Traveling from Lagos to Abuja in an armored bullion vehicle over the public national highway. It is securely encrypted, but you still share the asphalt with civilian traffic, potholes, and unexpected delays.
• Azure ExpressRoute: The government builds a private, dedicated high-speed SGR railway line connecting your warehouse directly to the central bank. Zero public traffic, speeds up to 100 Gbps, and guaranteed arrival times!
• VNet Peering: Cutting an internal security door between two adjacent office suites in the same building.`,
      voicePrompt: 'Listen to the rule: When an exam question specifies connecting on-premises to Azure without touching public internet, the answer is ExpressRoute!'
    },
    kinesthetic: {
      labTitle: 'Peer Two Virtual Networks in CLI',
      actionPrompt: 'Connect two virtual networks across Azure:',
      cliCommand: 'az network vnet peering create --name EastToWest --resource-group NetRG --vnet-name VNetEast --remote-vnet VNetWest --allow-vnet-access',
      stepGuide: [
        '1. Virtual Network Peering links VNets seamlessly.',
        '2. Traffic stays on Microsoft private global fiber backbone.',
        '3. Zero gateway transit latency.'
      ]
    },
    reading: {
      mnemonics: 'V.P.E: Virtual Network (Private cloud network) | Peering (Link VNets) | ExpressRoute (No internet)',
      cheatSheet: [
        '• Virtual Network (VNet): Fundamental building block for private network in Azure.',
        '• Subnets: Segment VNet into one or more sub-networks for security tiers.',
        '• VPN Gateway: Sends encrypted traffic across public internet between on-prem and Azure.',
        '• ExpressRoute: Direct private connection to Microsoft cloud via connectivity provider.',
        '• Azure DNS: Ultra-fast domain name hosting using Azure global infrastructure.'
      ]
    }
  },

  'identity-access': {
    title: 'Identity, Access & Security (Entra ID vs RBAC)',
    visual: {
      diagramType: 'Security Perimeter Shield',
      summary: 'Authentication (Who are you?) vs Authorization (What can you do?)',
      elements: [
        { label: 'Microsoft Entra ID', purpose: 'Identity Provider (Users, Groups, MFA, SSO, Conditional Access)' },
        { label: 'Azure RBAC', purpose: 'Permission Grant (Owner, Contributor, Reader, Custom Roles)' },
        { label: 'Role Assignment', formula: 'Security Principal + Role Definition + Scope (Management Group, Sub, RG, Resource)' }
      ],
      tip: 'RBAC permissions are INHERITED down the hierarchy! A Reader on a Subscription has Reader on all its Resource Groups.'
    },
    auditory: {
      analogyTitle: 'The Airport Passport & Boarding Pass Analogy',
      story: `• Authentication (AuthN - Entra ID): Proving who you are. This is showing your national passport or ID card and biometric fingerprint at the airport gate.
• Authorization (AuthZ - RBAC): Determining what you are allowed to enter. Even if your passport is valid, your boarding pass only permits you to sit in Economy Seat 14B, not in the pilot cockpit!
• Conditional Access: An alert security guard at the gate who says: "If you are flying from an unknown phone, or logging in at 3 AM from an unexpected country, you MUST provide an extra SMS OTP or Microsoft Authenticator prompt!"`,
      voicePrompt: 'Key exam rule: Authentication identifies the person (AuthN), Authorization determines their permissions (AuthZ).'
    },
    kinesthetic: {
      labTitle: 'Assigning a Contributor Role',
      actionPrompt: 'Examine how to grant least privilege using Azure CLI:',
      cliCommand: 'az role assignment create --assignee dev@africloud.org --role "Reader" --resource-group "1MDevsRG"',
      stepGuide: [
        '1. Owner: Can manage everything, including granting permissions to others.',
        '2. Contributor: Can create and manage all resources, but CANNOT grant access to others.',
        '3. Reader: Can only view existing resources, zero modifications.'
      ]
    },
    reading: {
      mnemonics: 'C.I.A + Z.T: Confidentiality, Integrity, Availability + Zero Trust (Verify explicitly, Least privilege, Assume breach)',
      cheatSheet: [
        '• Microsoft Entra ID: Cloud identity and access management service (SSO, MFA, B2B, B2C).',
        '• Conditional Access: If-Then statements based on user, location, device health, and application risk.',
        '• Defense in Depth: Physical -> Identity -> Perimeter -> Network -> Compute -> Application -> Data.',
        '• Azure RBAC built-in roles: Owner (Full + grant), Contributor (Full - grant), Reader (View only).'
      ]
    }
  },

  'governance-compliance': {
    title: 'Governance & Compliance: Azure Policy & Locks',
    visual: {
      diagramType: 'Guardrail Enforcement Pyramid',
      summary: 'Azure Policy (Enforce rules) -> Resource Locks (Prevent accidents) -> Azure Blueprints',
      elements: [
        { label: 'Azure Policy', scope: 'Enforces standards and assesses compliance across resources at scale' },
        { label: 'CanNotDelete Lock', scope: 'Users can read and modify, but CANNOT delete' },
        { label: 'ReadOnly Lock', scope: 'Users can ONLY view; cannot modify or delete' },
        { label: 'Tags', scope: 'Key-value pairs to organize resources for billing and cost allocation' }
      ],
      tip: 'Locks override RBAC roles! An Owner of a subscription cannot delete a resource with CanNotDelete lock until the lock is removed.'
    },
    auditory: {
      analogyTitle: 'Traffic Speed Governors and Heavy Brass Padlocks',
      story: `• Azure Policy: Like mandatory speed governors installed on all regional buses in Kenya or Nigeria. Even if a driver steps hard on the pedal, the bus will physically refuse to exceed 80 km/h. Azure Policy ensures developers can NEVER deploy VMs outside South Africa North, or spin up unapproved multi-thousand-dollar GPU instances.
• Resource Locks: Like putting a physical brass padlock on your electrical substation meter. Nobody can cut the power during routine garden cleaning.
• Azure Tags: Attaching color-coded livestock ear-tags to your herd so you immediately know which cow belongs to which department.`,
      voicePrompt: 'Remember: Azure Policy evaluates resources for non-compliance and enforces rules like allowed locations!'
    },
    kinesthetic: {
      labTitle: 'Apply CanNotDelete Lock via CLI',
      actionPrompt: 'Lock a production database against accidental deletion:',
      cliCommand: 'az lock create --name "NoAccidentalDrop" --lock-type CanNotDelete --resource-group "ProdDataRG"',
      stepGuide: [
        '1. Apply `CanNotDelete` lock to the Resource Group.',
        '2. Even subscription Owners are blocked from deletion.',
        '3. Try in portal: Lock tab under Settings.'
      ]
    },
    reading: {
      mnemonics: 'P.L.T: Policy (Rules/Compliance), Locks (Block deletion), Tags (Metadata/Cost center)',
      cheatSheet: [
        '• Azure Policy: Creates, assigns, and manages policy definitions (e.g. allowed VM SKUs, allowed locations).',
        '• CanNotDelete: Allows updates but blocks deletion.',
        '• ReadOnly: Blocks both updates and deletion.',
        '• Tags: Do NOT inherit to child resources automatically; used for cost centers.'
      ]
    }
  },

  'cost-management': {
    title: 'Cost Management & TCO Calculator',
    visual: {
      diagramType: 'Guardrails & Budget Gauges',
      summary: 'Azure Policy enforces rules; Resource Locks prevent accidental deletion; Budgets send alerts.',
      elements: [
        { label: 'CanNotDelete Lock', effect: 'Authorized users can read and modify, but CANNOT delete the resource' },
        { label: 'ReadOnly Lock', effect: 'Authorized users can ONLY read the resource, no updates or deletes' },
        { label: 'Azure Policy', effect: 'Enforces organizational standards (e.g. only allow VMs in South Africa North)' },
        { label: 'Pricing Calculator', effect: 'Estimates projected costs BEFORE deploying resources to Azure' }
      ],
      tip: 'Pricing Calculator estimates future Azure costs; TCO Calculator compares on-prem hardware against cloud migration savings.'
    },
    auditory: {
      analogyTitle: 'Shopping Cart Estimator vs Rent-or-Buy Calculator',
      story: `• Pricing Calculator: Like walking into a supermarket with an online calculator. You tally up 2 bags of rice, 3 litres of cooking oil, and estimate your grocery bill before going to the cashier.
• TCO (Total Cost of Ownership) Calculator: Deciding whether to buy a plot of land and build a commercial bakery from scratch (paying for industrial ovens, electricity transformers, security, and cleaning staff) versus leasing an operational commercial kitchen.`,
      voicePrompt: 'Key exam rule: Pricing Calculator = Azure cloud estimate. TCO Calculator = On-Premise vs Cloud comparison.'
    },
    kinesthetic: {
      labTitle: 'Set an Azure Budget Alert in CLI',
      actionPrompt: 'Configure cost alert at 80% of $500 monthly threshold:',
      cliCommand: 'az consumption budget create --amount 500 --budget-name MonthlyCap --time-grain monthly --resource-group CostRG',
      stepGuide: [
        '1. Create a monthly spending budget.',
        '2. Set automated email alert at 80% threshold.',
        '3. Automatically triggers action groups.'
      ]
    },
    reading: {
      mnemonics: 'P.C vs T.C.O: Pricing Calculator (Cloud costs), TCO (On-prem vs Cloud savings)',
      cheatSheet: [
        '• Pricing Calculator: Configure and estimate costs for Azure products.',
        '• TCO Calculator: Compare costs for current datacenter against Azure.',
        '• Cost Management: Monitor cloud spend, set budgets, and recommendations.',
        '• Spending Limit: Free credit accounts have default $0 spending limits to prevent surprise charges.'
      ]
    }
  }
};
