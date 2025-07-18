import React, { useState } from "react";
import axios from "axios";
import { backendUrl } from "../App";
import { toast } from "react-toastify";

const Add = ({ token }) => {
  const [form, setForm] = useState({
    name: "",
    price: "",
    category: "",
    subcategory: "",
    stock: "",
    sizes: [],
    bestseller: false,
    description: "",
    details: "",
    colors: [],
    images: {}, // color -> File
  });

  const [isLoading, setIsLoading] = useState(false);
  const allSizes = ["XS", "S", "M", "L", "XL", "XXL"];
  const availableColors = ["gold", "silver", "rose gold", "black"];

  const handleSizeChange = (size) => {
    setForm((prev) => {
      const newSizes = prev.sizes.includes(size)
        ? prev.sizes.filter((s) => s !== size)
        : [...prev.sizes, size];
      return { ...prev, sizes: newSizes };
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleImageChange = (color, file) => {
    setForm((prev) => ({
      ...prev,
      images: {
        ...prev.images,
        [color]: file,
      },
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("price", form.price);
    formData.append("category", form.category);
    formData.append("subcategory", form.subcategory);
    formData.append("stock", form.stock);
    formData.append("bestseller", form.bestseller);
    formData.append("description", form.description);
    formData.append("details", form.details);
    formData.append("size", form.sizes.join(", "));

    const activeColors = Object.keys(form.images);
    formData.append("colors", JSON.stringify(activeColors));

    for (const color of activeColors) {
      formData.append("images", form.images[color]);
    }

    try {
      await axios.post(`${backendUrl}/api/product/add`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      toast.success("Product added successfully!");
      setForm({
        name: "",
        price: "",
        category: "",
        subcategory: "",
        stock: "",
        sizes: [],
        bestseller: false,
        description: "",
        details: "",
        colors: [],
        images: {},
      });
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("Failed to add product");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">Add Product</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input name="name" value={form.name} onChange={handleInputChange} placeholder="Product Name" className="p-2 border" required />
          <input name="price" value={form.price} onChange={handleInputChange} placeholder="Price" type="number" className="p-2 border" required />
          <input name="category" value={form.category} onChange={handleInputChange} placeholder="Category" className="p-2 border" required />
          <input name="subcategory" value={form.subcategory} onChange={handleInputChange} placeholder="Subcategory" className="p-2 border" />
          <input name="stock" value={form.stock} onChange={handleInputChange} placeholder="Stock" type="number" className="p-2 border" required />
        </div>

        <div>
          <label className="block font-medium">Sizes</label>
          <div className="flex gap-2 flex-wrap">
            {allSizes.map((size) => (
              <label key={size}>
                <input
                  type="checkbox"
                  checked={form.sizes.includes(size)}
                  onChange={() => handleSizeChange(size)}
                  className="mr-1"
                />
                {size}
              </label>
            ))}
          </div>
        </div>

        <textarea name="details" value={form.details} onChange={handleInputChange} placeholder="Details" rows={2} className="w-full border p-2" required />
        <textarea name="description" value={form.description} onChange={handleInputChange} placeholder="Description" rows={3} className="w-full border p-2" required />

        <div className="flex items-center">
          <input type="checkbox" name="bestseller" checked={form.bestseller} onChange={handleInputChange} className="mr-2" />
          <label>Bestseller</label>
        </div>

        <div>
          <h3 className="font-medium mb-2">Upload One Image per Color</h3>
          <div className="grid grid-cols-2 gap-4">
            {availableColors.map((color) => (
              <div key={color}>
                <label className="block text-sm font-medium">{color}</label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleImageChange(color, e.target.files[0])}
                  className="mt-1 block w-full border p-1"
                />
              </div>
            ))}
          </div>
        </div>

        <button type="submit" className="bg-blue-600 text-white py-2 px-6 rounded" disabled={isLoading}>
          {isLoading ? "Adding..." : "Add Product"}
        </button>
      </form>
    </div>
  );
};

export default Add;
