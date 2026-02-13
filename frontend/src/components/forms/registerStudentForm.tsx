"use client"
import { getMunicipios } from "@/actions/catalogos/municipioMethods";
import { getPaises } from "@/actions/catalogos/paisMethods";
import { getSexos } from "@/actions/catalogos/sexoMethods";
import { ActualizarStudent, saveStudent } from "@/actions/resgisterEstudentMethods/regiterEstudentMethods";
import { Municipio, Pais, Sexo } from "@/interfaces";
import { getRegisterEstudent, getFiltarStudent } from '@/actions/resgisterEstudentMethods/regiterEstudentMethods'
import { useToast } from '@/hooks/use-toast'
import RegisterEstudent from "@/interfaces/registerEstudentInterface";
import { useEffect, useRef, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { User } from "lucide-react";
import { getDocentes } from "@/actions/docentesMethods/docentesMethods";

interface RegisterEstudentProps {
  defeaultValues?: RegisterEstudent | null;
  onSucess?: () => void;
}

export default function RegisterEstudentForm({ defeaultValues, onSucess }: RegisterEstudentProps) {
  const { toast } = useToast()
  const formRef = useRef<HTMLFormElement | null>(null)
  const studentCodeRef = useRef<HTMLInputElement | null>(null)
  const identityCardRef = useRef<HTMLInputElement | null>(null)
  const tutorIdentityCardRef = useRef<HTMLInputElement | null>(null)
  const [formValues, setFormValues] = useState({ name: "", lastName: "", studentCode: "", identityCard: "", dateBirt: "", address: "", tutorName: "", tutorIdentityCard: "", tutorPhoneNumber: "", gender: "", observations: "", pais: "", municipio: "", phone: "" }
  )
  const [generos, setGeneros] = useState<Sexo[]>([]);
  const [paises, setPaises] = useState<Pais[]>([]);
  const [municipios, setMunicipios] = useState<Municipio[]>([]);
  const [file, setFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)

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
        name: defeaultValues.name ?? "",
        lastName: defeaultValues.lastName ?? "",
        studentCode: defeaultValues.studentCode ?? "",
        identityCard: defeaultValues.identityCard ?? "",
        dateBirt: defeaultValues.dateBirt
          ? new Date(defeaultValues.dateBirt).toISOString().split("T")[0]
          : "",
        address: defeaultValues.address ?? "",
        tutorName: defeaultValues.tutorName ?? "",
        tutorIdentityCard: defeaultValues.tutorIdentityCard ?? "",
        tutorPhoneNumber: defeaultValues.tutorPhoneNumber ?? "",
        gender: defeaultValues.gender?.id?.toString() || "",
        observations: defeaultValues.observations ?? "",
        pais: defeaultValues.pais?.id?.toString() || "",
        municipio: defeaultValues.municipio?.id?.toString() || "",
        phone: defeaultValues.phone ?? "",
      });

      if (defeaultValues.profileImage) {
        // elimina /uploads/ inicial si ya la estás agregando en la env
        const cleanPath = defeaultValues.profileImage.replace(/^\/?uploads\//, "");
        setPreview(`${process.env.NEXT_PUBLIC_API_UPLOADS}uploads/${cleanPath}`);
      }

    }
  }, [defeaultValues]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    let newValue = value;

    // teléfonos: solo dígitos y máximo 8
    if (name === "phone" || name === "tutorPhoneNumber") {
      newValue = value.replace(/\D/g, "").slice(0, 8);
    }

    // Limitar largo de cédulas
    if (name === "identityCard" || name === "tutorIdentityCard") {
      newValue = value.slice(0, 16);
    }

    // Limpiar mensajes de validacion nativa al escribir
    if (e.target instanceof HTMLInputElement || e.target instanceof HTMLSelectElement) {
      e.target.setCustomValidity("");
    }

    setFormValues(prev => ({ ...prev, [name]: newValue }));
  };

  const setInputValidity = (input: HTMLInputElement | HTMLSelectElement | null, message: string) => {
    if (!input) return;
    input.setCustomValidity(message);
    if (message) {
      input.focus();
      input.reportValidity();
    }
  };

  // Validar un campo requerido al perder foco (sin Yup)
  const validateField = (value: any, input?: HTMLInputElement | HTMLSelectElement | null) => {
    if (value == null || String(value).trim() === "") {
      setInputValidity(input ?? null, "Completa este campo");
      return;
    }
    setInputValidity(input ?? null, "");
  };

  // Verificar que no exista otro estudiante con la misma cédula
  const checkCedulaUnique = async (value: string, input?: HTMLInputElement | null) => {
    if (value == null || String(value).trim() === "") {
      setInputValidity(input ?? null, "");
      return true;
    }
    if (defeaultValues?.identityCard && value === defeaultValues.identityCard) {
      setInputValidity(input ?? null, "");
      return true;
    }
    try {
      const students = await getRegisterEstudent();
      const found = students.find((s: any) =>
        s.identityCard === value || s.tutorIdentityCard === value
      );
      if (found && Number(found.id) !== Number(defeaultValues?.id)) {
        setInputValidity(input ?? null, "La cedula ya pertenece a otro registro");
        return false;
      }
      setInputValidity(input ?? null, "");
      return true;
    } catch (error) {
      console.error("Error verificando cedula:", error);
      return true;
    }
  };

  // Verificar que no exista otro estudiante con la misma cédula del tutor
  const checkTutorIdentityUnique = async (value: string, input?: HTMLInputElement | null) => {
    if (value == null || String(value).trim() === "") {
      setInputValidity(input ?? null, "");
      return true;
    }
    if (defeaultValues?.tutorIdentityCard && value === defeaultValues.tutorIdentityCard) {
      setInputValidity(input ?? null, "");
      return true;
    }

    try {
      const students = await getRegisterEstudent();
      const teachers = await getDocentes();

      // 🔍 Buscar coincidencia en estudiantes
      const foundStudent = students.find((s: any) =>
        s.identityCard === value ||   // cédula del estudiante
        s.tutorIdentityCard === value        // cédula del tutor
      );

      // 🔍 Buscar coincidencia en docentes
      const foundTeacher = teachers.find((t: any) =>
        t.identityCard === value
      );

      // Tomar el primero que exista
      const found = foundStudent || foundTeacher;

      if (found && Number(found.id) !== Number(defeaultValues?.id)) {
        setInputValidity(input ?? null, "Ya existe una persona con esta cédula");
        return false;
      }

      setInputValidity(input ?? null, "");
      return true;

    } catch (error) {
      console.error("Error verificando cédula:", error);
      return true;
    }

  }

  // Verificar que no exista otro estudiante con el mismo código
  const checkStudentCodeUnique = async (value: string, input?: HTMLInputElement | null) => {
    if (!value) {
      setInputValidity(input ?? null, "Completa este campo");
      return false;
    }
    try {
      // `getFiltarStudent` espera params string y anioId. Pasamos anioId = 0 que filtra por código.
      const res: any = await getFiltarStudent(`studentCode=${encodeURIComponent(value)}`, 0 as any);
      const list = res?.data ?? res;
      const found = Array.isArray(list) ? list.find((s: any) => s.studentCode === value) : null;
      if (found && found.id !== defeaultValues?.id) {
        setInputValidity(input ?? null, "Ya existe un estudiante con este codigo");
        return false;
      }
      setInputValidity(input ?? null, "");
      return true;
    } catch (error) {
      console.error('Error verificando código:', error);
      return true;
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0]
    if (!selectedFile) return;
    setFile(selectedFile);
    setPreview(URL.createObjectURL(selectedFile));
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (formRef.current && !formRef.current.reportValidity()) {
        return;
      }
      const cedulaUnique = await checkCedulaUnique(formValues.identityCard, identityCardRef.current)
      const tutorCedulaUnique = await checkTutorIdentityUnique(formValues.tutorIdentityCard, tutorIdentityCardRef.current)
      if (!cedulaUnique || !tutorCedulaUnique) {
        // Forzar a que el navegador muestre la burbuja en el primer campo invalido
        const inputs = [identityCardRef.current, tutorIdentityCardRef.current, studentCodeRef.current]
        for (const input of inputs) {
          if (input && !input.checkValidity()) {
            input.focus()
            input.reportValidity()
            break
          }
        }
        return
      }
      const data = new FormData();

      Object.entries(formValues).forEach(([key, value]) => {
        if (key === "identityCard") {
          const isEmpty = value == null || String(value).trim() === "";
          if (isEmpty) {
            if (isEdit) data.append(key, "");
            return;
          }
        }
        data.append(key, value);
      });
      if (file) data.append("profileImage", file);

      if (isEdit && defeaultValues?.id) {
        await ActualizarStudent(defeaultValues.id, data);
      } else {
        await saveStudent(data);
      }
      onSucess?.();
    } catch (validationError: any) {
      // Si es un ValidationError de Yup con múltiples errores
      if (validationError?.inner && Array.isArray(validationError.inner)) {
        const newErrors: any = {};
        validationError.inner.forEach((err: any) => {
          if (err?.path) newErrors[err.path] = err.message;
        });
        //setErrors(newErrors);
        return;
      }

      // Mensaje backend no entendible: intentar mapear a los campos
      const rawMessage = String(validationError?.message || "").toLowerCase();
      if (rawMessage.includes("tutor") && (rawMessage.includes("cedula") || rawMessage.includes("cédula") || rawMessage.includes("identity"))) {
        setInputValidity(tutorIdentityCardRef.current, "Ya existe una persona con esta cedula");
        return;
      }
      if (rawMessage.includes("cedula") || rawMessage.includes("cédula") || rawMessage.includes("identity")) {
        setInputValidity(identityCardRef.current, "Ya existe una persona con esta cedula");
        return;
      }
      if (rawMessage.includes("codigo") || rawMessage.includes("código") || rawMessage.includes("studentcode")) {
        setInputValidity(studentCodeRef.current, "Ya existe un estudiante con este codigo");
        return;
      }

      // Si el backend devuelve error de duplicado, revalidar unicidad y mostrar burbuja
      if (
        rawMessage.includes("duplicate") ||
        rawMessage.includes("unique") ||
        rawMessage.includes("constraint") ||
        rawMessage.includes("unicidad") ||
        rawMessage.includes("restriccion") ||
        rawMessage.includes("restricción") ||
        rawMessage.includes("llave duplicada")
      ) {
        toast({
          title: "Cedula duplicada",
          description: "La cedula esta duplicada.",
          variant: "destructive",
        })
        const codeOk = await checkStudentCodeUnique(formValues.studentCode, studentCodeRef.current)
        const cedulaUnique = await checkCedulaUnique(formValues.identityCard, identityCardRef.current)

        if (!codeOk || !cedulaUnique) return
      }

      console.error('Error inesperado al validar:', validationError);
      // No mostrar toast: el usuario ve la burbuja si aplica
    }
  };



  return (
    <form
      ref={formRef}
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
              onBlur={async (e) => { validateField(formValues.studentCode, e.currentTarget); await checkStudentCodeUnique(formValues.studentCode, e.currentTarget); }}
              ref={studentCodeRef}
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
              onBlur={async (e) => {
                const value = e.currentTarget.value;
                await checkCedulaUnique(value, e.currentTarget);
              }}
              ref={identityCardRef}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              maxLength={16}
            />
            {/* Burbuja nativa mostrara el mensaje */}
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
              onBlur={(e) => validateField(formValues.gender, e.currentTarget)}
              className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              required
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
            inputMode="numeric"
            placeholder="Ej: 88889999"
            value={formValues.phone}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            maxLength={8}
          />
          {/* Validacion nativa mostrara el mensaje */}
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
              onBlur={async (e) => {
                const value = e.currentTarget.value;
                await checkTutorIdentityUnique(value, e.currentTarget);
              }}
              className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
              maxLength={16}
            />
            {/* Burbuja nativa mostrara el mensaje */}
          </div>
        </div>

        <div>
          <label className="block text-gray-700 font-medium mb-1">Teléfono del tutor</label>
          <input
            type="text"
            name="tutorPhoneNumber"
            inputMode="numeric"
            placeholder="Número del tutor"
            value={formValues.tutorPhoneNumber}
            onChange={handleInputChange}
            className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            maxLength={8}
          />
          {/* Validacion nativa mostrara el mensaje */}
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
            onBlur={(e) => validateField(formValues.pais, e.currentTarget)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
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
            onBlur={(e) => validateField(formValues.municipio, e.currentTarget)}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 focus:border-transparent"
            required
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