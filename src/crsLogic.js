// src/crsLogic.js

// Constants for points
const AGE_POINTS = {
  17: 0, 18: 99, 19: 105, 20: 110, 21: 110, 22: 110, 23: 110, 24: 110, 25: 110,
  26: 110, 27: 110, 28: 110, 29: 110, 30: 105, 31: 99, 32: 94, 33: 88, 34: 83,
  35: 77, 36: 72, 37: 66, 38: 61, 39: 55, 40: 50, 41: 39, 42: 28, 43: 17, 44: 6,
  45: 0,
};

const AGE_POINTS_WITH_SPOUSE = {
  17: 0, 18: 90, 19: 95, 20: 100, 21: 100, 22: 100, 23: 100, 24: 100, 25: 100,
  26: 100, 27: 100, 28: 100, 29: 100, 30: 95, 31: 90, 32: 85, 33: 80, 34: 75,
  35: 70, 36: 65, 37: 60, 38: 55, 39: 50, 40: 45, 41: 35, 42: 25, 43: 15, 44: 5,
  45: 0,
};

const EDUCATION_POINTS = {
  none: 0,
  secondary: 30,
  postSecondary1: 90,
  postSecondary2: 98,
  bachelors: 120,
  twoPostSecondary: 128,
  masters: 135,
  phd: 150,
};

const EDUCATION_POINTS_WITH_SPOUSE = {
  none: 0,
  secondary: 28,
  postSecondary1: 84,
  postSecondary2: 91,
  bachelors: 112,
  twoPostSecondary: 119,
  masters: 126,
  phd: 140,
};

const LANGUAGE_POINTS_FIRST = {
  4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34,
};

const LANGUAGE_POINTS_FIRST_WITH_SPOUSE = {
  4: 6, 5: 6, 6: 8, 7: 16, 8: 22, 9: 29, 10: 32,
};

const LANGUAGE_POINTS_SECOND = {
  5: 1, 6: 1, 7: 3, 8: 3, 9: 6,
};

const CANADIAN_WORK_EXP_POINTS = {
  0: 0, 1: 40, 2: 53, 3: 64, 4: 72, 5: 80,
};

const CANADIAN_WORK_EXP_POINTS_WITH_SPOUSE = {
  0: 0, 1: 35, 2: 46, 3: 56, 4: 63, 5: 70,
};

const SPOUSE_EDUCATION_POINTS = {
  none: 0,
  secondary: 2,
  postSecondary1: 6,
  postSecondary2: 7,
  bachelors: 8,
  twoPostSecondary: 9,
  masters: 10,
  phd: 10,
};

const SPOUSE_LANGUAGE_POINTS = {
  5: 1, 6: 1, 7: 3, 8: 3, 9: 5,
};

const SPOUSE_WORK_EXP_POINTS = {
  0: 0, 1: 5, 2: 7, 3: 8, 4: 9, 5: 10,
};

const SKILL_TRANSFERABILITY_POINTS = {
  // Education + Language
  "edu_lang_1": 13,
  "edu_lang_2": 25,
  "edu_lang_3": 25,
  "edu_lang_4": 50,
  // Education + Canadian Work Exp
  "edu_work_1": 13,
  "edu_work_2": 25,
  "edu_work_3": 25,
  "edu_work_4": 50,
  // Foreign Work Exp + Language
  "foreign_work_lang_1": 13,
  "foreign_work_lang_2": 25,
  "foreign_work_lang_3": 25,
  "foreign_work_lang_4": 50,
  // Foreign Work Exp + Canadian Work Exp
  "foreign_work_canadian_1": 13,
  "foreign_work_canadian_2": 25,
  "foreign_work_canadian_3": 25,
  "foreign_work_canadian_4": 50,
  // Certificate + Language
  "cert_lang_1": 25,
  "cert_lang_2": 50,
};

const ADDITIONAL_POINTS = {
  sibling: 15,
  french_25: 25,
  french_50: 50,
  canadian_edu_1_2: 15,
  canadian_edu_3_plus: 30,
  provincial_nomination: 600,
};

function getPoints(value, table, withSpouse) {
  if (withSpouse) {
    return table.withSpouse[value] || 0;
  }
  return table.single[value] || 0;
}

export function calculateCRS(inputs) {
  const {
    maritalStatus,
    age,
    education,
    canadianWorkExp,
    firstLang,
    secondLang,
    spouseEducation,
    spouseFirstLang,
    spouseWorkExp,
    foreignWorkExp,
    certificate,
    provincialNomination,
    canadianEducation,
    siblingInCanada,
  } = inputs;

  const withSpouse = maritalStatus === "married";
  let totalScore = 0;
  const breakdown = {};

  // 1. Core Human Capital Factors
  const agePointsTable = withSpouse ? AGE_POINTS_WITH_SPOUSE : AGE_POINTS;
  breakdown.age = agePointsTable[age] || 0;

  const educationPointsTable = withSpouse ? EDUCATION_POINTS_WITH_SPOUSE : EDUCATION_POINTS;
  breakdown.education = educationPointsTable[education] || 0;

  const langPointsFirstTable = withSpouse ? LANGUAGE_POINTS_FIRST_WITH_SPOUSE : LANGUAGE_POINTS_FIRST;
  let firstLangPoints = 0;
  if (firstLang) {
    firstLangPoints += langPointsFirstTable[firstLang.reading] || 0;
    firstLangPoints += langPointsFirstTable[firstLang.writing] || 0;
    firstLangPoints += langPointsFirstTable[firstLang.speaking] || 0;
    firstLangPoints += langPointsFirstTable[firstLang.listening] || 0;
  }
  breakdown.firstLang = firstLangPoints;

  let secondLangPoints = 0;
  if (secondLang) {
    secondLangPoints += LANGUAGE_POINTS_SECOND[secondLang.reading] || 0;
    secondLangPoints += LANGUAGE_POINTS_SECOND[secondLang.writing] || 0;
    secondLangPoints += LANGUAGE_POINTS_SECOND[secondLang.speaking] || 0;
    secondLangPoints += LANGUAGE_POINTS_SECOND[secondLang.listening] || 0;
  }
  breakdown.secondLang = secondLangPoints;

  const workExpPointsTable = withSpouse ? CANADIAN_WORK_EXP_POINTS_WITH_SPOUSE : CANADIAN_WORK_EXP_POINTS;
  breakdown.canadianWorkExp = workExpPointsTable[canadianWorkExp] || 0;

  const coreHumanCapitalScore = breakdown.age + breakdown.education + breakdown.firstLang + breakdown.secondLang + breakdown.canadianWorkExp;

  // 2. Spouse Factors
  let spouseScore = 0;
  if (withSpouse) {
    const spouseEducationPoints = SPOUSE_EDUCATION_POINTS[spouseEducation] || 0;

    let spouseLangPoints = 0;
    if (spouseFirstLang) {
      spouseLangPoints += SPOUSE_LANGUAGE_POINTS[spouseFirstLang.reading] || 0;
      spouseLangPoints += SPOUSE_LANGUAGE_POINTS[spouseFirstLang.writing] || 0;
      spouseLangPoints += SPOUSE_LANGUAGE_POINTS[spouseFirstLang.speaking] || 0;
      spouseLangPoints += SPOUSE_LANGUAGE_POINTS[spouseFirstLang.listening] || 0;
    }

    const spouseWorkPoints = SPOUSE_WORK_EXP_POINTS[spouseWorkExp] || 0;

    spouseScore = spouseEducationPoints + spouseLangPoints + spouseWorkPoints;
    breakdown.spouse = {
        education: spouseEducationPoints,
        language: spouseLangPoints,
        workExp: spouseWorkPoints,
        total: spouseScore
    };
  } else {
    breakdown.spouse = { total: 0 };
  }

  // 3. Skill Transferability
  let skillTransferabilityScore = 0;
  // ... this section requires complex combination logic based on the grid
  // This is a simplified version. A full implementation would be more complex.
  breakdown.skillTransferability = skillTransferabilityScore;


  // 4. Additional Points
  let additionalPoints = 0;
  if (siblingInCanada) additionalPoints += ADDITIONAL_POINTS.sibling;
  if (canadianEducation === '1-2') additionalPoints += ADDITIONAL_POINTS.canadian_edu_1_2;
  if (canadianEducation === '3+') additionalPoints += ADDITIONAL_POINTS.canadian_edu_3_plus;
  if (provincialNomination) additionalPoints += ADDITIONAL_POINTS.provincial_nomination;

  // French points
  if (firstLang.french && firstLang.french >= 7) {
      if (secondLang.english && secondLang.english >= 5) {
          additionalPoints += ADDITIONAL_POINTS.french_50;
      } else {
          additionalPoints += ADDITIONAL_POINTS.french_25;
      }
  }
  breakdown.additional = additionalPoints;

  totalScore = coreHumanCapitalScore + spouseScore + skillTransferabilityScore + additionalPoints;

  return {
    totalScore,
    breakdown: {
        coreHumanCapital: coreHumanCapitalScore,
        spouse: breakdown.spouse.total,
        skillTransferability: skillTransferabilityScore,
        additional: additionalPoints,
    },
  };
}
