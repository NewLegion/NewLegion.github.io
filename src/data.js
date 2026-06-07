/* Mock data + helpers — attached to window.DATA */
(function () {
  const FIRST = ["Sophie","Lucas","Emma","Thomas","Camille","Maxime","Léa","Hugo","Chloé","Antoine",
    "Marie","Julien","Sarah","Nicolas","Laura","David","Manon","Alexandre","Inès","Romain",
    "James","Olivia","Daniel","Hannah","Ethan","Mia","Liam","Ava","Noah","Isabella",
    "Priya","Arjun","Mei","Kenji","Sofia","Diego","Yuki","Omar","Fatima","Lars"];
  const LAST = ["Martin","Bernard","Dubois","Petit","Durand","Leroy","Moreau","Lefebvre","Garcia","Roux",
    "Smith","Johnson","Williams","Brown","Jones","Miller","Davis","Wilson","Anderson","Taylor",
    "Patel","Nguyen","Kim","Tanaka","Rossi","Müller","Andersen","Silva","Costa","Haddad"];
  const COMPANIES = ["Notion","Linear","Vercel","Stripe","Figma","Ramp","Brex","Retool","Airtable","Loom",
    "Pennylane","Qonto","Spendesk","Alan","Doctolib","Back Market","PayFit","Aircall","Swile","Lydia",
    "Datadog","Snowflake","Segment","Amplitude","Mixpanel","Webflow","Zapier","Intercom","Front","Pigment"];
  const TITLES = ["Head of Growth","VP Sales","Founder & CEO","Marketing Manager","Growth Lead","SDR Manager",
    "Chief Revenue Officer","Demand Gen Lead","Head of Marketing","Sales Director","CMO","Revenue Ops Lead",
    "Co-founder","Head of Partnerships","Product Marketing Manager","BDR Team Lead","Head of Sales","COO"];
  const CITIES = ["Paris, FR","London, UK","Berlin, DE","New York, US","Amsterdam, NL","Lisbon, PT",
    "Barcelona, ES","Dublin, IE","Munich, DE","San Francisco, US","Milan, IT","Stockholm, SE"];
  const INDUSTRIES = ["SaaS","Fintech","B2B Software","HealthTech","E-commerce","Cybersecurity","DevTools","MarTech"];

  let _id = 1000;
  function genProfile() {
    const f = FIRST[(Math.random()*FIRST.length)|0];
    const l = LAST[(Math.random()*LAST.length)|0];
    const c = COMPANIES[(Math.random()*COMPANIES.length)|0];
    return {
      id: ++_id,
      first: f, last: l,
      title: TITLES[(Math.random()*TITLES.length)|0],
      company: c,
      domain: c.toLowerCase().replace(/[^a-z]/g,"") + ".com",
      email: f.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"") + "@" + c.toLowerCase().replace(/[^a-z]/g,"") + ".com",
      location: CITIES[(Math.random()*CITIES.length)|0],
      industry: INDUSTRIES[(Math.random()*INDUSTRIES.length)|0],
      connections: 200 + ((Math.random()*2800)|0),
      mutual: (Math.random()*40)|0,
    };
  }
  // pre-generate a stable starter set for tables
  const seedProfiles = Array.from({length: 34}, genProfile);

  const sequences = [
    { id:"sq1", name:"SaaS Founders — Q2", status:"active", channel:"linkedin", prospects:412, color:"#4f46e5",
      sent:1284, opened:0, replied:96, accepted:218, meetings:14, replyRate:23.3, acceptRate:53,
      steps:[
        {id:"s1", type:"visit",   label:"View profile",        wait:0},
        {id:"s2", type:"connect", label:"Connection request",  wait:0, note:"Hi {{first}}, I follow what {{company}} is building in {{industry}} — would love to connect.", sent:412, done:218},
        {id:"s3", type:"delay",   label:"Wait",                wait:2},
        {id:"s4", type:"message", label:"Intro message",       wait:0, note:"Thanks for connecting {{first}}! Quick one — how are you handling outbound at {{company}} right now?", sent:218, done:201, replied:58},
        {id:"s5", type:"delay",   label:"Wait",                wait:3},
        {id:"s6", type:"message", label:"Follow-up",           wait:0, note:"Circling back {{first}} — happy to share the playbook we use, no strings. Worth 15 min?", sent:143, done:140, replied:38},
      ]},
    { id:"sq2", name:"Fintech VPs of Sales", status:"active", channel:"linkedin", prospects:188, color:"#0d9488",
      sent:540, replied:41, accepted:97, meetings:6, replyRate:19.1, acceptRate:51,
      steps:[
        {id:"s1", type:"connect", label:"Connection request", wait:0, note:"Hi {{first}} — connecting with sales leaders in fintech this quarter.", sent:188, done:97},
        {id:"s2", type:"delay", label:"Wait", wait:2},
        {id:"s3", type:"message", label:"Intro message", wait:0, sent:97, done:90, replied:25},
        {id:"s4", type:"delay", label:"Wait", wait:4},
        {id:"s5", type:"inmail", label:"InMail follow-up", wait:0, sent:62, done:60, replied:16},
      ]},
    { id:"sq3", name:"DevTools — cold open", status:"paused", channel:"linkedin", prospects:96, color:"#d97706",
      sent:142, replied:11, accepted:34, meetings:2, replyRate:14.0, acceptRate:35,
      steps:[
        {id:"s1", type:"visit", label:"View profile", wait:0},
        {id:"s2", type:"connect", label:"Connection request", wait:0, sent:96, done:34},
        {id:"s3", type:"delay", label:"Wait", wait:3},
        {id:"s4", type:"message", label:"Intro message", wait:0, sent:34, done:31, replied:11},
      ]},
    { id:"sq4", name:"Webinar no-shows re-engage", status:"draft", channel:"linkedin", prospects:0, color:"#6366f1",
      sent:0, replied:0, accepted:0, meetings:0, replyRate:0, acceptRate:0,
      steps:[
        {id:"s1", type:"connect", label:"Connection request", wait:0},
        {id:"s2", type:"delay", label:"Wait", wait:2},
        {id:"s3", type:"message", label:"Intro message", wait:0},
      ]},
  ];

  const campaigns = [
    { id:"c1", name:"Spring Outbound — Founders", status:"sending", subject:"Quick idea for {{company}}'s pipeline",
      audience:824, sent:612, delivered:601, opened:341, clicked:88, replied:47, bounced:11, unsub:4, color:"#4f46e5",
      schedule:"Sending · 612 / 824", fromName:"Alex Rivera", fromEmail:"alex@growthloop.io" },
    { id:"c2", name:"Product-led trial nudge", status:"scheduled", subject:"You're 1 step from your first campaign",
      audience:340, sent:0, delivered:0, opened:0, clicked:0, replied:0, bounced:0, unsub:0, color:"#0d9488",
      schedule:"Scheduled · Jun 6, 9:00 AM", fromName:"Alex Rivera", fromEmail:"alex@growthloop.io" },
    { id:"c3", name:"Re-engage cold leads", status:"completed", subject:"Still thinking about outbound?",
      audience:1190, sent:1190, delivered:1163, opened:512, clicked:121, replied:63, bounced:27, unsub:14, color:"#7c3aed",
      schedule:"Completed · May 28", fromName:"Alex Rivera", fromEmail:"alex@growthloop.io" },
    { id:"c4", name:"Agency partnership intro", status:"draft", subject:"Partnering with agencies like {{company}}",
      audience:0, sent:0, delivered:0, opened:0, clicked:0, replied:0, bounced:0, unsub:0, color:"#d97706",
      schedule:"Draft", fromName:"Alex Rivera", fromEmail:"alex@growthloop.io" },
  ];

  const updates = [
    { id:"u1", version:"v2.4", title:"Sequences get conditional branches", date:"Jun 2, 2026", status:"published", audience:1840, opened:71,
      tag:"Feature", summary:"You can now branch a sequence on reply, profile views, and custom tags.",
      sections:[
        {type:"feature", title:"Conditional branches", body:"Split any sequence based on whether a prospect replied, viewed your profile, or matches a tag. Build true if/then flows without leaving the canvas."},
        {type:"feature", title:"Reusable message snippets", body:"Save your best-performing openers and drop them into any step with one click."},
        {type:"improvement", title:"Faster CSV import", body:"Imports over 10k rows are now ~4× quicker and dedupe automatically against your existing lists."},
        {type:"fix", title:"Timezone-aware sending windows", body:"Sending windows now respect each prospect's local timezone inferred from their location."},
      ]},
    { id:"u2", version:"v2.3", title:"New analytics: step-level funnels", date:"May 19, 2026", status:"published", audience:1790, opened:68,
      tag:"Feature", summary:"See exactly where prospects drop off, step by step.", sections:[] },
    { id:"u3", version:"v2.5", title:"Inbox & unified replies", date:"Draft", status:"draft", audience:0, opened:0,
      tag:"Coming soon", summary:"Reply to LinkedIn and email conversations from one inbox.", sections:[
        {type:"feature", title:"Unified inbox", body:"All replies across LinkedIn and email, threaded by prospect."},
      ]},
  ];

  // dashboard time series (last 14 days)
  const days = Array.from({length:14}, (_,i)=>({
    d: i,
    sent: 60 + ((Math.sin(i/2)*30)|0) + ((Math.random()*40)|0),
    replies: 8 + ((Math.cos(i/3)*6)|0) + ((Math.random()*9)|0),
  }));

  const activity = [
    { who:"Camille Dubois", company:"Pennylane", action:"replied to", target:"SaaS Founders — Q2", kind:"reply", time:"4m ago" },
    { who:"James Smith", company:"Datadog", action:"accepted your connection", target:"Fintech VPs", kind:"accept", time:"22m ago" },
    { who:"Priya Patel", company:"Ramp", action:"opened", target:"Spring Outbound", kind:"open", time:"38m ago" },
    { who:"Lucas Martin", company:"Qonto", action:"booked a meeting from", target:"SaaS Founders — Q2", kind:"meeting", time:"1h ago" },
    { who:"Mei Kim", company:"Webflow", action:"clicked a link in", target:"Re-engage cold leads", kind:"click", time:"2h ago" },
    { who:"Omar Haddad", company:"Aircall", action:"replied to", target:"Fintech VPs", kind:"reply", time:"3h ago" },
    { who:"Sarah Williams", company:"Front", action:"unsubscribed from", target:"Re-engage cold leads", kind:"unsub", time:"5h ago" },
  ];

  const savedSearches = [
    { name:"SaaS · Heads of Growth · EU", count:412, url:"linkedin.com/sales/search/people?..." },
    { name:"Fintech · VP Sales · 50-500", count:188, url:"linkedin.com/sales/search/people?..." },
    { name:"DevTools founders · Series A+", count:96, url:"linkedin.com/sales/search/people?..." },
  ];

  window.DATA = {
    genProfile, seedProfiles, sequences, campaigns, updates, days, activity, savedSearches,
    COMPANIES, INDUSTRIES, CITIES, TITLES,
    avatarColors: ["#4f46e5","#0d9488","#d97706","#db2777","#2563eb","#7c3aed","#0891b2","#65a30d","#dc2626","#9333ea"],
  };
})();
