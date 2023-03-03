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
import {getCategories} from "../../actions/categoryAction";
import Select from "react-select";
import {uploadContent} from "../../actions/storageAction";

const SubCategoryNew = ({inputs, title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [categories, setCategories] = useState([]);

    const genders = [{value: 'MALE', label: 'Male'}, {value: 'FEMALE', label: 'Female'}];

    const [per, setPerc] = useState(null);
    const navigate = useNavigate()

    useEffect(async () => {
        const categories = await getCategories();
        setCategories(categories);
        const uploadFile = uploadContent(file, setPerc, setData);
        file && uploadFile();
    }, [file]);


    const handleInput = (e) => {
        const id = e.target.id;
        const value = e.target.value;

        setData({...data, [id]: value});
    };

    const handleSelect = (e, id) => {
        const value = e.value;
        setData({...data, [id]: value});
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        try {
            let data1 = {...data, index: parseInt(data.index)};
            await addDoc(collection(db, collectionName), data1);
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
                            <div className="formInput" key="serviceFor">

                                <Select
                                    id={"serviceFor"}
                                    placeholder="Select Service For..."
                                    onChange={e => handleSelect(e, "serviceFor")}
                                    options={genders}

                                />
                            </div>

                            <div className="formInput" key="category">

                                <Select
                                    id={"category"}
                                    onChange={e => handleSelect(e, "categoryId")}
                                    placeholder="Select Category..."
                                    options={categories.map(category => {
                                        return {value: category.id, label: category.name}
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

export default SubCategoryNew;
