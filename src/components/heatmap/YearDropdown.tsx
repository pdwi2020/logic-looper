export interface YearDropdownProps {
  selectedYear: number;
  onChange: (year: number) => void;
}

const startYear = 2024;

export function YearDropdown({ selectedYear, onChange }: YearDropdownProps) {
  const currentYear = new Date().getFullYear();
  const totalYears = Math.max(1, currentYear - startYear + 1);
  const years = Array.from(
    { length: totalYears },
    (_, index) => currentYear - index,
  );

  return (
    <label className="inline-flex items-center gap-2 font-sans text-sm font-medium text-brand-dark">
      <span className="text-brand-dark-gray">Year</span>
      <select
        value={selectedYear}
        onChange={(event) => {
          onChange(Number(event.target.value));
        }}
        className="rounded-md border border-brand-light-steel bg-brand-white px-3 py-1.5 text-sm text-brand-dark outline-none transition-colors focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
      >
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </label>
  );
}
