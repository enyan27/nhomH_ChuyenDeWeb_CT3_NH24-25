import React from "react";
import { useParams } from "react-router-dom";
import EmptyLayout from "layout/EmptyLayout";
import FriendItem from "../../friends/FriendItem";

function textLimit(str, limit) {
  return str.length > limit ? str.slice(0, limit) + "..." : str;
}

const ProfileFriend = ({ listUserFriend }) => {
  const { id } = useParams();

  const listFriend = listUserFriend.map((user) => {
    return user.from._id === id ? user.to : user.from;
  });

  return (
    <div className="p-4">
      {listFriend.length > 0 ? (
        <div className="space-y-4">
          {listFriend.map((user) => (
            <FriendItem
              key={user._id}
              src={user.avatar}
              fullName={textLimit(user.firstName + " " + user.lastName, 20)}
              email={textLimit(user.email, 25)}
              linkInfo={`/profile/${user._id}`}
              status={-1}
              isSender={false}
              userID={user._id}
            />
            
          ))}
        </div>
      ) : (
        <EmptyLayout
          linkImg="/img/profile-empty.png"
          info="This user has not added any friend yet"
        />
      )}
    </div>
  );
};

export default ProfileFriend;
