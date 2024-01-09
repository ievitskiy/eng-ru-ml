import styles from "./Header.module.scss";

export const Header = () => {
  return (
    <div className="flex flex-col justify-center">
      <div className="my-[3vh] ml-[2vh]">
        {/* <div className={`${styles.logo} `}></div> */}
        <div
          className={`${styles.headerApps} text-[#4680e4] font-medium tracking-tighter w-full h-full mt-[-2px] ml-[4px]`}
        >
          Helsinki-NLP/opus-mt-en-ru
        </div>
      </div>
    </div>
  );
};
