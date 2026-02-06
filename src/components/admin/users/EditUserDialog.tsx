import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface Panchayat {
  id: string;
  name: string;
}

type UserType = 'customer' | 'cook' | 'delivery';

interface EditUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  userType: UserType;
  user: any;
  panchayats: Panchayat[];
  onSave: (data: any) => void;
  isLoading?: boolean;
}

const EditUserDialog: React.FC<EditUserDialogProps> = ({
  open,
  onOpenChange,
  userType,
  user,
  panchayats,
  onSave,
  isLoading = false,
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    if (user) {
      setFormData({ ...user });
    }
  }, [user]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (userType) {
      case 'customer':
        return 'Edit Customer';
      case 'cook':
        return 'Edit Cook';
      case 'delivery':
        return 'Edit Delivery Staff';
      default:
        return 'Edit User';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {userType === 'customer' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={formData.mobile_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_number: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {userType === 'cook' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="kitchen_name">Kitchen Name</Label>
                <Input
                  id="kitchen_name"
                  value={formData.kitchen_name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, kitchen_name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={formData.mobile_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_number: e.target.value })
                  }
                />
              </div>
            </>
          )}

          {userType === 'delivery' && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData.name || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="mobile">Mobile Number</Label>
                <Input
                  id="mobile"
                  value={formData.mobile_number || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, mobile_number: e.target.value })
                  }
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="vehicle_type">Vehicle Type</Label>
                <Input
                  id="vehicle_type"
                  value={formData.vehicle_type || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, vehicle_type: e.target.value })
                  }
                />
              </div>
            </>
          )}

          <div className="grid gap-2">
            <Label htmlFor="panchayat">Panchayat</Label>
            <Select
              value={formData.panchayat_id || ''}
              onValueChange={(value) =>
                setFormData({ ...formData, panchayat_id: value })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select panchayat" />
              </SelectTrigger>
              <SelectContent>
                {panchayats.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2">
            <Switch
              id="is_active"
              checked={formData.is_active ?? true}
              onCheckedChange={(checked) =>
                setFormData({ ...formData, is_active: checked })
              }
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default EditUserDialog;
