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
    'Prepare concise answers to: Why this school? How will you fund your studies? What will you do after graduating?',
    `Officers want to confirm you intend to return to ${embassyCity === 'London' ? 'the UK' : 'Sweden'} after your studies — be ready to demonstrate ties`,
    'Dress neatly — business casual is appropriate',
    'Do not bring prohibited items (large bags, food, laptops may be restricted — check the embassy website)',
  ]
  if (extraInterviewTip) interviewTips.push(extraInterviewTip)

  return [
    {
      id: 1,
      title: 'Get accepted to a SEVP-certified school & receive your I-20',
      phase: 'before-applying',
      description:
        'Apply to a Student and Exchange Visitor Program (SEVP)-certified US school. Once accepted, your Designated School Official (DSO) will issue Form I-20, the foundation of your entire F-1 application.',
      documents: [
        { name: 'Acceptance letter', required: true, description: 'From your US school' },
        {
          name: 'Form I-20',
          required: true,
          description: 'Issued by DSO — contains your SEVIS ID number. Keep every version.',
          whereToGet: "Your school's international students office",
        },
        {
          name: 'Financial proof',
          required: true,
          description:
            'Bank statements, scholarship award letters, or sponsor letters demonstrating you can fund tuition + living costs',
        },
        {
          name: 'Valid passport',
          required: true,
          description: 'Must be valid at least 6 months beyond your intended US stay',
        },
      ],
      tips: [
        'Only SEVP-certified schools can issue I-20 forms — verify certification at sevp.ice.gov before applying',
        'Your I-20 must list your intended programme start date — plan your application timeline around this date',
        'Request your I-20 as early as possible; some schools take 2–4 weeks to issue it after acceptance',
      ],
      estimatedTime: '2–8 weeks (depends on school)',
      estimatedCost: 'Varies by school (application fees)',
    },
    {
      id: 2,
      title: 'Pay the SEVIS I-901 fee',
      phase: 'before-applying',
      description:
        'The Student and Exchange Visitor Information System (SEVIS) I-901 fee registers you in the US student tracking system. Pay at fmjfee.com at least 3 business days before your embassy interview.',
      documents: [
        { name: 'Form I-20', required: true, description: 'You need the SEVIS ID number from the top of page 1' },
        {
          name: 'Credit/debit card',
          required: true,
          description: 'Payment via fmjfee.com — accepts Visa, Mastercard, American Express',
        },
        {
          name: 'I-901 payment receipt',
          required: true,
          description: 'Print and save as PDF — you must present this at your interview',
        },
      ],
      tips: [
        'Do not pay before you have your I-20 — the fee is tied to your specific SEVIS ID',
        'The receipt must be paid at least 3 business days before your consular interview',
        'Keep your receipt permanently — you may need it again if you travel and re-enter',
      ],
      estimatedTime: '15–30 minutes online',
      estimatedCost: '$350 USD* (F-1 category)',
    },
    {
      id: 3,
      title: 'Complete Form DS-160 (Online Nonimmigrant Visa Application)',
      phase: 'applying',
      description:
        "The DS-160 is the US government's official nonimmigrant visa application form, completed at ceac.state.gov. Save your application ID every 20 minutes — sessions time out.",
      documents: [
        { name: 'Valid passport', required: true, description: 'Passport number, issue/expiry dates, personal details' },
        {
          name: 'US visa photo',
          required: true,
          description: '51×51 mm, white background, taken within last 6 months — upload during application',
        },
        { name: 'Form I-20', required: true, description: 'School name, SEVIS ID, programme dates, DSO contact' },
        { name: 'Travel history', required: true, description: 'Countries visited in last 5 years with approximate dates' },
        { name: 'Prior US visas', required: true, description: 'Visa numbers from old passports (if applicable)' },
      ],
      tips: [
        "Save your DS-160 application ID after every section — you cannot recover it if the session times out",
        "Answer 'Does Not Apply' rather than leaving fields blank",
        'Print the DS-160 confirmation barcode page — you must present the barcode at your interview',
        'Ensure your name spelling matches your passport exactly',
        embassyCity === 'London'
          ? 'Select the US Embassy in London as your interview location'
          : `Select the US Embassy in ${embassyCity} as your interview location`,
      ],
      estimatedTime: '1–2 hours to complete',
      estimatedCost: 'Free (form submission)',
    },
    {
      id: 4,
      title: 'Pay the MRV visa application fee',
      phase: 'applying',
      description: `The Machine Readable Visa (MRV) fee is the non-refundable consular processing fee. ${paymentPortalNote}`,
      documents: [
        { name: 'Credit/debit card', required: true, description: `Via US Embassy ${embassyCity} appointment portal` },
        {
          name: 'MRV fee receipt',
          required: true,
          description: 'Contains your UID/transaction number needed to book your interview slot',
        },
      ],
      tips: [
        `Pay through the official US Embassy ${embassyCity} portal only — never through third-party agents`,
        'Record your transaction number immediately — without it you cannot book your interview',
        'The MRV fee is non-refundable even if your visa is denied',
      ],
      estimatedTime: '10–20 minutes',
      estimatedCost: '$185 USD*',
    },
    {
      id: 5,
      title: `Schedule your visa interview at the US Embassy, ${embassyCity}`,
      phase: 'applying',
      description: `Book your F-1 interview at the US Embassy in ${embassyCity === 'Stockholm' ? 'Stockholm (Dag Hammarskjölds Väg 31, SE-115 89 Stockholm)' : 'London (33 Nine Elms Lane, London SW11 7US)'}. Book 2–3 months ahead during peak season (April–August).`,
      documents: [
        { name: 'MRV fee receipt', required: true, description: 'Transaction/UID number for the booking system' },
        { name: 'DS-160 barcode', required: true, description: 'Application ID to link to your booking' },
        { name: 'Passport details', required: true, description: 'Passport number for the booking form' },
      ],
      tips: [
        'Summer appointments fill up months in advance — book as early as possible',
        'You can reschedule once for free if needed — check the portal for availability',
        `The ${embassyCity} embassy is the correct location for ${embassyCity === 'Stockholm' ? 'Swedish' : 'UK'} residents; do not book at another country's embassy`,
      ],
      estimatedTime: '15 minutes to book online',
      estimatedCost: 'No additional fee',
    },
    {
      id: 6,
      title: `Attend the visa interview at the US Embassy, ${embassyCity}`,
      phase: 'interview',
      description: `Arrive 15 minutes early with all documents in a clear folder. A consular officer will ask about your study plans, funding, and ties to ${embassyCity === 'Stockholm' ? 'Sweden' : 'the UK'}. Be honest, concise, and confident. Most F-1 decisions are made the same day.`,
      documents: [
        { name: 'Valid passport', required: true, description: 'Original + any old passports with previous US visas' },
        {
          name: 'Form I-20',
          required: true,
          description: 'Original, signed by both you and your DSO — do not bring a photocopy only',
        },
        { name: 'DS-160 confirmation/barcode page', required: true, description: 'Printed' },
        { name: 'SEVIS I-901 fee receipt', required: true, description: 'Printed or shown on phone' },
        { name: 'MRV fee receipt', required: true, description: 'Printed' },
        { name: 'Passport photos ×2', required: true, description: 'US visa standard: 51×51 mm, white background' },
        {
          name: 'Financial documents',
          required: true,
          description: 'Bank statements, scholarship letters, or sponsor letters — originals + copies',
        },
        { name: 'School acceptance letter', required: true, description: 'Official letter with school letterhead' },
        {
          name: `${embassyCity === 'Stockholm' ? 'Swedish' : 'UK'} personal ID`,
          required: false,
          description: 'National ID card or driver\'s licence as secondary ID',
        },
        {
          name: `Evidence of ties to ${embassyCity === 'Stockholm' ? 'Sweden' : 'the UK'}`,
          required: false,
          description: 'Employment letter, property ownership, close family ties — demonstrates non-immigrant intent',
        },
      ],
      tips: interviewTips,
      estimatedTime: 'Allow half a day; interview typically 10–30 minutes',
      estimatedCost: 'No additional fee (MRV already paid)',
    },
    {
      id: 7,
      title: 'Arrive at the US port of entry',
      phase: 'on-arrival',
      description:
        "Your F-1 visa stamp in your passport is not a guarantee of entry — a CBP officer at the port of entry makes the final decision. Have all documents accessible in your carry-on, not checked luggage. You can enter up to 30 days before your I-20 programme start date.",
      documents: [
        { name: 'Passport with F-1 visa stamp', required: true, description: 'Stamped after your approved interview' },
        { name: 'Form I-20', required: true, description: 'Original — never pack in checked luggage' },
        { name: 'Proof of funds', required: true, description: 'Current bank statement or scholarship letter' },
        { name: 'School contact details', required: false, description: 'DSO name, phone, email, and school address' },
        { name: 'Return flight or onward travel plans', required: false, description: 'Shows temporary intent' },
      ],
      tips: [
        "State clearly that you are a student on an F-1 visa — never say 'tourist'",
        'Do not enter more than 30 days before your I-20 programme start date',
        'Your I-94 arrival/departure record is generated electronically — verify it within 48 hours at i94.cbp.dhs.gov',
        'Keep your I-20 in your carry-on for every future international trip',
      ],
      estimatedTime: '20–60 minutes at CBP',
      estimatedCost: 'No fee',
    },
    {
      id: 8,
      title: 'Maintain your F-1 status throughout your studies',
      phase: 'in-country',
      description:
        'F-1 status requires active maintenance. Violations — even unintentional — can trigger status termination. Contact your DSO immediately if anything in your situation changes.',
      documents: [
        {
          name: 'Valid Form I-20',
          required: true,
          description: 'Must remain current — DSO extends it if your programme extends',
        },
        {
          name: 'Full-time enrolment confirmation',
          required: true,
          description: 'Must maintain minimum credit load each semester',
        },
        {
          name: 'Work authorisation documents',
          required: true,
          description: 'On-campus only (<20 hrs/week) without CPT or OPT approval from DSO',
        },
        {
          name: 'Current US address on file',
          required: true,
          description: 'Must update DSO within 10 days of any address change',
        },
      ],
      tips: [
        'Never drop below full-time enrolment without DSO approval for a Reduced Course Load (RCL)',
        'Off-campus work without CPT/OPT authorisation is a serious status violation',
        'Keep your passport valid — renew at the Swedish Embassy/Consulate in the US before it expires',
        "Your I-20 has a programme end date — if you need more time, request an extension from your DSO before it expires, not after",
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
      'The F-1 is the nonimmigrant academic student visa for full-time study in the US. As a Swedish citizen you benefit from the Visa Waiver Program for short visits, but any stay over 90 days for academic purposes requires an F-1 visa obtained before travel.',
    athleteNote:
      'Student athletes use the same F-1 visa but must also obtain NCAA Eligibility Center clearance. Your athletic department handles this separately — start the eligibility process simultaneously with your visa application.',
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
      'Student athletes use the same F-1 visa as regular students. As a Swedish citizen you must obtain an F-1 visa for academic stays longer than 90 days. Additionally, NCAA athletes must obtain Eligibility Center clearance — start this process at the same time as your visa application.',
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
      'Swedish citizens are eligible for the US Visa Waiver Program (VWP). Instead of a visa, you apply for ESTA — Electronic System for Travel Authorisation — online before departure. ESTA is valid for 2 years and multiple visits, each capped at 90 days.',
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
          'Confirm you qualify for the Visa Waiver Program. Swedish citizens generally qualify, but certain prior travel history (e.g., to Cuba, Iran, Iraq, Libya, North Korea, Somalia, Sudan, Syria, Yemen after 2011) requires a B-2 visa instead of ESTA.',
        documents: [
          {
            name: 'Valid Swedish passport',
            required: true,
            description: 'Must be e-Passport with a chip. Must be valid for the entire US stay.',
          },
          {
            name: 'Travel history records',
            required: false,
            description: "If you've travelled to VWP-restricted countries, you'll need a B-2 visa instead",
          },
        ],
        tips: [
          "If you've held dual nationality with a VWP-restricted country, consult travel.state.gov before applying for ESTA",
          'Children need their own ESTA — one per person travelling',
          'ESTA is only for tourism, business, or transit — not for study or work',
        ],
        estimatedTime: '30 minutes to verify eligibility',
        estimatedCost: 'Free (eligibility check)',
      },
      {
        id: 2,
        title: 'Apply for ESTA at esta.cbp.dhs.gov',
        phase: 'applying',
        description:
          'Complete the ESTA application online at the official CBP portal (esta.cbp.dhs.gov). Never use third-party ESTA sites that charge extra — the only official fee is $21. Most applications are approved within minutes; CBP recommends applying at least 72 hours before departure.',
        documents: [
          { name: 'Swedish e-Passport', required: true, description: 'Passport number, personal details, chip required' },
          { name: 'Credit/debit card', required: true, description: '$21 USD fee — payable by Visa, Mastercard, PayPal' },
          {
            name: 'US travel details',
            required: true,
            description: "First US address you'll stay at, flight details if known",
          },
          { name: 'Emergency contact', required: true, description: 'Name and phone number' },
        ],
        tips: [
          'Use ONLY esta.cbp.dhs.gov — many copycat sites charge $60–$90 for the same service',
          'Your ESTA is valid for 2 years from approval or until your passport expires, whichever is sooner',
          'Each visit is limited to 90 days — you cannot extend a VWP stay or change status to student inside the US',
          'Print or save your ESTA authorisation — airlines may ask for it at check-in',
        ],
        estimatedTime: '20–30 minutes',
        estimatedCost: '$21 USD',
      },
      {
        id: 3,
        title: 'Arrive at the US port of entry',
        phase: 'on-arrival',
        description:
          'Present your passport and completed Electronic Customs Declaration at the CBP officer\'s booth. With ESTA you do not need to fill in a paper I-94 form — it is generated electronically.',
        documents: [
          { name: 'Valid Swedish passport with ESTA approval', required: true },
          { name: 'CBP Mobile or paper customs declaration', required: true },
          { name: 'Return flight details', required: false, description: 'Demonstrates intent to leave within 90 days' },
          { name: 'Hotel/accommodation confirmation', required: false },
        ],
        tips: [
          'Verify your I-94 arrival record within 48 hours at i94.cbp.dhs.gov',
          'The CBP officer may ask about your travel plans, accommodation, and funds available — be ready to answer briefly',
          'You cannot work or study under ESTA/VWP — if asked about plans, be accurate',
        ],
        estimatedTime: '20–60 minutes at CBP',
        estimatedCost: 'No fee at entry',
      },
      {
        id: 4,
        title: 'Follow VWP rules during your stay',
        phase: 'in-country',
        description:
          'ESTA/VWP visits cannot be extended, and you cannot change your immigration status to another visa category (such as F-1 student) from within the US on a VWP entry. If your plans change, you must leave and apply properly.',
        documents: [
          { name: 'Passport', required: true, description: 'Keep it safe and accessible' },
          {
            name: 'I-94 electronic record',
            required: true,
            description: 'Check at i94.cbp.dhs.gov — it shows your authorised stay',
          },
        ],
        tips: [
          '90 days is the hard limit — overstaying bars future VWP use and can affect future US visa applications',
          'If you decide to study or work, leave the US and apply for the appropriate visa before re-entering',
          'If you need emergency medical or other extension, contact a US immigration attorney',
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
      'The H-1B is the primary work visa for specialty occupations (tech, engineering, finance, healthcare, etc.). Critically, you cannot self-petition — a US employer must sponsor you. Demand far exceeds supply: USCIS runs an annual lottery in March. Swedish citizens still need a visa stamp from the Stockholm embassy after USCIS approval.',
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
          "You cannot apply for H-1B yourself — a US employer must act as your petitioner. The employer must be willing to pay prevailing wages and cover most filing fees. Start job searching 12–18 months before your intended start date.",
        documents: [
          {
            name: 'Job offer letter',
            required: true,
            description: "Specifying role, salary, and employer's intent to sponsor H-1B",
          },
          {
            name: 'Degree certificates and transcripts',
            required: true,
            description: "Bachelor's degree or equivalent in relevant field is the minimum",
          },
          {
            name: 'Professional credentials/licences',
            required: false,
            description: 'Especially for healthcare, engineering, or licensed professions',
          },
        ],
        tips: [
          "H-1B requires a 'specialty occupation' — typically requiring a bachelor's degree or higher in a specific field",
          'Negotiate who pays the filing fees — employers are legally required to pay the base fees',
          "If you're a recent grad on OPT, use that time to find an H-1B sponsor before OPT expires",
          'H-1B cap-exempt employers (universities, non-profits) can file year-round — a strategic option',
        ],
        estimatedTime: 'Months of job searching',
        estimatedCost: 'No direct cost to you (employer pays)',
      },
      {
        id: 2,
        title: 'Employer files H-1B lottery registration (March)',
        phase: 'applying',
        description:
          'USCIS opens H-1B electronic registration for employers each March. Your employer submits a registration on your behalf. If selected in the lottery (approximately 20–30% odds for most applicants), the employer can then file your full petition.',
        documents: [
          { name: "Employer EIN", required: true, description: "Employer's tax ID — needed for registration" },
          { name: 'Your passport details', required: true, description: 'Name exactly as in passport' },
          {
            name: 'Degree verification',
            required: true,
            description: "Level of education for lottery selection — master's degree holders get a second lottery chance",
          },
        ],
        tips: [
          "Register with your employer for the master's cap if you hold a US master's degree — it doubles your chances",
          'The lottery is random — being selected is not guaranteed even with multiple years of trying',
          'If not selected, options include cap-exempt employers, L-1 visa (intracompany transfer), or O-1 visa (extraordinary ability)',
        ],
        estimatedTime: '2 weeks for registration (March 1–18 window)',
        estimatedCost: '$215 USD registration fee (paid by employer)',
      },
      {
        id: 3,
        title: 'Employer files full H-1B petition (I-129) with USCIS',
        phase: 'applying',
        description:
          'If selected, your employer files Form I-129 (Petition for Nonimmigrant Worker) with USCIS, typically in April. They may pay for Premium Processing ($2,805*) for 15-day processing; standard processing takes 3–6 months.',
        documents: [
          { name: 'Form I-129', required: true, description: 'Filed by employer — you provide supporting documents' },
          {
            name: 'Labor Condition Application (LCA)',
            required: true,
            description: 'Employer obtains from DOL; certifies prevailing wage compliance',
          },
          { name: 'Degree certificates', required: true, description: 'Official transcripts and diploma' },
          {
            name: 'Expert opinion letter',
            required: false,
            description: 'For non-US degrees, an evaluation from a NACES-accredited service',
          },
          { name: 'Passport copy', required: true },
          {
            name: 'Current visa status documents',
            required: false,
            description: "If in US: I-94, current visa, etc.",
          },
        ],
        tips: [
          'Keep copies of everything the employer submits — you will need it for the visa interview',
          "If you're outside the US when the petition is approved, you'll need consular processing (visa stamp at Stockholm embassy)",
          'Premium Processing is worth considering if your start date is time-sensitive',
        ],
        estimatedTime: '3–6 months standard; 15 days premium',
        estimatedCost: '$730–$2,805+ USD (filing + premium, mostly employer-paid)',
      },
      {
        id: 4,
        title: 'Apply for H-1B visa stamp at US Embassy, Stockholm',
        phase: 'applying',
        description:
          'Once USCIS approves your I-129 petition, you apply for the actual H-1B visa stamp at the US Embassy in Stockholm (if you are outside the US or returning from abroad). Complete DS-160, pay MRV fee, and attend an interview.',
        documents: [
          { name: 'USCIS approval notice (Form I-797)', required: true, description: 'Original approval notice' },
          { name: 'Valid passport', required: true },
          { name: 'Form DS-160', required: true, description: 'Completed at ceac.state.gov' },
          { name: 'MRV fee receipt', required: true, description: '$185 USD paid via US Embassy Sweden portal' },
          { name: 'Employment offer letter', required: true },
          { name: 'LCA approval notice', required: true },
          { name: 'Degree certificates', required: true },
          {
            name: 'Pay stubs or contract',
            required: true,
            description: 'Demonstrating job is specialty occupation at prevailing wage',
          },
        ],
        tips: [
          'Embassy interview for H-1B is similar to other visa interviews — focus on the job role and your qualifications',
          'Processing times for H-1B stamps at Stockholm vary — book early',
          "If your petition is approved but you're in the US on another status, you may be able to change status without going to Stockholm — consult your employer's immigration attorney",
        ],
        estimatedTime: '2–6 weeks post-USCIS approval',
        estimatedCost: '$185 USD MRV fee',
      },
      {
        id: 5,
        title: 'Enter the US on H-1B',
        phase: 'on-arrival',
        description:
          'Travel to the US with your H-1B visa stamped passport and USCIS approval notice. You can only begin working for the sponsoring employer — you cannot freelance or work for other employers without authorization.',
        documents: [
          { name: 'Passport with H-1B visa stamp', required: true },
          { name: 'Form I-797 USCIS approval notice', required: true, description: 'Carry original in carry-on' },
          { name: 'Employment offer letter', required: true },
        ],
        tips: [
          "Your I-94 should reflect 'H-1B' status and the petition's validity period",
          'You can only work for the petitioning employer — changing jobs requires your new employer to file a new H-1B petition',
          'Note your petition expiry date — your employer must file for extension 6 months before it expires',
        ],
        estimatedTime: 'Standard CBP processing',
        estimatedCost: 'No additional fee',
      },
      {
        id: 6,
        title: 'Maintain H-1B status and plan for extension or Green Card',
        phase: 'in-country',
        description:
          "H-1B is employer-tied. If you change jobs, your new employer files a new petition. H-1B is valid 3 years initially, renewable to 6. Many H-1B holders pursue permanent residency (Green Card) via employer sponsorship — start this conversation early.",
        documents: [
          {
            name: 'Valid H-1B approval notice',
            required: true,
            description: 'Track expiry dates carefully',
          },
          { name: 'Pay stubs', required: true, description: 'Document that employer is paying prevailing wage' },
          {
            name: 'Updated LCA',
            required: true,
            description: "Employer must update if your role, location, or salary changes significantly",
          },
        ],
        tips: [
          "If your employer files a Green Card petition on your behalf, H-1B extensions beyond 6 years may be available",
          'Travel internationally with a valid H-1B stamp and I-797 — without a valid stamp, you cannot re-enter',
          "If you're laid off, you have a 60-day grace period to find a new H-1B sponsor or depart",
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
      'US citizens do not need a visa to enter Sweden for up to 90 days under the Schengen Agreement, but for longer study stays you must obtain a Student Residence Permit (uppehållstillstånd) from the Swedish Migration Agency (Migrationsverket). Apply at least 3 months before your programme starts.',
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
          'Apply through universityadmissions.se (for most Swedish universities) or directly to the institution. Most programmes taught in English are listed on universityadmissions.se. Once admitted, you\'ll receive an official admission letter — essential for your residence permit application.',
        documents: [
          { name: 'Completed university application', required: true, description: 'Via universityadmissions.se or directly to school' },
          { name: 'Academic transcripts and diplomas', required: true, description: 'Translated to English or Swedish if not already' },
          { name: 'English proficiency proof', required: true, description: 'TOEFL, IELTS, or equivalent' },
          { name: 'Application fee receipt', required: true, description: '900 SEK for universityadmissions.se applications' },
        ],
        tips: [
          'Application deadline for autumn semester is typically January 15 — check well in advance',
          'Swedish universities require original academic credentials — get official transcripts early',
          'Some programmes require GRE/GMAT scores — check individual programme requirements',
          'universityadmissions.se handles most universities; some apply directly (e.g. KTH, Chalmers have own portals too)',
        ],
        estimatedTime: '1–3 months (university review)',
        estimatedCost: '900 SEK application fee (≈$85 USD)',
      },
      {
        id: 2,
        title: 'Confirm financial means',
        phase: 'before-applying',
        description:
          'Migrationsverket requires proof that you can support yourself during your studies without working illegally. The requirement is approximately 10,400 SEK per month (around $980 USD) — you must demonstrate this for the full programme duration.',
        documents: [
          { name: 'Bank statements', required: true, description: 'Showing sufficient balance for full study duration' },
          { name: 'Scholarship documentation', required: false, description: 'Official letter from university or scholarship body confirming award and amount' },
          { name: 'Parental/sponsor support letter', required: false, description: 'With accompanying bank statements from sponsor' },
          { name: 'Student loan approval', required: false, description: 'E.g., approval from US Federal Student Aid or private lender' },
        ],
        tips: [
          'The requirement is roughly 10,400 SEK/month — calculate total months and ensure that amount is accessible',
          'A scholarship letter from the university can fulfil this requirement entirely',
          'Swedish student loans (CSN) are available to EU residents — as a US citizen you will not qualify for CSN',
        ],
        estimatedTime: 'Gather documents while awaiting admission',
        estimatedCost: 'No fee (document gathering)',
      },
      {
        id: 3,
        title: 'Submit residence permit application to Migrationsverket',
        phase: 'applying',
        description:
          'Submit your Student Residence Permit application online at migrationsverket.se. You must apply before your current Schengen stay expires if already in Sweden, or ideally from the US before departure.',
        documents: [
          { name: 'Valid US passport', required: true, description: 'Valid for at least 3 months beyond programme end date' },
          { name: 'University admission letter', required: true, description: 'Official acceptance to a Swedish university programme' },
          { name: 'Proof of financial means', required: true, description: 'Bank statements, scholarship, or sponsor documentation' },
          { name: 'Passport photo', required: true, description: 'Uploaded digitally to Migrationsverket portal' },
          { name: 'Application fee', required: true, description: '1,000 SEK paid online — approximately $95 USD' },
        ],
        tips: [
          'Apply as soon as you receive your admission letter — processing takes 1–4 months',
          "You can enter Sweden without the permit while your application is pending if you enter on your Schengen 90-day right, but do not overstay",
          "Track your application status on Migrationsverket's portal with the reference number you receive after applying",
          'You may need to visit a Swedish consulate in the US to provide biometrics (fingerprints + photo) — check migrationsverket.se for current requirements',
        ],
        estimatedTime: '1–4 months processing',
        estimatedCost: '1,000 SEK (≈$95 USD)',
      },
      {
        id: 4,
        title: 'Provide biometrics at a Swedish consulate or in Sweden',
        phase: 'applying',
        description:
          'Migrationsverket requires biometrics (fingerprints and a digital photo) for the residence permit card. If applying from the US, visit a Swedish consulate. If already in Sweden, visit a Migrationsverket service centre.',
        documents: [
          { name: 'Application reference number', required: true, description: 'From your online application' },
          { name: 'Valid US passport', required: true },
          { name: 'Migrationsverket appointment confirmation', required: true },
        ],
        tips: [
          'Book your biometrics appointment promptly after submitting your application — wait times at consulates vary',
          'Swedish consulates in the US are in Washington DC, New York, Los Angeles, Chicago, Houston, and Minneapolis',
          'Biometrics are required for all applicants 6 years and older',
        ],
        estimatedTime: '1–2 hours at consulate',
        estimatedCost: 'No additional fee (included in application fee)',
      },
      {
        id: 5,
        title: 'Receive your residence permit card and travel to Sweden',
        phase: 'on-arrival',
        description:
          'Migrationsverket will mail your residence permit card (uppehållstillståndskort) to your Swedish address or the consulate. Once you have it, you can travel to Sweden. Upon arrival, register with the Swedish Tax Agency (Skatteverket) if staying more than 1 year.',
        documents: [
          { name: 'Residence permit card', required: true, description: 'The physical card — present at Swedish border control' },
          { name: 'US passport', required: true },
          { name: 'Admission letter', required: false, description: 'For Swedish customs/border if asked' },
        ],
        tips: [
          'Your permit card shows your programme start and end date — ensure it covers your full study period',
          'If staying more than 12 months, register with Skatteverket to get a Swedish personal identity number (personnummer)',
          'The personnummer unlocks access to the Swedish healthcare system, banking, and more — register as soon as possible',
        ],
        estimatedTime: 'Standard border crossing',
        estimatedCost: 'No additional fee',
      },
      {
        id: 6,
        title: 'Study in Sweden and maintain your residence permit',
        phase: 'in-country',
        description:
          'Maintain full-time enrolment and financial sufficiency throughout your studies. Apply for an extension 3 months before your permit expires if you need more time. You may work up to certain hours as a student.',
        documents: [
          { name: 'Valid residence permit card', required: true, description: 'Renew before expiry via migrationsverket.se' },
          { name: 'Enrolment verification', required: true, description: 'Your university issues this each semester' },
          { name: 'Updated financial proof', required: false, description: 'Show you can continue to support yourself (for extension)' },
        ],
        tips: [
          'You may work without restrictions beyond a certain number of hours on a student permit — check current Migrationsverket rules (the rules have changed in recent years)',
          'Apply for your extension at least 3 months before your permit expires — do not wait until the last week',
          'After living in Sweden for 5 years, you may qualify for permanent residency — track your cumulative residence time',
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
      'US citizens do not need a visa to visit Sweden or any Schengen Area country for tourism or business. You can stay up to 90 days within any 180-day rolling period across the entire 29-country Schengen Zone — not just Sweden. Starting 2025, ETIAS pre-travel authorisation is required (replacing the old visa-free entry with a simple online check).',
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
          'Since 2025, US citizens need ETIAS before entering the Schengen Area. ETIAS is an online pre-travel authorisation (not a visa) — similar to ESTA for the US. Apply at the official ETIAS website at least 96 hours before departure.',
        documents: [
          {
            name: 'Valid US passport',
            required: true,
            description: 'Must be valid for at least 3 months beyond your intended departure from Schengen',
          },
          { name: 'Email address', required: true, description: 'For ETIAS notification' },
          {
            name: 'Credit/debit card',
            required: true,
            description: '€7 EUR fee for applicants 18–70 years old; free for under 18 and over 70',
          },
          { name: 'Travel itinerary', required: false, description: 'First entry country, accommodation details' },
        ],
        tips: [
          'ETIAS is valid for 3 years or until passport expiry — link it to your passport number',
          'If denied ETIAS, you may apply for a Schengen visa at a Swedish consulate instead — denials are rare for US citizens',
          'ETIAS covers the entire Schengen Area — you do not need a separate authorisation for each country',
          'Do not use third-party ETIAS application sites that charge inflated fees',
        ],
        estimatedTime: '20–30 minutes to apply; approval typically within minutes to 96 hours',
        estimatedCost: '€7 EUR (≈$7.50 USD)',
      },
      {
        id: 2,
        title: 'Arrive in Sweden and clear passport control',
        phase: 'on-arrival',
        description:
          'At passport control, present your US passport with ETIAS authorisation. A Schengen border officer will stamp your passport and note your entry date — this begins your 90-day clock. The 90 days applies to the entire Schengen Zone, not just Sweden.',
        documents: [
          { name: 'Valid US passport', required: true, description: 'With ETIAS approval linked' },
          { name: 'ETIAS authorisation', required: true, description: 'Confirmation email or reference number' },
          { name: 'Return ticket', required: false, description: 'Demonstrates intent to leave within 90 days' },
          { name: 'Accommodation proof', required: false, description: 'Hotel booking or host invitation letter' },
          { name: 'Proof of funds', required: false, description: 'Credit card or bank statement' },
        ],
        tips: [
          'The 90-day limit resets after 90 consecutive days outside the Schengen Zone — plan multi-leg European trips accordingly',
          'Entry is at the discretion of the border officer — have accommodation and funds information ready',
          'If you entered from another Schengen country, your entry date is counted from when you first entered Schengen',
        ],
        estimatedTime: 'Standard passport control',
        estimatedCost: 'No fee',
      },
      {
        id: 3,
        title: 'Follow the 90/180-day Schengen rule',
        phase: 'in-country',
        description:
          'The Schengen calculator: you may spend a maximum of 90 days in any rolling 180-day window across ALL Schengen countries combined. Track your days carefully — overstaying results in fines, deportation, and potential future bans.',
        documents: [
          { name: 'Valid passport with entry stamp', required: true },
          { name: 'ETIAS confirmation', required: true },
        ],
        tips: [
          'Use the official Schengen Calculator at ec.europa.eu to track your allowed days remaining',
          'Schengen countries include: Austria, Belgium, Czech Republic, Denmark, Estonia, Finland, France, Germany, Greece, Hungary, Iceland, Italy, Latvia, Liechtenstein, Lithuania, Luxembourg, Malta, Netherlands, Norway, Poland, Portugal, Slovakia, Slovenia, Spain, Sweden, Switzerland (and more)',
          'If you want to stay longer than 90 days, leave the Schengen Zone for 90+ days, or apply for a Swedish residence permit before your visit ends',
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
      'UK citizens are eligible for the US Visa Waiver Program for short stays but must obtain an F-1 visa for any academic study. The process is nearly identical to the Swedish path but the interview takes place at the US Embassy in London (33 Nine Elms Lane, London SW11 7US).',
    officialLinks: [
      { label: 'US Student Visas — travel.state.gov', url: 'https://travel.state.gov/content/travel/en/us-visas/study/student-visa.html' },
      { label: 'Study in the States — studyinthestates.dhs.gov', url: 'https://studyinthestates.dhs.gov' },
      { label: 'SEVIS I-901 Fee — fmjfee.com', url: 'https://www.fmjfee.com' },
    ],
    steps: makeF1Steps(
      'London',
      'UK MRV fees are paid through the US Embassy UK appointment portal before scheduling your interview.',
      'UK applicants may be asked about post-study intentions and work rights — be prepared to clearly articulate that you plan to return to the UK after graduation',
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
      'UK citizens are eligible for the US Visa Waiver Program. Apply for ESTA before travel — the official portal is esta.cbp.dhs.gov. ESTA is valid for 2 years and multiple trips, each limited to 90 days.',
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
          'Confirm you qualify for the Visa Waiver Program. UK citizens generally qualify, but certain prior travel history (e.g., to Cuba, Iran, Iraq, Libya, North Korea, Somalia, Sudan, Syria, Yemen after 2011) or prior visa refusals requires a B-2 visa instead of ESTA.',
        documents: [
          {
            name: 'Valid UK passport',
            required: true,
            description: 'Must be e-Passport with a chip. Must be valid for the entire US stay.',
          },
          {
            name: 'Travel history records',
            required: false,
            description: "If you've travelled to VWP-restricted countries, you'll need a B-2 visa instead",
          },
        ],
        tips: [
          "If you've held dual nationality with a VWP-restricted country, consult travel.state.gov before applying for ESTA",
          'Children need their own ESTA — one per person travelling',
          'ESTA is only for tourism, business, or transit — not for study or work',
          "VWP restrictions apply to UK citizens who've visited certain countries regardless of their reason for travel",
        ],
        estimatedTime: '30 minutes to verify eligibility',
        estimatedCost: 'Free (eligibility check)',
      },
      {
        id: 2,
        title: 'Apply for ESTA at esta.cbp.dhs.gov',
        phase: 'applying',
        description:
          'Complete the ESTA application online at the official CBP portal (esta.cbp.dhs.gov). Never use third-party ESTA sites that charge extra — the only official fee is $21. Most applications are approved within minutes; CBP recommends applying at least 72 hours before departure.',
        documents: [
          { name: 'UK e-Passport', required: true, description: 'Passport number, personal details, chip required' },
          { name: 'Credit/debit card', required: true, description: '$21 USD fee — payable by Visa, Mastercard, PayPal' },
          {
            name: 'US travel details',
            required: true,
            description: "First US address you'll stay at, flight details if known",
          },
          { name: 'Emergency contact', required: true, description: 'Name and phone number' },
        ],
        tips: [
          'Use ONLY esta.cbp.dhs.gov — many copycat sites charge $60–$90 for the same service',
          'Your ESTA is valid for 2 years from approval or until your passport expires, whichever is sooner',
          'Each visit is limited to 90 days — you cannot extend a VWP stay or change status to student inside the US',
          'Print or save your ESTA authorisation — airlines may ask for it at check-in',
        ],
        estimatedTime: '20–30 minutes',
        estimatedCost: '$21 USD',
      },
      {
        id: 3,
        title: 'Arrive at the US port of entry',
        phase: 'on-arrival',
        description:
          "Present your passport and completed Electronic Customs Declaration at the CBP officer's booth. With ESTA you do not need to fill in a paper I-94 form — it is generated electronically.",
        documents: [
          { name: 'Valid UK passport with ESTA approval', required: true },
          { name: 'CBP Mobile or paper customs declaration', required: true },
          { name: 'Return flight details', required: false, description: 'Demonstrates intent to leave within 90 days' },
          { name: 'Hotel/accommodation confirmation', required: false },
        ],
        tips: [
          'Verify your I-94 arrival record within 48 hours at i94.cbp.dhs.gov',
          'The CBP officer may ask about your travel plans, accommodation, and funds available — be ready to answer briefly',
          'You cannot work or study under ESTA/VWP — if asked about plans, be accurate',
        ],
        estimatedTime: '20–60 minutes at CBP',
        estimatedCost: 'No fee at entry',
      },
      {
        id: 4,
        title: 'Follow VWP rules during your stay',
        phase: 'in-country',
        description:
          'ESTA/VWP visits cannot be extended, and you cannot change your immigration status to another visa category from within the US on a VWP entry. If your plans change, you must leave and apply properly.',
        documents: [
          { name: 'Passport', required: true, description: 'Keep it safe and accessible' },
          {
            name: 'I-94 electronic record',
            required: true,
            description: 'Check at i94.cbp.dhs.gov — it shows your authorised stay',
          },
        ],
        tips: [
          '90 days is the hard limit — overstaying bars future VWP use and can affect future US visa applications',
          'If you decide to study or work, leave the US and apply for the appropriate visa before re-entering',
          'If you need emergency medical or other extension, contact a US immigration attorney',
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
      'Indian citizens are not eligible for the US Visa Waiver Program and must obtain an F-1 student visa through the US Embassy or Consulates in India. The process includes an additional step: an Off-site Facilitation Center (OFC) biometrics appointment before your consular interview. Allow extra time as wait times for Indian applicants can be 3–6 months.',
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
          'Apply to a Student and Exchange Visitor Program (SEVP)-certified US school. Once accepted, your Designated School Official (DSO) will issue Form I-20, the foundation of your entire F-1 application.',
        documents: [
          { name: 'Acceptance letter', required: true, description: 'From your US school' },
          {
            name: 'Form I-20',
            required: true,
            description: 'Issued by DSO — contains your SEVIS ID number. Keep every version.',
            whereToGet: "Your school's international students office",
          },
          {
            name: 'Financial proof',
            required: true,
            description: 'Bank statements, scholarship award letters, or sponsor letters demonstrating you can fund tuition + living costs',
          },
          {
            name: 'Valid passport',
            required: true,
            description: 'Must be valid at least 6 months beyond your intended US stay',
          },
        ],
        tips: [
          'Only SEVP-certified schools can issue I-20 forms — verify certification at sevp.ice.gov before applying',
          'Your I-20 must list your intended programme start date — plan your application timeline around this date',
          'Request your I-20 as early as possible; some schools take 2–4 weeks to issue it after acceptance',
          'Indian applicants should begin the process even earlier — 8–12 months before intended start — due to long interview wait times at US Consulates in India',
        ],
        estimatedTime: '2–8 weeks (depends on school)',
        estimatedCost: 'Varies by school (application fees)',
      },
      {
        id: 2,
        title: 'Pay the SEVIS I-901 fee',
        phase: 'before-applying',
        description:
          'The Student and Exchange Visitor Information System (SEVIS) I-901 fee registers you in the US student tracking system. Pay at fmjfee.com at least 3 business days before your embassy interview.',
        documents: [
          { name: 'Form I-20', required: true, description: 'You need the SEVIS ID number from the top of page 1' },
          { name: 'Credit/debit card', required: true, description: 'Payment via fmjfee.com — accepts Visa, Mastercard, American Express' },
          { name: 'I-901 payment receipt', required: true, description: 'Print and save as PDF — you must present this at your interview' },
        ],
        tips: [
          'Do not pay before you have your I-20 — the fee is tied to your specific SEVIS ID',
          'The receipt must be paid at least 3 business days before your consular interview',
          'Keep your receipt permanently — you may need it again if you travel and re-enter',
        ],
        estimatedTime: '15–30 minutes online',
        estimatedCost: '$350 USD* (F-1 category)',
      },
      {
        id: 3,
        title: 'Complete Form DS-160 (Online Nonimmigrant Visa Application)',
        phase: 'applying',
        description:
          "The DS-160 is the US government's official nonimmigrant visa application form, completed at ceac.state.gov. Save your application ID every 20 minutes — sessions time out.",
        documents: [
          { name: 'Valid passport', required: true, description: 'Passport number, issue/expiry dates, personal details' },
          { name: 'US visa photo', required: true, description: '51×51 mm, white background, taken within last 6 months — upload during application' },
          { name: 'Form I-20', required: true, description: 'School name, SEVIS ID, programme dates, DSO contact' },
          { name: 'Travel history', required: true, description: 'Countries visited in last 5 years with approximate dates' },
          { name: 'Prior US visas', required: false, description: 'Visa numbers from old passports (if applicable)' },
        ],
        tips: [
          "Save your DS-160 application ID after every section — you cannot recover it if the session times out",
          "Answer 'Does Not Apply' rather than leaving fields blank",
          'Print the DS-160 confirmation barcode page — you must present the barcode at your interview',
          'Ensure your name spelling matches your passport exactly',
          'Select the US Consulate in India where you\'ll interview: Chennai, Hyderabad, Kolkata, Mumbai, or New Delhi — pick based on where you live',
        ],
        estimatedTime: '1–2 hours to complete',
        estimatedCost: 'Free (form submission)',
      },
      {
        id: 4,
        title: 'Pay the MRV visa application fee',
        phase: 'applying',
        description:
          'The Machine Readable Visa (MRV) fee is the non-refundable consular processing fee. For India, pay online through ustraveldocs.com/in before scheduling your interview.',
        documents: [
          { name: 'Credit/debit card', required: true, description: 'Via ustraveldocs.com/in' },
          { name: 'MRV fee receipt', required: true, description: 'Contains your UID/transaction number needed to book your interview slot' },
        ],
        tips: [
          'Pay through the official ustraveldocs.com/in portal only — never through third-party agents',
          'Record your transaction number immediately — without it you cannot book your interview',
          'The MRV fee is non-refundable even if your visa is denied',
        ],
        estimatedTime: '10–20 minutes',
        estimatedCost: '$185 USD*',
      },
      {
        id: 5,
        title: 'Schedule both your OFC biometrics AND consular interview appointments',
        phase: 'applying',
        description:
          'Indian applicants must book two separate appointments: (1) an Off-site Facilitation Center (OFC) appointment for fingerprinting and photo, and (2) the actual visa interview at the Consulate. Both are booked via ustraveldocs.com/in.',
        documents: [
          { name: 'MRV fee receipt', required: true, description: 'Transaction number needed to access the scheduling portal' },
          { name: 'DS-160 barcode page', required: true, description: 'Link your DS-160 to your appointment' },
          { name: 'Passport details', required: true },
        ],
        tips: [
          'Book OFC appointment first — it must occur before your consular interview',
          'Wait times at Indian consulates are among the longest globally — check ustraveldocs.com/in frequently for cancellations',
          'New Delhi, Mumbai, and Chennai consulates generally have shorter wait times than Kolkata or Hyderabad — consider if any is near you',
          'Save your appointment confirmation number carefully',
        ],
        estimatedTime: '15–30 minutes to book online; wait times for appointments can be 3–6 months',
        estimatedCost: 'No additional fee for scheduling',
      },
      {
        id: 6,
        title: 'Attend OFC biometrics appointment',
        phase: 'interview',
        description:
          'At your OFC appointment, CBP contractors will collect your fingerprints and take a digital photo. This is a quick, mandatory step before your consular interview. Bring exact documents — the OFC will not accept you without them.',
        documents: [
          { name: 'Valid Indian passport', required: true },
          { name: 'OFC appointment confirmation', required: true, description: 'Printed or on phone' },
          { name: 'DS-160 barcode page', required: true },
          { name: 'MRV fee receipt', required: true },
          { name: 'Passport photo', required: true, description: 'US visa standard: 51×51 mm, white background' },
        ],
        tips: [
          'OFC appointments are typically 10–20 minutes — it is just biometrics, not an interview',
          'Arrive on time — being late may require rescheduling',
          'The OFC is different from the Consulate — note the separate addresses',
        ],
        estimatedTime: '30–60 minutes total (including wait)',
        estimatedCost: 'No additional fee',
      },
      {
        id: 7,
        title: 'Attend the visa interview at the US Consulate in India',
        phase: 'interview',
        description:
          'Attend your interview at your chosen US Consulate (Chennai, Hyderabad, Kolkata, Mumbai, or New Delhi). Indian F-1 applicants face rigorous questioning about ties to India and post-graduation plans — prepare thorough, honest answers.',
        documents: [
          { name: 'Valid Indian passport', required: true, description: 'Original + any old passports with previous US visas' },
          { name: 'Form I-20', required: true, description: 'Original, signed by both you and your DSO' },
          { name: 'DS-160 confirmation/barcode page', required: true, description: 'Printed' },
          { name: 'SEVIS I-901 fee receipt', required: true, description: 'Printed or shown on phone' },
          { name: 'MRV fee receipt', required: true, description: 'Printed' },
          { name: 'Passport photos ×2', required: true, description: 'US visa standard: 51×51 mm, white background' },
          { name: 'Financial documents', required: true, description: 'Bank statements, scholarship letters, or sponsor letters — originals + copies' },
          { name: 'School acceptance letter', required: true, description: 'Official letter with school letterhead' },
          { name: 'OFC appointment confirmation', required: true, description: 'Bring the same confirmation for your records' },
          { name: 'Property/family ties in India', required: true, description: 'Deeds, family photos, letter of family ties — essential for demonstrating non-immigrant intent' },
          { name: 'Statement of financial support', required: false, description: "With parent's/sponsor's bank statements and income proof (if sponsored by family)" },
        ],
        tips: [
          'Indian applicants are asked more detailed questions about ties to India — prepare evidence (property, employment of family, siblings or spouse in India)',
          'Bring original transcripts and test scores (TOEFL, GRE/GMAT) — officers often ask about academic background',
          'If asked about your long-term plans, clearly state you intend to return to India — this is critical',
          'Visa refusal rates for Indian F-1 applicants are higher than for some other nationalities — preparation is essential',
        ],
        estimatedTime: 'Allow a full day; interview typically 15–45 minutes',
        estimatedCost: 'No additional fee',
      },
      {
        id: 8,
        title: 'Arrive at the US port of entry',
        phase: 'on-arrival',
        description:
          "Your F-1 visa stamp in your passport is not a guarantee of entry — a CBP officer at the port of entry makes the final decision. Have all documents accessible in your carry-on, not checked luggage. You can enter up to 30 days before your I-20 programme start date.",
        documents: [
          { name: 'Passport with F-1 visa stamp', required: true, description: 'Stamped after your approved interview' },
          { name: 'Form I-20', required: true, description: 'Original — never pack in checked luggage' },
          { name: 'Proof of funds', required: true, description: 'Current bank statement or scholarship letter' },
          { name: 'School contact details', required: false, description: 'DSO name, phone, email, and school address' },
          { name: 'Return flight or onward travel plans', required: false, description: 'Shows temporary intent' },
        ],
        tips: [
          "State clearly that you are a student on an F-1 visa — never say 'tourist'",
          'Do not enter more than 30 days before your I-20 programme start date',
          'Your I-94 arrival/departure record is generated electronically — verify it within 48 hours at i94.cbp.dhs.gov',
          'Keep your I-20 in your carry-on for every future international trip',
        ],
        estimatedTime: '20–60 minutes at CBP',
        estimatedCost: 'No fee',
      },
      {
        id: 9,
        title: 'Maintain your F-1 status throughout your studies',
        phase: 'in-country',
        description:
          'F-1 status requires active maintenance. Violations — even unintentional — can trigger status termination. Contact your DSO immediately if anything in your situation changes.',
        documents: [
          { name: 'Valid Form I-20', required: true, description: 'Must remain current — DSO extends it if your programme extends' },
          { name: 'Full-time enrolment confirmation', required: true, description: 'Must maintain minimum credit load each semester' },
          { name: 'Work authorisation documents', required: false, description: 'On-campus only (<20 hrs/week) without CPT or OPT approval from DSO' },
          { name: 'Current US address on file', required: true, description: 'Must update DSO within 10 days of any address change' },
        ],
        tips: [
          'Never drop below full-time enrolment without DSO approval for a Reduced Course Load (RCL)',
          'Off-campus work without CPT/OPT authorisation is a serious status violation',
          'Keep your passport valid — renew at the Indian Consulate in the US before it expires',
          "Your I-20 has a programme end date — if you need more time, request an extension from your DSO before it expires, not after",
          'Indian students on F-1 should start CPT and OPT planning early — OPT gives up to 12 months of work authorisation post-graduation, extendable to 36 months for STEM fields',
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
      "Indian citizens are not eligible for the US Visa Waiver Program and must apply for a B-2 Tourist Visa for leisure visits. The process requires completing a DS-160, paying the MRV fee, and attending an in-person interview at a US Consulate in India. The visa itself can be issued for up to 10 years with multiple entries, but each stay is limited by the CBP officer at entry (typically up to 6 months).",
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
          'Fill out the Online Nonimmigrant Visa Application (DS-160) at ceac.state.gov. Select the US Consulate in India nearest to you as your interview location. Provide accurate details about your travel plans, finances, and purpose of visit.',
        documents: [
          { name: 'Valid Indian passport', required: true },
          { name: 'Digital passport photo', required: true, description: '51×51 mm, white background' },
          { name: 'Travel itinerary', required: true, description: 'Approximate travel dates and US addresses' },
          { name: 'Employment/financial details', required: true, description: 'Employer letter, bank statements, income proof' },
        ],
        tips: [
          'Be specific about your purpose of visit (tourism/vacation, visiting family, medical treatment, etc.)',
          'If visiting family in the US, have their contact details and immigration status ready',
          "Save your DS-160 application ID frequently — sessions expire",
        ],
        estimatedTime: '1–2 hours',
        estimatedCost: 'Free',
      },
      {
        id: 2,
        title: 'Pay the MRV fee and schedule OFC + Consular appointments',
        phase: 'applying',
        description:
          'Pay the $185 MRV fee via ustraveldocs.com/in, then book your OFC biometrics appointment and consular interview. Interview wait times at Indian consulates can be months long — check frequently for cancellations.',
        documents: [
          { name: 'Credit/debit card', required: true, description: 'For MRV fee payment' },
          { name: 'MRV fee receipt/transaction number', required: true, description: 'To book appointments' },
          { name: 'DS-160 barcode page', required: true },
        ],
        tips: [
          'Check ustraveldocs.com/in for current wait times at each consulate city before choosing your location',
          'Monitor for cancellations — slots open up regularly',
          'New Delhi and Mumbai consulates are typically the busiest; Chennai and Hyderabad may have shorter waits',
        ],
        estimatedTime: '30 minutes to pay and schedule; wait weeks to months for appointment',
        estimatedCost: '$185 USD',
      },
      {
        id: 3,
        title: 'Attend OFC biometrics appointment',
        phase: 'interview',
        description:
          'Complete your fingerprint and photo collection at the OFC before your consulate interview. Bring all required documents.',
        documents: [
          { name: 'Valid Indian passport', required: true },
          { name: 'OFC appointment confirmation', required: true },
          { name: 'DS-160 barcode page', required: true },
          { name: 'MRV fee receipt', required: true },
          { name: 'Passport photo', required: true, description: 'US visa standard: 51×51 mm, white background' },
        ],
        tips: [
          'OFC is just biometrics — no interview questions',
          'Arrive on time or early',
        ],
        estimatedTime: '30–60 minutes',
        estimatedCost: 'No additional fee',
      },
      {
        id: 4,
        title: 'Attend B-2 visa interview at US Consulate',
        phase: 'interview',
        description:
          'Present yourself at your scheduled US Consulate interview. The officer will assess your ties to India, financial stability, and genuine tourist intent. B-2 visa interviews for Indian applicants are thorough — prepare a clear travel story.',
        documents: [
          { name: 'Valid Indian passport', required: true, description: 'Plus any old passports with prior US visas' },
          { name: 'DS-160 barcode page', required: true, description: 'Printed' },
          { name: 'MRV fee receipt', required: true },
          { name: 'OFC appointment confirmation', required: true },
          { name: 'Passport photos ×2', required: true },
          { name: 'Bank statements', required: true, description: 'Last 6 months, showing financial stability' },
          { name: 'Income proof', required: true, description: 'Salary slips, ITR (Income Tax Return), Form 16' },
          { name: 'Employment letter', required: true, description: 'On company letterhead, with designation, salary, and approved leave' },
          { name: 'Property or assets documents', required: false, description: 'Home ownership, land documents' },
          { name: 'Family ties', required: false, description: 'Spouse/children living in India' },
          { name: 'Prior travel evidence', required: false, description: 'Old passports, visa stamps — shows travel history' },
          { name: 'US trip itinerary', required: false, description: 'Hotel bookings, tourist sites, family contact if visiting' },
        ],
        tips: [
          'The single biggest factor in B-2 approval for Indian applicants is demonstrating strong ties to India that compel your return',
          'A stable job with approved leave, property, and family in India significantly strengthen your case',
          "If you've had previous US visas, bring old passports to show compliance",
          'If visiting family in the US, a letter from your US contact stating your relationship and accommodation during your stay helps',
          'Dress professionally — it matters',
        ],
        estimatedTime: 'Allow a full day; interview typically 10–30 minutes',
        estimatedCost: 'No additional fee',
      },
      {
        id: 5,
        title: 'Enter the US as a B-2 tourist',
        phase: 'on-arrival',
        description:
          "A CBP officer at the US port of entry will review your B-2 visa, passport, and travel plans. They determine your authorised period of stay (typically up to 6 months). Verify your I-94 within 48 hours.",
        documents: [
          { name: 'Passport with B-2 visa stamp', required: true },
          { name: 'Return ticket', required: false, description: 'Strongly recommended — demonstrates intent to leave' },
          { name: 'Hotel bookings and itinerary', required: false },
          { name: 'Proof of funds', required: false, description: 'Credit card or cash, bank statement' },
          { name: 'CBP customs declaration', required: true, description: 'Complete on the plane or at the kiosk' },
        ],
        tips: [
          'B-2 visa does not guarantee entry — CBP has final authority',
          'Verify your I-94 at i94.cbp.dhs.gov within 48 hours of entry',
          'Do not work or study on a B-2 visa — it is tourist/visitor status only',
          'If you want to extend your stay beyond the authorised period, file Form I-539 with USCIS before your I-94 date expires',
        ],
        estimatedTime: '30–90 minutes at CBP',
        estimatedCost: 'No fee at entry',
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
