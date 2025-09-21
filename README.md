# 🎉 PlanCumple

**PlanCumple** es un sistema desarrollado como parte de la unidad de negocios **PROGIII**, orientado a la **gestión de reservas de salones de cumpleaños**.  

La API REST permite:  
- Autenticación y autorización de usuarios.  
- Validación de datos.  
- Gestión completa de reservas de salones de cumpleaños.  

Esta API está pensada para integrarse con un cliente web previamente desarrollado, ofreciendo un backend seguro, escalable y fácil de usar.  

---

## 👥 Integrantes del equipo (Grupo BA)

- **Kevin Kling**
- **Rodrigo Cerros Masetto**
- **Luz Cymbaluk**  
- **Francisco Cata**

---

## 🚀 Instrucciones para el equipo

### Primera vez (clonar proyecto):
```bash
git clone [URL_DEL_REPOSITORIO]
cd PlanCumple
npm ci
npm run dev
```

### Día a día de desarrollo:

**Cuando haces pull de cambios:**
```bash
git pull
npm ci  # Reinstala por si hay cambios en dependencias
```

**Para agregar una nueva dependencia:**
```bash
npm install nombre-paquete
git add package.json package-lock.json
git commit -m "Add: nombre-paquete"
```

**Para ejecutar el proyecto:**
```bash
npm run dev  # Modo desarrollo
npm start    # Modo producción
```

### ⚠️ Importante:
- Usar **`npm ci`** en lugar de `npm install` (garantiza versiones exactas)
- Nunca subir `node_modules/` al repo
- Nunca subir archivo `.env` al repo

---

**Estándar JSON**: https://jsonapi.org/