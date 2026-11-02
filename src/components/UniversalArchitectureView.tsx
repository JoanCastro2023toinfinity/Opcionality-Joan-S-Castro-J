import React, { useState } from 'react';
import { CalculatedMetrics, FrictionDeal } from '../types/deal';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { CheckSquare, Plus, Square, Trash2 } from 'lucide-react';

interface UniversalArchitectureViewProps {
  deal: FrictionDeal;
  metrics: CalculatedMetrics;
  onUpdateDeal: (updated: Partial<FrictionDeal>) => void;
}

export const UniversalArchitectureView: React.FC<
  UniversalArchitectureViewProps
> = ({ deal, metrics, onUpdateDeal }) => {
  const [newVector, setNewVector] = useState('');

  const handleAddVector = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newVector.trim();
    if (!trimmed) return;
    if (!deal.frictionVectors.includes(trimmed)) {
      onUpdateDeal({
        frictionVectors: [...deal.frictionVectors, trimmed],
      });
    }
    setNewVector('');
  };

  const handleRemoveVector = (vec: string) => {
    onUpdateDeal({
      frictionVectors: deal.frictionVectors.filter((v) => v !== vec),
    });
  };

  const toggleIPItem = (id: string) => {
    const updated = deal.ipChecklist.map((item) =>
      item.id === id ? { ...item, verified: !item.verified } : item
    );
    onUpdateDeal({ ipChecklist: updated });
  };

  const updateIPNote = (id: string, notes: string) => {
    const updated = deal.ipChecklist.map((item) =>
      item.id === id ? { ...item, notes } : item
    );
    onUpdateDeal({ ipChecklist: updated });
  };

  const layers = [
    {
      index: '01',
      layer: 'Nodo A (Soporte Físico / Económico)',
      question: '¿Qué activo tiene valor pero está atrapado?',
      isTextEditable: true,
      field: 'nodeADescription' as const,
      valueText: deal.nodeADescription,
      metricText: deal.unitLabel,
    },
    {
      index: '02',
      layer: 'Fricción Actual',
      question: '¿Cuánto valor está perdiendo por la estructura actual?',
      isTextEditable: true,
      field: 'currentFrictionDescription' as const,
      valueText: deal.currentFrictionDescription,
      metricText: `VAR = ${formatCurrency(metrics.varValue, deal.currency)} en riesgo`,
      metricHighlight: 'text-rose-400',
    },
    {
      index: '03',
      layer: 'Nodo A Futuro OTM',
      question: '¿Cuánto valdrá en t si nadie interviene?',
      isTextEditable: false,
      valueText:
        'Valor esperado del activo en t si el sistema continúa haciendo exactamente lo que está haciendo.',
      metricText: formatCurrency(deal.vOTM, deal.currency),
      metricHighlight: 'text-rose-300',
    },
    {
      index: '04',
      layer: 'Ideal / ATM',
      question: '¿Cuánto debería valer si el sistema funcionara como fue diseñado?',
      isTextEditable: false,
      valueText:
        'Valor original o potencial de referencia que justificó la incorporación del activo.',
      metricText: formatCurrency(deal.vATM, deal.currency),
      metricHighlight: 'text-slate-100',
    },
    {
      index: '05',
      layer: 'Intervención',
      question: '¿Qué arquitectura permite movilizar nuevamente el valor?',
      isTextEditable: true,
      field: 'interventionArchitecture' as const,
      valueText: deal.interventionArchitecture,
      metricText: `Ventana: ${deal.timeWindowLabel}`,
      metricHighlight: 'text-amber-300',
    },
    {
      index: '06',
      layer: 'Nodo A Futuro ITM',
      question: '¿Cuánto vale después de la intervención?',
      isTextEditable: false,
      valueText:
        'Valor ajustado por nueva trayectoria una vez desbloqueada la fricción sistémica.',
      metricText: formatCurrency(deal.vITM, deal.currency),
      metricHighlight: 'text-emerald-300',
    },
    {
      index: '07',
      layer: 'Costos de Movimiento',
      question: '¿Cuánto cuesta realmente desbloquearlo?',
      isTextEditable: false,
      valueText:
        'Flete, logística, última milla, permisos o ejecución táctica necesaria para movilizar el activo.',
      metricText: formatCurrency(deal.cMovement, deal.currency),
      metricHighlight: 'text-amber-300',
    },
    {
      index: '08',
      layer: 'Valor Incremental Recuperado (VR)',
      question: 'ITM − OTM − Costos de movimiento',
      isTextEditable: false,
      valueText: `Ratio de Recuperación (RR): ${formatPercent(
        Math.max(0, metrics.recoveryRatio),
        1
      )} del Valor en Riesgo original.`,
      metricText: formatCurrency(metrics.vrValue, deal.currency),
      metricHighlight:
        metrics.vrValue > 0 ? 'text-emerald-400' : 'text-rose-400',
    },
    {
      index: '09',
      layer: 'Captura JSCJ vs. Retención Cliente',
      question: 'Tú recibes 30–50% del valor incremental que ayudaste a crear/proteger.',
      isTextEditable: false,
      valueText: `El cliente conserva el ${
        100 - deal.jscjSharePercent
      }% (${formatCurrency(
        metrics.clientRetainedValue,
        deal.currency
      )}) sobre lo que iba a perder.`,
      metricText: `JSCJ (${deal.jscjSharePercent}%): ${formatCurrency(
        metrics.jscjProfit,
        deal.currency
      )}`,
      metricHighlight: 'text-amber-400',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Axioma de Unidad de Negocio & Trajectory-Adjusted Value */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 border border-slate-800 bg-[#111726] p-6 rounded-lg space-y-3">
          <div className="text-xs text-amber-400 font-mono-tabular">
            LA VERDADERA UNIDAD DE NEGOCIO
          </div>
          <h2 className="font-display text-2xl sm:text-3xl text-slate-100">
            “El tomate, la papa, los datos, una fábrica o un pipeline son solamente el soporte físico. Tu objeto de trabajo es el valor atrapado por fricción sistémica.”
          </h2>
          <p className="text-sm text-slate-300 leading-relaxed">
            Desde 100 bultos en Corabastos a las 2:00 AM hasta un Comité de Riesgo Fortune 100 a las 5:00 AM, cambia únicamente la escala del Nodo A. La arquitectura de 9 capas permanece invariante.
          </p>
        </div>

        <div className="lg:col-span-5 border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-3">
          <div className="text-xs text-emerald-400 font-mono-tabular">
            PRECISIÓN DE NOMENCLATURA · TRAJECTORY-ADJUSTED VALUE
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            Por qué nunca llamamos “Valor Devaluado” al OTM
          </h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            “Devaluado” se confunde con una caída de mercado normal. Tu objeto real es el{' '}
            <strong className="text-slate-100">valor ajustado por trayectoria</strong>: el activo no perdió valor porque el mercado lo castigara, sino porque el sistema dejó de poder movilizarlo.
          </p>
          <div className="pt-2 border-t border-slate-800 space-y-1 font-mono-tabular text-xs">
            <div className="flex justify-between">
              <span className="text-slate-400">Valor original / potencial:</span>
              <span className="text-slate-200">→ ATM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valor destruido por trayectoria actual:</span>
              <span className="text-rose-300">→ OTM</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Valor recuperado por intervención:</span>
              <span className="text-emerald-300">→ ITM</span>
            </div>
          </div>
        </div>
      </div>

      {/* Tabla Editable de las 9 Capas Universales */}
      <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100">
              01. Matriz Universal de 9 Capas (Editable en Vivo para este Nodo)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Edita la descripción del Nodo A, la Fricción Actual y la Arquitectura de Intervención directamente sobre la estructura.
            </p>
          </div>
          <div className="text-xs font-mono-tabular text-slate-400">
            Activo: {deal.code}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono-tabular">
                <th className="py-2.5 pr-4 font-medium w-64">Capa Estructural</th>
                <th className="py-2.5 px-4 font-medium w-72">Pregunta Rectora</th>
                <th className="py-2.5 px-4 font-medium">Diagnóstico / Definición del Caso</th>
                <th className="py-2.5 pl-4 text-right font-medium w-48">Magnitud Cuantificada</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/70 text-xs">
              {layers.map((row) => (
                <tr key={row.index} className="hover:bg-slate-900/40">
                  <td className="py-3.5 pr-4 align-top">
                    <span className="font-mono-tabular text-amber-400 mr-2">
                      {row.index}.
                    </span>
                    <span className="font-semibold text-slate-100">
                      {row.layer}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 align-top text-slate-300">
                    {row.question}
                  </td>
                  <td className="py-3.5 px-4 align-top">
                    {row.isTextEditable && row.field ? (
                      <textarea
                        rows={2}
                        value={row.valueText}
                        onChange={(e) =>
                          onUpdateDeal({ [row.field!]: e.target.value })
                        }
                        className="w-full bg-slate-900 border border-slate-700/80 rounded px-2.5 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
                      />
                    ) : (
                      <span className="text-slate-300 leading-relaxed">
                        {row.valueText}
                      </span>
                    )}
                  </td>
                  <td
                    className={`py-3.5 pl-4 align-top text-right font-mono-tabular font-semibold ${
                      row.metricHighlight || 'text-slate-200'
                    }`}
                  >
                    {row.metricText}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vectores de Fricción Específicos del Nodo */}
        <div className="pt-4 border-t border-slate-800 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h4 className="text-xs font-semibold text-slate-200">
                Vectores de Fricción Identificados en el Sistema
              </h4>
              <p className="text-[11px] text-slate-400">
                Factores concretos que están impidiendo movilizar el valor desde OTM hacia ITM.
              </p>
            </div>
            <form onSubmit={handleAddVector} className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Añadir vector (ej. Aduana, Silo IT)..."
                value={newVector}
                onChange={(e) => setNewVector(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium rounded flex items-center gap-1 cursor-pointer whitespace-nowrap"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Agregar Vector</span>
              </button>
            </form>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-slate-300 pt-1">
            {deal.frictionVectors.map((vec, idx) => (
              <div
                key={vec}
                className="flex items-center gap-1.5 bg-slate-900/90 border border-slate-800 px-3 py-1.5 rounded"
              >
                <span className="font-mono-tabular text-amber-400">
                  0{idx + 1}.
                </span>
                <span>{vec}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveVector(vec)}
                  className="text-slate-500 hover:text-rose-400 ml-1 cursor-pointer"
                  title="Eliminar vector"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Sección 8: IP Stack — Deal Architect Pipeline */}
      <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-5">
        <div className="border-b border-slate-800 pb-4">
          <div className="text-xs text-amber-400 font-mono-tabular mb-1">
            PROPIEDAD INTELECTUAL · SECUENCIA DE DESBLOQUEO
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            02. Deal Architect Pipeline: Friction → Divergence → Cartography → Intervention → Recovery
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            No vendes los 100+ frameworks; vendes una opción sobre la recuperación de valor que estos 5 módulos hacen posible.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {deal.ipChecklist.map((item, idx) => (
            <div
              key={item.id}
              className={`p-4 rounded border transition-colors ${
                item.verified
                  ? 'bg-slate-900/80 border-slate-800'
                  : 'bg-slate-950/60 border-slate-800/50'
              }`}
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="flex items-start gap-3">
                  <button
                    type="button"
                    onClick={() => toggleIPItem(item.id)}
                    className="mt-0.5 text-amber-400 hover:text-amber-300 cursor-pointer shrink-0"
                  >
                    {item.verified ? (
                      <CheckSquare className="w-5 h-5 text-emerald-400" />
                    ) : (
                      <Square className="w-5 h-5 text-slate-500" />
                    )}
                  </button>
                  <div className="space-y-1">
                    <div className="flex items-center gap-2 text-xs font-mono-tabular">
                      <span className="text-amber-400 font-semibold">
                        ETAPA 0{idx + 1} · {item.stage.toUpperCase()}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-slate-100 font-sans font-semibold text-sm">
                        {item.moduleName}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400">{item.description}</p>
                  </div>
                </div>

                <div className="lg:w-96 shrink-0">
                  <input
                    type="text"
                    value={item.notes}
                    onChange={(e) => updateIPNote(item.id, e.target.value)}
                    placeholder="Nota de verificación en campo..."
                    className="w-full bg-slate-950 border border-slate-800 rounded px-3 py-1.5 text-xs text-slate-200 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
