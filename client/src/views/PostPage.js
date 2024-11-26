import React, { useEffect } from "react";
import BackPage from "components/common/BackPage";
import EmptyLayout from "layout/EmptyLayout";
import { useLanguage } from "../contexts/LanguageContext";

const PostPage = () => {
    const { texts } = useLanguage();

    useEffect(() => {
        document.title = `Twitter | ${texts.comingSoonTitle}`;
    }, [texts]);

    return (
        <>
            <BackPage haveBackBtn={true}>
                <div className="flex flex-col px-2 py-2">
                <h4 className="text-lg font-bold">Post</h4>
                </div>
            </BackPage>
        </>
    );
};

export default PostPage;
