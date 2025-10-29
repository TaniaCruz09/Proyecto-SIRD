import { School, BookOpen, Users, Clock, Calendar, GraduationCap, User } from "lucide-react"

interface SchoolInfoProps {
    schoolName: string
    grade: string
    section: string
    shift: string
    year: number
    modality: string
    teacherName: string
}

export function EsquelaHead({ schoolName, grade, section, shift, year, modality, teacherName }: SchoolInfoProps) {
    return (
        <header className="bg-cyan-900 text-white shadow-lg">
      <div className="container mx-auto px-6 py-6">
        {/* Top Section - Institute Name */}
        <div className="flex items-center gap-4 mb-6 pb-6 border-b border-cyan-700/50">
          <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-blue-600 shadow-md">
            <GraduationCap className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Instituto Ruben Dario</h1>
            <p className="text-cyan-200 text-sm font-light">Instituto Nacional</p>
          </div>
        </div>

        {/* Bottom Section - Information Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
          {/* Grado */}
          <div className="flex flex-col gap-1.5 items-center">
            <div className="flex items-center gap-2 text-cyan-300">
              <BookOpen className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Grado</span>
            </div>
            <p className="text-base font-semibold">{grade}</p>
          </div>

          {/* Sección */}
          <div className="flex flex-col gap-1.5 items-center">
            <div className="flex items-center gap-2 text-cyan-300">
              <Users className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Sección</span>
            </div>
            <p className="text-base font-semibold">{section}</p>
          </div>

          {/* Turno */}
          <div className="flex flex-col gap-1.5 items-center">
            <div className="flex items-center gap-2 text-cyan-300">
              <Clock className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Turno</span>
            </div>
            <p className="text-base font-semibold">{shift}</p>
          </div>

          {/* Año */}
          <div className="flex flex-col gap-1.5 items-center">
            <div className="flex items-center gap-2 text-cyan-300">
              <Calendar className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Año</span>
            </div>
            <p className="text-base font-semibold">{year}</p>
          </div>

          {/* Modalidad */}
          <div className="flex flex-col gap-1.5 items-center">
            <div className="flex items-center gap-2 text-cyan-300">
              <GraduationCap className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Modalidad</span>
            </div>
            <p className="text-base font-semibold">{modality}</p>
          </div>

          {/* Docente Guía */}
          <div className="flex flex-col gap-1.5 items-center">
            <div className="flex items-center gap-2 text-cyan-300">
              <User className="w-4 h-4" />
              <span className="text-xs font-medium uppercase tracking-wide">Docente Guía</span>
            </div>
            <p className="text-base font-semibold ">{teacherName}</p>
          </div>
        </div>
      </div>
    </header>
    )
}
