type Props = { value: string };

export const Chip = ({ value }: Props) => (
  <span
    className={`rounded px-1 text-xs ${value.startsWith('0') ? 'text-red-500' : 'text-green-500'}`}
  >
    {value}%
  </span>
);
