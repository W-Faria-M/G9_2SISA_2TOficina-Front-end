import React, { useMemo, useState, useEffect } from 'react';

const MONTHS = [
    'Janeiro',
    'Fevereiro',
    'Março',
    'Abril',
    'Maio',
    'Junho',
    'Julho',
    'Agosto',
    'Setembro',
    'Outubro',
    'Novembro',
    'Dezembro',
];

// Props:
// - years: array of numbers (ex: [2021,2022,2023,2024,2025])
// - initial: { left: { year, monthIndex }, right: { year, monthIndex } }
// - onChange: function({ left, right }) called when selection changes
// - disableFuture: boolean (default true) - disables months after current month for current year
export default function Filtros1({ years = [], initial = null, onChange = () => {}, disableFuture = true }) {
    const current = new Date();
    const thisYear = current.getFullYear();
    const thisMonthIndex = current.getMonth();

    const availableYears = useMemo(() => {
        if (years && years.length) return years;
        // default: from last year up to current year (updates automatically when year changes)
        const start = thisYear - 1;
        const arr = [];
        for (let y = start; y <= thisYear; y++) arr.push(y);
        return arr;
    }, [years, thisYear]);

    const defaultInitial = useMemo(() => {
        const leftYear = availableYears[0] || thisYear;
        const rightYear = availableYears[availableYears.length - 1] || thisYear;
        return {
            left: { year: leftYear, monthIndex: 0 },
            right: { year: rightYear, monthIndex: 0 },
        };
    }, [availableYears, thisYear]);

    const [left, setLeft] = useState((initial && initial.left) || defaultInitial.left);
    const [right, setRight] = useState((initial && initial.right) || defaultInitial.right);

    useEffect(() => {
        onChange({ left, right });
    }, [left, right]);

    function monthsForYear(year) {
        if (!disableFuture) return MONTHS.map((m, i) => ({ label: m, i, disabled: false }));
        if (year < thisYear) return MONTHS.map((m, i) => ({ label: m, i, disabled: false }));
        // year === thisYear -> disable months after current month
        return MONTHS.map((m, i) => ({ label: m, i, disabled: i > thisMonthIndex }));
    }

    function renderSelector(side, value, setValue) {
        const months = monthsForYear(value.year);
        return (
            <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                <div style={{ display: 'flex', flexDirection: 'row', gap: 8, alignItems: 'center' }}>
                    <select
                        aria-label={`${side}-year`}
                        value={value.year}
                        onChange={(e) => {
                            const y = parseInt(e.target.value, 10);
                            // if current month becomes disabled, clamp monthIndex
                            const mlist = monthsForYear(y);
                            let newMonth = value.monthIndex;
                            if (mlist[newMonth]?.disabled) {
                                // pick last enabled month
                                const last = mlist.map((m) => m.i).filter((i) => !mlist[i].disabled).pop() ?? 0;
                                newMonth = last;
                            }
                            setValue({ year: y, monthIndex: newMonth });
                        }}
                        style={{ ...selectStyle, width: 120 }}
                    >
                        {availableYears.map((y) => (
                            <option key={y} value={y}>
                                {y}
                            </option>
                        ))}
                    </select>

                    <select
                        aria-label={`${side}-month`}
                        value={value.monthIndex}
                        onChange={(e) => setValue({ ...value, monthIndex: parseInt(e.target.value, 10) })}
                        style={{ ...selectStyle, width: 160 }}
                    >
                        {months.map((m) => (
                            <option key={m.i} value={m.i} disabled={m.disabled}>
                                {m.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
            <div style={boxStyle}>{renderSelector('left', left, setLeft)}</div>
            <div style={{ fontWeight: 700, color: '#222' }}>x</div>
            <div style={boxStyle}>{renderSelector('right', right, setRight)}</div>
        </div>
    );
}

const boxStyle = {
    border: '2px solid #F27405',
    borderRadius: 10,
    padding: '6px 12px',
    display: 'flex',
    alignItems: 'center',
    background: '#fff',
    width: 300,
    height: 44,
    justifyContent: 'center',
};

const selectStyle = {
    appearance: 'none',
    WebkitAppearance: 'none',
    padding: '2px 2px',
    borderRadius: 6,
    border: '1px solid #e5e7eb',
    background: 'transparent',
    fontWeight: 700,
    color: '#F27405',
    height: 32,
    width: 10,
    fontSize: 13,
};
