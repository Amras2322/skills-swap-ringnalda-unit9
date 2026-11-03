const skillsGrid = document.getElementById('skillsGrid');
const categoryFilter = document.getElementById('categoryFilter');
const skillForm = document.getElementById('createSkillForm');

let skills = [];

function skillCardHtml(skill) {
    return (
        '<article class="skill-card">' +
            '<h3 class="skill-title">' + skill.title + '</h3>' +
            '<p class="skill-description">' + skill.description + '</p>' +
            '<div class="skill-meta">' +
                '<span class="skill-category">' + skill.category + '</span>' +
                '<span class="skill-price">$' + skill.price + ' / hr</span>' +
            '</div>' +
        '</article>'
    );
}

function attachCardListeners() {
    document.querySelectorAll('.skill-card').forEach(card => {
        card.addEventListener('click', () => {
            const title = card.querySelector('.skill-title').textContent;
            alert(title + ' clicked');
        });
    });
}

function renderSkills(skillList) {
    skillsGrid.innerHTML = skillList.map(skillCardHtml).join('');
    attachCardListeners();
}

async function loadSkills() {
    try {
        skills = await window.apiService.fetchSkills();
        applyFilter();
    } catch (error) {
        console.error('Error loading skills:', error);
    }
}

function applyFilter() {
    const filtered = filterSkillsByCategory(skills, categoryFilter.value);
    renderSkills(filtered);
}

categoryFilter.addEventListener('change', applyFilter);

document.getElementById('calculateCostButton').addEventListener('click', () => {
    const rate = parseFloat(document.getElementById('hourlyRate').value);
    const hours = parseFloat(document.getElementById('hours').value);
    const totalCost = calculateTotalCosts(rate, hours);
    document.getElementById('totalCost').textContent = 'Total Cost: $' + totalCost;
});

document.getElementById('findMatchButton').addEventListener('click', () => {
    const category = document.getElementById('matchCategory').value;
    const maxPrice = parseFloat(document.getElementById('matchMaxPrice').value);
    const userNeeds = { category: category, maxPrice: maxPrice };
    const matches = matchSkillsToUser(userNeeds, skills);
    const resultsDiv = document.getElementById('matchResults');

    if (matches.length === 0) {
        resultsDiv.innerHTML = '<p class="no-matches">No matching skills found.</p>';
    } else {
        resultsDiv.innerHTML = matches.map(skill =>
            '<div class="match-card">' +
                '<h3>' + skill.title + '</h3>' +
                '<span class="match-category">' + skill.category + '</span>' +
                '<span class="match-price">$' + skill.price + ' / hr</span>' +
            '</div>'
        ).join('');
    }
});

skillForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const skillData = {
        title: document.getElementById('skillTitle').value,
        category: document.getElementById('skillCategory').value,
        price: parseFloat(document.getElementById('skillPrice').value),
        description: document.getElementById('skillDescription').value,
    };

    try {
        await window.apiService.createSkill(skillData);
        skillForm.reset();
        await loadSkills();
    } catch (error) {
        console.error('Error creating skill:', error);
    }
});

loadSkills();
