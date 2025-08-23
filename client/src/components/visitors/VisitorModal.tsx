import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { useVisitorStore } from '@/store/visitorStore';
import { Visitor } from '@/types/visitor';
import { useToast } from '@/hooks/use-toast';

const visitorSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  company: z.string().min(1, 'Company is required'),
  purpose: z.string().min(1, 'Purpose of visit is required'),
  hostName: z.string().min(1, 'Host name is required'),
});

type VisitorForm = z.infer<typeof visitorSchema>;

interface VisitorModalProps {
  isOpen: boolean;
  onClose: () => void;
  visitor?: Visitor | null;
  mode: 'add' | 'edit';
}

export function VisitorModal({ isOpen, onClose, visitor, mode }: VisitorModalProps) {
  const { addVisitor, updateVisitor } = useVisitorStore();
  const { toast } = useToast();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting }
  } = useForm<VisitorForm>({
    resolver: zodResolver(visitorSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      company: '',
      purpose: '',
      hostName: '',
    }
  });

  // Reset form when visitor changes or modal opens
  useEffect(() => {
    if (isOpen) {
      if (mode === 'edit' && visitor) {
        reset({
          name: visitor.name,
          email: visitor.email,
          phone: visitor.phone,
          company: visitor.company,
          purpose: visitor.purpose,
          hostName: visitor.hostName,
        });
      } else {
        reset({
          name: '',
          email: '',
          phone: '',
          company: '',
          purpose: '',
          hostName: '',
        });
      }
    }
  }, [isOpen, visitor, mode, reset]);

  const onSubmit = async (data: VisitorForm) => {
    try {
      if (mode === 'edit' && visitor) {
        updateVisitor(visitor.id, data);
        toast({
          title: 'Visitor updated',
          description: 'Visitor information has been updated successfully.',
        });
      } else {
        addVisitor(data);
        toast({
          title: 'Visitor added',
          description: 'New visitor has been added successfully.',
        });
      }
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again.',
        variant: 'destructive',
      });
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'edit' ? 'Edit Visitor' : 'Add New Visitor'}
          </DialogTitle>
          <DialogClose className="absolute right-4 top-4">
            {/* <X className="h-4 w-4" /> */}
          </DialogClose>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                placeholder="Enter full name"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">{errors.name.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter email address"
                {...register('email')}
              />
              {errors.email && (
                <p className="text-sm text-destructive">{errors.email.message}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                placeholder="Enter phone number"
                {...register('phone')}
              />
              {errors.phone && (
                <p className="text-sm text-destructive">{errors.phone.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                placeholder="Enter company name"
                {...register('company')}
              />
              {errors.company && (
                <p className="text-sm text-destructive">{errors.company.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="hostName">Host Name</Label>
            <Input
              id="hostName"
              placeholder="Enter host name"
              {...register('hostName')}
            />
            {errors.hostName && (
              <p className="text-sm text-destructive">{errors.hostName.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="purpose">Purpose of Visit</Label>
            <Textarea
              id="purpose"
              placeholder="Enter purpose of visit"
              rows={3}
              {...register('purpose')}
            />
            {errors.purpose && (
              <p className="text-sm text-destructive">{errors.purpose.message}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
            >
              {isSubmitting 
                ? (mode === 'edit' ? 'Updating...' : 'Adding...') 
                : (mode === 'edit' ? 'Update Visitor' : 'Add Visitor')
              }
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}