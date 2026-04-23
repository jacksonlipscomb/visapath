export type Country = {
  code: string
  name: string
  flag: string
}

export type Purpose = 'tourist' | 'student' | 'student-athlete' | 'work'

export type DocumentItem = {
  name: string
  required: boolean
  description?: string
  whereToGet?: string
}

export type VisaStep = {
  id: number
  title: string
  phase: 'before-applying' | 'applying' | 'interview' | 'pre-departure' | 'on-arrival' | 'in-country'
  description: string
  documents: DocumentItem[]
  tips?: string[]
  estimatedTime?: string
  estimatedCost?: string
  officialLinks?: { label: string; url: string }[]
  interviewPrep?: {
    whatToBring: { item: string; note?: string }[]
    commonQuestions?: string[]
    tips?: string[]
  }
}

export type VisaRoute = {
  id: string
  origin: Country
  destination: Country
  purpose: Purpose
  visaType: string
  processingTime: string
  stayDuration: string
  estimatedCost: string
  summary: string
  athleteNote?: string
  officialLinks: { label: string; url: string }[]
  steps: VisaStep[]
}

export const COUNTRIES: Country[] = [
  { code: 'SE', name: 'Sweden', flag: '🇸🇪' },
  { code: 'US', name: 'United States', flag: '🇺🇸' },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'IN', name: 'India', flag: '🇮🇳' },
]

export const PURPOSES: { value: Purpose; label: string; emoji: string }[] = [
  { value: 'tourist', label: 'Tourist', emoji: '🗺️' },
  { value: 'student', label: 'Student', emoji: '🎓' },
  { value: 'student-athlete', label: 'Student Athlete', emoji: '🏅' },
  { value: 'work', label: 'Work', emoji: '💼' },
]

export const PHASE_LABELS: Record<VisaStep['phase'], string> = {
  'before-applying': 'Before Applying',
  'applying': 'Applying',
  'interview': 'Interview',
  'pre-departure': 'Pre-Departure',
  'on-arrival': 'On Arrival',
  'in-country': 'In Country',
}

// ─────────────────────────────────────────────
// Shared step builders
// ─────────────────────────────────────────────

function makeF1Steps(embassyCity: string, paymentPortalNote: string, extraInterviewTip?: string): VisaStep[] {
  const interviewTips = [
    'Keep your answers short. The officer sees a lot of people. Say what you need to say and stop.',
    `The most important thing you need to show is that you plan to go back home to ${embassyCity === 'London' ? 'the UK' : 'Sweden'} after you graduate. Have a clear answer ready.`,
    'Dress neatly. Business casual is fine.',
    'Do not bring large bags, food, or laptops — check the embassy website for what is allowed.',
  ]
  if (extraInterviewTip) interviewTips.push(extraInterviewTip)

  return [
    {
      id: 1,
      title: 'Get accepted to a SEVP-certified school & receive your I-20',
      phase: 'before-applying',
      description:
        'Apply to a US school that is certified by the Student and Exchange Visitor Program (SEVP). Once you are accepted, the school will give you a document called Form I-20. You need this form to apply for your visa — everything else depends on it.',
      documents: [
        { name: 'Acceptance letter', required: true, description: 'The official offer letter from your US school.' },
        {
          name: 'Form I-20',
          required: true,
          description: 'Your school\'s international office issues this. It has your SEVIS ID number on page 1. Keep every copy you receive.',
          whereToGet: "Your school's international students office",
        },
        {
          name: 'Financial proof',
          required: true,
          description:
            'Show that you have enough money to pay for tuition and living costs. A recent bank statement, scholarship letter, or a letter from whoever is paying for your studies all work.',
        },
        {
          name: 'Valid passport',
          required: true,
          description: 'Your passport needs to be valid for at least 6 months after you plan to leave the US.',
        },
      ],
      tips: [
        'Not every US school is SEVP-certified. Check the list at sevp.ice.gov before you apply anywhere.',
        'Your I-20 has a programme start date on it. Plan your whole visa timeline around that date.',
        'Ask your school for the I-20 as soon as you are accepted. Some schools take 2–4 weeks to send it.',
      ],
      estimatedTime: '2–8 weeks (depends on school)',
      estimatedCost: 'Varies by school (application fees)',
    },
    {
      id: 2,
      title: 'Pay the SEVIS I-901 fee',
      phase: 'before-applying',
      description:
        'The US government charges a fee called the SEVIS I-901 fee. It registers you in their international student tracking system. You pay it online at fmjfee.com. Pay at least 3 business days before your interview.',
      documents: [
        { name: 'Form I-20', required: true, description: 'You need the SEVIS ID number printed at the top of page 1.' },
        {
          name: 'Credit/debit card',
          required: true,
          description: 'Pay at fmjfee.com. Visa, Mastercard, and American Express are accepted.',
        },
        {
          name: 'I-901 payment receipt',
          required: true,
          description: 'Print this or save it as a PDF. You must show it at your interview.',
        },
      ],
      tips: [
        'Wait until you have your I-20 before you pay. The fee is linked to your specific SEVIS ID.',
        'Pay at least 3 business days before your interview — it takes time to process.',
        'Save this receipt permanently. You may need it again every time you re-enter the US.',
      ],
      estimatedTime: '15–30 minutes online',
      estimatedCost: '$350 USD* (F-1 category)',
      officialLinks: [
        { label: 'Pay SEVIS Fee Here', url: 'https://www.fmjfee.com/' },
      ],
    },
    {
      id: 3,
      title: 'Complete Form DS-160 (Online Nonimmigrant Visa Application)',
      phase: 'applying',
      description:
        "The DS-160 is the US government's official visa application form. You fill it in online at ceac.state.gov. It asks about your background, travel history, and study plans. Save your application ID every 20 minutes — the session will time out and you'll lose your work.",
      documents: [
        { name: 'Valid passport', required: true, description: 'You need your passport number, issue date, and expiry date.' },
        {
          name: 'US visa photo',
          required: true,
          description: '51×51 mm photo, white background, taken in the last 6 months. You upload it during the application.',
        },
        { name: 'Form I-20', required: true, description: 'You need your school name, SEVIS ID, programme dates, and your DSO\'s contact details.' },
        { name: 'Travel history', required: true, description: 'Countries you have visited in the last 5 years, with rough dates.' },
        { name: 'Prior US visas', required: true, description: 'Visa numbers from old passports, if you have had US visas before.' },
      ],
      tips: [
        "Write down your DS-160 application ID after every section. If the session times out, you cannot get it back.",
        "If a question does not apply to you, write 'Does Not Apply' — do not leave it blank.",
        'Print the DS-160 confirmation page. It has a barcode on it. The officer scans this at your interview.',
        'Your name must match your passport exactly. Check the spelling carefully.',
        embassyCity === 'London'
          ? 'Select the US Embassy in London as your interview location.'
          : `Select the US Embassy in ${embassyCity} as your interview location.`,
      ],
      estimatedTime: '1–2 hours to complete',
      estimatedCost: 'Free (form submission)',
      officialLinks: [
        { label: 'Open DS-160 Application', url: 'https://ceac.state.gov/genniv/' },
      ],
    },
    {
      id: 4,
      title: 'Pay the MRV visa application fee',
      phase: 'applying',
      description: `The MRV fee is the visa application fee you pay to the US Embassy. It is $185 and it is not refunded if your visa is denied. ${paymentPortalNote} Payment and scheduling happen in the same portal — complete payment first, then log back in to book your interview slot.`,
      documents: [
        { name: 'Credit/debit card', required: true, description: `Pay via the US Embassy ${embassyCity} appointment portal.` },
        {
          name: 'MRV fee receipt',
          required: true,
          description: 'This receipt has a transaction number on it. You need that number to book your interview.',
        },
      ],
      tips: [
        `Only pay through the official US Embassy ${embassyCity} portal. Never use third-party agents.`,
        'Write down your transaction number immediately after paying. Without it, you cannot book your interview.',
        'The $185 fee is not refunded, even if your visa is denied.',
      ],
      estimatedTime: '10–20 minutes',
      estimatedCost: '$185 USD*',
      officialLinks: embassyCity === 'Stockholm'
        ? [{ label: 'Pay MRV fee (USTravelDocs portal)', url: 'https://www.ustraveldocs.com/se/en/' }]
        : [{ label: 'Pay MRV fee (Visa Appointment Service)', url: 'https://ais.usvisa-info.com/en-gb' }],
    },
    {
      id: 5,
      title: `Schedule your visa interview at the US Embassy, ${embassyCity}`,
      phase: 'applying',
      description: `Book your F-1 interview at the US Embassy in ${embassyCity === 'Stockholm' ? 'Stockholm (Dag Hammarskjölds Väg 31, SE-115 89 Stockholm)' : 'London (33 Nine Elms Lane, London SW11 7US)'}. Appointments fill up fast in the spring and summer. Try to book 2–3 months ahead.`,
      documents: [
        { name: 'MRV fee receipt', required: true, description: 'Your transaction number is needed to log in to the booking system.' },
        { name: 'DS-160 barcode', required: true, description: 'Your DS-160 application ID links to your booking.' },
        { name: 'Passport details', required: true, description: 'Your passport number goes on the booking form.' },
      ],
      tips: [
        'Summer appointments can fill up months in advance. Book as early as you can.',
        'You can reschedule once for free if your plans change.',
        `${embassyCity} is the right embassy for ${embassyCity === 'Stockholm' ? 'Swedish' : 'UK'} residents. Do not book at another country's embassy.`,
      ],
      estimatedTime: '15 minutes to book online',
      estimatedCost: 'No additional fee',
      officialLinks: embassyCity === 'Stockholm'
        ? [{ label: 'Schedule your interview (log back into the same portal)', url: 'https://www.ustraveldocs.com/se/en/' }]
        : [{ label: 'Schedule your interview (log back into the same portal)', url: 'https://ais.usvisa-info.com/en-gb' }],
    },
    {
      id: 6,
      title: `Attend the visa interview at the US Embassy, ${embassyCity}`,
      phase: 'interview',
      description: `Arrive 15 minutes early with all your documents in a clear folder. A consular officer will ask about your study plans, how you are paying for school, and your plans to return to ${embassyCity === 'Stockholm' ? 'Sweden' : 'the UK'} after you graduate. Be honest and keep your answers short. Most decisions are made the same day.`,
      documents: [
        { name: 'Valid passport', required: true, description: 'Bring the original, plus any old passports that have previous US visas in them.' },
        {
          name: 'Form I-20',
          required: true,
          description: 'Bring the original. It must be signed by you and your DSO. Do not bring a photocopy only.',
        },
        { name: 'DS-160 confirmation/barcode page', required: true, description: 'Printed. The officer scans the barcode.' },
        { name: 'SEVIS I-901 fee receipt', required: true, description: 'Printed or shown on your phone.' },
        { name: 'MRV fee receipt', required: true, description: 'Printed.' },
        { name: 'Passport photos ×2', required: true, description: '51×51 mm, white background.' },
        {
          name: 'Financial documents',
          required: true,
          description: 'Bank statements, scholarship letters, or sponsor letters. Bring originals and copies.',
        },
        { name: 'School acceptance letter', required: true, description: 'The official offer letter from your US school.' },
        {
          name: `${embassyCity === 'Stockholm' ? 'Swedish' : 'UK'} personal ID`,
          required: false,
          description: 'National ID card or driver\'s licence — useful as a secondary ID.',
        },
        {
          name: `Evidence of ties to ${embassyCity === 'Stockholm' ? 'Sweden' : 'the UK'}`,
          required: false,
          description: 'Something that shows you plan to go back home after studying. A job offer, property, or close family members all help.',
        },
      ],
      tips: interviewTips,
      estimatedTime: 'Allow half a day; interview typically 10–30 minutes',
      estimatedCost: 'No additional fee (MRV already paid)',
      interviewPrep: {
        whatToBring: [
          { item: 'Passport (original)', note: 'Bring any old passports too, especially if they have previous US visas.' },
          { item: 'Form I-20 (original)', note: 'Must be signed by you and your DSO. Do not bring a photocopy only.' },
          { item: 'DS-160 confirmation page', note: 'The printed page with the barcode. The officer scans this.' },
          { item: 'SEVIS I-901 fee receipt', note: 'Printed or on your phone.' },
          { item: 'MRV fee payment receipt', note: 'Proof that you paid the visa application fee.' },
          { item: 'Two passport photos', note: '51×51 mm, white background, taken recently.' },
          { item: 'Bank statements', note: 'Last 3–6 months. Shows you can afford tuition and living costs.' },
          { item: 'Scholarship or funding letter', note: 'If your school or a sponsor is paying, bring their official letter.' },
          { item: 'School acceptance letter', note: 'The official offer from your US university.' },
          { item: 'Evidence of ties to home country', note: 'Something that shows you plan to return home after studying. A job offer, property, or close family works.' },
        ],
        commonQuestions: [
          'Why did you choose this school?',
          'What will you study?',
          'How are you paying for school and living expenses?',
          'What do you plan to do after you graduate?',
          'Do you have family or friends in the US?',
          'Have you visited the US before?',
          'What is your DSO\'s name and contact information?',
        ],
        tips: [
          'Keep your answers short and honest. The officer asks a lot of people the same questions every day.',
          'The most important thing to show is that you plan to go home after you graduate. Be ready to explain why.',
          'Organise all your documents in the order they are listed above before you leave home.',
          'Arrive at least 15 minutes early. You cannot bring large bags or laptops into most embassies.',
        ],
      },
    },
    {
      id: 7,
      title: 'Arrive at the US port of entry',
      phase: 'on-arrival',
      description:
        "Having the visa stamp in your passport does not guarantee you can enter. A CBP officer at the border makes the final call. Keep all your documents in your carry-on bag, not your checked luggage. You can arrive up to 30 days before your I-20 programme start date.",
      documents: [
        { name: 'Passport with F-1 visa stamp', required: true, description: 'The visa stamp you received after your interview was approved.' },
        { name: 'Form I-20', required: true, description: 'Original. Never put this in your checked luggage.' },
        { name: 'Proof of funds', required: true, description: 'A recent bank statement or scholarship letter.' },
        { name: 'School contact details', required: false, description: 'Your DSO\'s name, phone number, email, and school address.' },
        { name: 'Return flight or onward travel plans', required: false, description: 'Shows you intend to leave after your studies.' },
      ],
      tips: [
        "Tell the CBP officer you are a student on an F-1 visa. Never say 'tourist'.",
        'Do not arrive more than 30 days before your I-20 programme start date.',
        'Check your I-94 record within 48 hours of arriving. You do it online at i94.cbp.dhs.gov.',
        'Always keep your I-20 in your carry-on every time you travel internationally.',
      ],
      estimatedTime: '20–60 minutes at CBP',
      estimatedCost: 'No fee',
      officialLinks: [
        { label: 'Verify Your I-94 Record', url: 'https://i94.cbp.dhs.gov/' },
      ],
    },
    {
      id: 8,
      title: 'Maintain your F-1 status throughout your studies',
      phase: 'in-country',
      description:
        'You have to actively keep your F-1 status in good shape. Breaking the rules — even by accident — can end your status. If anything changes in your situation, contact your DSO straight away.',
      documents: [
        {
          name: 'Valid Form I-20',
          required: true,
          description: 'Must stay current. If your programme gets extended, your DSO updates it.',
        },
        {
          name: 'Full-time enrolment confirmation',
          required: true,
          description: 'You must take at least the minimum number of credits each semester.',
        },
        {
          name: 'Work authorisation documents',
          required: true,
          description: 'You can only work on campus (less than 20 hours a week) unless your DSO approves CPT or OPT.',
        },
        {
          name: 'Current US address on file',
          required: true,
          description: 'Tell your DSO within 10 days whenever you move.',
        },
      ],
      tips: [
        'Never drop below full-time enrolment without getting a Reduced Course Load (RCL) approval from your DSO first.',
        'Working off campus without CPT or OPT authorisation is a serious violation. Do not do it.',
        embassyCity === 'London'
          ? 'Keep your passport valid. Renew it at the UK Passport Office or a British consulate before it expires.'
          : 'Keep your passport valid. Renew it at the Swedish Embassy or Consulate in the US before it expires.',
        "Your I-20 has an end date. If you need more time to finish your programme, ask your DSO for an extension before that date — not after.",
      ],
      estimatedTime: 'Ongoing',
      estimatedCost: 'No government fees for status maintenance',
    },
  ]
}

// ─────────────────────────────────────────────
// VISA_ROUTES
// ─────────────────────────────────────────────

const SE: Country = { code: 'SE', name: 'Sweden', flag: '🇸🇪' }
const US: Country = { code: 'US', name: 'United States', flag: '🇺🇸' }
const UK: Country = { code: 'UK', name: 'United Kingdom', flag: '🇬🇧' }
const IN: Country = { code: 'IN', name: 'India', flag: '🇮🇳' }

export const VISA_ROUTES: VisaRoute[] = [
  // ── Route 1: SE → US Student ──────────────────────────────────────────
  {
    id: 'se-us-student',
    origin: SE,
    destination: US,
    purpose: 'student',
    visaType: 'F-1 Student Visa',
    processingTime: '3–6 months total (apply early)',
    stayDuration: 'Duration of study programme + 60-day grace period',
    estimatedCost: '~$535 USD in government fees (SEVIS $350 + MRV $185)',
    summary:
      'The F-1 is the US student visa for full-time academic study. Swedish citizens can visit the US for up to 90 days without a visa, but if you are going to study for longer than that you need an F-1 visa before you leave Sweden.',
    athleteNote:
      'Student athletes use the same F-1 visa as regular students. You also need NCAA Eligibility Center clearance. Your athletic department handles that separately — start it at the same time as your visa application.',
    officialLinks: [
      { label: 'US Student Visas — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'Study in the States — studyinthestates.dhs.gov', url: 'https://studyinthestates.dhs.gov' },
      { label: 'SEVIS I-901 Fee — fmjfee.com', url: 'https://www.fmjfee.com' },
    ],
    steps: makeF1Steps(
      'Stockholm',
      'For Sweden, pay online through the US Embassy Sweden portal (cgifederal.com) before scheduling your interview.',
    ),
  },

  // ── Route 2: SE → US Student-Athlete ────────────────────────────────
  {
    id: 'se-us-student-athlete',
    origin: SE,
    destination: US,
    purpose: 'student-athlete',
    visaType: 'F-1 Student Visa',
    processingTime: '3–6 months total (apply early)',
    stayDuration: 'Duration of study programme + 60-day grace period',
    estimatedCost: '~$535 USD in government fees (SEVIS $350 + MRV $185)',
    summary:
      'Student athletes use the same F-1 visa as regular students. Swedish citizens need an F-1 for academic stays longer than 90 days. NCAA athletes also need Eligibility Center clearance — start that process at the same time as your visa application.',
    athleteNote:
      'Student athletes use the same F-1 visa but must also obtain NCAA Eligibility Center clearance. Your athletic department handles this separately — start the eligibility process simultaneously with your visa application.',
    officialLinks: [
      { label: 'US Student Visas — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'Study in the States — studyinthestates.dhs.gov', url: 'https://studyinthestates.dhs.gov' },
      { label: 'SEVIS I-901 Fee — fmjfee.com', url: 'https://www.fmjfee.com' },
      { label: 'NCAA Eligibility Center — eligibilitycenter.org', url: 'https://www.eligibilitycenter.org' },
    ],
    steps: makeF1Steps(
      'Stockholm',
      'For Sweden, pay online through the US Embassy Sweden portal (cgifederal.com) before scheduling your interview.',
    ),
  },

  // ── Route 3: SE → US Tourist ─────────────────────────────────────────
  {
    id: 'se-us-tourist',
    origin: SE,
    destination: US,
    purpose: 'tourist',
    visaType: 'ESTA (Visa Waiver Program)',
    processingTime: 'Usually 72 hours for ESTA approval; allow 1 week',
    stayDuration: 'Up to 90 days per visit',
    estimatedCost: '~$21 USD (ESTA fee)',
    summary:
      'Swedish citizens can travel to the US without a visa through the Visa Waiver Program. You just need to apply for ESTA — Electronic System for Travel Authorisation — online before you travel. ESTA is valid for 2 years and lets you make multiple trips, each up to 90 days.',
    officialLinks: [
      { label: 'ESTA Application — esta.cbp.dhs.gov', url: 'https://esta.cbp.dhs.gov' },
      { label: 'Visa Waiver Program — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visa-waiver-program.html' },
    ],
    steps: [
      {
        id: 1,
        title: 'Check ESTA eligibility',
        phase: 'before-applying',
        description:
          'Make sure you qualify for the Visa Waiver Program before you apply. Swedish citizens usually qualify. But if you have previously travelled to certain countries — like Cuba, Iran, Iraq, Libya, North Korea, Somalia, Sudan, Syria, or Yemen after 2011 — you will need a B-2 visa instead of ESTA.',
        documents: [
          {
            name: 'Valid Swedish passport',
            required: true,
            description: 'Must be an e-Passport (it has a chip in it). Must be valid for your entire trip.',
          },
          {
            name: 'Travel history records',
            required: false,
            description: 'If you have travelled to restricted countries, check whether you need a B-2 visa instead.',
          },
        ],
        tips: [
          'If you have dual nationality with a country on the restricted list, check travel.state.gov before applying for ESTA.',
          'Every traveller needs their own ESTA — including children.',
          'ESTA is only for tourism, business, or transit. It does not cover study or work.',
        ],
        estimatedTime: '30 minutes to verify eligibility',
        estimatedCost: 'Free (eligibility check)',
      },
      {
        id: 2,
        title: 'Apply for ESTA at esta.cbp.dhs.gov',
        phase: 'applying',
        description:
          'Fill in the ESTA application at the official US government website, esta.cbp.dhs.gov. Do not use any other website — many copycat sites charge $60–$90 for the same thing. The real fee is just $21. Most approvals come through in minutes. Apply at least 72 hours before your flight.',
        documents: [
          { name: 'Swedish e-Passport', required: true, description: 'You need your passport number and personal details. It must have a chip.' },
          { name: 'Credit/debit card', required: true, description: 'The fee is $21. Visa, Mastercard, and PayPal are accepted.' },
          {
            name: 'US travel details',
            required: true,
            description: 'The first address you will stay at in the US, and your flight details if you have them.',
          },
          { name: 'Emergency contact', required: true, description: 'A name and phone number.' },
        ],
        tips: [
          'Only use esta.cbp.dhs.gov. Many fake sites charge $60–$90 for the same service.',
          'Your ESTA is valid for 2 years from approval or until your passport expires — whichever comes first.',
          'Each trip is limited to 90 days. You cannot extend a VWP stay or switch to a student visa while inside the US.',
          'Save or print your ESTA approval. Some airlines ask to see it at check-in.',
        ],
        estimatedTime: '20–30 minutes',
        estimatedCost: '$21 USD',
        officialLinks: [
          { label: 'Apply for ESTA', url: 'https://esta.cbp.dhs.gov/' },
        ],
      },
      {
        id: 3,
        title: 'Arrive at the US port of entry',
        phase: 'on-arrival',
        description:
          'Show your passport and fill in the Electronic Customs Declaration at the CBP officer\'s desk. With ESTA, there is no paper I-94 form to fill in — the system creates your entry record automatically.',
        documents: [
          { name: 'Valid Swedish passport with ESTA approval', required: true },
          { name: 'CBP Mobile or paper customs declaration', required: true },
          { name: 'Return flight details', required: false, description: 'Shows you plan to leave within 90 days.' },
          { name: 'Hotel/accommodation confirmation', required: false },
        ],
        tips: [
          'Check your I-94 entry record within 48 hours at i94.cbp.dhs.gov.',
          'The officer may ask about your plans, where you are staying, and how much money you have. Keep answers short.',
          'You cannot work or study on ESTA. Be honest about your plans.',
        ],
        estimatedTime: '20–60 minutes at CBP',
        estimatedCost: 'No fee at entry',
        officialLinks: [
          { label: 'Verify Your I-94 Record', url: 'https://i94.cbp.dhs.gov/' },
        ],
      },
      {
        id: 4,
        title: 'Follow VWP rules during your stay',
        phase: 'in-country',
        description:
          'You cannot extend an ESTA/VWP stay, and you cannot switch to a different visa category (like a student visa) from inside the US. If your plans change, you need to leave the US and apply for the right visa before coming back.',
        documents: [
          { name: 'Passport', required: true, description: 'Keep it somewhere safe.' },
          {
            name: 'I-94 electronic record',
            required: true,
            description: 'Check it at i94.cbp.dhs.gov. It shows exactly how long you are allowed to stay.',
          },
        ],
        tips: [
          '90 days is the absolute limit. Overstaying bans you from the Visa Waiver Program and can hurt future US visa applications.',
          'If you decide you want to study or work, leave the US first and apply for the right visa.',
          'If you have a genuine emergency and need to stay longer, contact a US immigration attorney.',
        ],
        estimatedTime: 'Up to 90 days',
        estimatedCost: 'No fees',
      },
    ],
  },

  // ── Route 4: SE → US Work ─────────────────────────────────────────────
  {
    id: 'se-us-work',
    origin: SE,
    destination: US,
    purpose: 'work',
    visaType: 'H-1B Specialty Occupation Visa',
    processingTime: '6–12 months (lottery in March, visa stamping thereafter)',
    stayDuration: '3 years (renewable up to 6 years)',
    estimatedCost: '$3,000–$6,000+ USD (mostly employer-paid)',
    summary:
      'The H-1B is the main work visa for skilled jobs like tech, engineering, finance, and healthcare. You cannot apply for it yourself — a US employer has to sponsor you. There are more applicants than spots available each year, so USCIS runs a lottery in March. Even after USCIS approves your application, Swedish citizens still need to get a visa stamp at the US Embassy in Stockholm.',
    officialLinks: [
      { label: 'H-1B Visa — uscis.gov', url: 'https://www.uscis.gov/working-in-the-united-states/h-1b-specialty-occupations' },
      { label: 'Nonimmigrant Visas — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/employment/h1b-specialty-occupations.html' },
    ],
    steps: [
      {
        id: 1,
        title: 'Secure a US employer willing to sponsor H-1B',
        phase: 'before-applying',
        description:
          "You cannot apply for an H-1B yourself. A US employer has to be your sponsor — they file the paperwork and pay most of the fees. Start looking for a sponsoring job 12–18 months before you want to start work.",
        documents: [
          {
            name: 'Job offer letter',
            required: true,
            description: 'States your job title, salary, and that the employer will sponsor your H-1B.',
          },
          {
            name: 'Degree certificates and transcripts',
            required: true,
            description: "You need at least a bachelor's degree in a field related to the job.",
          },
          {
            name: 'Professional credentials/licences',
            required: false,
            description: 'Especially if you work in healthcare, engineering, or another licensed field.',
          },
        ],
        tips: [
          "H-1B is for specialty jobs — usually ones that require at least a bachelor's degree in a specific subject.",
          'Employers must pay the base filing fees by law. Check what your employer will cover before you accept an offer.',
          "If you are on Optional Practical Training (OPT) after finishing a US degree, use that time to find an H-1B sponsor.",
          'Universities, non-profits, and some research organisations are exempt from the lottery — they can file any time of year.',
        ],
        estimatedTime: 'Months of job searching',
        estimatedCost: 'No direct cost to you (employer pays)',
        officialLinks: [
          { label: 'USCIS H-1B Info', url: 'https://www.uscis.gov/working-in-the-united-states/temporary-workers/h-1b-specialty-occupations' },
        ],
      },
      {
        id: 2,
        title: 'Employer files H-1B lottery registration (March)',
        phase: 'applying',
        description:
          'Every March, USCIS opens a registration window where employers enter their sponsored candidates into the H-1B lottery. Your employer submits a registration on your behalf. If you are selected — roughly a 20–30% chance for most people — the employer can then file your full application.',
        documents: [
          { name: "Employer EIN", required: true, description: "Your employer's tax ID number. They use it to register." },
          { name: 'Your passport details', required: true, description: 'Your name exactly as it appears on your passport.' },
          {
            name: 'Degree verification',
            required: true,
            description: "Your education level affects which lottery you enter. If you have a US master's degree, you get entered into a second pool that gives you a better chance.",
          },
        ],
        tips: [
          "If you have a US master's degree, ask your employer to register you for the master's cap — it gives you two chances in the lottery.",
          'The lottery is random. Getting selected is not guaranteed, even if you try for several years.',
          'If you are not selected, other options include employers exempt from the cap, the L-1 visa (for internal company transfers), or the O-1 visa (for people with extraordinary skills).',
        ],
        estimatedTime: '2 weeks for registration (March 1–18 window)',
        estimatedCost: '$215 USD registration fee (paid by employer)',
      },
      {
        id: 3,
        title: 'Employer files full H-1B petition (I-129) with USCIS',
        phase: 'applying',
        description:
          'If you are selected in the lottery, your employer files Form I-129 with USCIS, usually in April. The employer can pay for faster processing ($2,805 for a 15-day turnaround). Standard processing takes 3–6 months.',
        documents: [
          { name: 'Form I-129', required: true, description: 'Your employer files this. You provide supporting documents.' },
          {
            name: 'Labor Condition Application (LCA)',
            required: true,
            description: 'Your employer gets this from the Department of Labor. It certifies they are paying you the going rate for your job.',
          },
          { name: 'Degree certificates', required: true, description: 'Official transcripts and your diploma.' },
          {
            name: 'Expert opinion letter',
            required: false,
            description: 'If your degree is from outside the US, you may need a credential evaluation from a NACES-accredited service.',
          },
          { name: 'Passport copy', required: true },
          {
            name: 'Current visa status documents',
            required: false,
            description: "If you are already in the US: your I-94, current visa, and so on.",
          },
        ],
        tips: [
          'Ask your employer for copies of everything they send to USCIS. You will need it at your visa interview.',
          "If you are outside the US when your petition is approved, you will need to get your visa stamp at the US Embassy in Stockholm.",
          'Premium Processing ($2,805) is worth considering if your start date is coming up fast.',
        ],
        estimatedTime: '3–6 months standard; 15 days premium',
        estimatedCost: '$730–$2,805+ USD (filing + premium, mostly employer-paid)',
      },
      {
        id: 4,
        title: 'Apply for H-1B visa stamp at US Embassy, Stockholm',
        phase: 'applying',
        description:
          'After USCIS approves your I-129, you need to get an actual visa stamp in your passport. You do this at the US Embassy in Stockholm. Fill in Form DS-160, pay the $185 MRV fee, and attend an interview.',
        documents: [
          { name: 'USCIS approval notice (Form I-797)', required: true, description: 'The original approval letter from USCIS. This is your most important document.' },
          { name: 'Valid passport', required: true },
          { name: 'Form DS-160', required: true, description: 'Filled in at ceac.state.gov.' },
          { name: 'MRV fee receipt', required: true, description: '$185 paid through the US Embassy Sweden portal.' },
          { name: 'Employment offer letter', required: true },
          { name: 'LCA approval notice', required: true },
          { name: 'Degree certificates', required: true },
          {
            name: 'Pay stubs or contract',
            required: true,
            description: 'Proof that your job qualifies as a specialty occupation at the prevailing wage.',
          },
        ],
        tips: [
          'The interview is straightforward. Be ready to describe your job in simple terms and explain your qualifications.',
          'Book your Stockholm appointment early — processing times vary.',
          "If your petition was approved while you were inside the US on another visa, you may be able to change status without going to Stockholm. Ask your employer's immigration attorney.",
        ],
        estimatedTime: '2–6 weeks post-USCIS approval',
        estimatedCost: '$185 USD MRV fee',
        officialLinks: [
          { label: 'Open DS-160 Application', url: 'https://ceac.state.gov/genniv/' },
          { label: 'Book Stockholm Appointment', url: 'https://ais.usvisa-info.com/en-se/niv' },
        ],
        interviewPrep: {
          whatToBring: [
            { item: 'Passport (original)', note: 'Valid and not expiring soon.' },
            { item: 'USCIS approval notice (Form I-797)', note: 'The original approval letter from USCIS. This is your most important document.' },
            { item: 'DS-160 confirmation page', note: 'Printed barcode page.' },
            { item: 'MRV fee receipt', note: 'Proof of the $185 fee payment.' },
            { item: 'Two passport photos', note: '51×51 mm, white background.' },
            { item: 'Job offer letter', note: 'On company letterhead, stating your title, salary, and start date.' },
            { item: 'Labor Condition Application (LCA)', note: 'Your employer gets this from the Department of Labor. Ask them for a copy.' },
            { item: 'Degree certificates and transcripts', note: 'From every university you attended.' },
            { item: 'Pay stubs or employment contract', note: 'Proof of your expected salary.' },
          ],
          commonQuestions: [
            'What will you be doing in your job?',
            'How long have you worked in this field?',
            'What is your employer\'s name and what do they do?',
            'Where will you be based in the US?',
            'What is your salary?',
          ],
          tips: [
            'H-1B interviews at the Stockholm embassy are usually straightforward. Be ready to describe your job in simple terms.',
            'Bring originals and photocopies of everything.',
            'Your employer\'s immigration attorney can tell you exactly what documents to bring — ask them.',
          ],
        },
      },
      {
        id: 5,
        title: 'Enter the US on H-1B',
        phase: 'on-arrival',
        description:
          'Travel to the US with your H-1B visa stamped passport and your USCIS approval notice. You can only work for the employer who sponsored you. You cannot freelance or work for other employers unless they file a separate petition.',
        documents: [
          { name: 'Passport with H-1B visa stamp', required: true },
          { name: 'Form I-797 USCIS approval notice', required: true, description: 'Carry the original in your carry-on bag.' },
          { name: 'Employment offer letter', required: true },
        ],
        tips: [
          "Your I-94 should show 'H-1B' status and the dates your petition covers.",
          'You can only work for the employer who sponsored you. If you change jobs, your new employer must file a new H-1B petition.',
          'Keep track of your petition expiry date. Your employer needs to file for an extension 6 months before it expires.',
        ],
        estimatedTime: 'Standard CBP processing',
        estimatedCost: 'No additional fee',
      },
      {
        id: 6,
        title: 'Maintain H-1B status and plan for extension or Green Card',
        phase: 'in-country',
        description:
          "Your H-1B is tied to your employer. If you change jobs, your new employer files a new petition. You get 3 years initially, renewable up to 6. Many H-1B holders eventually apply for a Green Card through their employer — start that conversation early.",
        documents: [
          {
            name: 'Valid H-1B approval notice',
            required: true,
            description: 'Keep an eye on the expiry dates.',
          },
          { name: 'Pay stubs', required: true, description: 'Evidence that your employer is paying you the agreed salary.' },
          {
            name: 'Updated LCA',
            required: true,
            description: "Your employer needs to update this if your role, location, or salary changes significantly.",
          },
        ],
        tips: [
          "If your employer sponsors you for a Green Card, you may be eligible for H-1B extensions beyond 6 years.",
          'When travelling abroad, make sure your H-1B visa stamp is still valid. Without a valid stamp you cannot re-enter.',
          "If you lose your job, you have a 60-day grace period to find a new H-1B sponsor or leave the US.",
        ],
        estimatedTime: '3-year initial period, renewable',
        estimatedCost: 'Extension fees similar to initial petition (mostly employer-paid)',
      },
    ],
  },

  // ── Route 5: US → SE Student ─────────────────────────────────────────
  {
    id: 'us-se-student',
    origin: US,
    destination: SE,
    purpose: 'student',
    visaType: 'Student Residence Permit (Uppehållstillstånd)',
    processingTime: '1–4 months (Migrationsverket)',
    stayDuration: 'Duration of programme (extendable)',
    estimatedCost: '~1,000 SEK (≈$95 USD) application fee',
    summary:
      'US citizens can visit Sweden for up to 90 days without a visa. But if you are going to study for longer than that, you need a Student Residence Permit from the Swedish Migration Agency (Migrationsverket). Apply at least 3 months before your programme starts.',
    officialLinks: [
      { label: 'Migrationsverket — Student Permits', url: 'https://www.migrationsverket.se/English/Private-individuals/Studying-in-Sweden.html' },
      { label: 'University Admissions Sweden', url: 'https://www.universityadmissions.se' },
    ],
    steps: [
      {
        id: 1,
        title: 'Apply to a Swedish university and receive your admission letter',
        phase: 'before-applying',
        description:
          'Apply through universityadmissions.se, which covers most Swedish universities, or apply directly to the school. Most programmes taught in English are listed on universityadmissions.se. Once you are accepted, you will get an official admission letter — you need this to apply for your residence permit.',
        documents: [
          { name: 'Completed university application', required: true, description: 'Via universityadmissions.se or directly to the school.' },
          { name: 'Academic transcripts and diplomas', required: true, description: 'Translated into English or Swedish if they are not already.' },
          { name: 'English proficiency proof', required: true, description: 'TOEFL, IELTS, or an equivalent test.' },
          { name: 'Application fee receipt', required: true, description: '900 SEK for applications through universityadmissions.se.' },
        ],
        tips: [
          'The application deadline for the autumn semester is usually January 15. Check well in advance.',
          'Swedish universities want official transcripts — get them from your school early.',
          'Some programmes ask for GRE or GMAT scores. Check the requirements for each programme you are applying to.',
          'universityadmissions.se handles most universities, but some — like KTH and Chalmers — also have their own portals.',
        ],
        estimatedTime: '1–3 months (university review)',
        estimatedCost: '900 SEK application fee (≈$85 USD)',
        officialLinks: [
          { label: 'Apply to Swedish Universities', url: 'https://www.universityadmissions.se/' },
        ],
      },
      {
        id: 2,
        title: 'Confirm financial means',
        phase: 'before-applying',
        description:
          'Migrationsverket wants to see that you can support yourself while you study without needing to work illegally. You need to show roughly 10,400 SEK per month (about $980 USD) for the full length of your programme.',
        documents: [
          { name: 'Bank statements', required: true, description: 'Showing you have enough money to cover your whole time in Sweden.' },
          { name: 'Scholarship documentation', required: false, description: 'An official letter from the university or scholarship body confirming how much they are paying you.' },
          { name: 'Parental/sponsor support letter', required: false, description: 'With bank statements from the person supporting you.' },
          { name: 'Student loan approval', required: false, description: 'For example, approval from US Federal Student Aid or a private lender.' },
        ],
        tips: [
          'The requirement is roughly 10,400 SEK per month. Multiply that by your programme length to know how much you need.',
          'A scholarship letter from the university can cover this requirement entirely.',
          'Swedish student loans (CSN) are for EU residents. As a US citizen, you will not qualify.',
        ],
        estimatedTime: 'Gather documents while awaiting admission',
        estimatedCost: 'No fee (document gathering)',
      },
      {
        id: 3,
        title: 'Submit residence permit application to Migrationsverket',
        phase: 'applying',
        description:
          'Apply for your Student Residence Permit online at migrationsverket.se. If you are already in Sweden, apply before your 90-day Schengen stay runs out. The best approach is to apply from the US before you travel.',
        documents: [
          { name: 'Valid US passport', required: true, description: 'Must be valid for at least 3 months past your programme end date.' },
          { name: 'University admission letter', required: true, description: 'The official acceptance letter from your Swedish university.' },
          { name: 'Proof of financial means', required: true, description: 'Bank statements, scholarship letter, or sponsor documentation.' },
          { name: 'Passport photo', required: true, description: 'Uploaded digitally to the Migrationsverket portal.' },
          { name: 'Application fee', required: true, description: '1,000 SEK — about $95 USD — paid online.' },
        ],
        tips: [
          'Apply as soon as you get your admission letter. Processing takes 1–4 months.',
          "If you arrive in Sweden before your permit is approved, you can stay on your 90-day Schengen right while you wait — but do not overstay.",
          "Track your application with the reference number Migrationsverket gives you.",
          'You may need to visit a Swedish consulate in the US to give fingerprints and a photo. Check migrationsverket.se for current requirements.',
        ],
        estimatedTime: '1–4 months processing',
        estimatedCost: '1,000 SEK (≈$95 USD)',
        officialLinks: [
          { label: 'Apply at Migrationsverket', url: 'https://www.migrationsverket.se/English/Private-individuals/Studying-and-researching-in-Sweden/Higher-education.html' },
        ],
      },
      {
        id: 4,
        title: 'Provide biometrics at a Swedish consulate or in Sweden',
        phase: 'applying',
        description:
          'Migrationsverket needs your fingerprints and a digital photo for your residence permit card. If you are applying from the US, you do this at a Swedish consulate. If you are already in Sweden, go to a Migrationsverket service centre.',
        documents: [
          { name: 'Application reference number', required: true, description: 'From your online application.' },
          { name: 'Valid US passport', required: true },
          { name: 'Migrationsverket appointment confirmation', required: true },
        ],
        tips: [
          'Book your biometrics appointment as soon as you submit your application. Wait times at consulates vary.',
          'Swedish consulates in the US are in Washington DC, New York, Los Angeles, Chicago, Houston, and Minneapolis.',
          'Anyone aged 6 or over needs to give biometrics.',
        ],
        estimatedTime: '1–2 hours at consulate',
        estimatedCost: 'No additional fee (included in application fee)',
      },
      {
        id: 5,
        title: 'Receive your residence permit card and travel to Sweden',
        phase: 'on-arrival',
        description:
          'Migrationsverket will send your residence permit card (uppehållstillståndskort) to your Swedish address or the consulate. Once you have it, you can travel. If you are staying more than 1 year, register with the Swedish Tax Agency (Skatteverket) after you arrive.',
        documents: [
          { name: 'Residence permit card', required: true, description: 'The physical card. Show it at the Swedish border.' },
          { name: 'US passport', required: true },
          { name: 'Admission letter', required: false, description: 'Useful to have if Swedish border control asks any questions.' },
        ],
        tips: [
          'Check that your permit covers your full study period. If your programme is longer than the card, you will need to extend.',
          'If you are staying more than 12 months, register with Skatteverket to get a Swedish personal identity number (personnummer).',
          'The personnummer opens up Swedish healthcare, banking, and more. Get it as soon as you can.',
        ],
        estimatedTime: 'Standard border crossing',
        estimatedCost: 'No additional fee',
      },
      {
        id: 6,
        title: 'Study in Sweden and maintain your residence permit',
        phase: 'in-country',
        description:
          'Stay enrolled full-time and keep proving you can support yourself financially. If you need more time to finish, apply for an extension 3 months before your permit expires.',
        documents: [
          { name: 'Valid residence permit card', required: true, description: 'Renew it before it expires at migrationsverket.se.' },
          { name: 'Enrolment verification', required: true, description: 'Your university gives you this each semester.' },
          { name: 'Updated financial proof', required: false, description: 'Needed when you apply for an extension.' },
        ],
        tips: [
          'Check the current Migrationsverket rules on working while studying — the rules have changed in recent years.',
          'Apply for your extension at least 3 months before your permit expires. Do not leave it to the last week.',
          'After 5 years of living in Sweden you may qualify for permanent residency. Keep track of how long you have been here.',
        ],
        estimatedTime: 'Duration of programme',
        estimatedCost: 'Extension: 1,000 SEK',
      },
    ],
  },

  // ── Route 6: US → SE Tourist ─────────────────────────────────────────
  {
    id: 'us-se-tourist',
    origin: US,
    destination: SE,
    purpose: 'tourist',
    visaType: 'Visa-free entry (Schengen Agreement)',
    processingTime: 'No application required',
    stayDuration: 'Up to 90 days in any 180-day period (entire Schengen Zone)',
    estimatedCost: '$0 (no visa fee)',
    summary:
      'US citizens do not need a visa to visit Sweden or any other Schengen country. You can stay up to 90 days in any 180-day period across the whole 29-country Schengen Zone — not just Sweden. From 2025, you need ETIAS pre-travel authorisation before you travel. It is a simple online application, not a visa.',
    officialLinks: [
      { label: 'ETIAS — europa.eu', url: 'https://travel-europe.europa.eu/etias_en' },
      { label: 'Visit Sweden', url: 'https://visitsweden.com' },
    ],
    steps: [
      {
        id: 1,
        title: 'Apply for ETIAS (EU Travel Information and Authorisation System)',
        phase: 'before-applying',
        description:
          'Since 2025, US citizens need ETIAS before entering the Schengen Area. ETIAS is not a visa — it is an online pre-travel check, similar to the US ESTA system. Apply at the official ETIAS website at least 96 hours (4 days) before you fly.',
        documents: [
          {
            name: 'Valid US passport',
            required: true,
            description: 'Must be valid for at least 3 months after you plan to leave the Schengen Area.',
          },
          { name: 'Email address', required: true, description: 'You will get your ETIAS approval by email.' },
          {
            name: 'Credit/debit card',
            required: true,
            description: 'The fee is €7. Free if you are under 18 or over 70.',
          },
          { name: 'Travel itinerary', required: false, description: 'The first Schengen country you are entering and your accommodation details.' },
        ],
        tips: [
          'ETIAS is valid for 3 years or until your passport expires — whichever is sooner.',
          'If your ETIAS is denied, you can apply for a Schengen visa at a Swedish consulate instead. Denials are rare for US citizens.',
          'One ETIAS covers the entire Schengen Area. You do not need a separate one for each country.',
          'Do not use third-party ETIAS websites. They charge more for the same thing.',
        ],
        estimatedTime: '20–30 minutes to apply; approval typically within minutes to 96 hours',
        estimatedCost: '€7 EUR (≈$7.50 USD)',
        officialLinks: [
          { label: 'Apply for ETIAS', url: 'https://travel-europe.europa.eu/etias_en' },
        ],
      },
      {
        id: 2,
        title: 'Arrive in Sweden and clear passport control',
        phase: 'on-arrival',
        description:
          'At passport control, show your US passport with your ETIAS. The officer will stamp your passport and note your entry date. That starts your 90-day clock. Remember — the 90 days counts across the whole Schengen Zone, not just the days you spend in Sweden.',
        documents: [
          { name: 'Valid US passport', required: true, description: 'With your ETIAS approval linked to it.' },
          { name: 'ETIAS authorisation', required: true, description: 'Your confirmation email or reference number.' },
          { name: 'Return ticket', required: false, description: 'Shows you plan to leave within 90 days.' },
          { name: 'Accommodation proof', required: false, description: 'Hotel booking or a letter from whoever you are staying with.' },
          { name: 'Proof of funds', required: false, description: 'Credit card or bank statement.' },
        ],
        tips: [
          'The 90-day limit resets after 90 days outside the entire Schengen Zone — not just Sweden.',
          'Entry is at the border officer\'s discretion. Have your accommodation and funds information ready to explain.',
          'If you flew into another Schengen country first, your 90 days started at that entry point, not when you crossed into Sweden.',
        ],
        estimatedTime: 'Standard passport control',
        estimatedCost: 'No fee',
      },
      {
        id: 3,
        title: 'Follow the 90/180-day Schengen rule',
        phase: 'in-country',
        description:
          'You can spend a maximum of 90 days in any rolling 180-day window across all Schengen countries combined. Track your days carefully. Overstaying gets you fined, deported, and possibly banned from future visits.',
        documents: [
          { name: 'Valid passport with entry stamp', required: true },
          { name: 'ETIAS confirmation', required: true },
        ],
        tips: [
          'Use the official Schengen Calculator at ec.europa.eu to check how many days you have left.',
          'Schengen countries include: Austria, Belgium, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland, and more.',
          'If you want to stay longer than 90 days, you need to leave the Schengen Zone for 90 days first, or apply for a Swedish residence permit before your current visit ends.',
        ],
        estimatedTime: 'Up to 90 days per 180-day period',
        estimatedCost: 'No fees',
      },
    ],
  },

  // ── Route 7: UK → US Student ─────────────────────────────────────────
  {
    id: 'uk-us-student',
    origin: UK,
    destination: US,
    purpose: 'student',
    visaType: 'F-1 Student Visa',
    processingTime: '3–6 months total',
    stayDuration: 'Duration of study programme + 60-day grace period',
    estimatedCost: '~$535 USD in government fees (SEVIS $350 + MRV $185)',
    summary:
      'UK citizens can visit the US for short stays without a visa, but any academic study requires an F-1 visa. The process is almost the same as for Swedish citizens, except your interview is at the US Embassy in London (33 Nine Elms Lane, London SW11 7US).',
    officialLinks: [
      { label: 'US Student Visas — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'Study in the States — studyinthestates.dhs.gov', url: 'https://studyinthestates.dhs.gov' },
      { label: 'SEVIS I-901 Fee — fmjfee.com', url: 'https://www.fmjfee.com' },
    ],
    steps: makeF1Steps(
      'London',
      'UK MRV fees are paid through the US Embassy UK appointment portal before scheduling your interview.',
      'UK applicants are often asked about post-study plans and whether they intend to work in the UK after graduating. Have a clear, honest answer ready about your plans to return to the UK.',
    ),
  },

  // ── Route 8: UK → US Tourist ─────────────────────────────────────────
  {
    id: 'uk-us-tourist',
    origin: UK,
    destination: US,
    purpose: 'tourist',
    visaType: 'ESTA (Visa Waiver Program)',
    processingTime: 'Usually instant to 72 hours',
    stayDuration: 'Up to 90 days per visit',
    estimatedCost: '~$21 USD',
    summary:
      'UK citizens can travel to the US without a visa through the Visa Waiver Program. You just need to apply for ESTA before you travel at esta.cbp.dhs.gov. ESTA is valid for 2 years and lets you make multiple trips, each limited to 90 days.',
    officialLinks: [
      { label: 'ESTA Application — esta.cbp.dhs.gov', url: 'https://esta.cbp.dhs.gov' },
      { label: 'Visa Waiver Program — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visa-waiver-program.html' },
      { label: 'Travel to the USA — gov.uk', url: 'https://www.gov.uk/travel-to-usa' },
    ],
    steps: [
      {
        id: 1,
        title: 'Check ESTA eligibility',
        phase: 'before-applying',
        description:
          'Make sure you qualify for the Visa Waiver Program. UK citizens usually qualify. But if you have travelled to certain countries — like Cuba, Iran, Iraq, Libya, North Korea, Somalia, Sudan, Syria, or Yemen after 2011 — or if you have had a visa refused before, you will need a B-2 visa instead of ESTA.',
        documents: [
          {
            name: 'Valid UK passport',
            required: true,
            description: 'Must be an e-Passport (it has a chip). Must be valid for your whole trip.',
          },
          {
            name: 'Travel history records',
            required: false,
            description: 'If you have been to VWP-restricted countries, you may need a B-2 visa instead.',
          },
        ],
        tips: [
          'If you have dual nationality with a restricted country, check travel.state.gov before applying for ESTA.',
          'Every traveller needs their own ESTA — including children.',
          'ESTA is for tourism, business, or transit only. It does not cover work or study.',
          'VWP restrictions apply even if you visited those countries for a completely innocent reason.',
        ],
        estimatedTime: '30 minutes to verify eligibility',
        estimatedCost: 'Free (eligibility check)',
      },
      {
        id: 2,
        title: 'Apply for ESTA at esta.cbp.dhs.gov',
        phase: 'applying',
        description:
          'Fill in the ESTA application at the official CBP website, esta.cbp.dhs.gov. Do not use any other website — many fake sites charge $60–$90 for the same thing. The real fee is $21. Most approvals come through in minutes. Apply at least 72 hours before your flight.',
        documents: [
          { name: 'UK e-Passport', required: true, description: 'You need your passport number and personal details. It must have a chip.' },
          { name: 'Credit/debit card', required: true, description: 'The fee is $21. Visa, Mastercard, and PayPal are accepted.' },
          {
            name: 'US travel details',
            required: true,
            description: 'The first address you will stay at in the US, and your flight details if you have them.',
          },
          { name: 'Emergency contact', required: true, description: 'A name and phone number.' },
        ],
        tips: [
          'Only use esta.cbp.dhs.gov. Many copycat sites charge $60–$90 for exactly the same service.',
          'Your ESTA is valid for 2 years from approval or until your passport expires — whichever is sooner.',
          'Each trip is limited to 90 days. You cannot extend a VWP stay or switch to a student visa while inside the US.',
          'Save or print your ESTA approval. Some airlines ask to see it at check-in.',
        ],
        estimatedTime: '20–30 minutes',
        estimatedCost: '$21 USD',
        officialLinks: [
          { label: 'Apply for ESTA', url: 'https://esta.cbp.dhs.gov/' },
        ],
      },
      {
        id: 3,
        title: 'Arrive at the US port of entry',
        phase: 'on-arrival',
        description:
          "Show your passport and the Electronic Customs Declaration at the CBP officer's desk. With ESTA, there is no paper I-94 form to fill in — the system creates your entry record automatically.",
        documents: [
          { name: 'Valid UK passport with ESTA approval', required: true },
          { name: 'CBP Mobile or paper customs declaration', required: true },
          { name: 'Return flight details', required: false, description: 'Shows you plan to leave within 90 days.' },
          { name: 'Hotel/accommodation confirmation', required: false },
        ],
        tips: [
          'Check your I-94 entry record within 48 hours at i94.cbp.dhs.gov.',
          'The officer may ask about your plans, where you are staying, and how much money you have. Keep answers short.',
          'You cannot work or study on ESTA. Be honest about your plans.',
        ],
        estimatedTime: '20–60 minutes at CBP',
        estimatedCost: 'No fee at entry',
        officialLinks: [
          { label: 'Verify Your I-94 Record', url: 'https://i94.cbp.dhs.gov/' },
        ],
      },
      {
        id: 4,
        title: 'Follow VWP rules during your stay',
        phase: 'in-country',
        description:
          'You cannot extend an ESTA/VWP stay, and you cannot switch to a different visa category from inside the US. If your plans change, leave the US and apply for the right visa before coming back.',
        documents: [
          { name: 'Passport', required: true, description: 'Keep it somewhere safe.' },
          {
            name: 'I-94 electronic record',
            required: true,
            description: 'Check it at i94.cbp.dhs.gov. It shows exactly how long you are allowed to stay.',
          },
        ],
        tips: [
          '90 days is the absolute limit. Overstaying bans you from the Visa Waiver Program and can hurt future US visa applications.',
          'If you decide you want to study or work, leave the US first and apply for the right visa.',
          'If you have a genuine emergency and need to stay longer, contact a US immigration attorney.',
        ],
        estimatedTime: 'Up to 90 days',
        estimatedCost: 'No fees',
      },
    ],
  },

  // ── Route 9: IN → US Student ─────────────────────────────────────────
  {
    id: 'in-us-student',
    origin: IN,
    destination: US,
    purpose: 'student',
    visaType: 'F-1 Student Visa',
    processingTime: '4–8 months total (allow extra time for OFC appointment)',
    stayDuration: 'Duration of study programme + 60-day grace period',
    estimatedCost: '~$535 USD in government fees + potential OFC fee',
    summary:
      'Indian citizens cannot use the Visa Waiver Program and must get an F-1 student visa through the US Embassy or Consulates in India. There is one extra step compared to UK or Swedish applicants: an Off-site Facilitation Center (OFC) appointment for fingerprints and a photo, which happens before your main interview. Wait times at Indian consulates can be 3–6 months, so start early.',
    officialLinks: [
      { label: 'US Student Visas — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'Study in the States — studyinthestates.dhs.gov', url: 'https://studyinthestates.dhs.gov' },
      { label: 'India Visa Services — ustraveldocs.com/in', url: 'https://www.ustraveldocs.com/in' },
    ],
    steps: [
      {
        id: 1,
        title: 'Get accepted to a SEVP-certified school & receive your I-20',
        phase: 'before-applying',
        description:
          'Apply to a US school that is certified by the Student and Exchange Visitor Program (SEVP). Once you are accepted, the school will give you Form I-20. You need this document to apply for your visa — everything else depends on it.',
        documents: [
          { name: 'Acceptance letter', required: true, description: 'The official offer letter from your US school.' },
          {
            name: 'Form I-20',
            required: true,
            description: 'Issued by the school\'s international office. It has your SEVIS ID number on page 1. Keep every copy.',
            whereToGet: "Your school's international students office",
          },
          {
            name: 'Financial proof',
            required: true,
            description: 'Show you can afford tuition and living costs. A bank statement, scholarship letter, or letter from whoever is sponsoring you all work.',
          },
          {
            name: 'Valid passport',
            required: true,
            description: 'Must be valid for at least 6 months after you plan to leave the US.',
          },
        ],
        tips: [
          'Not every US school is SEVP-certified. Check the list at sevp.ice.gov before you apply.',
          'Your I-20 has a programme start date on it. Plan your whole timeline around that date.',
          'Ask for your I-20 as soon as you are accepted. Some schools take 2–4 weeks to issue it.',
          'Indian applicants should start the whole process 8–12 months before their intended start date. Consulate wait times are long.',
        ],
        estimatedTime: '2–8 weeks (depends on school)',
        estimatedCost: 'Varies by school (application fees)',
      },
      {
        id: 2,
        title: 'Pay the SEVIS I-901 fee',
        phase: 'before-applying',
        description:
          'The US government charges a SEVIS I-901 fee to register you in their international student tracking system. Pay it online at fmjfee.com. Pay at least 3 business days before your interview.',
        documents: [
          { name: 'Form I-20', required: true, description: 'You need the SEVIS ID number at the top of page 1.' },
          { name: 'Credit/debit card', required: true, description: 'Pay at fmjfee.com. Visa, Mastercard, and American Express are accepted.' },
          { name: 'I-901 payment receipt', required: true, description: 'Print this or save it as a PDF. You must show it at your interview.' },
        ],
        tips: [
          'Wait until you have your I-20 before you pay. The fee is linked to your specific SEVIS ID.',
          'Pay at least 3 business days before your interview.',
          'Save this receipt permanently. You may need it every time you re-enter the US.',
        ],
        estimatedTime: '15–30 minutes online',
        estimatedCost: '$350 USD* (F-1 category)',
        officialLinks: [
          { label: 'Pay SEVIS Fee Here', url: 'https://www.fmjfee.com/' },
        ],
      },
      {
        id: 3,
        title: 'Complete Form DS-160 (Online Nonimmigrant Visa Application)',
        phase: 'applying',
        description:
          "The DS-160 is the US government's official visa application form. Fill it in online at ceac.state.gov. Save your application ID every 20 minutes — the session will time out.",
        documents: [
          { name: 'Valid passport', required: true, description: 'Your passport number, issue date, and expiry date.' },
          { name: 'US visa photo', required: true, description: '51×51 mm, white background, taken in the last 6 months. You upload it during the application.' },
          { name: 'Form I-20', required: true, description: 'Your school name, SEVIS ID, programme dates, and your DSO\'s contact details.' },
          { name: 'Travel history', required: true, description: 'Countries you have visited in the last 5 years with rough dates.' },
          { name: 'Prior US visas', required: false, description: 'Visa numbers from old passports, if you have had US visas before.' },
        ],
        tips: [
          "Write down your DS-160 application ID after every section. You cannot get it back if the session times out.",
          "If a question does not apply to you, write 'Does Not Apply' — do not leave it blank.",
          'Print the DS-160 confirmation page. It has a barcode the officer scans at your interview.',
          'Your name must match your passport exactly.',
          'Choose the US Consulate in India where you want to interview: Chennai, Hyderabad, Kolkata, Mumbai, or New Delhi. Pick the one closest to where you live.',
        ],
        estimatedTime: '1–2 hours to complete',
        estimatedCost: 'Free (form submission)',
        officialLinks: [
          { label: 'Open DS-160 Application', url: 'https://ceac.state.gov/genniv/' },
        ],
      },
      {
        id: 4,
        title: 'Pay the MRV visa application fee',
        phase: 'applying',
        description:
          'The MRV fee is the $185 visa application fee. For India, pay online through ustraveldocs.com/in before booking your appointments.',
        documents: [
          { name: 'Credit/debit card', required: true, description: 'Pay at ustraveldocs.com/in.' },
          { name: 'MRV fee receipt', required: true, description: 'This has a transaction number you need to book your interview.' },
        ],
        tips: [
          'Only pay through the official ustraveldocs.com/in portal. Never use third-party agents.',
          'Write down your transaction number right after paying. Without it, you cannot book your appointments.',
          'The $185 fee is not refunded, even if your visa is denied.',
        ],
        estimatedTime: '10–20 minutes',
        estimatedCost: '$185 USD*',
        officialLinks: [
          { label: 'Book India Appointment', url: 'https://www.ustraveldocs.com/in/' },
        ],
      },
      {
        id: 5,
        title: 'Schedule both your OFC biometrics AND consular interview appointments',
        phase: 'applying',
        description:
          'Indian applicants need to book two separate appointments: (1) an Off-site Facilitation Center (OFC) appointment for fingerprints and a photo, and (2) the main visa interview at the Consulate. Book both through ustraveldocs.com/in.',
        documents: [
          { name: 'MRV fee receipt', required: true, description: 'Your transaction number to access the scheduling portal.' },
          { name: 'DS-160 barcode page', required: true, description: 'To link your DS-160 application to your appointment.' },
          { name: 'Passport details', required: true },
        ],
        tips: [
          'Book the OFC appointment first — it must happen before your consulate interview.',
          'Indian consulate wait times are among the longest in the world. Check ustraveldocs.com/in often for cancellations.',
          'New Delhi, Mumbai, and Chennai consulates usually have shorter waits than Kolkata or Hyderabad.',
          'Save your appointment confirmation number carefully.',
        ],
        estimatedTime: '15–30 minutes to book online; wait times for appointments can be 3–6 months',
        estimatedCost: 'No additional fee for scheduling',
        officialLinks: [
          { label: 'Book India Appointment', url: 'https://www.ustraveldocs.com/in/' },
        ],
      },
      {
        id: 6,
        title: 'Attend OFC biometrics appointment',
        phase: 'interview',
        description:
          'At your OFC appointment, staff will take your fingerprints and a digital photo. This is a quick, mandatory step before your main interview. Bring the exact documents listed — you will not be let in without them.',
        documents: [
          { name: 'Valid Indian passport', required: true },
          { name: 'OFC appointment confirmation', required: true, description: 'Printed or on your phone.' },
          { name: 'DS-160 barcode page', required: true },
          { name: 'MRV fee receipt', required: true },
          { name: 'Passport photo', required: true, description: '51×51 mm, white background.' },
        ],
        tips: [
          'The OFC is just fingerprints and a photo — no interview questions.',
          'It takes about 10–20 minutes. Arrive on time.',
          'The OFC is at a different address from the Consulate. Double-check where you are going.',
        ],
        estimatedTime: '30–60 minutes total (including wait)',
        estimatedCost: 'No additional fee',
        interviewPrep: {
          whatToBring: [
            { item: 'Passport (original)', note: 'The same passport you used to apply.' },
            { item: 'OFC appointment confirmation', note: 'Printed or saved on your phone.' },
            { item: 'DS-160 barcode page', note: 'The printed confirmation page from your DS-160 application.' },
            { item: 'MRV fee receipt', note: 'Proof you paid the visa fee.' },
            { item: 'One passport photo', note: 'US visa standard: 51×51 mm, white background.' },
          ],
          tips: [
            'The OFC appointment is just fingerprints and a photo. No interview questions.',
            'It takes about 15–20 minutes. Arrive on time — if you are late you may need to reschedule.',
            'The OFC is at a different location from the Consulate. Double-check the address before you go.',
          ],
        },
      },
      {
        id: 7,
        title: 'Attend the visa interview at the US Consulate in India',
        phase: 'interview',
        description:
          'Go to your chosen US Consulate — Chennai, Hyderabad, Kolkata, Mumbai, or New Delhi. Indian F-1 applicants are typically asked more detailed questions than applicants from other countries, especially about their plans to return to India after graduating. Prepare honest, clear answers.',
        documents: [
          { name: 'Valid Indian passport', required: true, description: 'Original, plus any old passports with previous US visas.' },
          { name: 'Form I-20', required: true, description: 'Original, signed by both you and your DSO.' },
          { name: 'DS-160 confirmation/barcode page', required: true, description: 'Printed.' },
          { name: 'SEVIS I-901 fee receipt', required: true, description: 'Printed or on your phone.' },
          { name: 'MRV fee receipt', required: true, description: 'Printed.' },
          { name: 'Passport photos ×2', required: true, description: '51×51 mm, white background.' },
          { name: 'Financial documents', required: true, description: 'Bank statements, scholarship letters, or sponsor letters — originals and copies.' },
          { name: 'School acceptance letter', required: true, description: 'The official offer letter from your US university.' },
          { name: 'OFC appointment confirmation', required: true, description: 'Bring it for your records.' },
          { name: 'Property/family ties in India', required: true, description: 'Documents or evidence showing strong reasons to return to India after studying.' },
          { name: 'Statement of financial support', required: false, description: "Your parent's or sponsor's bank statements and income proof, if a family member is paying." },
        ],
        tips: [
          'Indian applicants face more detailed questions about their plans to return to India. Have solid, honest answers ready.',
          'Bring your original academic transcripts and test scores like TOEFL and GRE/GMAT. Officers often ask about your academic background.',
          'If asked about your long-term plans, clearly state you plan to return to India after you graduate.',
          'Refusal rates for Indian F-1 applicants are higher than for many other nationalities. Preparation is essential.',
        ],
        estimatedTime: 'Allow a full day; interview typically 15–45 minutes',
        estimatedCost: 'No additional fee',
        interviewPrep: {
          whatToBring: [
            { item: 'Passport (original)', note: 'Plus any old passports with previous US visas.' },
            { item: 'Form I-20 (original)', note: 'Signed by you and your DSO.' },
            { item: 'DS-160 confirmation page', note: 'Printed barcode page.' },
            { item: 'SEVIS I-901 fee receipt', note: 'Printed or on your phone.' },
            { item: 'MRV fee receipt', note: 'Proof of visa fee payment.' },
            { item: 'Two passport photos', note: '51×51 mm, white background.' },
            { item: 'Official transcripts', note: 'From every university or college you attended.' },
            { item: 'Test scores', note: 'TOEFL, GRE, GMAT — whatever your school required.' },
            { item: 'Bank statements (yours or family\'s)', note: 'Last 6 months. Must show enough for tuition and living costs.' },
            { item: 'Income proof for your sponsor', note: 'Your parent\'s or sponsor\'s salary slips, Income Tax Returns, and Form 16.' },
            { item: 'Proof of ties to India', note: 'Property documents, a letter from family, or anything that shows strong reason to return to India after studying.' },
            { item: 'School acceptance letter', note: 'Official offer letter from your US university.' },
          ],
          commonQuestions: [
            'Why did you choose this school and this programme?',
            'What will you do after you graduate?',
            'Who is paying for your studies?',
            'Do you have any family members in the US?',
            'Have you applied to other schools?',
            'What is your DSO\'s name?',
            'Why do you want to study in the US instead of India?',
            'What does your father/mother do for work?',
          ],
          tips: [
            'Indian F-1 applicants face more detailed questioning than most other nationalities. Prepare thoroughly.',
            'The officer wants to be sure you will return to India after your studies. Have a clear, honest answer ready.',
            'Bring originals and photocopies of everything. Keep them organised in a folder.',
            'Dress professionally. First impressions matter.',
            'If your answer is \'I don\'t know\', say that honestly rather than making something up.',
          ],
        },
      },
      {
        id: 8,
        title: 'Arrive at the US port of entry',
        phase: 'on-arrival',
        description:
          "Having the visa stamp in your passport does not guarantee entry. A CBP officer at the border makes the final decision. Keep all your documents in your carry-on bag. You can arrive up to 30 days before your I-20 programme start date.",
        documents: [
          { name: 'Passport with F-1 visa stamp', required: true, description: 'The visa stamp you received after your interview was approved.' },
          { name: 'Form I-20', required: true, description: 'Original. Never put this in your checked luggage.' },
          { name: 'Proof of funds', required: true, description: 'A recent bank statement or scholarship letter.' },
          { name: 'School contact details', required: false, description: 'Your DSO\'s name, phone, email, and school address.' },
          { name: 'Return flight or onward travel plans', required: false, description: 'Shows you intend to leave after your studies.' },
        ],
        tips: [
          "Tell the CBP officer you are a student on an F-1 visa. Never say 'tourist'.",
          'Do not arrive more than 30 days before your I-20 programme start date.',
          'Check your I-94 record within 48 hours of arriving at i94.cbp.dhs.gov.',
          'Always keep your I-20 in your carry-on every time you travel internationally.',
        ],
        estimatedTime: '20–60 minutes at CBP',
        estimatedCost: 'No fee',
        officialLinks: [
          { label: 'Verify Your I-94 Record', url: 'https://i94.cbp.dhs.gov/' },
        ],
      },
      {
        id: 9,
        title: 'Maintain your F-1 status throughout your studies',
        phase: 'in-country',
        description:
          'You have to actively keep your F-1 status in good shape. Breaking the rules — even by accident — can end your status. Contact your DSO straight away if anything in your situation changes.',
        documents: [
          { name: 'Valid Form I-20', required: true, description: 'Must stay current. If your programme gets extended, your DSO updates it.' },
          { name: 'Full-time enrolment confirmation', required: true, description: 'You must take at least the minimum number of credits each semester.' },
          { name: 'Work authorisation documents', required: false, description: 'You can only work on campus (less than 20 hours a week) unless your DSO approves CPT or OPT.' },
          { name: 'Current US address on file', required: true, description: 'Tell your DSO within 10 days whenever you move.' },
        ],
        tips: [
          'Never drop below full-time enrolment without getting Reduced Course Load (RCL) approval from your DSO first.',
          'Working off campus without CPT or OPT authorisation is a serious violation. Do not do it.',
          'Keep your passport valid. Renew it at the Indian Consulate in the US before it expires.',
          "Your I-20 has an end date. If you need more time, ask your DSO for an extension before that date — not after.",
          'Start planning for CPT and OPT early. OPT gives you up to 12 months of work authorisation after graduation, and 36 months if you are in a STEM field.',
        ],
        estimatedTime: 'Ongoing',
        estimatedCost: 'No government fees for status maintenance',
      },
    ],
  },

  // ── Route 10: IN → US Tourist ────────────────────────────────────────
  {
    id: 'in-us-tourist',
    origin: IN,
    destination: US,
    purpose: 'tourist',
    visaType: 'B-2 Tourist Visa',
    processingTime: '2–6 months (including interview wait time)',
    stayDuration: 'Up to 6 months (at CBP officer\'s discretion)',
    estimatedCost: '~$185 USD (MRV fee)',
    summary:
      "Indian citizens cannot use the US Visa Waiver Program and must apply for a B-2 Tourist Visa. You fill in a DS-160 form, pay the $185 fee, and attend an in-person interview at a US Consulate in India. The visa itself can be valid for up to 10 years with multiple entries, but each individual stay is limited by the CBP officer at the border — usually up to 6 months.",
    officialLinks: [
      { label: 'B-2 Tourist Visa — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/tourism-visit/visitor.html' },
      { label: 'India Visa Services — ustraveldocs.com/in', url: 'https://www.ustraveldocs.com/in' },
    ],
    steps: [
      {
        id: 1,
        title: 'Complete Form DS-160 online',
        phase: 'applying',
        description:
          'Fill in the Online Nonimmigrant Visa Application (DS-160) at ceac.state.gov. Choose the US Consulate in India nearest to you as your interview location. Be accurate about your travel plans, finances, and the reason for your visit.',
        documents: [
          { name: 'Valid Indian passport', required: true },
          { name: 'Digital passport photo', required: true, description: '51×51 mm, white background.' },
          { name: 'Travel itinerary', required: true, description: 'Rough travel dates and the US addresses where you will be staying.' },
          { name: 'Employment/financial details', required: true, description: 'Your employer\'s letter, bank statements, and income proof.' },
        ],
        tips: [
          'Be clear and specific about why you are visiting — tourism, visiting family, medical treatment, and so on.',
          'If you are visiting family, have their contact details and their immigration status ready.',
          "Save your DS-160 application ID regularly — sessions expire.",
        ],
        estimatedTime: '1–2 hours',
        estimatedCost: 'Free',
        officialLinks: [
          { label: 'Open DS-160 Application', url: 'https://ceac.state.gov/genniv/' },
        ],
      },
      {
        id: 2,
        title: 'Pay the MRV fee and schedule OFC + Consular appointments',
        phase: 'applying',
        description:
          'Pay the $185 MRV fee at ustraveldocs.com/in, then book your OFC fingerprint appointment and your consulate interview. Appointment wait times at Indian consulates can be months. Check frequently for cancellations.',
        documents: [
          { name: 'Credit/debit card', required: true, description: 'To pay the MRV fee.' },
          { name: 'MRV fee receipt/transaction number', required: true, description: 'To book your appointments.' },
          { name: 'DS-160 barcode page', required: true },
        ],
        tips: [
          'Check ustraveldocs.com/in for current wait times at each consulate before choosing where to interview.',
          'Check regularly for cancellations — slots open up all the time.',
          'New Delhi and Mumbai are usually the busiest. Chennai and Hyderabad may have shorter waits.',
        ],
        estimatedTime: '30 minutes to pay and schedule; wait weeks to months for appointment',
        estimatedCost: '$185 USD',
        officialLinks: [
          { label: 'Book India Appointment', url: 'https://www.ustraveldocs.com/in/' },
        ],
      },
      {
        id: 3,
        title: 'Attend OFC biometrics appointment',
        phase: 'interview',
        description:
          'Go to your OFC appointment for fingerprints and a photo. This must happen before your consulate interview. Bring everything on the list — they will not process you without it.',
        documents: [
          { name: 'Valid Indian passport', required: true },
          { name: 'OFC appointment confirmation', required: true },
          { name: 'DS-160 barcode page', required: true },
          { name: 'MRV fee receipt', required: true },
          { name: 'Passport photo', required: true, description: '51×51 mm, white background.' },
        ],
        tips: [
          'The OFC is just fingerprints and a photo — no questions.',
          'Takes about 15 minutes. Arrive on time.',
        ],
        estimatedTime: '30–60 minutes',
        estimatedCost: 'No additional fee',
        interviewPrep: {
          whatToBring: [
            { item: 'Passport (original)', note: 'The same one you used to apply.' },
            { item: 'OFC appointment confirmation', note: 'Printed or on your phone.' },
            { item: 'DS-160 barcode page', note: 'Printed.' },
            { item: 'MRV fee receipt', note: 'Proof of payment.' },
            { item: 'One passport photo', note: '51×51 mm, white background.' },
          ],
          tips: [
            'This is just fingerprints and a photo — no questions.',
            'Takes about 15 minutes. Arrive on time.',
          ],
        },
      },
      {
        id: 4,
        title: 'Attend B-2 visa interview at US Consulate',
        phase: 'interview',
        description:
          'Attend your scheduled interview at a US Consulate in India. The officer will look at your ties to India, your finances, and whether you genuinely intend to return home after your visit. Be prepared with a clear, honest story about your trip.',
        documents: [
          { name: 'Valid Indian passport', required: true, description: 'Plus any old passports — especially ones with US or other country visas.' },
          { name: 'DS-160 barcode page', required: true, description: 'Printed.' },
          { name: 'MRV fee receipt', required: true },
          { name: 'OFC appointment confirmation', required: true },
          { name: 'Passport photos ×2', required: true },
          { name: 'Bank statements', required: true, description: 'Last 6 months. Shows you can afford the trip.' },
          { name: 'Income proof', required: true, description: 'Salary slips, Income Tax Returns (ITR), Form 16.' },
          { name: 'Employment letter', required: true, description: 'On company letterhead, with your job title, salary, and confirmation that leave is approved.' },
          { name: 'Property or assets documents', required: false, description: 'Home ownership papers, land documents — shows you have strong reasons to return.' },
          { name: 'Family ties', required: false, description: 'Spouse, children, or close family living in India.' },
          { name: 'Prior travel evidence', required: false, description: 'Old passports with visa stamps showing you have travelled responsibly before.' },
          { name: 'US trip itinerary', required: false, description: 'Hotel bookings, places you plan to visit, return flight.' },
        ],
        tips: [
          'The biggest factor in getting approved is showing you have strong reasons to return to India. This is what the officer is mainly assessing.',
          'A stable job with approved leave, property in India, and close family ties all strengthen your case significantly.',
          'Keep your answers short and direct. If the officer wants more detail, they will ask.',
          'Bring original documents plus one set of photocopies.',
          'Dress professionally.',
        ],
        estimatedTime: 'Allow a full day; interview typically 10–30 minutes',
        estimatedCost: 'No additional fee',
        interviewPrep: {
          whatToBring: [
            { item: 'Passport (original)', note: 'Plus any old passports — especially ones with US or other country visas.' },
            { item: 'DS-160 confirmation page', note: 'Printed barcode page.' },
            { item: 'MRV fee receipt', note: 'Proof of payment.' },
            { item: 'Two passport photos', note: '51×51 mm, white background.' },
            { item: 'Bank statements', note: 'Last 6 months. Shows you can afford the trip.' },
            { item: 'Salary slips', note: 'Last 3 months from your employer.' },
            { item: 'Income Tax Returns (ITR)', note: 'Last 2 years.' },
            { item: 'Employment letter', note: 'On company letterhead. Must state your job title, salary, and that your leave is approved.' },
            { item: 'Property or asset documents', note: 'Home ownership papers, land documents — shows you have reasons to return to India.' },
            { item: 'US trip itinerary', note: 'Hotel bookings, places you plan to visit, return flight.' },
            { item: 'Letter from US contact', note: 'If you are visiting family or friends, a letter from them with their address and immigration status helps.' },
          ],
          commonQuestions: [
            'What is the purpose of your visit to the US?',
            'How long do you plan to stay?',
            'Who will you be visiting or staying with?',
            'What do you do for work?',
            'Who is paying for this trip?',
            'Have you been to the US before?',
            'Do you have family members living in the US?',
            'What will you do when you return to India?',
          ],
          tips: [
            'The officer\'s main question is: will this person go back to India? Everything you bring should help answer yes.',
            'A stable job with approved leave, property in India, and family ties are the strongest evidence.',
            'Keep answers short and direct. If the officer wants more detail, they will ask.',
            'Bring originals of everything, plus one set of photocopies.',
            'Dress professionally.',
          ],
        },
      },
      {
        id: 5,
        title: 'Enter the US as a B-2 tourist',
        phase: 'on-arrival',
        description:
          "A CBP officer at the US border will check your B-2 visa, passport, and travel plans. They decide how long you can stay — usually up to 6 months. Check your I-94 record within 48 hours to see the exact date you must leave by.",
        documents: [
          { name: 'Passport with B-2 visa stamp', required: true },
          { name: 'Return ticket', required: false, description: 'Strongly recommended — shows you plan to leave.' },
          { name: 'Hotel bookings and itinerary', required: false },
          { name: 'Proof of funds', required: false, description: 'Credit card, cash, or bank statement.' },
          { name: 'CBP customs declaration', required: true, description: 'Fill it in on the plane or at the kiosk.' },
        ],
        tips: [
          'A B-2 visa does not guarantee entry. The CBP officer has the final say.',
          'Check your I-94 at i94.cbp.dhs.gov within 48 hours of entry to see your authorised stay date.',
          'Do not work or study on a B-2 visa. It is for tourists and visitors only.',
          'If you want to stay longer than the officer granted, file Form I-539 with USCIS before your I-94 date expires.',
        ],
        estimatedTime: '30–90 minutes at CBP',
        estimatedCost: 'No fee at entry',
        officialLinks: [
          { label: 'Verify Your I-94 Record', url: 'https://i94.cbp.dhs.gov/' },
        ],
      },
    ],
  },
]

// ─────────────────────────────────────────────
// Helper functions
// ─────────────────────────────────────────────

export function getRoute(id: string): VisaRoute | undefined {
  return VISA_ROUTES.find((r) => r.id === id)
}

export function getRoutesForPair(originCode: string, destCode: string): VisaRoute[] {
  return VISA_ROUTES.filter((r) => r.origin.code === originCode && r.destination.code === destCode)
}

export function getPurposesForPair(originCode: string, destCode: string): Purpose[] {
  return getRoutesForPair(originCode, destCode).map((r) => r.purpose)
}

export function getAllRoutes(): VisaRoute[] {
  return VISA_ROUTES
}
