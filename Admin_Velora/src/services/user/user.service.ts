import axios from "axios";
import type { User } from "types/user";

const API_URL = import.meta.env.VITE_API_URL;
const USER_ENDPOINT = `${API_URL}/users`;

// ✅ Lấy danh sách tất cả người dùng (chỉ admin)
export const getAllUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token_admin");

  const res = await axios.get(`${USER_ENDPOINT}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.users as User[];
};

// ✅ Lấy thông tin chi tiết người dùng theo ID (admin hoặc chính họ)
export const getUserById = async (id: string): Promise<User> => {
  const token =
    localStorage.getItem("token_admin") || localStorage.getItem("token_user");

  const res = await axios.get(`${USER_ENDPOINT}/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.user as User;
};

// ✅ Cập nhật thông tin người dùng (admin hoặc chính họ)
export const updateUser = async (
  id: string,
  data: Partial<
    Omit<User, "_id" | "role" | "created_at" | "updated_at" | "status">
  >
): Promise<User> => {
  const token =
    localStorage.getItem("token_admin") || localStorage.getItem("token_user");

  const res = await axios.patch(`${USER_ENDPOINT}/update/${id}`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.user as User;
};


// ✅ Cập nhật trạng thái người dùng (chỉ admin)
export const updateUserStatus = async (
  id: string,
  status: "active" | "banned"
): Promise<User> => {
  const token = localStorage.getItem("token_admin");

  const res = await axios.patch(
    `${USER_ENDPOINT}/updateStatus/${id}`,
    { status },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.user as User;
};



// ✅ Xóa mềm người dùng (chỉ admin)
export const softDeleteUser = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token_admin");

  await axios.put(
    `${USER_ENDPOINT}/soft-delete/${id}`,
    {}, 
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );
};


// ✅ Xóa cứng người dùng (chỉ admin)
export const forceDeleteUser = async (id: string): Promise<void> => {
  const token = localStorage.getItem("token_admin");

  await axios.delete(`${USER_ENDPOINT}/force-delete/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// ✅ Lấy danh sách người dùng đã bị xóa mềm (chỉ admin)
export const getDeletedUsers = async (): Promise<User[]> => {
  const token = localStorage.getItem("token_admin");

  const res = await axios.get(`${USER_ENDPOINT}/deleted`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data.users as User[];
};


// ✅ Khôi phục người dùng đã bị xóa mềm (chỉ admin)
export const restoreUser = async (id: string): Promise<User> => {
  const token = localStorage.getItem("token_admin");

  const res = await axios.put(
    `${USER_ENDPOINT}/restore/${id}`,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return res.data.user as User;
};
