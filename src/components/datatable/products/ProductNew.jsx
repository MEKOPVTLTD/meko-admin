import "../../../pages/new/new.scss";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import {useEffect, useState} from "react";
import {
    addDoc,
    collection, doc
} from "firebase/firestore";
import {auth, db, storage} from "../../../firebase";
import {useNavigate, useParams} from "react-router-dom";
import {getCategories, getSubCategories} from "../../actions/categoryAction";
import CircularProgress from "@mui/material/CircularProgress";
import {Alert, Button, FormControl, FormHelperText, Grid, InputLabel, MenuItem, Select, TextField} from "@mui/material";
import Box from "@mui/material/Box";
import {useForm} from "react-hook-form";
import {updateDoc} from "@firebase/firestore";
import {getProductById} from "../../actions/productAction";

const ProductNew = ({title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [subCategories, setSubCategories] = useState([]);
    const [loadingSubCategories, setLoadingSubCategories] = useState(true);
    const [loadingData, setLoadingData] = useState(true);
    const {register, handleSubmit, formState: {errors}} = useForm();
    const {productId} = useParams();

    const navigate = useNavigate()

    useEffect(async () => {
        setLoadingSubCategories(true)
        getSubCategories().then((data) => {
            setSubCategories(data)
        }).finally(() => {
            setLoadingSubCategories(false)
        });

        if (productId) {
            setLoadingData(true)
            getProductById(productId).then((data) => {
                setData(data);
            }).finally(() => {
                setLoadingData(false)
            });
        } else {
            setLoadingData(false)
        }

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
        const subCat = subCategories.find(subCat => subCat.id == data.subCategoryId)
        let searchTerm = data.type + " " + data.name + " for " + subCat.serviceFor;
        const updatedData = {
            ...data,
            searchTerm: searchTerm.toLowerCase(),
            price: parseInt(data.price),
            categoryId: subCat.categoryId
        }

        try {
            if (productId) {
                await updateDoc(doc(db, collectionName, data.id), {
                    name: updatedData.name,
                    searchTerm: updatedData.searchTerm,
                    price: updatedData.price,
                    categoryId: updatedData.categoryId,
                    subCategoryId: updatedData.subCategoryId,
                    type: updatedData.type
                });

                alert("Updated Successfully");
            } else {
                await addDoc(collection(db, collectionName), updatedData);
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

                    loadingSubCategories || loadingData
                        ? <div className="progressBar"><CircularProgress/></div>
                        : renderForm()

                }


            </div>
        </div>
    );

    function renderForm() {
        return <div>
            <div className="newForm">
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
                                id="type"
                                label="Type"
                                {...register("type", {
                                    required: "Type is Required.",
                                })}
                                error={Boolean(errors.type)}
                                helperText={errors.type?.message}
                                value={data.type}
                                onChange={handleInput}

                            />

                            <TextField
                                autoComplete="off"
                                id="price"
                                label="Price"
                                {...register("price", {
                                    required: "Price is Required.",
                                })}
                                error={Boolean(errors.price)}
                                helperText={errors.price?.message}
                                value={data.price}
                                type="number"
                                onChange={handleInput}

                            />


                            <FormControl sx={{m: 1, minWidth: 120}} error={Boolean(errors.subCategoryId)}>
                                <InputLabel id="category-label">Sub Category</InputLabel>
                                <Select
                                    labelId="category-label"
                                    id="category-select"
                                    {...register("subCategoryId", {
                                        required: "Sub Category For is Required.",
                                    })}
                                    label="Sub Category"
                                    onChange={handleChange}
                                    name="subCategoryId"
                                    value={data.subCategoryId}


                                >
                                    {
                                        subCategories.map((data, index) => {
                                            return (<MenuItem value={data.id}
                                                              key={"subCategory" + index}>{data.name}</MenuItem>)
                                        })
                                    }
                                </Select>
                                {errors?.categoryId && <FormHelperText>{errors.categoryId?.message}</FormHelperText>}
                            </FormControl>

                            <Button type="submit"
                                    variant="contained">Save</Button>

                        </div>
                    </Box>
                </div>
            </div>
            ;
        </div>
    }
};

export default ProductNew;
