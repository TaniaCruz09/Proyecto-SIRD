"use client";

import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal';
import ModalBase from '../ModalBase';
import DocenteForm from '@/components/forms/DocenteForm';
import { Docente } from '@/interfaces';
import { useState } from 'react';
import  {OrganizacionLaboral}  from '@/interfaces/organizacionLaboralInterface';
import OrganizacionLaboralForm from '@/components/forms/organizacionLaboralForm';


interface EditOrganizacionLaboralModalProps {
    organizacionLaboral: OrganizacionLaboral
    fetchOrganizacionLaboral: () => Promise<void>;
}

export default function EditOrganizacionLaboralModal({organizacionLaboral, fetchOrganizacionLaboral}:EditOrganizacionLaboralModalProps) {
    const [showModal, setShowModal] = useState(false);

  return (
    <div>
        {/* //llamo al componente con el diseño del boton de editar */}
        <BtnOpenEditModal onClick={() => setShowModal(true)}/>
            {showModal && (
          <ModalBase
            onshowModal={showModal}
            onCloseModal={() => setShowModal(false)}
            content={
              <OrganizacionLaboralForm
                defeaultValues={organizacionLaboral}
                onSucess={() => {
                  fetchOrganizacionLaboral();
                  setShowModal(false);
                }}
              />
            }
          />
        )}
    </div>
  )
}
