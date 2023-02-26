import "../../../pages/new/new.scss";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {useEffect, useState} from "react";
import {
    addDoc,
    collection
} from "firebase/firestore";
import {auth, db, storage} from "../../../firebase";
import {ref, uploadBytesResumable, getDownloadURL} from "firebase/storage";
import {useNavigate} from "react-router-dom";
import {getCategories, getSubCategories} from "../../actions/categoryAction";
import Select from "react-select";

const ProductNew = ({inputs, title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [subCategories, setSubCategories] = useState([]);

    const genders = [{value: 'MALE', label: 'Male'}, {value: 'FEMALE', label: 'Female'}];

    const [per, setPerc] = useState(null);
    const navigate = useNavigate()

    useEffect(async () => {
        const subCategories = await getSubCategories();
        setSubCategories(subCategories);
        const uploadFile = () => {
            const name = new Date().getTime() + file.name;

            console.log(name);
            const storageRef = ref(storage, file.name);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log("Upload is " + progress + "% done");
                    setPerc(progress);
                    switch (snapshot.state) {
                        case "paused":
                            console.log("Upload is paused");
                            break;
                        case "running":
                            console.log("Upload is running");
                            break;
                        default:
                            break;
                    }
                },
                (error) => {
                    console.log(error);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setData((prev) => ({...prev, imageName: downloadURL}));
                    });
                }
            );
        };
        file && uploadFile();
    }, [file]);


    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({...data, [id]: value});
    };

    const handleSelect = (e) => {
        const value = e.value;
        setData({...data, categoryId: value.categoryId, subCategoryId: value.subCategoryId});
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        const subCat = subCategories.find(subCat => subCat.id == data.subCategoryId)
        let searchTerm = data.type+ " " + data.name + " for " + subCat.serviceFor;
        try {
            await addDoc(collection(db, collectionName), {...data, searchTerm: searchTerm.toLowerCase()});
            alert("Saved Successfully");
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
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <img
                            src={
                                file
                                    ? URL.createObjectURL(file)
                                    : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                            }
                            alt=""
                        />
                    </div>
                    <div className="right">
                        <form onSubmit={handleAdd}>
                            <div className="formInput">
                                <label htmlFor="file">
                                    Image: <DriveFolderUploadOutlinedIcon className="icon"/>
                                </label>
                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{display: "none"}}
                                />
                            </div>

                            {inputs.map((input) => (
                                <div className="formInput" key={input.id}>
                                    <label>{input.label}</label>
                                    <input
                                        id={input.id}
                                        type={input.type}
                                        placeholder={input.placeholder}
                                        onChange={handleInput}
                                    />
                                </div>
                            ))}

                            <div className="formInput" key="category">

                                <Select
                                    id={"category"}
                                    onChange={e => handleSelect(e)}
                                    placeholder="Select Sub Category..."
                                    options={subCategories.map(subCategory => {
                                        return {value: {subCategoryId : subCategory.id, categoryId: subCategory.categoryId }, label: subCategory.name + " - " + subCategory.serviceFor}
                                    })}

                                />
                            </div>

                            <button disabled={per !== null && per < 100} type="submit">
                                Send
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductNew;
