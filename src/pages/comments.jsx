import React, { useEffect, useState } from "react";

import { Trash } from "lucide-react";
import axios from "../config/axios";
import { formatDate } from "../utils/format";

const Comments = () => {
  const [commentDatas, setCommentDatas] = useState([]);
  const [isDelete, setIsDelete] = useState(false);

  const getComments = async () => {
    try {
      const response = await axios.get("comment");
      setCommentDatas(response.data?.data);
    } catch (error) {
      console.error("Error fetching comments data:", error);
    }
  };

  const deleteComment = async (id) => {
    try {
      await axios.delete(`comment/${id}`);
      getComments;
      setIsDelete(true);
    } catch (error) {
      console.error("Error deleting ATM data:", error);
    }
  };

  useEffect(() => {
    getComments();
    setIsDelete(false);
  }, [isDelete]);

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm w-full">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Komentar</h1>
          <p className="text-gray-500">{commentDatas.length} Total Komentar</p>
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
            {commentDatas?.length ? (
              commentDatas?.map((comment) => (
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
                        onClick={() => deleteComment(comment.id)}
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
                  Tidak ada komentar
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Comments;
