import { useCallback, useEffect, useState } from "react";

import { Plus, Edit, Trash, X, Image as ImageIcon, Search } from "lucide-react";
import axios from "../config/axios";

const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black  z-50 flex justify-center items-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative max-h-full overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 z-10"
        >
          <X size={24} />
        </button>
        {children}
      </div>
    </div>
  );
};

// --- Delete Confirmation Modal Component ---
const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, itemName, itemType = "item" }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black z-50 flex justify-center items-center p-4"
      style={{
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backdropFilter: "blur(5px)",
      }}
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md relative">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
            <Trash className="h-6 w-6 text-red-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Hapus {itemType}
          </h3>
          <p className="text-sm text-gray-500 mb-6">
            Apakah Anda yakin ingin menghapus "{itemName}"? Tindakan ini tidak dapat dibatalkan.
          </p>
          <div className="flex gap-3 justify-center">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              Batal
            </button>
            <button
              onClick={onConfirm}
              className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            >
              Hapus
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- ATM Form Component (for Add/Edit) ---
const AtmForm = ({ onSave, onClose, atm, isEdit, getDataAtms }) => {
  const [formDataValue, setFormDataValue] = useState({
    bank: atm?.bank || "",
    name: atm?.name || "",
    address: atm?.address || "",
    hours: atm?.hours || "",
    lat: atm?.lat || "",
    lng: atm?.lng || "",
  });
  const [files, setFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState(atm?.images || []);

  useEffect(() => {
    console.log(atm, "atm");
    if (atm) {
      setFormDataValue({
        bank: atm.bank || "",
        name: atm.name || "",
        address: atm.address || "",
        hours: atm.hours || "",
        lat: atm.lat || "",
        lng: atm.lng || "",
      });
      setImagePreviews(atm.images || []);
    }
  }, [atm]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormDataValue((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);

    const newPreviews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImagePreviews((prevPreviews) => [...prevPreviews, ...newPreviews]);
  };

  const removeImage = (indexToRemove) => {
    const newImagePreviews = imagePreviews.filter(
      (_, index) => index !== indexToRemove
    );
    setImagePreviews(newImagePreviews);

    const removedPreview = imagePreviews[indexToRemove];
    const newFileIndex = files.findIndex(
      (file) => URL.createObjectURL(file) === removedPreview
    );

    if (newFileIndex > -1) {
      const newFiles = files.filter((_, index) => index !== newFileIndex);
      setFiles(newFiles);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();

    // Append form fields to FormData
    formData.append("lat", formDataValue.lat);
    formData.append("lng", formDataValue.lng);
    formData.append("bank", formDataValue.bank);
    formData.append("name", formDataValue.name);
    formData.append("address", formDataValue.address);
    formData.append("hours", formDataValue.hours);

    // Append files to FormData
    files.forEach((file) => {
      formData.append("files", file);
    });

    try {
      let response;
      if (isEdit && atm) {
        console.log(formDataValue, "formData");
        // Edit existing ATM
        response = await axios.patch(`map-location/${atm.id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await getDataAtms();
      } else {
        // Create new ATM
        response = await axios.post("map-location", formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        await getDataAtms();
      }

      console.log(response.data);
      onSave(response.data);
      onClose();
    } catch (error) {
      console.error("Error uploading data:", error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-6">
        {atm ? "Edit ATM Location" : "Add New ATM Location"}
      </h2>
      <div className="space-y-4">
        <input
          name="name"
          value={formDataValue.name}
          onChange={handleChange}
          placeholder="ATM Name"
          className="w-full p-3 border rounded-lg bg-gray-50"
          required
        />
        <input
          name="bank"
          value={formDataValue.bank}
          onChange={handleChange}
          placeholder="Bank"
          className="w-full p-3 border rounded-lg bg-gray-50"
          required
        />
        <input
          name="address"
          value={formDataValue.address}
          onChange={handleChange}
          placeholder="Address"
          className="w-full p-3 border rounded-lg bg-gray-50"
          required
        />
        <input
          name="hours"
          value={formDataValue.hours}
          onChange={handleChange}
          placeholder="Operating Hours"
          className="w-full p-3 border rounded-lg bg-gray-50"
          required
        />
        <div className="flex gap-4">
          <input
            name="lat"
            type="number"
            step="any"
            value={formDataValue.lat}
            onChange={handleChange}
            placeholder="Latitude"
            className="w-full p-3 border rounded-lg bg-gray-50"
            required
          />
          <input
            name="lng"
            type="number"
            step="any"
            value={formDataValue.lng}
            onChange={handleChange}
            placeholder="Longitude"
            className="w-full p-3 border rounded-lg bg-gray-50"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Images
          </label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-blue-600 hover:text-blue-500 focus-within:outline-none"
                >
                  <span>Upload files</span>
                  <input
                    id="file-upload"
                    name="files"
                    type="file"
                    className="sr-only"
                    multiple
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                </label>
                <p className="pl-1">or drag and drop</p>
              </div>
              <p className="text-xs text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
          </div>
        </div>
        {imagePreviews.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
            {imagePreviews.map((preview, index) => (
              <div key={index} className="relative group">
                <img
                  src={preview}
                  alt={`Preview ${index}`}
                  className="h-32 w-full object-cover rounded-md"
                />
                <button
                  type="button"
                  onClick={() => removeImage(index)}
                  className="absolute top-1 right-1 bg-red-600 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
      <div className="flex justify-end gap-4 mt-6">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-2 rounded-lg text-gray-600 bg-gray-100 hover:bg-gray-200"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </form>
  );
};

// --- Dashboard Page Component ---
const Home = () => {
  const [atms, setAtms] = useState([]);
  const [filteredAtms, setFilteredAtms] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingAtm, setEditingAtm] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    atmId: null,
    atmName: ""
  });

  const handleAddNew = () => {
    setEditingAtm(null);
    setIsModalOpen(true);
  };

  const handleEdit = (atm) => {
    setEditingAtm(atm);
    setIsModalOpen(true);
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredAtms(atms);
    } else {
      const filtered = atms.filter((atm) =>
        atm.name?.toLowerCase().includes(query) ||
        atm.bank?.toLowerCase().includes(query) ||
        atm.address?.toLowerCase().includes(query) ||
        atm.hours?.toLowerCase().includes(query)
      );
      setFilteredAtms(filtered);
    }
  };

  const handleDeleteClick = (atm) => {
    setDeleteConfirmation({
      isOpen: true,
      atmId: atm.id,
      atmName: atm.name
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`map-location/${deleteConfirmation.atmId}`);
      await getDataAtms();
      setDeleteConfirmation({
        isOpen: false,
        atmId: null,
        atmName: ""
      });
    } catch (error) {
      console.error("Error deleting ATM data:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      atmId: null,
      atmName: ""
    });
  };

  const handleSave = (atmData) => {
    if (atmData.id) {
      setAtms(atms.map((atm) => (atm.id === atmData.id ? atmData : atm)));
    } else {
      setAtms([...atms, { ...atmData, id: `cmco${Date.now()}` }]);
    }
  };

  const getDataAtms = async () => {
    try {
      const response = await axios.get("map-location");
      console.log(response.data, "response.data");
      setAtms(response.data?.data);
      setFilteredAtms(response.data?.data);
    } catch (error) {
      console.error("Error fetching ATM data:", error);
    }
  };

  useEffect(() => {
    getDataAtms();
  }, [isModalOpen]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">ATM Locations</h1>
          <p className="text-gray-500">{atms.length} Total Locations</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 px-4 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, bank, alamat, atau jam operasional..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Data Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-500">Name</th>
              <th className="p-4 text-sm font-semibold text-gray-500">Bank</th>
              <th className="p-4 text-sm font-semibold text-gray-500">
                Address
              </th>
              <th className="p-4 text-sm font-semibold text-gray-500">Hours</th>
              <th className="p-4 text-sm font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredAtms?.length ? (
              filteredAtms?.map((atm) => (
                <tr
                  key={atm.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">{atm.name}</td>
                  <td className="p-4 text-gray-600">{atm.bank}</td>
                  <td className="p-4 text-gray-600">{atm.address}</td>
                  <td className="p-4 text-gray-600">{atm.hours}</td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(atm)}
                        className="p-2 text-blue-600 bg-blue-100 rounded-md hover:bg-blue-200"
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(atm)}
                        className="p-2 text-red-600 bg-red-100 rounded-md hover:bg-red-200"
                      >
                        <Trash size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="p-4 text-center text-gray-500">
                  {searchQuery ? "Tidak ada lokasi yang sesuai dengan pencarian" : "Tidak ada lokasi"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <AtmForm
          onSave={handleSave}
          onClose={() => setIsModalOpen(false)}
          atm={editingAtm}
          isEdit={!!editingAtm}
          getDataAtms={getDataAtms}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteConfirmation.atmName}
        itemType="lokasi ATM"
      />
    </div>
  );
};

export default Home;
