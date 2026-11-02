import { CalculatedMetrics, FrictionDeal, ProtocolState } from '../types/deal';

export function computeDealMetrics(deal: FrictionDeal): CalculatedMetrics {
  const {
    vATM,
    vOTM,
    vITM,
    cMovement,
    jscjSharePercent,
    optionPremium,
    infrastructureIntact,
    protocolCertainty,
  } = deal;

  // Valor en Riesgo: VAR = V_ATM - V_OTM
  const varValue = Math.max(0, vATM - vOTM);

  // Punto de equilibrio ITM: V_OTM + C_movimiento
  const breakevenITM = vOTM + cMovement;

  // Condición previa: V_ITM > V_OTM + C_movimiento
  const isMathematicallyViable = vITM > breakevenITM;

  // Valor Incremental Recuperado: VR = V_ITM - V_OTM - C_movimiento
  const rawVR = vITM - vOTM - cMovement;
  const vrValue = rawVR;

  // Ratio de Recuperación: RR = (V_ITM - V_OTM - C) / (V_ATM - V_OTM)
  const recoveryRatio = varValue > 0 ? vrValue / varValue : 0;

  // Remuneración JSCJ y Retención del Cliente (solo sobre valor incremental positivo)
  const positiveVR = Math.max(0, vrValue);
  const shareDecimal = jscjSharePercent / 100;

  const jscjProfit = positiveVR * shareDecimal;
  const jscjProfitMin30 = positiveVR * 0.30;
  const jscjProfitMid40 = positiveVR * 0.40;
  const jscjProfitMax50 = positiveVR * 0.50;

  const clientRetainedValue = positiveVR * (1 - shareDecimal);
  const clientTotalEndValue = vOTM + clientRetainedValue;

  const maxDownsideJSCJ = optionPremium;
  const asymmetryMultiple = optionPremium > 0 ? jscjProfit / optionPremium : 0;

  // Determinación del Estado del Protocolo (🟢 INTERVENE / 🟡 OPCIÓN / HOLD / 🔴 NO INTERVENGO)
  let recommendedState: ProtocolState = 'INTERVENE';
  let stateReason = '';

  if (!infrastructureIntact || protocolCertainty === 'DEAD') {
    recommendedState = 'NO_INTERVENGO';
    stateReason =
      'El protocolo está muerto: la infraestructura mínima de recuperación desapareció. No se rescata un sistema cuya estructura para movilizar el activo ya no existe.';
  } else if (!isMathematicallyViable) {
    recommendedState = 'NO_INTERVENGO';
    stateReason = `Inviable matemáticamente: V_ITM (${formatCurrency(vITM, deal.currency)}) no supera V_OTM + C_movimiento (${formatCurrency(breakevenITM, deal.currency)}). El costo de desbloqueo absorbe el diferencial.`;
  } else if (protocolCertainty === 'UNCERTAIN' || recoveryRatio < 0.12) {
    recommendedState = 'HOLD';
    stateReason =
      'Existe incertidumbre sobre la reconstrucción o el margen es estrecho. No consumas capital operativo todavía: compra opcionalidad mediante Prima acotada y espera condición de activación.';
  } else {
    recommendedState = 'INTERVENE';
    stateReason =
      'Estructura mínima reactivable verificada y V_ITM > V_OTM + C_movimiento. Trayectoria clara de recuperación con asimetría positiva.';
  }

  return {
    varValue,
    vrValue,
    recoveryRatio,
    breakevenITM,
    isMathematicallyViable,
    jscjProfit,
    jscjProfitMin30,
    jscjProfitMid40,
    jscjProfitMax50,
    clientRetainedValue,
    clientTotalEndValue,
    maxDownsideJSCJ,
    asymmetryMultiple,
    recommendedState,
    stateReason,
  };
}

export function formatCurrency(amount: number, currency: 'USD' | 'COP' = 'USD'): string {
  const absAmount = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';

  if (currency === 'COP') {
    return `${sign}$${Math.round(absAmount).toLocaleString('es-CO')} COP`;
  }

  return `${sign}$${Math.round(absAmount).toLocaleString('en-US')}`;
}

export function formatCompactCurrency(amount: number, currency: 'USD' | 'COP' = 'USD'): string {
  const abs = Math.abs(amount);
  const sign = amount < 0 ? '-' : '';
  const suffix = currency === 'COP' ? ' COP' : '';

  if (abs >= 1_000_000_000) {
    return `${sign}$${(abs / 1_000_000_000).toFixed(2)}B${suffix}`;
  }
  if (abs >= 1_000_000) {
    return `${sign}$${(abs / 1_000_000).toFixed(2)}M${suffix}`;
  }
  if (abs >= 10_000) {
    return `${sign}$${(abs / 1_000).toFixed(1)}k${suffix}`;
  }
  return formatCurrency(amount, currency);
}

export function formatPercent(ratio: number, decimals = 1): string {
  return `${(ratio * 100).toFixed(decimals)}%`;
}
