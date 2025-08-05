import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { ChevronDown, Plus, Save, Trash2, X, Edit, Eye, Image as ImageIcon } from "lucide-react";
import { useCreateBlogMutation, useUpdateBlogMutation, useGetBlogsQuery, useDeleteBlogMutation } from '@/app/api/blogApiSlice';
import { Link } from 'react-router-dom';

// --- Constants ---
const CATEGORIES = ['Technology', 'Security', 'Compliance', 'Global', 'Business', 'General'];
const ICONS = ['ShieldCheck', 'FileText', 'Scale', 'Globe', 'Monitor', 'Gauge', 'Zap', 'BarChart'];

// --- Initial State Definitions ---
const initialBlogState = {
    title: '',
    excerpt: '',
    author: 'VerifyMyKyc Team',
    category: '',
    heroSubtitle: '',
    heroTitle: '',
    heroDescription: '',
    verificationTitle: '',
    verificationDescription: '',
    verificationFeatures: [{ title: '', description: '', icon: 'ShieldCheck' }],
    howItWorksTitle: '',
    howItWorksDescription: '',
    howItWorksSteps: [{ title: '', description: '' }],
    benefitsSubtitle: '',
    benefitsTitle: '',
    benefitsDescription: '',
    productBenefits: [{ title: '', description: '', icon: 'ShieldCheck' }],
    trustTitle: '',
    trustCard1: { title: '', description: '' },
    trustCard2: { title: '', description: '' },
    trustCard3: { title: '', description: '' },
};

const initialImageState = {
    mainImage: null, heroImage1: null, heroImage2: null, howItWorksImage: null, trustImage: null
};

// --- Reusable UI Components ---

const AccordionSection = ({ title, openSection, setOpenSection, sectionName, children }) => {
    const isOpen = openSection === sectionName;
    return (
        <div className="border border-slate-200 rounded-lg overflow-hidden bg-white">
            <button
                type="button"
                className="w-full flex justify-between items-center p-4 bg-slate-50 hover:bg-slate-100 transition-colors"
                onClick={() => setOpenSection(isOpen ? null : sectionName)}
            >
                <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
                <ChevronDown className={`w-5 h-5 text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </button>
            {isOpen && <div className="p-6 space-y-6">{children}</div>}
        </div>
    );
};

const ImageInput = ({ label, fieldName, preview, onChange }) => (
    <div className="space-y-2">
        <Label htmlFor={fieldName}>{label}</Label>
        <div className="flex items-center gap-4">
            <div className="w-24 h-24 bg-slate-100 rounded-md flex items-center justify-center border-2 border-dashed">
                {preview ? (
                    <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover rounded-md" />
                ) : (
                    <ImageIcon className="w-8 h-8 text-slate-400" />
                )}
            </div>
            <Input id={fieldName} type="file" accept="image/*" onChange={(e) => onChange(e, fieldName)} className="flex-1" />
        </div>
    </div>
);

// --- Main Blog Management Component ---

export default function BlogManager() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState(initialBlogState);
    const [imageFiles, setImageFiles] = useState(initialImageState);
    const [imagePreviews, setImagePreviews] = useState(initialImageState);
    const [openSection, setOpenSection] = useState('main');

    const { data: blogsResponse, isLoading: blogsLoading, refetch } = useGetBlogsQuery();
    const [createBlog, { isLoading: createLoading }] = useCreateBlogMutation();
    const [updateBlog, { isLoading: updateLoading }] = useUpdateBlogMutation();
    const [deleteBlog] = useDeleteBlogMutation();
    const blogs = blogsResponse?.data || [];

    const resetForm = () => {
        setIsFormVisible(false);
        setEditingBlog(null);
        setFormData(initialBlogState);
        setImageFiles(initialImageState);
        setImagePreviews(initialImageState);
        setOpenSection('main');
    };

    const handleChange = (path, value) => {
        setFormData(prev => {
            const keys = path.split('.');
            const newState = JSON.parse(JSON.stringify(prev));
            let current = newState;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newState;
        });
    };
    
    const handleImageChange = (e, fieldName) => {
        const file = e.target.files[0];
        if (file) {
            setImageFiles(prev => ({ ...prev, [fieldName]: file }));
            const reader = new FileReader();
            reader.onloadend = () => setImagePreviews(prev => ({ ...prev, [fieldName]: reader.result }));
            reader.readAsDataURL(file);
        }
    };

    const addArrayItem = (arrayName, newItem) => {
        const currentArray = formData[arrayName] || [];
        handleChange(arrayName, [...currentArray, newItem]);
    };

    const removeArrayItem = (arrayName, index) => {
        handleChange(arrayName, formData[arrayName].filter((_, i) => i !== index));
    };

    const handleEdit = (blog) => {
        setEditingBlog(blog);
        const newFormData = {
            ...initialBlogState,
            ...blog,
            verificationFeatures: blog.verificationFeatures?.length ? blog.verificationFeatures : initialBlogState.verificationFeatures,
            howItWorksSteps: blog.howItWorksSteps?.length ? blog.howItWorksSteps : initialBlogState.howItWorksSteps,
            productBenefits: blog.productBenefits?.length ? blog.productBenefits : initialBlogState.productBenefits,
            trustCard1: blog.trustCard1 || initialBlogState.trustCard1,
            trustCard2: blog.trustCard2 || initialBlogState.trustCard2,
            trustCard3: blog.trustCard3 || initialBlogState.trustCard3,
        };
        setFormData(newFormData);
        
        const previews = {};
        Object.keys(initialImageState).forEach(key => {
            previews[key] = blog[key]?.url || null;
        });
        setImagePreviews(previews);
        setImageFiles(initialImageState);
        setIsFormVisible(true);
        setOpenSection('main');
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog?')) {
            await deleteBlog(blogId).unwrap();
            refetch();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formDataToSend = new FormData();
        formDataToSend.append('blogData', JSON.stringify(formData));
        Object.keys(imageFiles).forEach(key => {
            if (imageFiles[key]) formDataToSend.append(key, imageFiles[key]);
        });

        try {
            if (editingBlog) {
                await updateBlog({ id: editingBlog._id, formData: formDataToSend }).unwrap();
            } else {
                await createBlog(formDataToSend).unwrap();
            }
            resetForm();
            refetch();
        } catch (error) {
            console.error("Failed to save blog post:", error);
            alert(`Error: ${error.data?.message || 'An unknown error occurred'}`);
        }
    };

    const renderDynamicList = (arrayName, placeholder1, placeholder2, hasIcon = false) => (
        <div className="space-y-3">
            {(formData[arrayName] || []).map((item, index) => (
                <div key={index} className="grid grid-cols-12 gap-3 p-3 border rounded-md bg-slate-50 items-center">
                    <Input className="col-span-11 md:col-span-4" placeholder={placeholder1} value={item.title} onChange={e => handleChange(`${arrayName}.${index}.title`, e.target.value)} />
                    <Input className="col-span-11 md:col-span-4" placeholder={placeholder2} value={item.description} onChange={e => handleChange(`${arrayName}.${index}.description`, e.target.value)} />
                    {hasIcon && (
                         <div className="col-span-11 md:col-span-3">
                            <Select value={item.icon} onValueChange={v => handleChange(`${arrayName}.${index}.icon`, v)}>
                                <SelectTrigger><SelectValue placeholder="Select Icon" /></SelectTrigger>
                                <SelectContent>{ICONS.map(i => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                            </Select>
                        </div>
                    )}
                    <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(arrayName, index)} className="col-span-1 justify-self-end text-red-500 hover:bg-red-100"><Trash2 className="w-4 h-4"/></Button>
                </div>
            ))}
            <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(arrayName, { title: '', description: '', ...(hasIcon && { icon: 'ShieldCheck' }) })}>
                <Plus className="w-4 h-4 mr-2" /> Add Item
            </Button>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Blog Manager</h1>
                    <p className="text-slate-600 mt-1">Create, edit, and manage all your blog content from one place.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-[#1987BF] hover:bg-blue-700 text-white shadow-sm">
                        <Plus className="w-4 h-4 mr-2" /> Create New Post
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="mb-8 shadow-lg border-slate-200">
                    <CardHeader className="bg-slate-100 flex flex-row items-center justify-between border-b">
                        <CardTitle className="text-xl text-slate-800">{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-5 h-5" /></Button>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4 pt-6">
                            {/* --- Accordion Sections for the form --- */}
                            <AccordionSection title="1. Main Details & SEO" openSection={openSection} setOpenSection={setOpenSection} sectionName="main">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><Label>Title</Label><Input value={formData.title} onChange={e => handleChange('title', e.target.value)} required /></div>
                                    <div><Label>Author</Label><Input value={formData.author} onChange={e => handleChange('author', e.target.value)} required /></div>
                                    <div><Label>Category</Label><Select value={formData.category} onValueChange={v => handleChange('category', v)} required><SelectTrigger><SelectValue placeholder="Select a category"/></SelectTrigger><SelectContent>{CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                                    <div className="md:col-span-2"><Label>Excerpt (Short summary for cards)</Label><Textarea value={formData.excerpt} onChange={e => handleChange('excerpt', e.target.value)} required /></div>
                                    <div className="md:col-span-2"><ImageInput label="Main Blog Image" fieldName="mainImage" preview={imagePreviews.mainImage} onChange={handleImageChange} /></div>
                                </div>
                            </AccordionSection>

                            <AccordionSection title="2. Hero Section" openSection={openSection} setOpenSection={setOpenSection} sectionName="hero">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div><Label>Hero Subtitle</Label><Input value={formData.heroSubtitle} onChange={e => handleChange('heroSubtitle', e.target.value)} /></div>
                                    <div><Label>Hero Title</Label><Input value={formData.heroTitle} onChange={e => handleChange('heroTitle', e.target.value)} /></div>
                                    <div className="md:col-span-2"><Label>Hero Description</Label><Textarea value={formData.heroDescription} onChange={e => handleChange('heroDescription', e.target.value)} /></div>
                                    <ImageInput label="Hero Image 1" fieldName="heroImage1" preview={imagePreviews.heroImage1} onChange={handleImageChange} />
                                    <ImageInput label="Hero Image 2" fieldName="heroImage2" preview={imagePreviews.heroImage2} onChange={handleImageChange} />
                                </div>
                            </AccordionSection>

                            <AccordionSection title="3. Verification Features" openSection={openSection} setOpenSection={setOpenSection} sectionName="verification">
                                <div><Label>Section Title</Label><Input value={formData.verificationTitle} onChange={e => handleChange('verificationTitle', e.target.value)} /></div>
                                <div><Label>Section Description</Label><Textarea value={formData.verificationDescription} onChange={e => handleChange('verificationDescription', e.target.value)} /></div>
                                <h4 className="font-semibold text-slate-700 pt-4">Features List</h4>
                                {renderDynamicList('verificationFeatures', 'Feature Title', 'Feature Description', true)}
                            </AccordionSection>

                            <AccordionSection title="4. How It Works" openSection={openSection} setOpenSection={setOpenSection} sectionName="howItWorks">
                                <div><Label>Section Title</Label><Input value={formData.howItWorksTitle} onChange={e => handleChange('howItWorksTitle', e.target.value)} /></div>
                                <div><Label>Section Description</Label><Textarea value={formData.howItWorksDescription} onChange={e => handleChange('howItWorksDescription', e.target.value)} /></div>
                                <ImageInput label="How It Works Image" fieldName="howItWorksImage" preview={imagePreviews.howItWorksImage} onChange={handleImageChange} />
                                <h4 className="font-semibold text-slate-700 pt-4">Steps</h4>
                                {renderDynamicList('howItWorksSteps', 'Step Title', 'Step Description')}
                            </AccordionSection>

                            <AccordionSection title="5. Product Benefits" openSection={openSection} setOpenSection={setOpenSection} sectionName="benefits">
                                <div><Label>Section Subtitle</Label><Input value={formData.benefitsSubtitle} onChange={e => handleChange('benefitsSubtitle', e.target.value)} /></div>
                                <div><Label>Section Title</Label><Input value={formData.benefitsTitle} onChange={e => handleChange('benefitsTitle', e.target.value)} /></div>
                                <div><Label>Section Description</Label><Textarea value={formData.benefitsDescription} onChange={e => handleChange('benefitsDescription', e.target.value)} /></div>
                                <h4 className="font-semibold text-slate-700 pt-4">Benefits List</h4>
                                {renderDynamicList('productBenefits', 'Benefit Title', 'Benefit Description', true)}
                            </AccordionSection>

                             <AccordionSection title="6. Trust Section" openSection={openSection} setOpenSection={setOpenSection} sectionName="trust">
                                <div><Label>Section Title</Label><Input value={formData.trustTitle} onChange={e => handleChange('trustTitle', e.target.value)} /></div>
                                <ImageInput label="Trust Section Image" fieldName="trustImage" preview={imagePreviews.trustImage} onChange={handleImageChange} />
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4">
                                    <div><Label>Trust Card 1 Title</Label><Input value={formData.trustCard1.title} onChange={e => handleChange('trustCard1.title', e.target.value)} /></div>
                                    <div className="md:col-span-2"><Label>Trust Card 1 Desc</Label><Input value={formData.trustCard1.description} onChange={e => handleChange('trustCard1.description', e.target.value)} /></div>
                                    <div><Label>Trust Card 2 Title</Label><Input value={formData.trustCard2.title} onChange={e => handleChange('trustCard2.title', e.target.value)} /></div>
                                    <div className="md:col-span-2"><Label>Trust Card 2 Desc</Label><Input value={formData.trustCard2.description} onChange={e => handleChange('trustCard2.description', e.target.value)} /></div>
                                    <div><Label>Trust Card 3 Title</Label><Input value={formData.trustCard3.title} onChange={e => handleChange('trustCard3.title', e.target.value)} /></div>
                                    <div className="md:col-span-2"><Label>Trust Card 3 Desc</Label><Input value={formData.trustCard3.description} onChange={e => handleChange('trustCard3.description', e.target.value)} /></div>
                                </div>
                            </AccordionSection>
                            
                            <div className="flex justify-end gap-4 pt-6">
                                <Button type="button" variant="ghost" onClick={resetForm}>Cancel</Button>
                                <Button type="submit" disabled={createLoading || updateLoading} className="bg-[#1987BF] hover:bg-blue-700 text-white shadow-sm w-40">
                                    {(createLoading || updateLoading) ? 'Saving...' : 'Save Post'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            <Card className="shadow-md border-slate-200">
                <CardHeader><CardTitle>Existing Blog Posts</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Title</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Author</th>
                                    <th scope="col" className="px-6 py-3">Last Updated</th>
                                    <th scope="col" className="px-6 py-3 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {blogsLoading ? (
                                    <tr><td colSpan="5" className="text-center p-6">Loading posts...</td></tr>
                                ) : blogs.map(blog => (
                                    <tr key={blog._id} className="bg-white border-b hover:bg-slate-50">
                                        <th scope="row" className="px-6 py-4 font-medium text-slate-900 whitespace-nowrap">{blog.title}</th>
                                        <td className="px-6 py-4"><Badge variant="secondary">{blog.category}</Badge></td>
                                        <td className="px-6 py-4">{blog.author}</td>
                                        <td className="px-6 py-4">{new Date(blog.updatedAt).toLocaleDateString()}</td>
                                        <td className="px-6 py-4 text-right">
                                            <div className="flex justify-end items-center">
                                                <Button variant="ghost" size="icon" onClick={() => handleEdit(blog)} className="text-slate-500 hover:text-[#1987BF]"><Edit className="w-4 h-4"/></Button>
                                                <Button variant="ghost" size="icon" onClick={() => handleDelete(blog._id)} className="text-slate-500 hover:text-red-600"><Trash2 className="w-4 h-4"/></Button>
                                                <Link to={`/blog/${blog.slug}`} target="_blank" rel="noopener noreferrer">
                                                    <Button variant="ghost" size="icon" className="text-slate-500 hover:text-green-600"><Eye className="w-4 h-4"/></Button>
                                                </Link>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
