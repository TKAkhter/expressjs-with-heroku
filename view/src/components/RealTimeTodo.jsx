import { useFormik } from "formik";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import * as yup from "yup";
import { useEffect, useState } from "react";
import { ref, push, onValue, remove } from "firebase/database";
import { realdb } from "../firebase";

const validationSchema = yup.object({
  title: yup.string("Enter your email").required("Email is required"),
});

async function del(id) {
  await remove(ref(realdb, `/realTimeTodo/${id}`));
}

function RealtimeTodo() {
  const [todo, settodo] = useState([]);

  useEffect(() => {
    const starCountRef = ref(realdb, "realTimeTodo/");
    let temp = [];
    const unsubscribe = onValue(starCountRef, (snapshot) => {
      const data = snapshot;
      // console.log(data);
      data.forEach((doc) => {
        let keyObj = { id: doc.key };
        temp.push({ ...keyObj, ...doc.val() });
      });
      console.log(temp);
      settodo(temp);
      temp = [];
    });

    return () => {
      unsubscribe();
      console.log("unsub");
    };
  }, []);

  const formik = useFormik({
    initialValues: {
      title: "",
      description: "",
    },
    onSubmit: async (values) => {
      try {
        function writeUserData(title, description) {
          push(ref(realdb, "realTimeTodo/"), {
            title: values.title,
            description: values.description,
            // timestamp: firebase.database.FieldValue.serverTimestamp(),
          });
        }
        writeUserData();
        console.log("Document written with ID: ");
      } catch (e) {
        console.error("Error adding document: ", e);
      }
    },
    validationSchema: validationSchema,
  });

  return (
    <Box sx={{ flexGrow: 1, m: 2 }}>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Realtime Todo
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
          {todo.map((eachTodo) => {
            return (
              <Paper
                key={eachTodo.id}
                id={eachTodo.id}
                style={{ margin: 10 }}
                elevation={3}
              >
                <ListItem
                  secondaryAction={
                    <IconButton edge="end" aria-label="delete">
                      <DeleteIcon
                        onClick={() => {
                          del(eachTodo.id);
                        }}
                      />
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

export default RealtimeTodo;
