function computeScore() {
    const age = parseInt(document.getElementById('age').value, 10);
    const eduPoints = parseInt(document.getElementById('education').value, 10);
    const expPoints = parseInt(document.getElementById('experience').value, 10);
    const clbPoints = parseInt(document.getElementById('clb').value, 10);

    const agePoints = getAgePoints(age);

    const total = agePoints + eduPoints + expPoints + (clbPoints * 4);
    document.getElementById('total').textContent = total;
}

function getAgePoints(age) {
    if (age < 18) return 0;
    if (age === 18) return 99;
    if (age === 19) return 105;
    if (age >= 20 && age <= 29) return 110;
    if (age === 30) return 105;
    if (age === 31) return 99;
    if (age === 32) return 94;
    if (age === 33) return 88;
    if (age === 34) return 83;
    if (age === 35) return 77;
    if (age === 36) return 72;
    if (age === 37) return 66;
    if (age === 38) return 61;
    if (age === 39) return 55;
    if (age === 40) return 50;
    if (age === 41) return 39;
    if (age === 42) return 28;
    if (age === 43) return 17;
    if (age === 44) return 6;
    return 0;
}

document.querySelectorAll('#crs-form input, #crs-form select').forEach(el => {
    el.addEventListener('input', computeScore);
});

computeScore();
