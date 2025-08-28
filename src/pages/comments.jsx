import React, { useEffect, useState } from "react";

import { Trash, Search } from "lucide-react";
import axios from "../config/axios";
import { formatDate } from "../utils/format";

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

const Comments = () => {
  const [commentDatas, setCommentDatas] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteConfirmation, setDeleteConfirmation] = useState({
    isOpen: false,
    commentId: null,
    commentText: ""
  });

  const getComments = async () => {
    try {
      const response = await axios.get("comment");
      setCommentDatas(response.data?.data);
      setFilteredComments(response.data?.data);
    } catch (error) {
      console.error("Error fetching comments data:", error);
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    
    if (query.trim() === "") {
      setFilteredComments(commentDatas);
    } else {
      const filtered = commentDatas.filter((comment) =>
        comment.text?.toLowerCase().includes(query) ||
        comment.author?.toLowerCase().includes(query)
      );
      setFilteredComments(filtered);
    }
  };

  const handleDeleteClick = (comment) => {
    setDeleteConfirmation({
      isOpen: true,
      commentId: comment.id,
      commentText: comment.text.length > 50 ? comment.text.substring(0, 50) + "..." : comment.text
    });
  };

  const handleDeleteConfirm = async () => {
    try {
      await axios.delete(`comment/${deleteConfirmation.commentId}`);
      await getComments();
      setDeleteConfirmation({
        isOpen: false,
        commentId: null,
        commentText: ""
      });
    } catch (error) {
      console.error("Error deleting comment data:", error);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmation({
      isOpen: false,
      commentId: null,
      commentText: ""
    });
  };

  useEffect(() => {
    getComments();
  }, []);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Komentar</h1>
          <p className="text-gray-500">{commentDatas.length} Total Komentar</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Cari berdasarkan komentar atau nama pengguna..."
            value={searchQuery}
            onChange={handleSearch}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b-2 border-gray-100">
            <tr>
              <th className="p-4 text-sm font-semibold text-gray-500">
                Komentar
              </th>
              <th className="p-4 text-sm font-semibold text-gray-500">
                Nama Pengguna
              </th>
              <th className="p-4 text-sm font-semibold text-gray-500">
                Tanggal
              </th>
              <th className="p-4 text-sm font-semibold text-gray-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredComments?.length ? (
              filteredComments?.map((comment) => (
                <tr
                  key={comment.id}
                  className="border-b border-gray-100 hover:bg-gray-50"
                >
                  <td className="p-4 font-medium text-gray-800">
                    {comment.text}
                  </td>
                  <td className="p-4 text-gray-600">{comment.author}</td>
                  <td className="p-4 text-gray-600">
                    {formatDate(comment.createdAt)}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleDeleteClick(comment)}
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
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  {searchQuery ? "Tidak ada komentar yang sesuai dengan pencarian" : "Tidak ada komentar"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <DeleteConfirmationModal
        isOpen={deleteConfirmation.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        itemName={deleteConfirmation.commentText}
        itemType="komentar"
      />
    </div>
  );
};

export default Comments;
