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

interface Customer {
  id: string;
  name: string;
  mobile_number: string;
  ward_number: number | null;
  is_active: boolean;
  panchayats?: { name: string } | null;
}

interface CustomersTableProps {
  customers: Customer[];
  isLoading: boolean;
  onEdit: (customer: Customer) => void;
  onDelete: (customer: Customer) => void;
  onToggleActive: (customer: Customer) => void;
}

const CustomersTable: React.FC<CustomersTableProps> = ({
  customers,
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
            <TableHead>Name</TableHead>
            <TableHead>Mobile</TableHead>
            <TableHead>Panchayat</TableHead>
            <TableHead>Ward</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {customers.map((customer) => (
            <TableRow key={customer.id}>
              <TableCell className="font-medium">{customer.name}</TableCell>
              <TableCell>{customer.mobile_number}</TableCell>
              <TableCell>{customer.panchayats?.name || '-'}</TableCell>
              <TableCell>{customer.ward_number || '-'}</TableCell>
              <TableCell>
                <Badge variant={customer.is_active ? 'default' : 'secondary'}>
                  {customer.is_active ? 'Active' : 'Inactive'}
                </Badge>
              </TableCell>
              <TableCell>
                <UsersTableActions
                  isActive={customer.is_active}
                  onEdit={() => onEdit(customer)}
                  onDelete={() => onDelete(customer)}
                  onToggleActive={() => onToggleActive(customer)}
                />
              </TableCell>
            </TableRow>
          ))}
          {customers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-muted-foreground">
                No customers found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default CustomersTable;
