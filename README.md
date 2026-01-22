# CSV Data Converter

Convertidor de datos CSV a JSON y formato TOON con interfaz moderna estilo shadcn/ui.

## 🌟 Características

- ✅ **Conversión CSV a JSON y TOON**
- ✅ **Omite columnas 'id' automáticamente**
- ✅ **Drag & Drop** para subir archivos
- ✅ **Selector de delimitador** (coma, punto y coma, tabulación, pipe)
- ✅ **Selector de codificación** (UTF-8, ISO-8859-1, Windows-1252)
- ✅ **Tema claro/oscuro** (con detección automática del sistema)
- ✅ **Estadísticas** de conversión (filas, columnas, tamaño)
- ✅ **Copiar y descargar** resultados
- ✅ **API REST con Netlify Functions** (opcional)
- ✅ **Totalmente responsive**

## 📁 Estructura del Proyecto

```
appfit/
├── index.html                  # Página principal ⭐
├── styles.css                  # Estilos
├── script.js                   # Lógica frontend
├── package.json                # Dependencias
├── netlify.toml                # Config Netlify
├── netlify/
│   └── functions/
│       ├── convert-json.js     # API: CSV → JSON
│       └── convert-toon.js     # API: CSV → TOON
├── NETLIFY_DEPLOYMENT.md       # Guía de deploy en Netlify
└── README.md                   # Este archivo
```

## 🚀 Inicio Rápido

### Opción 1: Solo Frontend (Local)

1. Abre `index.html` en tu navegador
2. Pega tu CSV o arrastra un archivo
3. Click en "Convertir Datos"
4. ¡Listo! (Abre la consola F12 para ver un mensaje bonito)

### Opción 2: Con API REST (Netlify)

1. **Instalar dependencias:**
   ```bash
   npm install
   ```

2. **Ejecutar localmente:**
   ```bash
   npm run dev
   ```
   Abre: `http://localhost:8888`

3. **Deploy en Netlify:**
   Ver guía completa en [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)

## 💡 Uso

### Ejemplo de CSV de Entrada

```csv
id,universidad,fecha_creacion,ubicacion
86,Universidad Nacional Mayor de San Marcos,1551,Lima
87,Universidad Nacional de San Antonio Abad del Cusco,1692,Cusco
```

### Resultado JSON (sin 'id')

```json
[
  {
    "universidad": "Universidad Nacional Mayor de San Marcos",
    "fecha_creacion": "1551",
    "ubicacion": "Lima"
  },
  {
    "universidad": "Universidad Nacional de San Antonio Abad del Cusco",
    "fecha_creacion": "1692",
    "ubicacion": "Cusco"
  }
]
```

### Resultado TOON (sin 'id')

```
universidad: Universidad Nacional Mayor de San Marcos
fecha_creacion: 1551
ubicacion: Lima

universidad: Universidad Nacional de San Antonio Abad del Cusco
fecha_creacion: 1692
ubicacion: Cusco
```

## ⚙️ Configuración

### Omitir Columnas Adicionales

Para omitir más columnas además de 'id', edita `script.js`:

```javascript
// En el módulo CSVParser
excludedColumns: ['id', 'ID', 'Id', 'created_at', 'updated_at'],
```

Y también en las funciones de Netlify (`netlify/functions/*.js`):

```javascript
const EXCLUDED_COLUMNS = ['id', 'ID', 'Id', 'created_at', 'updated_at'];
```

## 🎨 Temas

- **Sistema:** Detecta automáticamente el tema del sistema operativo
- **Día:** Modo claro
- **Noche:** Modo oscuro

El tema seleccionado se guarda en localStorage.

## 📡 API REST

### Endpoints Disponibles

#### POST `/.netlify/functions/convert-json`

Convierte CSV a JSON (omitiendo columna 'id')

**Request:**
```json
{
  "csvData": "id,nombre,edad\n1,Juan,25",
  "delimiter": ","
}
```

**Response:**
```json
{
  "success": true,
  "data": [{"nombre": "Juan", "edad": "25"}],
  "stats": {
    "rows": 1,
    "columns": 2,
    "processingTime": "12ms",
    "excludedColumns": ["id", "ID", "Id"]
  }
}
```

#### POST `/.netlify/functions/convert-toon`

Convierte CSV a formato TOON (omitiendo columna 'id')

**Request:** Igual que convert-json

**Response:**
```json
{
  "success": true,
  "data": "nombre: Juan\nedad: 25\n",
  "stats": {...}
}
```

## 🛠️ Tecnologías

- **Frontend:** HTML5, CSS3, JavaScript (Vanilla)
- **Backend:** Netlify Functions (Node.js)
- **Parser CSV:** PapaParse
- **Hosting:** Netlify (gratis)

## 📦 Dependencias

```json
{
  "dependencies": {
    "papaparse": "^5.4.1"
  },
  "devDependencies": {
    "netlify-cli": "^17.0.0"
  }
}
```

## 🌐 Deploy en Netlify

Ver guía completa paso a paso en [NETLIFY_DEPLOYMENT.md](NETLIFY_DEPLOYMENT.md)

**Resumen rápido:**

```bash
# 1. Instalar Netlify CLI
npm install -g netlify-cli

# 2. Login
netlify login

# 3. Deploy
netlify deploy --prod
```

## 📝 Licencia

MIT

## 👤 Autor

TATO - [GitHub](https://github.com/leo10m2010)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Por favor, abre un issue primero para discutir cambios mayores.

## 🐛 Reportar Bugs

Si encuentras un bug, por favor abre un issue en el repositorio.

## ⭐ Dame una estrella

Si este proyecto te fue útil, considera darle una estrella en GitHub!
