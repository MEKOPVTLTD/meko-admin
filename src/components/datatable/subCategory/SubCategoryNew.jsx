import "../../../pages/new/new.scss";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import {useEffect, useState} from "react";
import {
    addDoc,
    collection, doc
} from "firebase/firestore";
import {db} from "../../../firebase";
import {useNavigate} from "react-router-dom";
import {getCategories, getSubCategoriesById} from "../../actions/categoryAction";
import {useParams} from 'react-router-dom';
import {uploadContent} from "../../actions/storageAction";
import CircularProgress from "@mui/material/CircularProgress";
import {
    Alert,
    Button,
    FormControl, FormHelperText,
    Grid,
    InputLabel,
    MenuItem,
    Select,
    TextField
} from "@mui/material";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";
import Box from "@mui/material/Box";
import {useForm} from "react-hook-form";
import {updateDoc} from "@firebase/firestore";

const SubCategoryNew = ({inputs, title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [categories, setCategories] = useState([]);
    const [loadingCategories, setLoadingCategories] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const {subCategoryId} = useParams();
    const {register, handleSubmit, formState: {errors}} = useForm();

    const genders = [{value: 'MALE', label: 'Male'}, {value: 'FEMALE', label: 'Female'}];

    const [per, setPerc] = useState(null);
    const navigate = useNavigate()

    useEffect(async () => {
        setLoadingCategories(true)
        getCategories().then((data) => {
            setCategories(data)
        }).finally(() => {
            setLoadingCategories(false)
        });

        if (subCategoryId) {
            setLoadingData(true)
            getSubCategoriesById(subCategoryId).then((data) => {
                setData(data);
            }).finally(() => {
                setLoadingData(false)
            });
        } else {
            setLoadingData(false)
        }

        const uploadFile = uploadContent(file, setPerc, setData);
        file && uploadFile();
    }, [file]);


    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({...data, [id]: value});
    };


    const handleChange = (event) => {
        const {name, value} = event.target;
        setData({...data, [name]: value});
    };


    const onSubmit = async (values) => {
        try {
            if (subCategoryId) {
                await updateDoc(doc(db, collectionName, data.id), {
                    name: data.name,
                    imageName: data.imageName,
                    index: parseInt(data.index),
                    categoryId: data.categoryId,
                    serviceFor: data.serviceFor
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
                    loadingCategories || loadingData
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
                            '& .MuiFormControl-root': {m: 1, width: '100%'}
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
                                value={data.name}
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
                                value={data.index}
                                type="number"
                                onChange={handleInput}

                            />


                            <FormControl sx={{m: 1, minWidth: 120}} error={Boolean(errors.categoryId)}>
                                <InputLabel id="category-label">Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category-select"
                                    {...register("categoryId", {
                                        required: "Category For is Required.",
                                    })}
                                    label="Category"
                                    onChange={handleChange}
                                    name="categoryId"
                                    value={data.categoryId}


                                >
                                    {
                                        categories.map((data, index) => {
                                            return (<MenuItem value={data.id}
                                                              key={"category" + index}>{data.name}</MenuItem>)
                                        })
                                    }
                                </Select>
                                {errors?.categoryId && <FormHelperText>{errors.categoryId?.message}</FormHelperText>}
                            </FormControl>

                            <FormControl sx={{m: 1, minWidth: 120}} error={Boolean(errors.serviceFor)}>
                                <InputLabel id="serviceFor-label">Service For</InputLabel>
                                <Select
                                    labelId="serviceFor-label"
                                    id="serviceFor-select"
                                    {...register("serviceFor", {
                                        required: "Service For is Required.",
                                    })}
                                    label="Service For"
                                    onChange={handleChange}
                                    name="serviceFor"
                                    value={data.serviceFor}


                                >
                                    {
                                        genders.map((data, index) => {
                                            return (<MenuItem value={data.value}
                                                              key={"serviceFor" + index}>{data.label}</MenuItem>)
                                        })
                                    }
                                </Select>
                                {errors?.serviceFor && <FormHelperText>{errors.serviceFor?.message}</FormHelperText>}
                            </FormControl>

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

export default SubCategoryNew;
