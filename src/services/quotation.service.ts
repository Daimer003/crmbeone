import axios from "axios";

export const getQuotation = async () => {
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
        console.error("Fallo el servicio para obtener los Quotation", error);
        throw error; // ✅ Lanza el error para manejarlo donde se use
    }
};

function limpiarCotizacion(data: Record<string, any>) {
    return Object.fromEntries(
        Object.entries(data).filter(([_, v]) => v !== '')
    );
}

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
        console.error("Fallo el servicio para crear los Quotation", error);
        throw error; // ✅ Lanza el error para manejarlo donde se use
    }
};