import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { getAdminPhones, addPhone, deletePhone } from '@/lib/api';

interface BackendPhone {
  _id: string;
  name: string;
  brand: string;
  price: number;
  image?: string;
  description?: string;
  color?: string;
  warranty?: string;
  battery?: string;
  kit?: string;
  isSold: boolean;
}

export const ManagePhones = () => {
  const { toast } = useToast();
  const [phones, setPhones] = useState<BackendPhone[]>([]);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [deletePhoneId, setDeletePhoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [formData, setFormData] = useState({
    name: '',
    brand: '',
    price: '',
    description: '',
    color: '',
    warranty: '',
    battery: '',
    kit: '',
    image: null as File | null,
  });

  const fetchPhones = async (page: number) => {
    setLoading(true);
    try {
      const response = await getAdminPhones(page);
      console.log("Fetched admin phones:", response);
      
      const data = response.phones ? response.phones : response;
      setPhones(Array.isArray(data) ? data : []);
      
      if(response.totalPages) {
          setTotalPages(response.totalPages);
      }
    } catch (error) {
      console.error(error);
      toast({ title: 'Error', description: 'Failed to fetch phones', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhones(currentPage);
  }, [currentPage]);

  const handleOpenAdd = () => {
    setFormData({
        name: '',
        brand: '',
        price: '',
        description: '',
        color: '',
        warranty: '',
        battery: '',
        kit: '',
        image: null,
    });
    setIsAddOpen(true);
  };

  const handleSave = async () => {
    if (!formData.name || !formData.brand || !formData.price) {
      toast({
        title: 'Error',
        description: 'Please fill in required fields (Name, Brand, Price)',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
        const data = new FormData();
        data.append('name', formData.name);
        data.append('brand', formData.brand);
        data.append('price', formData.price);
        if (formData.description) data.append('description', formData.description);
        if (formData.color) data.append('color', formData.color);
        if (formData.warranty) data.append('warranty', formData.warranty);
        if (formData.battery) data.append('battery', formData.battery);
        if (formData.kit) data.append('kit', formData.kit);
        if (formData.image) data.append('image', formData.image);

        await addPhone(data);
        toast({ title: 'Success', description: 'Phone added successfully' });
        setIsAddOpen(false);
        fetchPhones(currentPage);
    } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to add phone', variant: 'destructive' });
    } finally {
        setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (deletePhoneId) {
      try {
        await deletePhone(deletePhoneId);
        toast({ title: 'Success', description: 'Phone deleted successfully' });
        setDeletePhoneId(null);
        fetchPhones(currentPage);
      } catch (error) {
        console.error(error);
        toast({ title: 'Error', description: 'Failed to delete phone', variant: 'destructive' });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Manage Phones</h1>
          <p className="text-muted-foreground mt-1">
            Add or remove phones from your inventory
          </p>
        </div>
        <Button onClick={handleOpenAdd} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Phone
        </Button>
      </div>

      <div className="bg-white rounded-lg border">
        <Table>
            {/* Table Header & Body as before */}
          <TableHeader>
            <TableRow>
              <TableHead>Product Name</TableHead>
              <TableHead>Brand</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Color</TableHead>
              <TableHead>Warranty</TableHead>
              <TableHead>Battery</TableHead>
              <TableHead>Kit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
                <TableRow>
                    <TableCell colSpan={9} className="text-center py-8">Loading phones...</TableCell>
                </TableRow>
            ) : phones && phones.length > 0 ? (
              phones.map((phone) => (
              <TableRow key={phone._id}>
                <TableCell className="font-medium">{phone.name}</TableCell>
                <TableCell>{phone.brand}</TableCell>
                <TableCell>₹{phone.price.toLocaleString('en-IN')}</TableCell>
                <TableCell>{phone.color || '-'}</TableCell>
                <TableCell>{phone.warranty || '-'}</TableCell>
                <TableCell>{phone.battery || '-'}</TableCell>
                <TableCell>{phone.kit || '-'}</TableCell>
                <TableCell>
                  <span className={phone.isSold ? 'text-red-500 font-bold' : 'text-green-500 font-bold'}>
                    {phone.isSold ? 'SOLD' : 'AVAILABLE'}
                  </span>
                </TableCell>
                <TableCell className="text-right">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => setDeletePhoneId(phone._id)}
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                </TableCell>
              </TableRow>
            ))) : (
                <TableRow>
                     <TableCell colSpan={9} className="text-center py-8">
                        No phones found.
                        <br />
                        <Button variant="link" onClick={() => fetchPhones(currentPage)}>Retry Fetch</Button>
                     </TableCell>
                </TableRow>
            )}
          </TableBody>
        </Table>

         {/* Pagination Controls */}
         {totalPages > 1 && (
            <div className="flex justify-center items-center p-4 border-t gap-2">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1 || loading}
                >
                    Previous
                </Button>
                <div className="flex items-center gap-1 text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages || loading}
                >
                    Next
                </Button>
            </div>
        )}
      </div>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Phone</DialogTitle>
          </DialogHeader>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2 col-span-2">
              <Label htmlFor="name">Product Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., PRE-OWNED APPLE IPHONE 13 128GB"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand}
                onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                placeholder="e.g., APPLE"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="color">Color</Label>
              <Input
                id="color"
                value={formData.color}
                onChange={(e) => setFormData({ ...formData, color: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="warranty">Warranty</Label>
              <Input
                id="warranty"
                value={formData.warranty}
                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="battery">Battery</Label>
              <Input
                id="battery"
                value={formData.battery}
                onChange={(e) => setFormData({ ...formData, battery: e.target.value })}
              />
            </div>
             <div className="space-y-2">
              <Label htmlFor="kit">Access Kit</Label>
              <Input
                id="kit"
                value={formData.kit}
                onChange={(e) => setFormData({ ...formData, kit: e.target.value })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="image">Image (Optional)</Label>
              <Input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => setFormData({ ...formData, image: e.target.files ? e.target.files[0] : null })}
              />
            </div>
            <div className="space-y-2 col-span-2">
              <Label htmlFor="description">Description</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700" disabled={loading}>
              {loading ? 'Saving...' : 'Save Phone'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog
        open={!!deletePhoneId}
        onOpenChange={() => setDeletePhoneId(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
