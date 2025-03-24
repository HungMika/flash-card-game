// frontend/src/services/user.ts
import axios from 'axios';

export const getCurrUser = async () => {
  try {
    const response = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/user/profile`,
      { withCredentials: true },
    );
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};
