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
import {PRODUCT_COLLECTION, db} from "../../../firebase";
import {productColumns} from "./productTableSource";
import {getCategories, getSubCategories} from "../../actions/categoryAction";

const ProductTable = () => {
    const [data, setData] = useState([]);

    useEffect(async () => {
        const categories = await getCategories();
        const subCategories = await getSubCategories();
        const unsub = onSnapshot(
            collection(db, PRODUCT_COLLECTION),
            (snapShot) => {
                let list = [];
                snapShot.docs.forEach((doc) => {
                    list.push({
                        id: doc.id, ...doc.data(),
                        category: categories.find(category => category.id == doc.data().categoryId),
                        subCategory: subCategories.find(subCategory => subCategory.id == doc.data().subCategoryId)
                    });
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
            await deleteDoc(doc(db, PRODUCT_COLLECTION, id));
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
                            Delete Product
                        </div>

                    </div>
                );
            },
        },
    ];
    return (
        <div className="datatable">
            <div className="datatableTitle">
                Products
                <Link to="/products/new" className="link">
                    Add New
                </Link>
            </div>
            <DataGrid
                className="datagrid"
                rows={data}
                columns={productColumns.concat(actionColumn)}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />
        </div>
    );
};

export default ProductTable;
