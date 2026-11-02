import React, { useState } from 'react';
import { FrictionDeal } from '../types/deal';
import { DEFAULT_IP_CHECKLIST } from '../data/presets';
import { X } from 'lucide-react';

interface NewNodeModalProps {
  isOpen: boolean;
  dealCount: number;
  onClose: () => void;
  onCreate: (newDeal: FrictionDeal) => void;
}

export const NewNodeModal: React.FC<NewNodeModalProps> = ({
  isOpen,
  dealCount,
  onClose,
  onCreate,
}) => {
  const [title, setTitle] = useState('');
  const [counterpartyRole, setCounterpartyRole] = useState('');
  const [unitLabel, setUnitLabel] = useState('');
  const [currency, setCurrency] = useState<'USD' | 'COP'>('USD');
  const [vATM, setVATM] = useState(100000);
  const [vOTM, setVOTM] = useState(55000);
  const [vITM, setVITM] = useState(82000);
  const [cMovement, setCMovement] = useState(4000);
  const [optionPremium, setOptionPremium] = useState(1500);
  const [timeWindowLabel, setTimeWindowLabel] = useState('6 horas (t₀ → t)');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const indexStr = String(dealCount + 1).padStart(2, '0');
    const newDeal: FrictionDeal = {
      id: `deal-custom-${Date.now()}`,
      code: `NODO-${indexStr} · EN VIVO`,
      title: title.trim() || `Intervención sobre Activo en Fricción #${indexStr}`,
      counterpartyRole: counterpartyRole.trim() || 'Decisor Principal / Propietario',
      environmentTag: 'Negociación en Vivo',
      timeContext: 'Ventana Activa t₀',
      currency,
      unitLabel: unitLabel.trim() || 'Activo operativo con valor atrapado por fricción',
      nodeADescription:
        unitLabel.trim() ||
        'Activo con valor potencial demostrado pero inmovilizado por la trayectoria actual.',
      currentFrictionDescription:
        'Pérdida acelerada de valor por cuellos de botella logísticos, informacionales o decisionales.',
      frictionVectors: ['Tiempo', 'Información', 'Canal de salida', 'Aprobación'],
      interventionArchitecture:
        'Cartografía de decisión + reconstrucción de última milla con costo de movimiento cerrado.',
      vATM: Number(vATM),
      vOTM: Number(vOTM),
      vITM: Number(vITM),
      cMovement: Number(cMovement),
      jscjSharePercent: 40,
      optionPremium: Number(optionPremium),
      timeWindowLabel: timeWindowLabel.trim() || '6 horas (t₀ → t)',
      activationCondition:
        'Confirmación de comprador / ruta ITM que garantice V_ITM > V_OTM + C_movimiento.',
      infrastructureIntact: true,
      protocolCertainty: 'HIGH',
      ipChecklist: DEFAULT_IP_CHECKLIST.map((item) => ({ ...item })),
      updatedAt: new Date().toISOString(),
    };

    onCreate(newDeal);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 flex items-center justify-center p-4">
      <div className="bg-[#0F1420] border border-slate-800 rounded-lg max-w-xl w-full p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Aperturar Nuevo Nodo en Fricción (t₀)
            </h2>
            <p className="text-xs text-slate-400">
              Ingresa las coordenadas del activo para cuantificar opcionalidad al instante.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Nombre de la Transacción / Nodo
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Lote Aguacate Hass / Contrato Q4"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Rol del Decisor / Contraparte
              </label>
              <input
                type="text"
                required
                placeholder="Ej. Mayorista / CFO / VP Operaciones"
                value={counterpartyRole}
                onChange={(e) => setCounterpartyRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="sm:col-span-2 space-y-1">
              <label className="text-slate-300 font-medium block">
                Soporte Físico / Económico (Activo Atrapado)
              </label>
              <input
                type="text"
                required
                placeholder="Ej. 80 toneladas en puerto / Pipeline $4M"
                value={unitLabel}
                onChange={(e) => setUnitLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">Moneda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value as 'USD' | 'COP')}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100 font-mono-tabular focus:outline-none focus:border-amber-500"
              >
                <option value="USD">USD ($)</option>
                <option value="COP">COP ($ Pesos)</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                V_ATM (Ideal)
              </label>
              <input
                type="number"
                required
                value={vATM}
                onChange={(e) => setVATM(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-2.5 py-2 font-mono-tabular text-slate-100"
              />
            </div>

            <div className="space-y-1">
              <label className="text-rose-300 font-medium block">
                V_OTM (Sin Int.)
              </label>
              <input
                type="number"
                required
                value={vOTM}
                onChange={(e) => setVOTM(Number(e.target.value))}
                className="w-full bg-slate-900 border border-rose-500/40 rounded px-2.5 py-2 font-mono-tabular text-rose-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-emerald-300 font-medium block">
                V_ITM (Post Int.)
              </label>
              <input
                type="number"
                required
                value={vITM}
                onChange={(e) => setVITM(Number(e.target.value))}
                className="w-full bg-slate-900 border border-emerald-500/40 rounded px-2.5 py-2 font-mono-tabular text-emerald-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-amber-300 font-medium block">
                C_movimiento
              </label>
              <input
                type="number"
                required
                value={cMovement}
                onChange={(e) => setCMovement(Number(e.target.value))}
                className="w-full bg-slate-900 border border-amber-500/40 rounded px-2.5 py-2 font-mono-tabular text-amber-300"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Prima de Opción en t₀
              </label>
              <input
                type="number"
                required
                value={optionPremium}
                onChange={(e) => setOptionPremium(Number(e.target.value))}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 font-mono-tabular text-amber-300"
              />
            </div>

            <div className="space-y-1">
              <label className="text-slate-300 font-medium block">
                Ventana Temporal (t₀ → t)
              </label>
              <input
                type="text"
                required
                value={timeWindowLabel}
                onChange={(e) => setTimeWindowLabel(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-slate-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-slate-300 hover:text-white border border-slate-700 rounded cursor-pointer"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold rounded cursor-pointer"
            >
              Crear y Cargar en Simulador
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
