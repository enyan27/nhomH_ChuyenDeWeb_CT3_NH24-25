import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { Avatar } from "@mui/material";
import { Link, useParams } from "react-router-dom";
import EmptyLayout from "layout/EmptyLayout";

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
        <TableContainer component={Paper} className="dark:bg-darkSoft">
          <Table sx={{ width: "100%" }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Avatar</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Gender</TableCell>
                <TableCell>Info</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {listFriend.map((user) => (
                <TableRow
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                  key={user._id}
                >
                  <TableCell>
                    <Avatar src={user.avatar} alt="" />
                  </TableCell>
                  <TableCell
                    className="font-semibold"
                    title={user.firstName + " " + user.lastName}
                  >
                    {textLimit(user.firstName + " " + user.lastName, 10)}
                  </TableCell>
                  <TableCell className="text-text3" title={user.email}>
                    {textLimit(user.email, 15)}
                  </TableCell>
                  <TableCell
                    align="center"
                    className={`capitalize ${
                      user.gender === "male"
                        ? "text-thirdColor"
                        : "text-secondary"
                    }`}
                  >
                    {user.gender}
                  </TableCell>
                  <TableCell>
                    <Link to={"/profile/" + user._id}>
                      <span className="text-sm font-medium underline text-primary">
                        View Info
                      </span>
                    </Link>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      ) : (
        <EmptyLayout
          linkImg="/img/profile-empty.png"
          info="This user has not added any friend yet"
        ></EmptyLayout>
      )}
    </div>
  );
};

export default ProfileFriend;
