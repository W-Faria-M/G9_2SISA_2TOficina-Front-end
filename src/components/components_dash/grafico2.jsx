import React, { useEffect, useMemo, useState } from 'react';
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
	const [range, setRange] = useState(null); // { left: {year, monthIndex}, right: {year, monthIndex} }

	useEffect(() => {
		// endpoint que retorna registros agregados por mês/serviço
		fetch('http://localhost:8080/servicos/estatisticas/quantidade-por-mes')
			.then((r) => r.json())
			.then((j) => setRaw(j || []))
			.catch((err) => {
				console.error('Erro ao carregar dados:', err);
				setRaw([]);
			});
	}, []);

	const { labels, datasets } = useMemo(() => {
		// determine months to show: either exactly the two selected in `range` or the last 2 months
		let months = [];
		if (range && range.left && range.right) {
			const leftMonth = new Date(range.left.year, range.left.monthIndex, 1);
			const rightMonth = new Date(range.right.year, range.right.monthIndex, 1);
			months.push(leftMonth);
			if (!(leftMonth.getFullYear() === rightMonth.getFullYear() && leftMonth.getMonth() === rightMonth.getMonth())) {
				months.push(rightMonth);
			}
		} else {
			months = getLastMonths(2);
		}

		const labelNames = months.map((d) =>
			d.toLocaleDateString('pt-BR', { month: 'short' }).replace(/^./, (c) => c.toUpperCase())
		);
		const monthKeys = months.map(monthKey);

		// prepare buckets only for the months we show
		const bucket = new Map();
		const totalPerService = new Map();
		for (const mk of monthKeys) bucket.set(mk, new Map());

		// `raw` now contains aggregated rows with fields: ano, mes, idServico, nomeServico, totalServicos
		for (const row of raw) {
			const ano = row.ano;
			const mes = row.mes; // 1..12
			if (!ano || !mes) continue;
			const key = `${ano}-${String(mes).padStart(2, '0')}`;
			if (!bucket.has(key)) continue; // skip rows outside the selected months
			const serviceRawName = row.nomeServico || '';
			const service = normalizeServiceName(serviceRawName) || 'outros';
			const count = Number(row.totalServicos || 0);
			const map = bucket.get(key);
			map.set(service, (map.get(service) || 0) + count);
			totalPerService.set(service, (totalPerService.get(service) || 0) + count);
		}

		// top N services to avoid visual clutter (based on selected months)
		const TOP_N = 6;
		const sorted = Array.from(totalPerService.entries()).sort((a, b) => b[1] - a[1]).map((e) => e[0]);
		const topServices = sorted.slice(0, TOP_N);
		const otherServices = sorted.slice(TOP_N);
		const serviceList = topServices.slice();
		if (otherServices.length) serviceList.push('outros');

		// datasets per service (each dataset will produce a colored horizontal bar per month)
		const datasets = serviceList.map((srv, i) => {
			const data = monthKeys.map((mk) => {
				if (srv === 'outros') {
					let sum = 0;
					const m = bucket.get(mk) || new Map();
					for (const s of otherServices) sum += m.get(s) || 0;
					return sum;
				}
				return bucket.get(mk)?.get(srv) || 0;
			});
			const color = COLORS[i % COLORS.length];
			const label = srv === 'outros' ? 'Outros' : srv.split(' ').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
			return {
				label,
				data,
				backgroundColor: color,
				borderColor: '#fff',
				borderWidth: 1,
			};
		});

		return { labels: labelNames, datasets };
	}, [raw, range]);

	const options = {
		indexAxis: 'y',
		responsive: true,
		maintainAspectRatio: false,
		plugins: {
			legend: { position: 'bottom', labels: { boxWidth: 12, boxHeight: 12, color: '#000' } },
			tooltip: { enabled: true, mode: 'index', intersect: false },
			title: { display: false },
		},
		scales: {
			x: { beginAtZero: true, ticks: { color: '#444', precision: 0 }, grid: { color: 'rgba(0,0,0,0.06)' } },
			y: { grid: { display: false }, ticks: { color: '#444' } },
		},
		interaction: { mode: 'index', intersect: false },
		elements: { bar: { borderRadius: 4, borderSkipped: false, maxBarThickness: 20 } },
	};

	return (
		<>
		<div className='GF2'>
			<h2 className='GF2-title'>SERVIÇOS REALIZADOS NOS MESES SELECIONADOS:</h2>
			<Filtros1 onChange={setRange} />
			<div style={{ width: '100%', height: 250 }}>
				<Bar data={{ labels, datasets }} options={options} />
			</div>
		</div>
		</>
		
	);
}

