// High-Yield Authentic Practice Questions for AZ-900 Microsoft Azure Fundamentals
// Designed for the #1MillionDevs Movement: 100% original, pedagogical, with deep distractor explanations.

export const PRACTICE_QUESTIONS = [
  // DOMAIN 1: CLOUD CONCEPTS
  {
    id: 'q-cc-01',
    domainId: 'cloud-concepts',
    subtopic: 'cloud-benefits',
    difficulty: 'beginner',
    question: 'A mobile fintech startup in Lagos is experiencing sudden traffic spikes whenever national payroll is processed on the 28th of every month. Which cloud computing characteristic allows their compute infrastructure to dynamically increase resources during peak hours and automatically shrink when traffic subsides?',
    options: [
      'Agility',
      'Elasticity',
      'High Availability',
      'Geo-distribution'
    ],
    correctIndex: 1,
    explanation: {
      whyCorrect: 'Elasticity is the capability of a cloud system to dynamically provision and de-provision computing resources automatically in real time as workload demands fluctuate. This prevents overpaying during idle periods while maintaining responsiveness during payroll surges.',
      distractors: {
        0: 'Agility refers to the speed at which a development team can develop, test, and launch new software features or infrastructure, not the automatic scaling of compute nodes.',
        2: 'High Availability ensures the system remains accessible and operational with minimal downtime, usually measured in uptime percentages (e.g., 99.99%), rather than scaling capacity.',
        3: 'Geo-distribution means deploying services across different geographical regions worldwide to bring data closer to users and withstand regional outages.'
      }
    },
    learningStyleTip: {
      visual: 'Visualize an elastic rubber band expanding when stretched by traffic and contracting to normal size.',
      auditory: 'Remember: Scalability is the capacity to grow; Elasticity is the ability to stretch AND snap back down automatically like mobile airtime credit.',
      kinesthetic: 'In Azure, set up an "Autoscale rule" on Azure Virtual Machine Scale Sets (VMSS) based on CPU percentage threshold > 75%.',
      reading: 'Scale Up = Vertical (bigger CPU/RAM). Scale Out = Horizontal (more VM instances). Elasticity = Automatic horizontal scaling.'
    }
  },
  {
    id: 'q-cc-02',
    domainId: 'cloud-concepts',
    subtopic: 'service-models',
    difficulty: 'intermediate',
    question: 'An enterprise wants to migrate a legacy accounting application to Microsoft Azure. The organization requires full operating system administrative access to configure custom kernel drivers, but wants Microsoft to manage the physical datacenter hardware, power, and physical network switches. Which cloud service model should they select?',
    options: [
      'Software as a Service (SaaS)',
      'Platform as a Service (PaaS)',
      'Infrastructure as a Service (IaaS)',
      'Function as a Service (Serverless)'
    ],
    correctIndex: 2,
    explanation: {
      whyCorrect: 'Infrastructure as a Service (IaaS) provides virtualized computing resources over the internet. The cloud provider manages physical hardware, power, and physical datacenter security, while the customer retains control over the operating system, middleware, runtime, and installed software.',
      distractors: {
        0: 'In SaaS (e.g., Microsoft 365), the vendor manages the entire stack including the application. The customer has zero OS access.',
        1: 'In PaaS (e.g., Azure App Service), Microsoft manages the underlying OS, patches, and runtime environment. You cannot configure custom OS kernel drivers.',
        3: 'Serverless/FaaS (e.g., Azure Functions) abstracts away all server infrastructure entirely; code only runs on event triggers without any OS-level access.'
      }
    },
    learningStyleTip: {
      visual: 'Picture the Shared Responsibility chart: In IaaS, the line dividing Customer vs Microsoft sits right between the Virtualization hypervisor and the Operating System.',
      auditory: 'Think of IaaS as renting a furnished apartment where you can paint the walls and install locks, while SaaS is booking a hotel room where you just sleep.',
      kinesthetic: 'Run `az vm create` in Azure CLI: you choose the `--image Ubuntu2204` and SSH directly into the OS prompt.',
      reading: 'IaaS = Highest admin control & highest maintenance responsibility. SaaS = Lowest admin control & lowest maintenance.'
    }
  },
  {
    id: 'q-cc-03',
    domainId: 'cloud-concepts',
    subtopic: 'cloud-types',
    difficulty: 'beginner',
    question: 'A university plans to shut down its on-premise server room and migrate all student portals to Azure. Instead of spending \$150,000 upfront on physical rack servers, storage arrays, and uninterruptible power supplies, they will pay a monthly invoice based solely on the computing power used. This transition represents a shift from which economic model to which?',
    options: [
      'From Operational Expenditure (OpEx) to Capital Expenditure (CapEx)',
      'From Capital Expenditure (CapEx) to Operational Expenditure (OpEx)',
      'From Elastic Billing to Fixed Asset Allocation',
      'From Public Cloud to Private Cloud'
    ],
    correctIndex: 1,
    explanation: {
      whyCorrect: 'Capital Expenditure (CapEx) involves spending upfront money on physical infrastructure (servers, cooling, buildings) which is amortized over years. Operational Expenditure (OpEx) is spending money on services or products continuously as you consume them, with no upfront cost.',
      distractors: {
        0: 'This is reversed. Buying servers upfront is CapEx, while paying a monthly cloud consumption bill is OpEx.',
        2: 'Elastic Billing to Fixed Asset is the opposite direction; cloud eliminates fixed physical asset constraints.',
        3: 'The university is moving FROM on-premises (private datacenter) TO Azure (Public Cloud).'
      }
    },
    learningStyleTip: {
      visual: 'Picture a large bank check written once on Day 1 (CapEx) vs a monthly utility water or electricity bill (OpEx).',
      auditory: 'CapEx is buying a farm tractor cash down; OpEx is hiring a tractor service per acre cultivated.',
      kinesthetic: 'Open the Azure Pricing Calculator to see how monthly costs vary directly by usage hours without upfront hardware fees.',
      reading: 'CapEx = Upfront investment, depreciated over time. OpEx = Deductible operational expense in the current tax year, pay-as-you-go.'
    }
  },

  // DOMAIN 2: AZURE ARCHITECTURE AND SERVICES
  {
    id: 'q-aa-01',
    domainId: 'azure-architecture',
    subtopic: 'core-components',
    difficulty: 'intermediate',
    question: 'A bank deploying an online payments service in the South Africa North region requires maximum fault tolerance against local power failures, flood damage, or datacenter cooling outages. Which architectural feature within South Africa North should they utilize to ensure their virtual machines are housed in separate physical facilities with independent power and cooling?',
    options: [
      'Resource Groups',
      'Availability Sets',
      'Availability Zones',
      'Azure Region Pairs'
    ],
    correctIndex: 2,
    explanation: {
      whyCorrect: 'Availability Zones are physically separate locations within an Azure region. Each zone consists of one or more datacenters equipped with independent power, cooling, and networking infrastructure. Deploying across zones protects apps from complete datacenter-level failures.',
      distractors: {
        0: 'Resource Groups are logical management containers for resources, providing zero physical fault tolerance or disaster isolation.',
        1: 'Availability Sets only protect against hardware failures and maintenance within a single datacenter rack (Fault & Update domains), not whole datacenter failures.',
        3: 'Region Pairs link two distinct regions hundreds of miles apart (e.g., South Africa North and South Africa West), whereas the requirement specifically asks for fault tolerance within the South Africa North region.'
      }
    },
    learningStyleTip: {
      visual: 'Visualize 3 separate buildings across a metro area, each with its own backup diesel generator and separate fiber ring.',
      auditory: 'Remember: An Availability Zone = Independent Power + Cooling + Networking in the SAME region!',
      kinesthetic: 'When creating a VM in the portal, select "Availability Options" -> "Availability Zone" and toggle between Zone 1, 2, and 3.',
      reading: 'Minimum 3 Availability Zones per supported Azure Region. Latency between zones is < 2 milliseconds over dedicated fiber.'
    }
  },
  {
    id: 'q-aa-02',
    domainId: 'azure-architecture',
    subtopic: 'compute-services',
    difficulty: 'intermediate',
    question: 'A software engineering team wants to execute custom image-processing Python code whenever a new customer uploads a photo. The code takes approximately 4 seconds to execute, runs only 50 to 100 times per day, and requires no ongoing server maintenance or persistent background daemon. Which Azure compute service provides the most cost-effective and optimal solution?',
    options: [
      'Azure Virtual Machines',
      'Azure Functions',
      'Azure Virtual Desktop (AVD)',
      'Azure App Service with Always-On enabled'
    ],
    correctIndex: 1,
    explanation: {
      whyCorrect: 'Azure Functions is a serverless compute service (Function-as-a-Service) that executes code in response to events (such as blob storage uploads or HTTP webhooks). On the Consumption plan, you only pay for the exact compute execution time in seconds, costing virtually nothing when idle.',
      distractors: {
        0: 'Azure Virtual Machines requires paying 24/7 for the allocated VM instance, which is extremely wasteful for an operation running only a few minutes total per day.',
        2: 'Azure Virtual Desktop is a desktop virtualization service providing remote Windows 10/11 desktops to end users.',
        3: 'Azure App Service with Always-On incurs persistent hourly hosting plan charges regardless of whether requests are actively processing.'
      }
    },
    learningStyleTip: {
      visual: 'Picture an electrical light switch: Azure Functions only turns on and bills for the exact seconds the bulb is lit.',
      auditory: 'Think of Azure Functions like a taxi meter that only ticks when moving passengers, compared to buying a bus that sits idle in the parking lot.',
      kinesthetic: 'Create a blob-triggered function in VS Code or Azure Portal and drop an image file into an Azure Blob container to see it execute.',
      reading: 'Serverless features: No server management, auto-scaling on demand, micro-billing per execution duration (GB-seconds).'
    }
  },
  {
    id: 'q-aa-03',
    domainId: 'azure-architecture',
    subtopic: 'storage-services',
    difficulty: 'intermediate',
    question: 'A healthcare laboratory must retain patient scanned diagnostic x-rays for 7 years to meet statutory compliance. The files are almost never accessed after 30 days, but must be permanently stored at the lowest possible storage rate. The lab accepts that retrieving an x-ray in the future may take up to several hours. Which Azure Blob access tier is optimal?',
    options: [
      'Hot Tier',
      'Cool Tier',
      'Cold Tier',
      'Archive Tier'
    ],
    correctIndex: 3,
    explanation: {
      whyCorrect: 'The Archive tier provides the lowest storage cost for data that is rarely accessed and can tolerate retrieval latencies of several hours. Data in Archive tier is offline and must be "rehydrated" to Hot or Cool tier before it can be read.',
      distractors: {
        0: 'Hot Tier is designed for frequently accessed data and has the highest storage cost per gigabyte.',
        1: 'Cool Tier is for data stored for at least 30 days and accessed infrequently, but data remains immediately online and costs significantly more to store than Archive.',
        2: 'Cold Tier is for data accessed infrequently (at least 90 days), but is still stored online and costs more than Archive.'
      }
    },
    learningStyleTip: {
      visual: 'Visualize a freezer: Hot (room temperature table) -> Cool (fridge) -> Cold (deep freezer) -> Archive (deep salt mine vault requiring a retrieval team).',
      auditory: 'Archive is like sealing land title deeds in a bank vault deep underground: cheap rent, but takes hours to withdraw.',
      kinesthetic: 'In Azure Portal, select a Blob -> "Change Tier" -> pick "Archive". Observe that the blob status changes to offline.',
      reading: 'Archive tier retention minimum: 180 days. Retrieval priority: Standard (up to 15 hours) or High (under 1 hour, higher fee).'
    }
  },
  {
    id: 'q-aa-04',
    domainId: 'azure-architecture',
    subtopic: 'networking-services',
    difficulty: 'advanced',
    question: 'A multinational corporation with offices in Nairobi, Kigali, and London needs a dedicated private network connection between their corporate on-premise datacenter and Microsoft Azure. The connection MUST NOT traverse the public internet, must provide enterprise-grade reliability, and must offer bandwidth up to 100 Gbps. Which Azure service meets these requirements?',
    options: [
      'Azure Virtual Network Peering',
      'Azure VPN Gateway with Site-to-Site IPSec',
      'Azure ExpressRoute',
      'Azure Point-to-Site VPN'
    ],
    correctIndex: 2,
    explanation: {
      whyCorrect: 'Azure ExpressRoute establishes a direct, private, dedicated physical connection between an on-premises network and Azure datacenters through a connectivity partner. ExpressRoute traffic travels over a private connection and never touches the public internet, delivering higher security, reliability, and bandwidth up to 100 Gbps.',
      distractors: {
        0: 'VNet Peering connects two Azure Virtual Networks within Azure, not on-premises corporate datacenters.',
        1: 'Site-to-Site VPN connects on-premises networks to Azure, but encrypts traffic over the public internet and is subject to internet routing latency and bandwidth caps (typically up to 10 Gbps).',
        3: 'Point-to-Site VPN is designed for individual remote laptops/clients connecting to an Azure VNet over the internet.'
      }
    },
    learningStyleTip: {
      visual: 'Draw two paths: Path A traverses the messy public internet cloud with VPN encryption; Path B (ExpressRoute) is a private direct fiber optic cable straight into the Azure facility.',
      auditory: 'VPN is like driving an armored bullion van on a public congested highway. ExpressRoute is building your own private underground subway line.',
      kinesthetic: 'Review the architecture diagram of an ExpressRoute Circuit connecting Customer Edge (CE) to Microsoft Enterprise Edge (MSEE).',
      reading: 'ExpressRoute = Private dedicated connection, no public internet traversal, up to 100 Gbps, highest SLA.'
    }
  },

  // DOMAIN 3: AZURE MANAGEMENT AND GOVERNANCE
  {
    id: 'q-am-01',
    domainId: 'azure-management',
    subtopic: 'governance-compliance',
    difficulty: 'intermediate',
    question: 'A chief compliance officer discovers that junior developers have accidentally created virtual machines in Azure US East and West Europe regions, violating African regional data sovereignty regulations. Which Azure feature should be implemented to automatically prevent any user, including administrators, from deploying resources in regions outside of South Africa?',
    options: [
      'Azure Resource Locks',
      'Azure Role-Based Access Control (RBAC)',
      'Azure Policy',
      'Microsoft Entra ID Conditional Access'
    ],
    correctIndex: 2,
    explanation: {
      whyCorrect: 'Azure Policy enforces organizational standards and assesses compliance across resources. By assigning the built-in "Allowed locations" policy definition, Azure automatically blocks the creation of any new resources outside of designated permitted regions (e.g., South Africa North).',
      distractors: {
        0: 'Resource Locks (CanNotDelete, ReadOnly) prevent deletion or modification of existing resources, but cannot evaluate or restrict the geographical deployment region of new resources.',
        1: 'Azure RBAC controls WHO has access to do WHAT (e.g. can user Alice create VMs?), but does not restrict resource properties like geography or VM size.',
        3: 'Conditional Access evaluates identity signals (e.g. require MFA when logging in from unknown IP) for authenticating users, not resource deployment rules.'
      }
    },
    learningStyleTip: {
      visual: 'Visualize a compliance gatekeeper stationed in front of Azure Resource Manager that inspects every JSON template and rejects any location !== southafricanorth.',
      auditory: 'RBAC is "Who can hold the tools". Policy is "What you are legally allowed to build with those tools".',
      kinesthetic: 'Go to Azure Policy -> Definitions -> Search "Allowed locations" -> click Assign to Subscription.',
      reading: 'Azure Policy effects: Deny (blocks deployment), Audit (allows deployment but flags non-compliance), Modify (injects required tags).'
    }
  },
  {
    id: 'q-am-02',
    domainId: 'azure-management',
    subtopic: 'governance-compliance',
    difficulty: 'intermediate',
    question: 'A database administrator needs to ensure that a mission-critical Azure SQL Database in the production resource group cannot be deleted by anyone by mistake, while still allowing developers to query, update, and insert database records normally. What should be applied to the database resource?',
    options: [
      'A ReadOnly Resource Lock',
      'A CanNotDelete Resource Lock',
      'An Azure Policy with Deny action',
      'A Reader RBAC role applied to all staff'
    ],
    correctIndex: 1,
    explanation: {
      whyCorrect: 'A CanNotDelete lock (sometimes called Delete lock) allows authorized users to read and modify a resource (such as updating data, restarting, modifying configuration), but strictly prevents anyone from deleting the resource until the lock is intentionally removed.',
      distractors: {
        0: 'A ReadOnly lock prevents all modifications (writes, updates, schema changes), which would break the requirement allowing developers to insert and update records.',
        2: 'An Azure Policy evaluates rules and denies deployment, but resource locks are specifically purpose-built to prevent accidental deletion of existing assets.',
        3: 'A Reader role would prevent developers from writing, inserting, or updating any data at all.'
      }
    },
    learningStyleTip: {
      visual: 'Picture a red padlock stamped with a trash can with a slash through it: You can open the filing cabinet and add files, but cannot throw the cabinet away.',
      auditory: 'CanNotDelete = "You can write, but you cannot delete." ReadOnly = "Look, but do not touch."',
      kinesthetic: 'In Azure portal, navigate to the SQL Database -> click "Locks" under Settings -> click Add -> select "Delete".',
      reading: 'Lock hierarchy: Subscription locks inherit down to Resource Groups, which inherit down to child resources. Locks override RBAC permissions!'
    }
  },
  {
    id: 'q-am-03',
    domainId: 'azure-management',
    subtopic: 'identity-access',
    difficulty: 'intermediate',
    question: 'An IT security team wants to grant an external contractor access to deploy virtual machines inside a single resource group named "DevTest-RG", without giving them permission to manage security access, modify other resource groups, or view financial invoices. Which Azure RBAC role should be assigned at the "DevTest-RG" scope?',
    options: [
      'Owner',
      'Contributor',
      'Reader',
      'User Access Administrator'
    ],
    correctIndex: 1,
    explanation: {
      whyCorrect: 'The Contributor role grants full permissions to create, manage, and delete all resources within its assigned scope, but DOES NOT allow the user to grant permissions to others or manage access policies.',
      distractors: {
        0: 'The Owner role includes full access to all resources PLUS the capability to grant or revoke access to other users, violating least privilege.',
        2: 'The Reader role only permits viewing existing resources; the contractor would not be able to deploy any virtual machines.',
        3: 'The User Access Administrator role only manages user access and permissions, but cannot deploy virtual machines.'
      }
    },
    learningStyleTip: {
      visual: 'Visualize 3 tiers: Owner (Crown + Keys) -> Contributor (Wrench/Tools only, no keys) -> Reader (Magnifying glass only).',
      auditory: 'A Contributor can contribute work (create VMs, delete disks), but cannot act as the landlord to invite new tenants.',
      kinesthetic: 'Execute `az role assignment create --role "Contributor" --assignee "contractor@org.com" --resource-group "DevTest-RG"`.',
      reading: 'Key principle: Least Privilege. Scope levels: Management Group -> Subscription -> Resource Group -> Resource.'
    }
  },
  {
    id: 'q-am-04',
    domainId: 'azure-management',
    subtopic: 'cost-management',
    difficulty: 'beginner',
    question: 'A company currently running 20 physical servers in an on-premises datacenter is building a business case for the Chief Financial Officer (CFO). They want to analyze how much money they will save over the next 5 years in electricity, server rack maintenance, cooling, and hardware refresh cycles by migrating to Azure. Which tool is specifically designed for this comparison?',
    options: [
      'Azure Pricing Calculator',
      'Total Cost of Ownership (TCO) Calculator',
      'Azure Cost Management + Billing',
      'Azure Advisor'
    ],
    correctIndex: 1,
    explanation: {
      whyCorrect: 'The Total Cost of Ownership (TCO) Calculator estimates and compares the comprehensive costs of maintaining physical on-premises infrastructure (datacenter hardware, cooling, power, IT labor) against migrating to equivalent Microsoft Azure services over a multi-year horizon.',
      distractors: {
        0: 'The Azure Pricing Calculator estimates the expected ongoing cost of provisioning specific Azure services (e.g. 2 VMs + 1 SQL DB), but does not model on-premise hardware retirement or operational overhead comparison.',
        2: 'Azure Cost Management + Billing monitors, analyzes, and optimizes costs for EXISTING resources already running in your Azure subscription.',
        3: 'Azure Advisor provides recommendations for high availability, security, performance, operational excellence, and cost optimization for existing workloads.'
      }
    },
    learningStyleTip: {
      visual: 'Picture a balanced scale: On the left is heavy on-premise server racks + electric meters; on the right is the lightweight Azure cloud bill.',
      auditory: 'TCO = "Total Cost of Ownership Comparison" (On-Prem vs Cloud). Pricing Calculator = "Shopping Cart Price" (Azure bill only).',
      kinesthetic: 'Visit the web TCO Calculator, input 20 physical servers, and inspect the cost breakdown graph comparing Electricity, Storage, and IT Labor.',
      reading: 'TCO factors included: Server hardware, storage arrays, network hardware, electricity/cooling, datacenter real estate, IT maintenance staff.'
    }
  }
];
