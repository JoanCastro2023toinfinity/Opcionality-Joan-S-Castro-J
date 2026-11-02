import React, { useState } from 'react';
import { CalculatedMetrics, FrictionDeal } from '../types/deal';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '../utils/calculations';
import { Clock, ShieldCheck, TrendingUp, AlertOctagon } from 'lucide-react';

interface OptionContractStudioProps {
  deal: FrictionDeal;
  metrics: CalculatedMetrics;
  onUpdateDeal: (updated: Partial<FrictionDeal>) => void;
}

export const OptionContractStudio: React.FC<OptionContractStudioProps> = ({
  deal,
  metrics,
  onUpdateDeal,
}) => {
  const [simulatedOutcomeFactor, setSimulatedOutcomeFactor] = useState<number>(1.0);

  // Simulated ITM at time t based on user stress slider
  const simulatedITM = Math.round(deal.vITM * simulatedOutcomeFactor);
  const simulatedBreakeven = deal.vOTM + deal.cMovement;
  const optionExercised = simulatedITM > simulatedBreakeven && deal.infrastructureIntact;
  const simulatedVR = optionExercised
    ? simulatedITM - deal.vOTM - deal.cMovement
    : 0;
  const simulatedJSCJGross = simulatedVR * (deal.jscjSharePercent / 100);
  const simulatedJSCJNetPayoff = optionExercised
    ? simulatedJSCJGross - deal.optionPremium
    : -deal.optionPremium;
  const simulatedClientNetGain = optionExercised
    ? simulatedVR * (1 - deal.jscjSharePercent / 100) + deal.optionPremium
    : deal.optionPremium;

  // Build payoff matrix across 5 trajectory scenarios at time t
  const scenarios = [
    {
      label: '1. Expiración (Sin Ruta / Colapso)',
      itm: deal.vOTM,
      description: 'V_OTM(t) ≤ umbral. No se activa intervención; opción expira.',
    },
    {
      label: '2. Sub-Umbral (No Cubre Costos)',
      itm: Math.round(deal.vOTM + deal.cMovement * 0.7),
      description: 'V_ITM < V_OTM + C. Se protege capital operativo; no se ejecuta.',
    },
    {
      label: '3. Recuperación Conservadora',
      itm: Math.round(deal.vOTM + deal.cMovement + (deal.vATM - deal.vOTM) * 0.2),
      description: 'Activación moderada; desbloqueo parcial de última milla.',
    },
    {
      label: '4. Caso Objetivo Cartografiado (ITM Actual)',
      itm: deal.vITM,
      description: 'Ejecución nominal de la ruta de intervención diseñada.',
      isCurrent: true,
    },
    {
      label: '5. Recuperación Óptima (Cercana a ATM)',
      itm: Math.round(deal.vOTM + (deal.vATM - deal.vOTM) * 0.85),
      description: 'Desbloqueo sistémico completo en ventana t.',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Encabezado Conceptual de Opcionalidad */}
      <div className="border border-slate-800 bg-[#111726] p-6 rounded-lg">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          <div className="lg:col-span-8 space-y-2">
            <div className="flex items-center gap-2 text-xs text-amber-400 font-mono-tabular">
              <span>ARQUITECTURA FINANCIERA DE OPCIONALIDAD</span>
              <span aria-hidden="true">·</span>
              <span>DERECHO TEMPORAL DE INTERVENCIÓN (t₀ → t)</span>
            </div>
            <h2 className="font-display text-2xl sm:text-3xl text-slate-100 tracking-wide">
              “Pierdes poco cuando la cartografía no funciona (−Prima) y participas significativamente cuando funciona.”
            </h2>
            <p className="text-sm text-slate-300 leading-relaxed max-w-3xl">
              No compras el activo deteriorado ni asumes su pasivo estructural. En{' '}
              <span className="font-mono-tabular text-amber-300">t₀</span> reservas el derecho temporal de intervenir sobre la fricción. Si en{' '}
              <span className="font-mono-tabular text-amber-300">t</span> se cumple{' '}
              <span className="font-mono-tabular text-emerald-300">
                V_ITM &gt; V_OTM + C_movimiento
              </span>
              , activas la ejecución. Si no, la opción expira y tu pérdida máxima queda estrictamente acotada.
            </p>
          </div>

          <div className="lg:col-span-4 border-t lg:border-t-0 lg:border-l border-slate-800 pt-4 lg:pt-0 lg:pl-6 flex flex-col justify-between gap-3">
            <div>
              <span className="text-xs text-slate-400 block">
                Downside Máximo JSCJ en t₀
              </span>
              <span className="font-mono-tabular text-2xl font-semibold text-rose-400">
                −{formatCurrency(deal.optionPremium, deal.currency)}
              </span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">
                Upside Esperado JSCJ en t (Caso Base)
              </span>
              <span className="font-mono-tabular text-2xl font-semibold text-emerald-400">
                +{formatCurrency(metrics.jscjProfit, deal.currency)}{' '}
                <span className="text-xs text-amber-300 font-normal">
                  ({metrics.asymmetryMultiple.toFixed(1)}x sobre Prima)
                </span>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Configuración t0 y Stress-Test en t */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Parámetros del Contrato en t0 (6 cols) */}
        <div className="lg:col-span-6 border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-100">
              01. Estructuración del Contrato en t₀ (Reserva de Opcionalidad)
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Define la prima de reserva, la ventana crítica y la condición exacta que dispara el desbloqueo.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Prima de Opción en t₀ ({deal.currency})
              </label>
              <input
                type="number"
                value={deal.optionPremium}
                onChange={(e) =>
                  onUpdateDeal({
                    optionPremium: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 font-mono-tabular text-sm text-amber-300 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Pérdida máxima si la opción expira sin ejercicio.
              </span>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 block">
                Costo Máximo de Intervención (C_max)
              </label>
              <input
                type="number"
                value={deal.cMovement}
                onChange={(e) =>
                  onUpdateDeal({
                    cMovement: Math.max(0, Number(e.target.value)),
                  })
                }
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 font-mono-tabular text-sm text-slate-100 focus:outline-none focus:border-amber-500"
              />
              <span className="text-[11px] text-slate-400 block">
                Solo se desembolsa si se activa la intervención en t.
              </span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Ventana Temporal de Ejercicio (t₀ → t)
            </label>
            <input
              type="text"
              value={deal.timeWindowLabel}
              onChange={(e) => onUpdateDeal({ timeWindowLabel: e.target.value })}
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Condición de Activación (Trigger en t)
            </label>
            <textarea
              rows={3}
              value={deal.activationCondition}
              onChange={(e) =>
                onUpdateDeal({ activationCondition: e.target.value })
              }
              className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="p-4 bg-slate-900/90 border border-slate-800 rounded space-y-2 font-mono-tabular text-xs">
            <div className="text-slate-400">Ecuación de Ejercicio en t:</div>
            <div className="text-slate-100">
              Umbral de Activación = V_OTM ({formatCompactCurrency(deal.vOTM, deal.currency)}) + C_movimiento ({formatCompactCurrency(deal.cMovement, deal.currency)}) ={' '}
              <span className="text-amber-300 font-semibold">
                {formatCurrency(metrics.breakevenITM, deal.currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Simulador de Stress-Test en Tiempo t (6 cols) */}
        <div className="lg:col-span-6 border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-5">
          <div className="border-b border-slate-800 pb-3">
            <h3 className="text-base font-semibold text-slate-100">
              02. Simulador de Expiración vs. Ejercicio en Tiempo t
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Desliza el resultado obtenido en t para comprobar cómo la opción protege tu downside.
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs text-slate-300">
                Valor V_ITM(t) verificado al momento de decisión:
              </span>
              <span className="font-mono-tabular text-base font-semibold text-amber-300">
                {formatCurrency(simulatedITM, deal.currency)} (
                {Math.round(simulatedOutcomeFactor * 100)}% del objetivo)
              </span>
            </div>
            <input
              type="range"
              min={0.5}
              max={1.35}
              step={0.05}
              value={simulatedOutcomeFactor}
              onChange={(e) => setSimulatedOutcomeFactor(Number(e.target.value))}
              className="w-full h-1.5 bg-slate-800 rounded-lg cursor-pointer"
            />
            <div className="flex justify-between text-[11px] font-mono-tabular text-slate-400">
              <span>50% (Colapso OTM)</span>
              <span>100% (Objetivo ITM)</span>
              <span>135% (Sobrerrecuperación)</span>
            </div>
          </div>

          {/* Resultado de la Decisión de Opción */}
          <div
            className={`p-5 rounded-lg border space-y-3 ${
              optionExercised
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-amber-950/20 border-amber-500/40'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-tabular text-xs font-semibold tracking-wider text-slate-100">
                {optionExercised
                  ? '🟢 OPCIÓN EJERCIDA EN t (SE DESPLIEGA C_MOVIMIENTO)'
                  : '🟡 OPCIÓN EXPIRA EN t (NO SE DESPLIEGA CAPITAL OPERATIVO)'}
              </span>
              <span className="font-mono-tabular text-xs text-slate-300">
                Umbral: {formatCompactCurrency(simulatedBreakeven, deal.currency)}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-3 bg-slate-900/90 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400">Valor Recuperado (VR)</div>
                <div className="font-mono-tabular text-base font-semibold text-slate-100 mt-0.5">
                  {formatCurrency(simulatedVR, deal.currency)}
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400">Resultado Neto JSCJ</div>
                <div
                  className={`font-mono-tabular text-base font-semibold mt-0.5 ${
                    simulatedJSCJNetPayoff >= 0
                      ? 'text-emerald-400'
                      : 'text-rose-400'
                  }`}
                >
                  {simulatedJSCJNetPayoff >= 0 ? '+' : ''}
                  {formatCurrency(simulatedJSCJNetPayoff, deal.currency)}
                </div>
              </div>
              <div className="p-3 bg-slate-900/90 rounded border border-slate-800">
                <div className="text-[11px] text-slate-400">Beneficio Neto Cliente</div>
                <div className="font-mono-tabular text-base font-semibold text-amber-300 mt-0.5">
                  +{formatCurrency(simulatedClientNetGain, deal.currency)}
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {optionExercised
                ? `Al superar V_OTM + C (${formatCurrency(
                    simulatedBreakeven,
                    deal.currency
                  )}), activas la intervención. Capturas ${
                    deal.jscjSharePercent
                  }% del incremento neto (${formatCurrency(
                    simulatedJSCJGross,
                    deal.currency
                  )}).`
                : `Como V_ITM (${formatCurrency(
                    simulatedITM,
                    deal.currency
                  )}) no supera V_OTM + C (${formatCurrency(
                    simulatedBreakeven,
                    deal.currency
                  )}), dejas expirar la opción. No gastas los ${formatCurrency(
                    deal.cMovement,
                    deal.currency
                  )} de movimiento y tu pérdida total se limita a −Prima (${formatCurrency(
                    deal.optionPremium,
                    deal.currency
                  )}).`}
            </p>
          </div>
        </div>
      </div>

      {/* Tabla de Asimetría de Retorno en t */}
      <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-4">
        <div className="border-b border-slate-800 pb-3">
          <h3 className="text-base font-semibold text-slate-100">
            03. Matriz de Asimetría de Opcionalidad (t₀ → t)
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Comparativa de resultados bajo distintos niveles de recuperación frente a un riesgo máximo acotado a −Prima ({formatCurrency(deal.optionPremium, deal.currency)}).
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono-tabular">
                <th className="py-2.5 pr-4 font-medium">Escenario en t</th>
                <th className="py-2.5 px-3 text-right font-medium">V_ITM(t)</th>
                <th className="py-2.5 px-3 text-center font-medium">Decisión Opción</th>
                <th className="py-2.5 px-3 text-right font-medium">Costo Movimiento</th>
                <th className="py-2.5 px-3 text-right font-medium">VR Neto</th>
                <th className="py-2.5 px-3 text-right font-medium">P&L JSCJ (Neto Prima)</th>
                <th className="py-2.5 pl-3 text-right font-medium">Múltiplo / Prima</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-tabular text-xs">
              {scenarios.map((sc, i) => {
                const active = sc.itm > deal.vOTM + deal.cMovement;
                const vr = active ? sc.itm - deal.vOTM - deal.cMovement : 0;
                const jscjCapture = vr * (deal.jscjSharePercent / 100);
                const netPnL = active
                  ? jscjCapture - deal.optionPremium
                  : -deal.optionPremium;
                const mult =
                  deal.optionPremium > 0 && active
                    ? `${(jscjCapture / deal.optionPremium).toFixed(1)}x`
                    : 'Expirada';

                return (
                  <tr
                    key={i}
                    className={
                      sc.isCurrent
                        ? 'bg-amber-500/10 text-slate-100'
                        : 'text-slate-300 hover:bg-slate-900/50'
                    }
                  >
                    <td className="py-3 pr-4 font-sans">
                      <div className="font-medium text-slate-200">{sc.label}</div>
                      <div className="text-[11px] text-slate-400">{sc.description}</div>
                    </td>
                    <td className="py-3 px-3 text-right">
                      {formatCurrency(sc.itm, deal.currency)}
                    </td>
                    <td className="py-3 px-3 text-center">
                      {active ? (
                        <span className="text-emerald-400 font-semibold">
                          EJERCER
                        </span>
                      ) : (
                        <span className="text-amber-300">EXPIRAR (HOLD)</span>
                      )}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-400">
                      {active ? formatCurrency(deal.cMovement, deal.currency) : '$0'}
                    </td>
                    <td className="py-3 px-3 text-right text-emerald-300">
                      {formatCurrency(vr, deal.currency)}
                    </td>
                    <td
                      className={`py-3 px-3 text-right font-semibold ${
                        netPnL >= 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {netPnL >= 0 ? '+' : ''}
                      {formatCurrency(netPnL, deal.currency)}
                    </td>
                    <td className="py-3 pl-3 text-right text-amber-300">
                      {mult}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
