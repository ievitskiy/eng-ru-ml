"use client";

import axios from "axios";
import { useCallback, useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";
import { HiOutlineSwitchHorizontal } from "react-icons/hi";
import { RxCross2 } from "react-icons/rx";
import TextareaAutosize from "react-textarea-autosize";

export const Translator = () => {
  const [translatableValue, setTranslatableValue] = useState("");
  const [translationValue, setTranslationValue] = useState("");
  const [currentLength, setCurrentLength] = useState<number>(0);
  const [copied, setCopied] = useState(false);
  const [isEnglish, setIsEnglish] = useState(true);

  useEffect(() => {
    if (!translatableValue) {
      clearTextarea();
    }
  }, [translatableValue]);

  const getTranslation = useCallback(() => {
    if (textareaRef.current && textareaRef.current.value) {
      axios({
        method: "post",
        url: `https://hlsjn6q7-5001.euw.devtunnels.ms/${
          isEnglish ? "ai-predict-eng-ru" : "ai-predict-ru-eng"
        }`,
        data: { request: textareaRef.current.value },
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then(function (response) {
          const translation = response.data.response;
          console.log(translation, response.data);
          setTranslationValue(translation);
        })
        .catch(function (error) {
          console.log(error);
        });
    }
  }, [isEnglish]);

  const onChangeTextarea = (e: any) => {
    setTranslatableValue(e.target.value);
    setCurrentLength(e.target.value.length);
  };

  const clearTextarea = () => {
    setCurrentLength(0);
    setTranslatableValue("");
    setTranslationValue("");
  };

  class dynamicTimer {
    copiedTimer: NodeJS.Timeout | undefined;
    translationTimer: NodeJS.Timeout | undefined;

    constructor() {
      this.copiedTimer = undefined;
      this.translationTimer = undefined;
    }

    startCopiedTimer() {
      clearTimeout(this.copiedTimer);
      setCopied(true);
      this.copiedTimer = setTimeout(() => {
        setCopied(false);
      }, 3000);
    }
  }

  let timer = useRef(new dynamicTimer());
  let textareaRef = useRef<HTMLTextAreaElement>(null);

  return (
    <div className="flex flex-col justify-center">
      <div className="bg-[#173535] w-full h-[80px] rounded-t-[13px] border-b-[1px] border-[#4a5f4e]">
        <div className="flex flex-row justify-center items-center h-full relative border-t-[1px] border-l-[1px] border-r-[1px] border-[#4a5f4e] rounded-t-[13px]">
          <div className="languages w-full h-full flex flex-col justify-center items-center text-[#ffffff] text-[24px]">
            {isEnglish ? "Английский" : "Русский"}
          </div>

          <HiOutlineSwitchHorizontal
            className="w-20 h-20 text-[#ffffff] cursor-pointer"
            onClick={() => {
              setIsEnglish((prev) => !prev);
              clearTextarea();
            }}
          ></HiOutlineSwitchHorizontal>

          <div className="languages w-full h-full flex flex-col justify-center items-center text-[#ffffff] text-[24px]">
            {isEnglish ? "Русский" : "Английский"}
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center border-l-[1px] border-r-[1px] border-[#4a5f4e] rounded-b-[13px]">
        <div className="bg-[#164141] w-full rounded-bl-[13px] min-h-[350px] flex flex-col justify-between relative ">
          {currentLength != 0 ? (
            <RxCross2
              className="text-[#ffffff] absolute top-2 right-2 w-[32px] h-auto cursor-pointer"
              onClick={clearTextarea}
            ></RxCross2>
          ) : (
            ""
          )}
          <TextareaAutosize
            value={translatableValue}
            onChange={onChangeTextarea}
            className="bg-transparent outline-none caret-[#ffffff] text-[24px] text-[#ffffff] w-[90%] resize-none overflow-hidden p-4 pt-2 pb-1"
            placeholder="Начните вводить текст"
            maxLength={500}
            spellCheck="false"
            ref={textareaRef}
          />
          <div className={`flex flex-row  items-center p-2  justify-between`}>
            <div className="text-[20px] flex flex-row self-start ml-2">
              <div
                className={`text-[20px]  self-end ${
                  currentLength == 500 ? "text-[#c74747]" : "text-[#ffffff]"
                }`}
              >
                {currentLength}
              </div>
              <div className="text-[#ffffff]">/500</div>
            </div>
            <div>
              <button className="mr-2 text-[#ffffff]" onClick={getTranslation}>
                Перевести
              </button>
            </div>
          </div>
        </div>
        <div className="bg-[#1e5252] w-full rounded-br-[13px] min-h-[350px] flex flex-col justify-between ">
          <TextareaAutosize
            value={translationValue}
            className="bg-transparent outline-none caret-[#ffffff] text-[24px] text-[#ffffff] w-[90%] resize-none overflow-hidden p-4 pt-2 pb-1"
            placeholder="Здесь будет перевод"
            maxLength={500}
            spellCheck="false"
            disabled
          />
          <div className={`flex flex-row  items-center p-2  justify-start`}>
            <CopyToClipboard
              text={translationValue}
              onCopy={() => timer.current.startCopiedTimer()}
            >
              <div
                className={`flex flex-row justify-start items-center ${
                  !translationValue ? "hidden" : ""
                }`}
              >
                <AiOutlineCopy className=" h-[35px] w-[35px] text-[#ffffff] cursor-pointer"></AiOutlineCopy>
                <div className="ml-2 text-[#ffffff]">
                  {copied ? "Copied!" : ""}
                </div>
              </div>
            </CopyToClipboard>
          </div>
        </div>
      </div>
    </div>
  );
};
