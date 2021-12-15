import { db } from "../Firebase.js";
import { doc, getDoc, setDoc, collection, updateDoc } from "firebase/firestore";

const getOrders = async (uid) => {
    const orderRef = doc(db, "orders", uid);
    const docSnap = await getDoc(orderRef);
    if (docSnap.exists()) {
        return Object.values(docSnap.data());
    } else {
        console.log("No such document!");
    }
};

const getSingleProduct = async (pId, category) => {
    try {
        const docRef = doc(db, "products", category);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
            const data = Object.values(docSnap.data());
            const filteredData = data.filter((item) => item.id === pId);
            return { singleProduct: filteredData["0"], allProducts: data };
        } else {
            return null;
        }
    } catch (error) {
        console.log(error);
        return null;
    }
};

const getProducts = async (category) => {
    try {
        const docRef = doc(db, "products", category);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            return Object.values(docSnap.data());
        } else {
            console.log("No such document!");
        }
    } catch (err) {
        return [];
    }
};

const getFeatured = async () => {
    const docRef = doc(db, "products", "featured");
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
        return Object.values(docSnap.data())[0];
    } else {
        console.log("No such document!");
    }
};

const uploadUser = async (
    name,
    phone,
    email,
    address1,
    address2,
    address3,
    userId
) => {
    const data = {
        name: name,
        phone: phone,
        email: email,
        address1: address1,
        address2: address2,
        address3: address3,
        cart: [],
    };
    try {
        const userRef = collection(db, "users");
        await setDoc(doc(userRef, userId), data, {
            merge: true,
        });
        return true;
    } catch (error) {
        console.log(error);
        return false;
    }
};

const updateCart = async (cart, product, uid) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { cart: [...cart, product] });
};

const removeCartItem = async (cart, uid) => {
    const userRef = doc(db, "users", uid);
    await updateDoc(userRef, { cart: cart });
};

const updateOrders = async (orderDetail, uid) => {
    const orderRef = collection(db, "orders");
    setDoc(
        doc(orderRef, uid),
        {
            ...orderDetail,
        },
        { merge: true }
    );
};

export {
    getProducts,
    getFeatured,
    uploadUser,
    updateCart,
    removeCartItem,
    updateOrders,
    getOrders,
    getSingleProduct,
};
