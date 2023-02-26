import "../datatable.scss";
import {DataGrid} from "@mui/x-data-grid";
import {userColumns, userRows} from "../../../userTableSource";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import {CATEGORY_COLLECTION, db} from "../../../firebase";
import {categoryColumns} from "./categoryTableSource";

const CategoryTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        const unsub = onSnapshot(
            collection(db, CATEGORY_COLLECTION),
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({id: doc.id, ...doc.data()});
                });
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
            await deleteDoc(doc(db, CATEGORY_COLLECTION, id));
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
                        <Link to="/category/test" style={{textDecoration: "none"}}>
                            <div className="viewButton">View</div>
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
                Category
                <Link to="/category/new" className="link">
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

export default CategoryTable;
