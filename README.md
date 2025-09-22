# 🎉 PlanCumple

**PlanCumple** es un sistema desarrollado como parte de la unidad de negocios **PROGIII**, enfocado en la **gestión de reservas de salones de cumpleaños**.  

La API REST ofrece las siguientes funcionalidades:  
- Autenticación y autorización de usuarios.  
- Validación de datos.  
- Gestión integral de reservas de salones de cumpleaños.  

Esta API está diseñada para integrarse con un cliente web previamente desarrollado, proporcionando un backend seguro, escalable y fácil de usar.  

---

## 👥 Equipo de desarrollo (Grupo BA)

- **Kevin Kling**
- **Rodrigo Cerros Masetto**
- **Luz Cymbaluk**  
- **Francisco Cata**

---

## 🚀 Guía para el equipo

### Configuración inicial (clonar el proyecto):
```bash
git clone [URL_DEL_REPOSITORIO]
cd PlanCumple
npm ci
npm run dev
```

### Flujo de trabajo diario:

**Al realizar un pull de cambios:**
```bash
git pull
npm ci  # Reinstala dependencias si hubo cambios
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

### ⚠️ Recomendaciones importantes:
- Utilizar **`npm ci`** en lugar de `npm install`.
- Nunca subir la carpeta `node_modules/` al repositorio.
- Nunca subir el archivo `.env` al repositorio.

---

**Estándar JSON**: https://jsonapi.org/

En este proyecto, seguimos los siguientes patrones:  
- Patron MVC
- **Singleton**: Garantiza una única instancia.  
- **Lazy Loading**: Carga dinámica, creando o cargando recursos solo cuando son necesarios.