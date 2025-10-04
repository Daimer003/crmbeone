import axios from "axios";

//Obtiene las cotizaciones
export const getQuotations = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3000/quotations",

            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        throw error; // ✅ Lanza el error para manejarlo donde se use
    }
};

//Obtiene la cotizacion
export const getQuotation = async (id: number) => {
    try {
        const response = await axios.get(
            `http://localhost:3000/quotations/${id}`,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        throw error; // ✅ Lanza el error para manejarlo donde se use
    }
};

function limpiarCotizacion(data: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== '')
    );
}

//Crea una cotización
export const createQuotation = async (cotizacion: any) => {
    try {
        const data = limpiarCotizacion(cotizacion)

        const response = await axios.post(
            "http://localhost:3000/quotations", data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        throw error; // ✅ Lanza el error para manejarlo donde se use
    }
};

