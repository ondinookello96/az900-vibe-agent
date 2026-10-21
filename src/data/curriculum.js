// Official Microsoft Azure Fundamentals (AZ-900) Curriculum Outline
// Aligned with the official Microsoft Learn skills measured

export const AZ900_DOMAINS = [
  {
    id: 'cloud-concepts',
    name: 'Describe Cloud Concepts',
    weight: '25–30%',
    weightValue: 27.5,
    color: '#3b82f6', // blue
    bgLight: 'rgba(59, 130, 246, 0.1)',
    description: 'Cloud computing basics, shared responsibility, cloud models (IaaS/PaaS/SaaS), CapEx vs OpEx, and cloud benefits.',
    subtopics: [
      {
        id: 'cloud-benefits',
        name: 'Cloud Benefits & Shared Responsibility',
        description: 'High availability, scalability, elasticity, agility, geo-distribution, disaster recovery, and the shared responsibility model.',
        keyTerms: ['High Availability', 'Scalability', 'Elasticity', 'Disaster Recovery', 'Shared Responsibility']
      },
      {
        id: 'service-models',
        name: 'Cloud Service Models (IaaS, PaaS, SaaS)',
        description: 'Characteristics of Infrastructure as a Service, Platform as a Service, and Software as a Service.',
        keyTerms: ['IaaS', 'PaaS', 'SaaS', 'Serverless']
      },
      {
        id: 'cloud-types',
        name: 'Cloud Deployment Models & Economics',
        description: 'Public, private, hybrid, and multi-cloud models. CapEx vs OpEx and consumption-based pricing.',
        keyTerms: ['Public Cloud', 'Private Cloud', 'Hybrid Cloud', 'CapEx', 'OpEx', 'Consumption Model']
      }
    ]
  },
  {
    id: 'azure-architecture',
    name: 'Describe Azure Architecture and Services',
    weight: '35–40%',
    weightValue: 37.5,
    color: '#8b5cf6', // purple
    bgLight: 'rgba(139, 92, 246, 0.1)',
    description: 'Core architectural structure, compute, containers, virtual desktop, networking, and storage services.',
    subtopics: [
      {
        id: 'core-components',
        name: 'Core Architectural Components',
        description: 'Regions, Availability Zones, Datacenters, Region Pairs, Sovereign Regions, Subscriptions, Management Groups, and Resource Groups.',
        keyTerms: ['Region', 'Availability Zone', 'Resource Group', 'Subscription', 'Management Group']
      },
      {
        id: 'compute-services',
        name: 'Compute, Containers & Virtual Desktop',
        description: 'Azure Virtual Machines, Azure App Service, Azure Container Instances (ACI), Azure Kubernetes Service (AKS), Azure Virtual Desktop (AVD), and Azure Functions.',
        keyTerms: ['Virtual Machines', 'App Service', 'ACI', 'AKS', 'Azure Functions', 'AVD']
      },
      {
        id: 'storage-services',
        name: 'Azure Storage & Migration',
        description: 'Blob storage (Hot, Cool, Cold, Archive tiers), Azure Files, Disk Storage, Azure Storage Explorer, and AzCopy.',
        keyTerms: ['Blob Storage', 'Azure Files', 'Hot/Cool/Archive', 'Storage Explorer', 'AzCopy']
      },
      {
        id: 'networking-services',
        name: 'Azure Networking Services',
        description: 'Virtual Networks (VNets), Subnets, VNet Peering, VPN Gateway, ExpressRoute, and Azure DNS.',
        keyTerms: ['Virtual Network', 'Subnets', 'VNet Peering', 'VPN Gateway', 'ExpressRoute', 'Azure DNS']
      }
    ]
  },
  {
    id: 'azure-management',
    name: 'Describe Azure Management and Governance',
    weight: '30–35%',
    weightValue: 35.0,
    color: '#10b981', // emerald green
    bgLight: 'rgba(16, 185, 129, 0.1)',
    description: 'Cost management, governance features (Policy, Locks), identity (Entra ID, RBAC), and monitoring tools.',
    subtopics: [
      {
        id: 'cost-management',
        name: 'Cost Management & Pricing Tools',
        description: 'Azure Pricing Calculator, TCO Calculator, Microsoft Cost Management, budgets, resource tags, and cost factor drivers.',
        keyTerms: ['Pricing Calculator', 'TCO Calculator', 'Cost Management', 'Resource Tags', 'Budgets']
      },
      {
        id: 'governance-compliance',
        name: 'Governance, Compliance & Security',
        description: 'Azure Policy, Resource Locks, Microsoft Purview, Service Trust Portal, and Defense in Depth.',
        keyTerms: ['Azure Policy', 'Resource Locks', 'Service Trust Portal', 'Compliance']
      },
      {
        id: 'identity-access',
        name: 'Identity, Access & Security (Entra ID)',
        description: 'Microsoft Entra ID (Azure AD), Authentication vs Authorization, MFA, Conditional Access, and Role-Based Access Control (RBAC).',
        keyTerms: ['Microsoft Entra ID', 'MFA', 'Conditional Access', 'RBAC', 'Zero Trust']
      },
      {
        id: 'monitoring-health',
        name: 'Monitoring, Operations & Advisor',
        description: 'Azure Advisor, Azure Monitor, Log Analytics, Azure Service Health, and metric alerts.',
        keyTerms: ['Azure Advisor', 'Azure Monitor', 'Log Analytics', 'Service Health']
      }
    ]
  }
];
