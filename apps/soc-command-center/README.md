# 🛡️ CyberOps Ecosystem — SOC Command Center

A modern, interactive **Security Operations Center (SOC) platform** designed to simulate real-world cybersecurity workflows, incident response, and threat intelligence analysis.

Built as part of the **CyberOps Ecosystem**, this project demonstrates hands-on capabilities across:

- 🔵 Blue Team (SOC Operations)
- 🟣 Purple Team (Attack Simulation & Correlation)
- 🎯 CTF Training (Analyst Skills)

---

## 🚀 Overview

The **SOC Command Center** is a full-featured cybersecurity dashboard that enables:

- Real-time alert monitoring
- Incident triage and response workflows
- Attack correlation (MITRE-based)
- Log analysis (SIEM-style)
- Investigation pivoting
- AI-assisted decision support
- Hands-on training (CTF Lab)

---

## 🧠 Key Features

### 📊 Dashboard

- SOC metrics (alerts, severity, activity)
- Live telemetry visualization
- Enhanced dark CyberOps design system
- Stylized charts with real-time feel

---

### 🚨 Alerts (Core SOC Engine)

- Real-time alert generation & simulation
- Severity, SLA, priority & status tracking
- Analyst workflow (investigate, escalate, close)
- AI SOC Analysis (threat classification + MITRE mapping)
- Timeline reconstruction per incident
- Analyst notes & activity logging
- Report export (TXT + PDF)

---

### 🧠 AI Copilot (NEW)

A context-aware assistant embedded in the SOC:

- 🔍 Threat intelligence summary
- 🧠 Dynamic analysis based on alerts
- 📍 Page-aware recommendations (Alerts, Logs, AttackStory…)
- ⚠️ Detection of patterns:
  - Brute force
  - Post-exploitation (Mimikatz)
  - Repeated IP activity

- 💡 Investigation guidance & next steps

---

### 🧬 Attack Story (Correlation Engine)

- Builds a **coherent attack narrative**
- Maps alerts to MITRE ATT&CK phases:
  - Initial Access
  - Credential Access
  - Execution
  - Privilege Escalation
  - Exfiltration

- Generates:
  - Risk score
  - Confidence level
  - Analyst narrative
  - Recommended actions

---

### 🌍 Attack Map

- Live visualization of attack sources
- Animated threat points (severity-based)
- SOC target simulation (central node)
- Real-time “cyber battlefield” effect

---

### 📜 Logs (SIEM Style)

- Centralized event stream
- Full-text search (IP, alert, log content)
- Color-coded log classification:
  - Success → Red
  - Failed → Orange
  - Recon → Yellow
  - Flags → Green

- Terminal-style SOC console

---

### 🔎 Investigations

- Pivot analysis by IP
- Correlated alert timeline
- Automated incident summary
- Attack pattern detection (recon, brute force, etc.)

---

### 🎯 CTF Lab (Training Mode)

- Interactive SOC investigation challenges
- Log-based questions (realistic scenarios)
- Score system + progression:
  - Junior Analyst → SOC Analyst → Senior Analyst

- Gamified learning experience

---

## 🎨 Design System (CyberOps UI)

Custom SOC-themed design system:

- 🌑 Dark immersive UI (no white UI elements)
- 🔵 Blue/Cyan cyber accents
- 🔥 Threat-based color system:
  - Critical → Red
  - High → Orange
  - Medium → Yellow
  - Normal → Blue/Cyan

- 🧊 Glass panels + glow effects
- 🧠 AI Copilot integration layout (SaaS style)

Reusable components:

- `CyberPanel`
- `HeaderCard`
- `Badge`
- `ActionButton`
- `SeverityBadge`
- `TabButton`

---

## 🏗️ Architecture

```bash
src/
├── pages/
│   ├── Dashboard.jsx
│   ├── Alerts.jsx
│   ├── AttackStory.jsx
│   ├── AttackMap.jsx
│   ├── Logs.jsx
│   ├── Investigations.jsx
│   └── CTF.jsx
│
├── components/ui/
│   ├── CyberPanel.jsx
│   ├── HeaderCard.jsx
│   ├── Badge.jsx
│   ├── ActionButton.jsx
│   ├── SeverityBadge.jsx
│   ├── TabButton.jsx
│   └── AICopilotPanel.jsx
```

---

## 🧪 Simulation Engine

The platform includes a built-in attack simulator:

- Multi-stage attack scenarios
- Real-time alert injection
- Timeline generation
- Attack chaining (Recon → Exploitation → Exfiltration)

---

## 🎯 Use Cases

- 🧑‍💻 Portfolio project (Cybersecurity / SOC Analyst)
- 🎓 Training platform (Blue Team skills)
- 🧪 Purple Team simulation environment
- 🧠 Demonstration of SOC workflows
- 🎤 Interview / recruiter demo

---

## 🔮 Next Steps (CyberOps Ecosystem)

Planned extensions:

- 🟣 Purple Team Lab (offensive simulation engine)
- 🎣 Phishing Platform (campaign + detection)
- 🤖 Advanced AI Copilot (LLM-like reasoning)
- 📡 Threat Intelligence integration
- 🌐 Multi-tenant SOC environment

---

## 🧑‍💻 Author

Built as part of a personal cybersecurity ecosystem:

👉 **CyberOps Ecosystem**

---

## ⚠️ Disclaimer

This project is a **simulation environment** designed for learning and demonstration purposes only.

---

## ⭐ If you like this project

Feel free to:

- Star ⭐ the repo
- Fork 🍴 and extend it
- Use it for your cybersecurity journey

---
