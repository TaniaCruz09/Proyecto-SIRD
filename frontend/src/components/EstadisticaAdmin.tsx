import { getAniosLectivos } from '@/actions/catalogos/anioLectivoMethods';
import { getDocentes } from '@/actions/docentesMethods/docentesMethods';
import { getRegisterEstudent } from '@/actions/resgisterEstudentMethods/regiterEstudentMethods';
import { AnioLectivo } from '@/interfaces';
import { BookOpen, Calendar, GraduationCap, Users } from 'lucide-react'
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

export default function EstadisticaAdmin() {
  const [anioLectivos, setAniosLectivos] = useState<AnioLectivo[]>([]);
  const [docentes, setDocentes] = useState<AnioLectivo[]>([]);
  const [estudiantes, setEstudiantes] = useState<AnioLectivo[]>([]);

  const fetchAniosLectivos = async () => {
    const response = await getAniosLectivos();
    setAniosLectivos(response);
  };

  const fetchDocentes = async () => {
    const response = await getDocentes();
    setDocentes(response)
  }

  const fetchEstudiantes = async () => {
    const response = await getRegisterEstudent()
    setEstudiantes(response)
  }

  useEffect(() => {
    fetchAniosLectivos();
    fetchDocentes();
    fetchEstudiantes();
  }, []);


  return (
    <div className="bg-slate-50/50 rounded-lg p-4 border border-slate-200 mb-7">
      <h3 className="text-sm font-semibold text-slate-600 mb-3 flex items-center gap-2">
        <BookOpen className="h-4 w-4" />
        Estadistica
      </h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">Años Lectivos</span>
            <Calendar className="h-3 w-3 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-slate-700">{anioLectivos.length}</div>
          <div className="text-xs text-slate-400">
            {anioLectivos.filter((year) => year.isActive === true).length} activos
          </div>
        </div>

        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">Profesores</span>
            <Users className="h-3 w-3 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-slate-700">{docentes.length}</div>
          <div className="text-xs text-slate-400">total docentes</div>
        </div>

        <div className="bg-white rounded-md p-3 border border-slate-200 shadow-sm">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium text-slate-500">Estudiantes</span>
            <Users className="h-3 w-3 text-indigo-400" />
          </div>
          <div className="text-lg font-bold text-slate-700">{estudiantes.length}</div>
          <div className="text-xs text-slate-400">total estudiantes</div>
        </div>
      </div>
    </div>
  )
}
