# 🎉 PlanCumple

**PlanCumple** es un sistema desarrollado como parte de la unidad de negocios **PROGIII**, enfocado en la **gestión de reservas de salones de cumpleaños**.  

La API REST ofrece las siguientes funcionalidades:  
- Autenticación y autorización de usuarios.  
- Validación de datos.  
- Gestión integral de reservas de salones de cumpleaños.  

Esta API está diseñada para integrarse con un cliente web previamente desarrollado, proporcionando un backend seguro, escalable y fácil de usar.  

---

## 🔗 Versionado de API

La API utiliza **versionado por URL** para mantener compatibilidad y permitir evolución controlada:

### Versión actual: **v1**
- **Base URL**: `http://localhost:3000/api/v1`
- **Formato de respuesta**: [JSON:API](https://jsonapi.org/)

### Endpoints disponibles:

#### 🏠 Salones
- `GET /api/v1/salones` - Obtener todos los salones
- `GET /api/v1/salones/:id` - Obtener un salón específico
- `POST /api/v1/salones` - Crear un nuevo salón
- `PUT /api/v1/salones/:id` - Actualizar un salón
- `DELETE /api/v1/salones/:id` - Eliminar un salón (lógico)

#### 📧 Notificaciones
- `POST /api/v1/notificacion` - Enviar notificación

### Ejemplo de uso:
```bash
# Obtener todos los salones
curl -X GET http://localhost:3000/api/v1/salones

# Crear un nuevo salón
curl -X POST http://localhost:3000/api/v1/salones \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Salon Cumpleaños","direccion":"Calle 123","capacidad":50,"importe":15000}'
```

### Beneficios del versionado:
- ✅ **Compatibilidad hacia atrás**: Las versiones anteriores siguen funcionando
- ✅ **Evolución controlada**: Nuevas funcionalidades sin romper integraciones existentes
- ✅ **Migración gradual**: Los clientes pueden actualizar a su ritmo
- ✅ **Mantenimiento**: Facilita el soporte de múltiples versiones

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

## 🛠️ Tecnologías y dependencias

### Principales dependencias:
- **Express.js**: Framework web para Node.js
- **MySQL2**: Cliente MySQL para Node.js con soporte para promesas
- **Express Validator**: Middleware de validación para Express.js
- **Handlebars**: Motor de plantillas para vistas

### Validaciones:
Este proyecto utiliza **Express Validator** para validaciones robustas:

#### Validaciones de salones:
- **titulo**: Obligatorio, sin espacios
- **capacidad**: Número mayor a 0  
- **importe**: Número mayor a 0
- **direccion**: Texto obligatorio, no vacío
- **latitud**: Opcional, entre -90 y 90 (si se proporciona)
- **longitud**: Opcional, entre -180 y 180 (si se proporciona)

### Patrones de diseño implementados:
- **Patrón MVC**: Separación clara entre Modelo, Vista y Controlador
- **Singleton**: Garantiza una única instancia de conexión a BD
- **Lazy Loading**: Carga dinámica, creando recursos solo cuando son necesarios
- **Middleware Pattern**: Validaciones centralizadas y reutilizables

---