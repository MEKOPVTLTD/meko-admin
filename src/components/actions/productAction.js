import {doc, getDoc} from "firebase/firestore";
import {db, PRODUCT_COLLECTION} from "../../firebase";

export const getProductById = async (id) => {
    let data = {};
    try {
        const querySnapshot = await getDoc(doc(db, PRODUCT_COLLECTION, id));
        data = {...querySnapshot.data(), id};
    } catch (err){
        console.log(err)
    }
    return data;
}