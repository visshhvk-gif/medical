export const commonMedicines = [
  // Antibiotics
  { name: "Amoxicillin", dosages: ["250mg", "500mg"], frequencies: ["8h", "12h"] },
  { name: "Azithromycin", dosages: ["250mg", "500mg"], frequencies: ["24h"] },
  { name: "Cefixime", dosages: ["200mg", "400mg"], frequencies: ["12h"] },
  { name: "Ciprofloxacin", dosages: ["500mg", "750mg"], frequencies: ["12h"] },

  // Pain & Anti-inflammatory
  { name: "Ibuprofen", dosages: ["400mg", "600mg"], frequencies: ["6h", "8h"] },
  { name: "Paracetamol", dosages: ["500mg"], frequencies: ["6h", "8h"] },
  { name: "Aspirin", dosages: ["75mg", "150mg"], frequencies: ["24h", "8h"] },
  { name: "Diclofenac", dosages: ["50mg"], frequencies: ["8h", "12h"] },

  // GI & Antacids
  { name: "Omeprazole", dosages: ["20mg", "40mg"], frequencies: ["12h", "24h"] },
  { name: "Ranitidine", dosages: ["150mg", "300mg"], frequencies: ["12h"] },
  { name: "Metoclopramide", dosages: ["10mg"], frequencies: ["8h"] },
  { name: "Domperidone", dosages: ["10mg"], frequencies: ["8h"] },

  // Antihypertensive
  { name: "Amlodipine", dosages: ["5mg", "10mg"], frequencies: ["24h"] },
  { name: "Lisinopril", dosages: ["5mg", "10mg"], frequencies: ["24h"] },
  { name: "Metoprolol", dosages: ["25mg", "50mg"], frequencies: ["12h", "24h"] },
  { name: "Atenolol", dosages: ["25mg", "50mg"], frequencies: ["24h"] },

  // Diabetes
  { name: "Metformin", dosages: ["500mg", "1000mg"], frequencies: ["12h", "8h"] },
  { name: "Glibenclamide", dosages: ["2.5mg", "5mg"], frequencies: ["12h"] },
  { name: "Insulin", dosages: ["10U", "20U"], frequencies: ["12h"] },

  // Thyroid
  { name: "Levothyroxine", dosages: ["25mcg", "50mcg"], frequencies: ["24h"] },
  { name: "Propranolol", dosages: ["40mg"], frequencies: ["8h", "12h"] },

  // Antihistamines & Allergies
  { name: "Cetirizine", dosages: ["10mg"], frequencies: ["24h"] },
  { name: "Loratadine", dosages: ["10mg"], frequencies: ["24h"] },
  { name: "Ambroxol", dosages: ["30mg"], frequencies: ["8h"] },

  // Cough & Cold
  { name: "Dextromethorphan", dosages: ["10mg"], frequencies: ["6h"] },
  { name: "Phenylephrine", dosages: ["10mg"], frequencies: ["8h"] },
  { name: "Salbutamol", dosages: ["2mg", "4mg"], frequencies: ["8h"] },

  // Vitamins & Supplements
  { name: "Vitamin B12", dosages: ["500mcg", "1000mcg"], frequencies: ["24h"] },
  { name: "Vitamin C", dosages: ["500mg"], frequencies: ["12h", "24h"] },
  { name: "Iron", dosages: ["325mg"], frequencies: ["24h"] },
  { name: "Calcium", dosages: ["500mg"], frequencies: ["12h", "24h"] },
];

export function searchMedicines(query: string) {
  const lowerQuery = query.toLowerCase();
  return commonMedicines.filter((m) =>
    m.name.toLowerCase().includes(lowerQuery)
  );
}

export function getMedicineByName(name: string) {
  return commonMedicines.find((m) => m.name.toLowerCase() === name.toLowerCase());
}
