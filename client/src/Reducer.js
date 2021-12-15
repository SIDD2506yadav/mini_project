export const initialState = {
    user: null,
    userDetails: null,
    orders: [],
};

export const reducer = (state, action) => {
    switch (action.type) {
        case "SET_USER":
            return {
                ...state,
                user: action.user,
                userDetails: action.userDetails,
                orders: action.orders,
            };

        case "REMOVE_USER":
            return {
                user: null,
                userDetails: null,
                orders: [],
            };

        case "ADD_TO_CART":
            return {
                ...state,
                userDetails: {
                    ...state.userDetails,
                    cart: [...state.userDetails.cart, action.product],
                },
            };

        case "REMOVE_FROM_CART":
            return {
                ...state,
                userDetails: {
                    ...state.userDetails,
                    cart: action.cart,
                },
            };

        case "EMPTY_CART": {
            return {
                ...state,
                userDetails: {
                    ...state.userDetails,
                    cart: [],
                },
            };
        }

        case "ADD_TO_ORDERS":
            return {
                ...state,
                orders: [...state.orders, action.order],
            };

        default:
            return state;
    }
};
