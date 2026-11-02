import React, { useState, useMemo } from 'react';
import { PRESET_DEALS } from './data/presets';
import { ContextEnvironment, FrictionDeal } from './types/deal';
import {
  computeDealMetrics,
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from './utils/calculations';
import { TrajectorySimulator } from './components/TrajectorySimulator';
import { OptionContractStudio } from './components/OptionContractStudio';
import { UniversalArchitectureView } from './components/UniversalArchitectureView';
import { DealTermSheet } from './components/DealTermSheet';
import { PortfolioLedger } from './components/PortfolioLedger';
import { NewNodeModal } from './components/NewNodeModal';
import { CatalystEntropyMatrix } from './components/CatalystEntropyMatrix';
import { Plus } from 'lucide-react';

type ActiveTab =
  | 'simulator'
  | 'option'
  | 'architecture'
  | 'entropy'
  | 'termsheet'
  | 'portfolio';

export default function App() {
  const [deals, setDeals] = useState<FrictionDeal[]>(() =>
    PRESET_DEALS.map((d) => ({ ...d }))
  );
  const [activeDealId, setActiveDealId] = useState<string>(PRESET_DEALS[0].id);
  const [activeTab, setActiveTab] = useState<ActiveTab>('simulator');
  const [contextEnv, setContextEnv] = useState<ContextEnvironment>('CORABASTOS_2AM');
  const [isNewModalOpen, setIsNewModalOpen] = useState<boolean>(false);

  const activeDeal = useMemo(
    () => deals.find((d) => d.id === activeDealId) || deals[0],
    [deals, activeDealId]
  );

  const metrics = useMemo(() => computeDealMetrics(activeDeal), [activeDeal]);

  const handleUpdateDeal = (updatedFields: Partial<FrictionDeal>) => {
    setDeals((prev) =>
      prev.map((item) =>
        item.id === activeDeal.id
          ? { ...item, ...updatedFields, updatedAt: new Date().toISOString() }
          : item
      )
    );
  };

  const handleResetActivePreset = () => {
    const original = PRESET_DEALS.find((p) => p.id === activeDeal.id);
    if (original) {
      setDeals((prev) =>
        prev.map((item) =>
          item.id === activeDeal.id
            ? {
                ...original,
                ipChecklist: original.ipChecklist.map((c) => ({ ...c })),
              }
            : item
        )
      );
    }
  };

  const handleSelectDeal = (id: string) => {
    setActiveDealId(id);
    if (id === 'deal-corabastos-2am' || id === 'deal-campesino-ganadero') {
      setContextEnv('CORABASTOS_2AM');
    } else if (id === 'deal-fortune100-5am' || id === 'deal-vp-sales') {
      setContextEnv('WAR_ROOM_5AM');
    }
  };

  const handleCreateNewDeal = (newDeal: FrictionDeal) => {
    setDeals((prev) => [newDeal, ...prev]);
    setActiveDealId(newDeal.id);
    setActiveTab('simulator');
  };

  const handleDeleteDeal = (id: string) => {
    setDeals((prev) => {
      const remaining = prev.filter((d) => d.id !== id);
      if (activeDealId === id && remaining.length > 0) {
        setActiveDealId(remaining[0].id);
      }
      return remaining;
    });
  };

  const toggleEnvironment = () => {
    setContextEnv((prev) =>
      prev === 'CORABASTOS_2AM' ? 'WAR_ROOM_5AM' : 'CORABASTOS_2AM'
    );
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-slate-100 flex flex-col">
      {/* Top Bar Contract: 3 Zones (Single-element Brand, 5 Nav Links, 2 Primary Actions) */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-[#0B0F17]/95 sticky top-0 z-30">
        {/* Zone 1: Single text element wordmark */}
        <a
          href="#top"
          onClick={(e) => {
            e.preventDefault();
            setActiveTab('simulator');
          }}
          className="font-display text-2xl tracking-wide text-slate-100 whitespace-nowrap"
        >
          JSCJ Optionality
        </a>

        {/* Zone 2: 5 clean text navigation links */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => setActiveTab('simulator')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'simulator'
                ? 'text-amber-400 underline underline-offset-8 decoration-amber-400 font-semibold'
                : 'hover:text-slate-100'
            }`}
          >
            Simulador & Ecuación
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('option')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'option'
                ? 'text-amber-400 underline underline-offset-8 decoration-amber-400 font-semibold'
                : 'hover:text-slate-100'
            }`}
          >
            Contrato Opción (t₀ → t)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('architecture')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'architecture'
                ? 'text-amber-400 underline underline-offset-8 decoration-amber-400 font-semibold'
                : 'hover:text-slate-100'
            }`}
          >
            9 Capas & IP Stack
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('entropy')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'entropy'
                ? 'text-amber-400 underline underline-offset-8 decoration-amber-400 font-semibold'
                : 'hover:text-slate-100'
            }`}
          >
            Catalizador & Entropía
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('termsheet')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'termsheet'
                ? 'text-amber-400 underline underline-offset-8 decoration-amber-400 font-semibold'
                : 'hover:text-slate-100'
            }`}
          >
            Term Sheet & Cierre
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('portfolio')}
            className={`py-1 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'portfolio'
                ? 'text-amber-400 underline underline-offset-8 decoration-amber-400 font-semibold'
                : 'hover:text-slate-100'
            }`}
          >
            Portafolio ({deals.length})
          </button>
        </nav>

        {/* Zone 3: 2 Primary Actions */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={toggleEnvironment}
            className="px-3.5 py-2 text-xs font-mono-tabular font-medium text-slate-200 bg-slate-900 border border-slate-700 hover:border-amber-500/50 rounded transition-colors whitespace-nowrap cursor-pointer"
            title="Alternar protocolo visual y lenguaje entre Operación de Campo 2 AM y Comité de Riesgo 5 AM"
          >
            {contextEnv === 'CORABASTOS_2AM'
              ? 'Modo: 02:00 AM Campo'
              : 'Modo: 05:00 AM War Room'}
          </button>
          <button
            type="button"
            onClick={() => setIsNewModalOpen(true)}
            className="px-4 py-2 text-xs font-semibold text-slate-950 bg-amber-500 hover:bg-amber-400 rounded transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Nuevo Nodo</span>
          </button>
        </div>
      </header>

      {/* Mobile Navigation Bar */}
      <div className="lg:hidden flex items-center gap-2 overflow-x-auto px-6 py-2.5 border-b border-slate-800 bg-[#0F1420] text-xs">
        {(
          [
            { id: 'simulator', label: 'Simulador' },
            { id: 'option', label: 'Opción t₀→t' },
            { id: 'architecture', label: '9 Capas & IP' },
            { id: 'entropy', label: 'Catalizador & Entropía' },
            { id: 'termsheet', label: 'Term Sheet' },
            { id: 'portfolio', label: `Portafolio (${deals.length})` },
          ] as const
        ).map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setActiveTab(tab.id)}
            className={`px-3 py-1.5 rounded font-medium whitespace-nowrap cursor-pointer ${
              activeTab === tab.id
                ? 'bg-amber-500 text-slate-950 font-semibold'
                : 'text-slate-300 hover:bg-slate-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>


      {/* Main Content Container (1440px Baseline Presence) */}
      <main className="flex-1 max-w-[1400px] w-full mx-auto px-4 sm:px-6 py-8 space-y-8">
        {/* Axioma Central & Selector de Escala (Corabastos a Fortune 100) */}
        <section className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 border-b border-slate-800 pb-5">
            <div className="space-y-2 max-w-3xl">
              <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
                <span className="text-amber-400 font-semibold">
                  Arquitectura de Captura de Valor sobre Activos en Fricción
                </span>
                <span aria-hidden="true">·</span>
                <span>{activeDeal.environmentTag}</span>
                <span aria-hidden="true">·</span>
                <span>{activeDeal.timeContext}</span>
              </div>
              <h1 className="font-display text-3xl sm:text-4xl text-slate-100 tracking-wide leading-tight">
                “No compro empresas en problemas. Compro opcionalidad sobre valor que el sistema todavía puede recuperar.”
              </h1>
            </div>

            {/* Selector Rápido de Escenario / Nodo A */}
            <div className="w-full lg:w-96 shrink-0 space-y-1.5">
              <label className="text-xs text-slate-400 block">
                Seleccionar Escala del Nodo A (Desde Corabastos hasta Fortune 100):
              </label>
              <select
                value={activeDeal.id}
                onChange={(e) => handleSelectDeal(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 hover:border-slate-600 rounded px-3 py-2 text-xs font-medium text-slate-100 focus:outline-none focus:border-amber-500 cursor-pointer"
              >
                {deals.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.code} — {d.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Botones de Cambio Rápido de Arquetipo */}
          <div className="flex flex-wrap items-center gap-1.5">
            {deals.map((d) => {
              const isSelected = d.id === activeDeal.id;
              const dMetrics = computeDealMetrics(d);
              const stateDot =
                dMetrics.recommendedState === 'INTERVENE'
                  ? '🟢'
                  : dMetrics.recommendedState === 'HOLD'
                  ? '🟡'
                  : '🔴';
              return (
                <button
                  key={d.id}
                  type="button"
                  onClick={() => handleSelectDeal(d.id)}
                  className={`px-3 py-1.5 text-xs rounded transition-colors whitespace-nowrap cursor-pointer border ${
                    isSelected
                      ? 'bg-amber-500/15 border-amber-500/50 text-amber-300 font-semibold'
                      : 'bg-slate-900/70 border-slate-800 text-slate-400 hover:text-slate-200 hover:border-slate-700'
                  }`}
                >
                  <span>
                    {stateDot} {d.code}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Cinta de Telemetría Financiera del Nodo Activo (Tabular Numerals) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px bg-slate-800 border border-slate-800 rounded overflow-hidden">
            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">V_ATM (Ideal)</div>
              <div className="font-mono-tabular text-sm font-semibold text-slate-100 mt-1">
                {formatCompactCurrency(activeDeal.vATM, activeDeal.currency)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">V_OTM (Sin Int.)</div>
              <div className="font-mono-tabular text-sm font-semibold text-rose-300 mt-1">
                {formatCompactCurrency(activeDeal.vOTM, activeDeal.currency)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">Valor en Riesgo (VAR)</div>
              <div className="font-mono-tabular text-sm font-semibold text-rose-400 mt-1">
                {formatCompactCurrency(metrics.varValue, activeDeal.currency)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">V_ITM (Intervenido)</div>
              <div className="font-mono-tabular text-sm font-semibold text-emerald-300 mt-1">
                {formatCompactCurrency(activeDeal.vITM, activeDeal.currency)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">C_movimiento</div>
              <div className="font-mono-tabular text-sm font-semibold text-amber-300 mt-1">
                {formatCompactCurrency(activeDeal.cMovement, activeDeal.currency)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">VR Recuperado Neto</div>
              <div
                className={`font-mono-tabular text-sm font-semibold mt-1 ${
                  metrics.vrValue > 0 ? 'text-emerald-400' : 'text-rose-400'
                }`}
              >
                {formatCompactCurrency(metrics.vrValue, activeDeal.currency)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-slate-400">Ratio Recup. (RR)</div>
              <div className="font-mono-tabular text-sm font-semibold text-slate-100 mt-1">
                {formatPercent(Math.max(0, metrics.recoveryRatio), 1)}
              </div>
            </div>

            <div className="bg-[#0B0F17] p-3.5">
              <div className="text-[11px] text-amber-400">
                Captura JSCJ ({activeDeal.jscjSharePercent}%)
              </div>
              <div className="font-mono-tabular text-sm font-semibold text-amber-400 mt-1">
                {formatCompactCurrency(metrics.jscjProfit, activeDeal.currency)}
              </div>
            </div>
          </div>
        </section>

        {/* Vista Activa según Pestaña */}
        {activeTab === 'simulator' && (
          <TrajectorySimulator
            deal={activeDeal}
            metrics={metrics}
            contextEnv={contextEnv}
            onUpdateDeal={handleUpdateDeal}
            onResetPreset={handleResetActivePreset}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
          />
        )}

        {activeTab === 'option' && (
          <OptionContractStudio
            deal={activeDeal}
            metrics={metrics}
            onUpdateDeal={handleUpdateDeal}
          />
        )}

        {activeTab === 'architecture' && (
          <UniversalArchitectureView
            deal={activeDeal}
            metrics={metrics}
            onUpdateDeal={handleUpdateDeal}
          />
        )}

        {activeTab === 'entropy' && (
          <CatalystEntropyMatrix
            deal={activeDeal}
            metrics={metrics}
            contextEnv={contextEnv}
            onNavigateTab={(tab) => setActiveTab(tab as ActiveTab)}
          />
        )}

        {activeTab === 'termsheet' && (
          <DealTermSheet
            deal={activeDeal}
            metrics={metrics}
            contextEnv={contextEnv}
            onUpdateDeal={handleUpdateDeal}
          />
        )}

        {activeTab === 'portfolio' && (
          <PortfolioLedger
            deals={deals}
            activeDealId={activeDeal.id}
            onSelectDeal={(id) => {
              handleSelectDeal(id);
              setActiveTab('simulator');
            }}
            onCreateNewDeal={() => setIsNewModalOpen(true)}
            onDeleteDeal={handleDeleteDeal}
          />
        )}
      </main>

      {/* Quiet Editorial Footer */}
      <footer className="border-t border-slate-800/80 py-6 px-6 mt-12 text-xs text-slate-400">
        <div className="max-w-[1400px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            JSCJ Optionality · Arquitectura de Captura de Valor sobre Activos en Fricción
          </div>
          <div className="font-mono-tabular">
            Profit_JSCJ = [ V_ITM(t) − V_OTM(t) − C_movimiento ] × 30%–50%
          </div>
        </div>
      </footer>

      {/* Modal para Crear Nuevo Nodo en Caliente */}
      <NewNodeModal
        isOpen={isNewModalOpen}
        dealCount={deals.length}
        onClose={() => setIsNewModalOpen(false)}
        onCreate={handleCreateNewDeal}
      />
    </div>
  );
}
