"use client";

import { useState, useTransition, useRef } from "react";
import { addCourse } from "./actions";
import FileUpload from "../../../../components/admin/FileUpload";

export default function AddCourseForm() {
  const [isPending, startTransition] = useTransition();
  const formRef = useRef<HTMLFormElement>(null);
  const [uploadedUrl, setUploadedUrl] = useState<string>("");
  const [slots, setSlots] = useState(["", "", ""]);

  const handleImageUpload = (url: string) => {
    setUploadedUrl(url);
  };

  const handleSlotChange = (index: number, value: string) => {
    const updated = [...slots];
    updated[index] = value;
    setSlots(updated);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    formData.set("timeSlots", slots.filter(Boolean).join(", "));
    formData.set("imageUrl", uploadedUrl);
    startTransition(async () => {
      await addCourse(formData);
      formRef.current?.reset();
      setUploadedUrl("");
      setSlots(["", "", ""]);
    });
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit}>
      <div className="form-group">
        <label className="form-label" htmlFor="title">Course Title</label>
        <input type="text" id="title" name="title" required className="form-input" />
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="description">Description</label>
        <textarea id="description" name="description" required className="form-input" rows={3} style={{ resize: "vertical" }}></textarea>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <div className="form-group">
          <label className="form-label" htmlFor="price">Price (Rs.)</label>
          <input type="number" step="1" id="price" name="price" required className="form-input" placeholder="e.g. 4999" />
        </div>
        <div className="form-group">
          <label className="form-label" htmlFor="type">Course Type</label>
          <select id="type" name="type" required className="form-input" style={{ appearance: "none" }}>
            <option value="ONLINE">Online</option>
            <option value="OFFLINE">Offline</option>
            <option value="HYBRID">Hybrid</option>
          </select>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label" htmlFor="duration">Duration</label>
        <input type="text" id="duration" name="duration" className="form-input" placeholder="e.g. 3 Months, 40 Hours" />
      </div>

      <div className="form-group">
        <label className="form-label">Time Slots (up to 3)</label>
        {slots.map((slot, i) => (
          <input key={i} type="text" className="form-input" style={{ marginBottom: "0.5rem" }}
            placeholder={`Slot ${i + 1} — e.g. Mon & Wed 10:00 AM`}
            value={slot} onChange={(e) => handleSlotChange(i, e.target.value)} />
        ))}
      </div>

      <FileUpload 
        label="Course Poster Image"
        folder="courses"
        onUploadComplete={handleImageUpload}
      />

      <button type="submit" className="btn btn-primary" style={{ width: "100%" }} disabled={isPending || uploading}>
        {isPending ? "Adding..." : "Add Course"}
      </button>
    </form>
  );
}
