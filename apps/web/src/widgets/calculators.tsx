import React, { useState } from 'react';

const calculators = {
  estimation: [
    { id: "quantity", name: "Quantités", icon: "📐", desc: "Surfaces, volumes, longueurs" },
    { id: "labor", name: "Main-d'œuvre", icon: "👷", desc: "Heures et coûts de travail" },
    { id: "material", name: "Matériaux", icon: "🧱", desc: "Coûts des matériaux" },
    { id: "markup", name: "Majoration", icon: "📈", desc: "Frais généraux et profit" },
  ],
  structural: [
    { id: "loads", name: "Charges", icon: "⚖️", desc: "Charges de bâtiment (CNB)" },
    { id: "beam", name: "Poutres", icon: "📏", desc: "Dimensionnement poutres" },
    { id: "column", name: "Colonnes", icon: "🏛️", desc: "Dimensionnement colonnes" },
    { id: "foundation", name: "Fondations", icon: "🪨", desc: "Semelles et murs" },
  ],
  mep: [
    { id: "hvac", name: "CVAC", icon: "❄️", desc: "Charges thermiques" },
    { id: "electrical", name: "Électrique", icon: "⚡", desc: "Charge électrique" },
    { id: "plumbing", name: "Plomberie", icon: "🚿", desc: "Dimensionnement tuyaux" },
  ],
  project: [
    { id: "schedule", name: "Échéancier", icon: "📅", desc: "Durées et chemin critique" },
    { id: "productivity", name: "Productivité", icon: "📊", desc: "Rendement équipes" },
  ]
};

// Données pour les calculs
const laborRates = {
  "Manoeuvre": { base: 28, burden: 1.65, total: 46.20 },
  "Charpentier-menuisier": { base: 38, burden: 1.65, total: 62.70 },
  "Électricien": { base: 42, burden: 1.65, total: 69.30 },
  "Plombier": { base: 42, burden: 1.65, total: 69.30 },
  "Ferblantier": { base: 40, burden: 1.65, total: 66.00 },
  "Opérateur équipement": { base: 36, burden: 1.65, total: 59.40 },
  "Soudeur": { base: 40, burden: 1.65, total: 66.00 },
  "Peintre": { base: 34, burden: 1.65, total: 56.10 },
};

const loadFactors = {
  residential: { dead: 1.9, live: 1.9, snow: 2.5 },
  commercial: { dead: 3.6, live: 4.8, snow: 2.5 },
  industrial: { dead: 4.8, live: 7.2, snow: 2.5 },
};

export default function ConstructionCalculators() {
  const [activeCategory, setActiveCategory] = useState('estimation');
  const [activeCalc, setActiveCalc] = useState('quantity');
  const [results, setResults] = useState(null);

  // États pour le calculateur de quantités
  const [quantityInputs, setQuantityInputs] = useState({
    type: 'surface',
    length: '',
    width: '',
    height: '',
    quantity: 1,
    wasteFactor: 10,
  });

  // États pour le calculateur main-d'œuvre
  const [laborInputs, setLaborInputs] = useState({
    trade: 'Charpentier-menuisier',
    hours: '',
    workers: 1,
    overtime: 0,
  });

  // États pour le calculateur de charges
  const [loadInputs, setLoadInputs] = useState({
    buildingType: 'commercial',
    area: '',
    floors: 1,
    roofSnowLoad: 2.5,
  });

  // États pour le calculateur CVAC
  const [hvacInputs, setHvacInputs] = useState({
    area: '',
    ceilingHeight: 2.7,
    occupancy: 10,
    windowArea: '',
    orientation: 'sud',
  });

  // Calculer les quantités
  const calculateQuantity = () => {
    const { type, length, width, height, quantity, wasteFactor } = quantityInputs;
    let result = 0;
    let unit = '';

    if (type === 'surface') {
      result = parseFloat(length) * parseFloat(width);
      unit = 'm²';
    } else if (type === 'volume') {
      result = parseFloat(length) * parseFloat(width) * parseFloat(height);
      unit = 'm³';
    } else if (type === 'linear') {
      result = parseFloat(length);
      unit = 'm';
    }

    const net = result * parseInt(quantity);
    const withWaste = net * (1 + parseInt(wasteFactor) / 100);

    setResults({
      type: 'quantity',
      net: net.toFixed(2),
      waste: (withWaste - net).toFixed(2),
      total: withWaste.toFixed(2),
      unit
    });
  };

  // Calculer la main-d'œuvre
  const calculateLabor = () => {
    const { trade, hours, workers, overtime } = laborInputs;
    const rate = laborRates[trade];
    const regularHours = Math.min(parseFloat(hours), 40) * parseInt(workers);
    const overtimeHours = Math.max(0, parseFloat(hours) - 40) * parseInt(workers);
    
    const regularCost = regularHours * rate.total;
    const overtimeCost = overtimeHours * rate.total * 1.5;
    const totalCost = regularCost + overtimeCost;

    setResults({
      type: 'labor',
      trade,
      regularHours: regularHours.toFixed(1),
      overtimeHours: overtimeHours.toFixed(1),
      totalHours: (regularHours + overtimeHours).toFixed(1),
      hourlyRate: rate.total.toFixed(2),
      regularCost: regularCost.toFixed(2),
      overtimeCost: overtimeCost.toFixed(2),
      totalCost: totalCost.toFixed(2)
    });
  };

  // Calculer les charges
  const calculateLoads = () => {
    const { buildingType, area, floors, roofSnowLoad } = loadInputs;
    const factors = loadFactors[buildingType];
    const areaNum = parseFloat(area);
    const floorsNum = parseInt(floors);

    const deadLoad = factors.dead * areaNum * floorsNum;
    const liveLoad = factors.live * areaNum * floorsNum;
    const snowLoad = roofSnowLoad * areaNum;
    const totalLoad = deadLoad + liveLoad + snowLoad;

    // Combinaisons de charges (simplifiées)
    const combo1 = 1.4 * deadLoad;
    const combo2 = 1.25 * deadLoad + 1.5 * liveLoad + 0.5 * snowLoad;
    const combo3 = 1.25 * deadLoad + 1.5 * snowLoad + 0.5 * liveLoad;

    setResults({
      type: 'loads',
      deadLoad: deadLoad.toFixed(0),
      liveLoad: liveLoad.toFixed(0),
      snowLoad: snowLoad.toFixed(0),
      totalServiceLoad: totalLoad.toFixed(0),
      factoredCombo1: combo1.toFixed(0),
      factoredCombo2: combo2.toFixed(0),
      factoredCombo3: combo3.toFixed(0),
      governingLoad: Math.max(combo1, combo2, combo3).toFixed(0)
    });
  };

  // Calculer les charges CVAC
  const calculateHVAC = () => {
    const { area, ceilingHeight, occupancy, windowArea, orientation } = hvacInputs;
    const areaNum = parseFloat(area);
    const volume = areaNum * parseFloat(ceilingHeight);
    
    // Calculs simplifiés (règles du pouce)
    const envelopeLoad = areaNum * 35; // BTU/h par m²
    const windowLoad = parseFloat(windowArea || 0) * (orientation === 'sud' ? 250 : 150);
    const occupancyLoad = parseInt(occupancy) * 400; // 400 BTU/personne
    const equipmentLoad = areaNum * 10; // Éclairage et équipement
    
    const coolingLoad = envelopeLoad + windowLoad + occupancyLoad + equipmentLoad;
    const heatingLoad = areaNum * 45; // BTU/h par m² pour chauffage
    
    const coolingTons = coolingLoad / 12000;
    const cfm = areaNum * 1.5; // Débit d'air

    setResults({
      type: 'hvac',
      volume: volume.toFixed(0),
      coolingLoadBTU: coolingLoad.toFixed(0),
      coolingTons: coolingTons.toFixed(2),
      heatingLoadBTU: heatingLoad.toFixed(0),
      recommendedCFM: cfm.toFixed(0),
      breakdown: {
        envelope: envelopeLoad.toFixed(0),
        windows: windowLoad.toFixed(0),
        occupancy: occupancyLoad.toFixed(0),
        equipment: equipmentLoad.toFixed(0)
      }
    });
  };

  const renderCalculator = () => {
    switch(activeCalc) {
      case 'quantity':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type de calcul</label>
              <select
                value={quantityInputs.type}
                onChange={(e) => setQuantityInputs({...quantityInputs, type: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
              >
                <option value="surface">Surface (m²)</option>
                <option value="volume">Volume (m³)</option>
                <option value="linear">Linéaire (m)</option>
              </select>
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Longueur (m)</label>
                <input
                  type="number"
                  value={quantityInputs.length}
                  onChange={(e) => setQuantityInputs({...quantityInputs, length: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="0.00"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Largeur (m)</label>
                <input
                  type="number"
                  value={quantityInputs.width}
                  onChange={(e) => setQuantityInputs({...quantityInputs, width: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="0.00"
                  disabled={quantityInputs.type === 'linear'}
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hauteur (m)</label>
                <input
                  type="number"
                  value={quantityInputs.height}
                  onChange={(e) => setQuantityInputs({...quantityInputs, height: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="0.00"
                  disabled={quantityInputs.type !== 'volume'}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Quantité</label>
                <input
                  type="number"
                  value={quantityInputs.quantity}
                  onChange={(e) => setQuantityInputs({...quantityInputs, quantity: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Perte/Waste (%)</label>
                <input
                  type="number"
                  value={quantityInputs.wasteFactor}
                  onChange={(e) => setQuantityInputs({...quantityInputs, wasteFactor: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <button
              onClick={calculateQuantity}
              className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold"
            >
              Calculer
            </button>
          </div>
        );

      case 'labor':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Métier</label>
              <select
                value={laborInputs.trade}
                onChange={(e) => setLaborInputs({...laborInputs, trade: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
              >
                {Object.keys(laborRates).map(trade => (
                  <option key={trade} value={trade}>{trade}</option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Heures/semaine</label>
                <input
                  type="number"
                  value={laborInputs.hours}
                  onChange={(e) => setLaborInputs({...laborInputs, hours: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  placeholder="40"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre de travailleurs</label>
                <input
                  type="number"
                  value={laborInputs.workers}
                  onChange={(e) => setLaborInputs({...laborInputs, workers: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div className="bg-gray-700 rounded-lg p-3">
              <p className="text-sm text-gray-400">Taux horaire chargé:</p>
              <p className="text-xl font-bold text-amber-400">
                {laborRates[laborInputs.trade]?.total.toFixed(2)} $/h
              </p>
              <p className="text-xs text-gray-500">
                (Base: {laborRates[laborInputs.trade]?.base}$ × {laborRates[laborInputs.trade]?.burden} charges)
              </p>
            </div>
            <button
              onClick={calculateLabor}
              className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold"
            >
              Calculer
            </button>
          </div>
        );

      case 'loads':
        return (
          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Type de bâtiment</label>
              <select
                value={loadInputs.buildingType}
                onChange={(e) => setLoadInputs({...loadInputs, buildingType: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
              >
                <option value="residential">Résidentiel</option>
                <option value="commercial">Commercial</option>
                <option value="industrial">Industriel</option>
              </select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Surface par étage (m²)</label>
                <input
                  type="number"
                  value={loadInputs.area}
                  onChange={(e) => setLoadInputs({...loadInputs, area: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Nombre d'étages</label>
                <input
                  type="number"
                  value={loadInputs.floors}
                  onChange={(e) => setLoadInputs({...loadInputs, floors: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Charge de neige (kPa)</label>
              <input
                type="number"
                value={loadInputs.roofSnowLoad}
                onChange={(e) => setLoadInputs({...loadInputs, roofSnowLoad: e.target.value})}
                className="w-full bg-gray-700 rounded-lg px-4 py-2"
                step="0.1"
              />
            </div>
            <button
              onClick={calculateLoads}
              className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold"
            >
              Calculer
            </button>
          </div>
        );

      case 'hvac':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Surface (m²)</label>
                <input
                  type="number"
                  value={hvacInputs.area}
                  onChange={(e) => setHvacInputs({...hvacInputs, area: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Hauteur plafond (m)</label>
                <input
                  type="number"
                  value={hvacInputs.ceilingHeight}
                  onChange={(e) => setHvacInputs({...hvacInputs, ceilingHeight: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                  step="0.1"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-400 mb-1">Occupants</label>
                <input
                  type="number"
                  value={hvacInputs.occupancy}
                  onChange={(e) => setHvacInputs({...hvacInputs, occupancy: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-400 mb-1">Surface vitrée (m²)</label>
                <input
                  type="number"
                  value={hvacInputs.windowArea}
                  onChange={(e) => setHvacInputs({...hvacInputs, windowArea: e.target.value})}
                  className="w-full bg-gray-700 rounded-lg px-4 py-2"
                />
              </div>
            </div>
            <button
              onClick={calculateHVAC}
              className="w-full bg-amber-600 hover:bg-amber-700 py-3 rounded-lg font-semibold"
            >
              Calculer
            </button>
          </div>
        );

      default:
        return <div className="text-gray-500">Sélectionnez un calculateur</div>;
    }
  };

  const renderResults = () => {
    if (!results) return null;

    switch(results.type) {
      case 'quantity':
        return (
          <div className="bg-green-900/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-green-400">📐 Résultats</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Net</p>
                <p className="text-xl font-bold">{results.net} {results.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Perte</p>
                <p className="text-xl font-bold text-amber-400">+{results.waste} {results.unit}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">À commander</p>
                <p className="text-xl font-bold text-green-400">{results.total} {results.unit}</p>
              </div>
            </div>
          </div>
        );

      case 'labor':
        return (
          <div className="bg-green-900/50 rounded-lg p-4 space-y-2">
            <h3 className="font-semibold text-green-400">👷 Résultats - {results.trade}</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Heures régulières</p>
                <p className="text-lg font-bold">{results.regularHours}h = ${results.regularCost}</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Heures supplémentaires</p>
                <p className="text-lg font-bold">{results.overtimeHours}h = ${results.overtimeCost}</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-2 mt-2">
              <p className="text-sm text-gray-400">Coût total</p>
              <p className="text-2xl font-bold text-green-400">${results.totalCost}</p>
            </div>
          </div>
        );

      case 'loads':
        return (
          <div className="bg-green-900/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-green-400">⚖️ Charges Calculées</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-400">Charge morte (D)</p>
                <p className="text-lg font-bold">{results.deadLoad} kN</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Charge vive (L)</p>
                <p className="text-lg font-bold">{results.liveLoad} kN</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Charge neige (S)</p>
                <p className="text-lg font-bold">{results.snowLoad} kN</p>
              </div>
            </div>
            <div className="border-t border-gray-700 pt-2">
              <p className="text-sm text-gray-400 mb-2">Combinaisons pondérées (CNB)</p>
              <div className="grid grid-cols-3 gap-2 text-sm">
                <div className="bg-gray-700 rounded p-2">
                  <p className="text-gray-400">1.4D</p>
                  <p className="font-bold">{results.factoredCombo1} kN</p>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <p className="text-gray-400">1.25D+1.5L+0.5S</p>
                  <p className="font-bold">{results.factoredCombo2} kN</p>
                </div>
                <div className="bg-gray-700 rounded p-2">
                  <p className="text-gray-400">1.25D+1.5S+0.5L</p>
                  <p className="font-bold">{results.factoredCombo3} kN</p>
                </div>
              </div>
            </div>
            <div className="bg-amber-900/50 rounded p-3">
              <p className="text-sm text-amber-400">Charge de calcul gouvernante</p>
              <p className="text-2xl font-bold text-amber-400">{results.governingLoad} kN</p>
            </div>
          </div>
        );

      case 'hvac':
        return (
          <div className="bg-green-900/50 rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-green-400">❄️ Charges CVAC</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-400">Charge climatisation</p>
                <p className="text-lg font-bold">{results.coolingLoadBTU} BTU/h</p>
                <p className="text-sm text-blue-400">{results.coolingTons} tonnes</p>
              </div>
              <div>
                <p className="text-sm text-gray-400">Charge chauffage</p>
                <p className="text-lg font-bold">{results.heatingLoadBTU} BTU/h</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-400">Débit d'air recommandé</p>
              <p className="text-lg font-bold">{results.recommendedCFM} CFM</p>
            </div>
            <div className="text-sm border-t border-gray-700 pt-2">
              <p className="text-gray-400 mb-1">Ventilation des charges:</p>
              <div className="grid grid-cols-2 gap-1">
                <span>Enveloppe: {results.breakdown.envelope} BTU/h</span>
                <span>Fenêtres: {results.breakdown.windows} BTU/h</span>
                <span>Occupants: {results.breakdown.occupancy} BTU/h</span>
                <span>Équipement: {results.breakdown.equipment} BTU/h</span>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-3 mb-6">
          <span className="text-3xl">🧮</span>
          <h1 className="text-2xl font-bold">Calculateurs Construction</h1>
        </div>

        <div className="grid grid-cols-4 gap-4">
          {/* Categories & Calculators */}
          <div className="bg-gray-800 rounded-xl p-4">
            {Object.entries(calculators).map(([catId, calcs]) => (
              <div key={catId} className="mb-4">
                <h3 className="text-sm text-gray-400 uppercase mb-2">
                  {catId === 'estimation' ? '💰 Estimation' :
                   catId === 'structural' ? '🏗️ Structure' :
                   catId === 'mep' ? '🔧 MEP' : '📋 Projet'}
                </h3>
                {calcs.map(calc => (
                  <button
                    key={calc.id}
                    onClick={() => { setActiveCategory(catId); setActiveCalc(calc.id); setResults(null); }}
                    className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg mb-1 text-left transition ${
                      activeCalc === calc.id ? 'bg-amber-600' : 'bg-gray-700 hover:bg-gray-600'
                    }`}
                  >
                    <span>{calc.icon}</span>
                    <span className="text-sm">{calc.name}</span>
                  </button>
                ))}
              </div>
            ))}
          </div>

          {/* Calculator */}
          <div className="col-span-2 bg-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
              {calculators[activeCategory]?.find(c => c.id === activeCalc)?.icon}
              {calculators[activeCategory]?.find(c => c.id === activeCalc)?.name}
            </h2>
            <p className="text-gray-400 text-sm mb-4">
              {calculators[activeCategory]?.find(c => c.id === activeCalc)?.desc}
            </p>
            {renderCalculator()}
          </div>

          {/* Results */}
          <div className="bg-gray-800 rounded-xl p-4">
            <h2 className="text-lg font-semibold mb-4">📊 Résultats</h2>
            {results ? renderResults() : (
              <div className="text-gray-500 text-center py-8">
                Entrez les valeurs et cliquez sur Calculer
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
