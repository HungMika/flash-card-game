const TEACHER_KEY = "teacher";

const isBrowser = typeof window !=="undefined";

export function setTeacher (teacher: any) {
    if (!isBrowser) return;
    localStorage.setItem(TEACHER_KEY, JSON.stringify(teacher))
}

export function getTeacher (): any | null {
    if(!isBrowser) return null;
    const value = localStorage.getItem(TEACHER_KEY);
    return value ? JSON.parse(value) : null;
}

export function removeTeacher() {
    if (!isBrowser) return;
    localStorage.removeItem(TEACHER_KEY);
}