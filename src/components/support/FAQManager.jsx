'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { chatService } from '@/services/chatService';
import { toast } from 'sonner';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Save, 
  X,
  HelpCircle
} from 'lucide-react';

/**
 * FAQ Manager Component
 * Allows GOL staff to manage frequently asked questions
 */
export default function FAQManager() {
  const { user } = useAuth();
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingFaq, setEditingFaq] = useState(null);
  const [isCreating, setIsCreating] = useState(false);
  const [formData, setFormData] = useState({
    question: '',
    answer: '',
    tags: []
  });

  useEffect(() => {
    loadFAQs();
  }, []);

  const loadFAQs = async () => {
    try {
      setLoading(true);
      const faqList = await chatService.pb.collection('faqs').getList(1, 100, {
        sort: '-created'
      });
      setFaqs(faqList.items);
    } catch (error) {
      toast.error('Failed to load FAQs');
      console.error('Error loading FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSaveFaq = async () => {
    if (!formData.question.trim() || !formData.answer.trim()) {
      toast.error('Question and answer are required');
      return;
    }

    try {
      const faqData = {
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        tags: formData.tags
      };

      if (editingFaq) {
        await chatService.pb.collection('faqs').update(editingFaq.id, faqData);
        toast.success('FAQ updated successfully');
      } else {
        await chatService.pb.collection('faqs').create(faqData);
        toast.success('FAQ created successfully');
      }

      setFormData({ question: '', answer: '', tags: [] });
      setEditingFaq(null);
      setIsCreating(false);
      loadFAQs();
    } catch (error) {
      toast.error('Failed to save FAQ');
      console.error('Error saving FAQ:', error);
    }
  };

  const handleEditFaq = (faq) => {
    setFormData({
      question: faq.question,
      answer: faq.answer,
      tags: faq.tags || []
    });
    setEditingFaq(faq);
    setIsCreating(true);
  };

  const handleDeleteFaq = async (faqId) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) {
      return;
    }

    try {
      await chatService.pb.collection('faqs').delete(faqId);
      toast.success('FAQ deleted successfully');
      loadFAQs();
    } catch (error) {
      toast.error('Failed to delete FAQ');
      console.error('Error deleting FAQ:', error);
    }
  };

  const handleCancel = () => {
    setFormData({ question: '', answer: '', tags: [] });
    setEditingFaq(null);
    setIsCreating(false);
  };

  const filteredFaqs = faqs.filter(faq =>
    faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
    faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
          <p className="text-gray-600">Loading FAQs...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow">
      {/* Header */}
      <div className="p-6 border-b">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold text-gray-900">FAQ Management</h2>
          <button
            onClick={() => setIsCreating(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add FAQ
          </button>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search FAQs..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Create/Edit Form */}
      {isCreating && (
        <div className="p-6 border-b bg-gray-50">
          <h3 className="text-lg font-medium text-gray-900 mb-4">
            {editingFaq ? 'Edit FAQ' : 'Create New FAQ'}
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question
              </label>
              <input
                type="text"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the question..."
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer
              </label>
              <textarea
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                rows={4}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter the answer..."
              />
            </div>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300"
              >
                <X className="w-4 h-4 mr-2 inline" />
                Cancel
              </button>
              <button
                onClick={handleSaveFaq}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <Save className="w-4 h-4 mr-2 inline" />
                {editingFaq ? 'Update' : 'Create'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FAQs List */}
      <div className="divide-y divide-gray-200">
        {filteredFaqs.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <HelpCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <p>No FAQs found</p>
            {searchTerm && (
              <p className="text-sm mt-2">Try adjusting your search criteria</p>
            )}
          </div>
        ) : (
          filteredFaqs.map((faq) => (
            <div key={faq.id} className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {faq.question}
                  </h3>
                  <div
                    className="text-gray-600 prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: faq.answer }}
                  />
                  <div className="mt-3 text-xs text-gray-500">
                    Created: {new Date(faq.created).toLocaleString()}
                    {faq.updated !== faq.created && (
                      <span className="ml-4">
                        Updated: {new Date(faq.updated).toLocaleString()}
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 ml-4">
                  <button
                    onClick={() => handleEditFaq(faq)}
                    className="p-2 text-gray-400 hover:text-blue-600"
                  >
                    <Edit className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2 text-gray-400 hover:text-red-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {filteredFaqs.length > 0 && (
        <div className="p-4 border-t bg-gray-50 text-sm text-gray-600">
          Showing {filteredFaqs.length} of {faqs.length} FAQs
        </div>
      )}
    </div>
  );
}
