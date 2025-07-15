import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import { FiSave, FiUpload, FiX, FiTag, FiEdit3, FiUser, FiCalendar } from 'react-icons/fi';
import { MdOutlinePublish } from "react-icons/md";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate, useParams } from 'react-router-dom';

const WriteBlog = () => {
  const { id } = useParams();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    image: null,
    categories: [],
    status: 'draft',
  });
  const [originalFormData, setOriginalFormData] = useState(null); // <--- add this
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const [loadingButton, setLoadingButton] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [wordCount, setWordCount] = useState(0);
  const navigate = useNavigate();

  const modules = {
    toolbar: [
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'color': [] }, { 'background': [] }],
      [{ 'list': 'ordered' }, { 'list': 'bullet' }],
      [{ 'indent': '-1' }, { 'indent': '+1' }],
      [{ 'align': [] }],
      ['blockquote', 'code-block'],
      ['link'],
      ['clean']
    ],
  };

  const formats = [
    'header', 'bold', 'italic', 'underline', 'strike',
    'color', 'background', 'list', 'indent',
    'align', 'blockquote', 'code-block', 'link'
  ];

  const categoryOptions = [
    { value: 'artificial_intelligence', label: 'Artificial Intelligence', color: 'bg-purple-100 text-purple-800' },
    { value: 'hardware', label: 'Hardware', color: 'bg-blue-100 text-blue-800' },
    { value: 'smartphone', label: 'Smartphone', color: 'bg-green-100 text-green-800' },
    { value: 'gaming', label: 'Gaming', color: 'bg-red-100 text-red-800' },
    { value: 'how_to', label: 'How To', color: 'bg-yellow-100 text-yellow-800' },
    { value: 'news', label: 'News', color: 'bg-indigo-100 text-indigo-800' },
    { value: 'other', label: 'Other', color: 'bg-gray-100 text-gray-800' }
  ];

  // Fetch blog details if editing
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      const fetchBlog = async () => {
        try {
          const token = localStorage.getItem('access');
          const res = await fetch(`http://127.0.0.1:8000/api/blogs/${id}/`, {
            headers: token ? { 'Authorization': `Bearer ${token}` } : {},
          });
          if (res.ok) {
            const data = await res.json();
            const newFormData = {
              title: data.title || '',
              content: data.content || '',
              image: null, // Don't prefill file input
              categories: data.category ? data.category.map(cat => cat.slug) : [],
              status: data.status || 'draft',
            };
            setFormData(newFormData);
            setOriginalFormData(newFormData); // <--- set original data
            setImagePreview(data.image ? (data.image.startsWith('http') ? data.image : `http://127.0.0.1:8000${data.image}`) : null);
            setWordCount(data.content ? data.content.replace(/<[^>]*>/g, '').trim().split(/\s+/).filter(word => word.length > 0).length : 0);
          }
        } catch (err) {
          // Optionally handle error
        }
      };
      fetchBlog();
    } else {
      setIsEditMode(false);
      setOriginalFormData(null); // <--- reset original data
      setFormData({
        title: '',
        content: '',
        image: null,
        categories: [],
        status: 'draft',
      });
      setImagePreview(null);
      setWordCount(0);
      setErrors({});
    }
  }, [id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleContentChange = (value) => {
    setFormData(prev => ({ ...prev, content: value }));
    const text = value.replace(/<[^>]*>/g, '');
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    setWordCount(words.length);
    if (errors.content) {
      setErrors(prev => ({ ...prev, content: '' }));
    }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        setErrors(prev => ({ ...prev, image: 'Please upload a valid image file (JPEG, PNG, GIF, WebP)' }));
        return;
      }
      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({ ...prev, image: 'Image size must be less than 5MB' }));
        return;
      }
      setFormData(prev => ({ ...prev, image: file }));
      const reader = new FileReader();
      reader.onload = (e) => setImagePreview(e.target.result);
      reader.readAsDataURL(file);
      setErrors(prev => ({ ...prev, image: '' }));
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, image: null }));
    setImagePreview(null);
    document.getElementById('image-upload').value = '';
  };

  const handleCategoryChange = (value) => {
    setFormData(prev => ({
      ...prev,
      categories: prev.categories.includes(value)
        ? prev.categories.filter(cat => cat !== value)
        : [...prev.categories, value]
    }));
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.title.trim()) newErrors.title = 'Title is required';
    else if (formData.title.length > 200) newErrors.title = 'Title must be less than 200 characters';
    if (!formData.content.trim() || formData.content === '<p><br></p>') newErrors.content = 'Content is required';
    if (!formData.categories.length) newErrors.categories = 'Select at least one category';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (status) => {
    if (!validateForm()) return;
    setLoadingButton(status);
    const form = new FormData();
    form.append('title', formData.title);
    form.append('content', formData.content);
    if (formData.image) form.append('image', formData.image);
    formData.categories.forEach(slug => form.append('category_slugs', slug));
    form.append('status', status);

    try {
      const token = localStorage.getItem('access');
      let url = 'http://127.0.0.1:8000/api/blogs/';
      let method = 'POST';
      if (id) {
        url = `http://127.0.0.1:8000/api/blogs/${id}/update/`;
        method = 'PATCH';
      }
      const response = await fetch(url, {
        method,
        body: form,
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
      });
      const data = await response.json();
      if (response.ok) {
        setLoadingButton(null);
        toast.success(`Blog ${status === 'draft' ? 'saved as draft' : (isEditMode ? 'updated' : 'published')} successfully!`);
        setFormData({
          title: '',
          content: '',
          image: null,
          categories: [],
          status: 'draft',
        });
        setImagePreview(null);
        setWordCount(0);
        if ((status === 'published' || isEditMode) && data.slug) {
          navigate(`/blog/${data.slug}`);
        }
      } else {
        setLoadingButton(null);
        if (data && typeof data === 'object') {
          setErrors(data);
          toast.error('Failed to submit blog. Please check the form.');
          console.log('Backend error:', data);
        } else {
          toast.error('Failed to submit blog.');
        }
      }
    } catch (error) {
      setLoadingButton(null);
      toast.error('An error occurred while submitting the blog.');
    }
  };

  const generateSlug = (title) => {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  };

  // Helper to check if form is dirty (ignoring image)
  const isFormDirty = isEditMode && originalFormData && (
    formData.title !== originalFormData.title ||
    formData.content !== originalFormData.content ||
    JSON.stringify(formData.categories) !== JSON.stringify(originalFormData.categories) ||
    formData.status !== originalFormData.status ||
    formData.image !== null // if a new image is selected
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
      {/* Header */}
      <div className="bg-white shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center">
                <FiEdit3 className="h-8 w-8 text-slate-600" />
                <h1 className="ml-3 text-xl font-semibold text-slate-900">
                  {isEditMode ? 'Edit Article' : 'New Article'}
                </h1>
              </div>
              <div className="hidden sm:flex items-center space-x-4 text-sm text-slate-500">
                <div className="flex items-center">
                  <FiUser className="h-4 w-4 mr-1" />
                  <span>John Doe</span>
                </div>
                <div className="flex items-center">
                  <FiCalendar className="h-4 w-4 mr-1" />
                  <span>{new Date().toLocaleDateString()}</span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => handleSubmit('draft')}
                className="flex items-center px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 font-medium transition-colors disabled:opacity-50 text-sm"
                disabled={isEditMode || loadingButton === 'draft' || loadingButton === 'published'}
              >
                {loadingButton === 'draft' ? (
                  <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                ) : (
                  <FiSave className="mr-2 h-4 w-4" />
                )}
                Save Draft
              </button>
              {isEditMode ? (
                <button
                  type="button"
                  onClick={() => handleSubmit('published')}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 font-medium transition-colors disabled:opacity-50 text-sm"
                  disabled={loadingButton === 'published' || !isFormDirty}
                >
                  {loadingButton === 'published' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <FiEdit3 className="mr-2 h-4 w-4" />
                  )}
                  Edit
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => handleSubmit('published')}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium transition-colors disabled:opacity-50 text-sm"
                  disabled={loadingButton === 'published'}
                >
                  {loadingButton === 'published' ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  ) : (
                    <MdOutlinePublish className="mr-2 h-4 w-4" />
                  )}
                  Publish
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Title Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
                  Article Title
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className={`w-full px-4 py-3 text-xl border-0 border-b-2 focus:outline-none focus:border-blue-500 bg-transparent transition-colors ${errors.title ? 'border-red-500' : 'border-slate-200'
                    }`}
                  placeholder="Enter your article title..."
                  maxLength={200}
                />
                {errors.title && <p className="mt-2 text-sm text-red-600">{errors.title}</p>}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-sm text-slate-500">{formData.title.length}/200 characters</p>
                  {formData.title && (
                    <p className="text-sm text-slate-500">Slug: {generateSlug(formData.title)}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Content Editor Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <div className="mb-4">
                <label className="block text-sm font-medium text-slate-700 mb-2">Content</label>
                <div className="flex items-center space-x-4 mb-4 text-sm text-slate-500">
                  <div className="flex items-center">
                    <span>{wordCount} words</span>
                  </div>
                </div>
              </div>
              <div className={`border rounded-lg overflow-hidden ${errors.content ? 'border-red-500' : 'border-slate-200'}`} style={{ height: '500px', position: 'relative' }}>
                <ReactQuill
                  theme="snow"
                  value={formData.content}
                  onChange={handleContentChange}
                  modules={modules}
                  formats={formats}
                  style={{ height: '100%' }}
                  placeholder="Start writing your article..."
                />
              </div>
              {errors.content && <p className="mt-2 text-sm text-red-600">{errors.content}</p>}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Featured Image Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Featured Image</h3>
              <div className="space-y-4">
                {imagePreview ? (
                  <div className="relative">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded-lg border border-slate-200"
                    />
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                    >
                      <FiX size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-slate-400 transition-colors">
                    <FiUpload className="mx-auto h-8 w-8 text-slate-400 mb-2" />
                    <p className="text-sm text-slate-600 mb-1">Upload featured image</p>
                    <p className="text-xs text-slate-500">PNG, JPG, GIF up to 5MB</p>
                  </div>
                )}
                <input
                  type="file"
                  id="image-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
                <label
                  htmlFor="image-upload"
                  className="w-full inline-flex items-center justify-center px-4 py-2 border border-slate-300 rounded-lg text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <FiUpload className="mr-2 h-4 w-4" />
                  Choose Image
                </label>
                {errors.image && <p className="text-sm text-red-600">{errors.image}</p>}
              </div>
            </div>

            {/* Categories Card */}
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">
                <FiTag className="inline mr-2 h-5 w-5" />
                Categories
              </h3>
              <div className="space-y-2">
                {categoryOptions.map(category => (
                  <label
                    key={category.value}
                    className={`flex items-center px-3 py-2 rounded-lg cursor-pointer transition-all ${formData.categories.includes(category.value)
                      ? 'bg-blue-50 border-blue-200 text-blue-700 border'
                      : 'hover:bg-slate-50 border border-transparent'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={formData.categories.includes(category.value)}
                      onChange={() => handleCategoryChange(category.value)}
                      className="mr-3 h-4 w-4 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm font-medium">{category.label}</span>
                  </label>
                ))}
                {errors.categories && <p className="text-sm text-red-600">{errors.categories}</p>}
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WriteBlog;
