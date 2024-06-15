"use client";
import React from "react";
import Head from "next/head";
import Image from "next/image";
import "../../globals.css";
import axios from "axios";
import { useEffect, useState, useRef } from "react";
import { IoMdSettings } from "react-icons/io";
// import * as htmlToImage from "html-to-image";
// import { toPng, toJpeg, toBlob, toPixelData, toSvg } from "html-to-image";

const options = {
  allowTaint: true,
  useCORS: true,
  backgroundColor: "transparent",
  removeContainer: false,
};

export default function Home() {
  const [image, setImage] = useState("");
  const [text, setText] = useState("sample text");
  const [optionsOpen, setOptionsOpen] = useState(false);
  const imageReference = useRef(null);
  const childReference = useRef(null);
  const containerRef = useRef(null);

  const endpoint =
    "https://api.api-ninjas.com/v1/randomimage?category=abstract";

  const handleClick = async (callback) => {
    const pull = async (callback_decorator) => {
      try {
        const response = await axios.get(endpoint, {
          headers: {
            "X-Api-Key": "Your api key here",
            Accept: "image/jpg",
          },
          responseType: "arraybuffer",
        });
        const imageBase64 = Buffer.from(response.data, "binary").toString(
          "base64"
        );
        setImage(`data:image/jpeg;base64,${imageBase64}`);
        callback_decorator();
      } catch (error) {
        console.error(error);
      }
    };

    pull(callback);
  };

  const filteredProperty = (eventObject, lowerBound) => {
    let child = parseInt(eventObject.target.value);
    if (child === NaN || child < 10) {
      child = lowerBound;
    }
    return child;
  };

  const handleLazyCustomization = (...args) => {
    /**
     * @description {lazily handles the customizations made to the image.}
     *
     * args[0] = borderRadius
     * args[1] = currentColor
     * args[2] = opacity
     * args[3] = fontWeight
     */

    if (args[0] !== null) {
      imageReference.current.style.borderRadius = `${args[0]}%`;
      containerRef.current.style.borderRadius = `${args[0]}%`;
    }
    if (args[1] !== null) {
      childReference.current.style.color = `${args[1]}`;
    }
    if (args[2] !== null) {
      imageReference.current.style.opacity = `${args[2]}%`;
    }
    if (args[3] !== null) {
      childReference.current.style.fontWeight = `${args[3]}`;
    }
  };

  useEffect(() => {
    console.log(endpointUrl);
    handleClick(() => {
      setText("Sample text here!");
    });
  }, []);

  const prepareURL = async () => {
    const imageElement = containerRef.current;

    if (!imageElement) return;

    try {
      const html2canvas = await import(
        /* webpackPrefetch: true */ "html2canvas"
      );

      const result = await html2canvas.default(imageElement, options);

      const asURL = result.toDataURL("image/png");
      const anchor = document.createElement("a");
      anchor.href = asURL;
      anchor.download = "preset.png";
      anchor.click();
      anchor.remove();
    } catch (reason) {
      console.log(reason);
    }
  };
  return (
    <>
      <Head>
        <title>Abstract</title>
      </Head>
      <div className="flex flex-col gap-3 mt-6">
        <div className="flex gap-3 justify-center items-center">
          <Image src="/images/header.png" width={50} height={50}></Image>
          <h1 className="text-white text-2xl font-semibold  ">Abstract</h1>
        </div>
        <div class="sm:col-span-2 mt-6 flex flex-col justify-center items-center">
          <div class="mt-2.5">
            <textarea
              name="message"
              id="message"
              rows="4"
              placeholder="Type your text here."
              class="bg-transparent block w-[400px] mx-auto rounded-md border-0 px-3.5 py-2 text-white shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-[#0a21C0] sm:text-sm sm:leading-6"
              onChange={(event) => {
                setText(event.target.value);
              }}
              value={text}
            ></textarea>
          </div>
          <div className="flex gap-2">
            <button
              onClick={prepareURL}
              className="mt-4 px-4 py-2 outline-2 rounded-full bg-transparent outline outline-red text-white "
            >
              Download
            </button>
            <button
              onClick={handleClick}
              className="mt-4 px-4 py-2 rounded-full bg-gradient-to-b from-[#0a21C0] to-[#0b1d92] text-white focus:ring-2 focus:ring-blue-400 hover:shadow-xl transition duration-200"
            >
              Generate
            </button>
            <button
              onClick={() => {
                setOptionsOpen((prevArgument) => !prevArgument);
              }}
              className="mt-4 px-4 py-2 outline-2 rounded-full bg-transparent outline outline-red text-white "
            >
              Options
            </button>
          </div>

          <div
            className={`options mt-14 ${
              optionsOpen === true ? "hidden" : "flex"
            } flex-col gap-4`}
          >
            <h1 className="text-white text-2xl w-fit mx-auto flex gap-2 items-center">
              Options <IoMdSettings />
            </h1>
            <div className="flex gap-1 flex-col items-start">
              <div class="relative mt-2 rounded-md shadow-sm">
                <input
                  type="number"
                  name="border-radius"
                  id="border-radius"
                  class="block w-[300px] bg-transparent text-white rounded-md border-0 py-1.5 pl-4 pr-4  placeholder:text-gray-400 outline outline-white outline-1 ring-white"
                  placeholder="Border Radius (in %), eg: 50%"
                  onChange={(event) => {
                    handleLazyCustomization(
                      filteredProperty(event, 0),
                      null,
                      null,
                      null
                    );
                  }}
                />
              </div>
              <div class="relative mt-4 rounded-md shadow-sm">
                <input
                  type="number"
                  name="background-opacity"
                  id="background-opacity"
                  class="block w-[300px] bg-transparent text-white rounded-md border-0 py-1.5 pl-4 pr-4  placeholder:text-gray-400 outline outline-white outline-1 ring-white"
                  placeholder="Background opacity (0 = not visible)"
                  onChange={(event) => {
                    handleLazyCustomization(
                      null,
                      null,
                      filteredProperty(event, 20),
                      null
                    );
                  }}
                />
              </div>
              <div class="relative mt-4 rounded-md shadow-sm">
                <p className="text-white mb-2">Text color</p>
                <input
                  type="color"
                  name="text-color"
                  id="text-color"
                  class="block w-[300px] bg-transparent text-white rounded-md border-0 py-1.5 pl-4 pr-4  placeholder:text-gray-400 outline outline-white outline-1 ring-white"
                  placeholder="Text color"
                  onChange={(event) => {
                    handleLazyCustomization(
                      null,
                      event.target.value,
                      null,
                      null
                    );
                  }}
                />
              </div>
              <div class="relative mt-4 rounded-md shadow-sm">
                <input
                  type="number"
                  name="text-weight"
                  id="text-weight"
                  class="block w-[300px] bg-transparent text-white rounded-md border-0 py-1.5 pl-4 pr-4  placeholder:text-gray-400 outline outline-white outline-1 ring-white"
                  placeholder="Font weight"
                  onChange={(event) => {
                    handleLazyCustomization(
                      null,
                      null,
                      null,
                      filteredProperty(event, "100")
                    );
                  }}
                />
              </div>
            </div>
          </div>
          <div className="container_ mt-10 " ref={containerRef}>
            {image != "" && (
              <Image
                src={image}
                width={300}
                height={300}
                className={`img_gen`}
                alt=""
                ref={imageReference}
              ></Image>
            )}
            <div className="child text-white" ref={childReference}>
              {text}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
