import React, { useEffect } from 'react';
import BackPage from 'components/common/BackPage';
import SideDarkMode from 'layout/leftSidebar/SideDarkMode';
import LanguageIcon from '@mui/icons-material/Language';
import { useLanguage } from '../contexts/LanguageContext';

function LanguageSelector() {
    const { language, changeLanguage, texts } = useLanguage();

    useEffect(() => {
        document.title = ` Twitter | ${texts.settings}`;
    }, [texts]);

    return (
        <>
            {/* Fix UI - Change languages */}
            <div className="flex items-center justify-between w-full mb-1 m-6">
                <span className="font-bold flex items-center text-gray-700 dark:text-whiteSoft">
                    <LanguageIcon className="mr-2 text-gray-500 dark:text-whiteSoft" /> {texts.languages}
                </span>
            </div>
            <div className="flex flex-col w-full p-5">
                <div className="grid grid-cols-3 gap-x-3">
                    {['English', 'Vietnamese', 'Japanese'].map((lang) => (
                        <div
                            key={lang}
                            className={`flex items-center px-4 py-[14px]  cursor-pointer bg-transparent  border rounded-md gap-x-2 ${language === lang ? 'border-primary dark:border-whiteSoft pointer-events-none' : 'dark:border-gray-600 border-graySoft transition-all'
                                }`}
                            onClick={() => changeLanguage(lang)}
                        >
                            <img src={`/img/country/${lang.toLowerCase()}.png`} className="object-contain w-5" alt={lang} />
                            <h3>{lang}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

function Settings() {
    const { texts } = useLanguage();

    return (
        <>
            <BackPage haveBackBtn={false}>
                <div className="flex flex-col px-2 py-2">
                    <h4 className="text-lg font-bold">{texts.settings}</h4>
                </div>
            </BackPage>
            <SideDarkMode />
            <LanguageSelector />
        </>
    );
}

export default Settings;
