/**
 * Utilidad para formatear respuestas siguiendo la especificación JSend
 * https://github.com/omniti-labs/jsend
 */

export class JSendResponse {
    /**
     * Respuesta de éxito (status: "success")
     * @param {*} data - Los datos a devolver
     */
    static success(data = null) {
        return {
            status: "success",
            data: data
        };
    }

    /**
     * Respuesta de falla (status: "fail") - Error del cliente
     * @param {Object} data - Objeto con los campos que fallaron
     */
    static fail(data) {
        return {
            status: "fail",
            data: data
        };
    }

    /**
     * Respuesta de error (status: "error") - Error del servidor
     * @param {string} message - Mensaje de error
     */
    static error(message) {
        return {
            status: "error",
            message: message
        };
    }
}

export default JSendResponse;