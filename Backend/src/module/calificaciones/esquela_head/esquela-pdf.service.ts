import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import PDFDocument = require('pdfkit');
import { Repository } from 'typeorm';
import { Centro } from '../../centroEducativo/entities/centro.entity';
import { EsquelaResumen, EsquelaResumenService } from './esquela-resumen.service';

type VistaEsquela = 'ALL' | 'FINAL' | `C-${number}` | `S-${number}`;

type ColumnaEsquela = {
    label: string;
    tipo: 'CORTE' | 'PERIODO' | 'FINAL';
    id?: number;
};

type GrupoAsignatura = {
    id: number;
    nombre: string;
    columnas: ColumnaEsquela[];
};

const anchoBase = [24, 155, 70, 32];
const altoFila = 24;
const altoCabecera = 58;
const colorBorde = '#202020';
const colorTitulo = '#dbeafe';
const colorSubtitulo = '#eff6ff';

@Injectable()
export class EsquelaPdfService {
    constructor(
        private readonly resumenService: EsquelaResumenService,
        @InjectRepository(Centro)
        private readonly centroRepository: Repository<Centro>,
    ) {}

    async build(esquelaHeadId: number, vista: string): Promise<Buffer> {
        const [resumen, centros] = await Promise.all([
            this.resumenService.build(esquelaHeadId),
            this.centroRepository.find(),
        ]);
        const columnas = this.getColumnas(resumen, vista);
        return this.createDocument(resumen, centros[0], vista, columnas);
    }

    private getColumnas(resumen: EsquelaResumen, valor: string): ColumnaEsquela[] {
        if (valor === 'ALL') {
            const columnas: ColumnaEsquela[] = [];

            for (const periodo of resumen.periodos) {
                for (const corteId of periodo.cortes) {
                    const corte = resumen.cortes.find((item) => item.id === corteId);
                    if (!corte) continue;

                    const nombre = (corte.abreviatura ?? '').trim();
                    const textoCorte = (corte.corte ?? '').trim();
                    const numero =
                        nombre.match(/^C(\d+)$/i) ??
                        textoCorte.match(/^(?:Corte\s*)?(\d+)$/i);
                    const romano = numero
                        ? this.toRoman(Number(numero[1]))
                        : nombre || textoCorte;

                    columnas.push({
                        tipo: 'CORTE',
                        id: corte.id,
                        label: numero ? `${romano} corte` : romano || `Corte ${corte.orden}`,
                    });
                }

                columnas.push({
                    tipo: 'PERIODO',
                    id: periodo.id,
                    label: periodo.nombre,
                });
            }

            columnas.push({ tipo: 'FINAL', label: 'Nota Final' });
            return columnas;
        }

        if (valor === 'FINAL') {
            return [{ tipo: 'FINAL', label: 'Nota Final' }];
        }

        const corteMatch = /^C-(\d+)$/.exec(valor);
        if (corteMatch) {
            const corteId = Number(corteMatch[1]);
            const corte = resumen.cortes.find((item) => item.id === corteId);
            if (!corte) throw new BadRequestException('El corte seleccionado no pertenece a esta esquela');
            return [{
                tipo: 'CORTE',
                id: corte.id,
                label: corte.abreviatura || corte.corte || 'Corte',
            }];
        }

        const periodoMatch = /^S-(\d+)$/.exec(valor);
        if (periodoMatch) {
            const periodoId = Number(periodoMatch[1]);
            const periodo = resumen.periodos.find((item) => item.id === periodoId);
            if (!periodo) throw new BadRequestException('El período seleccionado no pertenece a esta esquela');
            return [{ tipo: 'PERIODO', id: periodo.id, label: periodo.nombre }];
        }

        throw new BadRequestException('Vista de esquela no válida');
    }

    private createDocument(
        resumen: EsquelaResumen,
        centro: Centro | undefined,
        vista: string,
        columnasVista: ColumnaEsquela[],
    ): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const document = new PDFDocument({
                size: 'A4',
                layout: 'landscape',
                margin: 24,
                bufferPages: true,
            });
            const chunks: Uint8Array[] = [];
            document.on('data', (chunk: Buffer) => chunks.push(Uint8Array.from(chunk)));
            document.on('end', () => resolve(Buffer.concat(chunks)));
            document.on('error', reject);

            const pageWidth =
                document.page.width -
                document.page.margins.left -
                document.page.margins.right;
            const tableWidth = pageWidth;
            const anchosBase = anchoBase.map((width) => width * (tableWidth / 794));
            const estudiantes = vista === 'ALL'
                ? resumen.estudiantes
                : resumen.estudiantes.filter((estudiante) => estudiante.activoEnGrupo);
            const anchoDatosDisponible =
                tableWidth - anchosBase.reduce((sum, width) => sum + width, 0);
            const grupos = this.agruparAsignaturas(resumen, columnasVista);
            const materiasPorFila = Math.max(
                1,
                Math.floor(anchoDatosDisponible / (columnasVista.length * 2 * 42)),
            );
            const filasMaterias: GrupoAsignatura[][] = [];
            for (let index = 0; index < grupos.length; index += materiasPorFila) {
                filasMaterias.push(grupos.slice(index, index + materiasPorFila));
            }

            const iniciarPagina = () => {
                const tableStart = document.page.margins.left;
                let y = 24;
                const printCentered = (text: string, top: number, size: number, bold = false) => {
                    document
                        .font(bold ? 'Helvetica-Bold' : 'Helvetica')
                        .fontSize(size)
                        .fillColor('#111827')
                        .text(text, tableStart, top, { width: tableWidth, align: 'center' });
                };

                printCentered('MINISTERIO DE EDUCACION', y, 11, true);
                printCentered('MINED NUEVA GUINEA', y + 14, 10, true);
                printCentered(
                    `CALIFICACIONES DE ${resumen.grupo.modalidad ?? ''}  |  ${centro?.nombreCentro ?? ''}`,
                    y + 28,
                    9,
                    true,
                );
                y += 46;

                const info = [
                    `CODIGO DEL ESTABLECIMIENTO: ${centro?.codigoEstablecimiento ?? ''}`,
                    `CODIGO DE CENTRO: ${centro?.codigoCentro ?? ''}`,
                    `GRADO: ${resumen.grupo.grado ?? ''}`,
                    `SECCION: ${resumen.grupo.seccion ?? ''}`,
                ];
                const infoWidth = tableWidth / info.length;
                info.forEach((text, index) => {
                    document
                        .rect(tableStart + index * infoWidth, y, infoWidth, 20)
                        .lineWidth(0.6)
                        .stroke(colorBorde);
                    document
                        .font('Helvetica-Bold')
                        .fontSize(6.5)
                        .fillColor('#111827')
                        .text(text, tableStart + index * infoWidth + 3, y + 6, {
                            width: infoWidth - 6,
                            ellipsis: true,
                        });
                });
                y += 20;

                const lineTwo = `TURNO: ${resumen.grupo.turno ?? ''}     ASIGNATURAS CURSO ESCOLAR ${resumen.grupo.anioLectivo ?? ''}     DOCENTE GUIA: ${resumen.grupo.docenteGuia ?? ''}`;
                document
                    .rect(tableStart, y, tableWidth, 18)
                    .lineWidth(0.6)
                    .stroke(colorBorde);
                document
                    .font('Helvetica-Bold')
                    .fontSize(7)
                    .fillColor('#111827')
                    .text(lineTwo, tableStart + 4, y + 5, { width: tableWidth - 8 });
                y += 18;

                return y;
            };

            const dibujarCabeceraAsignaturas = (
                gruposFila: GrupoAsignatura[],
                y: number,
            ) => {
                const tableStart = document.page.margins.left;
                const headerHeight = vista === 'ALL' ? 54 : 48;
                const dataWidth =
                    anchoDatosDisponible /
                    (gruposFila.length * columnasVista.length * 2);
                const starts = [tableStart];
                for (const width of anchosBase) starts.push(starts[starts.length - 1] + width);
                const labelBase = ['N°', 'Nombres y Apellidos', 'Codigo del estudiante', 'Sexo'];

                for (let index = 0; index < labelBase.length; index += 1) {
                    const x = starts[index];
                    document
                        .rect(x, y, anchosBase[index], headerHeight)
                        .fillAndStroke(colorTitulo, colorBorde);
                    document
                        .font('Helvetica-Bold')
                        .fontSize(6.5)
                        .fillColor('#111827')
                        .text(labelBase[index], x + 2, y + 5, {
                            width: anchosBase[index] - 4,
                            height: headerHeight - 10,
                            align: 'center',
                        });
                }

                let groupStart =
                    tableStart + anchosBase.reduce((sum, width) => sum + width, 0);
                for (const grupo of gruposFila) {
                    const groupWidth = columnasVista.length * 2 * dataWidth;
                    document
                        .rect(groupStart, y, groupWidth, 18)
                        .fillAndStroke(colorTitulo, colorBorde);
                    document
                        .font('Helvetica-Bold')
                        .fontSize(7)
                        .fillColor('#111827')
                        .text(grupo.nombre, groupStart + 2, y + 5, {
                            width: groupWidth - 4,
                            align: 'center',
                            ellipsis: true,
                        });

                    for (let columnIndex = 0; columnIndex < columnasVista.length; columnIndex += 1) {
                        const columnStart = groupStart + columnIndex * 2 * dataWidth;
                        if (vista === 'ALL') {
                            document
                                .rect(columnStart, y + 18, dataWidth * 2, 18)
                                .fillAndStroke(colorSubtitulo, colorBorde);
                            document
                                .font('Helvetica-Bold')
                                .fontSize(6)
                                .fillColor('#111827')
                                .text(columnasVista[columnIndex].label, columnStart + 1, y + 24, {
                                    width: dataWidth * 2 - 2,
                                    align: 'center',
                                    ellipsis: true,
                                });
                        }

                        const lowerY = vista === 'ALL' ? y + 36 : y + 18;
                        for (let subIndex = 0; subIndex < 2; subIndex += 1) {
                            const subX = columnStart + subIndex * dataWidth;
                            document
                                .rect(subX, lowerY, dataWidth, headerHeight - (lowerY - y))
                                .fillAndStroke(colorSubtitulo, colorBorde);
                            document
                                .font('Helvetica-Bold')
                                .fontSize(5.5)
                                .fillColor('#111827')
                                .text(subIndex === 0 ? 'CUALI' : 'CUANTI', subX + 1, lowerY + 5, {
                                    width: dataWidth - 2,
                                    align: 'center',
                                    ellipsis: true,
                                });
                        }
                    }
                    groupStart += groupWidth;
                }
                return y + headerHeight;
            };

            const drawStudent = (
                student: EsquelaResumen['estudiantes'][number],
                index: number,
                gruposFila: GrupoAsignatura[],
                y: number,
            ) => {
                const tableStart = document.page.margins.left;
                const headerWidths = anchosBase;
                const cells = [
                    String(index + 1),
                    `${student.name} ${student.lastName}`.trim(),
                    student.studentCode,
                    student.gender ?? '',
                ];
                let x = tableStart;
                for (let cellIndex = 0; cellIndex < cells.length; cellIndex += 1) {
                    const width = headerWidths[cellIndex];
                    document.rect(x, y, width, altoFila).lineWidth(0.5).stroke(colorBorde);
                    document
                        .font('Helvetica-Bold')
                        .fontSize(6.5)
                        .fillColor('#111827')
                        .text(cells[cellIndex], x + 2, y + 7, {
                            width: width - 4,
                            height: altoFila - 10,
                            align: cellIndex === 1 ? 'left' : 'center',
                            ellipsis: true,
                        });
                    x += width;
                }

                const dataWidth =
                    anchoDatosDisponible /
                    (gruposFila.length * columnasVista.length * 2);
                for (const grupo of gruposFila) {
                    const asignatura = student.asignaturas.find(
                        (item) => item.asignaturaId === grupo.id,
                    );
                    for (const columna of columnasVista) {
                        const nota = columna.tipo === 'CORTE'
                            ? asignatura?.cortes.find((item) => item.corteId === columna.id)
                            : columna.tipo === 'PERIODO'
                              ? asignatura?.periodos.find((item) => item.periodoId === columna.id)
                              : asignatura?.final;
                        const values = [nota?.cual ?? 'AI', String(nota?.cuant ?? 0)];
                        for (const value of values) {
                            document.rect(x, y, dataWidth, altoFila).lineWidth(0.5).stroke(colorBorde);
                            const isLow = nota?.cuant != null && nota.cuant < 60;
                            document
                                .font('Helvetica-Bold')
                                .fontSize(6.5)
                                .fillColor(isLow || value === 'AI' ? '#dc2626' : '#111827')
                                .text(value, x + 1, y + 7, {
                                    width: dataWidth - 2,
                                    height: altoFila - 10,
                                    align: 'center',
                                    ellipsis: true,
                                });
                            x += dataWidth;
                        }
                    }
                }
            };

            let y = iniciarPagina();
            const limiteInferior = document.page.height - document.page.margins.bottom - 12;
            for (let filaIndex = 0; filaIndex < filasMaterias.length; filaIndex += 1) {
                const gruposFila = filasMaterias[filaIndex];
                const altoCabecera = vista === 'ALL' ? 54 : 48;
                const altoSeparador = filaIndex > 0 ? 10 : 0;
                if (y + altoSeparador + altoCabecera + altoFila > limiteInferior) {
                    document.addPage();
                    y = iniciarPagina();
                } else if (filaIndex > 0) {
                    y += 4;
                    document
                        .moveTo(document.page.margins.left, y)
                        .lineTo(document.page.margins.left + tableWidth, y)
                        .lineWidth(0.8)
                        .strokeColor('#64748b')
                        .stroke();
                    y += 6;
                }
                y = dibujarCabeceraAsignaturas(gruposFila, y);
                for (let index = 0; index < estudiantes.length; index += 1) {
                    if (y + altoFila > limiteInferior) {
                        document.addPage();
                        y = iniciarPagina();
                        y = dibujarCabeceraAsignaturas(gruposFila, y);
                    }
                    drawStudent(estudiantes[index], index, gruposFila, y);
                    y += altoFila;
                }
            }

            const range = document.bufferedPageRange();
            for (let pageIndex = range.start; pageIndex < range.start + range.count; pageIndex += 1) {
                document.switchToPage(pageIndex);
                document
                    .font('Helvetica')
                    .fontSize(7)
                    .fillColor('#111827')
                    .text(
                        `Pagina ${pageIndex - range.start + 1} de ${range.count}`,
                        document.page.margins.left,
                        document.page.height - document.page.margins.bottom - 10,
                        { width: pageWidth, align: 'right' },
                    );
            }

            document.end();
        });
    }

    private agruparAsignaturas(
        resumen: EsquelaResumen,
        columnas: ColumnaEsquela[],
    ): GrupoAsignatura[] {
        return resumen.asignaturas.map((asignatura) => ({
            id: asignatura.id,
            nombre: asignatura.asignatura,
            columnas,
        }));
    }

    private toRoman(value: number): string {
        const numerals: Array<[number, string]> = [
            [10, 'X'],
            [9, 'IX'],
            [5, 'V'],
            [4, 'IV'],
            [1, 'I'],
        ];
        let remaining = value;
        let result = '';

        for (const [number, numeral] of numerals) {
            while (remaining >= number) {
                result += numeral;
                remaining -= number;
            }
        }
        return result || String(value);
    }
}
