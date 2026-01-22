const Papa = require('papaparse');

// Columnas a omitir (como 'id')
const EXCLUDED_COLUMNS = ['id', 'ID', 'Id'];

exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'text/plain'
    };

    // Manejar preflight request
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers,
            body: ''
        };
    }

    // Solo aceptar POST
    if (event.httpMethod !== 'POST') {
        return {
            statusCode: 405,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                success: false, 
                error: 'Método no permitido. Usa POST.' 
            })
        };
    }

    try {
        // Parsear el body
        const { csvData, delimiter = ',' } = JSON.parse(event.body);

        // Validar que hay datos
        if (!csvData || csvData.trim().length === 0) {
            return {
                statusCode: 400,
                headers: { ...headers, 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    success: false,
                    error: 'No se proporcionó contenido CSV'
                })
            };
        }

        const startTime = Date.now();

        // Parsear CSV usando Papa Parse
        const result = Papa.parse(csvData, {
            header: true,
            delimiter: delimiter === '\\t' ? '\t' : delimiter,
            skipEmptyLines: true
        });

        // FILTRAR columnas excluidas (como 'id')
        const filteredData = result.data.map(row => {
            const filteredRow = {};
            for (const [key, value] of Object.entries(row)) {
                if (!EXCLUDED_COLUMNS.includes(key)) {
                    filteredRow[key] = value;
                }
            }
            return filteredRow;
        });

        // Convertir a formato TOON
        let toonText = '';
        filteredData.forEach((item, index) => {
            for (let key in item) {
                toonText += `${key}: ${item[key]}\n`;
            }
            if (index < filteredData.length - 1) {
                toonText += '\n';
            }
        });

        const processingTime = Date.now() - startTime;
        const conversionId = 'conv_' + Date.now() + Math.random().toString(36).substr(2, 9);

        // Responder con formato TOON
        return {
            statusCode: 200,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: true,
                data: toonText,
                stats: {
                    rows: filteredData.length,
                    processingTime: processingTime + 'ms',
                    excludedColumns: EXCLUDED_COLUMNS
                },
                conversionId: conversionId
            })
        };

    } catch (error) {
        console.error('Error:', error);
        return {
            statusCode: 500,
            headers: { ...headers, 'Content-Type': 'application/json' },
            body: JSON.stringify({
                success: false,
                error: error.message || 'Error interno del servidor'
            })
        };
    }
};
