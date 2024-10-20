import React, { useEffect, useState } from "react";
import FilterRadio from "components/filter/FilterRadio";
import TextHeading from "components/text/TextHeading";
import { useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { userFriend } from "redux/users/userRequest";
import { filterUser } from "redux/users/userSlice";
import FilterOption from "components/filter/FilterOption";

const SideFriend = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const getParamName = (name) => searchParams.get(name);
  const { filters } = useSelector((state) => state.users?.friend);
  const [selectedGender, setSelectedGender] = useState(
    getParamName("sex") || "all"
  );
  const [selectedStatus, setSelectedStatus] = useState(
    getParamName("status") || "all"
  );
  const dispatch = useDispatch();
  useEffect(() => {
    const condition = {
      ...filters,
      gender: selectedGender === "all" ? "" : selectedGender,
      status: selectedStatus === "all" ? null : Number(selectedStatus),
    };
    dispatch(userFriend(condition));
    dispatch(filterUser(condition));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGender, selectedStatus]);
  const handleFilterByParams = (
    [value, setValue],
    param = "sex",
    except = "all"
  ) => {
    setValue(value);
    searchParams.delete(param);
    if (value !== except) searchParams.append(param, value.toString());
    setSearchParams(searchParams);
  };
  return (
    <>
      <FilterOption>
        <TextHeading>Gender</TextHeading>
        <div className="flex flex-col my-3 gap-y-1">
          <FilterRadio
            selectedValue={selectedGender}
            handleChange={(e) =>
              handleFilterByParams([e.target.value, setSelectedGender])
            }
            value="all"
            label="All"
          />
          <FilterRadio
            selectedValue={selectedGender}
            handleChange={(e) =>
              handleFilterByParams([e.target.value, setSelectedGender])
            }
            value="male"
            label="Male"
          />
          <FilterRadio
            selectedValue={selectedGender}
            handleChange={(e) =>
              handleFilterByParams([e.target.value, setSelectedGender])
            }
            value="female"
            label="Female"
          />
        </div>
      </FilterOption>
      <FilterOption>
        <TextHeading>Other options</TextHeading>
        <div className="flex flex-col my-3 gap-y-1">
          <FilterRadio
            selectedValue={selectedStatus}
            handleChange={(e) =>
              handleFilterByParams(
                [e.target.value, setSelectedStatus],
                "status"
              )
            }
            value="all"
            label="All"
          />
          <FilterRadio
            selectedValue={selectedStatus}
            handleChange={(e) =>
              handleFilterByParams(
                [e.target.value, setSelectedStatus],
                "status"
              )
            }
            value="1"
            label="My friend"
          />
          <FilterRadio
            selectedValue={selectedStatus}
            handleChange={(e) =>
              handleFilterByParams(
                [e.target.value, setSelectedStatus],
                "status"
              )
            }
            value="2"
            label="Sent invitation"
          />
          <FilterRadio
            selectedValue={selectedStatus}
            handleChange={(e) =>
              handleFilterByParams(
                [e.target.value, setSelectedStatus],
                "status"
              )
            }
            value="3"
            label="Unfriended"
          />
        </div>
      </FilterOption>
    </>
  );
};

export default SideFriend;
