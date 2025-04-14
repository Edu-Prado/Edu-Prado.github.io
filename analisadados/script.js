document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const resultsDiv = document.getElementById('results');
    const descStatsDiv = document.getElementById('descStats');
    const corrMatrixDiv = document.getElementById('corrMatrix');
    const errorDiv = document.getElementById('error');

    resultsDiv.classList.add('hidden');
    errorDiv.classList.add('hidden');

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('https://eduprado.pythonanywhere.com/upload', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errorData => {
                    throw new Error(errorData.error || 'Erro na análise.');
                });
            }
            return response.json();
        })
        .then(data => {
            descStatsDiv.textContent = JSON.stringify(data[0], null, 2);
            corrMatrixDiv.textContent = JSON.stringify(data[1], null, 2);
            resultsDiv.classList.remove('hidden');
        })
        .catch(error => {
            errorDiv.textContent = error.message;
            errorDiv.classList.remove('hidden');
        });
    } else {
        errorDiv.textContent = 'Por favor, selecione um arquivo.';
        errorDiv.classList.remove('hidden');
    }
});