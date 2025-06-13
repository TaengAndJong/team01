import {useEffect, useState} from "react";
import {useLocation} from "react-router-dom";

const WishListComponent = () => {
    const [wishList, setWishList] = useState(null);
    const location = useLocation();

    const wishFetch = async () => {
        const response = await fetch("/api/mypage/wishlist", {
            method: "GET",
        });

        if (!response.ok) {
            throw new Error(response.statusText);
        }

        const data = await response.json();
        console.log("wishList-------", data);
        setWishList(data.userWishList);
    };

    useEffect(() => {
        wishFetch();
    }, [location.pathname]); // 또는 [] 만 넣어도 됨

    console.log("wishList-------", wishList);


    return (
        <>
            {wishList?.map(item => (
                <div key={item.wishId}>
                    {item.bookId}
                </div>
            ))}
        </>
    );
};

export default WishListComponent;
