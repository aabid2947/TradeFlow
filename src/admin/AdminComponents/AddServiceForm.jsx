import { useState, useEffect } from 'react';

// A reusable input component
const Input = ({ label, name, value, onChange, type = 'text', placeholder, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <input
            type={type}
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
        />
    </div>
);

// A reusable select component
const Select = ({ label, name, value, onChange, children, required = false }) => (
    <div>
        <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
        <select
            id={name}
            name={name}
            value={value}
            onChange={onChange}
            required={required}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
        >
            {children}
        </select>
    </div>
);

// A default empty state for creating a new service
const defaultServiceState = {
    name: '',
    service_key: '',
    description: '',
    category:'',
    subcategory: '', // Added subcategory
    price: 0,
    combo_price: {
        monthly: 0,
        yearly: 0,
    },
    endpoint: '',
    apiType: 'json',
    inputFields: [],
    outputFields: [],
};

// Static list of categories
const serviceCategories = [
  { value: 'Identity Verification', label: 'Identity Verification' },
  { value: 'Financial & Business Checks', label: 'Financial & Business Checks' },
  { value: 'Legal & Compliance Checks', label: 'Legal & Compliance Checks' },
  { value: 'Health & Government Records', label: 'Health & Government Records' },
  { value: 'Biometric & AI-Based Verification', label: 'Biometric & AI-Based Verification' },
  { value: 'Profile & Database Lookup', label: 'Profile & Database Lookup' },
  { value: 'Criminal Verification', label: 'Criminal Verification' },
  { value: 'Land Record Check', label: 'Land Record Check' },
  {value:'Empoyer Verification', label: 'Empoyer Verification'}
];


export default function AddServiceForm({ onSubmit, onClose, isLoading, error, initialData = null }) {
    const [service, setService] = useState(defaultServiceState);
    const [imageFile, setImageFile] = useState(null); // State for the image file
    const [showCustomCategory, setShowCustomCategory] = useState(false);
    const isUpdateMode = !!initialData;

    useEffect(() => {
        if (initialData) {
            const data = {
                ...defaultServiceState,
                ...initialData,
                combo_price: {
                    monthly: initialData.combo_price?.monthly || 0,
                    yearly: initialData.combo_price?.yearly || 0,
                }
            };
            setService(data);
            // Show custom field if category is not in the predefined list
            const isCustom = data.category && !serviceCategories.some(c => c.value === data.category);
            setShowCustomCategory(isCustom);
        } else {
            setService(defaultServiceState);
            setShowCustomCategory(false);
        }
        setImageFile(null); // Reset image on form open
    }, [initialData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setService(prev => ({ ...prev, [name]: value }));
    };
    
    // --- MODIFIED: Handler for category selection ---
    const handleCategoryChange = (e) => {
        const { value } = e.target;
        if (value === 'add_new') {
            setShowCustomCategory(true);
            setService(prev => ({ ...prev, category: '' }));
        } else {
            setShowCustomCategory(false);
            setService(prev => ({ ...prev, category: value }));
        }
    };

    const handleImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    const handleComboPriceChange = (e) => {
        const { name, value } = e.target;
        setService(prev => ({
            ...prev,
            combo_price: {
                ...prev.combo_price,
                [name]: value ? parseFloat(value) : 0,
            }
        }));
    };

    const handleFieldChange = (e, index, fieldType) => {
        const { name, value } = e.target;
        const updatedFields = [...service[fieldType]];
        updatedFields[index] = { ...updatedFields[index], [name]: value };
        setService(prev => ({ ...prev, [fieldType]: updatedFields }));
    };

    const addField = (fieldType) => {
        setService(prev => ({
            ...prev,
            [fieldType]: [...prev[fieldType], { name: '', label: '', type: 'text', placeholder: '' }]
        }));
    };

    const removeField = (index, fieldType) => {
        const updatedFields = service[fieldType].filter((_, i) => i !== index);
        setService(prev => ({ ...prev, [fieldType]: updatedFields }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSubmit(service, imageFile);
    };

    const renderFieldArray = (fieldType) => (
        <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 capitalize">{fieldType.replace('Fields', ' Fields')}</h3>
            {service[fieldType].map((field, index) => (
                <div key={index} className="p-4 border border-gray-200 rounded-md space-y-3 relative">
                    <button type="button" onClick={() => removeField(index, fieldType)} className="absolute top-2 right-2 text-red-500 hover:text-red-700 font-bold text-xl">×</button>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Input label="Field Name" name="name" value={field.name} onChange={(e) => handleFieldChange(e, index, fieldType)} placeholder="e.g., pan_number" required />
                        <Input label="Label" name="label" value={field.label} onChange={(e) => handleFieldChange(e, index, fieldType)} placeholder="e.g., PAN Number" required />
                        <Select label="Type" name="type" value={field.type} onChange={(e) => handleFieldChange(e, index, fieldType)} required>
                            <option value="text">Text</option>
                            <option value="number">Number</option>
                            <option value="file">File</option>
                            <option value="date">Date</option>
                            <option value="string">String</option>
                            <option value="object">Object</option>
                            <option value="array">Array</option>
                        </Select>
                        <Input label="Placeholder" name="placeholder" value={field.placeholder} onChange={(e) => handleFieldChange(e, index, fieldType)} placeholder="e.g., Enter your PAN" />
                    </div>
                </div>
            ))}
            <button type="button" onClick={() => addField(fieldType)} className="text-sm font-medium text-blue-600 hover:text-blue-800">
                + Add {fieldType === 'inputFields' ? 'Input' : 'Output'} Field
            </button>
        </div>
    );

    return (
        <>
            <div className="fixed inset-0 bg-transparent bg-opacity-30 backdrop-blur-sm z-40" onClick={onClose} aria-hidden="true"></div>
            <div className="fixed inset-0 flex justify-center items-center z-50 p-4">
                <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                    <form onSubmit={handleSubmit} className="p-6 space-y-6">
                        <div className="flex justify-between items-start">
                            <h2 className="text-2xl font-bold text-gray-900">{isUpdateMode ? 'Update Service' : 'Add New Service'}</h2>
                            <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
                        </div>

                        {error && (
                            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                                <strong className="font-bold">Error: </strong>
                                <span>{error.data?.message || 'An unknown error occurred.'}</span>
                            </div>
                        )}
                        
                        <div className="p-4 border border-gray-200 rounded-md space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="Service Name" name="name" value={service.name} onChange={handleChange} required />
                                <Input label="Service Key" name="service_key" value={service.service_key} onChange={handleChange} required />
                                <Input label="Price" name="price" type="number" value={service.price} onChange={handleChange} required />
                                
                                <Input label="Monthly Combo Price" name="monthly" type="number" value={service.combo_price.monthly} onChange={handleComboPriceChange} required />
                                <Input label="Yearly Combo Price" name="yearly" type="number" value={service.combo_price.yearly} onChange={handleComboPriceChange} required />
                                
                                {/* --- MODIFIED: Category selection logic --- */}
                                <Select 
                                    label="Category" 
                                    name="category" 
                                    value={showCustomCategory ? 'add_new' : service.category} 
                                    onChange={handleCategoryChange}
                                >
                                    <option value="">Select a category (optional)</option>
                                    {serviceCategories.map(cat => (
                                        <option key={cat.value} value={cat.value}>{cat.label}</option>
                                    ))}
                                    <option value="add_new">--- Add New Category ---</option>
                                </Select>

                                {showCustomCategory && (
                                    <Input 
                                        label="New Category Name" 
                                        name="category" 
                                        value={service.category} 
                                        onChange={handleChange} 
                                        placeholder="Enter new category name"
                                        required
                                    />
                                )}

                                <Input label="Subcategory" name="subcategory" value={service.subcategory} onChange={handleChange} placeholder="e.g., Advanced Checks" />
                                
                                <div>
                                    <label htmlFor="image" className="block text-sm font-medium text-gray-700">Service Image</label>
                                    <input
                                        type="file"
                                        id="image"
                                        name="image"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                    />
                                </div>
                            </div>
                            <div>
                                <label htmlFor="description" className="block text-sm font-medium text-gray-700">Description</label>
                                <textarea id="description" name="description" value={service.description} onChange={handleChange} rows="3" className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm" required></textarea>
                            </div>
                        </div>

                        <div className="p-4 border border-gray-200 rounded-md space-y-4">
                            <h3 className="text-lg font-medium text-gray-900">API Configuration</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input label="API Endpoint" name="endpoint" value={service.endpoint} onChange={handleChange} required />
                                <Select label="API Type" name="apiType" value={service.apiType} onChange={handleChange} required>
                                    <option value="json">JSON</option>
                                    <option value="form">Form Data (for files)</option>
                                </Select>
                            </div>
                        </div>

                        {renderFieldArray('inputFields')}
                        {renderFieldArray('outputFields')}

                        <div className="flex justify-end space-x-4 pt-4">
                            <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">Cancel</button>
                            <button type="submit" disabled={isLoading} className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300">
                                {isLoading ? 'Saving...' : (isUpdateMode ? 'Update Service' : 'Save Service')}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}