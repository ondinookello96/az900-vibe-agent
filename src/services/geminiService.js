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

// Pre-computed high-yield knowledge base for offline or zero-API-key mode
const KNOWLEDGE_FALLBACKS = {
  'networking-services': {
    english: {
      auditory: `Imagine driving from Lagos to Abuja:
- VPN Gateway (Site-to-Site): You take the public highway in an armored bullion vehicle with escort cars. It's encrypted, but you're still sharing the road with traffic, potholes, and unpredictable delays.
- Azure ExpressRoute: The government builds a private, high-speed bullet train track exclusively for your company. It never touches the public highway, reaches up to 100 Gbps, and guarantees arrival times!
- VNet Peering: Connecting two adjacent conference rooms inside your office building with a direct doorway. Traffic stays entirely within the Azure backbone.`,
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
- VPN Gateway ni kama kutumia gari la kawaida kwenye barabara kuu ya umma lakini limefungwa kufuli. Inawezekana kupata msongamano wa magari (traffic).
- Azure ExpressRoute ni kama kuwa na reli yako binafsi ya SGR (Standard Gauge Railway) ambayo wewe pekee ndiye unayeitumia. Haipiti kwenye barabara za kawaida, haina foleni, na ina kasi ya hadi 100 Gbps!
- VNet Peering ni kama kufungua mlango kati ya vyumba viwili vilivyo kando kwa kando katika jengo moja.`
    },
    pidgin: {
      auditory: `How far my bro! See how Azure Networking work:
- VPN Gateway: Na like when you dey carry important motor drive for inside Ikorodu road. The motor get security, but traffic fit hold am because na general road everybody dey use.
- ExpressRoute: O boy, na like say you get your own private helicopter track wey fly straight to your village! E no dey touch general road at all at all, and speed reach 100 Gbps!
- VNet Peering: Na when you and your neighbor open small gate between una two compound make una dey pass easy.`
    }
  },

  'cloud-benefits': {
    english: {
      auditory: `Cloud benefits in a nutshell:
- High Availability: Your shop has multiple power generators; if one fails, lights stay on without customer noticing.
- Scalability: You can add 5 more cashiers when Christmas shoppers arrive.
- Elasticity: The cashiers automatically clock out when the crowd disappears at 9 PM.
- Disaster Recovery: Even if a severe flood destroys the entire market, your backup store in the neighbouring city resumes operations immediately.`,
      visual: `[Traffic Spike] ──► [Elasticity: Auto-scale Out to 10 VMs]
[Traffic Drops] ──► [Elasticity: Auto-scale In to 2 VMs (Save \$\$)]
[Server Hardware Fails] ──► [High Availability: Traffic redirected in milliseconds]`,
      kinesthetic: `Actionable experiment: In the Azure portal, search for "Scale Sets". Notice how you can define minimum instances (2) and maximum instances (20) with a CPU trigger.`,
      reading: `Core Metrics:
• High Availability: Measured in 99.9% to 99.999% SLA.
• Elasticity: Automatic dynamic provisioning and de-provisioning.
• Agility: Speed of software delivery and deployment.`
    }
  }
};

export const GeminiService = {
  async askMentor({ prompt, topic = 'general', learningStyle = 'auditory', dialect = 'english', apiKey = '' }) {
    // If user provided a real Gemini API key, call the official Google Generative AI endpoint
    if (apiKey && apiKey.trim().length > 10) {
      try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey.trim()}`, {
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
Target Topic: ${topic}

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

    // Local Generative Fallback: Instant, reliable, offline-ready
    const topicData = KNOWLEDGE_FALLBACKS[topic] || KNOWLEDGE_FALLBACKS['networking-services'];
    const dialectData = topicData[dialect] || topicData['english'];
    const responseText = dialectData[learningStyle] || dialectData['auditory'] || dialectData['english']?.auditory;

    return responseText || `Here is Rafiki's study tip for ${topic}:
Always ground yourself in the official AZ-900 skills outline. Remember that Azure evaluates resources against policies, while Entra ID handles user identity. For ${learningStyle} learners, focusing on real-world practical use cases and African infrastructure analogies will solidify your understanding faster!`;
  }
};
