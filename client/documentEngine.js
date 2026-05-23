/**
 * ============================================================================
 * INVOICE + WORK ORDER ENGINE (DETERMINISTIC + RECONCILED)
 * ============================================================================
 */

/**
 * Creates a fully balanced Invoice from an estimate.
 * Guarantees line-item totals ALWAYS equal financial subtotal.
 */
export function createInvoiceFromEstimate(
  estimate,
  meta = {},
  markupStrategy = 'PRO_RATA'
) {
  const taxRate = typeof meta.taxRate === 'number' ? meta.taxRate : 0.0825;

  const directSubtotal = Number(estimate.totals.direct) || 0;
  const grandSubtotal = Number(estimate.totals.grand) || 0;

  const items = Array.isArray(estimate.items) ? estimate.items : [];
  let lineItems = [];

  /**
   * ============================================================
   * STRATEGY A — PRO-RATA (fully reconciled unit-cost system)
   * ============================================================
   */
  if (markupStrategy === 'PRO_RATA' && directSubtotal > 0) {
    const markupFactor = grandSubtotal / directSubtotal;
    let runningTotal = 0;

    // Identify the last non-zero line item to serve as our safe rounding anchor
    const lastNonZeroIndex = items.reduce((acc, item, idx) => {
      return (Number(item.subtotalCents) || 0) > 0 ? idx : acc;
    }, -1);

    lineItems = items.map((item, idx) => {
      const base = Number(item.subtotalCents) || 0;
      let allocated = 0;

      if (base > 0) {
        allocated = Math.round(base * markupFactor);
        
        // Push mathematical rounding variances strictly onto the final physical cost row
        if (idx === lastNonZeroIndex) {
          allocated = grandSubtotal - runningTotal;
        }
        
        runningTotal += allocated;
      }

      return {
        code: item.code,
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        amountCents: allocated, // Safe from phantom penny inflation
        mode: 'BURDENED'
      };
    });

  /**
   * ============================================================
   * STRATEGY B — EXPLICIT LEDGER (clean audit trail model)
   * ============================================================
   */
  } else {
    lineItems = items.map((item) => ({
      code: item.code,
      name: item.name,
      quantity: item.quantity,
      unit: item.unit,
      amountCents: Number(item.subtotalCents) || 0,
      mode: 'RAW'
    }));

    // Explicit balancing rows ensure reconciliation
    if ((estimate.totals.overheadCents || 0) > 0) {
      lineItems.push({
        code: 'MARKUP-OVHD',
        name: 'Overhead Allocation',
        quantity: 1,
        unit: 'ea',
        amountCents: estimate.totals.overheadCents,
        mode: 'MARKUP'
      });
    }

    if ((estimate.totals.profitCents || 0) > 0) {
      lineItems.push({
        code: 'MARKUP-PROFIT',
        name: 'Profit Margin Allocation',
        quantity: 1,
        unit: 'ea',
        amountCents: estimate.totals.profitCents,
        mode: 'MARKUP'
      });
    }
  }

  const tax = Math.round(grandSubtotal * taxRate);
  const total = grandSubtotal + tax;

  return {
    id: meta.invoiceId ?? null,
    type: "INVOICE",
    status: meta.status ?? "DRAFT",

    createdAt: meta.createdAt ?? null,
    updatedAt: meta.updatedAt ?? new Date().toISOString(),

    clientId: meta.clientId ?? null,
    companyId: meta.companyId ?? null,
    estimateId: meta.estimateId ?? null,

    lineItems,

    financials: {
      directSubtotal,
      overheadApplied: estimate.totals.overheadCents || 0,
      profitApplied: estimate.totals.profitCents || 0,
      subtotal: grandSubtotal,
      tax,
      total
    }
  };
}

/**
 * ============================================================================
 * WORK ORDER ENGINE
 * ============================================================================
 */
export function createWorkOrderFromEstimate(estimate, meta = {}) {
  const items = Array.isArray(estimate.items) ? estimate.items : [];

  return {
    id: meta.workOrderId ?? null,
    type: "WORK_ORDER",
    status: meta.status ?? "SCHEDULED",
    priority: meta.priority ?? "NORMAL",

    createdAt: meta.createdAt ?? null,
    scheduledDate: meta.scheduledDate ?? null,

    companyId: meta.companyId ?? null,
    estimateId: meta.estimateId ?? null,

    tasks: items.map((item) => ({
      code: item.code,
      task: item.name,
      quantity: Number(item.quantity) || 0,
      unit: item.unit,
      estimatedHours: Number(item.laborHours?.toFixed?.(2)) || 0,
      crew: meta.defaultCrew ?? "UNASSIGNED"
    })),

    totals: {
      estimatedHours: Number(estimate.totals.hours?.toFixed?.(2)) || 0
    }
  };
}
