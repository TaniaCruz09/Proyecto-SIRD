import BtnOpenEditModal from '@/components/Buttons/btnOpenEditModal'
import React, { useState } from 'react'
import ModalBase from '../../ModalBase';
import { TipoPeriodizacion } from '@/interfaces';
import TipoPeriodizacionForm from '@/components/forms/catalogoForms/TipoPeriodizacionForm';

interface EditTipoPeriodizacionModalProp {
    tipoPeriodizacion: TipoPeriodizacion;
    fetchTiposPeriodizacion: () => Promise<void>;
}

export default function EditTipoPeriodizacionModal({ tipoPeriodizacion, fetchTiposPeriodizacion }: EditTipoPeriodizacionModalProp) {
    const [showModal, setShowModal] = useState(false);
    return (
        <div>
            <BtnOpenEditModal onClick={() => setShowModal(true)} />
            {showModal && (
                <ModalBase
                    onshowModal={showModal}
                    onCloseModal={() => setShowModal(false)}
                    content={
                        <TipoPeriodizacionForm
                            defaultValues={tipoPeriodizacion}
                            onSuccess={() => {
                                fetchTiposPeriodizacion();
                                setShowModal(false);
                            }}
                        />
                    }
                />
            )}
        </div>
    )
}
