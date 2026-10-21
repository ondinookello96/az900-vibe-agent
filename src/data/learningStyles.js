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

  'cost-management': {
    title: 'Cost Management & Governance (Policy, Locks, Calculator)',
    visual: {
      diagramType: 'Guardrails & Budget Gauges',
      summary: 'Azure Policy enforces rules; Resource Locks prevent accidental deletion; Budgets send alerts.',
      elements: [
        { label: 'CanNotDelete Lock', effect: 'Authorized users can read and modify, but CANNOT delete the resource' },
        { label: 'ReadOnly Lock', effect: 'Authorized users can ONLY read the resource, no updates or deletes' },
        { label: 'Azure Policy', effect: 'Enforces organizational standards (e.g. only allow VMs in South Africa North)' },
        { label: 'Pricing Calculator', effect: 'Estimates projected costs BEFORE deploying resources to Azure' }
      ],
      tip: 'Resource Locks override RBAC! Even a Subscription Owner cannot delete a resource locked with CanNotDelete until the lock is removed.'
    },
    auditory: {
      analogyTitle: 'Speed Governors and Padlocks Analogy',
      story: `• Azure Policy: Like the government installing mandatory speed governors on all commercial vehicles. Even if a driver wants to exceed 80 km/h, the engine physically prevents it. Azure Policy prevents anyone from creating unapproved expensive VMs or spinning up resources outside compliant African regions.
• Resource Locks: Like putting a physical brass padlock on your water meter or electric transformer. It stops someone from accidentally cutting the power while doing garden work.
• Pricing Calculator vs TCO: Pricing Calculator estimates your monthly Azure bill. TCO (Total Cost of Ownership) Calculator compares on-premise hardware/power/staff costs against moving to the cloud.`,
      voicePrompt: 'Remember: Pricing Calculator is for Azure cloud estimates; TCO is for comparing On-Premise vs Cloud migration savings!'
    },
    kinesthetic: {
      labTitle: 'Locking a Production Database',
      actionPrompt: 'Create a CanNotDelete lock on a critical resource group:',
      cliCommand: 'az lock create --name "PreventAccidentalDrop" --lock-type CanNotDelete --resource-group "ProdDataRG"',
      stepGuide: [
        '1. Apply lock: `CanNotDelete`.',
        '2. Attempt to delete a test table: Notice the operation fails with access denied by management lock.',
        '3. To modify, remove the lock temporarily, execute maintenance, and re-apply.'
      ]
    },
    reading: {
      mnemonics: 'P.L.T: Policy (compliance guardrails) | Locks (prevent deletion) | Tags (cost allocation & metadata)',
      cheatSheet: [
        '• Azure Pricing Calculator: Estimate anticipated costs for new deployments.',
        '• Total Cost of Ownership (TCO) Calculator: Compare current on-prem data center costs with Azure.',
        '• Azure Policy: Evaluates resources for non-compliance and enforces business rules (audit, deny, modify).',
        '• Resource Locks: CanNotDelete (modify ok, delete blocked) and ReadOnly (modify & delete blocked).',
        '• Tags: Key-value pairs applied to resources to track cost centers and department ownership.'
      ]
    }
  }
};
