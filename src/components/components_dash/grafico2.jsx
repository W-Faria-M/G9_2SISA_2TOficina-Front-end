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

const COLORS = [
	'#3B82F6', // azul
	'#34D399', // verde
	'#F97316', // laranja
	'#F59E0B', // amarelo
	'#9333EA', // roxo
	'#E11D48', // vermelho
	'#10B981', // verde água
];

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

// ✅ Função protegida contra null
function normalizeServiceName(name) {
	if (!name || typeof name !== 'string') {
		console.warn('Serviço nulo ou inválido detectado:', name);
		return '';
	}
	return name
		.normalize('NFD')
		.replace(/\p{Diacritic}/gu, '')
		.toLowerCase()
		.trim();
}

export default function Grafico2() {
	const [raw, setRaw] = useState([]);

	useEffect(() => {
		fetch('http://localhost:8080/agendamentos/kpi4')
			.then((r) => r.json())
			.then((j) => setRaw(j.agendamentos || []))
			.catch((err) => {
				console.error('Erro ao carregar dados:', err);
				setRaw([]);
			});
	}, []);

	const { labels, datasets } = useMemo(() => {
		const months = getLastMonths(6);
		const labelNames = months.map((d) =>
			d
				.toLocaleDateString('pt-BR', { month: 'long' })
				.replace(/^./, (c) => c.toUpperCase())
		);
		const monthKeys = months.map(monthKey);

		// 🔹 Identificar automaticamente os serviços únicos no retorno
		const uniqueServices = Array.from(
			new Set(raw.map((ag) => normalizeServiceName(ag.servico)))
		).filter(Boolean);

		// bucket[monthKey][service] = count
		const bucket = new Map();
		for (const ag of raw) {
			const [dd, mm, yyyy] = String(ag.data || '').split('/').map((x) => parseInt(x, 10));
			if (!yyyy || !mm || !dd) continue;
			const d = new Date(yyyy, mm - 1, dd);
			const key = monthKey(d);
			if (!bucket.has(key)) bucket.set(key, new Map());
			const service = normalizeServiceName(ag.servico);
			const map = bucket.get(key);
			map.set(service, (map.get(service) || 0) + 1);
		}

		// Montar datasets dinamicamente com base nos serviços encontrados
		const datasets = uniqueServices.map((srv, i) => {
			const data = monthKeys.map((mk) => bucket.get(mk)?.get(srv) || 0);
			const color = COLORS[i % COLORS.length];
			return {
				label: srv
					.split(' ')
					.map((w) => w.charAt(0).toUpperCase() + w.slice(1))
					.join(' '),
				data,
				borderColor: color,
				backgroundColor: `${color}33`,
				tension: 0.35,
				fill: true,
				pointRadius: 3,
				pointBackgroundColor: '#fff',
				pointBorderColor: color,
			};
		});

		return { labels: labelNames, datasets };
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
				grid: { color: 'rgba(242, 116, 5, 0.2)', borderColor: '#F27405' },
				ticks: { color: '#444' },
			},
			y: {
				beginAtZero: true,
				grid: {
					color: 'rgba(242, 116, 5, 0.2)',
					borderColor: '#F27405',
					borderDash: [4, 4],
				},
				ticks: { color: '#444' },
			},
		},
	};

	return (
		<div style={{ width: '100%', height: 350 }}>
			<Line data={{ labels, datasets }} options={options} />
		</div>
	);
}

