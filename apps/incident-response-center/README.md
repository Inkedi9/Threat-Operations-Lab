# 🚨 Incident Response & Remediation Center

> A simulated cyber incident response platform designed to coordinate containment, remediation, recovery and reporting across a Purple Team ecosystem.

---

## 🧠 Concept

**Incident Response & Remediation Center** is a frontend cyber simulation module that represents the **final phase of a cyber attack lifecycle**:

> Detect → Investigate → Respond → Contain → Remediate → Report

This project is part of a larger ecosystem:

- Purple Team Lab (core scenario)
- SOC Simulator (detection & triage)
- OSINT Investigator (enrichment)
- Identity & Access Attack Simulator (lateral movement)
- Threat Intelligence Platform (IoC correlation)

👉 This module focuses on:

- **Containment actions**
- **Remediation workflows**
- **Risk reduction**
- **Incident reporting**

---

## ⚙️ Features

### 🔥 Incident Command Center

- Live incident context
- Severity & status tracking
- Reset & report generation

### 📊 Incident Overview

- Risk score tracking
- Compromised identities
- Impacted assets
- IoC visibility

### 🧩 Containment Actions

- Interactive response playbook
- Actions affect risk score
- Timeline updates in real time

### ✅ Remediation Checklist

- Task-based recovery workflow
- Progress tracking (%)
- Integrated into reporting

### 📈 Risk Reduction Panel

- Before / after comparison
- Visual gauges
- Exposure status

### 🖥️ Assets & Identities Status

- Before / after state
- Containment status
- Remediation state

### 🌐 IoC Response Panel

- IP / Domain / Hash handling
- Simulated actions:
  - Firewall block
  - DNS sinkhole
  - Quarantine
- Source modules integration

### 📝 Report Generator

- Executive + technical report
- Real-time generation
- TXT export

### 🧭 Timeline

- Detection → Remediation flow
- User actions logged live

## 🔗 Query-based Integration

This module is designed to be opened from other tools:

```bash
?incident=incident-001
?source=soc
?user=j.smith
?ip=185.77.44.21
?asset=WS-07
```

## 🧱 Tech Stack

React (Vite)
TailwindCSS
Framer Motion
Lucide Icons
Frontend-only (mock data)

## 🖥️ Local Setup

```git clone https://github.com/your-username/incident-response-center.git
cd incident-response-center

npm install
npm run dev
```

## 🧪 Simulation Logic

Each containment action reduces risk score
Each remediation task increases recovery progress
Timeline updates dynamically
Report reflects current state
Mission status evolves to “Ready for Recovery”

## 🧠 What this project demonstrates

Incident response workflow understanding
Containment vs remediation distinction
Risk reduction logic
SOC / Blue Team lifecycle
MITRE ATT&CK awareness
Cyber dashboard UX design

## 🛣️ Roadmap (V2)

PDF export (Puppeteer backend)
Incident replay mode
SOAR playbooks simulation
Multi-incident support
Analyst / Manager views
Persistent storage (localStorage / API)
SLA & response time simulation
Advanced MITRE mapping

## 📌 Author

Cybersecurity portfolio project — Purple Team oriented.

## ⚠️ Disclaimer

This is a simulation project for educational and demonstration purposes only.
