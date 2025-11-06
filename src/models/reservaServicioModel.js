import conexion from '../config/database.js';

export class ReservaServicioModel {
    static async obtenerTodos() {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    rs.reserva_servicio_id,
                    rs.reserva_id,
                    rs.servicio_id,
                    rs.importe,
                    rs.creado,
                    rs.modificado,
                    r.fecha_reserva,
                    r.salon_id,
                    r.usuario_id,
                    r.turno_id,
                    s.nombre as servicio_nombre,
                    s.descripcion as servicio_descripcion,
                    s.precio_base as servicio_precio_base,
                    s.categoria as servicio_categoria,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    sal.nombre as salon_nombre
                FROM reservas_servicios rs
                INNER JOIN reservas r ON rs.reserva_id = r.reserva_id
                INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN salones sal ON r.salon_id = sal.salon_id
                WHERE r.activo = 1 AND s.activo = 1
                ORDER BY rs.creado DESC
            `);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas de servicios: ${error.message}`);
        }
    }

    static async obtenerPorId(id) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    rs.reserva_servicio_id,
                    rs.reserva_id,
                    rs.servicio_id,
                    rs.importe,
                    rs.creado,
                    rs.modificado,
                    r.fecha_reserva,
                    r.salon_id,
                    r.usuario_id,
                    r.turno_id,
                    r.foto_cumpleaniero,
                    r.tematica,
                    s.nombre as servicio_nombre,
                    s.descripcion as servicio_descripcion,
                    s.precio_base as servicio_precio_base,
                    s.categoria as servicio_categoria,
                    s.duracion as servicio_duracion,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    u.celular as usuario_celular,
                    sal.nombre as salon_nombre,
                    sal.capacidad as salon_capacidad
                FROM reservas_servicios rs
                INNER JOIN reservas r ON rs.reserva_id = r.reserva_id
                INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN salones sal ON r.salon_id = sal.salon_id
                WHERE rs.reserva_servicio_id = ? AND r.activo = 1 AND s.activo = 1
            `, [id]);
            return rows[0] || null;
        } catch (error) {
            throw new Error(`Error al obtener reserva de servicio por ID: ${error.message}`);
        }
    }

    static async obtenerPorReserva(reservaId) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    rs.reserva_servicio_id,
                    rs.reserva_id,
                    rs.servicio_id,
                    rs.importe,
                    rs.creado,
                    rs.modificado,
                    s.nombre as servicio_nombre,
                    s.descripcion as servicio_descripcion,
                    s.precio_base as servicio_precio_base,
                    s.categoria as servicio_categoria,
                    s.duracion as servicio_duracion
                FROM reservas_servicios rs
                INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
                WHERE rs.reserva_id = ? AND s.activo = 1
                ORDER BY s.categoria ASC, s.nombre ASC
            `, [reservaId]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener servicios por reserva: ${error.message}`);
        }
    }

    static async obtenerPorServicio(servicioId) {
        try {
            const [rows] = await conexion.execute(`
                SELECT 
                    rs.reserva_servicio_id,
                    rs.reserva_id,
                    rs.servicio_id,
                    rs.importe,
                    rs.creado,
                    rs.modificado,
                    r.fecha_reserva,
                    r.salon_id,
                    r.usuario_id,
                    r.turno_id,
                    r.foto_cumpleaniero,
                    r.tematica,
                    u.nombre as usuario_nombre,
                    u.apellido as usuario_apellido,
                    u.nombre_usuario as usuario_email,
                    u.celular as usuario_celular,
                    sal.nombre as salon_nombre,
                    t.nombre as turno_nombre,
                    t.hora_inicio,
                    t.hora_fin
                FROM reservas_servicios rs
                INNER JOIN reservas r ON rs.reserva_id = r.reserva_id
                INNER JOIN usuarios u ON r.usuario_id = u.usuario_id
                INNER JOIN salones sal ON r.salon_id = sal.salon_id
                INNER JOIN turnos t ON r.turno_id = t.turno_id
                WHERE rs.servicio_id = ? AND r.activo = 1
                ORDER BY r.fecha_reserva DESC, t.hora_inicio ASC
            `, [servicioId]);
            return rows;
        } catch (error) {
            throw new Error(`Error al obtener reservas por servicio: ${error.message}`);
        }
    }

    static async crear(reservaServicioData) {
        try {
            const { reserva_id, servicio_id, importe } = reservaServicioData;

            const [result] = await conexion.execute(
                'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)',
                [reserva_id, servicio_id, importe]
            );

            // Retornar el registro completo creado
            return this.obtenerPorId(result.insertId);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este servicio ya está asignado a la reserva');
            }
            throw new Error(`Error al crear reserva de servicio: ${error.message}`);
        }
    }

    static async actualizar(id, reservaServicioData) {
        try {
            const registroExistente = await this.obtenerPorId(id);
            if (!registroExistente) {
                throw new Error(`No se encontró ninguna reserva de servicio con el ID: ${id}`);
            }

            const { reserva_id, servicio_id, importe } = reservaServicioData;

            await conexion.execute(
                'UPDATE reservas_servicios SET reserva_id = ?, servicio_id = ?, importe = ? WHERE reserva_servicio_id = ?',
                [reserva_id, servicio_id, importe, id]
            );

            return this.obtenerPorId(id);
        } catch (error) {
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Este servicio ya está asignado a la reserva');
            }
            throw new Error(`Error al actualizar reserva de servicio: ${error.message}`);
        }
    }

    static async eliminar(id) {
        try {
            const [result] = await conexion.execute('DELETE FROM reservas_servicios WHERE reserva_servicio_id = ?', [id]);
            return result.affectedRows > 0;
        } catch (error) {
            throw new Error(`Error al eliminar reserva de servicio: ${error.message}`);
        }
    }

    static async eliminarPorReserva(reservaId) {
        try {
            const [result] = await conexion.execute('DELETE FROM reservas_servicios WHERE reserva_id = ?', [reservaId]);
            return result.affectedRows;
        } catch (error) {
            throw new Error(`Error al eliminar servicios de la reserva: ${error.message}`);
        }
    }

    static async existe(id) {
        try {
            const [rows] = await conexion.execute('SELECT 1 FROM reservas_servicios WHERE reserva_servicio_id = ?', [id]);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar existencia de la reserva de servicio: ${error.message}`);
        }
    }

    static async existeAsignacion(reservaId, servicioId, excludeId = null) {
        try {
            let query = 'SELECT 1 FROM reservas_servicios WHERE reserva_id = ? AND servicio_id = ?';
            let params = [reservaId, servicioId];
            
            if (excludeId) {
                query += ' AND reserva_servicio_id != ?';
                params.push(excludeId);
            }
            
            const [rows] = await conexion.execute(query, params);
            return rows.length > 0;
        } catch (error) {
            throw new Error(`Error al verificar asignación de servicio: ${error.message}`);
        }
    }

    static async obtenerTotalImportesPorReserva(reservaId) {
        try {
            const [rows] = await conexion.execute(
                'SELECT SUM(importe) as total_servicios FROM reservas_servicios WHERE reserva_id = ?',
                [reservaId]
            );
            return parseFloat(rows[0].total_servicios) || 0;
        } catch (error) {
            throw new Error(`Error al calcular total de servicios: ${error.message}`);
        }
    }

    static async obtenerEstadisticas() {
        try {
            const [estadisticas] = await conexion.execute(`
                SELECT 
                    COUNT(*) as total_asignaciones,
                    COUNT(DISTINCT reserva_id) as reservas_con_servicios,
                    COUNT(DISTINCT servicio_id) as servicios_utilizados,
                    AVG(importe) as importe_promedio,
                    SUM(importe) as ingresos_totales_servicios,
                    MAX(importe) as importe_maximo,
                    MIN(importe) as importe_minimo
                FROM reservas_servicios rs
                INNER JOIN reservas r ON rs.reserva_id = r.reserva_id
                WHERE r.activo = 1
            `);

            const [serviciosPopulares] = await conexion.execute(`
                SELECT 
                    s.servicio_id,
                    s.nombre,
                    s.categoria,
                    COUNT(rs.reserva_servicio_id) as total_contrataciones,
                    AVG(rs.importe) as importe_promedio,
                    SUM(rs.importe) as ingresos_totales
                FROM reservas_servicios rs
                INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
                INNER JOIN reservas r ON rs.reserva_id = r.reserva_id
                WHERE r.activo = 1 AND s.activo = 1
                GROUP BY s.servicio_id, s.nombre, s.categoria
                ORDER BY total_contrataciones DESC
                LIMIT 10
            `);

            const [categoriaStats] = await conexion.execute(`
                SELECT 
                    s.categoria,
                    COUNT(rs.reserva_servicio_id) as total_contrataciones,
                    AVG(rs.importe) as importe_promedio,
                    SUM(rs.importe) as ingresos_totales
                FROM reservas_servicios rs
                INNER JOIN servicios s ON rs.servicio_id = s.servicio_id
                INNER JOIN reservas r ON rs.reserva_id = r.reserva_id
                WHERE r.activo = 1 AND s.activo = 1
                GROUP BY s.categoria
                ORDER BY total_contrataciones DESC
            `);

            return {
                ...estadisticas[0],
                servicios_populares: serviciosPopulares,
                estadisticas_por_categoria: categoriaStats
            };
        } catch (error) {
            throw new Error(`Error al obtener estadísticas de reservas de servicios: ${error.message}`);
        }
    }

    static async crearMultiples(reservaId, servicios) {
        const connection = await conexion.getConnection();
        try {
            await connection.beginTransaction();

            const resultados = [];
            for (const servicio of servicios) {
                const [result] = await connection.execute(
                    'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)',
                    [reservaId, servicio.servicio_id, servicio.importe]
                );
                resultados.push({ reserva_servicio_id: result.insertId, ...servicio });
            }

            await connection.commit();
            return resultados;
        } catch (error) {
            await connection.rollback();
            if (error.code === 'ER_DUP_ENTRY') {
                throw new Error('Uno o más servicios ya están asignados a la reserva');
            }
            throw new Error(`Error al crear múltiples servicios: ${error.message}`);
        } finally {
            connection.release();
        }
    }

    static async actualizarServiciosDeReserva(reservaId, servicios) {
        const connection = await conexion.getConnection();
        try {
            await connection.beginTransaction();

            // Eliminar servicios existentes
            await connection.execute('DELETE FROM reservas_servicios WHERE reserva_id = ?', [reservaId]);

            // Insertar nuevos servicios
            const resultados = [];
            for (const servicio of servicios) {
                const [result] = await connection.execute(
                    'INSERT INTO reservas_servicios (reserva_id, servicio_id, importe) VALUES (?, ?, ?)',
                    [reservaId, servicio.servicio_id, servicio.importe]
                );
                resultados.push({ reserva_servicio_id: result.insertId, ...servicio });
            }

            await connection.commit();
            return resultados;
        } catch (error) {
            await connection.rollback();
            throw new Error(`Error al actualizar servicios de la reserva: ${error.message}`);
        } finally {
            connection.release();
        }
    }
}