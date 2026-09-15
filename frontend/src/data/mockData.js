export const patient = {
  name: 'Meera Iyer',
  age: 47,
  lastVisit: '2026-06-28',
}

export const latestReport = {
  id: 'RPT-2026-0619',
  type: 'Pathology + Mammography',
  date: '2026-06-19',
  biRads: 4,
  biRadsLabel: 'Suspicious abnormality (BI-RADS 4)',
  tumorSizeCm: 1.8,
  lymphNodeStatus: 'Negative (0/3 sampled)',
  histology: 'Invasive ductal carcinoma',
  grade: 'Grade 2',
  receptors: [
    { name: 'ER (Estrogen receptor)', status: 'Positive', value: '92%', confidence: 97 },
    { name: 'PR (Progesterone receptor)', status: 'Positive', value: '78%', confidence: 95 },
    { name: 'HER2', status: 'Negative', value: '1+', confidence: 89 },
    { name: 'Ki-67', status: 'Intermediate', value: '22%', confidence: 74 },
  ],
  extractedMedicines: [
    { name: 'Tamoxifen 20mg', confidence: 96, note: 'Daily, endocrine therapy', sig: 'Take 1 tablet by mouth daily after breakfast', duration: '5 Years' },
    { name: 'Ondansetron 4mg', confidence: 92, note: 'Anti-emetic PRN', sig: 'Take 1 tablet every 8 hours as needed for nausea', duration: '5 Days' },
  ],
  summary:
    "Your mammogram and biopsy show a small tumor (about 1.8 cm) that is hormone-receptor positive, which generally responds well to hormone-blocking treatment. Your lymph nodes tested clear of cancer cells, a favorable sign.",
}

export const mockMTSTriage = {
  triage_color: 'Yellow',
  triage_level_name: 'Urgent (Yellow - Category 3)',
  urgency_score: 3,
  target_time_minutes: 60,
  clinical_indicators: ['BI-RADS 4 Suspicious Abnormality', 'Tumor Size 1.8 cm', 'Ki-67 22% Intermediate Index'],
  action_recommendation: 'Schedule a clinical consultation with your surgical oncologist within 24-48 hours to discuss surgical pathway options.',
  provider_guidance: 'Evaluate Oncotype DX genomic score and discuss breast conservation options.'
}

export const mockProactiveAlerts = [
  {
    id: 'alert-ca153-shift',
    severity: 'Warning',
    title: 'Elevated Tumor Marker (CA 15-3 Shift)',
    date: '2026-05-15',
    parameter: 'CA 15-3',
    value: '29.1 U/mL',
    baseline: '24.6 U/mL (Mar 2026)',
    message: 'Your CA 15-3 value rose from 24.6 to 29.1 U/mL across your last 2 visits. While still near normal threshold (30 U/mL), proactive monitoring is indicated.',
    recommendation: 'Ask your treating doctor if a repeat serum marker test or ultrasound schedule is appropriate at your next appointment.'
  },
  {
    id: 'alert-tumor-shrinking',
    severity: 'Info',
    title: 'Favorable Tumor Shrinkage Response',
    date: '2026-06-19',
    parameter: 'Tumor Diameter',
    value: '1.8 cm',
    baseline: '2.3 cm (Feb 2026)',
    message: 'Your primary lesion decreased in size from 2.3 cm to 1.8 cm following therapy.',
    recommendation: 'Continue scheduled treatment plan; response matches target clinical pathway.'
  }
]

export const mockPrescriptionData = {
  prescribing_doctor: 'Dr. Anita Sharma, MD (Oncology)',
  hospital: 'Apex Comprehensive Cancer Institute',
  is_handwritten_prescription: true,
  handwritten_confidence_score: 94,
  medicines: [
    {
      name: 'Tamoxifen Citrate',
      dosage: '20 mg',
      frequency: 'Once Daily (QD)',
      duration: '5 Years',
      sig: 'Take 1 tablet by mouth daily after breakfast with a full glass of water',
      refills: '12 refills authorized',
      confidence_score: 96
    },
    {
      name: 'Ondansetron (Zofran)',
      dosage: '4 mg',
      frequency: 'Every 8 Hours PRN',
      duration: '5 Days',
      sig: 'Take 1 tablet 30 minutes before meal or as needed for nausea',
      refills: '3 refills authorized',
      confidence_score: 91
    }
  ]
}

export const trendSeries = {
  ca153: [
    { visit: 'Jan', value: 18.2, label: 'Jan 2026' },
    { visit: 'Mar', value: 24.6, label: 'Mar 2026' },
    { visit: 'May', value: 29.1, label: 'May 2026' },
    { visit: 'Jun', value: 27.4, label: 'Jun 2026' },
  ],
  tumorSize: [
    { visit: 'Feb', value: 2.3, label: 'Feb 2026' },
    { visit: 'Apr', value: 2.0, label: 'Apr 2026' },
    { visit: 'Jun', value: 1.8, label: 'Jun 2026' },
  ],
}

export const chatExamples = [
  {
    role: 'user',
    text: 'Why was Tamoxifen prescribed for me?',
  },
  {
    role: 'assistant',
    text: 'Your pathology report shows your tumor is estrogen-receptor positive (ER 92%). Tamoxifen blocks estrogen from fueling cancer cell growth, which is why it was prescribed as part of your hormone therapy plan.',
    grounded: true,
    emotion: 'Uncertain / Seeking Clarity'
  },
  {
    role: 'user',
    text: 'Is a BI-RADS 4 score serious?',
  },
  {
    role: 'assistant',
    text: 'BI-RADS 4 means "suspicious" — there\'s a moderate to high chance the finding could be cancer, which is why a biopsy was recommended. It is not a diagnosis by itself, and your biopsy result is what confirms the picture.',
    grounded: true,
    emotion: 'Anxious / Concerned'
  },
]

export const documentTypes = [
  { id: 'mammogram', label: 'Mammogram report', hint: 'PDF or scanned image' },
  { id: 'biopsy', label: 'Biopsy / pathology report', hint: 'PDF or scanned image' },
  { id: 'bloodwork', label: 'Tumor marker bloodwork', hint: 'PDF or scanned image' },
  { id: 'handwritten_prescription', label: 'Handwritten Prescription', hint: 'Scanned physician handwriting' },
  { id: 'prescription', label: 'Digital Prescription', hint: 'PDF or e-prescription' },
  { id: 'surgical', label: 'Surgical / Operative Notes', hint: 'PDF document' },
  { id: 'scan', label: 'MRI / Ultrasound / CT Scan', hint: 'PDF document' },
  { id: 'discharge', label: 'Discharge Summary', hint: 'PDF document' },
  { id: 'other', label: 'Other Medical Record', hint: 'PDF document' },
]
