# 🟣 Purple Team Core

> Central command hub for attack simulation, detection validation and incident reporting.

---

## 🔴 Live Demo

👉 https://purple-team-core.vercel.app/

---

## 🚀 Overview

**Purple Team Core** is the central application of the Threat Operations Lab ecosystem.

It allows you to:

- Simulate cyber attacks
- Validate defensive controls
- Analyze detection coverage
- Generate client-ready incident reports

This app represents the **Purple Team layer**, bridging:

- 🔴 Offensive simulation
- 🔵 Defensive monitoring
- 🟣 Security validation

---

## 🎯 Key Objective

Provide a **full security feedback loop**:

```text
Attack → Telemetry → Detection → Coverage → Report
```

---

## ⚙️ Features

### 🔴 Attack Simulation

- Phishing-based compromise scenarios
- Credential abuse simulation
- Multi-stage attack flows

---

### 🔵 Detection & Visibility

- Logs & alerts correlation
- Detection status:
  - Detected
  - Partially Detected
  - Missed

- Alert & telemetry tracking

---

### 🟣 Purple Team Validation

- Coverage scoring
- Detection gap analysis
- Scenario vs campaign comparison

---

### ⚔️ Campaign Mode

- Chain multiple scenarios
- Simulate full attack paths
- Global coverage scoring

---

### 📄 Reporting Engine (V1.6)

- Scenario & campaign reports
- Executive summary
- MITRE ATT&CK mapping
- IoC evidence bundle
- Timeline reconstruction
- ✅ **Client-ready PDF export**

---

### 📊 Analytics

- Radar coverage visualization
- Detection distribution
- Global lab metrics

---

### 🔁 Replay Engine

- Replay full simulation timeline
- Pause / resume / speed control
- Investigate detection sequence step-by-step

---

## 🧩 Ecosystem Integration

Purple Team Core integrates with external modules:

- PhishScope → phishing detection
- SOC Command Center → alert triage
- OSINT tools → enrichment
- Threat Intel → IoC correlation

Communication via:

```text
?incident=incident-001&user=j.smith&ip=185.77.44.21
```

---

## 🧪 Example Scenario

**Phishing-Led Identity Compromise**

- User receives phishing email
- Credentials are harvested
- Suspicious login detected
- SOC alerts triggered
- Incident is analyzed and reported

---

## 🖥️ UI / UX

- Cyber SaaS interface
- Dark mode (purple / blue / neon)
- Panel-based layout (PanelCard system)
- Analyst workflow oriented
- Real-time simulation feel

---

## 🧪 Tech Stack

- React (Vite)
- Tailwind CSS
- Recharts
- jsPDF
- Lucide Icons

---

## 📦 Installation

```bash
npm install
npm run dev
```

---

## 🧠 What This App Demonstrates

- Purple Team methodology
- Detection engineering thinking
- Security coverage analysis
- Incident reporting workflow
- Advanced React UI architecture

---

## 🚀 Roadmap

- AI-assisted analysis (Copilot)
- Real SIEM-like log ingestion
- Detection rule engine
- Scenario builder (drag & drop)
- Multi-incident management

---

## 🔗 Related Project

👉 Threat Operations Lab (multi-app ecosystem)

---

## 👤 Author

Cybersecurity builder focused on:

- SOC Analysis
- Threat Detection
- Purple Teaming
- Hands-on cyber labs

---

## ⭐ Support

If you like this project:

- ⭐ Star the repo
- 🔁 Share it
- 🧠 Follow for more cyber labs
