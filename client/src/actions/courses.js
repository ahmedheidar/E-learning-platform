import * as courseApi from "../api/course";
import {
  CREATE_COURSE,
  FILTER_COURSES,
  GET_COURSE_DATA,
} from "../constants/courses";

export const getCourses = () => async (dsipatch) => {
  try {
    const { data } = await courseApi.fetchCourses();
    dsipatch({ type: "FETCH_ALL", payload: data });
  } catch (error) {
    console.log(error);
  }
};
export const filterCourses = (filterData) => async (dispatch) => {
  try {
    const { data } = await courseApi.filterCourses(filterData);
    dispatch({ type: "FILTER_SUBJECT_RATING", payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const filterByTilteOrSubjectOrInstructor =
  (searchQuery) => async (dispatch) => {
    try {
      console.log("SEARCHQUEYR", searchQuery);
      const { data } = await courseApi.filterByTilteOrSubjectOrInstructor(
        searchQuery
      );
      dispatch({ type: FILTER_COURSES, payload: data });
    } catch (error) {
      console.log(error);
    }
  };

export const createCourse = (course) => async (dispatch) => {
  try {
    const { data } = await courseApi.createCourse(course);
    dispatch({ type: CREATE_COURSE, payload: data });
  } catch (error) {
    console.log(error);
  }
};

export const getCourseData = () => async (dispatch) => {
  try {
    console.log("im in action");
    const { data } = await courseApi.getCourseData();
    dispatch({ type: GET_COURSE_DATA, payload: data });
  } catch (err) {
    console.log(err);
  }
};
