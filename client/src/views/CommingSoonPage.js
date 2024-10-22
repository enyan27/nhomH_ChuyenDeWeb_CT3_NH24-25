import React, { useEffect } from "react";
import BackPage from "components/common/BackPage";
import EmptyLayout from "layout/EmptyLayout";

const CommingSoon = () => {
  useEffect(() => {
    document.title = "Comming Soon | Twitter";
  }, []);
  return (
    <>
      <BackPage haveBackBtn={false}>
        <div className="flex flex-col px-2">
          <h4 className="text-lg font-bold">Comming Soon</h4>
          <p className="text-[13px] font-normal text-text4">
            or maybe never
          </p>
        </div>
      </BackPage>

      <EmptyLayout
        info="Feature in Development."
        support="Please come back later!"
      ></EmptyLayout>
    </>
  );
};

export default CommingSoon;
