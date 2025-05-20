const db = require('../db');

class Convenio {
    static async create(CCT, idAliado, categoria, nombre_escuela, institucion, firma_escuela = false, firma_aliado = false) {
        try {
            const result = await db('Convenio').insert({
                CCT,
                idAliado,
                categoria,
                nombre_escuela,
                institucion,
                firma_aliado,
                firma_escuela,
                validacion_admin: false
            });
            return result[0];
        } catch (error) {
            throw error;
        }
    }

    static async updateFirmaAliado(CCT, idAliado, idConvenio) {
        try {
            const result = await db('Convenio')
                .where({ CCT, idAliado, idConvenio })
                .update({ firma_aliado: true });
            return result > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateFirmaEscuela(CCT, idAliado, idConvenio) {
        try {
            const result = await db('Convenio')
                .where({ CCT, idAliado, idConvenio })
                .update({ firma_escuela: true });
            return result > 0;
        } catch (error) {
            throw error;
        }
    }

    static async updateValidacionAdmin(CCT, idAliado, idConvenio) {
        try {
            const result = await db('Convenio')
                .where({ CCT, idAliado, idConvenio })
                .update({ validacion_admin: true });
            return result > 0;
        } catch (error) {
            throw error;
        }
    }

    static async getByCCT(CCT) {
        try {
            return await db('Convenio').where({ CCT });
        } catch (error) {
            throw error;
        }
    }

    static async getByAliado(idAliado) {
        try {
            console.log('Convenio.getByAliado called with idAliado:', idAliado);
            
            // Ensure idAliado is a number
            const numericIdAliado = Number(idAliado);
            if (isNaN(numericIdAliado)) {
                throw new Error('idAliado must be a number');
            }

            const result = await db('Convenio').where({ idAliado: numericIdAliado });
            console.log('Convenio.getByAliado query result:', result);
            
            return result;
        } catch (error) {
            console.error('Error in Convenio.getByAliado:', error);
            throw error;
        }
    }

    static async getAll() {
        try {
            return await db('Convenio').orderBy('idConvenio', 'asc');
        } catch (error) {
            throw error;
        }
    }

    static async getNoValidados() {
        try {
            return await db('Convenio').where({ validacion_admin: false });
        } catch (error) {
            throw error;
        }
    }
}

module.exports = Convenio; 