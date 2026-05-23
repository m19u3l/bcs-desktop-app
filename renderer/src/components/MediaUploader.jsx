import React, { useState, useRef } from 'react';
import { Upload, X, Image, Video, File, CheckCircle } from 'lucide-react';

/**
 * Media Uploader Component - Building Care Solutions
 * Supports photos, videos, and documents
 * Miguel - m19u3l@sd-bcs.com
 */
const MediaUploader = ({ onUpload, maxFiles = 10, acceptedTypes = 'image/*,video/*,.pdf', projects = [] }) => {
  const [files, setFiles] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [showDestinationModal, setShowDestinationModal] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState('general');
  const [selectedProject, setSelectedProject] = useState('');
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const selectedFiles = Array.from(e.target.files);

    if (files.length + selectedFiles.length > maxFiles) {
      alert(`Maximum ${maxFiles} files allowed`);
      return;
    }

    const newFiles = selectedFiles.map(file => ({
      file,
      id: Date.now() + Math.random(),
      name: file.name,
      size: file.size,
      type: file.type,
      preview: URL.createObjectURL(file),
      uploaded: false
    }));

    setFiles([...files, ...newFiles]);
  };

  const removeFile = (id) => {
    setFiles(files.filter(f => f.id !== id));
  };

  const handleUploadClick = () => {
    if (files.length === 0) {
      alert('Please select files to upload');
      return;
    }
    setShowDestinationModal(true);
  };

  const handleUpload = async () => {
    setShowDestinationModal(false);
    setUploading(true);
    try {
      // Prepare upload data with destination
      const uploadData = {
        files: files,
        destination: selectedDestination,
        projectId: selectedDestination === 'project' ? selectedProject : null
      };

      // Simulate upload - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      const updatedFiles = files.map(f => ({ ...f, uploaded: true }));
      setFiles(updatedFiles);

      if (onUpload) {
        onUpload(updatedFiles, uploadData.destination, uploadData.projectId);
      }

      const destName = selectedDestination === 'project'
        ? `Project ${selectedProject}`
        : 'General Storage';
      alert(`Files uploaded to ${destName} successfully!`);

      // Reset state
      setFiles([]);
      setSelectedDestination('general');
      setSelectedProject('');
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getFileIcon = (type) => {
    if (type.startsWith('image/')) return <Image size={24} className="text-blue-600" />;
    if (type.startsWith('video/')) return <Video size={24} className="text-purple-600" />;
    return <File size={24} className="text-gray-600" />;
  };

  return (
    <div className="bg-white rounded-xl shadow-md p-6">
      <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center">
        <Upload className="mr-2 text-blue-600" size={24} />
        Upload Photos & Videos
      </h3>

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all"
      >
        <Upload size={48} className="mx-auto text-gray-400 mb-3" />
        <p className="text-gray-700 font-medium mb-1">Click to upload or drag and drop</p>
        <p className="text-sm text-gray-500">Photos, videos, and PDF documents</p>
        <p className="text-xs text-gray-400 mt-2">Maximum {maxFiles} files</p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept={acceptedTypes}
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* File List */}
      {files.length > 0 && (
        <div className="mt-6 space-y-3">
          <h4 className="font-semibold text-gray-700">Selected Files ({files.length})</h4>
          {files.map(file => (
            <div key={file.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
              <div className="flex items-center space-x-3 flex-1">
                {file.type.startsWith('image/') || file.type.startsWith('video/') ? (
                  <img
                    src={file.preview}
                    alt={file.name}
                    className="w-12 h-12 object-cover rounded"
                  />
                ) : (
                  <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded">
                    {getFileIcon(file.type)}
                  </div>
                )}

                <div className="flex-1">
                  <p className="text-sm font-medium text-gray-800 truncate">{file.name}</p>
                  <p className="text-xs text-gray-500">{formatFileSize(file.size)}</p>
                </div>

                {file.uploaded && (
                  <CheckCircle size={20} className="text-green-600" />
                )}
              </div>

              <button
                onClick={() => removeFile(file.id)}
                className="ml-3 p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <X size={20} />
              </button>
            </div>
          ))}

          <button
            onClick={handleUploadClick}
            disabled={uploading}
            className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Upload size={20} />
            <span>{uploading ? 'Uploading...' : 'Upload All Files'}</span>
          </button>
        </div>
      )}

      {/* Destination Selection Modal */}
      {showDestinationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-6 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Where would you like to save these files?
            </h3>

            <div className="space-y-3 mb-6">
              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="destination"
                  value="general"
                  checked={selectedDestination === 'general'}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800">General Storage</p>
                  <p className="text-sm text-gray-500">For management review</p>
                </div>
              </label>

              <label className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                <input
                  type="radio"
                  name="destination"
                  value="project"
                  checked={selectedDestination === 'project'}
                  onChange={(e) => setSelectedDestination(e.target.value)}
                  className="mr-3"
                />
                <div>
                  <p className="font-medium text-gray-800">Specific Project</p>
                  <p className="text-sm text-gray-500">Attach to a work order or job</p>
                </div>
              </label>

              {selectedDestination === 'project' && (
                <div className="ml-6 mt-2">
                  <select
                    value={selectedProject}
                    onChange={(e) => setSelectedProject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select a project...</option>
                    {projects.length > 0 ? (
                      projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name || project.work_order_number}
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="wo-001">WO-001 - Water Damage Restoration</option>
                        <option value="wo-002">WO-002 - Fire Damage Cleanup</option>
                        <option value="wo-003">WO-003 - Mold Remediation</option>
                      </>
                    )}
                  </select>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowDestinationModal(false)}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={selectedDestination === 'project' && !selectedProject}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Upload Files
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaUploader;
