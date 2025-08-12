import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, X, Edit, Eye, Image as ImageIcon, Bold, Italic, Underline, List, Link2, AlignLeft, Type, Quote, AlertTriangle } from "lucide-react";
import { useCreateBlogMutation, useUpdateBlogMutation, useGetBlogsAdminQuery, useDeleteBlogMutation } from '@/app/api/blogApiSlice';
import { Link } from 'react-router-dom';

// --- Constants ---
const CATEGORIES = [
  "PAN",
  "CIN",
  "Financial & Business Checks",
  "Identity Verification",
  "Employment Verification",
  "Biometric & AI-Based Verification",
  "Profile & Database Lookup",
  "Legal & Compliance Checks",
  "Vehicle Verification"
];
const STATUS_OPTIONS = ['draft', 'published', 'archived'];

// --- Initial State Definitions ---
const initialBlogState = {
    title: '',
    excerpt: '',
    content: '',
    author: 'VerifyMyKyc Team',
    category: '',
    tags: [],
    status: 'published',
    metaTitle: '',
    metaDescription: '',
};

const initialImageState = {
    featuredImage: null,
};

// --- Rich Text Editor Component (Unchanged) ---
const RichTextEditor = ({ value, onChange }) => {
    const editorRef = useRef(null);
    const [showLinkDialog, setShowLinkDialog] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');

    const execCommand = (command, value = null) => {
        document.execCommand(command, false, value);
        editorRef.current?.focus();
    };

    const handleKeyDown = (e) => {
        if (e.ctrlKey || e.metaKey) {
            switch (e.key) {
                case 'b': e.preventDefault(); execCommand('bold'); break;
                case 'i': e.preventDefault(); execCommand('italic'); break;
                case 'u': e.preventDefault(); execCommand('underline'); break;
            }
        }
    };

    const handleInput = () => {
        onChange(editorRef.current?.innerHTML || '');
    };

    const insertLink = () => {
        if (linkUrl) {
            execCommand('createLink', linkUrl);
            setLinkUrl('');
            setShowLinkDialog(false);
        }
    };

    const formatBlock = (tag) => {
        execCommand('formatBlock', `<${tag}>`);
    };

    useEffect(() => {
        if (editorRef.current && editorRef.current.innerHTML !== value) {
            editorRef.current.innerHTML = value;
        }
    }, [value]);

    return (
        <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
            <div className="bg-gray-50 border-b border-gray-300 p-2 flex flex-wrap gap-1">
                <select onChange={(e) => formatBlock(e.target.value)} className="px-2 py-1 text-sm border border-gray-300 rounded" defaultValue="">
                    <option value="">Format</option>
                    <option value="h1">Heading 1</option>
                    <option value="h2">Heading 2</option>
                    <option value="h3">Heading 3</option>
                    <option value="p">Paragraph</option>
                </select>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => execCommand('bold')} className="p-1 hover:bg-gray-200 rounded" title="Bold (Ctrl+B)"><Bold className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand('italic')} className="p-1 hover:bg-gray-200 rounded" title="Italic (Ctrl+I)"><Italic className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand('underline')} className="p-1 hover:bg-gray-200 rounded" title="Underline (Ctrl+U)"><Underline className="w-4 h-4" /></button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => execCommand('insertUnorderedList')} className="p-1 hover:bg-gray-200 rounded" title="Bullet List"><List className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand('insertOrderedList')} className="p-1 hover:bg-gray-200 rounded" title="Numbered List"><Type className="w-4 h-4" /></button>
                <button type="button" onClick={() => execCommand('formatBlock', '<blockquote>')} className="p-1 hover:bg-gray-200 rounded" title="Quote"><Quote className="w-4 h-4" /></button>
                <button type="button" onClick={() => setShowLinkDialog(true)} className="p-1 hover:bg-gray-200 rounded" title="Insert Link"><Link2 className="w-4 h-4" /></button>
                <div className="w-px bg-gray-300 mx-1"></div>
                <button type="button" onClick={() => execCommand('justifyLeft')} className="p-1 hover:bg-gray-200 rounded" title="Align Left"><AlignLeft className="w-4 h-4" /></button>
            </div>
            <div ref={editorRef} contentEditable onInput={handleInput} onKeyDown={handleKeyDown} className="p-4 min-h-[200px] focus:outline-none prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: value }} />
            {showLinkDialog && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-white p-4 rounded-lg shadow-lg w-80">
                        <h3 className="text-lg font-semibold mb-3">Insert Link</h3>
                        <Input type="url" placeholder="https://example.com" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="mb-3" />
                        <div className="flex gap-2 justify-end">
                            <Button type="button" variant="ghost" onClick={() => setShowLinkDialog(false)}>Cancel</Button>
                            <Button type="button" onClick={insertLink} className="bg-[#1987BF] hover:bg-blue-700">Insert</Button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- Image Input Component (Unchanged) ---
const ImageInput = ({ label, fieldName, preview, onChange, currentImage }) => (
    <div className="space-y-2">
        <Label htmlFor={fieldName}>{label}</Label>
        <div className="flex items-center gap-4">
            <div className="w-32 h-20 bg-slate-100 rounded-md flex items-center justify-center border-2 border-dashed">
                {preview ? <img src={preview} alt={`${label} preview`} className="w-full h-full object-cover rounded-md" /> : currentImage ? <img src={currentImage} alt="Current" className="w-full h-full object-cover rounded-md" /> : <ImageIcon className="w-8 h-8 text-slate-400" />}
            </div>
            <Input id={fieldName} type="file" accept="image/*" onChange={(e) => onChange(e, fieldName)} className="flex-1" />
        </div>
    </div>
);

// --- Error Dialog Component (Unchanged) ---
const ErrorDialog = ({ isOpen, message, onClose }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50" aria-modal="true" role="dialog">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md m-4">
                <div className="p-6">
                    <div className="flex items-start gap-4">
                        <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0">
                            <AlertTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
                        </div>
                        <div className="mt-0 text-left">
                            <h3 className="text-lg leading-6 font-medium text-gray-900">
                                Submission Error
                            </h3>
                            <div className="mt-2">
                                <p className="text-sm text-gray-600">
                                    {message}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="bg-gray-50 px-6 py-3 text-right">
                    <Button
                        type="button"
                        onClick={onClose}
                        className="bg-red-600 hover:bg-red-700 text-white"
                    >
                        Close
                    </Button>
                </div>
            </div>
        </div>
    );
};


export default function BlogMetaDataForm() {
    const [isFormVisible, setIsFormVisible] = useState(false);
    const [editingBlog, setEditingBlog] = useState(null);
    const [formData, setFormData] = useState(initialBlogState);
    const [imageFiles, setImageFiles] = useState(initialImageState);
    const [imagePreviews, setImagePreviews] = useState(initialImageState);
    const [tagInput, setTagInput] = useState('');
    const [errorDialog, setErrorDialog] = useState({ isOpen: false, message: '' });

    const { data: blogsResponse, isLoading: blogsLoading, refetch } = useGetBlogsAdminQuery();
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
        setTagInput('');
        setErrorDialog({ isOpen: false, message: '' });
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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

    const handleAddTag = () => {
        if (tagInput && !formData.tags.includes(tagInput)) {
            handleChange('tags', [...formData.tags, tagInput.trim()]);
            setTagInput('');
        }
    };

    const handleRemoveTag = (tagToRemove) => {
        handleChange('tags', formData.tags.filter(tag => tag !== tagToRemove));
    };
    
    // --- THIS IS THE CORRECTED FUNCTION ---
    const handleEdit = (blog) => {
        setEditingBlog(blog);

        // This pattern robustly populates the form state.
        // It starts with the default structure, then overwrites it with all available data from the selected `blog`.
        // This ensures all fields are populated correctly, even if some are missing from the API response.
        const populatedState = {
            ...initialBlogState,
            ...blog,
        };
        
        setFormData(populatedState);
        
        setImagePreviews({ featuredImage: blog.featuredImage?.url || null });
        setImageFiles(initialImageState);
        setIsFormVisible(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    const handleDelete = async (blogId) => {
        if (window.confirm('Are you sure you want to delete this blog post?')) {
            await deleteBlog(blogId).unwrap();
            refetch();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        const formDataToSend = new FormData();
        formDataToSend.append('blogData', JSON.stringify(formData));
        
        if (imageFiles.featuredImage) {
            formDataToSend.append('featuredImage', imageFiles.featuredImage);
        }

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
            setErrorDialog({
                isOpen: true,
                message: error.data?.message || 'An unknown server error occurred. Please try again.'
            });
        }
    };

    return (
        <div className="max-w-7xl mx-auto p-4 md:p-6 lg:p-8 bg-slate-50 min-h-screen">
            <ErrorDialog 
                isOpen={errorDialog.isOpen} 
                message={errorDialog.message} 
                onClose={() => setErrorDialog({ isOpen: false, message: '' })} 
            />

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900">Blog Manager</h1>
                    <p className="text-slate-600 mt-1">Create, edit, and manage all your blog content.</p>
                </div>
                {!isFormVisible && (
                    <Button onClick={() => setIsFormVisible(true)} className="bg-[#1987BF] hover:bg-blue-700 text-white shadow-sm">
                        <Plus className="w-4 h-4 mr-2" /> Create New Post
                    </Button>
                )}
            </div>

            {isFormVisible && (
                <Card className="mb-8 shadow-lg border-slate-200">
                    <div className="p-4 bg-white rounded-t-lg flex items-center justify-between border-b">
                        <CardTitle className="text-xl text-slate-800">{editingBlog ? 'Edit Blog Post' : 'Create New Blog Post'}</CardTitle>
                        <Button variant="ghost" size="icon" onClick={resetForm}><X className="w-5 h-5" /></Button>
                    </div>
                    <CardContent>
                        {/* The form fields will now be correctly populated with data from `formData` */}
                        <form onSubmit={handleSubmit} className="space-y-6 p-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div><Label className="my-2">Title</Label><Input  value={formData.title} onChange={e => handleChange('title', e.target.value)} required /></div>
                                <div><Label className="my-2" >Author</Label><Input  value={formData.author} onChange={e => handleChange('author', e.target.value)} required /></div>
                                <div><Label className="my-2" >Category</Label><Select  value={formData.category} onValueChange={v => handleChange('category', v)} required><SelectTrigger><SelectValue placeholder="Select a category"/></SelectTrigger><SelectContent className="bg-white">{CATEGORIES.map(c=><SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent></Select></div>
                                <div>
                                    <Label  className="my-2">Status</Label>
                                    <Select  value={formData.status} onValueChange={v => handleChange('status', v)} required>
                                        <SelectTrigger><SelectValue placeholder="Select status"/></SelectTrigger>
                                        <SelectContent className="bg-white">{STATUS_OPTIONS.map(s=><SelectItem key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</SelectItem>)}</SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <div><Label className="my-2">Excerpt (Short summary for cards)</Label><Textarea  className="border border-gray-800 rounded-md focus:ring-white focus:outline-none" value={formData.excerpt} onChange={e => handleChange('excerpt', e.target.value)} required /></div>
                            <div className="relative">
                                <Label className="my-2">Content</Label>
                                <RichTextEditor value={formData.content} onChange={value => handleChange('content', value)} />
                            </div>
                            <div>
                                <Label className="my-2">Tags</Label>
                                <div className="flex items-center gap-2">
                                    <Input value={tagInput} onChange={e => setTagInput(e.target.value)} placeholder="Add a tag and press enter" onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddTag())} />
                                    <Button type="button" onClick={handleAddTag}>Add</Button>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    {formData.tags.map(tag => (
                                        <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                                            {tag}
                                            <button type="button" onClick={() => handleRemoveTag(tag)}><X className="w-3 h-3" /></button>
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t">
                                <div className="space-y-4">
                                    <h3 className="font-semibold text-lg">SEO</h3>
                                    <div><Label className="my-2">Meta Title</Label><Input value={formData.metaTitle} onChange={e => handleChange('metaTitle', e.target.value)} /></div>
                                    <div><Label className="my-2">Meta Description</Label><Textarea  className="border border-gray-800 rounded-md focus:ring-0 focus:ring-white focus:outline-none" value={formData.metaDescription} onChange={e => handleChange('metaDescription', e.target.value)} /></div>
                                </div>
                                <div className="space-y-4">
                                     <h3 className="font-semibold text-lg">Images</h3>
                                     <ImageInput label="Featured Image" fieldName="featuredImage" preview={imagePreviews.featuredImage} onChange={handleImageChange} currentImage={editingBlog?.featuredImage?.url} />
                                </div>
                            </div>
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

            {/* Existing Blog Posts Table (Unchanged) */}
            <Card className="shadow-md border-slate-200">
                <CardHeader><CardTitle className="my-4">Existing Blog Posts</CardTitle></CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left text-slate-500">
                            <thead className="text-xs text-slate-700 uppercase bg-slate-100">
                                <tr>
                                    <th scope="col" className="px-6 py-3">Title</th>
                                    <th scope="col" className="px-6 py-3">Category</th>
                                    <th scope="col" className="px-6 py-3">Status</th>
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
                                        <td className="px-6 py-4"><Badge variant={blog.status === 'published' ? 'default' : 'outline'}>{blog.status}</Badge></td>
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