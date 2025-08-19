import React, { useState, useEffect } from "react";

// --- Estilos CSS en línea (en lugar de Tailwind) ---
const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#1a202c",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "16px",
    fontFamily: "sans-serif",
  },
  card: {
    width: "100%",
    maxWidth: "500px",
    backgroundColor: "#2d3748",
    padding: "32px",
    borderRadius: "16px",
    boxShadow:
      "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
  },
  header: {
    textAlign: "center",
    marginBottom: "32px",
  },
  h1: {
    fontSize: "2.25rem",
    fontWeight: "bold",
    color: "#63b3ed",
    margin: "0 0 8px 0",
  },
  p: {
    color: "#a0aec0",
    marginTop: "0",
  },
  section: {
    backgroundColor: "#1a202c",
    padding: "24px",
    borderRadius: "12px",
    border: "1px solid #4a5568",
    marginBottom: "24px",
  },
  sectionTitle: {
    fontSize: "1.5rem",
    fontWeight: "600",
    marginBottom: "16px",
    color: "#e2e8f0",
  },
  inputGroup: {
    marginBottom: "16px",
  },
  label: {
    display: "block",
    fontSize: "0.875rem",
    color: "#cbd5e0",
    marginBottom: "4px",
  },
  input: {
    width: "100%",
    boxSizing: "border-box",
    padding: "10px",
    backgroundColor: "#4a5568",
    border: "1px solid #718096",
    borderRadius: "8px",
    color: "white",
    fontSize: "1rem",
  },
  buttonGroup: {
    display: "flex",
    gap: "8px",
    marginBottom: "16px",
  },
  button: {
    flex: 1,
    padding: "10px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#4a5568",
    color: "#cbd5e0",
    transition: "background-color 0.2s",
  },
  activeButton: {
    backgroundColor: "#3182ce",
    color: "white",
  },
  resultGroup: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#4a5568",
    padding: "16px",
    borderRadius: "8px",
    marginBottom: "12px",
  },
  resultLabel: {
    color: "#e2e8f0",
    fontWeight: "500",
  },
  resultValue: {
    fontSize: "1.75rem",
    fontWeight: "bold",
    color: "#68d391",
  },
};

// --- Componente Principal ---

export default function App() {
  const [values, setValues] = useState({
    initialCapital: 30,
    currentBenefit: 100,
    investmentMode: "amount",
    investmentValue: 45,
    courseCost: 15,
    odds: 3,
  });

  const [totalInvestmentAllowed, setTotalInvestmentAllowed] = useState(
    values.investmentValue
  );
  const [investmentCostForBet, setInvestmentCostForBet] = useState(0);
  const [possibleGain, setPossibleGain] = useState(0);
  const [possibleBenefit, setPossibleBenefit] = useState(0);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleModeChange = (mode) => {
    setValues((prev) => ({ ...prev, investmentMode: mode }));
  };

  useEffect(() => {
    let total;
    if (values.investmentMode === "percentage") {
      total = (values.investmentValue / 100) * values.currentBenefit;
    } else {
      total = values.investmentValue;
    }
    setTotalInvestmentAllowed(isNaN(total) ? 0 : total);
  }, [values.investmentMode, values.investmentValue, values.currentBenefit]);

  useEffect(() => {
    const costForBet = totalInvestmentAllowed - values.courseCost;
    setInvestmentCostForBet(costForBet > 0 ? costForBet : 0);
  }, [totalInvestmentAllowed, values.courseCost]);

  useEffect(() => {
    const gain = investmentCostForBet * values.odds;
    const totalCost = values.courseCost + investmentCostForBet;
    const benefit = gain - totalCost;
    setPossibleGain(isNaN(gain) ? 0 : gain);
    setPossibleBenefit(isNaN(benefit) ? 0 : benefit);
  }, [investmentCostForBet, values.courseCost, values.odds]);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <header style={styles.header}>
          <h1 style={styles.h1}>Gestor de Inversiones</h1>
          <p style={styles.p}>Calcula la rentabilidad de tus apuestas</p>
        </header>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Situación Actual</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="initialCapital">
              Capital Inicial (€)
            </label>
            <input
              style={styles.input}
              type="number"
              name="initialCapital"
              value={values.initialCapital}
              onChange={handleInputChange}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="currentBenefit">
              Beneficio Actual (€)
            </label>
            <input
              style={styles.input}
              type="number"
              name="currentBenefit"
              value={values.currentBenefit}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Estrategia de Inversión</h2>
          <div style={styles.buttonGroup}>
            <button
              style={{
                ...styles.button,
                ...(values.investmentMode === "percentage" &&
                  styles.activeButton),
              }}
              onClick={() => handleModeChange("percentage")}
            >
              Porcentaje (%)
            </button>
            <button
              style={{
                ...styles.button,
                ...(values.investmentMode === "amount" && styles.activeButton),
              }}
              onClick={() => handleModeChange("amount")}
            >
              Cantidad (€)
            </button>
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="investmentValue">
              {values.investmentMode === "percentage"
                ? "Porcentaje del Beneficio a Invertir (%)"
                : "Presupuesto Total a Invertir (€)"}
            </label>
            <input
              style={styles.input}
              type="number"
              name="investmentValue"
              value={values.investmentValue}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Próxima Apuesta</h2>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="courseCost">
              Coste del Curso/Info (€)
            </label>
            <input
              style={styles.input}
              type="number"
              name="courseCost"
              value={values.courseCost}
              onChange={handleInputChange}
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="investmentCostForBet">
              Coste Inversión Apuesta (€) (Calculado)
            </label>
            <input
              style={{ ...styles.input, opacity: 0.6 }}
              type="number"
              name="investmentCostForBet"
              value={investmentCostForBet.toFixed(2)}
              readOnly
            />
          </div>
          <div style={styles.inputGroup}>
            <label style={styles.label} htmlFor="odds">
              Cuota de la Apuesta
            </label>
            <input
              style={styles.input}
              type="number"
              name="odds"
              value={values.odds}
              onChange={handleInputChange}
            />
          </div>
        </div>

        <div style={styles.section}>
          <h2 style={styles.sectionTitle}>Resultados Potenciales</h2>
          <div style={styles.resultGroup}>
            <span style={styles.resultLabel}>Ganancia Posible:</span>
            <span style={styles.resultValue}>{possibleGain.toFixed(2)} €</span>
          </div>
          <div style={styles.resultGroup}>
            <span style={styles.resultLabel}>Beneficio Neto Posible:</span>
            <span style={styles.resultValue}>
              {possibleBenefit.toFixed(2)} €
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
