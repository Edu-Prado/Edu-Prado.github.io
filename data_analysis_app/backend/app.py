from flask import Flask, request, jsonify
import pandas as pd
import numpy as np

app = Flask(__name__)

# Rota para processar o arquivo CSV
@app.route('/upload', methods=['POST'])
def upload_file():
    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        try:
            df = pd.read_csv(file)
            # Calculando estatísticas descritivas para colunas numéricas
            numeric_cols = df.select_dtypes(include=np.number).columns
            desc_stats = df[numeric_cols].describe().to_dict()

            # Calculando a matriz de correlação
            corr_matrix = df[numeric_cols].corr().to_dict()

            return jsonify({
                'desc_stats': desc_stats,
                'corr_matrix': corr_matrix,
                'columns': list(df.columns)
            })
        except Exception as e:
            return jsonify({'error': str(e)}), 500

@app.route('/data', methods=['GET'])
def get_data():
    # To be implemented in the future, if needed for direct data access
    return jsonify({'message': 'Data access not yet implemented'}), 405

if __name__ == '__main__':
    app.run(debug=True)