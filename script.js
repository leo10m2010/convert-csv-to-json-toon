// ========================================
// MÓDULO: Gestión de Tema
// ========================================
const ThemeManager = {
    themeSelect: null,

    init() {
        this.themeSelect = document.getElementById('themeSelect');
        this.themeSelect.addEventListener('change', (e) => this.setTheme(e.target.value));
        this.loadTheme();
        
        // Escuchar cambios en la preferencia del sistema
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (this.themeSelect.value === 'system') {
                this.setTheme('system');
            }
        });
    },

    setTheme(theme) {
        const html = document.documentElement;
        html.classList.remove('light', 'dark');
        
        if (theme === 'system') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            html.classList.add(isDark ? 'dark' : 'light');
        } else {
            html.classList.add(theme);
        }
        
        localStorage.setItem('theme', theme);
        this.themeSelect.value = theme;
    },

    loadTheme() {
        const savedTheme = localStorage.getItem('theme') || 'system';
        this.setTheme(savedTheme);
    }
};

// ========================================
// MÓDULO: Utilidades
// ========================================
const Utils = {
    // Mostrar notificación toast
    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        toast.textContent = message;
        toast.className = type;
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    },

    // Formatear tamaño de archivo
    formatBytes(bytes) {
        if (bytes === 0) return '0 B';
        const k = 1024;
        const sizes = ['B', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    },

    // Validar si el texto es CSV válido
    isValidCSV(text) {
        const lines = text.trim().split(/\r?\n/);
        return lines.length >= 2; // Al menos encabezado + 1 fila de datos
    }
};

// ========================================
// MÓDULO: Parser CSV
// ========================================
const CSVParser = {
    // Columnas a omitir en el resultado
    excludedColumns: ['id', 'ID', 'Id'],

    parse(text, delimiter = ',') {
        const lines = text.trim().split(/\r?\n/);
        if (lines.length < 2) {
            throw new Error('El CSV debe tener al menos una fila de encabezados y una fila de datos');
        }

        const headers = this.splitLine(lines[0], delimiter);
        const data = [];

        for (let i = 1; i < lines.length; i++) {
            const line = lines[i].trim();
            if (!line) continue; // Saltar líneas vacías
            
            const values = this.splitLine(line, delimiter);
            const obj = {};
            
            headers.forEach((header, index) => {
                // OMITIR columnas excluidas (como 'id')
                if (this.excludedColumns.includes(header)) {
                    return; // Saltar esta columna
                }
                
                let value = values[index] || "";
                // Eliminar comillas al inicio y final
                value = value.replace(/^"|"$/g, '').trim();
                obj[header] = value;
            });
            
            data.push(obj);
        }

        // Filtrar headers para stats (sin columnas excluidas)
        const filteredHeaders = headers.filter(h => !this.excludedColumns.includes(h));

        return { data, headers: filteredHeaders, rowCount: data.length };
    },

    splitLine(line, delimiter) {
        const result = [];
        let current = '';
        let inQuotes = false;
        
        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            
            if (char === '"') {
                inQuotes = !inQuotes;
            } else if (char === delimiter && !inQuotes) {
                result.push(current.trim());
                current = '';
            } else {
                current += char;
            }
        }
        
        result.push(current.trim());
        return result.map(val => val.replace(/^"|"$/g, ''));
    }
};

// ========================================
// MÓDULO: Drag & Drop
// ========================================
const DragDropManager = {
    dropZone: null,
    dropOverlay: null,

    init(dropZone, onFileDrop) {
        this.dropZone = dropZone;
        this.dropOverlay = document.getElementById('dropOverlay');
        this.onFileDrop = onFileDrop;

        // Prevenir comportamiento por defecto del navegador
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, this.preventDefaults, false);
            document.body.addEventListener(eventName, this.preventDefaults, false);
        });

        // Resaltar zona de drop
        ['dragenter', 'dragover'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => this.highlight(), false);
        });

        ['dragleave', 'drop'].forEach(eventName => {
            this.dropZone.addEventListener(eventName, () => this.unhighlight(), false);
        });

        // Manejar el archivo soltado
        this.dropZone.addEventListener('drop', (e) => this.handleDrop(e), false);
    },

    preventDefaults(e) {
        e.preventDefault();
        e.stopPropagation();
    },

    highlight() {
        this.dropZone.classList.add('drag-over');
        if (this.dropOverlay) {
            this.dropOverlay.classList.add('show');
        }
    },

    unhighlight() {
        this.dropZone.classList.remove('drag-over');
        if (this.dropOverlay) {
            this.dropOverlay.classList.remove('show');
        }
    },

    handleDrop(e) {
        const dt = e.dataTransfer;
        const files = dt.files;

        if (files.length > 0) {
            this.onFileDrop(files[0]);
        }
    }
};

// ========================================
// MÓDULO: Conversor
// ========================================
const Converter = {
    elements: {},

    init() {
        // Cachear elementos del DOM usando selectores sin agregar IDs nuevos
        this.elements = {
            csvInput: document.getElementById('csvInput'),
            fileInput: document.getElementById('fileInput'),
            convertBtn: document.querySelector('.btn-convert'),
            clearBtn: document.querySelector('.btn-clear'),
            delimiter: document.getElementById('delimiter'),
            encoding: document.getElementById('encoding'),
            jsonOutput: document.getElementById('jsonOutput'),
            toonOutput: document.getElementById('toonOutput'),
            copyJsonBtn: document.querySelector('.btn-copy-json'),
            copyToonBtn: document.querySelector('.btn-copy-toon'),
            downloadJsonBtn: document.querySelector('.btn-download-json'),
            downloadToonBtn: document.querySelector('.btn-download-toon'),
            statsBar: document.getElementById('statsBar'),
            rowCount: document.getElementById('rowCount'),
            colCount: document.getElementById('colCount'),
            fileSize: document.getElementById('fileSize')
        };

        // Agregar event listeners
        this.elements.fileInput.addEventListener('change', (e) => this.handleFile(e));
        this.elements.convertBtn.addEventListener('click', () => this.process());
        this.elements.clearBtn.addEventListener('click', () => this.clearAll());
        this.elements.copyJsonBtn.addEventListener('click', () => this.copy('jsonOutput'));
        this.elements.copyToonBtn.addEventListener('click', () => this.copy('toonOutput'));
        this.elements.downloadJsonBtn.addEventListener('click', () => this.download('json'));
        this.elements.downloadToonBtn.addEventListener('click', () => this.download('toon'));

        // Inicializar Drag & Drop
        DragDropManager.init(this.elements.csvInput, (file) => this.handleFileObject(file));
    },

    handleFile(event) {
        const file = event.target.files[0];
        if (!file) return;
        this.handleFileObject(file);
    },

    handleFileObject(file) {
        // Validar tipo de archivo
        const validTypes = ['text/csv', 'text/plain', 'application/vnd.ms-excel'];
        const fileName = file.name.toLowerCase();
        const isCSV = validTypes.includes(file.type) || fileName.endsWith('.csv') || fileName.endsWith('.txt');

        if (!isCSV) {
            Utils.showToast('Por favor sube un archivo CSV o TXT', 'error');
            return;
        }

        // Validar tamaño del archivo (máx 10MB)
        if (file.size > 10 * 1024 * 1024) {
            Utils.showToast('El archivo es demasiado grande. Máximo 10MB.', 'error');
            return;
        }

        const reader = new FileReader();
        reader.onload = (evt) => {
            this.elements.csvInput.value = evt.target.result;
            this.process();
        };
        reader.onerror = () => {
            Utils.showToast('Error al leer el archivo', 'error');
        };
        reader.readAsText(file, this.elements.encoding.value);
    },

    process() {
        const csvText = this.elements.csvInput.value.trim();
        
        if (!csvText) {
            Utils.showToast('Por favor ingresa o carga un archivo CSV', 'error');
            return;
        }

        if (!Utils.isValidCSV(csvText)) {
            Utils.showToast('El formato CSV no es válido', 'error');
            return;
        }

        try {
            // Mostrar spinner de carga
            this.elements.convertBtn.disabled = true;
            this.elements.convertBtn.innerHTML = 'Procesando...<span class="spinner"></span>';

            // Pequeño delay para mostrar el spinner
            setTimeout(() => {
                try {
                    const delimiter = this.elements.delimiter.value === '\\t' ? '\t' : this.elements.delimiter.value;
                    const { data, headers, rowCount } = CSVParser.parse(csvText, delimiter);
                    
                    // Renderizar JSON
                    this.elements.jsonOutput.textContent = JSON.stringify(data, null, 2);
                    this.elements.jsonOutput.classList.remove('empty-text');

                    // Renderizar TOON
                    let toonText = "";
                    data.forEach((item, index) => {
                        for (let key in item) {
                            toonText += `${key}: ${item[key]}\n`;
                        }
                        if (index < data.length - 1) {
                            toonText += "\n";
                        }
                    });
                    this.elements.toonOutput.textContent = toonText;
                    this.elements.toonOutput.classList.remove('empty-text');

                    // Actualizar estadísticas
                    this.updateStats(rowCount, headers.length, csvText.length);

                    Utils.showToast('Conversión exitosa!', 'success');
                } catch (error) {
                    Utils.showToast(`Error: ${error.message}`, 'error');
                } finally {
                    this.elements.convertBtn.disabled = false;
                    this.elements.convertBtn.textContent = 'Convertir Datos';
                }
            }, 100);
        } catch (error) {
            Utils.showToast(`Error inesperado: ${error.message}`, 'error');
            this.elements.convertBtn.disabled = false;
            this.elements.convertBtn.textContent = 'Convertir Datos';
        }
    },

    updateStats(rows, cols, size) {
        this.elements.statsBar.style.display = 'flex';
        this.elements.rowCount.textContent = rows;
        this.elements.colCount.textContent = cols;
        this.elements.fileSize.textContent = Utils.formatBytes(size);
    },

    copy(outputId) {
        const element = this.elements[outputId];
        if (element.classList.contains('empty-text')) {
            Utils.showToast('No hay datos para copiar', 'error');
            return;
        }

        navigator.clipboard.writeText(element.textContent)
            .then(() => {
                Utils.showToast('Copiado al portapapeles', 'success');
            })
            .catch(() => {
                Utils.showToast('Error al copiar', 'error');
            });
    },

    download(type) {
        const element = this.elements[type + 'Output'];
        if (element.classList.contains('empty-text')) {
            Utils.showToast('No hay datos para descargar', 'error');
            return;
        }
        
        const blob = new Blob([element.textContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        const timestamp = new Date().toISOString().slice(0, 10);
        
        a.href = url;
        a.download = `datos_${timestamp}.${type === 'json' ? 'json' : 'toon'}`;
        a.click();
        URL.revokeObjectURL(url);
        
        Utils.showToast('Descarga iniciada', 'success');
    },

    clearAll() {
        this.elements.csvInput.value = '';
        this.elements.jsonOutput.textContent = 'Los resultados aparecerán aquí...';
        this.elements.toonOutput.textContent = 'Los resultados aparecerán aquí...';
        this.elements.jsonOutput.classList.add('empty-text');
        this.elements.toonOutput.classList.add('empty-text');
        this.elements.fileInput.value = '';
        this.elements.statsBar.style.display = 'none';
        
        Utils.showToast('Todo limpiado', 'success');
    }
};

// ========================================
// INICIALIZACIÓN
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    ThemeManager.init();
    Converter.init();
});
