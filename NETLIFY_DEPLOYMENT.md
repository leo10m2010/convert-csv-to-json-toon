# API REST en Netlify - CSV Converter

## 🎯 ¿Qué es Netlify Functions?

**Netlify Functions** son funciones serverless (sin servidor) que se ejecutan en la nube de Netlify. No necesitas mantener un servidor 24/7, solo pagas por el uso (y Netlify tiene un plan GRATIS muy generoso).

### **Ventajas de Netlify:**
- ✅ **Gratis** hasta 125,000 peticiones/mes
- ✅ **Deploy automático** desde GitHub
- ✅ **HTTPS automático** (SSL gratis)
- ✅ **CDN global** (súper rápido)
- ✅ **No necesitas servidor** (serverless)
- ✅ **Fácil de usar** (no requiere configuración compleja)

---

## 📁 Estructura del Proyecto

```
appfit/
├── conversor.html              # Frontend
├── styles.css                  # Estilos
├── script.js                   # Lógica frontend
├── netlify.toml                # Configuración de Netlify
├── package.json                # Dependencias
└── netlify/
    └── functions/
        ├── convert-json.js     # Función: CSV → JSON
        └── convert-toon.js     # Función: CSV → TOON
```

---

## 🚀 Instalación y Configuración

### **Paso 1: Instalar Dependencias**

```bash
cd appfit
npm install
```

Esto instalará:
- `papaparse` - Para parsear CSV
- `netlify-cli` - Para probar localmente

---

### **Paso 2: Probar Localmente**

```bash
# Iniciar servidor de desarrollo
npm run dev
```

Esto iniciará:
- Frontend en: `http://localhost:8888`
- API Functions en: `http://localhost:8888/.netlify/functions/`

**Endpoints locales:**
- `http://localhost:8888/.netlify/functions/convert-json`
- `http://localhost:8888/.netlify/functions/convert-toon`

---

### **Paso 3: Crear Cuenta en Netlify**

1. Ve a [netlify.com](https://netlify.com)
2. Regístrate gratis (puedes usar tu cuenta de GitHub)
3. No necesitas tarjeta de crédito

---

### **Paso 4: Subir a GitHub**

```bash
# Inicializar repositorio Git (si no lo tienes)
git init

# Agregar todos los archivos
git add .

# Hacer commit
git commit -m "Initial commit: CSV Converter con Netlify Functions"

# Crear repositorio en GitHub y subir
git remote add origin https://github.com/TU_USUARIO/csv-converter.git
git branch -M main
git push -u origin main
```

---

### **Paso 5: Conectar con Netlify**

#### **Opción A: Desde el Dashboard de Netlify (Recomendado)**

1. Entra a [app.netlify.com](https://app.netlify.com)
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Busca tu repositorio `csv-converter`
5. Configuración:
   - **Build command:** `echo 'No build needed'`
   - **Publish directory:** `.` (punto)
   - **Functions directory:** `netlify/functions`
6. Click en **"Deploy site"**

¡Listo! En 1-2 minutos tendrás tu sitio en línea.

#### **Opción B: Desde la Terminal**

```bash
# Instalar Netlify CLI globalmente
npm install -g netlify-cli

# Login a Netlify
netlify login

# Crear nuevo sitio
netlify init

# Deploy
netlify deploy --prod
```

---

## 📡 Uso de las Funciones

### **Tu sitio estará en:** 
`https://TU_SITIO.netlify.app`

### **Tus funciones estarán en:**
- `https://TU_SITIO.netlify.app/.netlify/functions/convert-json`
- `https://TU_SITIO.netlify.app/.netlify/functions/convert-toon`

---

## 🧪 Ejemplos de Uso

### **1. Convertir CSV a JSON**

```javascript
// Ejemplo desde tu frontend
const response = await fetch('https://TU_SITIO.netlify.app/.netlify/functions/convert-json', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        csvData: "id,universidad,fecha_creacion\n86,UNMSM,1551",
        delimiter: ","
    })
});

const result = await response.json();
console.log(result);
```

**Response (sin el campo 'id'):**
```json
{
  "success": true,
  "data": [
    {
      "universidad": "UNMSM",
      "fecha_creacion": "1551"
    }
  ],
  "stats": {
    "rows": 1,
    "columns": 2,
    "processingTime": "12ms",
    "excludedColumns": ["id", "ID", "Id"]
  },
  "conversionId": "conv_1234567890xyz"
}
```

---

### **2. Convertir CSV a TOON**

```javascript
const response = await fetch('https://TU_SITIO.netlify.app/.netlify/functions/convert-toon', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({
        csvData: "id,universidad,fecha_creacion\n86,UNMSM,1551",
        delimiter: ","
    })
});

const result = await response.json();
console.log(result);
```

**Response (sin el campo 'id'):**
```json
{
  "success": true,
  "data": "universidad: UNMSM\nfecha_creacion: 1551\n",
  "stats": {
    "rows": 1,
    "processingTime": "8ms",
    "excludedColumns": ["id", "ID", "Id"]
  },
  "conversionId": "conv_9876543210abc"
}
```

---

## 🔧 Modificar el Frontend para Usar el API

Actualiza `script.js` en el módulo `Converter`:

```javascript
// En script.js - Módulo Converter
const Converter = {
    // ... código existente ...

    // Configuración del API (cambia esto por tu URL de Netlify)
    API_URL: 'https://TU_SITIO.netlify.app/.netlify/functions',
    // O para desarrollo local:
    // API_URL: 'http://localhost:8888/.netlify/functions',

    async process() {
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
            this.elements.convertBtn.disabled = true;
            this.elements.convertBtn.innerHTML = 'Procesando...<span class="spinner"></span>';

            const delimiter = this.elements.delimiter.value === '\\t' ? '\t' : this.elements.delimiter.value;

            // LLAMAR AL API DE NETLIFY
            const [jsonResponse, toonResponse] = await Promise.all([
                fetch(`${this.API_URL}/convert-json`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ csvData: csvText, delimiter })
                }),
                fetch(`${this.API_URL}/convert-toon`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ csvData: csvText, delimiter })
                })
            ]);

            const jsonResult = await jsonResponse.json();
            const toonResult = await toonResponse.json();

            if (jsonResult.success && toonResult.success) {
                // Mostrar resultados
                this.elements.jsonOutput.textContent = JSON.stringify(jsonResult.data, null, 2);
                this.elements.jsonOutput.classList.remove('empty-text');

                this.elements.toonOutput.textContent = toonResult.data;
                this.elements.toonOutput.classList.remove('empty-text');

                // Actualizar estadísticas
                this.updateStats(jsonResult.stats.rows, jsonResult.stats.columns, csvText.length);

                Utils.showToast('Conversión exitosa! (columna "id" omitida)', 'success');
            } else {
                Utils.showToast(`Error: ${jsonResult.error || toonResult.error}`, 'error');
            }

        } catch (error) {
            // Si falla el API, usar procesamiento local
            console.warn('API no disponible, procesando localmente:', error);
            this.processLocally();
        } finally {
            this.elements.convertBtn.disabled = false;
            this.elements.convertBtn.textContent = 'Convertir Datos';
        }
    },

    // Función de respaldo (procesamiento local)
    processLocally() {
        try {
            const csvText = this.elements.csvInput.value.trim();
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

            Utils.showToast('Conversión exitosa (local, columna "id" omitida)', 'success');
        } catch (error) {
            Utils.showToast(`Error: ${error.message}`, 'error');
        }
    }
};
```

---

## ⚙️ Configuración Avanzada

### **Personalizar Columnas a Omitir**

Edita `netlify/functions/convert-json.js` y `convert-toon.js`:

```javascript
// Cambia esta línea:
const EXCLUDED_COLUMNS = ['id', 'ID', 'Id'];

// Por ejemplo, para omitir más columnas:
const EXCLUDED_COLUMNS = ['id', 'ID', 'Id', 'created_at', 'updated_at'];
```

---

### **Aumentar Límites**

Por defecto, Netlify Functions tienen:
- **Timeout:** 10 segundos (gratis) / 26 segundos (pro)
- **Memoria:** 1 GB
- **Payload:** 6 MB

Si necesitas más, considera el plan Pro de Netlify.

---

## 🔄 Actualizar el Deploy

Cada vez que hagas cambios y los subas a GitHub:

```bash
git add .
git commit -m "Descripción de cambios"
git push
```

Netlify automáticamente detectará los cambios y hará **deploy automático** en 1-2 minutos.

---

## 🧪 Probar las Funciones

### **Con cURL:**

```bash
curl -X POST https://TU_SITIO.netlify.app/.netlify/functions/convert-json \
  -H "Content-Type: application/json" \
  -d '{"csvData":"id,universidad,fecha_creacion\n86,UNMSM,1551","delimiter":","}'
```

### **Con Postman:**

1. Método: `POST`
2. URL: `https://TU_SITIO.netlify.app/.netlify/functions/convert-json`
3. Headers: `Content-Type: application/json`
4. Body (raw JSON):
```json
{
  "csvData": "id,universidad,fecha_creacion\n86,UNMSM,1551",
  "delimiter": ","
}
```

---

## 📊 Monitoreo

En el dashboard de Netlify puedes ver:
- Número de peticiones
- Tiempo de ejecución
- Errores
- Logs en tiempo real

---

## 🎁 Plan Gratis de Netlify

El plan gratis incluye:
- ✅ 300 minutos de build/mes
- ✅ 100 GB de ancho de banda/mes
- ✅ 125,000 peticiones de funciones/mes
- ✅ SSL automático
- ✅ Deploy automático desde Git
- ✅ Dominio personalizado gratis

**Esto es más que suficiente para un proyecto personal o pequeño.**

---

## 🐛 Troubleshooting

### **Problema: "Function not found"**
- Verifica que `netlify.toml` esté en la raíz
- Confirma que las funciones están en `netlify/functions/`

### **Problema: CORS errors**
- Ya está configurado en `netlify.toml`
- Si persiste, agrega headers en cada función

### **Problema: "Cannot find module 'papaparse'"**
- Asegúrate de que `package.json` esté en la raíz
- Netlify instalará automáticamente las dependencias

---

## ✅ Checklist de Deploy

- [ ] Crear repositorio en GitHub
- [ ] Subir código a GitHub
- [ ] Crear cuenta en Netlify
- [ ] Conectar repositorio con Netlify
- [ ] Esperar el deploy automático
- [ ] Copiar la URL de tu sitio
- [ ] Actualizar `API_URL` en `script.js`
- [ ] Probar las funciones
- [ ] ¡Celebrar! 🎉

---

**¿Necesitas ayuda con algún paso? ¡Pregúntame!**
