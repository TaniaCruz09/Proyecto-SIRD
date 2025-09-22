import { School, BookOpen, Users, Clock, Calendar, GraduationCap, User } from "lucide-react"

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
        <div className="w-full  mx-auto bg-white shadow-lg rounded-xl p-6 md:p-8 flex flex-col md:flex-row items-center gap-6">
            {/* Icono y nombre de la institución */}
            <div className="flex items-center gap-4 md:gap-6 flex-1">
                <div className="bg-blue-100 p-4 rounded-full flex items-center justify-center">
                    <School className="h-8 w-8 text-blue-600" />
                </div>
                <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{schoolName}</h2>
                    <p className="text-gray-500 text-sm md:text-base">Instituto Nacional</p>
                </div>
            </div>

            {/* Información académica */}
            <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 w-full ">
                <div className="flex flex-col items-center text-center ">
                    <BookOpen className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-gray-500 text-sm">Grado</span>
                    <p className="font-semibold text-gray-800">{grade}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                    <Users className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-gray-500 text-sm">Sección</span>
                    <p className="font-semibold text-gray-800">{section}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                    <Clock className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-gray-500 text-sm">Turno</span>
                    <p className="font-semibold text-gray-800">{shift}</p>
                </div>

                <div className="flex flex-col items-center text-center">
                    <Calendar className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-gray-500 text-sm">Año</span>
                    <p className="font-semibold text-gray-800">{year}</p>
                </div>

                <div className="flex flex-col items-center text-center col-span-2 sm:col-span-2">
                    <GraduationCap className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-gray-500 text-sm">Modalidad</span>
                    <p className="font-semibold text-gray-800">{modality}</p>
                </div>

                <div className="flex flex-col items-center text-center col-span-2 sm:col-span-2">
                    <User className="h-5 w-5 text-gray-600 mb-1" />
                    <span className="text-gray-500 text-sm">Docente Guía</span>
                    <p className="font-semibold text-gray-800">{teacherName}</p>
                </div>
            </div>
        </div>
    )
}
