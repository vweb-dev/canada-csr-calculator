document.addEventListener('DOMContentLoaded', () => {
    // --- CRS CALCULATION LOGIC ---
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
        none: 0, secondary: 30, postSecondary1: 90, postSecondary2: 98,
        bachelors: 120, twoPostSecondary: 128, masters: 135, phd: 150,
    };
    const EDUCATION_POINTS_WITH_SPOUSE = {
        none: 0, secondary: 28, postSecondary1: 84, postSecondary2: 91,
        bachelors: 112, twoPostSecondary: 119, masters: 126, phd: 140,
    };
    const LANGUAGE_POINTS_FIRST = { 4: 6, 5: 6, 6: 9, 7: 17, 8: 23, 9: 31, 10: 34 };
    const LANGUAGE_POINTS_FIRST_WITH_SPOUSE = { 4: 6, 5: 6, 6: 8, 7: 16, 8: 22, 9: 29, 10: 32 };
    const LANGUAGE_POINTS_SECOND = { 5: 1, 6: 1, 7: 3, 8: 3, 9: 6 };
    const CANADIAN_WORK_EXP_POINTS = { 0: 0, 1: 40, 2: 53, 3: 64, 4: 72, 5: 80 };
    const CANADIAN_WORK_EXP_POINTS_WITH_SPOUSE = { 0: 0, 1: 35, 2: 46, 3: 56, 4: 63, 5: 70 };
    const SPOUSE_EDUCATION_POINTS = {
        none: 0, secondary: 2, postSecondary1: 6, postSecondary2: 7,
        bachelors: 8, twoPostSecondary: 9, masters: 10, phd: 10,
    };
    const SPOUSE_LANGUAGE_POINTS = { 0:0, 4:0, 5: 1, 6: 1, 7: 3, 8: 3, 9: 5, 10: 5 };
    const SPOUSE_WORK_EXP_POINTS = { 0: 0, 1: 5, 2: 7, 3: 8, 4: 9, 5: 10 };
    const SKILL_TRANSFERABILITY_POINTS = {
        "edu_lang_1": 13, "edu_lang_2": 25, "edu_lang_3": 25, "edu_lang_4": 50,
        "edu_work_1": 13, "edu_work_2": 25, "edu_work_3": 25, "edu_work_4": 50,
        "foreign_work_lang_1": 13, "foreign_work_lang_2": 25, "foreign_work_lang_3": 25, "foreign_work_lang_4": 50,
        "foreign_work_canadian_1": 13, "foreign_work_canadian_2": 25, "foreign_work_canadian_3": 25, "foreign_work_canadian_4": 50,
        "cert_lang_1": 25, "cert_lang_2": 50,
    };
    const ADDITIONAL_POINTS = {
        sibling: 15, french_25: 25, french_50: 50, canadian_edu_1_2: 15,
        canadian_edu_3_plus: 30, provincial_nomination: 600,
    };

    function calculateCRS(inputs) {
        const withSpouse = inputs.maritalStatus === "married";
        const detailedBreakdown = {
            age: 0, education: 0, language: 0, work_ca: 0,
            spouse_education: 0, spouse_language: 0, spouse_work_ca: 0,
            skill: 0, additional: 0
        };

        // Core Human Capital
        const agePointsTable = withSpouse ? AGE_POINTS_WITH_SPOUSE : AGE_POINTS;
        detailedBreakdown.age = agePointsTable[inputs.age] || 0;
        const eduPointsTable = withSpouse ? EDUCATION_POINTS_WITH_SPOUSE : EDUCATION_POINTS;
        detailedBreakdown.education = eduPointsTable[inputs.education] || 0;
        const langPointsFirstTable = withSpouse ? LANGUAGE_POINTS_FIRST_WITH_SPOUSE : LANGUAGE_POINTS_FIRST;
        detailedBreakdown.language = (langPointsFirstTable[inputs.firstLang.reading] || 0) + (langPointsFirstTable[inputs.firstLang.writing] || 0) + (langPointsFirstTable[inputs.firstLang.speaking] || 0) + (langPointsFirstTable[inputs.firstLang.listening] || 0);
        const workExpPointsTable = withSpouse ? CANADIAN_WORK_EXP_POINTS_WITH_SPOUSE : CANADIAN_WORK_EXP_POINTS;
        detailedBreakdown.work_ca = workExpPointsTable[inputs.canadianWorkExp] || 0;

        // Spouse Factors
        if (withSpouse) {
            detailedBreakdown.spouse_education = SPOUSE_EDUCATION_POINTS[inputs.spouseEducation] || 0;
            detailedBreakdown.spouse_language = (SPOUSE_LANGUAGE_POINTS[inputs.spouseFirstLang.reading] || 0) + (SPOUSE_LANGUAGE_POINTS[inputs.spouseFirstLang.writing] || 0) + (SPOUSE_LANGUAGE_POINTS[inputs.spouseFirstLang.speaking] || 0) + (SPOUSE_LANGUAGE_POINTS[inputs.spouseFirstLang.listening] || 0);
            detailedBreakdown.spouse_work_ca = SPOUSE_WORK_EXP_POINTS[inputs.spouseWorkExp] || 0;
        }

        // --- Skill Transferability (Max 100 points) ---
        let educationPoints = 0;
        let foreignWorkPoints = 0;
        let certPoints = 0;

        const hasPostSecondary = ['postSecondary1', 'postSecondary2', 'bachelors', 'twoPostSecondary', 'masters', 'phd'].includes(inputs.education);
        const hasTwoPostSecondary = ['twoPostSecondary', 'masters', 'phd'].includes(inputs.education);
        const clb7 = inputs.firstLang.reading >= 7 && inputs.firstLang.writing >= 7 && inputs.firstLang.speaking >= 7 && inputs.firstLang.listening >= 7;
        const clb9 = inputs.firstLang.reading >= 9 && inputs.firstLang.writing >= 9 && inputs.firstLang.speaking >= 9 && inputs.firstLang.listening >= 9;

        // A. Education points
        if (hasPostSecondary && clb9) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_lang_4);
        else if (hasTwoPostSecondary && clb7) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_lang_2);
        else if (hasPostSecondary && clb7) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_lang_1);

        if (hasTwoPostSecondary && inputs.canadianWorkExp >= 2) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_work_4);
        else if (hasPostSecondary && inputs.canadianWorkExp >= 2) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_work_3);
        else if (hasTwoPostSecondary && inputs.canadianWorkExp >= 1) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_work_2);
        else if (hasPostSecondary && inputs.canadianWorkExp >= 1) educationPoints = Math.max(educationPoints, SKILL_TRANSFERABILITY_POINTS.edu_work_1);

        // B. Foreign work experience points
        if (inputs.foreignWorkExp >= 3 && clb9) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_lang_4);
        else if (inputs.foreignWorkExp >= 1 && clb9) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_lang_3);
        else if (inputs.foreignWorkExp >= 3 && clb7) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_lang_2);
        else if (inputs.foreignWorkExp >= 1 && clb7) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_lang_1);

        if (inputs.foreignWorkExp >= 3 && inputs.canadianWorkExp >= 2) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_canadian_4);
        else if (inputs.foreignWorkExp >= 1 && inputs.canadianWorkExp >= 2) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_canadian_3);
        else if (inputs.foreignWorkExp >= 3 && inputs.canadianWorkExp >= 1) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_canadian_2);
        else if (inputs.foreignWorkExp >= 1 && inputs.canadianWorkExp >= 1) foreignWorkPoints = Math.max(foreignWorkPoints, SKILL_TRANSFERABILITY_POINTS.foreign_work_canadian_1);

        // C. Certificate of qualification
        if (inputs.certificate) {
            if (clb7) certPoints = Math.max(certPoints, SKILL_TRANSFERABILITY_POINTS.cert_lang_2);
            else if (inputs.firstLang.reading >= 5 && inputs.firstLang.writing >= 5 && inputs.firstLang.speaking >= 5 && inputs.firstLang.listening >= 5) {
                certPoints = Math.max(certPoints, SKILL_TRANSFERABILITY_POINTS.cert_lang_1);
            }
        }

        detailedBreakdown.skill = Math.min(100, educationPoints + foreignWorkPoints + certPoints);

        // Additional Points
        if (inputs.siblingInCanada) detailedBreakdown.additional += ADDITIONAL_POINTS.sibling;
        if (inputs.canadianEducation === '1-2') detailedBreakdown.additional += ADDITIONAL_POINTS.canadian_edu_1_2;
        if (inputs.canadianEducation === '3+') detailedBreakdown.additional += ADDITIONAL_POINTS.canadian_edu_3_plus;
        if (inputs.provincialNomination) detailedBreakdown.additional += ADDITIONAL_POINTS.provincial_nomination;

        const coreTotal = detailedBreakdown.age + detailedBreakdown.education + detailedBreakdown.language + detailedBreakdown.work_ca;
        const spouseTotal = detailedBreakdown.spouse_education + detailedBreakdown.spouse_language + detailedBreakdown.spouse_work_ca;
        const totalScore = coreTotal + spouseTotal + detailedBreakdown.skill + detailedBreakdown.additional;

        return {
            totalScore,
            breakdown: {
                core: coreTotal,
                spouse: spouseTotal,
                skill: detailedBreakdown.skill,
                additional: detailedBreakdown.additional
            },
            detailed: detailedBreakdown
        };
    }

    function animateCountUp(element, endValue) {
        let startValue = 0;
        const duration = 1000; // 1 second
        const frameDuration = 1000 / 60; // 60 FPS
        const totalFrames = Math.round(duration / frameDuration);
        const increment = endValue / totalFrames;

        let currentFrame = 0;
        const counter = setInterval(() => {
            startValue += increment;
            currentFrame++;
            if (currentFrame === totalFrames) {
                element.textContent = endValue;
                clearInterval(counter);
            } else {
                element.textContent = Math.round(startValue);
            }
        }, frameDuration);
    }

    function generatePersonalizedTips(inputs) {
        const tips = [];
        const { education, firstLang, canadianWorkExp, foreignWorkExp, provincialNomination, siblingInCanada } = inputs;

        if (firstLang.reading < 9 || firstLang.writing < 9 || firstLang.speaking < 9 || firstLang.listening < 9) {
            tips.push("Improving your language scores to CLB 9 or higher in all abilities can significantly increase your score.");
        }
        if (education !== 'phd' && education !== 'masters') {
            tips.push("Higher levels of education, such as a Master's degree or PhD, provide more points.");
        }
        if (canadianWorkExp < 5) {
            tips.push("Gaining more Canadian work experience can increase your score. The maximum points are awarded for 5 or more years.");
        }
        if (foreignWorkExp < 3) {
            tips.push("At least 3 years of foreign work experience can add more points in combination with other factors.");
        }
        if (!provincialNomination) {
            tips.push("A provincial nomination is the most impactful way to boost your score, adding 600 points.");
        }
        if (!siblingInCanada) {
            tips.push("Having a sibling who is a Canadian citizen or permanent resident can add 15 points.");
        }

        if (tips.length === 0) {
            tips.push("Your profile is very strong! Keep an eye on the latest Express Entry draws.");
        }
        return tips;
    }

    function checkEligibility(inputs) {
        const eligiblePrograms = [];
        const { nocTeer, canadianWorkExp, foreignWorkExp, firstLang, education, age, jobOffer, certificate, relativesInCanada } = inputs;
        const teer = parseInt(nocTeer);

        // Canadian Experience Class (CEC)
        const cecLanguageOk = (teer <= 1 && firstLang.reading >= 7 && firstLang.writing >= 7 && firstLang.speaking >= 7 && firstLang.listening >= 7) ||
                              (teer >= 2 && teer <=3 && firstLang.reading >= 5 && firstLang.writing >= 5 && firstLang.speaking >= 5 && firstLang.listening >= 5);
        if (canadianWorkExp >= 1 && (teer <= 3) && cecLanguageOk) {
            eligiblePrograms.push("Canadian Experience Class (CEC)");
        }

        // Federal Skilled Worker (FSW)
        const fswLanguageOk = firstLang.reading >= 7 && firstLang.writing >= 7 && firstLang.speaking >= 7 && firstLang.listening >= 7;
        if (foreignWorkExp >= 1 && (teer <= 3) && fswLanguageOk && education !== 'none') {
            let fswPoints = 0;
            // Language
            fswPoints += (firstLang.reading >= 9 ? 6 : (firstLang.reading == 8 ? 5 : 4)) * 4;
            // Education
            if (education === 'phd') fswPoints += 25;
            else if (education === 'masters') fswPoints += 23;
            else if (education === 'twoPostSecondary') fswPoints += 22;
            else if (education === 'bachelors') fswPoints += 21;
            else if (education === 'postSecondary2') fswPoints += 19;
            else if (education === 'postSecondary1') fswPoints += 15;
            else if (education === 'secondary') fswPoints += 5;
            // Work Experience
            if (foreignWorkExp >= 6) fswPoints += 15;
            else if (foreignWorkExp >= 4) fswPoints += 13;
            else if (foreignWorkExp >= 2) fswPoints += 11;
            else if (foreignWorkExp >= 1) fswPoints += 9;
            // Age
            if (age >= 18 && age <= 35) fswPoints += 12;
            else if (age == 36) fswPoints += 11;
            else if (age == 37) fswPoints += 10;
            else if (age == 38) fswPoints += 9;
            else if (age == 39) fswPoints += 8;
            else if (age == 40) fswPoints += 7;
            else if (age == 41) fswPoints += 6;
            else if (age == 42) fswPoints += 5;
            else if (age == 43) fswPoints += 4;
            else if (age == 44) fswPoints += 3;
            else if (age == 45) fswPoints += 2;
            else if (age == 46) fswPoints += 1;
            // Arranged Employment
            if (jobOffer) fswPoints += 10;
            // Adaptability
            let adaptabilityPoints = 0;
            if (inputs.spouseFirstLang.reading >= 4 && inputs.spouseFirstLang.writing >= 4 && inputs.spouseFirstLang.speaking >= 4 && inputs.spouseFirstLang.listening >= 4) adaptabilityPoints += 5;
            if (canadianWorkExp >= 1) adaptabilityPoints += 10;
            if (inputs.spouseWorkExp >= 1) adaptabilityPoints += 5;
            if (relativesInCanada) adaptabilityPoints += 5;
            fswPoints += Math.min(10, adaptabilityPoints);

            if (fswPoints >= 67) {
                eligiblePrograms.push(`Federal Skilled Worker (FSW) - with ${fswPoints} points`);
            }
        }

        // Federal Skilled Trades (FST) - Simplified
        const fstLanguageOk = firstLang.speaking >= 5 && firstLang.listening >= 5 && firstLang.reading >= 4 && firstLang.writing >= 4;
        if (foreignWorkExp >= 2 && fstLanguageOk && (jobOffer || certificate)) {
             eligiblePrograms.push("Federal Skilled Trades (FST) - Note: Occupation must be in a specific trade group.");
        }

        return eligiblePrograms;
    }

    // --- DOM MANIPULATION ---
    const form = document.getElementById('crs-form');
    const maritalStatusSelect = document.getElementById('marital-status');
    const spouseSection = document.getElementById('spouse-info');
    const resultsSection = document.getElementById('results');
    const totalScoreEl = document.getElementById('total-score');
    const breakdownCoreEl = document.getElementById('breakdown-core');
    const breakdownSpouseEl = document.getElementById('breakdown-spouse');
    const breakdownSkillTotalEl = document.getElementById('breakdown-skill-total');
    const breakdownAdditionalTotalEl = document.getElementById('breakdown-additional-total');
    const breakdownAgeEl = document.getElementById('breakdown-age');
    const breakdownEducationEl = document.getElementById('breakdown-education');
    const breakdownLanguageEl = document.getElementById('breakdown-language');
    const breakdownWorkCaEl = document.getElementById('breakdown-work-ca');
    const breakdownSpouseEducationEl = document.getElementById('breakdown-spouse-education');
    const breakdownSpouseLanguageEl = document.getElementById('breakdown-spouse-language');
    const breakdownSpouseWorkCaEl = document.getElementById('breakdown-spouse-work-ca');
    const printBtn = document.getElementById('print-btn');
    const tipsSection = document.getElementById('tips-section');
    const tipsList = document.getElementById('tips-list');
    const eligibilityResults = document.getElementById('eligibility-results');
    const eligibilityList = document.getElementById('eligibility-list');
    const emailForm = document.getElementById('email-form');
    const emailInput = document.getElementById('email-input');
    const emailStatus = document.getElementById('email-status');
    const saveBtn = document.getElementById('save-btn');
    const loadBtn = document.getElementById('load-btn');

    let currentResult = null; // To store the latest result for emailing

    // --- MODAL LOGIC ---
    const infoContent = {
        education: {
            title: "Level of Education",
            text: "Select your highest completed level of education. You must have an Educational Credential Assessment (ECA) for foreign degrees to get points."
        },
        language: {
            title: "Language Proficiency (CLB)",
            text: "CLB stands for Canadian Language Benchmark. You must take an approved language test (IELTS for English, TEF for French) to get your CLB level for Reading, Writing, Speaking, and Listening."
        },
        work: {
            title: "Work Experience",
            text: "Provide details about your skilled work experience. Canadian experience is work done in Canada. Foreign experience is work done outside of Canada."
        }
    };

    const modal = document.getElementById('info-modal');
    const modalTitle = document.getElementById('modal-title');
    const modalText = document.getElementById('modal-text');
    const closeModalBtn = document.querySelector('.modal-close-btn');
    const infoIcons = document.querySelectorAll('.info-icon');

    infoIcons.forEach(icon => {
        icon.addEventListener('click', () => {
            const infoKey = icon.getAttribute('data-info');
            const content = infoContent[infoKey];
            if (content) {
                modalTitle.textContent = content.title;
                modalText.textContent = content.text;
                modal.classList.remove('hidden');
            }
        });
    });

    const closeModal = () => {
        modal.classList.add('hidden');
    };

    closeModalBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal();
        }
    });


    maritalStatusSelect.addEventListener('change', (e) => {
        if (e.target.value === 'married') {
            spouseSection.classList.remove('hidden');
        } else {
            spouseSection.classList.add('hidden');
        }
    });

    function updateScoreAndUI() {
        const formData = new FormData(form);
        const inputs = {
            maritalStatus: formData.get('maritalStatus'),
            age: parseInt(formData.get('age')),
            education: formData.get('education'),
            canadianWorkExp: parseInt(formData.get('canadianWorkExp')),
            firstLang: {
                reading: parseInt(formData.get('firstLangReading')),
                writing: parseInt(formData.get('firstLangWriting')),
                speaking: parseInt(formData.get('firstLangSpeaking')),
                listening: parseInt(formData.get('firstLangListening')),
            },
            spouseEducation: formData.get('spouseEducation'),
            spouseFirstLang: {
                reading: parseInt(formData.get('spouseLangReading')),
                writing: parseInt(formData.get('spouseLangWriting')),
                speaking: parseInt(formData.get('spouseLangSpeaking')),
                listening: parseInt(formData.get('spouseLangListening')),
            },
            spouseWorkExp: parseInt(formData.get('spouseWorkExp')),
            foreignWorkExp: parseInt(formData.get('foreignWorkExp')),
            certificate: form.elements['certificate'].checked,
            provincialNomination: form.elements['provincialNomination'].checked,
            siblingInCanada: form.elements['siblingInCanada'].checked,
            canadianEducation: formData.get('canadianEducation'),
        };

        const result = calculateCRS(inputs);

        // Animate the score
        animateCountUp(totalScoreEl, result.totalScore);

        // Populate detailed breakdown
        document.getElementById('breakdown-core-total').textContent = result.breakdown.core;
        document.getElementById('breakdown-spouse-total').textContent = result.breakdown.spouse;
        document.getElementById('breakdown-skill-total').textContent = result.breakdown.skill;
        document.getElementById('breakdown-additional-total').textContent = result.breakdown.additional;

        breakdownAgeEl.textContent = result.detailed.age;
        breakdownEducationEl.textContent = result.detailed.education;
        breakdownLanguageEl.textContent = result.detailed.language;
        breakdownWorkCaEl.textContent = result.detailed.work_ca;

        breakdownSpouseEducationEl.textContent = result.detailed.spouse_education;
        breakdownSpouseLanguageEl.textContent = result.detailed.spouse_language;
        breakdownSpouseWorkCaEl.textContent = result.detailed.spouse_work_ca;

        // Generate and display tips
        const tips = generatePersonalizedTips(inputs);
        tipsList.innerHTML = ''; // Clear previous tips
        tips.forEach(tip => {
            const li = document.createElement('li');
            li.textContent = tip;
            tipsList.appendChild(li);
        });

        // Check and display eligibility
        const eligiblePrograms = checkEligibility(inputs);
        eligibilityList.innerHTML = '';
        if (eligiblePrograms.length > 0) {
            eligiblePrograms.forEach(program => {
                const li = document.createElement('li');
                li.textContent = program;
                eligibilityList.appendChild(li);
            });
            eligibilityResults.classList.remove('hidden');
        } else {
            eligibilityResults.classList.add('hidden');
        }


        tipsSection.classList.remove('hidden');

        // Trigger animation
        resultsSection.classList.remove('hidden');
        resultsSection.classList.add('fade-in-up');

        printBtn.classList.remove('hidden');
        emailForm.classList.remove('hidden');

        currentResult = result; // Store result
    }

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        updateScoreAndUI();
    });

    form.addEventListener('input', () => {
        // We only want to live-update if the results are already visible
        if (!resultsSection.classList.contains('hidden')) {
            updateScoreAndUI();
        }
    });

    emailForm.addEventListener('submit', (e) => {
        e.preventDefault();
        emailStatus.textContent = 'Sending...';

        const data = {
            email: emailInput.value,
            score: currentResult.totalScore,
            breakdown: currentResult.breakdown
        };

        fetch('send_email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(data => {
            emailStatus.textContent = data.message;
            if (data.success) {
                emailStatus.style.color = 'lightgreen';
            } else {
                emailStatus.style.color = 'salmon';
            }
        })
        .catch(error => {
            console.error('Error:', error);
            emailStatus.textContent = 'An error occurred.';
            emailStatus.style.color = 'salmon';
        });
    });

    printBtn.addEventListener('click', () => {
        window.print();
    });

    // --- DRAWS TABLE LOGIC ---
    const recentDraws = [
        { date: "Aug 15, 2025", drawType: "General", minScore: 525 },
        { date: "Aug 1, 2025", drawType: "Provincial Nominee Program", minScore: 751 },
        { date: "Jul 18, 2025", drawType: "Canadian Experience Class", minScore: 458 },
        { date: "Jul 4, 2025", drawType: "General", minScore: 529 },
        { date: "Jun 20, 2025", drawType: "Federal Skilled Worker", minScore: 496 },
    ];

    function populateDrawsTable() {
        const tableBody = document.getElementById('draws-table-body');
        tableBody.innerHTML = ''; // Clear existing rows
        recentDraws.forEach(draw => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${draw.date}</td>
                <td>${draw.drawType}</td>
                <td>${draw.minScore}</td>
            `;
            tableBody.appendChild(row);
        });
    }

    populateDrawsTable();

    // --- SAVE/LOAD LOGIC ---
    saveBtn.addEventListener('click', () => {
        const formData = new FormData(form);
        const data = {};
        for (let [key, value] of formData.entries()) {
            // Special handling for checkboxes
            const element = form.elements[key];
            if (element.type === 'checkbox') {
                data[key] = element.checked;
            } else {
                data[key] = value;
            }
        }
        localStorage.setItem('crsProfile', JSON.stringify(data));
        alert('Profile Saved!');
    });

    loadBtn.addEventListener('click', () => {
        const savedData = localStorage.getItem('crsProfile');
        if (savedData) {
            const data = JSON.parse(savedData);
            for (let key in data) {
                const element = form.elements[key];
                if (element) {
                    if (element.type === 'checkbox') {
                        element.checked = data[key];
                    } else {
                        element.value = data[key];
                    }
                }
            }
            alert('Profile Loaded!');
        } else {
            alert('No saved profile found.');
        }
    });

    // Disable load button if no data
    if (!localStorage.getItem('crsProfile')) {
        loadBtn.disabled = true;
    }

    // --- THEME SWITCHER ---
    const themeToggle = document.getElementById('theme-toggle');
    const currentTheme = localStorage.getItem('theme');

    function setTheme(theme) {
        if (theme === 'light') {
            document.body.classList.add('light-mode');
            themeToggle.textContent = 'Dark Mode';
        } else {
            document.body.classList.remove('light-mode');
            themeToggle.textContent = 'Light Mode';
        }
    }

    if (currentTheme) {
        setTheme(currentTheme);
    } else {
        // Default to dark unless user prefers light
        const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
        if (prefersLight) {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        } else {
             localStorage.setItem('theme', 'dark');
             setTheme('dark');
        }
    }

    themeToggle.addEventListener('click', () => {
        let theme = localStorage.getItem('theme');
        if (theme === 'dark') {
            localStorage.setItem('theme', 'light');
            setTheme('light');
        } else {
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        }
    });
});
