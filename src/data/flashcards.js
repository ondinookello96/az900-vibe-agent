// Spaced-Repetition High-Yield Flashcards for AZ-900
// Mapped with African analogies and common exam traps

export const FLASHCARDS = [
  {
    id: 'fc-01',
    domainId: 'cloud-concepts',
    subtopic: 'cloud-benefits',
    term: 'High Availability vs Disaster Recovery',
    definition: 'High Availability (HA) ensures a service remains online without downtime during routine hardware failure. Disaster Recovery (DR) restores service after a catastrophic regional event.',
    africanAnalogy: 'HA is having a backup solar battery in your house when the main grid trips. DR is having a whole second house in another town if a massive river flood destroys the valley.',
    examTrap: 'Don\'t confuse Availability Zones (HA within a region) with Region Pairs (DR across hundreds of miles).',
    mnemonic: 'HA = Keep working now | DR = Bounce back from catastrophe'
  },
  {
    id: 'fc-02',
    domainId: 'cloud-concepts',
    subtopic: 'service-models',
    term: 'Shared Responsibility: Operating System Patching',
    definition: 'In IaaS, the customer patches the OS. In PaaS and SaaS, Microsoft patches the OS automatically.',
    africanAnalogy: 'If you rent an empty taxi (IaaS), you service the brakes. If you ride an Uber (PaaS), the driver services the car.',
    examTrap: 'On AZ-900, if the question mentions "admin needs to install a specific custom OS build", the answer is ALWAYS IaaS (Virtual Machines).',
    mnemonic: 'IaaS = I Administer; PaaS = Platform Auto-manages'
  },
  {
    id: 'fc-03',
    domainId: 'azure-architecture',
    subtopic: 'core-components',
    term: 'Azure Availability Zones',
    definition: 'Physically separated datacenters within a single region, each with independent power, cooling, and networking.',
    africanAnalogy: 'Three independent M-Pesa or POS agent kiosks on three different streets in town—if one has a blackout, the others keep operating.',
    examTrap: 'Availability Zones are NOT separate regions! They are located in the SAME region, connected by low-latency fiber (<2ms).',
    mnemonic: 'Z.I.P: Zones = Independent Power, cooling, and networking'
  },
  {
    id: 'fc-04',
    domainId: 'azure-architecture',
    subtopic: 'storage-services',
    term: 'Blob Storage: Archive Tier Rehydration',
    definition: 'Archive tier is the lowest-cost offline tier for data stored for at least 180 days. It cannot be read immediately and takes up to 15 hours to "rehydrate".',
    africanAnalogy: 'Like dried maize grains sealed in an underground granary. Very cheap to keep for years, but you must boil and soak them for hours before eating.',
    examTrap: 'You CANNOT read data directly while in Archive tier. It must first be moved back to Hot or Cool tier.',
    mnemonic: 'Archive = Lowest Cost, Longest Wait (Rehydrate first)'
  },
  {
    id: 'fc-05',
    domainId: 'azure-architecture',
    subtopic: 'compute-services',
    term: 'Containers (ACI) vs Kubernetes (AKS)',
    definition: 'Azure Container Instances (ACI) runs simple, isolated single containers without managing orchestration. Azure Kubernetes Service (AKS) orchestrates enterprise clusters of multiple interconnected containers.',
    africanAnalogy: 'ACI is hiring a single dispatch motorcycle for one package. AKS is managing an entire fleet of 200 delivery trucks with dispatch centers and route optimization.',
    examTrap: 'If the question asks for "simplest way to run a container with zero orchestration or server management", pick ACI, not AKS.',
    mnemonic: 'ACI = Quick & Single | AKS = Scale & Orchestration'
  },
  {
    id: 'fc-06',
    domainId: 'azure-management',
    subtopic: 'governance-compliance',
    term: 'Azure Policy vs RBAC',
    definition: 'Azure RBAC focuses on WHO has permissions to perform actions (User Role). Azure Policy focuses on WHAT resource properties and guardrails are allowed (Resource Conditions).',
    africanAnalogy: 'RBAC is giving a driver a commercial license to drive the company bus. Azure Policy is fitting a mechanical speed governor on the bus so it cannot exceed 80 km/h no matter who drives it.',
    examTrap: 'RBAC cannot restrict locations or enforce naming conventions. That is the exclusive job of Azure Policy!',
    mnemonic: 'RBAC = Who can act | Policy = What rules apply'
  },
  {
    id: 'fc-07',
    domainId: 'azure-management',
    subtopic: 'governance-compliance',
    term: 'Resource Locks: CanNotDelete vs ReadOnly',
    definition: 'CanNotDelete allows modifying and reading resources, but blocks deletion. ReadOnly allows ONLY viewing/reading resources, blocking both modifications and deletions.',
    africanAnalogy: 'CanNotDelete is keeping your house deeds in a safe—you can take them out to photocopy or amend notes, but nobody can burn them. ReadOnly is viewing a museum artifact behind glass.',
    examTrap: 'Resource Locks OVERRIDE RBAC! An Owner cannot delete a locked resource until the lock is manually deleted.',
    mnemonic: 'CanNotDelete = Update YES, Delete NO | ReadOnly = Update NO, Delete NO'
  },
  {
    id: 'fc-08',
    domainId: 'azure-management',
    subtopic: 'identity-access',
    term: 'Microsoft Entra ID Conditional Access',
    definition: 'An automated security engine that uses identity signals (who, where, what device, risk level) to enforce access decisions (allow, require MFA, block).',
    africanAnalogy: 'A security guard at the bank vault: If you arrive in broad daylight with your uniform, they check your ID badge. If you arrive at midnight from an unknown unmarked vehicle, they demand your manager verify you via fingerprint and call.',
    examTrap: 'Conditional Access uses "If-Then" logic: IF signals match condition, THEN enforce controls (like MFA).',
    mnemonic: 'Conditional Access = If-Then Security Gate'
  }
];
