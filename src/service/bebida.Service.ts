import prisma from "../lib/prisma"

export const getBebidaService = async () => {
    try {

        const res = await prisma.bebida.findMany()
        return {
            succes: true,
            status: 200,
            message: "Datos obtenidos correctamente",
            data: res

        }
    } catch (error) {
        return {
            succes: false,
            status: 500,
            message: "Error de fecht de Bebida"
        }
    }
}