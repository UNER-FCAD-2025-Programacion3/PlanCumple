import { ServicioModel } from '../models/servicioModel.js';

class ServicioService {
    static instance = null;
    
    static getInstance() {
        if (!ServicioService.instance) {
            ServicioService.instance = new ServicioService();
        }
        return ServicioService.instance;
    }
    
    constructor() {
        /* Se hace asi para cumplir con el patron Singleton */

        // Si ya existe una instancia, devuélvela
        if (ServicioService.instance) {
            return ServicioService.instance;
        }
        
        // Guardar la referencia
        ServicioService.instance = this;
    }

    async obtenerTodos() {
        try {
            return ServicioModel.obtenerTodos();
        } catch (error) {
            console.error('Error en ServicioService al obtener todos los servicios:', error);
            throw new Error('Error al obtener la lista de servicios');
        }
    }

    async obtenerPorId(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            return ServicioModel.obtenerPorId(id);
        } catch (error) {
            console.error('Error en ServicioService al obtener servicio por ID:', error);
            throw new Error(`Error al obtener el servicio con ID: ${id}`);
        }
    }

    async crear(datosServicio) {
        try {
            // Validaciones de negocio adicionales aquí si es necesario
            const { descripcion, importe } = datosServicio;
            
            // Validar datos requeridos
            if (!descripcion || !importe) {
                throw new Error('La descripción y el importe son requeridos para crear el servicio');
            }

            // Validar tipos de datos
            if (importe <= 0) {
                throw new Error('El importe debe ser mayor a 0');
            }

            // Verificar si ya existe un servicio con la misma descripción
            const existeDescripcion = await ServicioModel.existeDescripcion(descripcion);
            if (existeDescripcion) {
                throw new Error('Ya existe un servicio con esta descripción');
            }

            return ServicioModel.crear(datosServicio);
        } catch (error) {
            console.error('Error en ServicioService al crear servicio:', error);
            throw error;
        }
    }

    async actualizar(id, datosServicio) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            // Verificar si el servicio existe
            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ningún servicio con el ID: ${id}`);
            }

            // Validaciones de negocio
            const { descripcion, importe } = datosServicio;
            
            if (importe !== undefined && importe <= 0) {
                throw new Error('El importe debe ser mayor a 0');
            }

            // Verificar si ya existe un servicio con la misma descripción (excluyendo el actual)
            if (descripcion) {
                const existeDescripcion = await ServicioModel.existeDescripcion(descripcion, id);
                if (existeDescripcion) {
                    throw new Error('Ya existe otro servicio con esta descripción');
                }
            }

            return ServicioModel.actualizar(id, datosServicio);
        } catch (error) {
            console.error('Error en ServicioService al actualizar servicio:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            // Verificar si el servicio existe
            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ningún servicio con el ID: ${id}`);
            }
            
            return ServicioModel.eliminarLogico(id);
        } catch (error) {
            console.error('Error en ServicioService al eliminar servicio:', error);
            throw error;
        }
    }

    async existe(id) {
        try {
            return ServicioModel.existe(id);
        } catch (error) {
            console.error('Error en ServicioService al verificar existencia:', error);
            throw new Error('Error al verificar la existencia del servicio');
        }
    }

    async obtenerPorRangoImporte(importeMin, importeMax) {
        try {
            if (importeMin < 0 || importeMax < 0) {
                throw new Error('Los importes deben ser mayores o iguales a 0');
            }

            if (importeMin > importeMax) {
                throw new Error('El importe mínimo no puede ser mayor al importe máximo');
            }

            return ServicioModel.obtenerPorRangoImporte(importeMin, importeMax);
        } catch (error) {
            console.error('Error en ServicioService al obtener servicios por rango de importe:', error);
            throw error;
        }
    }

    // Método para obtener estadísticas (ejemplo de lógica de negocio)
    async obtenerEstadisticas() {
        try {
            const servicios = await ServicioModel.obtenerTodos();
            
            return {
                total: servicios.length,
                importePromedio: servicios.length > 0 
                    ? servicios.reduce((sum, servicio) => sum + servicio.importe, 0) / servicios.length 
                    : 0,
                importeMinimo: servicios.length > 0 
                    ? Math.min(...servicios.map(servicio => servicio.importe)) 
                    : 0,
                importeMaximo: servicios.length > 0 
                    ? Math.max(...servicios.map(servicio => servicio.importe)) 
                    : 0
            };
        } catch (error) {
            console.error('Error en ServicioService al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de servicios');
        }
    }
}

export default ServicioService;