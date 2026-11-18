import { NextRequest, NextResponse } from 'next/server'

type RouteContext = {
  params: Promise<{ path: string[] }>
}

const HOP_BY_HOP_HEADERS = [
  'connection',
  'content-encoding',
  'content-length',
  'host',
  'keep-alive',
  'proxy-authenticate',
  'proxy-authorization',
  'te',
  'trailer',
  'transfer-encoding',
  'upgrade',
]

async function forward(request: NextRequest, { params }: RouteContext) {
  const method = request.method.toUpperCase()
  if (!['GET', 'HEAD', 'OPTIONS'].includes(method)) {
    const origin = request.headers.get('origin')
    if (!origin || origin !== request.nextUrl.origin) {
      return NextResponse.json(
        { message: 'Origen de solicitud no permitido' },
        { status: 403 },
      )
    }
  }

  const apiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL
  if (!apiBaseUrl) {
    return NextResponse.json(
      { message: 'El backend no está configurado' },
      { status: 500 },
    )
  }

  const { path } = await params
  if (
    path.some(
      (segment) =>
        segment === '.' || segment === '..' || segment.includes('/'),
    )
  ) {
    return NextResponse.json(
      { message: 'Ruta de backend no válida' },
      { status: 400 },
    )
  }

  const baseUrl = `${apiBaseUrl.replace(/\/+$/, '')}/`
  const targetUrl = new URL(path.map(encodeURIComponent).join('/'), baseUrl)
  targetUrl.search = request.nextUrl.search

  const headers = new Headers(request.headers)
  for (const header of HOP_BY_HOP_HEADERS) headers.delete(header)
  headers.delete('cookie')
  headers.delete('authorization')

  const token = request.cookies.get('token')?.value
  if (token) headers.set('cookie', `token=${token}`)

  const backendResponse = await fetch(targetUrl, {
    method,
    headers,
    body: method === 'GET' || method === 'HEAD'
      ? undefined
      : await request.arrayBuffer(),
    cache: 'no-store',
    redirect: 'manual',
  })

  const responseHeaders = new Headers(backendResponse.headers)
  for (const header of HOP_BY_HOP_HEADERS) responseHeaders.delete(header)
  responseHeaders.delete('set-cookie')

  const response = new NextResponse(backendResponse.body, {
    status: backendResponse.status,
    statusText: backendResponse.statusText,
    headers: responseHeaders,
  })

  if (backendResponse.status === 401) {
    response.cookies.delete('token')
  }

  const tokenCookie = backendResponse.headers
    .getSetCookie()
    .find((cookie) => cookie.startsWith('token='))

  if (tokenCookie) {
    const cookieValue = tokenCookie.slice('token='.length).split(';', 1)[0]
    if (!cookieValue) {
      response.cookies.delete('token')
    } else {
      const maxAge = tokenCookie.match(/(?:^|;)\s*Max-Age=(\d+)/i)?.[1]
      response.cookies.set('token', cookieValue, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax',
        path: '/',
        ...(maxAge ? { maxAge: Number(maxAge) } : {}),
      })
    }
  }

  return response
}

export const GET = forward
export const HEAD = forward
export const POST = forward
export const PUT = forward
export const PATCH = forward
export const DELETE = forward
