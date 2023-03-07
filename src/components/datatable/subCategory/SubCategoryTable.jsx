import "../datatable.scss";
import {DataGrid} from "@mui/x-data-grid";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import {SUB_CATEGORY_COLLECTION, db} from "../../../firebase";
import {categoryColumns} from "./categoryTableSource";
import {getCategories} from "../../actions/categoryAction";

const SubCategoryTable = () => {
    const [data, setData] = useState([]);


    useEffect(async () => {
        const categories = await getCategories();

        const unsub = onSnapshot(
            collection(db, SUB_CATEGORY_COLLECTION),
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({
                        id: doc.id, ...doc.data(),
                        category: categories.find(category => category.id == doc.data().categoryId)
                    });
                });
                console.log(list);
                setData(list);
            },
            (error) => {
                console.log(error);
            }
        );

        return () => {
            unsub();
        };
    }, []);

    const handleDelete = async (id) => {
        try {
            await deleteDoc(doc(db, SUB_CATEGORY_COLLECTION, id));
            setData(data.filter((item) => item.id !== id));
        } catch (err) {
            console.log(err);
        }
    };

    const actionColumn = [
        {
            field: "action",
            headerName: "Action",
            width: 300,
            renderCell: (params) => {
                return (
                    <div className="cellAction">
                        <Link to={`/subCategory/${params.row.id}`} style={{textDecoration: "none"}}>
                            <div className="viewButton">Edit</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Delete Category
                        </div>

                    </div>
                );
            },
        },
    ];
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Sub Category
                <Link to="/subCategory/new" className="link">
                    Add New
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={data}
                columns={categoryColumns.concat(actionColumn)}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />
        </div>
    );
};

export default SubCategoryTable;
