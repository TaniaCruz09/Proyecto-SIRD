// src/proxy.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'
import { hasRole, ROL_ADMIN, ROL_DOCENTE } from '@/utils/roles'

export const config = {
    matcher: ['/admin/:path*', '/docente/home:path*'], // rutas a proteger
}

export default async function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl

    // Obtener token desde cookie
    const token = req.cookies.get('token')?.value

    // console.log('Ruta solicitada:', pathname)
    // console.log('Cookies recibidas:', req.cookies)
    // console.log('Token obtenido:', token)

    if (!token) {
        console.log('No hay token en cookies, redirigiendo al login')
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }

    try {
        console.log('Token de cookie en proxy:', token)

        // Convertir el secreto a Uint8Array (requerido por jose)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

        // Verificar token
        const { payload } = await jose.jwtVerify(token, secret)

        // Validar roles de forma segura (sin importar mayúsculas/minúsculas)
        const roles = Array.isArray(payload.roles) ? (payload.roles as string[]) : []

        if (pathname.startsWith('/admin') && !hasRole(roles, ROL_ADMIN)) {
            console.log('Usuario sin rol Admin, redirigiendo al login')
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        if (pathname.startsWith('/docente') && !hasRole(roles, ROL_DOCENTE)) {
            console.log('Usuario sin rol Docente, redirigiendo al login')
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        // Si todo bien, continuar
        return NextResponse.next()
    } catch (err) {
        console.error('Token inválido o expirado:', err)
        return NextResponse.redirect(new URL('/auth/login', req.url))
    }
}
