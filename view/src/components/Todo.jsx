import { useFormik } from "formik";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { collection, addDoc, getDocs, deleteDoc, doc } from "firebase/firestore";
import { useEffect, useState } from "react";
import { db } from "../firebase";

const userCol = collection(db, "todo");

const validationSchema = yup.object({
  title: yup.string("Enter your email").required("Email is required"),
});

async function del(id) {
  // await userCol.doc(id).delete();
  await deleteDoc(doc(db, "todo",id));
  // await deleteField (ref(db, `/realTimeTodo/${id}`));
  console.log("Document deleted with ID: ", id);
  alert("Todo Deleted");
}

function Todo() {
  const [todo, settodo] = useState([]);

  useEffect(() => {
    const getData = async () => {
      const querySnapshot = await getDocs(userCol);
      let todo = [];
      // console.log(querySnapshot);
      querySnapshot.forEach((doc) => {
        let keyObj = { id: doc.id };
        todo.push({ ...keyObj, ...doc.data() });
        // console.log(todo);
      });
      settodo(todo);
    };
    getData();

    return () => {
      console.log("cleanup");
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        const docRef = await addDoc(userCol, {
          title: values.title,
          description: values.description,
        });
        console.log("Document written with ID: ", docRef.id);
        alert("Todo Added");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Todo
      </Typography>

      <form onSubmit={formik.handleSubmit}>
        <Paper style={{ margin: 16, padding: 16 }} elevation={3}>
          <Grid container alignItems="center" spacing={2}>
            <Grid xs={5} md={10} item style={{ paddingRight: 16 }}>
              <TextField
                fullWidth
                placeholder="Add Todo here"
                color="primary"
                id="outlined-basic"
                label="Task"
                variant="filled"
                name="title"
                value={formik.values.title}
                onChange={formik.handleChange}
                error={formik.touched.title && Boolean(formik.errors.title)}
                helperText={formik.touched.title && formik.errors.title}
              />
            </Grid>
            <Grid xs={5} md={10} item style={{ paddingRight: 16 }}>
              <TextField
                fullWidth
                color="primary"
                id="outlined-basic"
                label="Description"
                variant="filled"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
                error={
                  formik.touched.description &&
                  Boolean(formik.errors.description)
                }
                helperText={
                  formik.touched.description && formik.errors.description
                }
              />
            </Grid>
            <Grid xs={2} md={2} item>
              <Button
                fullWidth
                color="success"
                variant="contained"
                type="submit"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Paper>
      </form>

      <Paper style={{ margin: 16, padding: 16 }} elevation={3}>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Recently Added:
        </Typography>
        <List spacing={3}>
          {todo.map((eachTodo, i) => {
            return (
              <Paper
                key={eachTodo.id ? eachTodo.id : i}
                style={{ margin: 10 }}
                elevation={3}
                id={eachTodo.id ? eachTodo.id : i}
              >
                <ListItem
                  onClick={() => {
                    del(eachTodo.id);
                  }}
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={eachTodo.title}
                    secondary={eachTodo.description}
                  />
                </ListItem>
              </Paper>
            );
          })}
        </List>
      </Paper>
    </Box>
  );
}

export default Todo;
