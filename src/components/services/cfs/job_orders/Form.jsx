import React, { useState } from 'react';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import { Plus, Upload } from 'lucide-react';
import { Select, SelectItem } from '@/components/ui/Select';
import TextArea from '@/components/ui/TextArea';
import OrderInput from '../OrderInput';
import { Dialog } from '@/components/ui/Dialog';
import MultiSelectDatalist from '@/components/ui/MultiSelectDatalist';
import { useCollection } from '@/hooks/useCollection';
import Input from '@/components/ui/Input';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export default function Form() {
  const { data: containers } = useCollection('containers');
  const { data: cfsServices } = useCollection('sub_services', {
    expand: 'service'
  });
  const { createItem, mutation } = useCollection('cfs_job_order')
  const { user } = useAuth();

  const [formData, setFormData] = useState({
    serviceType: '',
    remarks: '',
    fromDate: new Date().toISOString().split('T')[0],
    toDate: new Date().toISOString().split('T')[0],
    status: 'Pending',
    files: []
  });
  const [selectedContainers, setSelectedContainers] = useState([]);
  const [orderId, setOrderId] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSelectChange = (value) => {
    setFormData({
      ...formData,
      serviceType: value
    });
  };

  const handleReset = () => {
    setFormData({
      serviceType: '',
      remarks: '',
      fromDate: new Date().toISOString().split('T')[0],
      toDate: new Date().toISOString().split('T')[0],
      status: 'Pending',
      files: []
    });
    setOrderId('');
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
      data.append('order', orderId);
      data.append('serviceType', formData.serviceType);
      data.append('fromDate', formData.fromDate);
      data.append('toDate', formData.toDate);
      data.append('remarks', formData.remarks);
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
      toast.success('Created a new job order');
    } catch (error) {
      console.log(error)
      toast.error(error.message);
    } finally {
      handleReset();
      mutation();
      setIsOpen(false);
    }
  };

  return (
    <Dialog
      title={'Add New Job Order'}
      open={isOpen}
      onOpenChange={setIsOpen}
      trigger={
        <Button
          title={'Add New'}
          icon={<Plus />}
          className='rounded-md'
          iconPosition='right'
        />
      }
    >
      <div>
        <form className="grid grid-cols-1 md:grid-cols-2 gap-4 min-w-[60dvw]">
          <OrderInput setOrderId={setOrderId} />

          <div className="flex flex-col gap-2">
            <Label title="Service Type" />
            {
              cfsServices?.length > 0 && (
                <Select value={formData.serviceType} onValueChange={handleSelectChange} placeholder='Select a Service'>
                  {
                    cfsServices
                      .filter((service) => service?.expand?.service?.title === 'CFS')
                      .map((service, index) => (
                        <SelectItem key={index} value={service?.id}>{service?.title}</SelectItem>
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
            <Label title={'Containers'} />
            <MultiSelectDatalist
              label="Select Containers"
              options={containers}
              value={selectedContainers}
              onValueChange={setSelectedContainers}
              getOptionLabel={(container) => `${container.containerNo} - ${container.size}`}
              getOptionValue={(container) => container.id}
              placeholder="Choose containers..."
            />
          </div>


          <div className="flex flex-col gap-2">
            <Label title="Remarks" />
            <TextArea
              name='remarks'
              value={formData.remarks}
              onChange={handleChange}
              placeholder="Enter Remarks...."
            />
          </div>
        </form>

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

        <div className='mt-8'>
          <Button
            title="Submit"
            icon={<Upload />}
            onClick={handleSubmit}
            className="rounded-xl"
          />
        </div>
      </div>
    </Dialog>
  );
};
