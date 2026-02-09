import * as React from 'react';
import { Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

// Parse input value to extract components
const parseTimeValue = (value: string): { hour: string; minute: string; period: string } => {
	const match = value.match(/^(\d{1,2}):(\d{2})\s?(AM|PM)?$/i);
	if (match) {
		return {
			hour: match[1].padStart(2, '0'),
			minute: match[2],
			period: match[3]?.toUpperCase() || 'AM',
		};
	}
	return { hour: '12', minute: '00', period: 'AM' };
};

// Validate and clamp time values
const clampTime = (digits: string[]): string[] => {
	const result = [...digits];
	const hour = parseInt(result[0] + result[1], 10);
	if (hour > 12) {
		result[0] = '1';
		result[1] = '2';
	}
	const minute = parseInt(result[2] + result[3], 10);
	if (minute > 59) {
		result[2] = '5';
		result[3] = '9';
	}
	return result;
};

export function TimePicker({ value = '', onChange, label, className }: TimePickerProps) {
	const [open, setOpen] = React.useState(false);
	const [periodOpen, setPeriodOpen] = React.useState(false);
	const [localTime, setLocalTime] = React.useState('12:00');
	const inputRef = React.useRef<HTMLInputElement>(null);

	// Parse the value or use default
	const parsed = value ? parseTimeValue(value) : { hour: '12', minute: '00', period: 'AM' };
	const currentPeriod = parsed.period;

	const [hour, setHour] = React.useState(parsed.hour);
	const [minute, setMinute] = React.useState(parsed.minute);
	const [period, setPeriod] = React.useState(parsed.period);

	// Update local time when value prop changes
	React.useEffect(() => {
		if (value) {
			const p = parseTimeValue(value);
			setLocalTime(`${p.hour}:${p.minute}`);
			setHour(p.hour);
			setMinute(p.minute);
			setPeriod(p.period);
		}
	}, [value]);

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		const input = inputRef.current;
		if (!input) return;

		const cursorPos = input.selectionStart || 0;
		const digits = localTime.replace(/\D/g, '').split('');

		// Map cursor position to digit index (position 2 is colon)
		const getDigitIndex = (pos: number): number => {
			if (pos < 2) return pos;
			if (pos === 2) return 2; // At colon, next digit is index 2
			return pos - 1;
		};

		// Handle digit input
		if (/^\d$/.test(e.key)) {
			e.preventDefault();
			const digitIdx = getDigitIndex(cursorPos);
			if (digitIdx >= 0 && digitIdx < 4) {
				digits[digitIdx] = e.key;
				const clamped = clampTime(digits);
				const newTime = `${clamped[0]}${clamped[1]}:${clamped[2]}${clamped[3]}`;
				setLocalTime(newTime);
				onChange?.(`${newTime} ${currentPeriod}`);

				// Move cursor forward
				let nextPos = cursorPos + 1;
				if (nextPos === 2) nextPos = 3; // Skip colon
				if (nextPos > 5) nextPos = 5;

				setTimeout(() => input.setSelectionRange(nextPos, nextPos), 0);
			}
		}
		// Handle backspace
		else if (e.key === 'Backspace') {
			e.preventDefault();
			if (cursorPos > 0) {
				let deletePos = cursorPos - 1;
				if (deletePos === 2) deletePos = 1; // Skip colon, delete hour digit
				const digitIdx = getDigitIndex(deletePos);
				if (digitIdx >= 0 && digitIdx < 4) {
					digits[digitIdx] = '0';
					const newTime = `${digits[0]}${digits[1]}:${digits[2]}${digits[3]}`;
					setLocalTime(newTime);
					onChange?.(`${newTime} ${currentPeriod}`);

					let newPos = deletePos;
					if (newPos === 2) newPos = 1;
					setTimeout(() => input.setSelectionRange(newPos, newPos), 0);
				}
			}
		}
		// Handle delete key
		else if (e.key === 'Delete') {
			e.preventDefault();
			const digitIdx = getDigitIndex(cursorPos);
			if (digitIdx >= 0 && digitIdx < 4) {
				digits[digitIdx] = '0';
				const newTime = `${digits[0]}${digits[1]}:${digits[2]}${digits[3]}`;
				setLocalTime(newTime);
				onChange?.(`${newTime} ${currentPeriod}`);
			}
		}
		// Allow arrow keys, tab, etc.
		else if (!['ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'].includes(e.key)) {
			e.preventDefault();
		}
	};

	// Prevent onChange from doing anything - all logic is in onKeyDown
	const handleTimeInputChange = () => {};

	const handlePeriodToggle = (newPeriod: string) => {
		setPeriodOpen(false);
		const fullValue = `${localTime} ${newPeriod}`;
		setPeriod(newPeriod);
		onChange?.(fullValue);
	};

	const handleOpenModal = () => {
		if (value) {
			const p = parseTimeValue(value);
			setHour(p.hour);
			setMinute(p.minute);
			setPeriod(p.period);
		}
		setOpen(true);
	};

	const handleSave = () => {
		const formattedTime = `${hour.padStart(2, '0')}:${minute.padStart(2, '0')} ${period}`;
		onChange?.(formattedTime);
		setOpen(false);
	};

	const hours = Array.from({ length: 12 }, (_, i) => (i + 1).toString().padStart(2, '0'));
	const minutes = Array.from({ length: 60 }, (_, i) => i.toString().padStart(2, '0'));

	return (
		<div className={cn('flex flex-col gap-2', className)}>
			{label && <Label>{label}</Label>}

			{/* Input: [HH:MM] [AM/PM toggle] [clock icon] */}
			<div className="relative flex items-center h-[55px] rounded-lg border border-gray-200 bg-white focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
				{/* Time Input */}
				<input
					ref={inputRef}
					type="text"
					value={localTime}
					onChange={handleTimeInputChange}
					onKeyDown={handleKeyDown}
					maxLength={5}
					className="w-16 h-full px-3 text-base bg-transparent border-none outline-none text-center"
				/>

				{/* Period Toggle */}
				<div className="relative">
					<button
						type="button"
						onClick={() => setPeriodOpen(!periodOpen)}
						className="px-3 py-1.5 text-sm font-semibold text-purple-600 bg-purple-50 rounded-md hover:bg-purple-100 transition-colors">
						{currentPeriod}
					</button>
					{periodOpen && (
						<div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 overflow-hidden">
							<button
								type="button"
								onClick={() => handlePeriodToggle('AM')}
								className={cn(
									'block w-full px-4 py-2 text-sm text-left hover:bg-gray-50',
									currentPeriod === 'AM' && 'bg-purple-50 text-purple-600 font-semibold',
								)}>
								AM
							</button>
							<button
								type="button"
								onClick={() => handlePeriodToggle('PM')}
								className={cn(
									'block w-full px-4 py-2 text-sm text-left hover:bg-gray-50',
									currentPeriod === 'PM' && 'bg-purple-50 text-purple-600 font-semibold',
								)}>
								PM
							</button>
						</div>
					)}
				</div>

				{/* Clock Icon */}
				<button
					type="button"
					onClick={handleOpenModal}
					className="p-2 mr-2 rounded-md hover:bg-gray-100 transition-colors">
					<Clock className="h-5 w-5 text-gray-400" />
				</button>
			</div>

			{/* Modal Dialog */}
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogContent className="sm:max-w-[420px] p-0 overflow-hidden rounded-2xl border-none shadow-2xl">
					{/* Header - Plain Color */}
					<div className="bg-[#1F1F1F] px-6 py-5">
						<DialogHeader>
							<DialogTitle className="text-white text-xl font-semibold">Select Time</DialogTitle>
							<p className="text-white/70 text-sm mt-1">Choose hour, minute and period</p>
						</DialogHeader>
					</div>

					{/* Time Selectors */}
					<div className="p-6">
						<div className="flex gap-3 items-stretch">
							{/* Hour */}
							<div className="flex-1">
								<label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Hour</label>
								<select
									value={hour}
									onChange={(e) => setHour(e.target.value)}
									className="w-full h-14 px-4 text-center text-2xl font-semibold bg-gray-50 border border-gray-200 rounded-xl appearance-none cursor-pointer hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
									{hours.map((h) => (
										<option key={h} value={h}>
											{h}
										</option>
									))}
								</select>
							</div>

							<span className="text-3xl font-bold text-gray-300 self-end pb-3">:</span>

							{/* Minute */}
							<div className="flex-1">
								<label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Minute</label>
								<select
									value={minute}
									onChange={(e) => setMinute(e.target.value)}
									className="w-full h-14 px-4 text-center text-2xl font-semibold bg-gray-50 border border-gray-200 rounded-xl appearance-none cursor-pointer hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all">
									{minutes.map((m) => (
										<option key={m} value={m}>
											{m}
										</option>
									))}
								</select>
							</div>

							{/* Period */}
							<div className="flex-1">
								<label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Period</label>
								<div className="flex flex-col gap-1">
									<button
										type="button"
										onClick={() => setPeriod('AM')}
										className={cn(
											'h-6 rounded-lg font-semibold text-sm transition-all',
											period === 'AM'
												? 'bg-purple-600 text-white shadow-md'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
										)}>
										AM
									</button>
									<button
										type="button"
										onClick={() => setPeriod('PM')}
										className={cn(
											'h-6 rounded-lg font-semibold text-sm transition-all',
											period === 'PM'
												? 'bg-purple-600 text-white shadow-md'
												: 'bg-gray-100 text-gray-600 hover:bg-gray-200',
										)}>
										PM
									</button>
								</div>
							</div>
						</div>

						{/* Preview */}
						<div className="mt-6 p-4 bg-gray-50 rounded-xl text-center">
							<p className="text-sm text-gray-500 mb-1">Selected Time</p>
							<p className="text-3xl font-bold text-gray-900">
								{hour}:{minute.padStart(2, '0')} <span className="text-purple-600">{period}</span>
							</p>
						</div>

						{/* Actions */}
						<div className="flex gap-3 mt-6">
							<Button
								variant="outline"
								onClick={() => setOpen(false)}
								className="flex-1 h-12 rounded-xl border-gray-200">
								Cancel
							</Button>
							<Button variant="gradient" onClick={handleSave} className="flex-1 h-12 rounded-xl">
								Confirm
							</Button>
						</div>
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
