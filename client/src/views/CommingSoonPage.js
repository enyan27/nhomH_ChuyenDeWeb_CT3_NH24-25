import React, { useEffect } from "react";
import BackPage from "components/common/BackPage";
import EmptyLayout from "layout/EmptyLayout";
import { useLanguage } from "../contexts/LanguageContext";

const CommingSoon = () => {
  const { texts } = useLanguage();

  useEffect(() => {
    document.title = `Twitter | ${texts.comingSoonTitle}`;
  }, [texts]);

  return (
    <>
      <BackPage haveBackBtn={false}>
        <div className="flex flex-col px-2">
          <h4 className="text-lg font-bold">{texts.comingSoonTitle}</h4>
          <p className="text-[13px] font-normal text-text4">
            {texts.comingSoonSubtitle}
          </p>
        </div>
      </BackPage>

      <EmptyLayout
        info={texts.featureInDevelopment}
        support={texts.pleaseComeBackLater}
      ></EmptyLayout>
    </>
  );
};

export default CommingSoon;
