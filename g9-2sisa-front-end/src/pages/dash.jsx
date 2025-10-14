import "./dash.css"
import KPI1 from "../components/components_dash/kpi1";
import KPI2 from "../components/components_dash/kpi2";
import KPI3 from "../components/components_dash/kpi3";

export default function Dash() {
  return (
    <>
    <div className="dash-page">
      <div className="dash-esquerda">
        {/* <KPI1/> */}
        <KPI2/>
        {/* <KPI3/> */}
      </div>
      <div className="dash-direita"></div>
    </div>
    </>
  );
}