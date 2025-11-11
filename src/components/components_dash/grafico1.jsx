import React, { useEffect, useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const options = {
	responsive: true,
	maintainAspectRatio: false,
	plugins: {
		legend: {
			position: 'bottom',
			labels: {
				color: '#000',
				boxWidth: 12,
				boxHeight: 12,
			},
		},
		title: { display: false },
		tooltip: { enabled: true },
	},
	scales: {
		x: {
			stacked: true,
			grid: {
				color: 'rgba(242, 116, 5, 0.2)',
				borderColor: '#F27405',
			},
			ticks: { color: '#555' },
		},
		y: {
			stacked: true,
			beginAtZero: true,
			grid: {
				color: 'rgba(242, 116, 5, 0.2)',
				borderColor: '#F27405',
				borderDash: [4, 4],
			},
			ticks: { color: '#555' },
		},
	},
};

export default function Grafico1() {
	const [chartData, setChartData] = useState({
		labels: [],
		datasets: [
			{
				label: 'Serviços Agendados',
				data: [],
				backgroundColor: '#3B82F6',
				borderColor: '#2F62B5',
				borderWidth: 1,
				stack: 'total',
			},
			{
				label: 'Serviços Realizados',
				data: [],
				backgroundColor: '#34D399',
				borderColor: '#22A36A',
				borderWidth: 1,
				stack: 'total',
			},
			{
				label: 'Serviços Cancelados',
				data: [],
				backgroundColor: '#F97316',
				borderColor: '#C25A11',
				borderWidth: 1,
				stack: 'total',
			},
		],
	});

	useEffect(() => {
		fetch('http://localhost:8080/agendamentos/kpi4')
			.then((res) => res.json())
			.then((json) => {
				const ags = json.agendamentos || [];

				// Agrupa por mês/ano
				const bucket = new Map(); // key: YYYY-MM -> {dateRef, agendados, realizados, cancelados}
				ags.forEach((ag) => {
					// Parse dd/mm/yyyy
					const [dd, mm, yyyy] = (ag.data || '').split('/').map((v) => parseInt(v, 10));
					if (!yyyy || !mm || !dd) return;
					const d = new Date(yyyy, mm - 1, dd);
					const key = `${yyyy}-${String(mm).padStart(2, '0')}`;
					if (!bucket.has(key)) {
						bucket.set(key, { dateRef: d, agendados: 0, realizados: 0, cancelados: 0 });
					}
					const item = bucket.get(key);
					item.agendados += 1;
					const status = String(ag.status || '').toLowerCase();
					if (status.includes('conclu')) item.realizados += 1;
					if (status.includes('cancel')) item.cancelados += 1;
				});

				// Ordena por data e pega os 3 meses mais recentes
				const sorted = Array.from(bucket.values())
					.sort((a, b) => a.dateRef - b.dateRef);

				const last3 = sorted.slice(-3);

				const labels = last3.map((it) =>
					it.dateRef.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^./, (c) => c.toUpperCase())
				);

				const agendados = last3.map((it) => it.agendados);
				const realizados = last3.map((it) => it.realizados);
				const cancelados = last3.map((it) => it.cancelados);

				setChartData((prev) => ({
					...prev,
					labels,
					datasets: [
						{ ...prev.datasets[0], data: agendados },
						{ ...prev.datasets[1], data: realizados },
						{ ...prev.datasets[2], data: cancelados },
					],
				}));
			})
			.catch(() => {
				// Em caso de erro, mantém vazio
			});
	}, []);

	return (
		<div style={{ width: '100%', height: 350 }}>
			<Bar options={options} data={chartData} />
		</div>
	);
}
