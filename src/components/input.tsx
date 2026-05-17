export default function Input({
  label,
  id,
  name,
  type,
  placeholder,
  value,
  onChange,
}: {
  label: string;
  id: string;
  name: string;
  type: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="block text-sm font-medium text-gray-700 mb-1"
      >
        {label}
      </label>

      <input
        type={type}
        id={id}
        name={name}
        required={true}
        aria-required={true}
        value={value}
        onChange={onChange}
        className="w-full px-4 py-2 bg-white border border-gray-300 rounded-md text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-colors"
        placeholder={placeholder}
      />
    </div>
  );
}
