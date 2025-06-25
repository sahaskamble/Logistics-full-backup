import React, { useState } from 'react';
import Input from '@/components/ui/Input';
import Label from '@/components/ui/Label';
import Button from '@/components/ui/Button';
import { Plus, Upload } from 'lucide-react';
import OrderInput from '../OrderInput';
import JobOrderInput from '../JobOrderInput';
import { Dialog } from '@/components/ui/Dialog';
import TextArea from '@/components/ui/TextArea';
import { useCollection } from '@/hooks/useCollection';
import ContainerInput from '../ContainerInput';
import { toast } from 'sonner';

export default function Form({ serviceName = '' }) {
  const { data: cfsServices } = useCollection('sub_services', {
    expand: 'service'
  });
  const { createItem, mutation } = useCollection('cfs_service_details');

  const [formData, setFormData] = useState({
    agent: '',
    receiptNo: '',
    type: '',
    status: 'Pending',
    date: new Date().toISOString().split('T')[0],
    remarks: '',
    files: []
  });

  const [orderId, setOrderId] = useState('');
  const [jobOrderId, setJobOrderId] = useState('')
  const [containerNumber, setContainerNumber] = useState('')
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleReset = () => {
    setFormData({
      agent: '',
      receiptNo: '',
      type: '',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      remarks: '',
      files: []
    });
    setOrderId('');
    setJobOrderId('');
    setContainerNumber('');
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

      const type = cfsServices.find((service) => service?.expand?.service?.title === 'CFS' && service?.title === serviceName)
      if (type?.id) {
        const data = new FormData();
        data.append('order', orderId);
        data.append('jobOrder', jobOrderId);
        data.append('container', containerNumber);
        data.append('type', type?.id);
        data.append('agent', formData.agent);
        data.append('date', formData.date);
        data.append('receiptNo', formData.receiptNo);
        data.append('remarks', formData.remarks);
        data.append('status', formData.status);
        // Append each file
        formData.files.forEach((file) => {
          data.append('files', file); // `files` must match the PocketBase field name
        });

        console.log('Form submitted:', data);
        await createItem(data);
        toast.success('Created a new entry');
      } else {
        toast.info('Please select a service before adding...');
      }
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
      title={`Add New ${serviceName} Entry`}
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
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:w-[40dvw]">

          <OrderInput setOrderId={setOrderId} />
          <JobOrderInput setOrderId={setJobOrderId} />
          <ContainerInput setContainerId={setContainerNumber} />

          <div className='flex flex-col gap-2'>
            <Label title={'Agent / Supervisor'} />
            <Input
              type="text"
              name="agent"
              value={formData.agent}
              onChange={handleChange}
              placeholder="Enter Agent Name"
              className="bg-accent"
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label title="Date of Execution" />
            <Input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              placeholder="Select date"
              className="bg-accent"
            />
          </div>

          <div className='flex flex-col gap-2'>
            <Label title={'Receipt No.'} />
            <Input
              type="text"
              name="receiptNo"
              value={formData.receiptNo}
              onChange={handleChange}
              placeholder="Enter Receipt No. (if any)"
              className="bg-accent"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2">
          <Label title="Remarks" />
          <TextArea
            name="remarks"
            placeholder="Optional remarks..."
            value={formData.remarks}
            onChange={handleChange}
            className="bg-accent"
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
          <Button title={'Upload'} icon={<Upload />} iconPosition='right' className='rounded-xl' />
        </div>
      </form>
    </Dialog>
  );
};
