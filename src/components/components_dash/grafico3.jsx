import React, { useEffect, useMemo, useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

function getLastMonths(count = 6) {
	const now = new Date();
	const arr = [];
	for (let i = count - 1; i >= 0; i--) {
		const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
		arr.push(d);
	}
	return arr;
}

function monthKey(d) {
	return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

export default function Grafico3() {
	const [raw, setRaw] = useState([]);

	useEffect(() => {
		fetch('http://localhost:8080/agendamentos/kpi4')
			.then((r) => r.json())
			.then((j) => setRaw(j.agendamentos || []))
			.catch(() => setRaw([]));
	}, []);

	const { labels, data } = useMemo(() => {
		const months = getLastMonths(6);
		const labels = months.map((d) => d.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^./, (c) => c.toUpperCase()));
		const keys = months.map(monthKey);

		const bucket = new Map();
		keys.forEach((k) => bucket.set(k, 0));

		raw.forEach((ag) => {
			const [dd, mm, yyyy] = String(ag.data || '').split('/').map((x) => parseInt(x, 10));
			if (!dd || !mm || !yyyy) return;
			const key = `${yyyy}-${String(mm).padStart(2, '0')}`;
			if (bucket.has(key)) bucket.set(key, bucket.get(key) + 1);
		});

		const values = keys.map((k) => bucket.get(k) || 0);

		const chartData = {
			labels,
			datasets: [
				{
					label: 'Ocupação',
					data: values,
					borderColor: '#F27405',
					backgroundColor: 'rgba(242,116,5,0.18)',
					tension: 0.4,
					fill: true,
					pointBackgroundColor: '#fff',
					pointBorderColor: '#F27405',
					pointRadius: 4,
				},
			],
		};

		return { labels, data: chartData };
	}, [raw]);

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'bottom' },
		},
		scales: {
			x: {
				grid: { color: 'rgba(242,116,5,0.08)' },
				ticks: { color: '#444' },
			},
			y: {
				beginAtZero: true,
				grid: { color: 'rgba(242,116,5,0.08)', borderDash: [4, 4] },
				ticks: { color: '#444' },
			},
		},
	};

	return (
		<div style={{ width: '100%', height: 350 }}>
			<Line options={options} data={data} />
		</div>
	);
}

