## Core Engine

At the heart of the CyberOps Ecosystem lies the Purple Team Engine.

It orchestrates attack scenarios, triggers events across modules, and simulates realistic incident lifecycles.

Scenario Orchestration Engine : Purple Team Core

→ See: https://github.com/your-org/purple-team-core
→ Live https://purple-team-core.vercel.app

threat-operations-lab/
├── README.md
└── docs/
├── architecture.md
└── roadmap.md

flowchart LR
A[Adversary Simulation Core] --> B[SOC Operations Console]
C[PhishScope] --> B
D[OSINT Investigator] --> B
B --> E[Threat Intelligence Platform]
B --> F[Identity Attack Simulator]

    A --> G[Attack Story / MITRE Mapping]
    B --> G
    C --> G
    D --> G

sequenceDiagram
participant Purple as Purple Team Core
participant Phish as PhishScope
participant SOC as SOC Command Center
participant OSINT as OSINT Investigator
participant CTI as Threat Intel Platform

    Purple->>SOC: Generate simulated alerts
    Phish->>SOC: Forward confirmed phishing incident
    SOC->>SOC: Triage, correlate, investigate
    SOC->>OSINT: Enrich IP/domain/user context
    OSINT-->>SOC: Return investigation context
    SOC->>CTI: Submit IoCs for enrichment
    CTI-->>SOC: Return intelligence signals

| Module                    | Role                                       | Status      |
| ------------------------- | ------------------------------------------ | ----------- |
| Purple Team Core          | Attack simulation and Red/Blue validation  | In Progress |
| SOC Command Center        | Detection, triage, investigation, response | Active      |
| PhishScope                | Human-layer phishing simulation            | Active      |
| OSINT Investigator        | Context enrichment and investigation       | Active      |
| Threat Intel Platform     | IOC enrichment and threat correlation      | Planned     |
| Identity Attack Simulator | Identity-based attack scenarios            | Planned     |

         [ OSINT Investigator ]
                     |

[ PhishScope ] — [ Purple Team Core ] — [ SOC Command Center ]
|
[ Threat Intel Platform ]
|
[ Identity Attack Simulator ]
