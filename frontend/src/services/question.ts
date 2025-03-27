import axios from 'axios';

//API get all questions by subjectId
export const getQuestionsBySubject = async (subjectId: string) => {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/show/all/${subjectId}`,
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to fetch questions by subject');
  }
};

//API create question
export const createQuestion = async (
  subjectId: string,
  questionData: {
    title: string;
    correctAnswer: string;
    wrongAnswer: string[];
  },
) => {
  try {
    const res = await axios.post(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/create/${subjectId}`,
      questionData,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to create question');
    return null;
  }
};

//API update question
export const updateQuestion = async (
  questionId: string,
  updateData: {
    title: string;
    correctAnswer?: string;
    wrongAnswer?: string[];
  },
) => {
  try {
    const res = await axios.patch(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/update/${questionId}`,
      updateData,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to update question');
    return null;
  }
};

//API delete question
export const deleteQuestion = async (questionId: string) => {
  try {
    const res = await axios.delete(
      `${process.env.NEXT_PUBLIC_API_BASE_URL}/question/delete/${questionId}`,
      { withCredentials: true },
    );
    return res.data;
  } catch (error) {
    throw new Error('Failed to delete question');
    return null;
  }
};
