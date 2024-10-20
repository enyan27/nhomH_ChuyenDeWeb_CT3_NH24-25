import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import FilterRadio from "components/filter/FilterRadio";
import FilterOption from "components/filter/FilterOption";

const SideFilter = () => {
  const [searchParams, setSearchParams] = useSearchParams("");
  const [countQuery, setCountQuery] = useState(0);
  const getParamName = (name) => searchParams.get(name);
  const [filterPost, setFilterPost] = useState(getParamName("by") || "latest");
  const [selectedValue, setSelectedValue] = useState(
    getParamName("list") || "all"
  );
  useEffect(() => {
    if (selectedValue === "post") {
      searchParams.set("by", filterPost);
    } else searchParams.delete("by");
    setSearchParams(searchParams);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedValue]);
  useEffect(() => {
    setCountQuery((c) => c + 1);
    countQuery > 1 && setSelectedValue("all");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getParamName("q")]);
  function handleFilterByParams(
    [value, setValue],
    param = "list",
    except = "all"
  ) {
    setValue(value);
    searchParams.delete(param);
    if (value !== except) searchParams.append(param, value.toString());
    setSearchParams(searchParams);
  }
  return (
    <></>
  );
};

export default SideFilter;
