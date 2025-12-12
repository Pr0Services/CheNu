// ============================================
// CHE·NU — INTENT VS CONSEQUENCE VIEW
// ============================================
// Le système ne juge jamais l'intention.
// Le système ne classifie jamais une action comme bonne ou mauvaise.
// Le système ne recommande jamais une correction morale.
// Toute réflexion est volontaire.
// Silence désactive toute réflexion.
// ============================================

import { useSilence } from "../../hooks/useSilence";
import {
  IntentConsequenceComparison,
  ConsequenceObservation,
  ImpactDomain,
} from "../../types/preApprovedTask";
import { formatObservation } from "../../ethics/consequenceObserver";

type IntentConsequenceViewProps = {
  comparison: IntentConsequenceComparison | null;
  onClose?: () => void;
};

/**
 * INTENT VS CONSEQUENCE VIEW
 *
 * Affiche côte à côte:
 * - Ce que l'utilisateur a déclaré vouloir faire (Intent)
 * - Ce qui a factuellement changé (Observed Outcomes)
 *
 * RÈGLES:
 * - Aucune conclusion automatique
 * - Aucun score
 * - Aucune évaluation
 * - Langage strictement FACTUEL
 */
export function IntentConsequenceView({
  comparison,
  onClose,
}: IntentConsequenceViewProps) {
  const { silence } = useSilence();

  // Silence désactive toute réflexion
  if (silence.enabled) {
    return (
      <div style={{ padding: "16px", color: "#888", fontSize: "13px" }}>
        🔕 Mode silence actif — réflexion désactivée.
      </div>
    );
  }

  if (!comparison) {
    return (
      <div style={{ padding: "16px", color: "#888", fontSize: "13px" }}>
        Aucune comparaison disponible.
      </div>
    );
  }

  return (
    <div
      style={{
        padding: "20px",
        background: "#fff",
        border: "1px solid #e0e0e0",
        borderRadius: "8px",
      }}
    >
      {/* Header */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "16px",
          paddingBottom: "12px",
          borderBottom: "1px solid #eee",
        }}
      >
        <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 500 }}>
          🪞 Intention vs Conséquences observées
        </h3>
        {onClose && (
          <button
            onClick={onClose}
            style={{
              padding: "4px 8px",
              background: "transparent",
              border: "none",
              cursor: "pointer",
              fontSize: "16px",
              color: "#888",
            }}
          >
            ✕
          </button>
        )}
      </div>

      {/* Two-column comparison */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: "20px",
        }}
      >
        {/* LEFT: Intent */}
        <div>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: 500,
              color: "#5c6bc0",
            }}
          >
            📝 Intention déclarée
          </h4>
          <div
            style={{
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            {comparison.declaredIntent || (
              <span style={{ color: "#999", fontStyle: "italic" }}>
                Aucune intention déclarée
              </span>
            )}
          </div>
          <p
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "#888",
            }}
          >
            Ce que vous avez indiqué vouloir faire.
          </p>
        </div>

        {/* RIGHT: Observed Outcomes */}
        <div>
          <h4
            style={{
              margin: "0 0 12px 0",
              fontSize: "14px",
              fontWeight: 500,
              color: "#7cb342",
            }}
          >
            👁️ Conséquences observées
          </h4>
          <div
            style={{
              padding: "12px",
              background: "#f5f5f5",
              borderRadius: "6px",
              fontSize: "13px",
            }}
          >
            {comparison.observedConsequences.length > 0 ? (
              <ul style={{ margin: 0, paddingLeft: "16px" }}>
                {comparison.observedConsequences.map((obs) => (
                  <ObservationItem key={obs.id} observation={obs} />
                ))}
              </ul>
            ) : (
              <span style={{ color: "#999", fontStyle: "italic" }}>
                Aucune conséquence observable
              </span>
            )}
          </div>
          <p
            style={{
              marginTop: "8px",
              fontSize: "11px",
              color: "#888",
            }}
          >
            Ce qui a factuellement changé dans le système.
          </p>
        </div>
      </div>

      {/* Important notice */}
      <div
        style={{
          marginTop: "20px",
          paddingTop: "12px",
          borderTop: "1px solid #eee",
        }}
      >
        <p
          style={{
            margin: 0,
            fontSize: "11px",
            color: "#888",
            fontStyle: "italic",
            textAlign: "center",
          }}
        >
          Cette vue est informative. Le système n'émet aucun jugement.
          La responsabilité et l'interprétation restent entièrement humaines.
        </p>
      </div>
    </div>
  );
}

/**
 * Single observation item
 */
function ObservationItem({ observation }: { observation: ConsequenceObservation }) {
  return (
    <li style={{ marginBottom: "8px", lineHeight: 1.4 }}>
      <span>{observation.description}</span>
      {observation.affectedDomains.length > 0 && (
        <div style={{ marginTop: "4px" }}>
          {observation.affectedDomains.map((domain) => (
            <DomainBadge key={domain} domain={domain} />
          ))}
        </div>
      )}
    </li>
  );
}

/**
 * Domain badge
 */
function DomainBadge({ domain }: { domain: ImpactDomain }) {
  const colors: Record<ImpactDomain, { bg: string; text: string }> = {
    personal: { bg: "#e3f2fd", text: "#1565c0" },
    collective: { bg: "#fff3e0", text: "#e65100" },
    institutional: { bg: "#f3e5f5", text: "#7b1fa2" },
    public: { bg: "#ffebee", text: "#c62828" },
    unknown: { bg: "#f5f5f5", text: "#666" },
  };

  const c = colors[domain];

  return (
    <span
      style={{
        display: "inline-block",
        padding: "2px 6px",
        marginRight: "4px",
        background: c.bg,
        color: c.text,
        borderRadius: "4px",
        fontSize: "10px",
        fontWeight: 500,
      }}
    >
      {domain}
    </span>
  );
}

/**
 * Compact summary for inline use
 */
export function IntentConsequenceSummary({
  comparison,
}: {
  comparison: IntentConsequenceComparison | null;
}) {
  if (!comparison) {
    return null;
  }

  const consequenceCount = comparison.observedConsequences.length;

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "8px",
        padding: "4px 8px",
        background: "#f5f5f5",
        borderRadius: "4px",
        fontSize: "11px",
        color: "#666",
      }}
    >
      <span>📝 Intention déclarée</span>
      <span>→</span>
      <span>👁️ {consequenceCount} conséquence(s) observée(s)</span>
    </div>
  );
}
