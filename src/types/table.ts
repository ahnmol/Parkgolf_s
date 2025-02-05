export interface Course {
  [key: string]: number[];
}

export interface Row {
  group: string;
  name: string;
  region: string;
  startCourse: string;
  courses: Course;
  total: number;
}

export interface ModalData {
  rowIndex: number;
  scores: {
    [key: string]: number[];
  };
} 