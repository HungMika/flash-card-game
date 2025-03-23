//MOCK values
// src/services/api.ts (MOCK API)

// Types
type User = {
  id: string;
  username: string;
  email: string;
  password: string;
};

type Subject = {
  id: string;
  name: string;
  ageGroup: string;
  userId: string;
};

type Option = {
  id: string;
  text: string;
};

type Question = {
  id: string;
  subjectId: string;
  question: string;
  options: Option[];
  answerId: string;
};

// In-memory data store
const users: User[] = [];
const subjects: Subject[] = [];
const questions: Question[] = [];

// TEACHER AUTH
export async function signUp(
  username: string,
  email: string,
  password: string,
) {
  const existed = users.find((t) => t.email === email);
  if (existed) throw new Error('Email already in use');

  const id = crypto.randomUUID();
  const teacher = { id, username, email, password };
  users.push(teacher);
  return teacher;
}

export async function logIn(email: string, password: string) {
  return (
    users.find((t) => t.email === email && t.password === password) || null
  );
}

export async function logOut() {
  //TODO: log out api
  return true;
}

// SUBJECT CRUD

function saveSubjectsToLocalStorage() {
  localStorage.setItem('subjects', JSON.stringify(subjects));
}

function loadSubjectsFromLocalStorage() {
  const stored = localStorage.getItem('subjects');
  if (stored) {
    const parsed = JSON.parse(stored);
    subjects.length = 0;
    subjects.push(...parsed);
  }
}

export async function createSubject(
  name: string,
  ageGroup: string,
  userId: string,
) {
  loadSubjectsFromLocalStorage();

  const id = crypto.randomUUID();
  const subject = { id, name, ageGroup, userId };
  subjects.push(subject);

  saveSubjectsToLocalStorage();
  return subject;
}

export async function getSubjectsByAge(ageGroup: string) {
  loadSubjectsFromLocalStorage();
  return subjects.filter((s) => s.ageGroup === ageGroup);
}

export async function getSubjectsByUser(userId: string) {
  return subjects.filter((s) => s.userId === userId);
}

export async function updateSubjectName(
  subjectId: string,
  newName: string,
  userId: string,
) {
  const subject = subjects.find(
    (s) => s.id === subjectId && s.userId === userId,
  );
  if (!subject)
    throw new Error('Subject không tồn tại hoặc không thuộc giáo viên này');

  subject.name = newName;
  saveSubjectsToLocalStorage();

  return subject;
}

export async function deleteSubject(subjectId: string, userId: string) {
  loadSubjectsFromLocalStorage();

  const index = subjects.findIndex(
    (s) => s.id === subjectId && s.userId === userId,
  );
  if (index !== -1) {
    subjects.splice(index, 1);
    saveSubjectsToLocalStorage();
  }

  return true;
}

// QUESTION CRUD
export async function addQuestion(
  subjectId: string,
  questionText: string,
  options: Option[],
  answerId: string,
) {
  const id = crypto.randomUUID();
  const q: Question = {
    id,
    subjectId,
    question: questionText,
    options,
    answerId,
  };
  questions.push(q);
  return q;
}

export async function getQuestions(subjectId: string) {
  return questions.filter((q) => q.subjectId === subjectId);
}

export async function deleteQuestion(questionId: string) {
  const index = questions.findIndex((q) => q.id === questionId);
  if (index !== -1) questions.splice(index, 1);
  return true;
}

// GAMEPLAY
let currentQuestionIndex = 0;

export async function getNextQuestion(subjectId: string) {
  const subjectQuestions = questions.filter((q) => q.subjectId === subjectId);
  if (subjectQuestions.length === 0) return null;

  const question =
    subjectQuestions[currentQuestionIndex % subjectQuestions.length];
  currentQuestionIndex++;
  return question;
}

export async function showAnswer(questionId: string) {
  const q = questions.find((q) => q.id === questionId);
  return q?.answerId || null;
}
