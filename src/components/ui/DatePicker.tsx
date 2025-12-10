import { Calendar } from 'lucide-react';

interface DatePickerProps {
    label: string;
    value: string;
    onChange: (value: string) => void;
    disabled?: boolean;
    required?: boolean;
}

// Generate arrays for months and years
const MONTHS = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
];

const currentYear = new Date().getFullYear();
const YEARS = Array.from({ length: 50 }, (_, i) => currentYear - i + 5);

export function DatePicker({ label, value, onChange, disabled = false, required = false }: DatePickerProps) {
    // Parse value (format: YYYY-MM)
    const [year, month] = value ? value.split('-') : ['', ''];

    const handleMonthChange = (newMonth: string) => {
        if (year) {
            onChange(`${year}-${newMonth}`);
        } else {
            onChange(`${currentYear}-${newMonth}`);
        }
    };

    const handleYearChange = (newYear: string) => {
        if (month) {
            onChange(`${newYear}-${month}`);
        } else {
            onChange(`${newYear}-01`);
        }
    };

    return (
        <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300">
                <Calendar className="w-4 h-4" />
                {label} {required && '*'}
            </label>
            <div className="flex gap-2">
                <select
                    value={month}
                    onChange={(e) => handleMonthChange(e.target.value)}
                    disabled={disabled}
                    className="input-field flex-1"
                >
                    <option value="">Month</option>
                    {MONTHS.map(m => (
                        <option key={m.value} value={m.value}>{m.label}</option>
                    ))}
                </select>
                <select
                    value={year}
                    onChange={(e) => handleYearChange(e.target.value)}
                    disabled={disabled}
                    className="input-field w-28"
                >
                    <option value="">Year</option>
                    {YEARS.map(y => (
                        <option key={y} value={y}>{y}</option>
                    ))}
                </select>
            </div>
        </div>
    );
}
