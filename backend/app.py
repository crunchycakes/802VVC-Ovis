import csv
import os
from flask import Flask, abort, send_from_directory, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

imgdir = os.path.join(app.root_path, 'imgs')

@app.route('/api/message')
def get_message():
    return jsonify({'message': imgdir})

@app.route('/api/chart-data')
def get_chart_data():
    data = []
    with open("results.csv", newline='') as csvf:
        reader = csv.DictReader(csvf)
        for row in reader:
            data.append({
                'qp': int(row['quantization parameter']),
                'bytes': int(row['bytes']),
                'PSNR': float(row['PSNR']),
                'seconds': int(row['seconds'])
            })
    return jsonify(data)

@app.route('/api/image/<filename>')
def get_image(filename):
    
    if not filename.endswith(('.jpg', '.png', '.jpeg', '.gif')):
        abort(400, description="invalid file type")
    
    file_path = os.path.join(imgdir, filename)
    if not os.path.isfile(file_path):
        abort(404, description="image not found")
    
    return send_from_directory(imgdir, filename)

if __name__ == '__main__':
    app.run(debug=True)