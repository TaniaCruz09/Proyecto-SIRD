"use client"
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import { ActualizarStudent, saveStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { Municipio, Pais, Sexo } from "@/interfaces";
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import * as Yup from 'yup'

const RegisterStudentSchema = Yup.object().shape({
  phone: Yup.string()
    .matches(/^\d{8}$/, "El número debe tener 8 dígitos")
    .required("Teléfono obligatorio"),
  tutorPhoneNumber: Yup.string()
    .matches(/^\d{8}$/, "El número debe tener 8 dígitos")
    .required("Teléfono del tutor obligatorio"),
  tutorIdentityCard: Yup.string()
    .min(14, "Debe tener al menos 14 caracteres")
    .max(16, "No puede exceder 16 caracteres")
    .required("Cédula obligatoria"),
  identityCard: Yup.string()
    .min(14, "Debe tener al menos 14 caracteres")
    .max(16, "No puede exceder 16 caracteres")
    .required("Cédula obligatoria"),
});

interface RegisterEstudentProps {
  defeaultValues?: RegisterEstudent | null;
  onSucess?: () => void;
}

export default function RegisterEstudentForm({ defeaultValues, onSucess }: RegisterEstudentProps) {
  const [formValues, setFormValues] = useState({ name: "", lastName: "", studentCode: "", identityCard: "", dateBirt: "", address: "", tutorName: "", tutorIdentityCard: "", tutorPhoneNumber: "", gender: "", observations: "", pais: "", municipio: "", phone: "" }
  )
  interface FormErrors {
  phone?: string;
  tutorPhoneNumber?: string;
  identityCard?: string;
  name?: string;
  lastName?: string;
  studentCode?: string;
  dateBirt?: string;
  address?: string;
  tutorName?: string;
  tutorIdentityCard?: string;
  gender?: string;
  pais?: string;
  municipio?: string;
  observations?: string;
}


  const [generos, setGeneros] = useState<Sexo[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [errors, setErrors] = useState<FormErrors>({});

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const isEdit = Boolean(defeaultValues?.id)

  // Fetch catálogos
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [generosData, paisesData, municipiosData] = await Promise.all([
          getSexos(),
          getPaises(),
          getMunicipios()
        ])
        setGeneros(generosData);
        setPaises(paisesData);
        setMunicipios(municipiosData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [])

  // Inicializar valores si estamos editando
  useEffect(() => {
    if (defeaultValues) {
      setFormValues({
        name: defeaultValues.name,
        lastName: defeaultValues.lastName,
        studentCode: defeaultValues.studentCode,
        identityCard: defeaultValues.identityCard,
        dateBirt: defeaultValues.dateBirt
          ? new Date(defeaultValues.dateBirt).toISOString().split("T")[0]
          : "",
        address: defeaultValues.address,
        tutorName: defeaultValues.tutorName,
        tutorIdentityCard: defeaultValues.tutorIdentityCard,
        tutorPhoneNumber: defeaultValues.tutorPhoneNumber,
        gender: defeaultValues.gender?.id?.toString() || "",
        observations: defeaultValues.observations,
        pais: defeaultValues.pais?.id?.toString() || "",
        municipio: defeaultValues.municipio?.id?.toString() || "",
        phone: defeaultValues.phone,
      });

      if (defeaultValues.profileImage) {
        setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS}${defeaultValues.profileImage}`);
      }
    }
  }, [defeaultValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormValues(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      //validar Yup
      await RegisterStudentSchema.validate(formValues, { abortEarly: false })
      const data = new FormData();

      Object.entries(formValues).forEach(([key, value]) => {
        data.append(key, value);
      });
      if (file) data.append("profileImage", file);

      if (isEdit && defeaultValues?.id) {
        await ActualizarStudent(defeaultValues.id, data);
      } else {
        await saveStudent(data);
      }
      onSucess?.();
      setErrors({}); // Limpiar errores si todo está bien
    } catch (validationError: any) {
      // Mapear errores de Yup a tu estado `errors`
      const newErrors: any = {};
      validationError.inner.forEach((err: any) => {
        newErrors[err.path] = err.message;
      });
      setErrors(newErrors);
    }
  };


  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto bg-white shadow-lg rounded-2xl p-6 space-y-6 overflow-y-auto"
    >
      {/* Título */}
      <h2 className="text-2xl font-semibold text-center text-indigo-700 border-b pb-2">
        {isEdit ? "✏️ Editar Estudiante" : "🧑‍🎓 Agregar Estudiante"}
      </h2>

      {/* Avatar */}
      <div className="flex flex-col items-center space-y-3 mt-4">
        <Avatar
          className="w-24 h-24 border-4 border-indigo-200 shadow-md cursor-pointer transition-transform duration-200 hover:scale-105"
          onClick={() => fileInputRef.current?.click()}
        >
          {preview ? (
            <AvatarImage src={preview} alt="Foto del estudiante" />
          ) : (
            <AvatarFallback className="text-lg font-semibold bg-indigo-100 text-indigo-600">
              {formValues.name && formValues.lastName
                ? `${formValues.name[0] ?? ""}${formValues.lastName[0] ?? ""}`
                : <User className="w-10 h-10" />}
            </AvatarFallback>
          )}
        </Avatar>
        <p className="text-sm text-gray-500">Haz clic para subir foto</p>

        <input
          type="file"
          accept="image/*"
          name="profileImage"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Sección de datos personales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 border-l-4 border-indigo-400 pl-2">
          🪪 Datos personales
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombres</label>
            <input
              type="text"
              name="name"
              placeholder="Ej: Juan Carlos"
              value={formValues.name}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Apellidos</label>
            <input
              type="text"
              name="lastName"
              placeholder="Ej: López García"
              value={formValues.lastName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Código</label>
            <input
              type="text"
              name="studentCode"
              placeholder="Código del estudiante"
              value={formValues.studentCode}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Cédula</label>
            <input
              type="text"
              name="identityCard"
              placeholder="Cédula de identidad"
              value={formValues.identityCard}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
             {errors.identityCard && <p className="text-red-600 text-sm mt-1">La cedula debe tener 14 digitos</p>}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nacimiento</label>
            <input
              type="date"
              name="dateBirt"
              value={formValues.dateBirt}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Género</label>
            <select
              name="gender"
              value={formValues.gender}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            >
              <option value="">Seleccione...</option>
              {generos?.map((r) => (
                <option key={r.id} value={r.id}>
                  {r.gender}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Sección de contacto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 border-l-4 border-indigo-400 pl-2">
          📞 Información de contacto
        </h3>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Teléfono</label>
          <input
            type="text"
            name="phone"
            placeholder="Ej: +505 8888 9999"
            value={formValues.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
          {errors.phone && <p className="text-red-600 text-sm mt-1">El numero debe contener 8 digitos</p>}
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Dirección</label>
          <input
            type="text"
            name="address"
            placeholder="Dirección domiciliar"
            value={formValues.address}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
        </div>
      </div>

      {/* Sección del tutor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-indigo-600 border-l-4 border-indigo-400 pl-2">
          👨‍👩‍🏫 Información del tutor
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-gray-700 font-medium mb-1">Nombre del tutor</label>
            <input
              type="text"
              name="tutorName"
              placeholder="Nombre del tutor"
              value={formValues.tutorName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
          </div>

          <div>
            <label className="block text-gray-700 font-medium mb-1">Cédula del tutor</label>
            <input
              type="text"
              name="tutorIdentityCard"
              placeholder="Cédula del tutor"
              value={formValues.tutorIdentityCard}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
            />
             {errors.tutorIdentityCard && <p className="text-red-600 text-sm mt-1">La cedula debe contener 14 digitos</p>}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Teléfono del tutor</label>
          <input
            type="text"
            name="tutorPhoneNumber"
            placeholder="Número del tutor"
            value={formValues.tutorPhoneNumber}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
          />
          {errors.tutorPhoneNumber && <p className="text-red-600 text-sm mt-1">El numero debe contener 8 digitos</p>}
        </div>
      </div>

      {/* Sección de país y municipio */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-gray-700 font-medium mb-1">País de origen</label>
          <select
            name="pais"
            value={formValues.pais}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          >
            <option value="">Seleccione...</option>
            {paises?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.pais}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Municipio</label>
          <select
            name="municipio"
            value={formValues.municipio}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          >
            <option value="">Seleccione...</option>
            {municipios?.map((r) => (
              <option key={r.id} value={r.id}>
                {r.municipio}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Observación */}
      <div>
        <label className="block text-gray-700 font-medium mb-1">Observaciones</label>
        <input
          name="observations"
          placeholder="Comentarios u observaciones del estudiante"
          value={formValues.observations}
          onChange={handleInputChange}
          className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
          required
        />
      </div>

      {/* Botón */}
      <div className="flex justify-center">
        <button
          type="submit"
          className="px-10 py-3 bg-indigo-500 text-white font-semibold rounded-xl shadow-md hover:bg-indigo-600 hover:shadow-lg transition-all duration-200"
        >
          {isEdit ? "💾 Actualizar" : "✅ Guardar"}
        </button>
      </div>
    </form>

  )
}