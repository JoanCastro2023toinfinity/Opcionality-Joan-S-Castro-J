import React from 'react';
import {
  CalculatedMetrics,
  ContextEnvironment,
  FrictionDeal,
  ProtocolState,
} from '../types/deal';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '../utils/calculations';
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  PauseCircle,
  RotateCcw,
  ShieldAlert,
  Sliders,
  XCircle,
} from 'lucide-react';

interface TrajectorySimulatorProps {
  deal: FrictionDeal;
  metrics: CalculatedMetrics;
  contextEnv: ContextEnvironment;
  onUpdateDeal: (updated: Partial<FrictionDeal>) => void;
  onResetPreset: () => void;
  onNavigateTab: (tab: string) => void;
}

export const TrajectorySimulator: React.FC<TrajectorySimulatorProps> = ({
  deal,
  metrics,
  contextEnv,
  onUpdateDeal,
  onResetPreset,
  onNavigateTab,
}) => {
  // Determine dynamic step size based on vATM magnitude for tactile +/- buttons
  const stepUnit = Math.max(
    100,
    Math.pow(10, Math.max(2, Math.floor(Math.log10(Math.max(1000, deal.vATM))) - 2))
  );

  const maxSliderValue = Math.max(deal.vATM * 1.25, deal.vITM * 1.2, 10000);

  const renderStateBanner = (state: ProtocolState) => {
    if (state === 'INTERVENE') {
      return (
        <div className="border border-emerald-500/40 bg-emerald-950/25 p-5 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
              <span className="font-mono-tabular text-xs font-semibold tracking-wider text-emerald-400">
                ESTADO DEL PROTOCOLO: 🟢 INTERVENE (EJECUCIÓN ACTIVA)
              </span>
            </div>
            <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
              {metrics.stateReason}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-emerald-500/20">
            <div className="text-right">
              <div className="text-xs text-slate-400">Condición V_ITM &gt; V_OTM + C</div>
              <div className="font-mono-tabular text-sm font-semibold text-emerald-300">
                {formatCompactCurrency(deal.vITM, deal.currency)} &gt;{' '}
                {formatCompactCurrency(metrics.breakevenITM, deal.currency)}
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('termsheet')}
              className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span>Generar Term Sheet</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    if (state === 'HOLD') {
      return (
        <div className="border border-amber-500/40 bg-amber-950/25 p-5 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <PauseCircle className="w-5 h-5 text-amber-400 shrink-0" />
              <span className="font-mono-tabular text-xs font-semibold tracking-wider text-amber-300">
                ESTADO DEL PROTOCOLO: 🟡 OPCIÓN / HOLD (RESERVAR DERECHO SIN CAPITAL OPERATIVO)
              </span>
            </div>
            <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
              {metrics.stateReason}
            </p>
          </div>
          <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-amber-500/20">
            <div className="text-right">
              <div className="text-xs text-slate-400">Riesgo Máximo Acotado (t₀)</div>
              <div className="font-mono-tabular text-sm font-semibold text-amber-300">
                −Prima ({formatCurrency(deal.optionPremium, deal.currency)})
              </div>
            </div>
            <button
              onClick={() => onNavigateTab('option')}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
            >
              <span>Estructurar Opción t₀</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      );
    }

    return (
      <div className="border border-rose-500/40 bg-rose-950/30 p-5 rounded-lg flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2.5">
            <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
            <span className="font-mono-tabular text-xs font-semibold tracking-wider text-rose-300">
              ESTADO DEL PROTOCOLO: 🔴 NO INTERVENGO (PROTOCOLO MUERTO / FILTRO DE PROTECCIÓN)
            </span>
          </div>
          <p className="text-sm text-slate-200 max-w-3xl leading-relaxed">
            {metrics.stateReason}
          </p>
        </div>
        <div className="flex items-center gap-4 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-rose-500/20">
          <div className="text-right">
            <div className="text-xs text-slate-400">Capital Operativo Comprometido</div>
            <div className="font-mono-tabular text-sm font-semibold text-rose-300">
              $0 (Protección Activada)
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Percentage widths for visual trajectory bar
  const baseScale = Math.max(deal.vATM, deal.vITM, 1);
  const otmPct = Math.min(100, Math.max(0, (deal.vOTM / baseScale) * 100));
  const costPct = Math.min(
    100 - otmPct,
    Math.max(0, (deal.cMovement / baseScale) * 100)
  );
  const netRecoveredPct = Math.min(
    100 - otmPct - costPct,
    Math.max(0, (Math.max(0, metrics.vrValue) / baseScale) * 100)
  );

  return (
    <div className="space-y-8">
      {/* Banner de Estado del Protocolo */}
      {renderStateBanner(metrics.recommendedState)}

      {/* Frase Ejecutiva Cuantificable en Tiempo Real */}
      <div className="border border-slate-800 bg-[#111726] p-6 rounded-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Proposición de Valor Cuantificable</span>
              <span aria-hidden="true">·</span>
              <span>{deal.counterpartyRole}</span>
              <span aria-hidden="true">·</span>
              <span>{deal.timeContext}</span>
            </div>
            <blockquote className="font-display text-2xl sm:text-3xl text-slate-100 tracking-wide leading-snug">
              {metrics.vrValue > 0 ? (
                <>
                  “De los{' '}
                  <span className="text-rose-400 font-mono-tabular font-normal underline decoration-rose-500/40 underline-offset-4">
                    {formatCurrency(metrics.varValue, deal.currency)}
                  </span>{' '}
                  que estaban en riesgo de perderse por fricción, recuperamos{' '}
                  <span className="text-emerald-400 font-mono-tabular font-normal underline decoration-emerald-500/40 underline-offset-4">
                    {formatCurrency(metrics.vrValue, deal.currency)}
                  </span>{' '}
                  netos. Usted conserva{' '}
                  <span className="text-amber-300 font-mono-tabular font-normal">
                    {formatCurrency(metrics.clientRetainedValue, deal.currency)}
                  </span>{' '}
                  adicionales que el sistema daba por perdidos.”
                </>
              ) : (
                <>
                  “El diferencial de intervención actual no supera los costos de movimiento (
                  <span className="text-rose-400 font-mono-tabular font-normal">
                    {formatCurrency(metrics.vrValue, deal.currency)}
                  </span>
                  ). Activamos disciplina de filtro: no intervenimos ni consumimos capital operativo.”
                </>
              )}
            </blockquote>
          </div>

          <div className="flex flex-row lg:flex-col items-start lg:items-end justify-between gap-2 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-slate-800">
            <div className="text-left lg:text-right">
              <span className="text-xs text-slate-400 block">Ratio de Recuperación (RR)</span>
              <span className="font-mono-tabular text-3xl font-semibold text-amber-400">
                {formatPercent(Math.max(0, metrics.recoveryRatio), 1)}
              </span>
            </div>
            <div className="text-xs text-slate-400 font-mono-tabular">
              RR = VR / VAR
            </div>
          </div>
        </div>
      </div>

      {/* Grid Principal: Controles de Trayectoria (Izquierda) + Desglose Matemático y Cascada (Derecha) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Columna Izquierda: Calibrador de Variables (7 cols) */}
        <div className="lg:col-span-7 border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h2 className="text-base font-semibold text-slate-100">
                01. Calibración de Trayectoria del Activo (Nodo A)
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                {contextEnv === 'CORABASTOS_2AM'
                  ? 'Modo Campo 02:00 AM: Botones táctiles de ajuste rápido para negociación en caliente.'
                  : 'Modo War Room 05:00 AM: Modelado de sensibilidad financiera para Comité de Riesgo.'}
              </p>
            </div>
            <button
              onClick={onResetPreset}
              className="px-3 py-1.5 text-xs text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
              title="Restaurar valores originales del caso"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Restaurar Caso</span>
            </button>
          </div>

          {/* 1. V_ATM */}
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-sm font-medium text-slate-200 block">
                  V_ATM — Valor Original / Potencial de Referencia
                </label>
                <span className="text-xs text-slate-400">
                  ¿Cuánto debería valer si el sistema funcionara como fue diseñado?
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({ vATM: Math.max(0, deal.vATM - stepUnit) })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  -{formatCompactCurrency(stepUnit, deal.currency)}
                </button>
                <input
                  type="number"
                  value={deal.vATM}
                  onChange={(e) =>
                    onUpdateDeal({ vATM: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-36 bg-slate-900 border border-slate-700 rounded px-3 py-1.5 text-right font-mono-tabular text-sm text-slate-100 focus:outline-none focus:border-amber-500"
                />
                <button
                  type="button"
                  onClick={() => onUpdateDeal({ vATM: deal.vATM + stepUnit })}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  +{formatCompactCurrency(stepUnit, deal.currency)}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={maxSliderValue}
              step={stepUnit / 2}
              value={deal.vATM}
              onChange={(e) => onUpdateDeal({ vATM: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 2. V_OTM(t) */}
          <div className="space-y-2 pt-2 border-t border-slate-800/70">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-sm font-medium text-rose-300 block">
                  V_OTM(t) — Escenario Sin Intervención (Trayectoria Actual)
                </label>
                <span className="text-xs text-slate-400">
                  ¿Cuánto valdrá en t si nadie interviene y sigue la fricción actual?
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({ vOTM: Math.max(0, deal.vOTM - stepUnit) })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  -{formatCompactCurrency(stepUnit, deal.currency)}
                </button>
                <input
                  type="number"
                  value={deal.vOTM}
                  onChange={(e) =>
                    onUpdateDeal({ vOTM: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-36 bg-slate-900 border border-rose-500/40 rounded px-3 py-1.5 text-right font-mono-tabular text-sm text-rose-300 focus:outline-none focus:border-rose-400"
                />
                <button
                  type="button"
                  onClick={() => onUpdateDeal({ vOTM: deal.vOTM + stepUnit })}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  +{formatCompactCurrency(stepUnit, deal.currency)}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={deal.vATM}
              step={stepUnit / 2}
              value={deal.vOTM}
              onChange={(e) => onUpdateDeal({ vOTM: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 3. V_ITM(t) */}
          <div className="space-y-2 pt-2 border-t border-slate-800/70">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-sm font-medium text-emerald-300 block">
                  V_ITM(t) — Escenario Intervenido (Post-Desbloqueo)
                </label>
                <span className="text-xs text-slate-400">
                  ¿Cuánto vale en t después de activar la arquitectura de intervención?
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({ vITM: Math.max(0, deal.vITM - stepUnit / 2) })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  -{formatCompactCurrency(stepUnit / 2, deal.currency)}
                </button>
                <input
                  type="number"
                  value={deal.vITM}
                  onChange={(e) =>
                    onUpdateDeal({ vITM: Math.max(0, Number(e.target.value)) })
                  }
                  className="w-36 bg-slate-900 border border-emerald-500/40 rounded px-3 py-1.5 text-right font-mono-tabular text-sm text-emerald-300 focus:outline-none focus:border-emerald-400"
                />
                <button
                  type="button"
                  onClick={() => onUpdateDeal({ vITM: deal.vITM + stepUnit / 2 })}
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  +{formatCompactCurrency(stepUnit / 2, deal.currency)}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={maxSliderValue}
              step={stepUnit / 2}
              value={deal.vITM}
              onChange={(e) => onUpdateDeal({ vITM: Number(e.target.value) })}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 4. C_movimiento */}
          <div className="space-y-2 pt-2 border-t border-slate-800/70">
            <div className="flex items-center justify-between gap-2">
              <div>
                <label className="text-sm font-medium text-amber-300 block">
                  C_movimiento — Costos Reales de Movimiento / Desbloqueo
                </label>
                <span className="text-xs text-slate-400">
                  Logística, flete, permisos, última milla o ejecución táctica para movilizar el activo
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({
                      cMovement: Math.max(0, deal.cMovement - stepUnit / 5),
                    })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  -{formatCompactCurrency(stepUnit / 5, deal.currency)}
                </button>
                <input
                  type="number"
                  value={deal.cMovement}
                  onChange={(e) =>
                    onUpdateDeal({
                      cMovement: Math.max(0, Number(e.target.value)),
                    })
                  }
                  className="w-36 bg-slate-900 border border-amber-500/40 rounded px-3 py-1.5 text-right font-mono-tabular text-sm text-amber-300 focus:outline-none focus:border-amber-400"
                />
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({ cMovement: deal.cMovement + stepUnit / 5 })
                  }
                  className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-xs font-mono-tabular cursor-pointer"
                >
                  +{formatCompactCurrency(stepUnit / 5, deal.currency)}
                </button>
              </div>
            </div>
            <input
              type="range"
              min={0}
              max={Math.max(deal.vATM * 0.5, deal.cMovement * 2, 5000)}
              step={Math.max(50, stepUnit / 10)}
              value={deal.cMovement}
              onChange={(e) =>
                onUpdateDeal({ cMovement: Number(e.target.value) })
              }
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
          </div>

          {/* 5. % Captura JSCJ (30% - 50%) & Filtro de Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4 border-t border-slate-800">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300">
                  Participación JSCJ sobre VR (30% – 50%)
                </label>
                <span className="font-mono-tabular text-sm font-semibold text-amber-400">
                  {deal.jscjSharePercent}% JSCJ / {100 - deal.jscjSharePercent}% Cliente
                </span>
              </div>
              <input
                type="range"
                min={30}
                max={50}
                step={5}
                value={deal.jscjSharePercent}
                onChange={(e) =>
                  onUpdateDeal({ jscjSharePercent: Number(e.target.value) })
                }
                className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
              />
              <div className="flex justify-between text-xs font-mono-tabular text-slate-400">
                <button
                  type="button"
                  onClick={() => onUpdateDeal({ jscjSharePercent: 30 })}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    deal.jscjSharePercent === 30
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'hover:text-slate-200'
                  }`}
                >
                  30% Conservador
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateDeal({ jscjSharePercent: 40 })}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    deal.jscjSharePercent === 40
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'hover:text-slate-200'
                  }`}
                >
                  40% Equilibrado
                </button>
                <button
                  type="button"
                  onClick={() => onUpdateDeal({ jscjSharePercent: 50 })}
                  className={`px-2 py-0.5 rounded cursor-pointer ${
                    deal.jscjSharePercent === 50
                      ? 'bg-amber-500/20 text-amber-300 font-semibold'
                      : 'hover:text-slate-200'
                  }`}
                >
                  50% Riesgo Alto
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-medium text-slate-300 block">
                Auditoría de Infraestructura de Recuperación (Filtro HOLD)
              </label>
              <div className="grid grid-cols-3 gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg">
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({
                      infrastructureIntact: true,
                      protocolCertainty: 'HIGH',
                    })
                  }
                  className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    deal.infrastructureIntact && deal.protocolCertainty === 'HIGH'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟢 Reactivable
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({
                      infrastructureIntact: true,
                      protocolCertainty: 'UNCERTAIN',
                    })
                  }
                  className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    deal.infrastructureIntact &&
                    deal.protocolCertainty === 'UNCERTAIN'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🟡 Incierto (HOLD)
                </button>
                <button
                  type="button"
                  onClick={() =>
                    onUpdateDeal({
                      infrastructureIntact: false,
                      protocolCertainty: 'DEAD',
                    })
                  }
                  className={`px-2.5 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    !deal.infrastructureIntact ||
                    deal.protocolCertainty === 'DEAD'
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  🔴 Protocolo Muerto
                </button>
              </div>
              <p className="text-[11px] text-slate-400">
                Protege contra el patrón de intentar salvar sistemas sin estructura.
              </p>
            </div>
          </div>
        </div>

        {/* Columna Derecha: La Ecuación Maestra & Separación VAR vs VR (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Tarjeta 1: Separación Formal VAR vs VR (Corrección Matemática) */}
          <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-5">
            <div className="border-b border-slate-800 pb-3">
              <h2 className="text-base font-semibold text-slate-100">
                02. Separación Formal: Valor en Riesgo vs. Valor Recuperado
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                No repartimos el activo original. Repartimos únicamente el incremento neto que aparece porque cambiamos la trayectoria.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* VAR Box */}
              <div className="p-4 bg-slate-900/90 border border-slate-800 rounded space-y-1.5">
                <div className="text-xs text-slate-400 flex items-center justify-between">
                  <span>Valor en Riesgo (VAR)</span>
                  <span className="font-mono-tabular text-[11px] text-slate-400">
                    V_ATM − V_OTM
                  </span>
                </div>
                <div className="font-mono-tabular text-2xl font-semibold text-rose-400">
                  {formatCurrency(metrics.varValue, deal.currency)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Valor que el sistema está en riesgo de destruir si continúa haciendo lo mismo.
                </p>
              </div>

              {/* VR Box */}
              <div className="p-4 bg-slate-900/90 border border-emerald-500/30 rounded space-y-1.5">
                <div className="text-xs text-emerald-300/90 flex items-center justify-between">
                  <span>Valor Recuperado Neto (VR)</span>
                  <span className="font-mono-tabular text-[11px] text-emerald-400">
                    V_ITM − V_OTM − C
                  </span>
                </div>
                <div
                  className={`font-mono-tabular text-2xl font-semibold ${
                    metrics.vrValue > 0 ? 'text-emerald-400' : 'text-rose-400'
                  }`}
                >
                  {formatCurrency(metrics.vrValue, deal.currency)}
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Valor incremental efectivamente rescatado descontando{' '}
                  {formatCurrency(deal.cMovement, deal.currency)} de movimiento.
                </p>
              </div>
            </div>

            {/* Barra Visual de Trayectoria */}
            <div className="space-y-2 pt-2">
              <div className="flex justify-between text-xs text-slate-400 font-mono-tabular">
                <span>Mapa de Trayectoria sobre V_ATM ({formatCompactCurrency(deal.vATM, deal.currency)})</span>
                <span>ITM: {formatCompactCurrency(deal.vITM, deal.currency)}</span>
              </div>
              <div className="h-5 w-full bg-slate-900 rounded overflow-hidden flex border border-slate-800">
                <div
                  style={{ width: `${otmPct}%` }}
                  className="bg-slate-700 h-full transition-all duration-150"
                  title={`Base OTM sin intervención: ${formatCurrency(deal.vOTM, deal.currency)}`}
                />
                <div
                  style={{ width: `${costPct}%` }}
                  className="bg-amber-500/80 h-full transition-all duration-150"
                  title={`Costos de movimiento: ${formatCurrency(deal.cMovement, deal.currency)}`}
                />
                <div
                  style={{ width: `${netRecoveredPct}%` }}
                  className="bg-emerald-500 h-full transition-all duration-150"
                  title={`Valor Neto Recuperado (VR): ${formatCurrency(metrics.vrValue, deal.currency)}`}
                />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400 font-mono-tabular">
                <span>■ Gris: Base OTM ({formatCompactCurrency(deal.vOTM, deal.currency)})</span>
                <span className="text-amber-300">■ Ámbar: Costo C ({formatCompactCurrency(deal.cMovement, deal.currency)})</span>
                <span className="text-emerald-400">■ Verde: VR Neto ({formatCompactCurrency(Math.max(0, metrics.vrValue), deal.currency)})</span>
              </div>
            </div>
          </div>

          {/* Tarjeta 2: Tabla de Partición 30% / 40% / 50% */}
          <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-100">
                  03. Matriz de Captura de Valor Incremental
                </h3>
                <p className="text-xs text-slate-400">
                  El cliente no paga por horas: comparte una fracción de lo que dejó de perder.
                </p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono-tabular">
                    <th className="py-2 pr-3 font-medium">Banda de Captura</th>
                    <th className="py-2 px-3 text-right font-medium">Captura JSCJ (P_JSCJ)</th>
                    <th className="py-2 px-3 text-right font-medium">Retención Cliente (P_cliente)</th>
                    <th className="py-2 pl-3 text-right font-medium">Total Final Cliente</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/60 font-mono-tabular text-xs">
                  {[
                    { pct: 30, jscj: metrics.jscjProfitMin30 },
                    { pct: 40, jscj: metrics.jscjProfitMid40 },
                    { pct: 50, jscj: metrics.jscjProfitMax50 },
                  ].map((row) => {
                    const clientNet = Math.max(0, metrics.vrValue) - row.jscj;
                    const clientTotal = deal.vOTM + clientNet;
                    const isSelected = deal.jscjSharePercent === row.pct;
                    return (
                      <tr
                        key={row.pct}
                        onClick={() => onUpdateDeal({ jscjSharePercent: row.pct })}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-amber-500/10 text-slate-100'
                            : 'text-slate-300 hover:bg-slate-900/60'
                        }`}
                      >
                        <td className="py-2.5 pr-3 font-medium">
                          <span>{row.pct}% / {100 - row.pct}%</span>
                          {isSelected && (
                            <span className="ml-2 text-[10px] text-amber-400 font-semibold">
                              [ACTIVA]
                            </span>
                          )}
                        </td>
                        <td className="py-2.5 px-3 text-right text-amber-300 font-semibold">
                          {formatCurrency(row.jscj, deal.currency)}
                        </td>
                        <td className="py-2.5 px-3 text-right text-emerald-300">
                          +{formatCurrency(clientNet, deal.currency)}
                        </td>
                        <td className="py-2.5 pl-3 text-right text-slate-200">
                          {formatCurrency(clientTotal, deal.currency)}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
              <span>Sin intervención, el cliente recibiría solo V_OTM:</span>
              <span className="font-mono-tabular font-semibold text-rose-300">
                {formatCurrency(deal.vOTM, deal.currency)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
