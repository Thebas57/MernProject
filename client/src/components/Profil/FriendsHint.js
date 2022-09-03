import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { isEmpty } from "../Utils";
import FollowHandler from "./FollowHandler";

const FriendsHint = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [playOnce, setPlayOnce] = useState(true);
  const [friendsHint, setFriendsHint] = useState(true);
  const userData = useSelector((state) => state.userReducer);
  const usersData = useSelector((state) => state.usersReducer);

  useEffect(() => {
    const notFriendsList = () => {
      let array = [];
      usersData.map((user) => {
        if (user._id !== userData._id && !user.followers.includes(userData._id)) 
        return array.push(user._id);
      });
      // Random de la suggestion d'ami
      array.sort(() => 0.5 - Math.random());
      if (window.innerHeight > 780) array.length = 5;
      else if (window.innerHeight > 720) array.length = 4;
      else if (window.innerHeight > 615) array.length = 2;
      else if (window.innerHeight > 500) array.length = 1;
      setFriendsHint(array);
    };

    console.log(friendsHint, usersData);

    if (playOnce && !isEmpty(usersData[0]) && !isEmpty(userData._id)) {
      notFriendsList();
      setIsLoading(false);
      setPlayOnce(false);
    }
  }, [userData, usersData, playOnce]);

  return (
    <div className="get-friends-container">
      <h4>Suggestion</h4>
      {isLoading ? (
        <div className="icon">
          <i className="fas fa-spinner fa-pulse"></i>
        </div>
      ) : (
        <ul>
          {friendsHint &&
            friendsHint.map((user) => {
              for (const element of usersData) {
                if (user === element._id) {
                  return (
                    <li className="user-hint" key={user}>
                      <img src={element.picture} alt="user-pic" />
                      <p>{element.pseudo}</p>
                      <FollowHandler
                        idToFollow={element._id}
                        type={"suggestion"}
                      />
                    </li>
                  );
                }
              }
            })}
        </ul>
      )}
    </div>
  );
};

export default FriendsHint;
