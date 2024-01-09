"use client";

import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { AiOutlineCopy } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import TextareaAutosize from "react-textarea-autosize";

export const Translator = () => {
  const [translatableValue, setTranslatableValue] = useState("");
  const [translationValue, setTranslationValue] = useState("");
  const [currentLength, setCurrentLength] = useState<number>(0);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!translatableValue) {
      clearTextarea();
    }
  }, [translatableValue]);

  const getTranslation = () => {
    if (textareaRef.current.value) {
      axios({
        method: "post",
        url: "http://127.0.0.1:5001/ai-predict",
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
  };

  const onChangeTextarea = (e: any) => {
    setTranslatableValue(e.target.value);
    setCurrentLength(e.target.value.length);
    timer.current.startTranslationTimer();
  };

  const clearTextarea = () => {
    setCurrentLength(0);
    setTranslatableValue("");
    setTranslationValue("");
  };

  const translateRequest = () => {
    getTranslation();
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

    startTranslationTimer() {
      clearTimeout(this.translationTimer);
      this.translationTimer = setTimeout(() => {
        translateRequest();
      }, 1000);
    }
  }

  let timer = useRef(new dynamicTimer());
  let textareaRef = useRef(null);

  return (
    <div className="flex flex-col justify-center">
      <div className="bg-[#ffffff] w-full h-[66px] rounded-t-[13px] border-b-[1px] border-[#b0f0f4]">
        <div className="flex flex-row justify-center h-full relative border-t-[1px] border-l-[1px] border-r-[1px] border-[#b0f0f4] rounded-t-[13px]">
          <div className="languages w-full h-full flex flex-col justify-center items-center text-[#4680e4] text-[24px]">
            Английский
          </div>
          <div className="languages w-full h-full flex flex-col justify-center items-center text-[#4680e4] text-[24px]">
            Русский
          </div>
        </div>
      </div>
      <div className="flex flex-row justify-center border-l-[1px] border-r-[1px] border-[#b0f0f4] rounded-b-[13px]">
        <div className="bg-[#ffffff] w-full rounded-bl-[13px] min-h-[250px] flex flex-col justify-between relative border-b-[1px] border-[#b0f0f4]">
          {currentLength != 0 ? (
            <RxCross2
              className="text-[#4680e4] absolute top-2 right-2 w-[32px] h-auto cursor-pointer"
              onClick={clearTextarea}
            ></RxCross2>
          ) : (
            ""
          )}
          <TextareaAutosize
            value={translatableValue}
            onChange={onChangeTextarea}
            className="bg-transparent outline-none caret-[#4680e4] text-[24px] text-[#4680e4] w-[90%] resize-none overflow-hidden p-3 pt-1 pb-1"
            placeholder="Начните вводить текст"
            maxLength={500}
            spellCheck="false"
            ref={textareaRef}
          />
          <div className={`flex flex-row  items-center p-2  justify-end`}>
            <div className="text-[20px] flex flex-row self-end ">
              <div
                className={`text-[20px]  self-end ${
                  currentLength == 500 ? "text-[#384447]" : "text-[#4680e4]"
                }`}
              >
                {currentLength}
              </div>
              <div className="text-[#4680e4]">/500</div>
            </div>
          </div>
        </div>
        <div className="bg-[#f5f5f4] w-full rounded-br-[13px] min-h-[250px] flex flex-col justify-between">
          <TextareaAutosize
            value={translationValue}
            className="bg-transparent outline-none caret-[#4680e4] text-[24px] text-[#4680e4] w-[90%] resize-none overflow-hidden p-3 pt-1 pb-1"
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
                <AiOutlineCopy className=" h-[35px] w-[35px] text-[#4680e4] cursor-pointer"></AiOutlineCopy>
                <div className="ml-2 text-[#4680e4]">
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
