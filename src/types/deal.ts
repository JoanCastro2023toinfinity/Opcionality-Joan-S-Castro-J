export type ProtocolState = 'INTERVENE' | 'HOLD' | 'NO_INTERVENGO';

export type ContextEnvironment = 'CORABASTOS_2AM' | 'WAR_ROOM_5AM';

export interface IPChecklistItem {
  id: string;
  stage: 'Friction' | 'Divergence' | 'Cartography' | 'Intervention' | 'Recovery';
  moduleName: string;
  description: string;
  verified: boolean;
  notes: string;
}

export interface FrictionDeal {
  id: string;
  code: string;
  title: string;
  counterpartyRole: string;
  environmentTag: string;
  timeContext: string;
  currency: 'USD' | 'COP';
  unitLabel: string; // e.g. "100 bultos de papa pastusa" or "Capacidad organizacional + Pipeline Q4"
  
  // 9-Layer Universal Architecture
  nodeADescription: string; // ¿Qué activo tiene valor pero está atrapado?
  currentFrictionDescription: string; // ¿Cuánto valor está perdiendo por la estructura actual?
  frictionVectors: string[]; // e.g., ["precio", "tiempo", "transporte", "información", "comprador", "almacenamiento"]
  interventionArchitecture: string; // ¿Qué arquitectura permite movilizar nuevamente el valor?
  
  // Financial Trajectory Values
  vATM: number; // Valor original / potencial (ATM)
  vOTM: number; // Valor esperado en t sin intervención (OTM)
  vITM: number; // Valor esperado en t después de la intervención (ITM)
  cMovement: number; // Costos reales de movimiento / desbloqueo (C)
  
  // Capture Share
  jscjSharePercent: number; // 30% to 50% (default 40%)
  
  // Option Contract Parameters (t0 -> t)
  optionPremium: number; // Prima en t0 para reservar el derecho de intervenir
  timeWindowLabel: string; // e.g. "3 horas (02:00 AM - 05:00 AM)" o "14 días hábiles"
  activationCondition: string; // Condición de activación (deterioro >= X o confirmación de ruta)
  infrastructureIntact: boolean; // ¿Existe todavía estructura mínima de recuperación?
  protocolCertainty: 'HIGH' | 'UNCERTAIN' | 'DEAD'; // Determina INTERVENE vs HOLD vs NO INTERVENGO junto con la matemática

  // IP Stack Diagnostics
  ipChecklist: IPChecklistItem[];

  // Metadata
  updatedAt: string;
  signedByCounterparty?: string;
  signedAt?: string;
}

export interface CalculatedMetrics {
  varValue: number; // Valor en Riesgo (VAR) = V_ATM - V_OTM
  vrValue: number; // Valor Incremental Recuperado (VR) = V_ITM - V_OTM - C_movimiento
  recoveryRatio: number; // RR = VR / VAR (0 to 1+)
  breakevenITM: number; // V_OTM + C_movimiento
  isMathematicallyViable: boolean; // V_ITM > V_OTM + C
  jscjProfit: number; // VR * (jscjSharePercent / 100)
  jscjProfitMin30: number; // VR * 0.30
  jscjProfitMid40: number; // VR * 0.40
  jscjProfitMax50: number; // VR * 0.50
  clientRetainedValue: number; // VR * (1 - jscjSharePercent / 100)
  clientTotalEndValue: number; // V_OTM + clientRetainedValue
  maxDownsideJSCJ: number; // -Prima (si no se activa) o -(Prima + C_movimiento)
  asymmetryMultiple: number; // jscjProfit / optionPremium
  recommendedState: ProtocolState;
  stateReason: string;
}

export type ThermodynamicRole = 'OPERADOR' | 'ESTRATEGA' | 'CATALIZADOR';

export interface CognitiveSubSelf {
  id: string;
  name: string;
  archetypeRole: string;
  operatingEnvironment: string;
  specializedTool: string;
  dissonanceTrigger: string;
  entropyReductionVector: string;
  status: 'ACTIVE_IN_DEAL' | 'STANDBY_ARCHIVE' | 'EXTERNALIZED_IP';
  biologicalCostRisk: 'HIGH_ALOSTATIC' | 'MODERATE' | 'SAFE_EXTERNALIZED';
  valueContributionFormula: string;
}

export interface EntropySimulationResult {
  role: ThermodynamicRole;
  hoursSpent: number;
  allostaticLoadScore: number; // 0 - 100 (desgaste biológico)
  entropyDissipatedPercent: number; // 0 - 100% de reducción de fricción en el sistema
  netFinancialValueCaptured: number;
  valuePerHourRatio: number; // $/hora
  downsideRisk: string;
  systemicSovereignty: string;
}

