import conexion from '../config/database.js';

export class ReporteModel {
    static async obtenerReporteReservasBasico() {
        try {
            const [rows] = await conexion.execute('CALL sp_reporte_reservas_basico()');
            // Los SPs devuelven un array de arrays, tomamos el primero
            return rows[0] || [];
        } catch (error) {
            throw new Error(`Error al obtener reporte de reservas: ${error.message}`);
        }
    }
}