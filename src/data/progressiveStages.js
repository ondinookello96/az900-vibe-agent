// Progressive Mastery Journey Stages & Missions
// Guides the learner step-by-step from Cloud Novice -> Certified Architect

export const PROGRESSIVE_STAGES = [
  {
    id: 'stage-1',
    number: 1,
    title: 'Cloud Concepts & Fundamentals',
    domainId: 'cloud-concepts',
    weight: '25–30%',
    badge: 'Foundation Explorer',
    color: '#3b82f6',
    description: 'Master core cloud characteristics, service models (IaaS/PaaS/SaaS), and CapEx vs OpEx economics.',
    missions: [
      {
        id: 'm-1-1',
        title: 'Cloud Benefits & Shared Responsibility',
        subtopicId: 'cloud-benefits',
        type: 'learn-and-quiz',
        description: 'Understand High Availability, Elasticity, Scalability, and who patches the OS.',
        xp: 100
      },
      {
        id: 'm-1-2',
        title: 'IaaS vs PaaS vs SaaS in Practice',
        subtopicId: 'service-models',
        type: 'learn-and-quiz',
        description: 'Compare infrastructure control vs managed convenience with real African analogies.',
        xp: 120
      },
      {
        id: 'm-1-3',
        title: 'Cloud Economics: CapEx to OpEx',
        subtopicId: 'cloud-types',
        type: 'learn-and-quiz',
        description: 'Analyze upfront infrastructure expenses vs pay-as-you-go consumption models.',
        xp: 100
      }
    ]
  },
  {
    id: 'stage-2',
    number: 2,
    title: 'Azure Core Architecture & Services',
    domainId: 'azure-architecture',
    weight: '35–40%',
    badge: 'Infrastructure Builder',
    color: '#8b5cf6',
    description: 'Learn physical redundancy, Availability Zones, compute containers, storage tiers, and private networks.',
    missions: [
      {
        id: 'm-2-1',
        title: 'Regions, Availability Zones & Pairs',
        subtopicId: 'core-components',
        type: 'learn-and-quiz',
        description: 'How independent datacenters protect African financial services from power grid blackouts.',
        xp: 150
      },
      {
        id: 'm-2-2',
        title: 'Compute & Containers (VMs, ACI, Functions)',
        subtopicId: 'compute-services',
        type: 'learn-and-quiz',
        description: 'When to pick serverless functions vs Docker containers vs virtual machines.',
        xp: 150
      },
      {
        id: 'm-2-3',
        title: 'Azure Storage & Access Tiers',
        subtopicId: 'storage-services',
        type: 'learn-and-quiz',
        description: 'Blob storage Hot vs Cool vs Archive tiers and data rehydration rules.',
        xp: 140
      },
      {
        id: 'm-2-4',
        title: 'Azure Networking & ExpressRoute',
        subtopicId: 'networking-services',
        type: 'learn-and-quiz',
        description: 'Dedicated private fiber lines vs public internet VPN gateways.',
        xp: 160
      }
    ]
  },
  {
    id: 'stage-3',
    number: 3,
    title: 'Azure Management & Governance',
    domainId: 'azure-management',
    weight: '30–35%',
    badge: 'Cloud Governor',
    color: '#10b981',
    description: 'Master identity access (Microsoft Entra ID), guardrails (Azure Policy), Resource Locks, and cost budgets.',
    missions: [
      {
        id: 'm-3-1',
        title: 'Identity & Access: Entra ID vs RBAC',
        subtopicId: 'identity-access',
        type: 'learn-and-quiz',
        description: 'Authentication (AuthN) vs Authorization (AuthZ), MFA, and Conditional Access rules.',
        xp: 160
      },
      {
        id: 'm-3-2',
        title: 'Governance: Azure Policy & Resource Locks',
        subtopicId: 'governance-compliance',
        type: 'learn-and-quiz',
        description: 'Prevent accidental deletions with CanNotDelete and enforce regional compliance.',
        xp: 150
      },
      {
        id: 'm-3-3',
        title: 'Cost Management & TCO Calculator',
        subtopicId: 'cost-management',
        type: 'learn-and-quiz',
        description: 'Calculate multi-year datacenter migration savings and set automated spending alerts.',
        xp: 140
      }
    ]
  },
  {
    id: 'stage-4',
    number: 4,
    title: 'Grand Certification Readiness Sprint',
    domainId: 'review',
    weight: '100% Mock',
    badge: 'Exam Certified Ready',
    color: '#f59e0b',
    description: 'Eliminate all diagnosed weak spots and conquer the full 45-minute timed AZ-900 trial.',
    missions: [
      {
        id: 'm-4-1',
        title: 'Weakness Pitstop Blitz',
        subtopicId: 'weakness-blitz',
        type: 'adaptive-drill',
        description: 'Target all subtopics scoring below 70% to ensure zero exam blindspots.',
        xp: 200
      },
      {
        id: 'm-4-2',
        title: 'Full Timed AZ-900 Mock Simulation',
        subtopicId: 'full-mock',
        type: 'mock-exam',
        description: 'Sit a complete 45-minute simulation under real Microsoft examination constraints.',
        xp: 300
      }
    ]
  }
];
