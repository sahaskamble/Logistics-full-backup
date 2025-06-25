import { useEffect, useState } from "react";
import { Upload, Plus } from "lucide-react";
import Button from "@/components/ui/Button";
import { Dialog } from "@/components/ui/Dialog";
import Input from "@/components/ui/Input";
import Label from "@/components/ui/Label";
import { Select, SelectItem } from "@/components/ui/Select";
import { useCollection } from "@/hooks/useCollection";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import MultiSelectDatalist from "@/components/ui/MultiSelectDatalist";

export default function Form() {
  const { user } = useAuth();
  const { data: containers } = useCollection('containers');
  const { data: serviceProviders } = useCollection('allowed_service_providers', {
    expand: 'provider,provider.service'
  });
  const { createItem, mutation } = useCollection('warehouse_orders');

  const [formData, setFormData] = useState({
    igmNo: '',
    blNo: '',
    boeNo: '',
    consigneeName: '',
    chaName: '',
    provider: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    orderDescription: '',
    status: 'Pending',
    files: []
  });
  const [selectedContainers, setSelectedContainers] = useState([])
  const [filteredContainers, setFilteredContainers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleReset = () => {
    setFormData({
      igmNo: '',
      blNo: '',
      boeNo: '',
      consigneeName: '',
      chaName: '',
      provider: '',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      orderDescription: '',
      status: 'Pending',
      files: []
    });
    setSelectedContainers([]);
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prev) => ({
      ...prev,
      files
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = new FormData();
      data.append('igmNo', formData.igmNo);
      data.append('blNo', formData.blNo);
      data.append('boeNo', formData.boeNo);
      data.append('consigneeName', formData.consigneeName);
      data.append('chaName', formData.chaName);
      data.append('provider', formData.provider);
      data.append('fromDate', formData.fromDate);
      data.append('toDate', formData.toDate);
      data.append('orderDescription', formData.orderDescription);
      data.append('customer', user.id);
      data.append('createdBy', user.id);
      data.append('status', formData.status);
      // Append container IDs as JSON
      data.append('containers', JSON.stringify(selectedContainers));
      // Append each file
      formData.files.forEach((file) => {
        data.append('files', file); // `files` must match the PocketBase field name
      });

      console.log('Form submitted:', data);
      await createItem(data);
      toast.success('Created a new order');
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      // handleReset();
      mutation();
      setIsOpen(false);
    }
  };

  useEffect(() => {
    console.log('Containers', containers);
    if (containers?.length > 0) {
      setFilteredContainers(containers);
    }
  }, [containers]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          title={'New Order'}
          icon={<Plus className='w-5 h-5' />}
          iconPosition='right'
          className='rounded-md'
          textSize='text-sm'
        />
      }
      title="Create New Order"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[60dvw]">
        <div className='flex flex-col gap-2'>
          <Label title={'IGM Number'} />
          <Input
            type="text"
            name="igmNo"
            value={formData.igmNo}
            onChange={handleChange}
            placeholder="Enter IGM number"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'BL Number'} />
          <Input
            type="text"
            name="blNo"
            value={formData.blNo}
            onChange={handleChange}
            placeholder="Enter BL number"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'BOE Number'} />
          <Input
            type="text"
            name="boeNo"
            value={formData.boeNo}
            onChange={handleChange}
            placeholder="Enter BOE number"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Consignee Name'} />
          <Input
            type="text"
            name="consigneeName"
            value={formData.consigneeName}
            onChange={handleChange}
            placeholder="Enter Consignee Name"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'CHA Name'} />
          <Input
            type="text"
            name="chaName"
            value={formData.chaName}
            onChange={handleChange}
            placeholder="Enter CHA Name"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Warehouse Facility'} />
          {
            serviceProviders?.length > 0 && (
              <Select value={formData.provider} onValueChange={(value) => setFormData({ ...formData, provider: value })} placeholder='Select Warehouse Facility'>
                {
                  serviceProviders
                    .filter((provider) => {
                      const services = provider?.expand?.provider?.expand?.service
                      const condition = services.find((service) => service?.title === 'Warehouse')
                      if (condition?.id) {
                        return provider
                      }
                    })
                    .map((provider, index) => (
                      <SelectItem
                        key={index}
                        value={provider?.provider}>{provider?.expand?.provider?.title} - {provider?.expand?.provider?.location}
                      </SelectItem>
                    ))
                }
              </Select>
            )
          }
        </div>

        <div className='flex flex-col gap-2'>
          <Label title="From Date" />
          <Input
            type="date"
            name="fromDate"
            value={formData.fromDate}
            onChange={handleChange}
            placeholder="Select date"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title="To Date" />
          <Input
            type="date"
            name="toDate"
            value={formData.toDate}
            onChange={handleChange}
            placeholder="Select date"
            className='bg-accent'
          />
        </div>

        <div className='flex flex-col gap-2'>
          <Label title={'Order Description'} />
          <Input
            type="text"
            name="orderDescription"
            value={formData.orderDescription}
            onChange={handleChange}
            placeholder="Enter Order Description"
            className='bg-accent'
          />
        </div>
      </div>


      <div className='flex flex-col gap-2 mt-4'>
        <Label title={'Containers'} />
        <MultiSelectDatalist
          label="Select Containers"
          options={filteredContainers}
          value={selectedContainers}
          onValueChange={setSelectedContainers}
          getOptionLabel={(container) => `${container?.containerNo} - ${container?.size}`}
          getOptionValue={(container) => container?.id}
          placeholder="Choose containers..."
        />
      </div>

      <div className='flex flex-col gap-2 mt-4'>
        <Label title={'Upload Documents'} />
        <div className="flex items-center gap-2 mt-2">
          <label className="flex items-center cursor-pointer border rounded-xl px-4 py-2 bg-accent">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M9 19l3 3m0 0l3-3m-3 3V10"></path>
            </svg>
            <span className='text-sm'>Choose File</span>
            <input
              type="file"
              className="hidden"
              multiple
              onChange={handleFileChange}
            />
          </label>
          <span className="ml-2 text-sm text-gray-500">
            {formData.files.length > 0
              ? formData.files.map((file) => file.name).join(', ')
              : 'No files chosen'}
          </span>
        </div>
      </div>


      <div className="mt-6">
        <Button onClick={handleSubmit} title={'Submit Request'} icon={<Upload />} iconPosition='right' className='rounded-xl' />
      </div>
    </Dialog>
  );
}
