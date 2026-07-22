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
  biRadsLabel: 'Suspicious abnormality',
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
    { name: 'Tamoxifen 20mg', confidence: 96, note: 'Daily, endocrine therapy' },
    { name: 'Anastrozole', confidence: 61, note: 'Low confidence — please verify with your doctor' },
  ],
  summary:
    "Your mammogram and biopsy show a small tumor (about 1.8 cm) that is hormone-receptor positive, which generally responds well to hormone-blocking treatment. Your lymph nodes tested clear of cancer cells, a favorable sign.",
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
  },
  {
    role: 'user',
    text: 'Is a BI-RADS 4 score serious?',
  },
  {
    role: 'assistant',
    text: 'BI-RADS 4 means "suspicious" — there\'s a moderate to high chance the finding could be cancer, which is why a biopsy was recommended. It is not a diagnosis by itself, and your biopsy result is what confirms the picture.',
    grounded: true,
  },
]

export const documentTypes = [
  { id: 'mammogram', label: 'Mammogram report', hint: 'PDF or scanned image' },
  { id: 'biopsy', label: 'Biopsy / pathology report', hint: 'PDF or scanned image' },
  { id: 'bloodwork', label: 'Tumor marker bloodwork', hint: 'CA 15-3, CA 27-29, CEA' },
  { id: 'prescription', label: 'Handwritten prescription', hint: 'Photo of oncologist notes' },
]
