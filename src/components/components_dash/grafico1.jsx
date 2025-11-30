import React, { useEffect, useState } from 'react';
import Filtros1 from './filtros1';

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

	const [rawAgs, setRawAgs] = useState([]);
	const [range, setRange] = useState(null); // { left: {year, monthIndex}, right: {year, monthIndex} }

	// fetch raw agendamentos once
	useEffect(() => {
		fetch('http://localhost:8080/agendamentos/kpi4')
			.then((res) => res.json())
			.then((json) => setRawAgs(json.agendamentos || []))
			.catch(() => setRawAgs([]));
	}, []);

	// recompute chartData when rawAgs or range change
	useEffect(() => {
		if (!rawAgs || !rawAgs.length) return;

		const parseAgDate = (ag) => {
			const [dd, mm, yyyy] = (ag.data || '').split('/').map((v) => parseInt(v, 10));
			if (!yyyy || !mm || !dd) return null;
			return new Date(yyyy, mm - 1, dd);
		};

		let filtered = rawAgs.slice();
		let monthsToShow = [];

		if (range && range.left && range.right) {
			// Compare exactly the two selected months (no continuous range)
			const leftMonth = new Date(range.left.year, range.left.monthIndex, 1);
			const rightMonth = new Date(range.right.year, range.right.monthIndex, 1);
			// preserve order: left then right
			monthsToShow.push({ dateRef: new Date(leftMonth), year: leftMonth.getFullYear(), monthIndex: leftMonth.getMonth() });
			// if different month, add right
			if (!(leftMonth.getFullYear() === rightMonth.getFullYear() && leftMonth.getMonth() === rightMonth.getMonth())) {
				monthsToShow.push({ dateRef: new Date(rightMonth), year: rightMonth.getFullYear(), monthIndex: rightMonth.getMonth() });
			}
			// filtered remains all rawAgs; counting step will only pick months present in monthsToShow
		} else {
			// default: last 3 months
			const bucket = new Map();
			for (const ag of rawAgs) {
				const d = parseAgDate(ag);
				if (!d) continue;
				const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
				if (!bucket.has(key)) bucket.set(key, { dateRef: d });
			}
			const sorted = Array.from(bucket.values()).sort((a, b) => a.dateRef - b.dateRef);
			const last3 = sorted.slice(-3);
			monthsToShow = last3.map((it) => ({ dateRef: it.dateRef, year: it.dateRef.getFullYear(), monthIndex: it.dateRef.getMonth() }));
		}

		const monthMap = new Map();
		for (const m of monthsToShow) {
			const key = `${m.year}-${String(m.monthIndex + 1).padStart(2, '0')}`;
			monthMap.set(key, { dateRef: m.dateRef, agendados: 0, realizados: 0, cancelados: 0 });
		}

		for (const ag of filtered) {
			const d = parseAgDate(ag);
			if (!d) continue;
			const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
			if (!monthMap.has(key)) continue;
			const item = monthMap.get(key);
			item.agendados += 1;
			const status = String(ag.status || '').toLowerCase();
			if (status.includes('conclu')) item.realizados += 1;
			if (status.includes('cancel')) item.cancelados += 1;
		}

		const monthsArr = Array.from(monthMap.values());
		const labels = monthsArr.map((it) => it.dateRef.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^./, (c) => c.toUpperCase()));
		const agendados = monthsArr.map((it) => it.agendados);
		const realizados = monthsArr.map((it) => it.realizados);
		const cancelados = monthsArr.map((it) => it.cancelados);

		setChartData((prev) => ({
			...prev,
			labels,
			datasets: [
				{ ...prev.datasets[0], data: agendados },
				{ ...prev.datasets[1], data: realizados },
				{ ...prev.datasets[2], data: cancelados },
			],
		}));

	}, [rawAgs, range]);

	return (
		<>
				<div className='GF2'>
					<Filtros1 onChange={setRange} />
					<div style={{ width: '100%', height: 280 }}>
					<Bar options={options} data={chartData} />
					</div>
				</div>
				</>
	);
}
