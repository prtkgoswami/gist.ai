"use client";
import { PlayIcon } from "@heroicons/react/16/solid";
import {
  ExclamationTriangleIcon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import axios, { AxiosResponse } from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { DataContainer } from "./dataContainer";

type FormData = {
  url: string;
};

type AnalysisResponse = {
  title?: string;
  summary?: string;
  metrics?: string;
  references?: string;
  author?: string;
  sentiment?: string;
};

export const ToolPage = (): React.ReactElement => {
  const { register, handleSubmit, reset } = useForm<FormData>();
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | undefined>();
  const [error, setError] = useState<Error | undefined>();
  const [isWarningShown, setWarningShown] = useState(false);

  const handleFormSubmit = async (data: FormData) => {
    setIsLoading(true);
    setResponse(undefined);
    setError(undefined);

    try {
      const response: AxiosResponse = await axios.post("/api/summarize", {
        url: data.url,
      });
      setResponse(response.data.response);
    } catch (error) {
      setError(error as Error);
      console.error(`Error:`, error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleWarningClick = () => {
    setWarningShown(true);
  };

  const handleWarningClose = () => {
    setWarningShown(false);
  };

  return (
    <div className="flex flex-col min-h-screen w-full md:w-4/5 xl:w-2/3 relative p-8 md:p-20 gap-10 md:gap-24">
      {/* Title */}
      <div className="flex flex-col gap-2 text-center">
        <div className="text-4xl md:text-6xl text-zinc-100">GIST.ai</div>
        <div className="text-sm md:text-2xl text-zinc-300">
          Find the Gist any Public Internet Article
        </div>
        <div className="text-sm md:text-lg text-zinc-200 flex flex-col md:flex-row gap-2 md:items-end italic justify-center mt-5 md:mt-0">
          <div className="flex items-end gap-2">
            <div className="">Gist</div>
            <div className="text-zinc-500 text-xs md:text-base">(noun)</div>
          </div>
          <div className="">
            - the substance or essence of a speech or text.
          </div>
        </div>
      </div>

      {/* Query */}
      <div className="flex flex-col gap-4 items-center">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="w-full">
          <div className="flex flex-col lg:flex-row gap-3 w-full md:px-20 items-center md:items-stretch">
            <input
              type="text"
              placeholder="Paste URL Here"
              className="min-w-64 text-base md:text-xl text-zinc-950 px-3 py-2 grow w-full"
              {...register("url", { required: true })}
            />

            <button
              type="submit"
              className="border border-solid px-5 py-2 max-w-44"
            >
              Analyze
            </button>
          </div>
        </form>

        <div
          className="text-xs md:text-sm cursor-pointer"
          onClick={handleWarningClick}
        >
          * Results may not be accurate or what you expect. Click to Learn More.
        </div>
      </div>

      {/* Results */}
      <div className="flex flex-col">
        <div className="flex md:py-5 md:px-2 justify-between border-b border-solid border-zinc-200/40">
          <div className="text-xl md:text-3xl uppercase text-zinc-200">
            Results:
          </div>
        </div>

        <div className="py-5 md:px-5 md:py-10">
          {response ? (
            <div className="flex flex-col gap-8">
              <DataContainer label="title" data={response.title} />
              <DataContainer label="author" data={response.author} />
              <DataContainer label="summary" data={response.summary} />
              <DataContainer label="metrics" data={response.metrics} />
              <DataContainer label="references" data={response.references} />
              <DataContainer label="sentiment" data={response.sentiment} />
            </div>
          ) : (
            <p className="text-center text-base md:text-2xl uppercase text-zinc-200/90 md:text-zinc-200/70">
              {error
                ? "Something went wrong. Please Try Again."
                : "- Search to get Results -"}
            </p>
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="flex w-full justify-center items-center p-5 absolute bottom-0 left-0 text-xs md:text-sm">
        <p>
          Powered by{" "}
          <a
            href="https://huggingface.co/mistralai/Mistral-7B-Instruct-v0.2"
            target="_blank"
            className="underline"
          >
            Mistral AI
          </a>{" "}
          & Made by{" "}
          <a
            href="https://www.pratikgoswami.dev"
            target="_blank"
            className="underline"
          >
            Pratik Goswami
          </a>
        </p>
      </div>

      {isLoading && (
        <div className="absolute w-full h-full top-0 left-0 flex flex-col gap-y-8 justify-center items-center z-50 bg-zinc-900/80">
          <div className="w-16 h-16 rounded-full border-4 border-solid border-zinc-200 border-r-0 animate-spin" />
          <div className="text-4xl text-zinc-200">Loading...</div>
        </div>
      )}

      {isWarningShown && (
        <div className="absolute top-0 left-0 h-full w-full flex justify-center items-start md:items-center">
          <div className="flex flex-col gap-0 md:gap-5 w-full md:w-3/4 xl:w-1/2 text-wrap h-screen md:h-auto md:max-h-1/2 text-sm md:text-base text-zinc-900 bg-zinc-200 md:rounded-xl shadow-xl relative">
            <div className="flex justify-end px-3 py-3 md:px-5 md:py-5">
              <div
                className="flex w-6 h-6 justify-center items-center font-bold text-zinc-900/70 cursor-pointer hover:text-zinc-900/100 transition-colors duration-300"
                onClick={handleWarningClose}
              >
                <XMarkIcon />
              </div>
            </div>
            <div className="flex flex-col px-5 md:px-20 pb-5 md:pb-16 gap-3">
              <div className="flex items-end gap-2 text-3xl">
                <ExclamationTriangleIcon className="size-10" />
                <p>Warning</p>
              </div>
              <div>
                Please note that this service provides summaries and analyses of
                publicly accessible articles based on the URL entered. While
                accuracy and thoroughness are prioritized, the generated content
                may not capture all nuances of the original article and should
                not be considered a substitute for reading the full article.
              </div>
              <div>By using this service, you agree to the following:</div>
              <div className="flex gap-3">
                <div className="font-bold">&gt;</div>
                <div>
                  <strong className="underline font-normal">
                    Copyright Compliance:
                  </strong>{" "}
                  Ensure that you have the right to access and summarize the
                  content of the URL provided. This service is intended for
                  personal use and academic purposes only. Unauthorized use of
                  copyrighted material is strictly prohibited.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold">&gt;</div>
                <div>
                  <strong className="underline font-normal">
                    Content Accuracy:
                  </strong>{" "}
                  The summaries and analyses are generated automatically and may
                  not reflect the most accurate or complete information. Please
                  verify the content independently.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold">&gt;</div>
                <div>
                  <strong className="underline font-normal">
                    No Liability:
                  </strong>{" "}
                  The service is not responsible for any errors or omissions in
                  the content provided or for any actions taken based on the
                  summaries and analyses. Use the information at your own risk.
                </div>
              </div>
              <div className="flex gap-3">
                <div className="font-bold">&gt;</div>
                <div>
                  <strong className="underline font-normal">Privacy:</strong> Be
                  cautious about entering URLs that contain sensitive or private
                  information. URLs or generated summaries are not stored, but
                  the security of third-party content cannot be guaranteed.
                </div>
              </div>
              <div className="text-xl md:text-2xl text-center mt-6">
                Thank you for using this service.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
