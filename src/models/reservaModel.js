import conexion from '../config/database.js';

export class ReservaModel {
    static async obtenerTodas() {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    r.activo,
                    r.creado,
                    r.modificado,
                    s.salon_id,
                    s.titulo as salon_nombre,
                    s.capacidad as salon_capacidad,
                    s.importe as salon_precio_base,
                    u.usuario_id,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    u.celular as usuario_celular,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.activo = 1
                ORDER BY r.fecha_reserva DESC, t.hora_desde ASC
            `);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    r.activo,
                    r.creado,
                    r.modificado,
                    s.salon_id,
                    s.titulo as salon_nombre,
                    s.capacidad as salon_capacidad,
                    s.importe as salon_precio_base,
                    s.direccion as salon_direccion,
                    u.usuario_id,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    u.celular as usuario_celular,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.reserva_id = ? AND r.activo = 1
            `, [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener reserva por ID: ${error.message}`);
        }
    }

    static async obtenerPorUsuario(usuarioId) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    r.activo,
                    r.creado,
                    r.modificado,
                    s.salon_id,
                    s.titulo as salon_nombre,
                    s.capacidad as salon_capacidad,
                    s.importe as salon_precio_base,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.usuario_id = ? AND r.activo = 1
                ORDER BY r.fecha_reserva DESC, t.hora_desde ASC
            `, [usuarioId]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas por usuario: ${error.message}`);
        }
    }

    static async obtenerPorSalon(salonId) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    r.activo,
                    r.creado,
                    r.modificado,
                    u.usuario_id,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    u.celular as usuario_celular,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta
                FROM reservas r
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.salon_id = ? AND r.activo = 1
                ORDER BY r.fecha_reserva DESC, t.hora_desde ASC
            `, [salonId]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas por salón: ${error.message}`);
        }
    }

    static async obtenerPorFecha(fecha) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    r.activo,
                    r.creado,
                    r.modificado,
                    s.salon_id,
                    s.titulo as salon_nombre,
                    s.capacidad as salon_capacidad,
                    u.usuario_id,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.fecha_reserva = ? AND r.activo = 1
                ORDER BY t.hora_desde ASC
            `, [fecha]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas por fecha: ${error.message}`);
        }
    }

    static async obtenerPorRangoFechas(fechaInicio, fechaFin) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    r.activo,
                    r.creado,
                    r.modificado,
                    s.salon_id,
                    s.titulo as salon_nombre,
                    s.capacidad as salon_capacidad,
                    u.usuario_id,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.fecha_reserva BETWEEN ? AND ? AND r.activo = 1
                ORDER BY r.fecha_reserva ASC, t.hora_desde ASC
            `, [fechaInicio, fechaFin]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas por rango de fechas: ${error.message}`);
        }
    }

    static async crear(reservaData) {
        try {
            const { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica, 
                importe_salon, 
                importe_total 
            } = reservaData;

            const [result] = await conexion.execute(
                'INSERT INTO reservas (fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero, tematica, importe_salon, importe_total) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
                [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero || null, tematica || null, importe_salon, importe_total]
            );

            // Retornar la reserva completa creada
            return this.obtenerPorId(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ya existe una reserva para este salón, fecha y turno');
            }
            throw new Error(`Error al crear reserva: ${error.message}`);
        }
    }

    static async actualizar(id, reservaData) {
        try {
            const reservaExistente = await this.obtenerPorId(id);
            if (!reservaExistente) {
                throw new Error(`No se encontró ninguna reserva con el ID: ${id}`);
            }

            const { 
                fecha_reserva, 
                salon_id, 
                usuario_id, 
                turno_id, 
                foto_cumpleaniero, 
                tematica, 
                importe_salon, 
                importe_total 
            } = reservaData;

            await conexion.execute(
                'UPDATE reservas SET fecha_reserva = ?, salon_id = ?, usuario_id = ?, turno_id = ?, foto_cumpleaniero = ?, tematica = ?, importe_salon = ?, importe_total = ? WHERE reserva_id = ?',
                [fecha_reserva, salon_id, usuario_id, turno_id, foto_cumpleaniero || null, tematica || null, importe_salon || null, importe_total || null, id]
            );

            return this.obtenerPorId(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Ya existe una reserva para este salón, fecha y turno');
            }
            throw new Error(`Error al actualizar reserva: ${error.message}`);
        }
    }

    static async eliminarLogico(id) {
        try {
            const [result] = await conexion.execute('UPDATE reservas SET activo = 0 WHERE reserva_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar reserva: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM reservas WHERE reserva_id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia de la reserva: ${error.message}`);
        }
    }

    static async verificarDisponibilidad(salonId, fechaReserva, turnoId, excludeReservaId = null) {
        try {
            let query = 'SELECT 1 FROM reservas WHERE salon_id = ? AND fecha_reserva = ? AND turno_id = ? AND activo = 1';
            let params = [salonId, fechaReserva, turnoId];
            
            if (excludeReservaId) {
                query += ' AND reserva_id != ?';
                params.push(excludeReservaId);
            }
            
            const [rows] = await conexion.execute(query, params);
            return rows.length === 0; // true si está disponible, false si ya está ocupado
        } catch (error) {
            throw new Error(`Error al verificar disponibilidad: ${error.message}`);
        }
    }

    static async obtenerEstadisticas() {
        try {
            const [estadisticas] = await conexion.execute(`
                SELECT 
                    COUNT(*) as total_reservas,
                    COUNT(CASE WHEN fecha_reserva >= CURDATE() THEN 1 END) as reservas_futuras,
                    COUNT(CASE WHEN fecha_reserva < CURDATE() THEN 1 END) as reservas_pasadas,
                    AVG(importe_total) as importe_promedio,
                    SUM(importe_total) as ingresos_totales,
                    MAX(fecha_reserva) as ultima_reserva,
                    MIN(fecha_reserva) as primera_reserva
                FROM reservas 
                WHERE activo = 1
            `);

            const [reservasPorMes] = await conexion.execute(`
                SELECT 
                    YEAR(fecha_reserva) as anio,
                    MONTH(fecha_reserva) as mes,
                    COUNT(*) as cantidad,
                    SUM(importe_total) as ingresos
                FROM reservas 
                WHERE activo = 1 
                GROUP BY YEAR(fecha_reserva), MONTH(fecha_reserva)
                ORDER BY anio DESC, mes DESC
                LIMIT 12
            `);

            const [salonesPopulares] = await conexion.execute(`
                SELECT 
                    s.salon_id,
                    s.titulo,
                    COUNT(r.reserva_id) as total_reservas,
                    AVG(r.importe_total) as importe_promedio
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                WHERE r.activo = 1
                GROUP BY s.salon_id, s.titulo
                ORDER BY total_reservas DESC
                LIMIT 5
            `);

            return {
                ...estadisticas[0],
                reservas_por_mes: reservasPorMes,
                salones_populares: salonesPopulares
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas de reservas: ${error.message}`);
        }
    }

    static async obtenerReservasProximas(diasAdelante = 7) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    r.reserva_id,
                    r.fecha_reserva,
                    r.foto_cumpleaniero,
                    r.tematica,
                    r.importe_salon,
                    r.importe_total,
                    s.salon_id,
                    s.titulo as salon_nombre,
                    s.capacidad as salon_capacidad,
                    u.usuario_id,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    u.celular as usuario_celular,
                    t.turno_id,
                    t.orden as turno_orden,
                    t.hora_desde,
                    t.hora_hasta,
                    DATEDIFF(r.fecha_reserva, CURDATE()) as dias_restantes
                FROM reservas r
                INNER JOIN salones s ON r.salon_id = s.salon_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE r.fecha_reserva BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL ? DAY)
                AND r.activo = 1
                ORDER BY r.fecha_reserva ASC, t.hora_desde ASC
            `, [diasAdelante]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas próximas: ${error.message}`);
        }
    }

    static async obtenerTotalServiciosPorReserva(reservaId) {
        try {
            const [rows] = await conexion.execute(
                'SELECT COALESCE(SUM(importe), 0) as total_servicios FROM reservas_servicios WHERE reserva_id = ?',
                [reservaId]
            );
            return parseFloat(rows[0].total_servicios) || 0;
        } catch (error) {
            throw new Error(`Error al calcular total de servicios: ${error.message}`);
        }
    }

    static async actualizarImporteTotal(reservaId, importeSalon, totalServicios = 0) {
        try {
            const importeTotal = parseFloat(importeSalon) + parseFloat(totalServicios);
            await conexion.execute(
                'UPDATE reservas SET importe_total = ? WHERE reserva_id = ?',
                [importeTotal, reservaId]
            );
            return importeTotal;
        } catch (error) {
            throw new Error(`Error al actualizar importe total: ${error.message}`);
        }
    }
}