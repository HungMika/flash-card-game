import axios from 'axios';

//GET all for students
export const getAllSubjects = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/show/all`,
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.res?.data?.message || 'Failed to fetch subjects');
  }
};

//GET by group for both students and teachers
export const getSubjectByGroup = async (group: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/show/${group}`,
    );
    return res.data;
  } catch (error: any) {
    return [];
    // throw new Error(
    //   error.res?.data?.message || 'Failed to fetch subjects by groups',
    // );
  }
};

//GET by userid for teachers
export const getSubjectByUserId = async () => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/show`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.res?.data?.message || 'Failed to fetch subjects by user',
    );
  }
};

//search subjects
export const searchSubjects = async (query: string) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/search`,
      { query },
      { withCredentials: true },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.res?.data?.message || 'Failed to search subjects');
  }
};

//create subjects for teachers
export const createSubject = async (
  userId: string,
  name: string,
  group: string,
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/create`,
      { userId, name, group },
      { withCredentials: true },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.res?.data?.message || 'Failed to create subject');
  }
};

//update subjects for teachers
export const updateSubject = async (
  userId: string,
  subjectId: string,
  name: string,
  group: string,
) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/update/${subjectId}`,
      { name, group },
      { withCredentials: true },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(error.res?.data?.message || 'Failed to update subject');
  }
};

//delete subjects for teachers
export const deleteSubject = async (subjectId: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/subject/delete/${subjectId}`,
      {
        withCredentials: true,
      },
    );
    return res.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message || 'Failed to delete subject',
    );
  }
};
