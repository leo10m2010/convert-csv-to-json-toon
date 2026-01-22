const Papa = require('papaparse');

// Columnas a omitir (como 'id')
const EXCLUDED_COLUMNS = ['id', 'ID', 'Id'];

exports.handler = async (event, context) => {
    // Configurar CORS
    const headers = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Content-Type': 'application/json'
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
            headers,
            body: JSON.stringify({ 
                success: false, 
                error: 'Método no permitido. Usa POST.' 
            })
        };
    }

    try {
        // Parsear el body
        const { csvData, delimiter = ',', encoding = 'UTF-8' } = JSON.parse(event.body);

        // Validar que hay datos
        if (!csvData || csvData.trim().length === 0) {
            return {
                statusCode: 400,
                headers,
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

        // Contar columnas (sin las excluidas)
        const columnCount = result.meta.fields 
            ? result.meta.fields.filter(f => !EXCLUDED_COLUMNS.includes(f)).length 
            : 0;

        const processingTime = Date.now() - startTime;

        // Generar ID único para la conversión
        const conversionId = 'conv_' + Date.now() + Math.random().toString(36).substr(2, 9);

        // Responder
        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                success: true,
                data: filteredData,
                stats: {
                    rows: filteredData.length,
                    columns: columnCount,
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
            headers,
            body: JSON.stringify({
                success: false,
                error: error.message || 'Error interno del servidor'
            })
        };
    }
};
