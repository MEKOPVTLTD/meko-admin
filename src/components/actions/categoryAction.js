import {collection, getDocs} from "firebase/firestore";
import {CATEGORY_COLLECTION, db, SUB_CATEGORY_COLLECTION} from "../../firebase";

export const getCategories = async () => {
    let list = [];
    try {
        const querySnapshot = await getDocs(collection(db, CATEGORY_COLLECTION));
        querySnapshot.forEach((doc) => {
            list.push({id: doc.id, ...doc.data()});
        });
        return list;
    } catch (err) {
        console.log(err);
    }

}

export const getSubCategories = async () => {
    let list = [];
    try {
        const querySnapshot = await getDocs(collection(db, SUB_CATEGORY_COLLECTION));
        querySnapshot.forEach((doc) => {
            list.push({id: doc.id, ...doc.data()});
        });
        return list;
    } catch (err) {
        console.log(err);
    }

}