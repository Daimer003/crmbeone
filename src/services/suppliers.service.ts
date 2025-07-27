import axios from "axios";

export const getSuppliers = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3000/suppliers",

            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Fallo el servicio para obtener los clientes", error);
        throw error; // ✅ Lanza el error para manejarlo donde se use
    }
};