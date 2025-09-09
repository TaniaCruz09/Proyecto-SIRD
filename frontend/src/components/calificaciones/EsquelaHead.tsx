import { Card, CardContent } from "@/components/ui/card"
import { GraduationCap, School, Users, Clock, Calendar, BookOpen, User, FileText, TrendingUp } from "lucide-react"

interface SchoolInfoProps {
    schoolName: string
    grade: string
    section: string
    shift: string
    year: string
    modality: string
    teacherName: string
}

export function EsquelaHead({ schoolName, grade, section, shift, year, modality, teacherName }: SchoolInfoProps) {
    return (
        <Card className="w-full mb-6 bg-gradient-to-br from-primary via-rose-600 to-secondary text-white shadow-2xl border-0 overflow-hidden">
            <CardContent className="pt-8 pb-8 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -translate-y-32 translate-x-32"></div>
                <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-24 -translate-x-24"></div>

                <div className="relative z-10">
                    <div className="text-center mb-8 bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20 shadow-lg">
                        <div className="flex items-center justify-center space-x-4 mb-3">
                            <div className="bg-white/25 p-3 rounded-full shadow-lg">
                                <FileText className="h-7 w-7 text-white" />
                            </div>
                            <h1 className="text-3xl font-bold text-white tracking-wide">Registro de Calificaciones</h1>
                        </div>
                        <div className="flex items-center justify-center space-x-3 mt-2">
                            <TrendingUp className="h-5 w-5 text-white/95" />
                            <p className="text-white/95 text-base font-semibold tracking-wide">Sistema de Evaluación Académica</p>
                        </div>
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <div className="bg-white/20 p-4 rounded-full mr-5 backdrop-blur-sm shadow-lg">
                            <School className="h-10 w-10 text-white" />
                        </div>
                        <div className="text-center">
                            <h2 className="text-2xl font-bold text-white mb-2 tracking-wide">{schoolName}</h2>
                            <p className="text-white/90 text-base font-medium">Institución Educativa</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white/15 rounded-2xl p-6 backdrop-blur-md border border-white/20 shadow-lg">
                        <div className="text-center group hover:bg-white/10 rounded-xl p-3 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <BookOpen className="h-5 w-5 text-white/90 mr-2" />
                                <span className="font-semibold text-white/95 text-sm">Grado</span>
                            </div>
                            <p className="text-white font-bold text-lg">{grade}</p>
                        </div>

                        <div className="text-center group hover:bg-white/10 rounded-xl p-3 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <Users className="h-5 w-5 text-white/90 mr-2" />
                                <span className="font-semibold text-white/95 text-sm">Sección</span>
                            </div>
                            <p className="text-white font-bold text-lg">{section}</p>
                        </div>

                        <div className="text-center group hover:bg-white/10 rounded-xl p-3 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <Clock className="h-5 w-5 text-white/90 mr-2" />
                                <span className="font-semibold text-white/95 text-sm">Turno</span>
                            </div>
                            <p className="text-white font-bold text-lg">{shift}</p>
                        </div>

                        <div className="text-center group hover:bg-white/10 rounded-xl p-3 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <Calendar className="h-5 w-5 text-white/90 mr-2" />
                                <span className="font-semibold text-white/95 text-sm">Año</span>
                            </div>
                            <p className="text-white font-bold text-lg">{year}</p>
                        </div>

                        <div className="md:col-span-2 text-center group hover:bg-white/10 rounded-xl p-3 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <GraduationCap className="h-5 w-5 text-white/90 mr-2" />
                                <span className="font-semibold text-white/95 text-sm">Modalidad</span>
                            </div>
                            <p className="text-white font-bold text-lg">{modality}</p>
                        </div>

                        <div className="md:col-span-2 text-center group hover:bg-white/10 rounded-xl p-3 transition-all duration-300">
                            <div className="flex items-center justify-center mb-3">
                                <User className="h-5 w-5 text-white/90 mr-2" />
                                <span className="font-semibold text-white/95 text-sm">Docente Guía</span>
                            </div>
                            <p className="text-white font-bold text-lg">{teacherName}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}