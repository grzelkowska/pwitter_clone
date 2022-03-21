import React from "react";
import PweetFactory from "components/PweetFactory"; 

const Home = ({userObj}) => {
    return (
        <div>
            <PweetFactory userObj={userObj} />
        </div>
    )
}
export default Home