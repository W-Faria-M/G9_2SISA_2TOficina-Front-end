import "./dash.css"
import KPI1 from "../components/components_dash/kpi1";
import KPI2 from "../components/components_dash/kpi2";
import KPI3 from "../components/components_dash/kpi3";
import KPI4 from "../components/components_dash/kpi4";
import GRAFICO from "../components/components_dash/graficos";

export default function Dash() {
  return (
    <>
    <div className="dash-page">
      <div className="dash-esquerda">
        <h1>Análises</h1>
        <div className="dash-topo">
          <KPI1/>
          <KPI2/>
        </div>
        <div className="dash-baixo">
          <GRAFICO/>
        </div>
      </div>

      <div className="dash-direita">
        <KPI3/>
          <KPI4/>
      </div>
    </div>
    </>
  );
}