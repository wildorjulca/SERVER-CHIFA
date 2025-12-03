import prisma from "../lib/prisma"


interface PaymentDataProps {
    id_pedido: number;
    id_cajero?: number;
    metodo_pago: 'efectivo' | 'yape' | 'plin' | 'tarjeta' | 'transferencia'
    monto: number;
    monto_recibido?: number;
    cambio?: number;
    comprobante?: string;
    pagado: boolean;

}
const processPaymentService = async (paymentData: PaymentDataProps) => {

    try {
        const res = await prisma.pago.create({
            data: paymentData
        })

        const mesa = await prisma.pedido.findUnique({
            where: { id_pedido: paymentData.id_pedido }
        })

        await prisma.mesa.update({
            where: { id_mesa: mesa?.id_mesa ?? 0 },
            data: {
                estado: "libre"
            }
        })

        return {
            status: 201,
            message: "Pago registrado correctamente",
            succes: true
        }
    } catch (error) {
        return {
            status: 500,
            succes: false,
            error: error
        }

    }

}

export { processPaymentService }