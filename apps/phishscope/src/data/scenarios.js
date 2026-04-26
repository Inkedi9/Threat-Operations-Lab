export const phishingFlags = [
  "Suspicious sender address",
  "Lookalike domain",
  "Urgent language",
  "Credential request",
  "Suspicious attachment",
  "Suspicious link",
  "Generic greeting",
  "Poor grammar or unusual tone",
  "Financial request",
  "External sender",
  "Link text does not match URL",
  "Unexpected document share",
];

export const scenarios = [
  {
    id: "incident-001-phishing",
    category: "Credential Theft",
    difficulty: "Hard",
    type: "phishing",
    linkedIncidentId: "incident-001",
    senderName: "Secure Login Support",
    senderEmail: "security-alert@secure-login-support.com",
    subject: "Immediate account verification required",
    preview: "We detected unusual activity linked to your corporate account.",
    date: "2026-04-21 09:12",
    badge: "External",
    body: `Hello J. Smith,

We detected unusual sign-in activity linked to your corporate account.

To prevent temporary access restriction, please verify your login session immediately through the secure support portal.

This verification must be completed within 30 minutes to avoid interruption to your workspace access.`,
    linkText: "Verify account session",
    linkUrl: "http://secure-login-support.com/session/verify",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Lookalike domain",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "This email is aligned with incident-001 and simulates credential harvesting through a fake secure login support portal.",
    riskLevel: "Critical",
  },
  {
    id: 1,
    category: "Credential Theft",
    difficulty: "Medium",
    type: "phishing",
    senderName: "Microsoft Security",
    senderEmail: "security@micr0soft-alerts.com",
    subject: "Unusual sign-in attempt detected",
    preview: "We noticed suspicious activity on your account.",
    date: "2026-04-10 09:14",
    badge: "External",
    body: `We detected an unusual sign-in attempt from a new location.

To avoid account suspension, please verify your identity immediately.

Failure to act within 30 minutes may result in restricted access.`,
    linkText: "Review activity",
    linkUrl: "http://microsoft-login-alerts.verify-session.net",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Lookalike domain",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "This email imitates Microsoft branding and pressures the user into clicking a malicious login link.",
    riskLevel: "High",
  },
  {
    id: 2,
    category: "Meeting Invite",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "HR Team",
    senderEmail: "hr@company.com",
    subject: "Reminder: onboarding meeting tomorrow",
    preview: "Please find the Teams meeting details below.",
    date: "2026-04-10 15:30",
    badge: "Internal",
    body: `Hello Kevin,

This is a reminder for your onboarding meeting scheduled for tomorrow at 10:00 AM.

You can join through the usual Teams link in your calendar invite.

Best regards,
HR Team`,
    linkText: null,
    linkUrl: null,
    attachment: null,
    redFlags: [],
    explanation:
      "This email is consistent with normal internal HR communication and contains no suspicious indicators.",
    riskLevel: "Low",
  },
  {
    id: 3,
    category: "Business Email Compromise",
    difficulty: "Hard",
    type: "phishing",
    senderName: "CEO Office",
    senderEmail: "ceo-office@consulting-finance.net",
    subject: "Need an urgent transfer handled discreetly",
    preview: "I need you to process a confidential payment today.",
    date: "2026-04-11 08:10",
    badge: "External",
    body: `Hi,

I'm currently in a meeting and cannot talk.

I need you to urgently handle a confidential transfer for a partner before noon. Reply as soon as you are available so I can send the banking details.

Do not share this with anyone yet.`,
    linkText: null,
    linkUrl: null,
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Financial request",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This is a classic business email compromise attempt using urgency, secrecy, and financial pressure.",
    riskLevel: "Critical",
  },
  {
    id: 4,
    category: "GitHub Notification",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "GitHub",
    senderEmail: "noreply@github.com",
    subject: "New sign-in to your GitHub account",
    preview: "We noticed a new sign-in from a recognized device.",
    date: "2026-04-11 18:42",
    badge: "Trusted",
    body: `Hello,

We noticed a new sign-in to your GitHub account from a recognized device.

If this was you, no further action is needed.

If you do not recognize this activity, please review your account security settings.

GitHub`,
    linkText: "Review your account",
    linkUrl: "https://github.com/settings/security-log",
    attachment: null,
    redFlags: [],
    explanation:
      "The sender domain is legitimate, the tone is normal, and the link points to the expected GitHub domain.",
    riskLevel: "Low",
  },
  {
    id: 5,
    category: "Delivery Scam",
    difficulty: "Medium",
    type: "phishing",
    senderName: "DHL Express",
    senderEmail: "delivery@dhl-track-help.net",
    subject: "Your package could not be delivered",
    preview: "Update your delivery address to avoid return to sender.",
    date: "2026-04-12 11:05",
    badge: "External",
    body: `Dear customer,

Your parcel could not be delivered due to an address validation issue.

Please confirm your details within 24 hours to avoid return to sender.`,
    linkText: "Update delivery details",
    linkUrl: "http://dhl-delivery-confirm.help/track",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Suspicious link",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This email uses a common delivery scam pattern with urgency and a suspicious non-official tracking domain.",
    riskLevel: "High",
  },
  {
    id: 6,
    category: "Cloud Share Scam",
    difficulty: "Hard",
    type: "phishing",
    senderName: "SharePoint Online",
    senderEmail: "noreply@sharepoint-docs-cloud.com",
    subject: "A document has been shared with you: Q2_Budget_Review.xlsx",
    preview: "Open the secured document to review the latest changes.",
    date: "2026-04-12 14:22",
    badge: "External",
    body: `Hello,

A secure document has been shared with you and requires authentication before viewing.

Please review the file as soon as possible to avoid project delays.`,
    linkText: "Open document",
    linkUrl: "http://sharepoint-secure-access-docs.net/open",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Unexpected document share",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "This phishing email abuses trust in document-sharing platforms and pushes the victim toward a fake login page.",
    riskLevel: "High",
  },
  {
    id: 7,
    category: "IT Support Impersonation",
    difficulty: "Medium",
    type: "phishing",
    senderName: "IT Service Desk",
    senderEmail: "support@company-vpnreset.com",
    subject: "VPN access expires today",
    preview: "Confirm your credentials to prevent remote access disruption.",
    date: "2026-04-12 16:40",
    badge: "External",
    body: `Hello,

Our system indicates that your VPN profile will expire today.

To avoid losing remote access, please validate your account credentials using the secure portal below.`,
    linkText: "Validate VPN account",
    linkUrl: "http://company-vpnreset.com/secure-login",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "This message impersonates internal IT support and uses urgency to steal corporate credentials.",
    riskLevel: "High",
  },
  {
    id: 8,
    category: "Payroll Scam",
    difficulty: "Medium",
    type: "phishing",
    senderName: "Payroll Department",
    senderEmail: "payroll@company-payrolls.com",
    subject: "Updated salary statement for April",
    preview: "Please review the attached salary update confidentially.",
    date: "2026-04-13 08:20",
    badge: "External",
    body: `Hello,

Your updated salary statement for April is now available.

Please review the attached file and confirm receipt today.

Regards,
Payroll Department`,
    linkText: null,
    linkUrl: null,
    attachment: "Salary_Update_April.html",
    redFlags: [
      "Suspicious sender address",
      "Suspicious attachment",
      "External sender",
    ],
    explanation:
      "This email mimics payroll communication but uses an unusual sender and a risky HTML attachment.",
    riskLevel: "High",
  },
  {
    id: 9,
    category: "Supplier Invoice Fraud",
    difficulty: "Hard",
    type: "phishing",
    senderName: "Accounts Receivable",
    senderEmail: "billing@global-supplier-invoices.com",
    subject: "Outstanding invoice requires confirmation",
    preview: "Please validate the attached invoice before end of day.",
    date: "2026-04-13 09:05",
    badge: "External",
    body: `Hello,

We are following up regarding the attached invoice pending confirmation.

Please review the file and process it before close of business to avoid service interruption.`,
    linkText: null,
    linkUrl: null,
    attachment: "Invoice_10482.docm",
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Suspicious attachment",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This scenario uses invoice pressure and a macro-enabled attachment, which is a common malware delivery technique.",
    riskLevel: "Critical",
  },
  {
    id: 10,
    category: "Banking Alert Scam",
    difficulty: "Medium",
    type: "phishing",
    senderName: "Bank Security Center",
    senderEmail: "alerts@secure-bank-verification.net",
    subject: "Suspicious transaction detected on your account",
    preview: "Immediate verification is required to avoid account restriction.",
    date: "2026-04-13 10:11",
    badge: "External",
    body: `Dear client,

We detected a suspicious card transaction on your account.

To prevent temporary restriction, please verify your account activity immediately using the secure form below.`,
    linkText: "Verify transaction",
    linkUrl: "http://secure-bank-verification.net/client-check",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "Generic greeting",
      "External sender",
    ],
    explanation:
      "This email creates fear around account abuse and redirects the victim to a fake banking portal.",
    riskLevel: "High",
  },
  {
    id: 11,
    category: "MFA Fraud",
    difficulty: "Hard",
    type: "phishing",
    senderName: "Security Notifications",
    senderEmail: "notify@auth-microsoft365.net",
    subject: "Multi-factor authentication reset required",
    preview: "A security policy update requires immediate MFA re-enrollment.",
    date: "2026-04-13 11:00",
    badge: "External",
    body: `Hello,

Due to a recent security policy update, all employees must re-enroll their MFA settings today.

Failure to complete the process may result in access interruption.`,
    linkText: "Re-enroll MFA",
    linkUrl: "http://auth-microsoft365.net/revalidate",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Lookalike domain",
      "Urgent language",
      "Credential request",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "The email imitates a trusted authentication workflow and pressures the user into a fake MFA reset.",
    riskLevel: "Critical",
  },
  {
    id: 12,
    category: "Internal Support",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "IT Support",
    senderEmail: "support@company.com",
    subject: "Scheduled maintenance on VPN gateway this weekend",
    preview: "A short service interruption is expected on Saturday.",
    date: "2026-04-13 11:40",
    badge: "Internal",
    body: `Hello team,

Please note that scheduled maintenance will take place on the VPN gateway this Saturday from 07:00 to 09:00.

During this period, remote access may be briefly unavailable.

Regards,
IT Support`,
    linkText: null,
    linkUrl: null,
    attachment: null,
    redFlags: [],
    explanation:
      "This is a normal internal IT maintenance notification with no suspicious indicators.",
    riskLevel: "Low",
  },
  {
    id: 13,
    category: "Document Signature Scam",
    difficulty: "Hard",
    type: "phishing",
    senderName: "DocuSign",
    senderEmail: "documents@docusign-review-center.com",
    subject: "Signature requested: Updated contractor agreement",
    preview: "Please sign the document to avoid onboarding delays.",
    date: "2026-04-13 12:25",
    badge: "External",
    body: `Hello,

A revised contractor agreement is awaiting your signature.

Please complete the signing process today to avoid onboarding delays.`,
    linkText: "Review and sign",
    linkUrl: "http://docusign-review-center.com/access",
    attachment: null,
    redFlags: [
      "Suspicious sender address",
      "Unexpected document share",
      "Urgent language",
      "Suspicious link",
      "External sender",
    ],
    explanation:
      "The message abuses the familiarity of e-signature workflows and pushes the user toward a fake signing portal.",
    riskLevel: "High",
  },
  {
    id: 14,
    category: "Password Change Confirmation",
    difficulty: "Easy",
    type: "legitimate",
    senderName: "Microsoft Account Team",
    senderEmail: "account-security-noreply@account.microsoft.com",
    subject: "Your password was changed",
    preview: "This is a confirmation of a recent password update.",
    date: "2026-04-13 13:10",
    badge: "Trusted",
    body: `Hello,

This is a confirmation that the password for your Microsoft account was successfully changed.

If you made this change, no further action is required.

If you did not make this change, review your recent account activity immediately through the official Microsoft account page.`,
    linkText: "Review account activity",
    linkUrl: "https://account.microsoft.com/security",
    attachment: null,
    redFlags: [],
    explanation:
      "The sender domain and link are legitimate, and the email follows a standard account notification format.",
    riskLevel: "Low",
  },
  {
    id: 15,
    category: "Project Collaboration",
    difficulty: "Medium",
    type: "legitimate",
    senderName: "Project Manager",
    senderEmail: "marie.dubois@company.com",
    subject: "Updated roadmap before tomorrow's review",
    preview: "Please review the latest project notes ahead of the meeting.",
    date: "2026-04-13 14:05",
    badge: "Internal",
    body: `Hi Kevin,

I've updated the project roadmap and added the latest notes for tomorrow's review meeting.

Please take a look when you have a moment, and we will go through the priorities together tomorrow morning.

Thanks,
Marie`,
    linkText: "Open shared notes",
    linkUrl: "https://company.sharepoint.com/sites/projects/roadmap",
    attachment: null,
    redFlags: [],
    explanation:
      "This message is consistent with normal internal collaboration and uses an expected company SharePoint domain.",
    riskLevel: "Low",
  },
];
