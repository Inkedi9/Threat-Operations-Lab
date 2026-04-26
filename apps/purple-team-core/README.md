# 🟣 Purple Team Lab

> Simulate attacks. Validate defenses. Measure security posture.

---

## 🔴 Live Demo

👉 https://purple-team-lab.vercel.app/

## 🚀 Overview

**Purple Team Lab** is an interactive cybersecurity web application designed to simulate realistic attack scenarios and evaluate how well defensive controls detect and respond.

It bridges the gap between:

- 🔴 Red Team (attack simulation)
- 🔵 Blue Team (detection & monitoring)
- 🟣 Purple Team (validation & improvement)

---

## 🎯 Key Objective

Provide a hands-on environment to understand the full security lifecycle:
Attack → Telemetry → Detection → Validation → Improvement

---

## ⚙️ Features

### 🔴 Attack Simulation

- Bruteforce login
- Network scan
- Credential dumping (Mimikatz-like)
- Data exfiltration

### 🔵 Detection & Telemetry

- Event timeline (logs, alerts, actions)
- Detection visibility
- Alert generation

### 🟣 Purple Team Validation

- Detection status:
  - Detected
  - Partially Detected
  - Missed
- Coverage score
- Detection gaps identification

### 🛡️ Defensive Controls

- MFA
- EDR
- IDS
- SIEM correlation
- DLP

→ Toggle controls and instantly see their impact

---

### 📊 Analytics

- Radar coverage visualization
- Global detection metrics
- Scenario vs Campaign comparison

---

### ⚔️ Campaign Mode

- Chain multiple attack scenarios
- Simulate full attack paths
- Global campaign scoring
- Multi-stage detection analysis

---

### 📄 Reporting

- Scenario report
- Campaign report
- Copyable output (SOC-style)

---

## 🖥️ UI Design

- Cyber SaaS interface
- SOC dashboard inspiration
- Dark mode (neon / purple / blue)
- Live activity feed (terminal style)
- Clean 3-column layout

---

## 🧪 Tech Stack

- React (Vite)
- Tailwind CSS
- Recharts
- Lucide Icons

---

## 📦 Installation

```bash
npm install
npm run dev
```

---

## 🧠 What This Project Demonstrates

This project showcases:

Threat simulation understanding
Detection engineering mindset
Defensive coverage analysis
Purple team methodology
Security visualization skills
Frontend engineering (React + Tailwind)

---

## 👤 Author

Cybersecurity enthusiast building hands-on labs to master:

Blue Team
SOC Analysis
Threat Detection
Purple Teaming

---

## 🔥 Future Improvements (V2)

Real log ingestion (JSON / SIEM-like)
Custom rule engine
Attack chaining editor (drag & drop)
User authentication + saved sessions
Export PDF reports
Integration with real tools (Wazuh, Sigma rules)

---

## Purple Team Ecosystem

Purple Team Lab acts as the central hub of a modular cybersecurity simulation ecosystem.

The ecosystem connects several independent React applications through a shared mocked incident dataset and deep links using query parameters.

### Incident Flow

Phishing → Identity Compromise → Lateral Movement → SOC Detection → OSINT Enrichment → Threat Intelligence → Report

### Connected Modules

| Module                             | Purpose                            | Deep Link                             |
| ---------------------------------- | ---------------------------------- | ------------------------------------- |
| Phishing Scope                     | Investigate phishing entry points  | `?incident=incident-001`              |
| Identity & Access Attack Simulator | Explore compromised identity paths | `?user=j.smith&incident=incident-001` |
| SOC Simulator Command Center       | Review detection and triage        | `?incident=incident-001`              |
| OSINT Investigator                 | Enrich IP/domain indicators        | `?ip=185.77.44.21`                    |
| Threat Intelligence Platform       | Correlate IoCs and threat clusters | `?ioc=secure-login-support.com`       |

⭐ If you like this project

Give it a star and follow for more cyber labs.
