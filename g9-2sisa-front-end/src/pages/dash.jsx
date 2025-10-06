import "./dash.css"
import KPI1 from "../components/components_dash/kpi1";
import KPI2 from "../components/components_dash/kpi2";

export default function Dash() {
  return (
    <>
    <div className="dash-page">
      <div className="dash-esquerda">
        {/* <KPI1/> */}
        {/* <KPI2/> */}
      </div>
      <div className="dash-direita"></div>
    </div>
    </>
  );
}