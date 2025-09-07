import { Table } from '@tanstack/react-table';
import { TokenRow } from '@/src/features/scanner/types';

type Props = {
  table: Table<TokenRow>;
};

export const ColumnGroup = ({ table }: Props) => (
  <colgroup>
    {table.getVisibleLeafColumns().map((col, i) => (
      <col
        key={col.id}
        style={
          i === table.getVisibleLeafColumns().length - 1
            ? { width: 'auto' }
            : { width: `${col.getSize()}px` }
        }
      />
    ))}
  </colgroup>
);
