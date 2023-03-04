import "../../../pages/new/new.scss";
import Sidebar from "../../sidebar/Sidebar";
import Navbar from "../../navbar/Navbar";
import DriveFolderUploadOutlinedIcon from "@mui/icons-material/DriveFolderUploadOutlined";
import {useEffect, useState} from "react";
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


const CategoryNew = ({inputs, title, collectionName}) => {
    const [file, setFile] = useState("");
    const [data, setData] = useState({});
    const [per, setPerc] = useState(null);
    const {categoryId} = useParams();
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

    const handleAdd = async (e) => {
        e.preventDefault();
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

                <div className="containerBody">
                    <div className="bottom">

                        <form onSubmit={handleAdd}>
                            <label className="formLabel">{title}</label>
                            <div className="imageContainer">
                                <img
                                    src={
                                        data.imageName
                                            ? data.imageName
                                            : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                    }
                                    alt=""
                                />
                                <div className="uploadLink">
                                    <label htmlFor="file">
                                        <div>Upload</div>
                                        <DriveFolderUploadOutlinedIcon className="icon"/>
                                    </label>
                                </div>
                            </div>
                            <div className="formInput">

                                <input
                                    type="file"
                                    id="file"
                                    onChange={(e) => setFile(e.target.files[0])}
                                    style={{display: "none"}}
                                />
                            </div>

                            <div className="formInput" key="name">
                                <input
                                    value={data.name}
                                    id="name"
                                    type="text"
                                    placeholder="Name"
                                    onChange={handleInput}
                                />
                            </div>
                            <div className="formInput" key="index">
                                <input
                                    value={data.index}
                                    id="index"
                                    type="text"
                                    placeholder="Index"
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

export default CategoryNew;
