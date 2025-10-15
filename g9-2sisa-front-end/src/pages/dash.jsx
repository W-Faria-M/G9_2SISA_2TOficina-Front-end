import "./dash.css"
import KPI1 from "../components/components_dash/kpi1";
import KPI2 from "../components/components_dash/kpi2";
import KPI3 from "../components/components_dash/kpi3";
import KPI4 from "../components/components_dash/kpi4";

export default function Dash() {
  return (
    <>
    <div className="dash-page">
      <div className="dash-esquerda">
        {/* <KPI1/> */}
        {/* <KPI2/> */}
        <KPI3/>
        <KPI4/>
      </div>
      <div className="dash-direita"></div>
    </div>
    </>
  );
}