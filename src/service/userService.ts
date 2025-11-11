import prisma from "../lib/prisma"
// import bcrypt from "bcryptjs"
// import jwt from "jsonwebtoken"

const autenticacionService = async (
    correo: string,
    clave: string
)=> {
    try {
        if (!correo || !clave) {
            return {
                ok: false,
                message: "Correo y contraseña son requeridos.",
                status: 400,
            }
        }

        // Buscar usuario
        const user = await prisma.rol.findUnique({
            where: { correo },
        })

        if (!user) {
            return {
                ok: false,
                message: "Credenciales inválidas.",
                status: 401,
            }
        }

        // Comparar contraseñas
        // const passwordMatch = await bcrypt.compare(password, user.contrasena_hash)
        const passwordMatch =  user.clave.trim().toLocaleLowerCase() === clave.trim().toLocaleLowerCase()

        if (!passwordMatch) {
            return {
                ok: false,
                message: "Credenciales inválidas.",
                status: 401,
            }
        }

        // Generar JWT
        // const token = jwt.sign(
        //   { id: user.id, correo: user.correo },
        //   process.env.JWT_SECRET || "secret_key",
        //   { expiresIn: "1h" }
        // )

        return {
            ok: true,
            message: "Autenticación exitosa.",
            status: 200,
            //   token,
            user: {
                id: user.id_rol,
                correo: user.correo,
                rol: user.nombre_rol,
            },
        }
    } catch (error) {
        console.error("Error en autenticacionService:", error)
        return {
            ok: false,
            message: "Error interno en el servidor.",
            status: 500,
        }
    }
}

export { autenticacionService }
