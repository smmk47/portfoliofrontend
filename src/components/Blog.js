// Blog.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Blog.css';
import { EditorState, convertToRaw, convertFromRaw } from 'draft-js';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { stateToHTML } from 'draft-js-export-html';

const Blog = ({ email }) => {
  // State to hold all blogs
  const [blogs, setBlogs] = useState([]);

  // State to manage the new blog form
  const [newBlog, setNewBlog] = useState({
    title: '',
    content: EditorState.createEmpty(),
    categories: '',
    tags: '',
    visibility: 'public',
    email: email,
  });

  // State to manage editing
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [editContent, setEditContent] = useState(EditorState.createEmpty());

  // Fetch blogs from the server based on email
  useEffect(() => {
    axios.get(`/api/blogs/${email}`)
      .then(response => {
        setBlogs(response.data);
      })
      .catch(err => console.error(err));
  }, [email]);

  // Handle input changes for the new blog form
  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  // Handle content change in the Draft.js editor for new blog
  const handleNewContentChange = (editorState) => {
    setNewBlog({ ...newBlog, content: editorState });
  };

  // Handle content change in the Draft.js editor for editing blog
  const handleEditContentChange = (editorState) => {
    setEditContent(editorState);
  };

  // Add a new blog
  const handleAddBlog = async (e) => {
    e.preventDefault();
    try {
      // Convert EditorState to raw JSON
      const contentState = newBlog.content.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));

      // Prepare the blog data
      const blogToAdd = {
        title: newBlog.title,
        content: rawContent,
        categories: newBlog.categories,
        tags: newBlog.tags,
        visibility: newBlog.visibility,
        email: newBlog.email,
      };

      // Send POST request to add the blog
      const response = await axios.post('/api/blogs', blogToAdd);

      // Update the blogs state with the new blog
      setBlogs([...blogs, response.data]);

      // Reset the new blog form
      setNewBlog({
        title: '',
        content: EditorState.createEmpty(),
        categories: '',
        tags: '',
        visibility: 'public',
        email: email,
      });
    } catch (err) {
      console.error(err);
    }
  };

  // Start editing a blog
  const handleEditClick = (blog) => {
    setEditingBlogId(blog._id);
    if (blog.content) {
      const contentState = convertFromRaw(JSON.parse(blog.content));
      setEditContent(EditorState.createWithContent(contentState));
    } else {
      setEditContent(EditorState.createEmpty());
    }
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingBlogId(null);
    setEditContent(EditorState.createEmpty());
  };

  // Save edited blog
  const handleSaveEdit = async (id) => {
    try {
      // Convert EditorState to raw JSON
      const contentState = editContent.getCurrentContent();
      const rawContent = JSON.stringify(convertToRaw(contentState));

      // Prepare the updated blog data
      const updatedBlog = {
        content: rawContent,
      };

      // Send PUT request to update the blog
      const response = await axios.put(`/api/blogs/${id}`, updatedBlog);

      // Update the blogs state with the updated blog
      setBlogs(blogs.map(blog => blog._id === id ? response.data : blog));

      // Reset editing state
      setEditingBlogId(null);
      setEditContent(EditorState.createEmpty());
    } catch (err) {
      console.error(err);
    }
  };

  // Delete a blog
  const handleDeleteBlog = async (id) => {
    try {
      // Send DELETE request to remove the blog
      await axios.delete(`/api/blogs/${id}`);

      // Update the blogs state by removing the deleted blog
      setBlogs(blogs.filter(blog => blog._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="blog-container">
      <h2 className="blog-heading">Blog Section</h2>
      
      {/* Blog List */}
      <div className="blog-list">
        {blogs.map((blog) => (
          <div key={blog._id} className="blog-item">
            <h3 className="blog-title">{blog.title}</h3>
            <div className="blog-meta">
              <span className="blog-email">{blog.email}</span>
              <span className="blog-categories">Categories: {blog.categories}</span>
              <span className="blog-tags">Tags: {blog.tags}</span>
              <span className="blog-visibility">Visibility: {blog.visibility}</span>
            </div>
            {editingBlogId === blog._id ? (
              <>
                <Editor
                  editorState={editContent}
                  onEditorStateChange={handleEditContentChange}
                  toolbarClassName="blog-editor-toolbar"
                  wrapperClassName="blog-editor-wrapper"
                  editorClassName="blog-editor-content"
                />
                <button 
                  className="blog-save-btn" 
                  onClick={() => handleSaveEdit(blog._id)}
                >
                  Save
                </button>
                <button 
                  className="blog-cancel-btn" 
                  onClick={handleCancelEdit}
                >
                  Cancel
                </button>
              </>
            ) : (
              <div 
                className="blog-content" 
                dangerouslySetInnerHTML={{ __html: blog.content ? stateToHTML(convertFromRaw(JSON.parse(blog.content))) : '' }}
              ></div>
            )}
            <div className="blog-actions">
              <button 
                className="blog-edit-btn" 
                onClick={() => handleEditClick(blog)}
              >
                Edit
              </button>
              <button 
                className="blog-delete-btn" 
                onClick={() => handleDeleteBlog(blog._id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add New Blog Form */}
      <form className="blog-form" onSubmit={handleAddBlog}>
        <h3 className="blog-form-title">Add New Blog</h3>
        <input 
          type="text" 
          name="title" 
          value={newBlog.title} 
          onChange={handleChange} 
          placeholder="Blog Title"
          className="blog-input"
          required
        />
        <Editor
          editorState={newBlog.content}
          onEditorStateChange={handleNewContentChange}
          toolbarClassName="blog-editor-toolbar"
          wrapperClassName="blog-editor-wrapper"
          editorClassName="blog-editor-content"
        />
        <input 
          type="text" 
          name="categories" 
          value={newBlog.categories} 
          onChange={handleChange} 
          placeholder="Categories (comma separated)"
          className="blog-input"
        />
        <input 
          type="text" 
          name="tags" 
          value={newBlog.tags} 
          onChange={handleChange} 
          placeholder="Tags (comma separated)"
          className="blog-input"
        />
        <div className="blog-visibility-control">
          <label>
            Visibility:
            <select 
              name="visibility" 
              value={newBlog.visibility} 
              onChange={handleChange} 
              className="blog-select"
            >
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </label>
        </div>
        <button type="submit" className="blog-add-btn">Add Blog</button>
      </form>
    </div>
  );
};

export default Blog;
