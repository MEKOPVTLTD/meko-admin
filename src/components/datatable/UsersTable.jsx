import "./datatable.scss";
import {DataGrid} from "@mui/x-data-grid";
import {userColumns, userRows} from "../../userTableSource";
import {Link} from "react-router-dom";
import {useEffect, useState} from "react";
import {
    collection,
    getDocs,
    deleteDoc,
    doc,
    onSnapshot,
} from "firebase/firestore";
import {auth, db, USERS_COLLECTION} from "../../firebase";

const UsersTable = () => {
    const [data, setData] = useState([]);

    useEffect(() => {
        // const fetchData = async () => {
        //   let list = [];
        //   try {
        //     const querySnapshot = await getDocs(collection(db, USERS_COLLECTION));
        //     querySnapshot.forEach((doc) => {
        //       list.push({ id: doc.id, ...doc.data() });
        //     });
        //     setData(list);
        //     console.log(list);
        //   } catch (err) {
        //     console.log(err);
        //   }
        // };
        // fetchData();

        // LISTEN (REALTIME)
        const unsub = onSnapshot(
            collection(db, USERS_COLLECTION),
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
            await deleteDoc(doc(db, USERS_COLLECTION, id));
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
                        <Link to="/users/test" style={{textDecoration: "none"}}>
                            <div className="viewButton">View</div>
                        </Link>
                        <div
                            className="deleteButton"
                            onClick={() => handleDelete(params.row.id)}
                        >
                            Delete Profile
                        </div>
                        <div
                            className="deleteButton"
                            onClick={() => alert("Please go to Firebase console to delete/deactivate user")}
                        >
                            Delete User
                        </div>
                    </div>
                );
            },
        },
    ];
    return (
        <div className="datatable">
            <div className="datatableTitle">
                User Profile
            </div>
            <DataGrid
                className="datagrid"
                rows={data}
                columns={userColumns.concat(actionColumn)}
                pageSize={10}
                rowsPerPageOptions={[10]}
            />
        </div>
    );
};

export default UsersTable;
