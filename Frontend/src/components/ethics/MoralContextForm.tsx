// ============================================
// CHE·NU — MORAL CONTEXT FORM (OPTIONNEL)
// ============================================
// Le système ne juge jamais l'intention.
// Le système ne classifie jamais une action comme bonne ou mauvaise.
// Le système ne recommande jamais une correction morale.
// Toute réflexion est volontaire.
// Silence désactive toute réflexion.
// ============================================

import { useState } from "react";
import { MoralContext, ImpactDomain } from "../../types/preApprovedTask";
import { useSilence } from "../../hooks/useSilence";

type MoralContextFormProps = {
  initialContext?: MoralContext;
  onSave: (context: MoralContext | undefined) => void;
  onCancel: () => void;
};

const IMPACT_DOMAINS: { value: ImpactDomain; label: string }[] = [
  { value: "personal", label: "Personnel" },
  { value: "collective", label: "Collectif" },
  { value: "institutional", label: "Institutionnel" },
  { value: "public", label: "Public" },
  { value: "unknown", label: "Inconnu" },
];

const COMMON_VALUES = [
  "transparence",
  "non-manipulation",
  "respect de la vie privée",
  "consentement éclairé",
  "équité",
  "réversibilité",
];

/**
 * MORAL CONTEXT FORM
 *
 * Permet à l'utilisateur de déclarer OPTIONNELLEMENT:
 * - Son intention
 * - Les risques qu'il reconnaît
 * - Les domaines potentiellement impactés
 * - Les valeurs qu'il souhaite respecter
 *
 * TOUT EST OPTIONNEL.
 * L'absence de contexte moral est valide.
 * Aucune moralité n'est imposée par défaut.
 */
export function MoralContextForm({
  initialContext,
  onSave,
  onCancel,
}: MoralContextFormProps) {
  const { silence } = useSilence();

  const [declaredIntent, setDeclaredIntent] = useState(
    initialContext?.declaredIntent || ""
  );
  const [acknowledgedRisks, setAcknowledgedRisks] = useState<string[]>(
    initialContext?.acknowledgedRisks || []
  );
  const [impactedDomains, setImpactedDomains] = useState<ImpactDomain[]>(
    initialContext?.impactedDomains || []
  );
  const [valueStatements, setValueStatements] = useState<string[]>(
    initialContext?.valueStatements || []
  );
  const [newRisk, setNewRisk] = useState("");
  const [newValue, setNewValue] = useState("");

  // Silence désactive toute réflexion
  if (silence.enabled) {
    return (
      <div style={{ padding: "16px", color: "#888", fontSize: "13px" }}>
        🔕 Mode silence actif — déclaration morale désactivée.
      </div>
    );
  }

  const handleSave = () => {
    // Si rien n'est rempli, on sauvegarde undefined (pas de contexte moral)
    if (
      !declaredIntent.trim() &&
      acknowledgedRisks.length === 0 &&
      impactedDomains.length === 0 &&
      valueStatements.length === 0
    ) {
      onSave(undefined);
      return;
    }

    const context: MoralContext = {
      declaredIntent: declaredIntent.trim(),
    };

    if (acknowledgedRisks.length > 0) {
      context.acknowledgedRisks = acknowledgedRisks;
    }
    if (impactedDomains.length > 0) {
      context.impactedDomains = impactedDomains;
    }
    if (valueStatements.length > 0) {
      context.valueStatements = valueStatements;
    }

    onSave(context);
  };

  const toggleDomain = (domain: ImpactDomain) => {
    if (impactedDomains.includes(domain)) {
      setImpactedDomains(impactedDomains.filter((d) => d !== domain));
    } else {
      setImpactedDomains([...impactedDomains, domain]);
    }
  };

  const addRisk = () => {
    if (newRisk.trim() && !acknowledgedRisks.includes(newRisk.trim())) {
      setAcknowledgedRisks([...acknowledgedRisks, newRisk.trim()]);
      setNewRisk("");
    }
  };

  const removeRisk = (risk: string) => {
    setAcknowledgedRisks(acknowledgedRisks.filter((r) => r !== risk));
  };

  const toggleValue = (value: string) => {
    if (valueStatements.includes(value)) {
      setValueStatements(valueStatements.filter((v) => v !== value));
    } else {
      setValueStatements([...valueStatements, value]);
    }
  };

  const addCustomValue = () => {
    if (newValue.trim() && !valueStatements.includes(newValue.trim())) {
      setValueStatements([...valueStatements, newValue.trim()]);
      setNewValue("");
    }
  };

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
      <h3 style={{ margin: "0 0 8px 0", fontSize: "16px", fontWeight: 500 }}>
        🪞 Contexte moral (optionnel)
      </h3>
      <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#888" }}>
        Cette déclaration est entièrement volontaire. Laissez vide si non applicable.
      </p>

      {/* Declared Intent */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
          Intention déclarée
        </label>
        <textarea
          value={declaredIntent}
          onChange={(e) => setDeclaredIntent(e.target.value)}
          placeholder="Décrivez ce que vous souhaitez accomplir..."
          rows={3}
          style={{
            width: "100%",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "4px",
            fontSize: "13px",
            resize: "vertical",
          }}
        />
      </div>

      {/* Acknowledged Risks */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
          Risques reconnus
        </label>
        <div style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
          <input
            type="text"
            value={newRisk}
            onChange={(e) => setNewRisk(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addRisk()}
            placeholder="Ajouter un risque..."
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          />
          <button
            onClick={addRisk}
            style={{
              padding: "8px 12px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            +
          </button>
        </div>
        {acknowledgedRisks.length > 0 && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
            {acknowledgedRisks.map((risk) => (
              <span
                key={risk}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "4px",
                  padding: "4px 8px",
                  background: "#fff3e0",
                  borderRadius: "4px",
                  fontSize: "12px",
                }}
              >
                {risk}
                <button
                  onClick={() => removeRisk(risk)}
                  style={{
                    background: "transparent",
                    border: "none",
                    cursor: "pointer",
                    padding: 0,
                    fontSize: "14px",
                    color: "#999",
                  }}
                >
                  ×
                </button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Impacted Domains */}
      <div style={{ marginBottom: "16px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
          Domaines potentiellement impactés
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px" }}>
          {IMPACT_DOMAINS.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => toggleDomain(value)}
              style={{
                padding: "6px 12px",
                background: impactedDomains.includes(value) ? "#e3f2fd" : "#f5f5f5",
                border: impactedDomains.includes(value) ? "1px solid #90caf9" : "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                color: impactedDomains.includes(value) ? "#1565c0" : "#666",
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Value Statements */}
      <div style={{ marginBottom: "20px" }}>
        <label style={{ display: "block", marginBottom: "6px", fontSize: "13px", fontWeight: 500 }}>
          Valeurs à respecter
        </label>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "8px", marginBottom: "8px" }}>
          {COMMON_VALUES.map((value) => (
            <button
              key={value}
              onClick={() => toggleValue(value)}
              style={{
                padding: "6px 12px",
                background: valueStatements.includes(value) ? "#e8f5e9" : "#f5f5f5",
                border: valueStatements.includes(value) ? "1px solid #a5d6a7" : "1px solid #ddd",
                borderRadius: "4px",
                cursor: "pointer",
                fontSize: "12px",
                color: valueStatements.includes(value) ? "#2e7d32" : "#666",
              }}
            >
              {value}
            </button>
          ))}
        </div>
        <div style={{ display: "flex", gap: "8px" }}>
          <input
            type="text"
            value={newValue}
            onChange={(e) => setNewValue(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addCustomValue()}
            placeholder="Ajouter une valeur personnalisée..."
            style={{
              flex: 1,
              padding: "8px",
              border: "1px solid #ddd",
              borderRadius: "4px",
              fontSize: "13px",
            }}
          />
          <button
            onClick={addCustomValue}
            style={{
              padding: "8px 12px",
              background: "#f5f5f5",
              border: "1px solid #ddd",
              borderRadius: "4px",
              cursor: "pointer",
              fontSize: "13px",
            }}
          >
            +
          </button>
        </div>
      </div>

      {/* Actions */}
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
          paddingTop: "12px",
          borderTop: "1px solid #eee",
        }}
      >
        <button
          onClick={onCancel}
          style={{
            padding: "8px 16px",
            background: "transparent",
            border: "1px solid #ddd",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
            color: "#666",
          }}
        >
          Annuler
        </button>
        <button
          onClick={handleSave}
          style={{
            padding: "8px 16px",
            background: "#333",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
            fontSize: "13px",
          }}
        >
          Sauvegarder
        </button>
      </div>

      {/* Notice */}
      <p
        style={{
          marginTop: "12px",
          marginBottom: 0,
          fontSize: "10px",
          color: "#999",
          fontStyle: "italic",
          textAlign: "center",
        }}
      >
        Le système n'évalue pas ces déclarations. Elles servent uniquement
        à votre propre réflexion et transparence.
      </p>
    </div>
  );
}
