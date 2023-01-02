import {
  Button,
  Grid,
  Rating,
  Typography,
  Paper,
  Divider,
} from "@mui/material";
import { useDispatch } from "react-redux";
import Avatar from "@mui/material/Avatar";
import { useSelector } from "react-redux";
import {
  getAllInstructorCourses,
  getInstructors,
  getInstructor,
  addRating,
  addReview,
} from "../../actions/instructor";
import LanguageIcon from "@mui/icons-material/Language";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useEffect } from "react";
import { Stack } from "@mui/system";
//import { useRef } from "react";
import "../../css/card.css";
import { useState } from "react";
import { RatingAndReviewPopup } from "../Course/RatingAndReviewPopup";
import { useParams } from "react-router-dom";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { styled } from "@mui/material/styles";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { UdacityCard } from "../ViewAllCoursesPage/AllCourses/UdacityCard/UdacityCard";
import axios from "axios";
const styles = {
  emptyStar: {
    color: "white",
  },
};

const bull = (
  <Box
    component="span"
    sx={{ display: "inline-block", mx: "2px", transform: "scale(0.8)" }}
  >
    •
  </Box>
);

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const initialFormState = {
  rating: "",
  review: "",
};

function InstructorPage() {
  const classes = styles;

  const [initialForm, setInitialForm] = useState(initialFormState);
  const { id } = useParams();
  const user = JSON.parse(localStorage.getItem("profile"));

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getInstructors());
    dispatch(getAllInstructorCourses(instructor?._id));
  }, []);
  const instructors = useSelector((c) => c.instructors);
  const instructor = instructors.filter(
    (instructor) => instructor._id === id
  )[0];

  const courses = useSelector((c) => c.courses);
  console.log(courses);
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [value, setValue] = useState(0);
  useEffect(() => {
    let avg = 0;
    instructor?.ratings?.forEach((rating) => {
      avg += rating.rating;
    });
    avg /= instructor?.ratings?.length;
    setValue(avg);
  }, []);

  const handleRating = async (rating) => {
    if (user?.type === "corporateTrainee") {
      console.log("corporateTrainee");
      await axios.post(`http://localhost:8000/instructor/rating/`);
    } else if (user?.type === "individualTrainee") {
      console.log("individualTrainee");
      await axios.post(`http://localhost:8000/instructor/rating/`);
    }
  };
  const handleSubmit = (rating, review) => {
    console.log(user);
    if (user?.type === "corporateTrainee") {
      console.log("corporateTrainee");
      handleRating(rating);
      dispatch(addReview(instructor?._id, user?.result?._id, "", review));
    } else if (user?.type === "individualTrainee") {
      console.log("individualTrainee");
      handleRating(rating);

      dispatch(addReview(instructor?._id, "", user?.result?._id, review));
    }
  };

  const handleCancel = () => {
    setOpen(false);
  };

  return (
    <Grid
      container
      direction="row"
      columnSpacing={3}
      style={{ backgroundColor: "#fafafa" }}
    >
      <Grid
        style={{ backgroundColor: "#1C1D1F" }}
        container
        spacing={0}
        marginTop="5px"
      >
        <Grid item xs={9}>
          <Grid
            item
            alignSelf="center"
            marginBottom="1px"
            marginTop="10px"
            marginLeft="200px"
            mt={5}
            md={8}
          >
            <Typography
              variant="h5"
              sx={{
                fontSize: 25,
                fontFamily: "ui-serif",
                color: "white",
                fontWeight: "bold",
              }}
            >
              Instructor
            </Typography>

            {/* <Grid item xs={12} marginLeft="300px"> */}
            <Typography
              variant="h6"
              sx={{
                fontSize: 40,
                fontFamily: "monospace",
                fontWeight: 700,
                color: "white",
              }}
            >
              {instructor?.userName}
            </Typography>
          </Grid>

          <Grid
            container
            direction={"row"}
            spacing={0}
            marginLeft="100px"
            marginTop={2}
          >
            <Grid item xs={0.3} marginLeft="100px">
              <Typography sx={{ fontWeight: "bold", color: "white" }}>
                {instructor?.rating}
              </Typography>
            </Grid>

            <Grid item xs={1.5}>
              <Rating
                name="read-only"
                value={value}
                readOnly
                precision={0.5}
                emptyIcon={
                  <StarBorderIcon
                    fontSize="inherit"
                    style={{ color: "white" }}
                  />
                }
              />
            </Grid>
            <Grid item>
              <Typography sx={{ fontWeight: "bold", color: "white" }}>
                {instructor?.ratings?.length} Rating
                {instructor?.ratings?.length > 1 ? "s" : ""}
              </Typography>
            </Grid>
          </Grid>

          <Grid
            item
            xs={8}
            justifyContent="center"
            marginLeft="200px"
            marginTop={2}
          >
            <Typography variant="h6" sx={{ fontSize: 20, color: "white" }}>
              About the instructor
            </Typography>
          </Grid>

          <Grid item xs={9} marginLeft="200px">
            <Typography sx={{ color: "white" }}>
              intructor x studied in university of Sed ut perspiciatis unde
              omnis iste natus error sit voluptatem accusantium doloremque
              laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore
              veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              Nemo enim ipsam voluptatem quia voluptas sit aspernatur aut odit
              aut fugit, sed quia consequuntur magni dolores eos qui ratione
            </Typography>
          </Grid>

          {/* <Grid item xs={0} marginLeft="500px">
              <LanguageIcon />
            </Grid> */}
          <Grid item xs={0} marginLeft="200px" marginTop={3} marginBottom={2}>
            <Typography
              sx={{
                color: "white",
                fontSize: "18px",
                display: "inline-flex",
              }}
            >
              <LanguageIcon /> English{" "}
            </Typography>
          </Grid>

          <Grid item xs={12} marginLeft="200px" marginBottom={5}>
            <Button
              variant="contained"
              onClick={handleOpen}
              style={{ backgroundColor: "#2196f3" }}
            >
              Rate and review Instructor
            </Button>
            <RatingAndReviewPopup
              ratingOpen={open}
              handleCancelRating={handleCancel}
              handleSubmit={handleSubmit}
            ></RatingAndReviewPopup>
          </Grid>
        </Grid>
        <Grid item xs={3}>
          <Avatar sx={{ width: 160, height: 160, marginTop: 5 }}>
            {instructor?.firstName && instructor?.lastName ? (
              `${instructor?.firstName.charAt(0)}${instructor?.lastName.charAt(
                0
              )}`
            ) : (
              <AccountCircleIcon sx={{ width: 160, height: 160 }} />
            )}
          </Avatar>
        </Grid>
      </Grid>
      {/* </Grid> */}

      <Grid
        container
        marginTop="15px"
        rowSpacing={5}
        justifyContent="center"
        marginBottom="30px"
      >
        <Grid item xs={8}>
          <Typography variant="h6" sx={{ fontSize: "30px" }}>
            Explore <b>{instructor?.userName}</b>s courses
          </Typography>
        </Grid>
        {courses?.courses?.map((course, index) => {
          return (
            <>
              <Grid item xs={5}>
                <UdacityCard course={course} type={user?.type} />
              </Grid>
              <Grid item xs={5}>
                <UdacityCard course={course} type={user?.type} />
              </Grid>
            </>
          );
        })}
      </Grid>
    </Grid>
  );
}
export default InstructorPage;
