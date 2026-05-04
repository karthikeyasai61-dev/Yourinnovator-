"use client";

import { useState, useRef } from "react";
import { uploadFile } from "../../lib/upload";

interface FileUploadProps {
  onUploadComplete: (url: string) => void;
  initialValue?: string;
  folder?: string;
  label?: string;
}

export default function FileUpload({ onUploadComplete, initialValue, folder = "general", label = "Upload Image" }: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [preview, setPreview] = useState<string | null>(initialValue || null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      setError("Please upload an image file.");
      return;
    }

    setError(null);
    setUploading(true);
    
    // Set local preview immediately
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    try {
      const url = await uploadFile(file, folder);
      onUploadComplete(url);
    } catch (err: any) {
      console.error(err);
      setError("Upload failed: " + err.message);
      setPreview(initialValue || null); // Reset to previous if failed
    } finally {
      setUploading(false);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
      <div 
        className={`file-dropzone ${dragActive ? "dragging" : ""}`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
      >
        <input 
          ref={inputRef}
          type="file" 
          accept="image/*" 
          style={{ display: "none" }} 
          onChange={handleChange} 
        />
        
        {preview ? (
          <div style={{ width: "100%" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={preview} alt="Preview" className="file-dropzone-preview" />
            <div className="file-dropzone-text">
              {uploading ? "Uploading new image..." : "Click or drag to change image"}
            </div>
          </div>
        ) : (
          <>
            <div className="file-dropzone-icon">📁</div>
            <div className="file-dropzone-text">
              {uploading ? "Uploading..." : "Drag and drop or click to upload"}
            </div>
          </>
        )}
      </div>
      {error && <div style={{ color: "#ef4444", fontSize: "0.8rem", marginTop: "0.5rem" }}>{error}</div>}
    </div>
  );
}
