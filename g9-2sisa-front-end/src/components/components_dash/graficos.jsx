import { useState } from "react";
import Grafico1 from "./grafico1";
import Grafico2 from "./grafico2";
import Grafico3 from "./grafico3";

const tabs = [
	{ label: "AGENDAMENTOS", component: <Grafico1 /> },
	{ label: "SERVIÇOS", component: <Grafico2 /> },
	{ label: "OCUPAÇÃO", component: <Grafico3 /> }
];

export default function Graficos() {
	const [activeTab, setActiveTab] = useState(0);

	return (
		<>
			<div className="graficos-tabs">
				{tabs.map((tab, idx) => (
					<button
						key={tab.label}
						className={`graficos-tab${activeTab === idx ? " active" : ""}`}
						onClick={() => setActiveTab(idx)}
					>
						{tab.label}
					</button>
				))}
			</div>
			<div className="graficos-container">
				<div className="graficos-content">
					{tabs[activeTab].component}
				</div>
			</div>
		</>
	);
}
