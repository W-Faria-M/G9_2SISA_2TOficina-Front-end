import React, { useEffect, useMemo, useState } from 'react';
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Filler,
	Title,
	Tooltip,
	Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Title, Tooltip, Legend);

const COLORS = {
	primary: '#3B82F6', // azul
	green: '#34D399',
	orange: '#F97316',
	amber: '#F59E0B',
	grid: 'rgba(242, 116, 5, 0.2)',
	border: '#F27405',
};

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

function normalizeServiceName(name = '') {
	return name
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim();
}

export default function Grafico2() {
	const [raw, setRaw] = useState([]);

	useEffect(() => {
		fetch('/db.json')
			.then((r) => r.json())
			.then((j) => setRaw(j.agendamentos || []))
			.catch(() => setRaw([]));
	}, []);

	const { labels, datasets } = useMemo(() => {
		const months = getLastMonths(6);
		const labelNames = months.map((d) =>
			d.toLocaleDateString('pt-BR', { month: 'long' }).replace(/^./, (c) => c.toUpperCase())
		);
		const monthKeys = months.map(monthKey);

		// Serviços alvo (se não existirem, viram zero)
		const targetServices = [
			'troca de oleo',
			'injecao eletrica',
			'revisao',
			'alinhamento',
		];

		// bucket[monthKey][service] = count
		const bucket = new Map();
		for (const ag of raw) {
			const [dd, mm, yyyy] = String(ag.data || '').split('/').map((x) => parseInt(x, 10));
			if (!yyyy || !mm || !dd) continue;
			const d = new Date(yyyy, mm - 1, dd);
			const key = monthKey(d);
			if (!bucket.has(key)) bucket.set(key, new Map());
			const service = normalizeServiceName(ag.servico || '');
			const map = bucket.get(key);
			map.set(service, (map.get(service) || 0) + 1);
		}

		// Se algum dos serviços alvo não existir nos dados, mantém zero
		const seriesData = targetServices.map((srv) =>
			monthKeys.map((mk) => (bucket.get(mk)?.get(srv) || 0))
		);

		const ds = [
			{
				label: 'Troca de Óleo',
				data: seriesData[0],
				borderColor: COLORS.primary,
				backgroundColor: `${COLORS.primary}33`,
				tension: 0.35,
				fill: true,
				pointRadius: 3,
				pointBackgroundColor: '#fff',
				pointBorderColor: COLORS.primary,
			},
			{
				label: 'Injeção Elétrica',
				data: seriesData[1],
				borderColor: COLORS.green,
				backgroundColor: `${COLORS.green}33`,
				tension: 0.35,
				fill: true,
				pointRadius: 3,
				pointBackgroundColor: '#fff',
				pointBorderColor: COLORS.green,
			},
			{
				label: 'Revisão',
				data: seriesData[2],
				borderColor: COLORS.orange,
				backgroundColor: `${COLORS.orange}33`,
				tension: 0.35,
				fill: true,
				pointRadius: 3,
				pointBackgroundColor: '#fff',
				pointBorderColor: COLORS.orange,
			},
			{
				label: 'Alinhamento',
				data: seriesData[3],
				borderColor: COLORS.amber,
				backgroundColor: `${COLORS.amber}33`,
				tension: 0.35,
				fill: true,
				pointRadius: 3,
				pointBackgroundColor: '#fff',
				pointBorderColor: COLORS.amber,
			},
		];

		return { labels: labelNames, datasets: ds };
	}, [raw]);

	const options = {
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: {
				position: 'bottom',
				labels: { boxWidth: 12, boxHeight: 12, color: '#000' },
			},
			title: { display: false },
			tooltip: { enabled: true },
		},
		scales: {
			x: {
				grid: { color: COLORS.grid, borderColor: COLORS.border },
				ticks: { color: '#444' },
			},
			y: {
				beginAtZero: true,
				grid: { color: COLORS.grid, borderColor: COLORS.border, borderDash: [4, 4] },
				ticks: { color: '#444' },
			},
		},
	};

	return (
		<div style={{ width: '100%', height: 270 }}>
			<Line data={{ labels, datasets }} options={options} />
		</div>
	);
}