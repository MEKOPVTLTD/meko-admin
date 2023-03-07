import "../../../pages/new/new.scss";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import {useEffect, useState} from "react";
import Box from '@mui/material/Box';
import {
    addDoc,
    collection, doc
} from "firebase/firestore";
import {db} from "../../../firebase";
import {useNavigate} from "react-router-dom";
import {uploadContent} from "../../actions/storageAction";
import {getCategoriesById} from "../../actions/categoryAction";
import {useParams} from 'react-router-dom';
import {updateDoc} from "@firebase/firestore";
import {Alert, AppBar, Button, Grid, TextField} from "@mui/material";
import {useForm} from "react-hook-form";
import CloudUploadOutlinedIcon from '@mui/icons-material/CloudUploadOutlined';
import CircularProgress from '@mui/material/CircularProgress';


const CategoryNew = ({title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [per, setPerc] = useState(null);
    const {categoryId} = useParams();
    const {register, handleSubmit, formState: {errors}} = useForm();
    const navigate = useNavigate()

    useEffect(async () => {

        if (categoryId) {
            const category = await getCategoriesById(categoryId);
            setData(category)
        }
        const uploadFile = uploadContent(file, setPerc, setData);
        file && uploadFile();
    }, [file]);


    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({...data, [id]: value});
    };


    const onSubmit = async (values) => {
        try {
            if (categoryId) {
                await updateDoc(doc(db, collectionName, data.id), {
                    name: data.name,
                    imageName: data.imageName,
                    index: parseInt(data.index)
                });

                alert("Updated Successfully");
            } else {
                await addDoc(collection(db, collectionName), {...data, index: parseInt(data.index)});
                alert("Saved Successfully");
            }

            navigate(-1)
        } catch (e) {
            alert(e);
        }
    };


    return (
        <div className="new">
            <Sidebar/>
            <div className="newContainer">
                <Navbar/>
                <div className="containerTitle">{title}</div>

                {
                    categoryId && Object.keys(data).length === 0
                        ? <div className="progressBar"><CircularProgress/></div>
                        : renderForm()
                }


            </div>
        </div>
    );

    function renderForm() {
        return <div>
            {
                Boolean(data.imageName) ?
                    <div></div> :
                    <Alert severity="error">Please upload image</Alert>
            }
            <div className="newForm">
                <div className="containerLeft">
                    <Grid container direction="column" alignItems="center">
                        <Grid item>
                            <img
                                width="100%"
                                className="img"
                                src={
                                    data.imageName
                                        ? data.imageName
                                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                }
                            />
                        </Grid>
                        <label htmlFor="contained-button-file">
                            <Button className="selectImage" variant="contained" component="span"
                                    endIcon={<CloudUploadOutlinedIcon/>}>
                                Select Image
                                <input

                                    accept="image/*"
                                    className="uploadImageButton"
                                    id="contained-button-file"
                                    multiple
                                    type="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                />
                            </Button>
                        </label>
                    </Grid>
                </div>
                <div className="containerRight">
                    <Box
                        component="form"
                        sx={{
                            '& .MuiTextField-root': {m: 1, width: '100%'},
                        }}
                        noValidate
                        autoComplete="off"
                        onSubmit={handleSubmit(onSubmit)}
                    >
                        <div>
                            <TextField
                                autoComplete="off"
                                id="name"
                                label="Name"
                                {...register("name", {
                                    required: "Name is Required.",
                                })}
                                error={Boolean(errors.name)}
                                helperText={errors.name?.message}
                                defaultValue={data.name}
                                onChange={handleInput}

                            />
                            <TextField
                                autoComplete="off"
                                id="index"
                                label="Index"
                                {...register("index", {
                                    required: "Index is Required.",
                                })}
                                error={Boolean(errors.index)}
                                helperText={errors.index?.message}
                                defaultValue={data.index}
                                type="number"
                                onChange={handleInput}

                            />

                            <Button disabled={((per !== null && per < 100) || !data.imageName)} type="submit"
                                    variant="contained">Save</Button>

                        </div>
                    </Box>
                </div>
            </div>
            ;
        </div>
    }
};

export default CategoryNew;
