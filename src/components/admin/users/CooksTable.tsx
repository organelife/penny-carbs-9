import React from 'react';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import UsersTableActions from './UsersTableActions';

interface Cook {
  id: string;
  kitchen_name: string;
  mobile_number: string;
  is_active: boolean;
  is_available: boolean;
  rating: number | null;
  total_orders: number | null;
  panchayats?: { name: string } | null;
}

interface CooksTableProps {
  cooks: Cook[];
  isLoading: boolean;
  onEdit: (cook: Cook) => void;
  onDelete: (cook: Cook) => void;
  onToggleActive: (cook: Cook) => void;
}

const CooksTable: React.FC<CooksTableProps> = ({
  cooks,
  isLoading,
  onEdit,
  onDelete,
  onToggleActive,
}) => {
  if (isLoading) {
    return <p className="text-center py-4 text-muted-foreground">Loading...</p>;
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Kitchen Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Panchayat</TableHead>
            <TableHead>Rating</TableHead>
            <TableHead>Orders</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {cooks.map((cook) => (
            <TableRow key={cook.id}>
              <TableCell className="font-medium">{cook.kitchen_name}</TableCell>
              <TableCell>{cook.mobile_number}</TableCell>
              <TableCell>{cook.panchayats?.name || '-'}</TableCell>
              <TableCell>⭐ {cook.rating?.toFixed(1) || '0.0'}</TableCell>
              <TableCell>{cook.total_orders || 0}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Badge variant={cook.is_active ? 'default' : 'secondary'}>
                    {cook.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                  {cook.is_available && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Available
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <UsersTableActions
                  isActive={cook.is_active}
                  onEdit={() => onEdit(cook)}
                  onDelete={() => onDelete(cook)}
                  onToggleActive={() => onToggleActive(cook)}
                />
              </TableCell>
            </TableRow>
          ))}
          {cooks.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No cooks found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CooksTable;
