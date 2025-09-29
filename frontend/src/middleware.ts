// src/middleware.ts
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import * as jose from 'jose'

export const config = {
    matcher: ['/admin/:path*', '/docente/home:path*'], // rutas a proteger
}

export default async function middleware(req: NextRequest) {
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
        console.log('Token de cookie en middleware:', token)

        // Convertir el secreto a Uint8Array (requerido por jose)
        const secret = new TextEncoder().encode(process.env.JWT_SECRET!)

        // Verificar token
        const { payload } = await jose.jwtVerify(token, secret)

        console.log('Payload del token:', payload)

        // Validar roles de forma segura
        const roles = Array.isArray(payload.roles) ? payload.roles : []

        if (pathname.startsWith('/admin') && !roles.includes('Admin')) {
            console.log('Usuario sin rol Admin, redirigiendo al login')
            return NextResponse.redirect(new URL('/auth/login', req.url))
        }

        if (pathname.startsWith('/docente') && !roles.includes('Docente')) {
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
