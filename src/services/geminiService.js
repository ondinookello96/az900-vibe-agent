// AI Study Buddy & Mentor Service ("Rafiki")
// Supports Gemini API for live multi-turn reasoning and localized African analogies, with offline fallbacks.

const SYSTEM_INSTRUCTION = `You are "Rafiki", an expert, inspiring, and culturally-grounded Azure Cloud Mentor built for the #1MillionDevs Movement across Africa.
Your purpose is to coach aspiring developers to master the Microsoft Certified: Azure Fundamentals (AZ-900) exam.

Key Instructions:
1. CURRICULUM BOUNDARY: Stay strictly within the official Microsoft Learn AZ-900 syllabus:
   - Cloud Concepts (CapEx/OpEx, IaaS/PaaS/SaaS, benefits, shared responsibility)
   - Azure Architecture & Services (Regions, Zones, Compute, Storage Tiers, Networking)
   - Azure Management & Governance (Cost, Policy, Locks, Entra ID, RBAC, Monitoring)
2. PEDAGOGY & ANALOGIES: Make abstract concepts concrete by using real-world African daily life and tech infrastructure analogies (e.g., M-Pesa agents, mobile airtime, market stalls, farm granaries, speed governors, community bomas).
3. LEARNING STYLES: Adapt your response structure to the learner's requested learning style (Visual, Auditory, Kinesthetic, Reading).
4. MULTILINGUAL & DIALECTS: You can fluently sprinkle or switch to English, Swahili (Sheng/East Africa), Nigerian Pidgin, or French based on learner preference.
5. DISCLAIMER: Remind learners that this is an unofficial community prep tool created to empower them.`;

// Comprehensive high-yield knowledge base covering all AZ-900 syllabus areas
const KNOWLEDGE_FALLBACKS = {
  'service-models': {
    english: {
      auditory: `Imagine farming and grain storage in rural Africa:
• IaaS (Infrastructure as a Service): You lease empty agricultural land. You build your own wooden grain silo, buy padlocks, and hire a watchman. You have total freedom over dimensions, but all repairs and OS patches fall on you.
• PaaS (Platform as a Service): You deliver your harvest to a cooperative grain silo. They provide temperature control, security, and electricity. You only focus on weighing and selling your maize code!
• SaaS (Software as a Service): You buy pre-packaged, milled maize flour at the local supermarket (like Microsoft 365). You never see the farm, the miller, or the trucks.`,
      visual: `[IaaS] -> Customer manages: OS, Middleware, Apps, Data | Azure manages: Hardware, Virtualization
[PaaS] -> Customer manages: Applications, Data | Azure manages: OS, Runtime, Hardware
[SaaS] -> Customer manages: Users & Data access | Azure manages: Entire Software Stack`,
      kinesthetic: `Quick Test: Run 'az webapp up' in Azure CLI. Notice that code deploys without configuring Linux kernel drivers. That is PaaS! If you needed custom kernel drivers, you'd provision an Azure VM (IaaS).`,
      reading: `Summary: IaaS = Highest admin control & responsibility. PaaS = Developer productivity without server management. SaaS = Ready-to-use software on subscription.`
    },
    swahili: {
      auditory: `Habari rafiki! Hivi ndivyo mifano ya Cloud inavyofanya kazi:
• IaaS ni kama kukodisha gari tupu: unaendesha mwenyewe, unanunua mafuta, na unalipia matengenezo, lakini mwenye gari anamiliki chassis.
• PaaS ni kama kupanda teksi au Uber: unamwambia dereva unakokwenda, unakaa nyuma na kazi yako.
• SaaS ni kama kupanda basi la mwendokasi au Matatu: unalipa nauli tu, kila kitu kimeshughulikiwa.`
    },
    pidgin: {
      auditory: `How far my bro! See how Cloud Service Models work:
• IaaS: Na like say you rent empty land carry your wood build shop. Na you go put roof, put door, and put generator.
• PaaS: Na like say you rent ready-made market stall wey light and security dey 24/7. You just bring your goods sell.
• SaaS: Na like say you enter supermarket buy ready-made bread. You no need know how them mix flour!`
    }
  },

  'networking-services': {
    english: {
      auditory: `Imagine driving from Lagos to Abuja or Nairobi to Mombasa:
• VPN Gateway (Site-to-Site): You take the public highway in an armored bullion vehicle with escort cars. It's encrypted, but you're still sharing the road with civilian traffic, potholes, and unpredictable delays.
• Azure ExpressRoute: The government builds a private, dedicated high-speed bullet train track (SGR) exclusively for your company. It never touches the public highway, reaches up to 100 Gbps, and guarantees arrival times!
• VNet Peering: Connecting two adjacent conference rooms inside your office building with a direct doorway. Traffic stays entirely within the Azure global backbone.`,
      visual: `[On-Premises Datacenter] 
       │ 
       ├─► [Public Internet (Encrypted IPSec)] ──► [Azure VPN Gateway] (Bandwidth < 10 Gbps)
       │
       └─► [Dedicated Private Fiber Line] ─────► [Azure ExpressRoute] (Bandwidth up to 100 Gbps, Zero Internet)`,
      kinesthetic: `Hands-on Check:
1. If you need secure hybrid connectivity on a budget -> Select Azure VPN Gateway.
2. If you need enterprise mission-critical throughput without internet jitter -> Provision ExpressRoute Circuit.
3. If connecting two Azure VNets -> Create a Virtual Network Peering in 2 clicks.`,
      reading: `Summary Table:
• VPN Gateway: Over public internet, encrypted, up to 10 Gbps, lower cost, quick setup.
• ExpressRoute: Private fiber connection, no internet traversal, up to 100 Gbps, premium reliability SLA.
• VNet Peering: Connects VNets within Azure, lowest latency, uses Microsoft private global network.`
    },
    swahili: {
      auditory: `Habari rafiki! Fikiria unataka kusafirisha pesa kutoka Nairobi hadi Mombasa:
• VPN Gateway ni kama kutumia gari la kawaida kwenye barabara kuu ya umma lakini limefungwa kufuli. Inawezekana kupata msongamano wa magari (traffic).
• Azure ExpressRoute ni kama kuwa na reli yako binafsi ya SGR (Standard Gauge Railway) ambayo wewe pekee ndiye unayeitumia. Haipiti kwenye barabara za kawaida, haina foleni, na ina kasi ya hadi 100 Gbps!
• VNet Peering ni kama kufungua mlango kati ya vyumba viwili vilivyo kando kwa kando katika jengo moja.`
    },
    pidgin: {
      auditory: `How far my bro! See how Azure Networking work:
• VPN Gateway: Na like when you dey carry important motor drive for inside Ikorodu road. The motor get security, but traffic fit hold am because na general road everybody dey use.
• ExpressRoute: O boy, na like say you get your own private helicopter track wey fly straight to your village! E no dey touch general road at all at all, and speed reach 100 Gbps!
• VNet Peering: Na when you and your neighbor open small gate between una two compound make una dey pass easy.`
    }
  },

  'cloud-benefits': {
    english: {
      auditory: `Cloud benefits in a nutshell:
• High Availability: Your shop has multiple power generators; if one trips, lights stay on without customer noticing.
• Scalability: You can add 5 more cashiers when Christmas shoppers arrive.
• Elasticity: The cashiers automatically clock out when the crowd disappears at 9 PM.
• Disaster Recovery: Even if a severe flood destroys the entire market, your backup store in the neighbouring city resumes operations immediately.`,
      visual: `[Traffic Spike] ──► [Elasticity: Auto-scale Out to 10 VMs]
[Traffic Drops] ──► [Elasticity: Auto-scale In to 2 VMs (Save $$)]
[Server Hardware Fails] ──► [High Availability: Traffic redirected in milliseconds]`,
      kinesthetic: `Actionable experiment: In the Azure portal, search for "Scale Sets". Notice how you can define minimum instances (2) and maximum instances (20) with a CPU trigger.`,
      reading: `Core Metrics:
• High Availability: Measured in 99.9% to 99.999% SLA.
• Elasticity: Automatic dynamic provisioning and de-provisioning.
• Agility: Speed of software delivery and deployment.`
    }
  },

  'core-components': {
    english: {
      auditory: `Regions and Availability Zones explained through African trading towns:
• Availability Zones (AZs): Think of M-Pesa agents in a bustling market town. If Agent 1's kiosk loses power, Agent 2 on the next street has an independent generator, cooling, and internet line. That is an Availability Zone—physically separated datacenters within the same region!
• Region Pairs: South Africa North (Johannesburg) paired with South Africa West (Cape Town) at least 300 miles apart to protect against regional disasters like power grid blackouts.
• Resource Groups: Like a family homestead (Boma). All items belonging to a project live together; if you dismantle the boma, all resources inside are deleted together.`,
      visual: `[Azure Geography] ──► [Region Pair (300+ miles apart)]
   │
   └──► [Azure Region] ──► [3+ Independent Availability Zones (Power/Cooling)]`,
      kinesthetic: `CLI Practice: Run 'az group create --name TestRG --location southafricanorth'. Notice that Resource Groups are logical containers and can hold resources from multiple regions.`,
      reading: `Exam Tip: Availability Zones protect against datacenter failure. Region Pairs protect against widespread regional disasters.`
    }
  },

  'storage-services': {
    english: {
      auditory: `Think of maize and grain storage after a harvest:
• Hot Tier: The bowl of maize flour on your kitchen table for tonight's dinner—accessed every hour. Highest storage cost, lowest access fee.
• Cool Tier: The reserve sack kept in your storeroom—accessed once or twice a month. Stored for at least 30 days.
• Archive Tier: The village granary sealed underground for emergency drought reserves. Very cheap to keep for years (min 180 days), but you must wait hours to "rehydrate" the data before you can read it!`,
      visual: `Hot Tier (Active) ──► Cool Tier (30+ days) ──► Cold Tier (90+ days) ──► Archive Tier (180+ days, Hours Rehydration)`,
      kinesthetic: `Try: In Azure Storage, you cannot read an Archive blob directly. You must first change its tier to Hot or Cool and wait for rehydration.`,
      reading: `Summary: Blob = Unstructured files. Files = Managed SMB/NFS file share. Disks = Block storage for VMs.`
    }
  },

  'identity-access': {
    english: {
      auditory: `Passport Control & Boarding Pass Analogy:
• Authentication (AuthN - Entra ID): Proving who you are. Showing your national ID card or biometric fingerprint at the airport gate.
• Authorization (AuthZ - RBAC): Determining what you can enter. Your boarding pass only permits you to sit in seat 12B, not enter the cockpit!
• Conditional Access: An alert security guard who says: "If you are logging in from an unknown phone at 3 AM from an unexpected country, you MUST provide an extra MFA verification code!"`,
      visual: `[Identity: Microsoft Entra ID (AuthN)] ──► [Permissions: Azure RBAC (AuthZ)] ──► [Guardrails: Conditional Access]`,
      kinesthetic: `RBAC Rule: Built-in roles are Owner (Full + grant access), Contributor (Full - cannot grant access), and Reader (View only).`,
      reading: `Exam Rule: Authentication = Who you are. Authorization = What permissions you have.`
    }
  },

  'governance-compliance': {
    english: {
      auditory: `Traffic Speed Governors & Brass Padlocks Analogy:
• Azure Policy: Like the government installing mandatory speed governors on all commercial matatus and buses. Even if a driver presses the gas pedal to the floor, the vehicle physically cannot exceed 80 km/h. Azure Policy physically prevents developers from deploying unapproved expensive VMs or deploying outside South Africa North!
• Resource Locks: Like putting a physical brass padlock on your water meter. 'CanNotDelete' allows authorized people to read and edit, but nobody can delete the resource.
• Tags: Color-coded ear tags on cattle to track which department owns the spending.`,
      visual: `[Management Groups] -> [Subscriptions] -> [Resource Groups] -> [Resources]
(Policies and Permissions inherit downwards automatically!)`,
      kinesthetic: `Remember: Resource Locks override RBAC! Even a Subscription Owner cannot delete a resource locked with 'CanNotDelete' until the lock is removed.`,
      reading: `Policy = Enforces rules & compliance. Locks = Prevents accidental deletion. Tags = Tracks cost centers.`
    }
  }
};

// Smart keyword matcher to resolve any natural question into the appropriate AZ-900 domain
function detectTopicFromPrompt(text) {
  const lower = text.toLowerCase();
  if (lower.includes('iaas') || lower.includes('paas') || lower.includes('saas') || lower.includes('service model') || lower.includes('shared responsibility')) {
    return 'service-models';
  }
  if (lower.includes('network') || lower.includes('vpn') || lower.includes('expressroute') || lower.includes('vnet') || lower.includes('peering') || lower.includes('subnet')) {
    return 'networking-services';
  }
  if (lower.includes('region') || lower.includes('zone') || lower.includes('availability') || lower.includes('datacenter') || lower.includes('boma')) {
    return 'core-components';
  }
  if (lower.includes('storage') || lower.includes('blob') || lower.includes('tier') || lower.includes('archive') || lower.includes('rehydrate') || lower.includes('file')) {
    return 'storage-services';
  }
  if (lower.includes('entra') || lower.includes('rbac') || lower.includes('identity') || lower.includes('auth') || lower.includes('mfa') || lower.includes('permission')) {
    return 'identity-access';
  }
  if (lower.includes('policy') || lower.includes('lock') || lower.includes('governance') || lower.includes('compliance') || lower.includes('cost') || lower.includes('tco') || lower.includes('budget')) {
    return 'governance-compliance';
  }
  if (lower.includes('elastic') || lower.includes('scale') || lower.includes('benefit') || lower.includes('capex') || lower.includes('opex')) {
    return 'cloud-benefits';
  }
  return 'service-models';
}

export const GeminiService = {
  async askMentor({ prompt, topic = 'general', learningStyle = 'auditory', dialect = 'english', apiKey = '' }) {
    // Resolve topic dynamically if generic
    const resolvedTopic = topic === 'general' ? detectTopicFromPrompt(prompt) : topic;

    // Check passed apiKey or environment variable
    const activeKey = (apiKey && apiKey.trim().length > 10) 
      ? apiKey.trim() 
      : (import.meta.env.VITE_GEMINI_API_KEY || '');

    // If a Gemini API key is available, call the official Google Generative AI endpoint
    if (activeKey && activeKey.trim().length > 10) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${activeKey.trim()}`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            contents: [
              {
                role: 'user',
                parts: [
                  {
                    text: `${SYSTEM_INSTRUCTION}

User Requested Learning Style: ${learningStyle.toUpperCase()}
Dialect / Language Preference: ${dialect.toUpperCase()}
Target Topic: ${resolvedTopic}

Question / Request:
${prompt}`
                  }
                ]
              }
            ],
            generationConfig: {
              temperature: 0.7,
              maxOutputTokens: 800
            }
          })
        });

        if (response.ok) {
          const data = await response.json();
          const candidate = data.candidates?.[0]?.content?.parts?.[0]?.text;
          if (candidate) return candidate;
        }
      } catch (err) {
        console.warn('Gemini API call fell back to local engine:', err);
      }
    }

    // High-Yield Local Pedagogical Engine: Instant, reliable, 100% offline-ready
    const topicData = KNOWLEDGE_FALLBACKS[resolvedTopic] || KNOWLEDGE_FALLBACKS['service-models'];
    const dialectData = topicData[dialect] || topicData['english'] || topicData[Object.keys(topicData)[0]];
    const responseText = dialectData?.[learningStyle] || dialectData?.['auditory'] || dialectData?.['english']?.auditory;

    if (responseText) {
      return responseText;
    }

    return `Jambo! Here is Rafiki's key AZ-900 insight:
For **${resolvedTopic.replace(/-/g, ' ')}**, always connect the Microsoft service to its business purpose—protecting uptime, securing identity, or minimizing cost. 
For **${learningStyle}** learners, focus on how the shared responsibility model divides duties between you and Microsoft!`;
  }
};
