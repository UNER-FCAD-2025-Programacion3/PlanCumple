import { SalonModel } from '../models/salonModel.js';

class SalonService {
    static instance = null;
    
    static getInstance() {
        if (!SalonService.instance) {
            SalonService.instance = new SalonService();
        }
        return SalonService.instance;
    }
    
    constructor() {
        /* Se hace asi para cumplir con el patron Singleton */

        // Si ya existe una instancia, devuélvela
        if (SalonService.instance) {
            return SalonService.instance;
        }
        
        // Guardar la referencia
        SalonService.instance = this;
    }

    async obtenerTodos() {
        try {
            return SalonModel.obtenerTodos();
        } catch (error) {
            console.error('Error en SalonService al obtener todos los salones:', error);
            throw new Error('Error al obtener la lista de salones');
        }
    }

    async obtenerPorId(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            return SalonModel.obtenerPorId(id);
        } catch (error) {
            console.error('Error en SalonService al obtener salón por ID:', error);
            throw new Error(`Error al obtener el salón con ID: ${id}`);
        }
    }

    async crear(datosSalon) {
        try {
            // Validaciones de negocio adicionales aquí si es necesario
            const { titulo, direccion, latitud, longitud, capacidad, importe } = datosSalon;
            
            // Validar datos requeridos
            if (!titulo || !direccion || !capacidad || !importe) {
                throw new Error('Faltan datos requeridos para crear el salón');
            }

            // Validar tipos de datos
            if (capacidad <= 0 || importe <= 0) {
                throw new Error('La capacidad y el importe deben ser mayores a 0');
            }

            return SalonModel.crear(datosSalon);
        } catch (error) {
            console.error('Error en SalonService al crear salón:', error);
            throw error;
        }
    }

    async actualizar(id, datosSalon) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            // Verificar si el salón existe
            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ningún salón con el ID: ${id}`);
            }

            // Validaciones de negocio
            const { capacidad, importe, titulo } = datosSalon;
            
            if (capacidad !== undefined && capacidad <= 0) {
                throw new Error('La capacidad debe ser mayor a 0');
            }

            if (importe !== undefined && importe <= 0) {
                throw new Error('El importe debe ser mayor a 0');
            }


            return SalonModel.actualizar(id, datosSalon);
        } catch (error) {
            console.error('Error en SalonService al actualizar salón:', error);
            throw error;
        }
    }

    async eliminar(id) {
        try {
            if (!id || isNaN(parseInt(id))) {
                throw new Error('ID inválido proporcionado');
            }

            // Verificar si el salón existe
            const existe = await this.existe(id);
            if (!existe) {
                throw new Error(`No se encontró ningún salón con el ID: ${id}`);
            }
            
            return SalonModel.eliminarLogico(id);
        } catch (error) {
            console.error('Error en SalonService al eliminar salón:', error);
            throw error;
        }
    }

    async existe(id) {
        try {
            return SalonModel.existe(id);
        } catch (error) {
            console.error('Error en SalonService al verificar existencia:', error);
            throw new Error('Error al verificar la existencia del salón');
        }
    }

    // Método para obtener estadísticas (ejemplo de lógica de negocio)
    async obtenerEstadisticas() {
        try {
            const salones = await SalonModel.obtenerTodos();
            
            return {
                total: salones.length,
                capacidadPromedio: salones.length > 0 
                    ? salones.reduce((sum, salon) => sum + salon.capacidad, 0) / salones.length 
                    : 0,
                importePromedio: salones.length > 0 
                    ? salones.reduce((sum, salon) => sum + salon.importe, 0) / salones.length 
                    : 0,
                capacidadMaxima: salones.length > 0 
                    ? Math.max(...salones.map(salon => salon.capacidad)) 
                    : 0,
                importeMaximo: salones.length > 0 
                    ? Math.max(...salones.map(salon => salon.importe)) 
                    : 0
            };
        } catch (error) {
            console.error('Error en SalonService al obtener estadísticas:', error);
            throw new Error('Error al obtener estadísticas de salones');
        }
    }
}

export default SalonService;