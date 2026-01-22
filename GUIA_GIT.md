# Guía: Subir a GitHub y Eliminar Archivo Viejo

## 🎯 Lo que vamos a hacer

1. Eliminar `conversor.html` (el archivo viejo)
2. Agregar `index.html` (el nuevo)
3. Subir todo a GitHub
4. Deploy automático en Netlify

---

## 📝 Paso a Paso

### **Opción 1: Si NO tienes Git inicializado todavía**

```bash
# 1. Ve a la carpeta del proyecto
cd /home/tato/Descargas/appfit

# 2. Inicializar Git
git init

# 3. Eliminar el archivo viejo
rm conversor.html
# O si quieres estar seguro:
# git rm conversor.html

# 4. Ver estado (para confirmar cambios)
git status

# 5. Agregar todos los archivos nuevos
git add .

# 6. Hacer commit
git commit -m "feat: Renombrar a index.html y agregar ASCII art en consola"

# 7. Crear repositorio en GitHub (ve a github.com y crea un nuevo repo)
# Luego conecta con tu repositorio:
git remote add origin https://github.com/TU_USUARIO/csv-converter.git

# 8. Subir a GitHub
git branch -M main
git push -u origin main
```

---

### **Opción 2: Si YA tienes Git inicializado**

```bash
# 1. Ve a la carpeta del proyecto
cd /home/tato/Descargas/appfit

# 2. Ver estado actual
git status

# 3. Eliminar conversor.html del repositorio
git rm conversor.html

# 4. Agregar el nuevo index.html y otros cambios
git add .

# 5. Ver qué cambios hay (opcional, para verificar)
git status

# Verás algo como:
# deleted: conversor.html
# new file: index.html
# modified: README.md
# etc.

# 6. Hacer commit con mensaje descriptivo
git commit -m "feat: Renombrar conversor.html a index.html y agregar ASCII art en consola

- Cambiado archivo principal a index.html (estándar web)
- Agregado mensaje ASCII art en consola del navegador
- Actualizada documentación
- Omite automáticamente columna 'id' del CSV"

# 7. Subir a GitHub
git push origin main
```

---

## 🔍 Verificar que todo esté bien

Después de hacer push, verifica:

```bash
# Ver el log de commits
git log --oneline

# Ver archivos rastreados por Git
git ls-files
```

**Deberías ver:**
- `index.html` ✅
- `styles.css` ✅
- `script.js` ✅
- `package.json` ✅
- NO debe aparecer `conversor.html` ❌

---

## 🌐 Configurar Netlify

### **Si es la primera vez:**

1. Ve a [netlify.com](https://netlify.com) y haz login
2. Click en **"Add new site"** → **"Import an existing project"**
3. Selecciona **GitHub**
4. Busca tu repositorio `csv-converter`
5. Configuración:
   - **Build command:** `echo "No build needed"`
   - **Publish directory:** `.` (punto)
   - **Functions directory:** `netlify/functions`
6. Click **"Deploy site"**

### **Si ya tienes el sitio en Netlify:**

No necesitas hacer nada! Netlify detectará automáticamente los cambios en GitHub y hará deploy automático en 1-2 minutos.

---

## ✅ Checklist Final

Antes de subir a GitHub, verifica:

- [ ] Archivo `conversor.html` eliminado
- [ ] Archivo `index.html` creado
- [ ] README.md actualizado (con `index.html` en lugar de `conversor.html`)
- [ ] Probado localmente que `index.html` funciona
- [ ] Probado que el mensaje ASCII aparece en consola (F12)
- [ ] `.gitignore` existe (para no subir `node_modules/`)

---

## 🚨 Problemas Comunes

### **Problema: "fatal: not a git repository"**

**Solución:**
```bash
git init
```

### **Problema: "error: failed to push some refs"**

**Solución:**
```bash
# Primero jala los cambios del remoto
git pull origin main --rebase
# Luego intenta subir de nuevo
git push origin main
```

### **Problema: "Permission denied (publickey)"**

**Solución:** Configura SSH keys o usa HTTPS:
```bash
# Cambiar a HTTPS
git remote set-url origin https://github.com/TU_USUARIO/csv-converter.git
```

### **Problema: "Archivo conversor.html aún aparece en GitHub"**

**Solución:** Si ya lo subiste antes, elimínalo explícitamente:
```bash
git rm conversor.html
git commit -m "Remove old conversor.html file"
git push origin main
```

---

## 🎨 Ver el Mensaje ASCII en Consola

Una vez que subas todo:

1. Abre tu sitio (local o en Netlify)
2. Presiona **F12** (o **Ctrl+Shift+I** en Linux/Windows, **Cmd+Option+I** en Mac)
3. Ve a la pestaña **Console**
4. ¡Deberías ver un mensaje ASCII hermoso! 🎉

**Ejemplo de lo que verás:**

```
 ██████╗███████╗██╗   ██╗     ██████╗ ██████╗ ███╗   ██╗██╗   ██╗███████╗██████╗ ████████╗███████╗██████╗ 
██╔════╝██╔════╝██║   ██║    ██╔════╝██╔═══██╗████╗  ██║██║   ██║██╔════╝██╔══██╗╚══██╔══╝██╔════╝██╔══██╗
██║     ███████╗██║   ██║    ██║     ██║   ██║██╔██╗ ██║██║   ██║█████╗  ██████╔╝   ██║   █████╗  ██████╔╝
██║     ╚════██║╚██╗ ██╔╝    ██║     ██║   ██║██║╚██╗██║╚██╗ ██╔╝██╔══╝  ██╔══██╗   ██║   ██╔══╝  ██╔══██╗
╚██████╗███████║ ╚████╔╝     ╚██████╗╚██████╔╝██║ ╚████║ ╚████╔╝ ███████╗██║  ██║   ██║   ███████╗██║  ██║
 ╚═════╝╚══════╝  ╚═══╝       ╚═════╝ ╚═════╝ ╚═╝  ╚═══╝  ╚═══╝  ╚══════╝╚═╝  ╚═╝   ╚═╝   ╚══════╝╚═╝  ╚═╝

🚀 CSV Data Converter
Convertidor de CSV a JSON y TOON

📦 Versión: 1.0.0
✨ Características:
   • Omite automáticamente la columna "id"
   • Soporta drag & drop
   • Tema claro/oscuro
   • API REST con Netlify Functions

💡 Tip: Abre las DevTools para ver mensajes de debug

🔗 GitHub: https://github.com/tu-usuario/csv-converter
📚 Docs: README.md

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🕵️ ¿Buscando algo?
Este proyecto está hecho con ❤️ y mucho café ☕
```

---

## 📊 Comandos Git Útiles

```bash
# Ver estado
git status

# Ver diferencias antes de commit
git diff

# Ver historial de commits
git log --oneline --graph --all

# Deshacer último commit (mantiene cambios)
git reset --soft HEAD~1

# Ver ramas
git branch

# Cambiar de rama
git checkout nombre-rama

# Crear nueva rama
git checkout -b nueva-rama

# Ver archivos ignorados por git
git status --ignored
```

---

## 🎯 Resumen en 4 Comandos

Si ya tienes Git y GitHub configurado:

```bash
cd /home/tato/Descargas/appfit
git rm conversor.html
git add .
git commit -m "feat: Renombrar a index.html y agregar ASCII art"
git push origin main
```

---

**¡Listo! Tu proyecto estará actualizado en GitHub y Netlify hará deploy automático.** 🚀
