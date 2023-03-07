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
// import Select from "react-select";
import {uploadContent} from "../../actions/storageAction";

const ProductNew = ({inputs, title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [subCategories, setSubCategories] = useState([]);


    const [per, setPerc] = useState(null);
    const navigate = useNavigate()

    useEffect(async () => {
        const subCategories = await getSubCategories();
        setSubCategories(subCategories);
        const uploadFile = uploadContent(file, setPerc, setData);
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
        let searchTerm = data.type + " " + data.name + " for " + subCat.serviceFor;
        try {
            await addDoc(collection(db, collectionName), {
                ...data,
                searchTerm: searchTerm.toLowerCase(),
                price: parseInt(data.price)
            });
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
                <div className="containerBody">
                    <div className="bottom">
                        <form onSubmit={handleAdd}>
                            <label className="formLabel">{title}</label>

                            <div className="formInput" key="name">
                                <input
                                    value={data.name}
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    onChange={handleInput}
                                />
                            </div>
                            <div className="formInput" key="type">
                                <input
                                    value={data.type}
                                    id="type"
                                    type="text"
                                    placeholder="Type"
                                    onChange={handleInput}
                                />
                            </div>
                            <div className="formInput" key="price">
                                <input
                                    value={data.price}
                                    id="price"
                                    type="number"
                                    placeholder="Price"
                                    onChange={handleInput}
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
