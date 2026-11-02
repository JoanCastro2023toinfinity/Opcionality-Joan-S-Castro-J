import React, { useState } from 'react';
import {
  CalculatedMetrics,
  ContextEnvironment,
  FrictionDeal,
} from '../types/deal';
import { formatCurrency, formatPercent } from '../utils/calculations';
import { Check, Copy, FileCheck2, Shield, Sparkles } from 'lucide-react';

interface DealTermSheetProps {
  deal: FrictionDeal;
  metrics: CalculatedMetrics;
  contextEnv: ContextEnvironment;
  onUpdateDeal: (updated: Partial<FrictionDeal>) => void;
}

export const DealTermSheet: React.FC<DealTermSheetProps> = ({
  deal,
  metrics,
  contextEnv,
  onUpdateDeal,
}) => {
  const [copied, setCopied] = useState(false);
  const [signerName, setSignerName] = useState(deal.signedByCounterparty || '');

  const buildPlainTextSummary = () => {
    return [
      `ACUERDO DE OPCIONALIDAD Y CAPTURA DE VALOR — ${deal.code}`,
      `Título: ${deal.title}`,
      `Decisor / Contraparte: ${deal.counterpartyRole}`,
      `Estado del Protocolo: ${metrics.recommendedState}`,
      `----------------------------------------`,
      `1. DIAGNÓSTICO DE TRAYECTORIA (NODO A)`,
      `• Activo Atrapado: ${deal.unitLabel}`,
      `• Valor Original / Potencial (V_ATM): ${formatCurrency(deal.vATM, deal.currency)}`,
      `• Trayectoria sin Intervención (V_OTM): ${formatCurrency(deal.vOTM, deal.currency)}`,
      `• Valor en Riesgo de Destrucción (VAR): ${formatCurrency(metrics.varValue, deal.currency)}`,
      ``,
      `2. INTERVENCIÓN Y RECUPERACIÓN (t₀ → t)`,
      `• Arquitectura: ${deal.interventionArchitecture}`,
      `• Ventana Temporal: ${deal.timeWindowLabel}`,
      `• Prima de Opción (t₀): ${formatCurrency(deal.optionPremium, deal.currency)}`,
      `• Valor Post-Intervención (V_ITM): ${formatCurrency(deal.vITM, deal.currency)}`,
      `• Costos de Movimiento (C): ${formatCurrency(deal.cMovement, deal.currency)}`,
      `• Valor Incremental Recuperado Neto (VR): ${formatCurrency(metrics.vrValue, deal.currency)} (RR: ${formatPercent(metrics.recoveryRatio, 1)})`,
      ``,
      `3. PARTICIÓN DEL INCREMENTO NETO`,
      `• Condición Previa: V_ITM (${formatCurrency(deal.vITM, deal.currency)}) > V_OTM + C (${formatCurrency(metrics.breakevenITM, deal.currency)})`,
      `• Retención Neta Cliente (${100 - deal.jscjSharePercent}%): +${formatCurrency(metrics.clientRetainedValue, deal.currency)} (Total Recibido: ${formatCurrency(metrics.clientTotalEndValue, deal.currency)})`,
      `• Captura JSCJ (${deal.jscjSharePercent}%): ${formatCurrency(metrics.jscjProfit, deal.currency)}`,
      `• Downside Máximo JSCJ: Prima (${formatCurrency(deal.optionPremium, deal.currency)}) + costos explícitamente acordados.`,
    ].join('\n');
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(buildPlainTextSummary());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signerName.trim()) return;
    onUpdateDeal({
      signedByCounterparty: signerName.trim(),
      signedAt: new Date().toLocaleTimeString('es-CO', {
        hour: '2-digit',
        minute: '2-digit',
      }),
    });
  };

  return (
    <div className="space-y-8">
      {/* Pitch Maestro de Capitalismo Consciente */}
      <div className="border border-slate-800 bg-[#111726] p-6 sm:p-8 rounded-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="text-xs font-mono-tabular text-amber-400">
              PROPUESTA COMERCIAL DE ALINEACIÓN ASIMÉTRICA · CAPITALISMO CONSCIENTE
            </div>
            <h2 className="text-lg font-semibold text-slate-100">
              Declaración Frente al Decisor ({deal.counterpartyRole})
            </h2>
          </div>
          <button
            type="button"
            onClick={handleCopy}
            className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded flex items-center gap-2 transition-colors whitespace-nowrap cursor-pointer self-start"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4" />
                <span>Term Sheet Copiado</span>
              </>
            ) : (
              <>
                <Copy className="w-4 h-4" />
                <span>Copiar Term Sheet para Envío</span>
              </>
            )}
          </button>
        </div>

        <blockquote className="font-display text-2xl sm:text-3xl text-slate-100 leading-relaxed tracking-wide border-l-2 border-amber-500 pl-5">
          “Tú ya tienes el activo. El problema es que la fricción del sistema está destruyendo su valor. Yo asumo una parte acotada del riesgo para encontrar y ejecutar la ruta que permita recuperar el valor que, sin intervención, probablemente perderías. Si no recuperamos valor, mi upside desaparece. Si lo recuperamos, compartimos el incremento neto.”
        </blockquote>

        {/* Comparativa de Script según el Entorno Activo */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
          <div
            className={`p-5 rounded border ${
              contextEnv === 'CORABASTOS_2AM'
                ? 'bg-amber-950/20 border-amber-500/40'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-xs font-mono-tabular text-amber-300 mb-2">
              VERSIÓN CAMPO · 02:00 AM (DIRECTA / OPERATIVA)
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              “Patrón: su lote vale originalmente{' '}
              <strong className="font-mono-tabular text-white">
                {formatCurrency(deal.vATM, deal.currency)}
              </strong>
              , pero como está trancada la plaza hoy, si sigue igual de aquí a las 5 AM se lo van a pagar a{' '}
              <strong className="font-mono-tabular text-rose-300">
                {formatCurrency(deal.vOTM, deal.currency)}
              </strong>
              . Yo pongo{' '}
              <strong className="font-mono-tabular text-amber-300">
                {formatCurrency(deal.optionPremium, deal.currency)}
              </strong>{' '}
              de prima ya mismo y muevo el flete ({formatCurrency(deal.cMovement, deal.currency)}) para colocarlo en{' '}
              <strong className="font-mono-tabular text-emerald-300">
                {formatCurrency(deal.vITM, deal.currency)}
              </strong>
              . De los{' '}
              <strong className="font-mono-tabular text-emerald-300">
                {formatCurrency(metrics.vrValue, deal.currency)}
              </strong>{' '}
              limpios que rescatamos, usted se queda con{' '}
              <strong className="font-mono-tabular text-white">
                {formatCurrency(metrics.clientRetainedValue, deal.currency)}
              </strong>{' '}
              libres encima de sus {formatCurrency(deal.vOTM, deal.currency)}, y yo cobro{' '}
              <strong className="font-mono-tabular text-amber-300">
                {formatCurrency(metrics.jscjProfit, deal.currency)}
              </strong>
              . Si no logro superar el piso, pierdo mi prima y usted no me debe una sola hora.”
            </p>
          </div>

          <div
            className={`p-5 rounded border ${
              contextEnv === 'WAR_ROOM_5AM'
                ? 'bg-emerald-950/20 border-emerald-500/40'
                : 'bg-slate-900/60 border-slate-800'
            }`}
          >
            <div className="text-xs font-mono-tabular text-emerald-300 mb-2">
              VERSIÓN WAR ROOM · 05:00 AM (FORTUNE 100 RISK COMMITTEE)
            </div>
            <p className="text-sm text-slate-200 leading-relaxed">
              “Miembros del Comité: el activo presenta un Valor en Riesgo (VAR) de{' '}
              <strong className="font-mono-tabular text-rose-300">
                {formatCurrency(metrics.varValue, deal.currency)}
              </strong>{' '}
              por latencia decisional, proyectando un cierre OTM de{' '}
              <strong className="font-mono-tabular text-white">
                {formatCurrency(deal.vOTM, deal.currency)}
              </strong>
              . No proponemos un retainer de consultoría. Adquirimos una opción de intervención en ventana de{' '}
              <strong className="text-white">{deal.timeWindowLabel}</strong> con costo de desbloqueo acotado a{' '}
              <strong className="font-mono-tabular text-amber-300">
                {formatCurrency(deal.cMovement, deal.currency)}
              </strong>
              . Proyectamos un Valor Recuperado Neto (VR) de{' '}
              <strong className="font-mono-tabular text-emerald-300">
                {formatCurrency(metrics.vrValue, deal.currency)}
              </strong>{' '}
              (Ratio de Recuperación del{' '}
              <strong className="font-mono-tabular text-emerald-300">
                {formatPercent(metrics.recoveryRatio, 1)}
              </strong>
              ). La compañía retiene{' '}
              <strong className="font-mono-tabular text-white">
                {formatCurrency(metrics.clientRetainedValue, deal.currency)}
              </strong>{' '}
              y nuestra firma participa con el {deal.jscjSharePercent}% ({formatCurrency(metrics.jscjProfit, deal.currency)}) exclusivamente sobre el delta auditado.”
            </p>
          </div>
        </div>
      </div>

      {/* Term Sheet Formal & Ecuación Maestra */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-6">
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100">
                01. Hoja de Términos Transaccional (Contrato de Opcionalidad)
              </h3>
              <p className="text-xs text-slate-400">
                 Transformación de fricción intangible en un activo financiero cuantificable.
              </p>
            </div>
            <span className="font-mono-tabular text-xs text-slate-400">
              {deal.code}
            </span>
          </div>

          {/* Ecuación en una sola línea */}
          <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-3 font-mono-tabular text-xs">
            <div className="text-slate-400">Ecuación Contractual de Liquidación:</div>
            <div className="text-sm sm:text-base text-slate-100 py-1 overflow-x-auto whitespace-nowrap">
              Profit_JSCJ = [ V_post({formatCurrency(deal.vITM, deal.currency)}) − V_no_int({formatCurrency(deal.vOTM, deal.currency)}) − C_mov({formatCurrency(deal.cMovement, deal.currency)}) ] × {deal.jscjSharePercent}% ={' '}
              <span className="text-amber-400 font-semibold">
                {formatCurrency(metrics.jscjProfit, deal.currency)}
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-slate-900 text-[11px]">
              <div>
                <span className="text-slate-400">Condición Previa de Activación: </span>
                <span className="text-emerald-400">
                  V_post &gt; V_no_int + C_mov ({formatCurrency(metrics.breakevenITM, deal.currency)})
                </span>
              </div>
              <div>
                <span className="text-slate-400">Downside Máximo JSCJ: </span>
                <span className="text-rose-300">
                  Prima ({formatCurrency(deal.optionPremium, deal.currency)}) + costos acordados
                </span>
              </div>
            </div>
          </div>

          {/* Cláusulas Operativas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-1">
              <div className="text-slate-400 font-mono-tabular">
                CLÁUSULA 1 · OBJETO DE INTERVENCIÓN
              </div>
              <div className="font-medium text-slate-100">{deal.unitLabel}</div>
              <p className="text-slate-400 leading-relaxed">
                Derecho temporal para intervenir sobre la fricción que destruye valor, sin adquirir el pasivo estructural del activo.
              </p>
            </div>

            <div className="p-4 bg-slate-900/60 border border-slate-800 rounded space-y-1">
              <div className="text-slate-400 font-mono-tabular">
                CLÁUSULA 2 · VENTANA Y DISPARADOR (t₀ → t)
              </div>
              <div className="font-medium text-slate-100">
                {deal.timeWindowLabel}
              </div>
              <p className="text-slate-400 leading-relaxed">
                {deal.activationCondition}
              </p>
            </div>
          </div>
        </div>

        {/* Bloque de Firma / Aceptación en Caliente (4 cols) */}
        <div className="lg:col-span-4 border border-slate-800 bg-[#0F1420] p-6 rounded-lg flex flex-col justify-between space-y-6">
          <div className="space-y-4">
            <div className="border-b border-slate-800 pb-3">
              <h3 className="text-base font-semibold text-slate-100">
                02. Cierre y Protocolización en Sitio
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Registra el acuerdo con el decisor para activar la ventana t₀.
              </p>
            </div>

            <div className="space-y-2 text-xs font-mono-tabular">
              <div className="flex justify-between py-1.5 border-b border-slate-800/70">
                <span className="text-slate-400">Estado del Filtro:</span>
                <span
                  className={
                    metrics.recommendedState === 'INTERVENE'
                      ? 'text-emerald-400 font-semibold'
                      : metrics.recommendedState === 'HOLD'
                      ? 'text-amber-300 font-semibold'
                      : 'text-rose-400 font-semibold'
                  }
                >
                  {metrics.recommendedState}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/70">
                <span className="text-slate-400">Prima en t₀:</span>
                <span className="text-slate-100">
                  {formatCurrency(deal.optionPremium, deal.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-slate-800/70">
                <span className="text-slate-400">Incremento Neto Cliente:</span>
                <span className="text-emerald-400 font-semibold">
                  +{formatCurrency(metrics.clientRetainedValue, deal.currency)}
                </span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-slate-400">Honorario Opcionalidad JSCJ:</span>
                <span className="text-amber-400 font-semibold">
                  {formatCurrency(metrics.jscjProfit, deal.currency)} ({deal.jscjSharePercent}%)
                </span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSign} className="space-y-3 pt-4 border-t border-slate-800">
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-300 block">
                Nombre / Cargo del Decisor que Autoriza
              </label>
              <input
                type="text"
                placeholder="Ej. Carlos Mendoza — Patrón Bodega 14 / Chair Risk"
                value={signerName}
                onChange={(e) => setSignerName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded px-3 py-2 text-xs text-slate-100 focus:outline-none focus:border-amber-500"
              />
            </div>

            <button
              type="submit"
              disabled={metrics.recommendedState === 'NO_INTERVENGO'}
              className={`w-full py-2.5 px-4 rounded font-semibold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer ${
                metrics.recommendedState === 'NO_INTERVENGO'
                  ? 'bg-slate-800 text-slate-500 cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
              }`}
            >
              <FileCheck2 className="w-4 h-4" />
              <span>
                {deal.signedByCounterparty
                  ? 'Actualizar Firma de Protocolo t₀'
                  : 'Protocolizar Opción t₀ con Decisor'}
              </span>
            </button>

            {deal.signedByCounterparty && (
              <div className="p-3 bg-emerald-950/30 border border-emerald-500/40 rounded text-xs space-y-0.5">
                <div className="text-emerald-300 font-semibold">
                  ✓ Opción Protocolizada en Campo
                </div>
                <div className="text-slate-300">
                  Firmado por: {deal.signedByCounterparty} ({deal.signedAt})
                </div>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
