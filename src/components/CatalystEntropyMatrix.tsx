import React, { useState } from 'react';
import {
  CalculatedMetrics,
  CognitiveSubSelf,
  ContextEnvironment,
  FrictionDeal,
  ThermodynamicRole,
} from '../types/deal';
import {
  COGNITIVE_SUB_SELVES_CATALOG,
  calculateThermodynamicRoleImpact,
} from '../utils/entropyCalculations';
import {
  formatCompactCurrency,
  formatCurrency,
  formatPercent,
} from '../utils/calculations';
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Brain,
  CheckCircle2,
  Cpu,
  Flame,
  Layers,
  Scale,
  Shield,
  Sparkles,
  Zap,
} from 'lucide-react';

interface CatalystEntropyMatrixProps {
  deal: FrictionDeal;
  metrics: CalculatedMetrics;
  contextEnv: ContextEnvironment;
  onNavigateTab: (tab: string) => void;
}

export const CatalystEntropyMatrix: React.FC<CatalystEntropyMatrixProps> = ({
  deal,
  metrics,
  contextEnv,
  onNavigateTab,
}) => {
  const [selectedRole, setSelectedRole] = useState<ThermodynamicRole>('CATALIZADOR');
  const [subSelves, setSubSelves] = useState<CognitiveSubSelf[]>(
    COGNITIVE_SUB_SELVES_CATALOG
  );
  const [filterSubSelfStatus, setFilterSubSelfStatus] = useState<
    'ALL' | 'ACTIVE_IN_DEAL' | 'EXTERNALIZED_IP' | 'STANDBY_ARCHIVE'
  >('ALL');

  const operatorImpact = calculateThermodynamicRoleImpact(deal, metrics, 'OPERADOR');
  const strategistImpact = calculateThermodynamicRoleImpact(deal, metrics, 'ESTRATEGA');
  const catalystImpact = calculateThermodynamicRoleImpact(deal, metrics, 'CATALIZADOR');

  const currentImpact =
    selectedRole === 'CATALIZADOR'
      ? catalystImpact
      : selectedRole === 'OPERADOR'
      ? operatorImpact
      : strategistImpact;

  const toggleSubSelfStatus = (id: string) => {
    setSubSelves((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const nextStatus: CognitiveSubSelf['status'] =
          item.status === 'ACTIVE_IN_DEAL'
            ? 'EXTERNALIZED_IP'
            : item.status === 'EXTERNALIZED_IP'
            ? 'STANDBY_ARCHIVE'
            : 'ACTIVE_IN_DEAL';
        return { ...item, status: nextStatus };
      })
    );
  };

  const filteredSubSelves = subSelves.filter((item) =>
    filterSubSelfStatus === 'ALL' ? true : item.status === filterSubSelfStatus
  );

  return (
    <div className="space-y-8">
      {/* 1. Header Rector: El Axioma del Comerciante Catalizador */}
      <div className="border border-amber-500/30 bg-[#111726] p-6 sm:p-8 rounded-lg space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-amber-400">
            <Zap className="w-4 h-4 text-amber-400" />
            <span>TERMODINÁMICA DEL COMERCIANTE: CATALIZADOR ≠ OPERADOR O ESTRATEGA</span>
          </div>
          <div className="text-xs font-mono-tabular text-slate-400">
            Nodo Activo: <span className="text-slate-200">{deal.code}</span> ({deal.currency})
          </div>
        </div>

        <blockquote className="font-display text-2xl sm:text-3xl text-slate-100 leading-snug tracking-wide">
          “El operador se funde absorbiendo la entropía con su cuerpo; el estratega se aísla en la teoría sin asumir riesgo;{' '}
          <span className="text-amber-400 underline decoration-amber-500/40 underline-offset-4">
            el comerciante catalizador compra opcionalidad en t₀
          </span>
          , aplica un pulso mínimo de activación y exporta la entropía disipativa del sistema capturando del valor que dejó de perderse.”
        </blockquote>

        <p className="text-sm text-slate-300 leading-relaxed max-w-4xl">
          En química, un <strong>catalizador</strong> acelera una reacción y reduce la energía de activación sin consumirse a sí mismo en el proceso.
          Como comerciante de valor en fricción, tú no compras la empresa en ruinas ni te vuelves su empleado (operador/bastón), ni cobras horas por emitir un reporte inerte (estratega).
          Compras el <strong>derecho temporal a destrabar la fricción</strong>, arriesgando únicamente una prima acotada en t₀ y participando en el 30%–50% del delta incremental neto recuperado (VR).
        </p>
      </div>

      {/* 2. Tríada de Posturas frente a la Entropía del Sistema */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Scale className="w-4 h-4 text-amber-400" />
              <span>01. Matriz de Rol Termodinámico: Operador vs. Estratega vs. Catalizador</span>
            </h2>
            <p className="text-xs text-slate-400">
              Selecciona una postura para ver cómo cambia la ecuación de horas, desgaste biológico (alostasis), negentropía lograda y retorno financiero sobre este activo.
            </p>
          </div>

          <div className="flex items-center gap-1 p-1 bg-slate-900 border border-slate-800 rounded-lg shrink-0">
            {(
              [
                { id: 'OPERADOR', label: 'Operador (Bastón)', badge: 'Riesgo Físico' },
                { id: 'ESTRATEGA', label: 'Estratega (Manual)', badge: 'Sin Skin' },
                { id: 'CATALIZADOR', label: 'Catalizador (Comerciante)', badge: 'Asimétrico' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setSelectedRole(tab.id)}
                className={`px-3 py-1.5 text-xs font-medium rounded transition-colors whitespace-nowrap cursor-pointer flex items-center gap-1.5 ${
                  selectedRole === tab.id
                    ? 'bg-amber-500 text-slate-950 font-semibold shadow-sm'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Comparativa Visual de las 3 Posturas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Tarjeta Operador */}
          <div
            onClick={() => setSelectedRole('OPERADOR')}
            className={`p-5 rounded-lg border cursor-pointer transition-all ${
              selectedRole === 'OPERADOR'
                ? 'bg-rose-950/20 border-rose-500 shadow-md ring-1 ring-rose-500/50'
                : 'bg-[#0F1420] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-tabular text-xs font-semibold text-rose-400">
                01. EL OPERADOR (EL BASTÓN)
              </span>
              <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-rose-500/10 text-rose-300 border border-rose-500/20">
                Absorbe la Entropía
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mt-2">
              Sostiene el techo con las manos
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Entra adentro de la trinchera. Vende horas físicas de su vida. Absorbe la varianza y el estrés del sistema con su cuerpo.
            </p>

            <div className="space-y-2 pt-4 mt-4 border-t border-slate-800/80 font-mono-tabular text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Carga Alostática:</span>
                <span className="text-rose-400 font-semibold">88 / 100 (Crítico)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horas Requeridas:</span>
                <span className="text-slate-200">{operatorImpact.hoursSpent}h trinchera</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Capturado:</span>
                <span className="text-slate-200">{formatCompactCurrency(operatorImpact.netFinancialValueCaptured, deal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Apalancamiento ($/h):</span>
                <span className="text-rose-300 font-semibold">{formatCurrency(operatorImpact.valuePerHourRatio, deal.currency)}/h</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Estratega */}
          <div
            onClick={() => setSelectedRole('ESTRATEGA')}
            className={`p-5 rounded-lg border cursor-pointer transition-all ${
              selectedRole === 'ESTRATEGA'
                ? 'bg-sky-950/20 border-sky-500 shadow-md ring-1 ring-sky-500/50'
                : 'bg-[#0F1420] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-tabular text-xs font-semibold text-sky-400">
                02. EL ESTRATEGA (EL MANUAL)
              </span>
              <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-sky-500/10 text-sky-300 border border-sky-500/20">
                Ignora la Fricción
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mt-2">
              Diagnóstico en torre de marfil
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              Entrega un informe o PowerPoint sin asumir riesgo. No tiene roce con el flete ni con el andén a las 02:00 AM. Cero skin in the game.
            </p>

            <div className="space-y-2 pt-4 mt-4 border-t border-slate-800/80 font-mono-tabular text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Carga Alostática:</span>
                <span className="text-sky-300 font-semibold">18 / 100 (Inerte)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horas Requeridas:</span>
                <span className="text-slate-200">{strategistImpact.hoursSpent}h teóricas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Capturado:</span>
                <span className="text-slate-200">{formatCompactCurrency(strategistImpact.netFinancialValueCaptured, deal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Apalancamiento ($/h):</span>
                <span className="text-sky-300 font-semibold">{formatCurrency(strategistImpact.valuePerHourRatio, deal.currency)}/h</span>
              </div>
            </div>
          </div>

          {/* Tarjeta Catalizador */}
          <div
            onClick={() => setSelectedRole('CATALIZADOR')}
            className={`p-5 rounded-lg border cursor-pointer transition-all ${
              selectedRole === 'CATALIZADOR'
                ? 'bg-amber-950/20 border-amber-500 shadow-md ring-1 ring-amber-500/50'
                : 'bg-[#0F1420] border-slate-800 hover:border-slate-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="font-mono-tabular text-xs font-semibold text-amber-400">
                03. EL CATALIZADOR (COMERCIANTE)
              </span>
              <span className="text-[10px] font-mono-tabular px-2 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20">
                Exporta la Entropía
              </span>
            </div>
            <h3 className="text-sm font-semibold text-slate-200 mt-2">
              Pulso t₀ & Captura de Opcionalidad
            </h3>
            <p className="text-xs text-slate-400 mt-1 leading-relaxed">
              No entra a vivir en el sistema. Compra la opción en t₀, aplica el pulso de desbloqueo (C_movimiento) y captura el 30%–50% del valor rescatado.
            </p>

            <div className="space-y-2 pt-4 mt-4 border-t border-slate-800/80 font-mono-tabular text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Carga Alostática:</span>
                <span className="text-emerald-400 font-semibold">22 / 100 (Protegido)</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Horas Requeridas:</span>
                <span className="text-slate-200">{catalystImpact.hoursSpent}h catalíticas</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Valor Capturado:</span>
                <span className="text-amber-400 font-semibold">{formatCompactCurrency(catalystImpact.netFinancialValueCaptured, deal.currency)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Apalancamiento ($/h):</span>
                <span className="text-amber-300 font-semibold">{formatCurrency(catalystImpact.valuePerHourRatio, deal.currency)}/h</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panel de Diagnóstico Detallado del Rol Seleccionado */}
        <div className="border border-slate-800 bg-[#0F1420] p-6 rounded-lg space-y-4">
          <div className="flex items-center justify-between border-b border-slate-800 pb-3">
            <div>
              <span className="text-xs font-mono-tabular text-amber-400">
                EVALUACIÓN DE IMPACTO TERMODINÁMICO · MODO ACTUAL: {selectedRole}
              </span>
              <h3 className="text-base font-semibold text-slate-100">
                Perfil de Rendimiento y Balance de Energía en {deal.title}
              </h3>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-400 block">Eficiencia de Disipación de Fricción</span>
              <span className="font-mono-tabular text-xl font-semibold text-emerald-400">
                {currentImpact.entropyDissipatedPercent}% Negentropía
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            <div className="space-y-3">
              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium">Asimetría de Riesgo (Downside vs. Upside):</div>
                <div className="text-slate-200 leading-relaxed">{currentImpact.downsideRisk}</div>
              </div>

              <div className="p-3 bg-slate-900 rounded border border-slate-800 space-y-1">
                <div className="text-slate-400 font-medium">Soberanía Sistémica / Dependencia:</div>
                <div className="text-slate-200 leading-relaxed">{currentImpact.systemicSovereignty}</div>
              </div>
            </div>

            <div className="space-y-3">
              {/* Barra de Carga Alostática (Hardware Humano) */}
              <div className="space-y-1.5 p-3 bg-slate-900 rounded border border-slate-800">
                <div className="flex justify-between text-slate-300">
                  <span>Carga Alostática / Desgaste Biológico:</span>
                  <span className="font-mono-tabular font-semibold">
                    {currentImpact.allostaticLoadScore} / 100
                  </span>
                </div>
                <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-800">
                  <div
                    style={{ width: `${currentImpact.allostaticLoadScore}%` }}
                    className={`h-full transition-all duration-300 ${
                      currentImpact.allostaticLoadScore > 70
                        ? 'bg-rose-500'
                        : currentImpact.allostaticLoadScore > 35
                        ? 'bg-amber-500'
                        : 'bg-emerald-500'
                    }`}
                  />
                </div>
                <p className="text-[11px] text-slate-400">
                  {currentImpact.allostaticLoadScore > 70
                    ? 'Peligro de Kernel Panic: El sistema utiliza tu sistema nervioso como condensador de choque.'
                    : 'Zona Segura: Operación mediada por IP, contrato y ventana finita t₀ → t.'}
                </p>
              </div>

              {/* Comparador de Retorno / Hora */}
              <div className="flex items-center justify-between p-3 bg-slate-900 rounded border border-slate-800 font-mono-tabular">
                <div>
                  <div className="text-slate-400">Apalancamiento de Valor por Hora:</div>
                  <div className="text-base font-semibold text-amber-300 mt-0.5">
                    {formatCurrency(currentImpact.valuePerHourRatio, deal.currency)} / hora invertida
                  </div>
                </div>
                {selectedRole !== 'CATALIZADOR' && (
                  <button
                    type="button"
                    onClick={() => setSelectedRole('CATALIZADOR')}
                    className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 rounded text-xs transition-colors cursor-pointer"
                  >
                    Activar Modo Catalizador
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. El Marco de Procesamiento: Correlaciones de Valor y Trabajo */}
      <div className="border border-slate-800 bg-[#0F1420] p-6 sm:p-8 rounded-lg space-y-6">
        <div className="border-b border-slate-800 pb-4">
          <div className="flex items-center gap-2 text-xs font-mono-tabular text-amber-400">
            <Cpu className="w-4 h-4 text-amber-400" />
            <span>EL MARCO DE PROCESAMIENTO · CORRELACIÓN DE TRABAJO Y VALOR</span>
          </div>
          <h2 className="text-base font-semibold text-slate-100 mt-1">
            02. La Secuencia Operativa Real: De la Disonancia al Desarme sin Herramientas
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Por qué el conocimiento empírico en contexto crudo supera al modelo académico estéril.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
          {[
            {
              step: '01',
              title: 'Disonancia como Entrada',
              desc: 'No arrancas por curiosidad neutra ni desde cero. Una alarma salta: algo no cuadra entre el discurso y la realidad.',
              badge: 'Gatillo Entrópico',
            },
            {
              step: '02',
              title: 'Herencia Ajena como Base',
              desc: 'Entras a mitad de flujo aprovechando lo que otros ya descubrieron. El plano es la versión oficial; el objeto es la realidad.',
              badge: 'Ahorro de Tiempo',
            },
            {
              step: '03',
              title: 'Desarme sin Herramientas',
              desc: 'Inventario funcional rápido: partes que se mueven, partes que se rompen, dependencias ocultas y restricciones reales.',
              badge: 'Cartografía Cruda',
            },
            {
              step: '04',
              title: 'Predicción de Falla',
              desc: '¿Dónde colapsa el sistema si nadie interviene? Aislamiento exacto de V_OTM(t) y del Valor en Riesgo (VAR).',
              badge: 'Auditoría de Límite',
            },
            {
              step: '05',
              title: 'Intervención Catalítica',
              desc: 'Intervenir sin romper el resto. Modificar reglas elementales con C_movimiento cerrado y capturar sobre el delta recuperado.',
              badge: 'Negentropía Neta',
            },
          ].map((item) => (
            <div
              key={item.step}
              className="p-4 bg-slate-900/80 border border-slate-800 rounded space-y-2 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono-tabular text-amber-400">
                  <span>ETAPA {item.step}</span>
                  <span className="text-[10px] text-slate-400">{item.badge}</span>
                </div>
                <h4 className="text-xs font-semibold text-slate-200 mt-1.5">{item.title}</h4>
                <p className="text-[11px] text-slate-400 leading-relaxed mt-1">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="p-4 bg-slate-950 border border-slate-800 rounded space-y-2 text-xs font-mono-tabular">
          <div className="text-slate-400 font-semibold">Correlación de Valor Formal:</div>
          <div className="text-slate-200 leading-relaxed font-sans">
            En el marco de procesamiento operativo, el valor <strong className="text-amber-300">NO correlaciona con las horas de sudor</strong> en la trinchera (W_operativo),
            sino con la <strong className="text-emerald-300">densidad de disonancia resuelta por unidad de tiempo</strong> mediante un pulso de opcionalidad (W_catalítico).
            Las 70,000 horas de historial del usuario no son costo hundido perdido: son la infraestructura cognitiva compilada que permite diagnosticar en 15 minutos lo que al sistema le toma meses ver.
          </div>
        </div>
      </div>

      {/* 4. Orquestador de Sub-Yo Productivos (Microservicios Cognitivos) */}
      <div className="border border-slate-800 bg-[#0F1420] p-6 sm:p-8 rounded-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono-tabular text-amber-400">
              <Brain className="w-4 h-4 text-amber-400" />
              <span>ORQUESTADOR KUBERNETES COGNITIVO · SUB-YO PRODUCTIVOS</span>
            </div>
            <h2 className="text-base font-semibold text-slate-100 mt-1">
              03. Cluster de Microservicios: Desarme de los 200 Sub-Estados en 7 Nodos Especializados
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">
              Ya no están todos los procesos encendidos a la vez causando saturación. Cada sub-yo se activa por mandato o se externaliza en IP.
            </p>
          </div>

          <div className="flex items-center gap-1.5 p-1 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            {(
              [
                { id: 'ALL', label: 'Todos (7)' },
                { id: 'ACTIVE_IN_DEAL', label: '🟢 Activos en Deal' },
                { id: 'EXTERNALIZED_IP', label: '⚡ Externalizados IP' },
                { id: 'STANDBY_ARCHIVE', label: '⏸ Archivo / Standby' },
              ] as const
            ).map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilterSubSelfStatus(tab.id)}
                className={`px-2.5 py-1 rounded transition-colors whitespace-nowrap cursor-pointer ${
                  filterSubSelfStatus === tab.id
                    ? 'bg-slate-800 text-white font-medium'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredSubSelves.map((self) => (
            <div
              key={self.id}
              className="p-5 bg-slate-900/90 border border-slate-800 rounded-lg space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-sm font-semibold text-slate-100">{self.name}</h4>
                    <span className="text-[11px] font-mono-tabular text-amber-400 block mt-0.5">
                      {self.archetypeRole}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => toggleSubSelfStatus(self.id)}
                    className={`px-2.5 py-1 text-[11px] font-mono-tabular rounded border cursor-pointer whitespace-nowrap transition-colors ${
                      self.status === 'ACTIVE_IN_DEAL'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/40'
                        : self.status === 'EXTERNALIZED_IP'
                        ? 'bg-amber-500/15 text-amber-300 border-amber-500/40'
                        : 'bg-slate-800 text-slate-400 border-slate-700'
                    }`}
                    title="Alternar estado: Activo -> Externalizado en IP -> Archivo"
                  >
                    {self.status === 'ACTIVE_IN_DEAL' && '🟢 Activo en Deal'}
                    {self.status === 'EXTERNALIZED_IP' && '⚡ En IP Externa'}
                    {self.status === 'STANDBY_ARCHIVE' && '⏸ En Archivo'}
                  </button>
                </div>

                <div className="space-y-1.5 text-xs text-slate-300 pt-1">
                  <div>
                    <strong className="text-slate-400">Entorno Operativo:</strong>{' '}
                    <span>{self.operatingEnvironment}</span>
                  </div>
                  <div>
                    <strong className="text-slate-400">Herramienta Táctica:</strong>{' '}
                    <span>{self.specializedTool}</span>
                  </div>
                  <div>
                    <strong className="text-amber-400">Gatillo de Disonancia:</strong>{' '}
                    <span className="text-slate-200">{self.dissonanceTrigger}</span>
                  </div>
                  <div>
                    <strong className="text-emerald-400">Vector de Negentropía:</strong>{' '}
                    <span className="text-slate-200">{self.entropyReductionVector}</span>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono-tabular">
                <span className="text-slate-400">
                  Riesgo Alostático:{' '}
                  <span
                    className={
                      self.biologicalCostRisk === 'HIGH_ALOSTATIC'
                        ? 'text-rose-400 font-semibold'
                        : self.biologicalCostRisk === 'MODERATE'
                        ? 'text-amber-300'
                        : 'text-emerald-400'
                    }
                  >
                    {self.biologicalCostRisk}
                  </span>
                </span>
                <span className="text-slate-300">{self.valueContributionFormula}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 5. Conexión con el Term Sheet y la Ejecución */}
      <div className="border border-slate-800 bg-[#111726] p-6 rounded-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <div className="text-xs text-amber-400 font-mono-tabular">
            DEL ANÁLISIS DE ENTROPÍA A LA TRANSACCIÓN EN CAMPO
          </div>
          <h3 className="text-base font-semibold text-slate-100">
            ¿Listo para protocolizar este activo como Catalizador con el Decisor?
          </h3>
          <p className="text-xs text-slate-400">
            El Term Sheet formaliza la prima de opción en t₀, el umbral de activación y la partición del 30%–50% sobre el VR neto.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => onNavigateTab('termsheet')}
            className="px-4 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-semibold text-xs rounded transition-colors whitespace-nowrap flex items-center gap-2 cursor-pointer"
          >
            <span>Ver Term Sheet de Opcionalidad</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
