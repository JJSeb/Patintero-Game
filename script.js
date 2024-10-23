let lines = [
    { id: 1, name: 'LINE 1', points: 1, input: 0, score: 0 },
    { id: 2, name: 'LINE 2', points: 2, input: 0, score: 0 },
    { id: 3, name: 'LINE 3', points: 3, input: 0, score: 0 },
    { id: 4, name: 'LINE 4', points: 4, input: 0, score: 0 },
    { id: 5, name: 'LINE 5', points: 5, input: 0, score: 0 },
];

let penalties = 0;

function renderLines() {
    const container = document.getElementById('lines-container');
    container.innerHTML = '';

    lines.forEach(line => {
        const lineElement = document.createElement('div');
        lineElement.className = 'grid';
        lineElement.innerHTML = `
            <div>
                <span class="line-name" data-id="${line.id}">${line.name}</span>
                ${line.name !== `LINE ${line.id}` ? `<div class="original-name">LINE ${line.id}</div>` : ''}
            </div>
            <div>
                <input type="number" value="${line.points}" min="1" max="100" class="points-input" data-id="${line.id}" aria-label="Points for ${line.name}">
            </div>
            <div>
                <input type="number" value="${line.input}" min="0" max="10" class="input-value" data-id="${line.id}" aria-label="Input for ${line.name}">
            </div>
            <div class="score">${line.score}</div>
            <div>
                <button class="btn-icon edit-name" data-id="${line.id}" aria-label="Edit name for ${line.name}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                </button>
                <button class="btn-icon btn-delete" data-id="${line.id}" aria-label="Delete ${line.name}">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
            </div>
        `;
        container.appendChild(lineElement);
    });

    attachEventListeners();
    updateTotal();
}

function attachEventListeners() {
    document.querySelectorAll('.points-input').forEach(input => {
        input.addEventListener('change', handlePointChange);
    });

    document.querySelectorAll('.input-value').forEach(input => {
        input.addEventListener('change', handleInputChange);
    });

    document.querySelectorAll('.edit-name').forEach(button => {
        button.addEventListener('click', handleEditName);
    });

    document.querySelectorAll('.btn-delete').forEach(button => {
        button.addEventListener('click', handleDeleteLine);
    });
}

function handlePointChange(event) {
    const id = parseInt(event.target.dataset.id);
    const pointValue = Math.max(1, Math.min(100, parseInt(event.target.value) || 1));
    const lineIndex = lines.findIndex(line => line.id === id);
    if (lineIndex !== -1) {
        lines[lineIndex].points = pointValue;
        lines[lineIndex].score = lines[lineIndex].input * pointValue;
        renderLines();
    }
}

function handleInputChange(event) {
    const id = parseInt(event.target.dataset.id);
    const inputValue = Math.max(0, Math.min(10, parseInt(event.target.value) || 0));
    const lineIndex = lines.findIndex(line => line.id === id);
    if (lineIndex !== -1) {
        lines[lineIndex].input = inputValue;
        lines[lineIndex].score = inputValue * lines[lineIndex].points;
        renderLines();
    }
}

function handleEditName(event) {
    const id = parseInt(event.target.closest('.btn-icon').dataset.id);
    const lineNameElement = document.querySelector(`.line-name[data-id="${id}"]`);
    const currentName = lineNameElement.textContent;

    const input = document.createElement('input');
    input.type = 'text';
    input.value = currentName;
    input.className = 'edit-input';
    input.setAttribute('data-id', id);

    lineNameElement.replaceWith(input);
    input.focus();

    input.addEventListener('blur', finishEditing);
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            finishEditing(e);
        }
    });
}

function finishEditing(event) {
    const id = parseInt(event.target.dataset.id);
    const newName = event.target.value.trim();
    const lineIndex = lines.findIndex(line => line.id === id);

    if (lineIndex !== -1 && newName !== '') {
        
        lines[lineIndex].name = newName;
        renderLines();
    } else {
        renderLines();
    }
}

function handleDeleteLine(event) {
    const id = parseInt(event.target.closest('.btn-icon').dataset.id);
    lines = lines.filter(line => line.id !== id);
    renderLines();
}

function addLine() {
    const newId = Math.max(...lines.map(line => line.id), 0) + 1;
    lines.push({ id: newId, name: `LINE ${newId}`, points: 1, input: 0, score: 0 });
    renderLines();
}

function updateTotal() {
    const total = lines.reduce((sum, line) => sum + line.score, 0) - penalties;
    document.getElementById('total-score').textContent = Math.max(0, total);
}

function updateGameInfo() {
    const group1 = document.getElementById('group1').value;
    const group2 = document.getElementById('group2').value;
    const gameNumber = document.getElementById('gameNumber').value;
    
    document.getElementById('group-display').textContent = `Group ${group1} vs Group ${group2}`;
    document.getElementById('game-display').textContent = `Game ${gameNumber}`;
}

document.getElementById('add-line').addEventListener('click', addLine);

document.getElementById('penalties').addEventListener('change', (event) => {
    penalties = Math.max(0, parseInt(event.target.value) || 0);
    document.getElementById('penalties-display').textContent = `-${penalties}`;
    updateTotal();
});

// Initialize group and game number inputs
document.getElementById('group1').addEventListener('input', (event) => {
    event.target.value = Math.max(1, Math.min(99, parseInt(event.target.value) || 1));
    updateGameInfo();
});

document.getElementById('group2').addEventListener('input', (event) => {
    event.target.value = Math.max(1, Math.min(99, parseInt(event.target.value) || 2));
    updateGameInfo();
});

document.getElementById('gameNumber').addEventListener('input', (event) => {
    event.target.value = Math.max(1, Math.min(99, parseInt(event.target.value) || 1));
    updateGameInfo();
});

renderLines();
updateGameInfo();