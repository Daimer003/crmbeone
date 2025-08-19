import axios from "axios";

export const getSuppliers = async () => {
    try {
        const response = await axios.get(
            "http://localhost:3000/client",

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


export const createClient = async (data: any) => {
    try {
     
        const response = await axios.post(
            "http://localhost:3000/client",
            data,
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

export const updateClient = async (id: number, data: Object) => {
    try {
        const response = await axios.patch(
            `http://localhost:3000/client/${id}`,
            data,
            {
                headers: {
                    "Content-Type": "application/json",
                },
            }
        );

        return response;
    } catch (error) {
        console.error("Fallo el servicio para actualizar el cliente", error);
        throw error;
    }
}