export const metrics = [
  {
    label: 'Total Indicators Indexed',
    value: '248.4K',
    change: '+12.6%',
    tone: 'good',
    spark: [24, 22, 20, 18, 13, 15, 10, 8, 5],
  },
  {
    label: 'High Risk IoCs',
    value: '1,284',
    change: '+18 alerts',
    tone: 'bad',
    spark: [18, 12, 15, 9, 12, 7, 10, 4, 8],
  },
  {
    label: 'Active Campaign Clusters',
    value: '46',
    change: '3 emerging',
    tone: 'warn',
    spark: [22, 21, 19, 14, 13, 9, 11, 8, 6],
  },
  {
    label: 'Threat Actors Tracked',
    value: '119',
    change: '+5 mapped',
    tone: 'good',
    spark: [23, 21, 18, 19, 14, 12, 10, 9, 7],
  },
  {
    label: 'Malware Families Mapped',
    value: '62',
    change: 'loader overlap',
    tone: 'warn',
    spark: [22, 20, 19, 17, 16, 11, 8, 7, 6],
  },
  {
    label: 'Enrichment Sources Queried',
    value: '11',
    change: 'avg 421ms',
    tone: 'good',
    spark: [19, 18, 14, 16, 12, 10, 12, 6, 4],
  },
  {
    label: 'Confidence Score Average',
    value: '81%',
    change: 'source overlap',
    tone: 'good',
    spark: [21, 20, 18, 16, 15, 10, 9, 8, 7],
  },
  {
    label: 'Correlated Artifacts',
    value: '9,481',
    change: 'cluster expansion',
    tone: 'bad',
    spark: [23, 21, 17, 18, 13, 11, 7, 8, 5],
  },
];

export const feedItems = [
  {
    title: 'New indicator cluster detected',
    body: '3 infrastructure nodes added to the Amber Steel cluster envelope.',
    age: '12s',
  },
  {
    title: 'Confidence raised on actor attribution',
    body: 'Passive DNS and sandbox overlap improved linkage to Northforge Jackal.',
    age: '43s',
  },
  {
    title: 'Malicious infrastructure updated',
    body: 'Registrar pivot revealed a fallback domain pair and SSL certificate reuse.',
    age: '2m',
  },
  {
    title: 'Signature overlap detected',
    body: 'Loader behaviour matched HollowDrift execution tags and beacon cadence.',
    age: '6m',
  },
];

export const searchExamples = [
  '185.217.143.91',
  'api-helion-sync.com',
  'hollowdrift',
  'A91F0C2E7D32',
  'northforge jackal',
  'billing@sign-secure-mail.com',
];

export const sources = [
  {
    name: 'Internal Intel Feed',
    tone: 'bad',
    verdict: 'malicious',
    confidence: 94,
    responseTime: 118,
    statLabel: 'source score',
    statValue: '94 / 100',
    tags: ['c2', 'botnet', 'campaign overlap'],
  },
  {
    name: 'VirusTotal-like',
    tone: 'warn',
    verdict: 'suspicious',
    confidence: 71,
    responseTime: 402,
    statLabel: 'detections',
    statValue: '18 / 34',
    tags: ['shared infra', 'phishing', 'malware host'],
  },
  {
    name: 'AbuseIPDB-like',
    tone: 'bad',
    verdict: 'abusive',
    confidence: 89,
    responseTime: 289,
    statLabel: 'abuse confidence',
    statValue: '89%',
    tags: ['scanner', 'credential attacks', 'repeated hits'],
  },
  {
    name: 'GreyNoise-like',
    tone: 'info',
    verdict: 'internet noise',
    confidence: 64,
    responseTime: 338,
    statLabel: 'classification certainty',
    statValue: '64%',
    tags: ['opportunistic scan', 'mass probing'],
  },
  {
    name: 'Shodan-like',
    tone: 'warn',
    verdict: 'exposed',
    confidence: 76,
    responseTime: 472,
    statLabel: 'service exposure',
    statValue: '76%',
    tags: ['rdp', 'http alt', 'weak tls cert'],
  },
  {
    name: 'PassiveDNS-like',
    tone: 'bad',
    verdict: 'linked cluster',
    confidence: 83,
    responseTime: 590,
    statLabel: 'relationship overlap',
    statValue: '83%',
    tags: ['3 linked domains', 'amber-steel', 'fast-flux pattern'],
  },
];

export const timelineItems = [
  {
    date: '03 Mar',
    title: 'First seen in internal feed',
    body: 'Initial observation associated with low-volume beaconing toward previously catalogued cloud infrastructure.',
  },
  {
    date: '08 Mar',
    title: 'Matched passive DNS cluster',
    body: 'PassiveDNS overlap linked the IP to two rotating domains used in credential capture and lure redirection.',
  },
  {
    date: '22 Mar',
    title: 'Observed in phishing campaign infrastructure',
    body: 'Campaign telemetry showed domain rotation, certificate reuse and visual lure theming against finance targets.',
  },
  {
    date: '18 Apr',
    title: 'Confidence increased after source overlap',
    body: 'Internal, AbuseIP-like and PassiveDNS-like datasets converged and pushed analyst confidence from 74% to 91%.',
  },
];

export const scoreBreakdown = [
  { label: 'Source overlap', value: 91, tone: 'gold' },
  { label: 'Infrastructure risk', value: 88, tone: 'bad' },
  { label: 'Campaign association', value: 84, tone: 'warn' },
  { label: 'Actor attribution confidence', value: 73, tone: 'info' },
  { label: 'Operational urgency', value: 92, tone: 'gold' },
];

export const graphNodes = [
  { id: 'ip', label: 'IP · 185.217.143.91', x: 50, y: 50, tone: 'bad' },
  { id: 'domain', label: 'Domain · api-helion-sync.com', x: 26, y: 29, tone: 'warn' },
  { id: 'hash', label: 'Hash · a91f…e32c', x: 29, y: 69, tone: 'info' },
  { id: 'campaign', label: 'Campaign · Amber Steel', x: 52, y: 20, tone: 'bad' },
  { id: 'actor', label: 'Actor · Northforge Jackal', x: 74.5, y: 35, tone: 'bad' },
  { id: 'sector', label: 'Sector · Financial Services', x: 77, y: 68, tone: 'good' },
];

export const graphEdges = [
  ['ip', 'domain'],
  ['ip', 'hash'],
  ['ip', 'campaign'],
  ['ip', 'actor'],
  ['ip', 'sector'],
  ['domain', 'campaign'],
  ['domain', 'hash'],
  ['actor', 'sector'],
];

export const campaign = {
  name: 'Amber Steel',
  summary:
    'Credential phishing and staged loader delivery campaign reusing polished enterprise lures and rapidly cycling infrastructure.',
  stats: [
    ['Target sectors', 'Finance, Legal, SaaS'],
    ['Associated malware', 'HollowDrift Loader'],
    ['Infrastructure overlap', '68%'],
    ['Region focus', 'Western Europe'],
  ],
};

export const actor = {
  name: 'Northforge Jackal',
  summary:
    'Clustered actor profile with moderate-to-high sophistication, noted for infrastructure blending, domain camouflage and lure retooling.',
  stats: [
    ['Aliases', 'NFJ, Grey Lantern'],
    ['Sophistication', 'High'],
    ['TTP summary', 'Fast flux · lure chains · loader stage'],
    ['Confidence', '73%'],
  ],
};

export const analystActions = [
  {
    title: 'Block at perimeter',
    body: 'Add the IP and linked domains to firewall, proxy and DNS sinkhole controls with CTI-backed justification.',
  },
  {
    title: 'Retro hunt',
    body: 'Search historical network and EDR telemetry for 443/8443 activity and the linked pivot domains.',
  },
  {
    title: 'Pivot on cert reuse',
    body: 'Expand the investigation through TLS fingerprints, registrar overlap and neighbouring WHOIS artifacts.',
  },
  {
    title: 'Threat hunting package',
    body: 'Build a multi-artifact hunt pack with IP, domains, hashes, campaign tags and observed loader behaviour.',
  },
];

export const indicatorFields = [
  ['Indicator', '185.217.143.91'],
  ['ASN', 'AS204701'],
  ['Country', 'NL · Amsterdam Edge'],
  ['Provider', 'Velstrom Hosting'],
  ['First Seen', '2026-03-04'],
  ['Last Seen', '2026-04-18'],
  ['Open Services', '443, 8443, 3389'],
  ['Linked Domains', 'api-helion-sync.com, cdn-hollowedge.net'],
  ['Abuse Confidence', '89%'],
];

export const indicatorTags = ['fast-flux', 'c2-overlap', 'phishing infra', 'loader delivery', 'shared cert reuse'];

export const scoreSummary = {
  overall: 87,
  posture: 'High Confidence Malicious',
  priority: 'Tier 1 Priority',
  disposition: 'Malicious',
  confidence: '91%',
  classification: 'Command & Control',
  action: 'Contain / Hunt',
};
