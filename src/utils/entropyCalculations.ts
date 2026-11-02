import {
  CognitiveSubSelf,
  EntropySimulationResult,
  FrictionDeal,
  CalculatedMetrics,
  ThermodynamicRole,
} from '../types/deal';

export const COGNITIVE_SUB_SELVES_CATALOG: CognitiveSubSelf[] = [
  {
    id: 'subself-trader',
    name: 'Trader de Asimetría & Volatilidad',
    archetypeRole: 'Trader de Opciones / Gestor de Payoff Asimétrico',
    operatingEnvironment: 'Mercados de alta fricción, cripto, índices de miedo (VIX), FX y commodities',
    specializedTool: 'Desarme de setup en entrada/salida/riesgo, convexidad y ratio riesgo/beneficio',
    dissonanceTrigger: 'El precio o cotización oficial no cuadra con el flujo real de órdenes o liquidez',
    entropyReductionVector: 'Fija el strike (V_OTM + C), acota el downside a −Prima y captura el upside exponencial',
    status: 'ACTIVE_IN_DEAL',
    biologicalCostRisk: 'MODERATE',
    valueContributionFormula: 'Downside Máximo = −Prima | Upside = VR × (30%–50%)',
  },
  {
    id: 'subself-context',
    name: 'Analista de Contexto & Jerarquías Ocultas',
    archetypeRole: 'Cartógrafo de Redes & Poder Descentralizado',
    operatingEnvironment: 'Plazas de mercado (Corabastos), pasillos de comités (War Room), comunidades y juntas',
    specializedTool: 'Mapeo de dependencias tácitas: quién teme a quién, quién depende de qué, deudas morales',
    dissonanceTrigger: 'El relato oficial o jerarquía nominal no coincide con la conducta real de los actores',
    entropyReductionVector: 'Disuelve la niebla relacional; localiza al decisor de firma inmediata sin pedir permiso',
    status: 'ACTIVE_IN_DEAL',
    biologicalCostRisk: 'MODERATE',
    valueContributionFormula: 'Reduce el tiempo de negociación t₀ en un 60%–80%',
  },
  {
    id: 'subself-stresstester',
    name: 'Stress Tester Sistémico (Filtro HOLD)',
    archetypeRole: 'Auditor de Límites & Protocolos Vivos/Muertos',
    operatingEnvironment: 'Sistemas en deterioro rápido, activos varados, plantas paradas, contratos en crisis',
    specializedTool: 'Prueba controlada de límites e inventario funcional rápido (partes que se mueven vs que se rompen)',
    dissonanceTrigger: 'La explicación heredada o manual de usuario no resiste la prueba de esfuerzo en caliente',
    entropyReductionVector: 'Previene quemar capital operativo; activa HOLD o 🔴 NO INTERVENGO si el sistema colapsó',
    status: 'ACTIVE_IN_DEAL',
    biologicalCostRisk: 'SAFE_EXTERNALIZED',
    valueContributionFormula: 'Ahorro del 100% de C_movimiento ante protocolos muertos ($0 invertido)',
  },
  {
    id: 'subself-gemba',
    name: 'Operador Gemba / Last-Mile Reconstruction',
    archetypeRole: 'El Guerrero de Terreno / Ejecutor de Última Milla',
    operatingEnvironment: 'Andén de carga 02:00 AM, rampa de aeropuerto, carretera, bodega, deal desk de cierre',
    specializedTool: 'Reconfiguración táctica de fletes, logística express, permisos inmediatos y compradores de contado',
    dissonanceTrigger: 'El producto o activo está listo pero está varado a 20 km del comprador por traba burocrática',
    entropyReductionVector: 'Ejecuta el gasto cerrado C_movimiento en ventana crítica antes de que expire la perecibilidad',
    status: 'ACTIVE_IN_DEAL',
    biologicalCostRisk: 'HIGH_ALOSTATIC',
    valueContributionFormula: 'Transforma V_OTM degradado en V_ITM recuperado en tiempo récord',
  },
  {
    id: 'subself-architect',
    name: 'Propositor de IP Fractal (Orquestador Kubernetes)',
    archetypeRole: 'Arquitecto Ontológico & Creador de Activos Negentrópicos',
    operatingEnvironment: 'Diseño de modelos de negocio, contratos de opcionalidad, frameworks transferibles',
    specializedTool: 'Externalización de amortiguación en activos abstractos; orquestación de sub-agentes sin fricción',
    dissonanceTrigger: 'El cuerpo biológico se sobrecarga por absorber varianza ajena en lugar de gobernar por contrato',
    entropyReductionVector: 'Convierte 70,000h de costo hundido en propiedad intelectual que genera valor sin quemar el chasis',
    status: 'EXTERNALIZED_IP',
    biologicalCostRisk: 'SAFE_EXTERNALIZED',
    valueContributionFormula: 'Multiplicador fractal: permite transaccionar en N nodos simultáneos sin desgaste físico',
  },
  {
    id: 'subself-radar',
    name: 'Radar Infantil de Entropía & Disonancia',
    archetypeRole: 'Sensor de Alerta Temprana de Alta Sensibilidad',
    operatingEnvironment: 'Detección en tiempo cero de anomalías invisibles para el observador promedio',
    specializedTool: 'Sensibilidad a la discordancia acústica/conductual/operativa del entorno',
    dissonanceTrigger: 'Micro-rupturas de coherencia interna o señales de colapso inminente en el sistema',
    entropyReductionVector: 'Gatilla la búsqueda de oportunidad cuando el mercado aún cree que todo está en calma',
    status: 'STANDBY_ARCHIVE',
    biologicalCostRisk: 'SAFE_EXTERNALIZED',
    valueContributionFormula: 'Detecta el Valor en Riesgo (VAR) antes de que la caída sea de dominio público',
  },
  {
    id: 'subself-sage',
    name: 'Viejito Sabio & Guardián de Dignidad',
    archetypeRole: 'Garante del Capitalismo Consciente & Anti-Extracción',
    operatingEnvironment: 'Negociaciones de alto impacto humano, cierre de contratos de opcionalidad ética',
    specializedTool: 'Alineación de incentivos donde el propietario del activo conserva la mayoría del valor (50%–70%)',
    dissonanceTrigger: 'Propuestas comerciales predatorias que buscan quebrar al propietario vulnerable para quedarse con el activo',
    entropyReductionVector: 'Sustituye la relación extractiva por una alianza asimétrica de protección mutua',
    status: 'ACTIVE_IN_DEAL',
    biologicalCostRisk: 'SAFE_EXTERNALIZED',
    valueContributionFormula: 'Genera confianza instantánea: "No te cobro horas, compartimos lo que dejaste de perder"',
  },
];

export function calculateThermodynamicRoleImpact(
  deal: FrictionDeal,
  metrics: CalculatedMetrics,
  role: ThermodynamicRole
): EntropySimulationResult {
  const isViable = metrics.vrValue > 0 && metrics.recommendedState !== 'NO_INTERVENGO';
  const grossVR = Math.max(0, metrics.vrValue);

  if (role === 'OPERADOR') {
    // El Operador entra adentro del sistema, absorbe la entropía con su cuerpo.
    // Trabaja cientos de horas en la trinchera para intentar salvar todo manualmente.
    const estimatedHours = deal.vATM > 1_000_000 ? 180 : 38; // Horas dedicadas a empujar el carro
    const allostaticLoad = 88; // Altísimo costo biológico (amortiguador físico)
    const entropyDissipated = isViable ? 42 : 12; // Menor eficiencia porque el sistema sigue siendo disipativo
    // El operador cobra un salario / tarifa estándar por hora o porcentaje precario
    const captured = Math.min(grossVR * 0.15, estimatedHours * (deal.currency === 'COP' ? 65000 : 85));
    const ratio = estimatedHours > 0 ? captured / estimatedHours : 0;

    return {
      role: 'OPERADOR',
      hoursSpent: estimatedHours,
      allostaticLoadScore: allostaticLoad,
      entropyDissipatedPercent: entropyDissipated,
      netFinancialValueCaptured: captured,
      valuePerHourRatio: ratio,
      downsideRisk: 'ASIMETRÍA NEGATIVA: Quema salud y tiempo. Si el sistema colapsa, el operador absorbe la culpa y el daño físico.',
      systemicSovereignty: 'ESCLAVO DEL SISTEMA: El sistema depende crónicamente del bastón. Si el operador descansa, el activo vuelve a caer.',
    };
  }

  if (role === 'ESTRATEGA') {
    // El Estratega se queda afuera en el plano teórico. Produce un informe o diagnóstico.
    const estimatedHours = deal.vATM > 1_000_000 ? 60 : 15;
    const allostaticLoad = 18; // Desgaste biológico bajo (sin roce con la trinchera)
    const entropyDissipated = 15; // Muy baja disipación real: el informe queda en un cajón si nadie destraba la última milla
    // Cobra honorarios fijos de consultoría
    const captured = deal.vATM > 1_000_000 ? (deal.currency === 'COP' ? 18000000 : 7500) : (deal.currency === 'COP' ? 3500000 : 1200);
    const ratio = estimatedHours > 0 ? captured / estimatedHours : 0;

    return {
      role: 'ESTRATEGA',
      hoursSpent: estimatedHours,
      allostaticLoadScore: allostaticLoad,
      entropyDissipatedPercent: entropyDissipated,
      netFinancialValueCaptured: captured,
      valuePerHourRatio: ratio,
      downsideRisk: 'CERO SKIN IN THE GAME: Cobra gane o pierda el cliente, pero genera desconfianza y fricción por latencia teórica.',
      systemicSovereignty: 'DESCONEXIÓN: No tiene control sobre la ejecución ni participa en el verdadero valor recuperado.',
    };
  }

  // CATALIZADOR (Comerciante de Opcionalidad / Deal Architect)
  // Aplica un pulso de activación en t0 (Prima) y abre la compuerta de última milla con C_movimiento.
  const estimatedHours = deal.vATM > 1_000_000 ? 12 : 3.5; // Tiempo enfocado exclusivamente en cartografía y activación
  const allostaticLoad = 22; // Controlado: opera vía IP externa y reglas estrictas de salida
  const entropyDissipated = isViable ? 85 : 95; // Máxima negentropía: destraba el flujo y exporta la fricción
  const captured = isViable ? metrics.jscjProfit : 0;
  const ratio = estimatedHours > 0 ? captured / estimatedHours : 0;

  return {
    role: 'CATALIZADOR',
    hoursSpent: estimatedHours,
    allostaticLoadScore: allostaticLoad,
    entropyDissipatedPercent: entropyDissipated,
    netFinancialValueCaptured: captured,
    valuePerHourRatio: ratio,
    downsideRisk: `ESTRICTAMENTE ACOTADO A −PRIMA (${deal.currency === 'COP' ? '$' + Math.round(deal.optionPremium).toLocaleString('es-CO') + ' COP' : '$' + Math.round(deal.optionPremium).toLocaleString('en-US')}). Cero pasivo del activo.`,
    systemicSovereignty: 'SOBERANÍA ASIMÉTRICA: Participa en el 30%–50% del delta sin convertirse en operador permanente ni asumir pasivos.',
  };
}
