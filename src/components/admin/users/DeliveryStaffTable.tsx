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

interface DeliveryStaff {
  id: string;
  name: string;
  mobile_number: string;
  vehicle_type: string;
  is_active: boolean;
  is_approved: boolean;
  is_available: boolean;
  total_deliveries: number | null;
  panchayats?: { name: string } | null;
}

interface DeliveryStaffTableProps {
  deliveryStaff: DeliveryStaff[];
  isLoading: boolean;
  onEdit: (staff: DeliveryStaff) => void;
  onDelete: (staff: DeliveryStaff) => void;
  onToggleActive: (staff: DeliveryStaff) => void;
}

const DeliveryStaffTable: React.FC<DeliveryStaffTableProps> = ({
  deliveryStaff,
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
            <TableHead>Vehicle</TableHead>
            <TableHead>Deliveries</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="w-[50px]">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {deliveryStaff.map((staff) => (
            <TableRow key={staff.id}>
              <TableCell className="font-medium">{staff.name}</TableCell>
              <TableCell>{staff.mobile_number}</TableCell>
              <TableCell>{staff.panchayats?.name || '-'}</TableCell>
              <TableCell>{staff.vehicle_type}</TableCell>
              <TableCell>{staff.total_deliveries || 0}</TableCell>
              <TableCell>
                <div className="flex gap-1">
                  <Badge variant={staff.is_approved ? 'default' : 'destructive'}>
                    {staff.is_approved ? 'Approved' : 'Pending'}
                  </Badge>
                  {staff.is_available && (
                    <Badge variant="outline" className="border-primary text-primary">
                      Available
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <UsersTableActions
                  isActive={staff.is_active}
                  onEdit={() => onEdit(staff)}
                  onDelete={() => onDelete(staff)}
                  onToggleActive={() => onToggleActive(staff)}
                />
              </TableCell>
            </TableRow>
          ))}
          {deliveryStaff.length === 0 && (
            <TableRow>
              <TableCell colSpan={7} className="text-center text-muted-foreground">
                No delivery staff found
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default DeliveryStaffTable;
