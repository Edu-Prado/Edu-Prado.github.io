function uploadFile() {
    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];

    if (file) {
        const formData = new FormData();
        formData.append('file', file);

        fetch('http://127.0.0.1:5000/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(data => {
            if (data.error) {
                alert('Error: ' + data.error);
            } else {
                displayResults(data);
            }
        })
        .catch(error => {
            alert('Error: ' + error);
        });
    }
}

function displayResults(data) {
    displayDescStats(data.desc_stats);
    displayCorrMatrix(data.corr_matrix);
}

function displayDescStats(stats) {
    const descStatsDiv = document.getElementById('descStats');
    let html = '<table><thead><tr><th>Statistic</th>';
    for (const col in stats) {
        html += '<th>' + col + '</th>';
    }
    html += '</tr></thead><tbody>';
    for (const stat in stats[Object.keys(stats)[0]]) {
        html += '<tr><td>' + stat + '</td>';
        for (const col in stats) {
            html += '<td>' + stats[col][stat].toFixed(2) + '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    descStatsDiv.innerHTML = html;
}

function displayCorrMatrix(matrix) {
    const corrMatrixDiv = document.getElementById('corrMatrix');
    let html = '<table><thead><tr><th></th>';
    const cols = Object.keys(matrix);
    for (const col of cols) {
        html += '<th>' + col + '</th>';
    }
    html += '</tr></thead><tbody>';
    for (const col1 of cols) {
        html += '<tr><th>' + col1 + '</th>';
        for (const col2 of cols) {
            html += '<td>' + matrix[col1][col2].toFixed(2) + '</td>';
        }
        html += '</tr>';
    }
    html += '</tbody></table>';
    corrMatrixDiv.innerHTML = html;
}