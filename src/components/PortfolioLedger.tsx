import React, { useState } from 'react';
import { FrictionDeal, ProtocolState } from '../types/deal';
import {
  computeDealMetrics,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '../utils/calculations';
import { ArrowUpRight, Plus, Search, Trash2 } from 'lucide-react';

interface PortfolioLedgerProps {
  deals: FrictionDeal[];
  activeDealId: string;
  onSelectDeal: (id: string) => void;
  onCreateNewDeal: () => void;
  onDeleteDeal: (id: string) => void;
}

export const PortfolioLedger: React.FC<PortfolioLedgerProps> = ({
  deals,
  activeDealId,
  onSelectDeal,
  onCreateNewDeal,
  onDeleteDeal,
}) => {
  const [filterState, setFilterState] = useState<'ALL' | ProtocolState>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  const enrichedDeals = deals.map((deal) => ({
    deal,
    metrics: computeDealMetrics(deal),
  }));

  const filteredDeals = enrichedDeals.filter(({ deal, metrics }) => {
    const matchesState =
      filterState === 'ALL' || metrics.recommendedState === filterState;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      deal.title.toLowerCase().includes(q) ||
      deal.code.toLowerCase().includes(q) ||
      deal.counterpartyRole.toLowerCase().includes(q) ||
      deal.unitLabel.toLowerCase().includes(q);
    return matchesState && matchesSearch;
  });

  // Aggregate portfolio metrics (only for active/viable INTERVENE or HOLD deals in USD)
  const totalVAR = enrichedDeals.reduce(
    (acc, item) => acc + item.metrics.varValue,
    0
  );
  const totalVR = enrichedDeals.reduce(
    (acc, item) =>
      item.metrics.recommendedState !== 'NO_INTERVENGO'
        ? acc + Math.max(0, item.metrics.vrValue)
        : acc,
    0
  );
  const totalJSCJCapture = enrichedDeals.reduce(
    (acc, item) =>
      item.metrics.recommendedState !== 'NO_INTERVENGO'
        ? acc + item.metrics.jscjProfit
        : acc,
    0
  );
  const totalPremiumAtRisk = enrichedDeals.reduce(
    (acc, item) =>
      item.metrics.recommendedState !== 'NO_INTERVENGO'
        ? acc + item.deal.optionPremium
        : acc,
    0
  );

  return (
    <div className="space-y-8">
      {/* Resumen Agregado del Portafolio de Opcionalidad */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="border border-slate-800 bg-[#0F1420] p-5 rounded-lg space-y-1">
          <div className="text-xs text-slate-400">
            Valor en Riesgo Auditado (VAR Total)
          </div>
          <div className="font-mono-tabular text-2xl font-semibold text-rose-400">
            {formatCompactCurrency(totalVAR, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400">
            Suma de (V_ATM − V_OTM) en {deals.length} nodos
          </div>
        </div>

        <div className="border border-slate-800 bg-[#0F1420] p-5 rounded-lg space-y-1">
          <div className="text-xs text-slate-400">
            Valor Recuperable Neto (VR Activable)
          </div>
          <div className="font-mono-tabular text-2xl font-semibold text-emerald-400">
            {formatCompactCurrency(totalVR, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400">
            Excluyendo protocolos descartados (🔴)
          </div>
        </div>

        <div className="border border-slate-800 bg-[#0F1420] p-5 rounded-lg space-y-1">
          <div className="text-xs text-slate-400">
            Captura Potencial JSCJ (30%–50%)
          </div>
          <div className="font-mono-tabular text-2xl font-semibold text-amber-400">
            {formatCompactCurrency(totalJSCJCapture, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400">
            Participación sobre incremento neto
          </div>
        </div>

        <div className="border border-slate-800 bg-[#0F1420] p-5 rounded-lg space-y-1">
          <div className="text-xs text-slate-400">
            Primas de Opción en Riesgo (t₀)
          </div>
          <div className="font-mono-tabular text-2xl font-semibold text-slate-100">
            {formatCompactCurrency(totalPremiumAtRisk, 'USD')}
          </div>
          <div className="text-[11px] text-slate-400">
            Múltiplo de cartera:{' '}
            {totalPremiumAtRisk > 0
              ? `${(totalJSCJCapture / totalPremiumAtRisk).toFixed(1)}x`
              : 'N/A'}
          </div>
        </div>
      </div>

      {/* Tabla Comparativa Multi-Escala (Corabastos → Fortune 100) */}
      <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <h2 className="text-base font-semibold text-slate-100">
              Libro Mayor de Nodos en Fricción (Desde Corabastos hasta Fortune 100)
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Cambia solamente la escala del Nodo A; la ecuación sistémica permanece idéntica.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Buscador */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Buscar nodo o decisor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="bg-slate-900 border border-slate-700 rounded pl-8 pr-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:border-amber-500 w-48 sm:w-56"
              />
            </div>

            {/* Filtro de Estado */}
            <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg">
              {(
                [
                  { id: 'ALL', label: 'Todos' },
                  { id: 'INTERVENE', label: '🟢 Intervene' },
                  { id: 'HOLD', label: '🟡 Hold' },
                  { id: 'NO_INTERVENGO', label: '🔴 No Intervengo' },
                ] as const
              ).map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setFilterState(tab.id)}
                  className={`px-2.5 py-1 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer ${
                    filterState === tab.id
                      ? 'bg-slate-800 text-white'
                      : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={onCreateNewDeal}
              className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Nuevo Nodo</span>
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-800 text-[11px] text-slate-400 font-mono-tabular">
                <th className="py-2.5 pr-4 font-medium">Nodo / Decisor</th>
                <th className="py-2.5 px-3 text-center font-medium">Estado</th>
                <th className="py-2.5 px-3 text-right font-medium">V_ATM</th>
                <th className="py-2.5 px-3 text-right font-medium">V_OTM</th>
                <th className="py-2.5 px-3 text-right font-medium">V_ITM</th>
                <th className="py-2.5 px-3 text-right font-medium">Costo (C)</th>
                <th className="py-2.5 px-3 text-right font-medium">VR Neto</th>
                <th className="py-2.5 px-3 text-right font-medium">RR %</th>
                <th className="py-2.5 px-3 text-right font-medium">Captura JSCJ</th>
                <th className="py-2.5 pl-3 text-right font-medium">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono-tabular text-xs">
              {filteredDeals.map(({ deal, metrics }) => {
                const isSelected = deal.id === activeDealId;
                return (
                  <tr
                    key={deal.id}
                    onClick={() => onSelectDeal(deal.id)}
                    className={`cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-amber-500/10 text-slate-100'
                        : 'text-slate-300 hover:bg-slate-900/50'
                    }`}
                  >
                    <td className="py-3.5 pr-4 font-sans">
                      <div className="flex items-center gap-2">
                        <span className="font-mono-tabular text-[11px] text-amber-400 font-semibold">
                          {deal.code}
                        </span>
                        {deal.signedByCounterparty && (
                          <span className="text-[10px] text-emerald-400 font-mono-tabular">
                            · [FIRMADO]
                          </span>
                        )}
                      </div>
                      <div className="font-medium text-slate-100 text-xs mt-0.5">
                        {deal.title}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {deal.counterpartyRole} · {deal.unitLabel}
                      </div>
                    </td>
                    <td className="py-3.5 px-3 text-center whitespace-nowrap">
                      {metrics.recommendedState === 'INTERVENE' && (
                        <span className="text-emerald-400 font-semibold">
                          🟢 INTERVENE
                        </span>
                      )}
                      {metrics.recommendedState === 'HOLD' && (
                        <span className="text-amber-300 font-semibold">
                          🟡 HOLD
                        </span>
                      )}
                      {metrics.recommendedState === 'NO_INTERVENGO' && (
                        <span className="text-rose-400 font-semibold">
                          🔴 NO INTERVENGO
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-3 text-right">
                      {formatCompactCurrency(deal.vATM, deal.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-rose-300">
                      {formatCompactCurrency(deal.vOTM, deal.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-emerald-300">
                      {formatCompactCurrency(deal.vITM, deal.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-400">
                      {formatCompactCurrency(deal.cMovement, deal.currency)}
                    </td>
                    <td
                      className={`py-3.5 px-3 text-right font-semibold ${
                        metrics.vrValue > 0 ? 'text-emerald-400' : 'text-rose-400'
                      }`}
                    >
                      {formatCompactCurrency(metrics.vrValue, deal.currency)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-slate-300">
                      {formatPercent(Math.max(0, metrics.recoveryRatio), 1)}
                    </td>
                    <td className="py-3.5 px-3 text-right text-amber-300 font-semibold">
                      {formatCompactCurrency(metrics.jscjProfit, deal.currency)}
                    </td>
                    <td className="py-3.5 pl-3 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            onSelectDeal(deal.id);
                          }}
                          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded text-[11px] font-sans font-medium flex items-center gap-1 cursor-pointer"
                        >
                          <span>Abrir</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                        {deals.length > 1 && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onDeleteDeal(deal.id);
                            }}
                            className="p-1 text-slate-500 hover:text-rose-400 cursor-pointer"
                            title="Eliminar nodo"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
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
